/**
 * LayerOS Platform Admin Bootstrap Script
 * Usage: npx tsx scripts/bootstrap-super-admin.ts
 *
 * Reads ADMIN_BOOTSTRAP_EMAIL from environment variables.
 * Creates or promotes the user to 'super_admin' in platform_admins table.
 * NEVER hardcodes passwords or sensitive tokens.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as readline from 'readline';

function loadEnvFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

async function promptPassword(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('--- LayerOS Platform Super Admin Bootstrap ---');

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL;

  if (!supabaseUrl) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL environment variable is missing.');
    process.exit(1);
  }

  if (!serviceRoleKey) {
    console.warn(
      'Warning: SUPABASE_SERVICE_ROLE_KEY is not defined. In local sandbox mode, admin records can be tested with client auth.'
    );
  }

  const targetEmail = bootstrapEmail || (await promptPassword('Enter Super Admin Email: '));

  if (!targetEmail || !targetEmail.includes('@')) {
    console.error('Invalid email address provided.');
    process.exit(1);
  }

  console.log(`Target Super Admin Email: ${targetEmail}`);

  if (serviceRoleKey) {
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if user already exists in auth.users
    const { data: usersData, error: userError } = await supabase.auth.admin.listUsers();
    if (userError) {
      console.error('Failed to list auth users:', userError.message);
      process.exit(1);
    }

    let existingUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === targetEmail.toLowerCase()
    );

    if (!existingUser) {
      console.log(`User not found in Supabase Auth. Creating account for ${targetEmail}...`);
      const password = await promptPassword('Enter a secure temporary password (min 12 chars): ');
      if (password.length < 12) {
        console.error('Password must be at least 12 characters.');
        process.exit(1);
      }

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: targetEmail,
        password,
        email_confirm: true,
      });

      if (createError || !newUser.user) {
        console.error('Error creating auth user:', createError?.message);
        process.exit(1);
      }

      existingUser = newUser.user;
      console.log(`Successfully created auth user ID: ${existingUser.id}`);
    } else {
      console.log(`Found existing auth user ID: ${existingUser.id}`);
    }

    // Insert or update in platform_admins table
    const { data: adminRecord, error: adminError } = await supabase
      .from('platform_admins')
      .upsert(
        {
          user_id: existingUser.id,
          email: targetEmail,
          role: 'super_admin',
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (adminError) {
      console.error('Failed to register platform admin in database:', adminError.message);
      process.exit(1);
    }

    console.log('SUCCESS: Platform Super Admin configured:');
    console.log(`- ID: ${adminRecord.id}`);
    console.log(`- User ID: ${adminRecord.user_id}`);
    console.log(`- Email: ${adminRecord.email}`);
    console.log(`- Role: ${adminRecord.role}`);
    console.log('- Active: true');
    console.log('\nNext steps:');
    console.log('1. Log in at /admin/login');
    console.log('2. Configure Multi-Factor Authentication (TOTP)');
  } else {
    console.log('\n--- Local Development Note ---');
    console.log(
      `Set ADMIN_BOOTSTRAP_EMAIL=${targetEmail} in .env.local along with SUPABASE_SERVICE_ROLE_KEY to complete production provisioning.`
    );
  }
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
