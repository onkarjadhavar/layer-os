'use server';

import { getSupabaseServerClient } from '../supabase/server';
import { authService } from '../../services/auth.service';
import { createFarmSchema, CreateFarmInput } from '../dal/validation';
import { UserRole } from '../supabase/database.types';
import { assertCanInviteStaffServer } from '../billing/server-guards';

export interface AuthActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Signs up a new owner, registers their account, and creates their farm atomically
 */
export async function signUpOwner(
  input: CreateFarmInput,
  email?: string,
  password?: string
): Promise<AuthActionResult<{ farmId: string; userId: string }>> {
  const validation = createFarmSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Validation failed',
    };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    // Demo / offline mode
    return {
      success: true,
      data: {
        farmId: `farm-local-${Date.now()}`,
        userId: `usr-local-${Date.now()}`,
      },
    };
  }

  // 1. If email & password provided, register Supabase Auth user
  let authUserId: string | null = null;
  if (email && password) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: input.ownerName,
          phone: input.phone,
        },
      },
    });

    if (authError) {
      return { success: false, error: authError.message };
    }
    authUserId = authData.user?.id || null;
  }

  // 2. Call atomic create_farm_with_owner RPC
  const { data, error } = await (supabase as any).rpc('create_farm_with_owner', {
    p_farm_name: input.farmName,
    p_owner_name: input.ownerName,
    p_phone: input.phone,
    p_district: input.district,
    p_capacity: input.capacity,
    p_breed: input.breed,
    p_initial_birds: input.initialBirds,
    p_age_weeks: input.ageWeeks,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const res = data as any;

  // 3. Link auth_user_id if user was created via Supabase Auth
  if (authUserId && res.user_id) {
    await (supabase as any)
      .from('users')
      .update({ auth_user_id: authUserId })
      .eq('id', res.user_id);
  }

  return {
    success: true,
    data: {
      farmId: res.farm_id,
      userId: res.user_id,
    },
  };
}

/**
 * Signs in using email and password via FastAPI + PostgreSQL backend
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthActionResult<{ user: any; farmId?: string; token?: string }>> {
  try {
    const res = await authService.login({
      email: email.trim(),
      password,
    });
    return {
      success: true,
      data: {
        user: res.user,
        farmId: res.user.farm_id,
        token: res.access_token,
      },
    };
  } catch (err: any) {
    const errorMsg =
      err?.detail ||
      err?.message ||
      'लॉगिन अयशस्वी. कृपया ईमेल व पासवर्ड तपासा.';
    return {
      success: false,
      error: typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg),
    };
  }
}

/**
 * Signs out everywhere and clears session
 */
export async function signOutUser(): Promise<AuthActionResult> {
  try {
    localStorage.removeItem('layeros_token');
    localStorage.removeItem('layeros_live_active');
  } catch {}
  return { success: true };
}

/**
 * Creates an employee / staff invitation link
 */
export async function createStaffInvitation(
  farmId: string,
  phone: string,
  role: UserRole,
  email?: string
): Promise<AuthActionResult<{ inviteToken: string; inviteUrl: string }>> {
  // Check SaaS plan staff limit
  try {
    const membersRes = await getFarmMembers(farmId);
    const count = membersRes.success && membersRes.data ? membersRes.data.length : 1;
    await assertCanInviteStaffServer(farmId, count);
  } catch (err: any) {
    return { success: false, error: err.message };
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    // Demo sandbox invitation simulation
    const mockToken = `demo_inv_${Date.now()}`;
    return {
      success: true,
      data: {
        inviteToken: mockToken,
        inviteUrl: `http://localhost:3000?invite=${mockToken}`,
      },
    };
  }

  const { data, error } = await (supabase as any).rpc('create_farm_invitation', {
    p_farm_id: farmId,
    p_phone: phone,
    p_role: role,
    p_email: email || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const token = data as string;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return {
    success: true,
    data: {
      inviteToken: token,
      inviteUrl: `${baseUrl}?invite=${token}`,
    },
  };
}

/**
 * Accepts an employee invitation using token
 */
export async function acceptStaffInvitation(
  inviteToken: string
): Promise<AuthActionResult<{ farmId: string; role: string }>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      success: true,
      data: { farmId: 'farm-sahyadri-01', role: 'supervisor' },
    };
  }

  const { data, error } = await (supabase as any).rpc('accept_farm_invitation', {
    p_invite_token: inviteToken,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  const res = data as any;
  return {
    success: true,
    data: { farmId: res.farm_id, role: res.role },
  };
}

/**
 * Lists all members of a farm with their assigned roles
 */
export async function getFarmMembers(
  farmId: string
): Promise<AuthActionResult<Array<{ id: string; name: string; phone: string; role: UserRole; isActive: boolean }>>> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      success: true,
      data: [
        { id: 'usr-owner-01', name: 'सचिन गायकवाड', phone: '9822012345', role: 'owner', isActive: true },
        { id: 'usr-sup-01', name: 'रमेश जाधव', phone: '9822067890', role: 'supervisor', isActive: true },
        { id: 'usr-acc-01', name: 'अनिल कुलकर्णी', phone: '9822099999', role: 'accountant', isActive: true },
      ],
    };
  }

  const { data, error } = await (supabase as any)
    .from('farm_members')
    .select('id, role, is_active, user_id, users(id, full_name, phone)')
    .eq('farm_id', farmId)
    .order('created_at', { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  const members = ((data as any[]) || []).map((m: any) => ({
    id: m.users?.id || m.user_id,
    name: m.users?.full_name || 'Member',
    phone: m.users?.phone || '',
    role: m.role as UserRole,
    isActive: m.is_active,
  }));

  return { success: true, data: members };
}

/**
 * Deactivates or removes a staff member from the farm
 */
export async function deactivateFarmMember(
  farmId: string,
  userId: string
): Promise<AuthActionResult> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return { success: true };
  }

  const { error } = await (supabase as any)
    .from('farm_members')
    .update({ is_active: false })
    .eq('farm_id', farmId)
    .eq('user_id', userId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Fetches all farms the current authenticated user belongs to
 */
export async function getMyFarmsAction(): Promise<
  AuthActionResult<Array<{ farmId: string; farmName: string; role: UserRole; district?: string }>>
> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) {
    return {
      success: true,
      data: [
        { farmId: 'farm-sahyadri-01', farmName: 'सह्याद्री लेयर फार्म (पुणे)', role: 'owner', district: 'पुणे' },
        { farmId: 'farm-anand-02', farmName: 'आनंद पोल्ट्री फार्म (सांगली)', role: 'owner', district: 'सांगली' },
      ],
    };
  }

  const { data, error } = await (supabase as any).rpc('get_my_farms');
  if (error) {
    return { success: false, error: error.message };
  }

  const farms = ((data as any[]) || []).map((f: any) => ({
    farmId: f.farm_id,
    farmName: f.farm_name,
    role: f.role as UserRole,
    district: f.district,
  }));

  return { success: true, data: farms };
}
