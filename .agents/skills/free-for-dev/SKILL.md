---
name: free-for-dev
description: Discover, evaluate, and select zero-cost developer services (SaaS, PaaS, IaaS, databases, hosting, auth, monitoring, CI/CD, APIs) from the free-for-dev catalog (1,370+ tools). Use when architecting on a $0 budget, finding free alternatives to paid cloud services, selecting free database or hosting tiers, or checking free tier limits.
---

# Free-for-Dev Skill

The **Free-for-Dev** skill equips agents and developers with an exhaustive, continuously maintained index of 1,370+ software and infrastructure services with perpetual free developer tiers (not just free trials).

Originating from [ripienaar/free-for-dev](https://github.com/ripienaar/free-for-dev), this skill contains a local indexed database (`data/free-for-dev.json`), an instant CLI search utility (`scripts/search.py`), and proven zero-cost architecture templates.

---

## 🚀 Instant Search Utility

Use the bundled CLI to search services, verify free-tier limits, or find alternatives:

```bash
# Keyword search across all categories
python .agents/skills/free-for-dev/scripts/search.py postgres

# Filter by category
python .agents/skills/free-for-dev/scripts/search.py --category "Managed Data Services" vector

# List all 57 available categories and item counts
python .agents/skills/free-for-dev/scripts/search.py --categories

# Machine-readable output for scripts and subagents
python .agents/skills/free-for-dev/scripts/search.py redis --json --limit 5
```

---

## 🏗️ Battle-Tested $0 / Zero-Cost Architecture Stacks

Combine free-tier services to build resilient, fully operational web applications and backends for $0/month.

### 1. Modern Full-Stack Web App (Next.js / Remix / SvelteKit)
| Component | Recommended Free Service | Free Tier Limits |
|-----------|--------------------------|------------------|
| **Frontend & SSR** | **Vercel** or **Cloudflare Pages** | Unlimited static requests, 100GB bandwidth/mo, global edge network |
| **Relational DB** | **Neon** | 0.5 GB Postgres, branching, autoscales, scale-to-zero compute |
| **Cache & KV** | **Upstash Redis** | 10,000 commands/day, serverless REST API |
| **Object Storage** | **Cloudflare R2** | 10 GB storage, **$0 egress fees**, 1M write / 10M read ops/mo |
| **Auth** | **Clerk** or **Supabase Auth** | 10,000 MAU (Clerk) / 50,000 MAU (Supabase), MFA, OAuth |
| **Email** | **Resend** | 3,000 emails/mo (100 emails/day), custom domain |
| **Monitoring** | **Sentry** | 5,000 errors/mo, 10,000 performance transactions |

### 2. Python / Go / Node API & Microservices
| Component | Recommended Free Service | Free Tier Limits |
|-----------|--------------------------|------------------|
| **App Hosting** | **Render** or **Koyeb** | 750 free instance hours/month, automatic SSL, Git deploys |
| **VPS / Compute** | **Oracle Cloud Always Free** | Up to 4 ARM Ampere cores + 24GB RAM + 200GB block storage |
| **Database** | **Prisma Postgres** or **Aiven** | Prisma: 1.01GB, zero cold starts; Aiven: 1GB RAM, 1 CPU, 1GB disk |
| **Edge SQLite** | **Turso** | 9 GB total storage, 500 databases, sub-millisecond edge reads |
| **Background Jobs** | **Upstash QStash** or **Inngest** | Serverless message queue, retry policies, cron triggers |
| **Secrets Manager** | **Infisical** or **Doppler** | Unlimited secrets, end-to-end encryption, CLI sync |

### 3. AI Agent & Vector RAG Pipeline
| Component | Recommended Free Service | Free Tier Limits |
|-----------|--------------------------|------------------|
| **LLM Inference** | **FreeLLMAPI** / **Groq** | ~7.4B tokens/mo across 34 providers; Groq ultra-low latency Llama 3.3 |
| **Vector DB** | **Qdrant Cloud** or **Pinecone** | Qdrant: 0.5 vCPU, 1GB RAM, 4GB disk; Pinecone: 1 index, 100k vectors |
| **Embeddings** | **Hugging Face Inference API** | Free serverless inference on open-weights embedding models |
| **Workflow Engine** | **Trigger.dev** | Background task orchestration with long-running support |

---

## 📚 Essential Free-Tier Directory by Category

### 1. Compute, PaaS & Major Clouds
* **Oracle Cloud Always Free:** 2 AMD micro VMs + up to 4 ARM Ampere cores (24GB RAM) + 200GB block storage. The most generous compute free tier anywhere.
* **Google Cloud Platform:** 1 `e2-micro` VM in US regions, 30GB HDD, 1GB egress/mo.
* **Cloudflare Workers:** 100,000 requests/day, 10ms CPU time per request, sub-millisecond cold starts across 300+ edge locations.
* **Render:** Free web services with 512MB RAM, automatic HTTPS, and Git integration (spins down after 15 mins of inactivity).
* **Fly.io:** Up to 3 shared-cpu-1x 256MB VMs, 3GB persistent volume storage.

### 2. Databases & Managed Data
* **PostgreSQL:**
  * **Neon:** Serverless Postgres with instant branching, 0.5GB storage, autoscaling up to 2 CUs, scales to zero.
  * **Prisma Postgres:** Postgres 17 on bare metal unikernels with zero cold starts, 1.01GB storage, 50 databases.
  * **Supabase:** 500MB PostgreSQL, built-in vector support (`pgvector`), row-level security.
* **SQLite / Edge SQL:**
  * **Turso:** Powered by libSQL, 9GB storage, 500 databases, edge replication.
* **Key-Value & Redis:**
  * **Upstash Redis:** Serverless Redis with HTTP/REST API, 10k commands/day, persistent storage.
  * **Aiven Valkey/Redis:** 1 CPU, 1GB RAM, open-source Redis compatibility.
* **NoSQL / Document:**
  * **MongoDB Atlas:** M0 Sandbox cluster with 512MB storage, shared RAM, replica set.
* **Vector Databases (AI/RAG):**
  * **Qdrant:** Managed single-node vector cluster, 0.5 vCPU, 1GB RAM, 4GB disk.
  * **Pinecone:** 1 index, up to 100,000 vectors, metadata filtering.

### 3. Object Storage & CDN
* **Cloudflare R2:** 10GB storage/mo, 1M Class A operations, 10M Class B operations. **Zero egress bandwidth fees** (critical for avoiding cloud egress shock).
* **Backblaze B2:** 10GB free storage, S3-compatible, 1GB/day free download bandwidth.
* **Supabase Storage:** 1GB storage, 2GB bandwidth, integrated with database auth policies.

### 4. Auth & Identity
* **Clerk:** 10,000 monthly active users, passwordless login, social OAuth, pre-built UI components.
* **Supabase Auth:** 50,000 monthly active users, magic link, SMS, OAuth, JWTs.
* **Kinde:** 7,500 active users, enterprise SSO, feature flags.
* **Auth0:** 7,500 active users, unlimited logins, passwordless, social identity providers.

### 5. Email & Notifications
* **Resend:** 3,000 emails/month (100/day), React Email support, custom domains, SPF/DKIM verification.
* **Brevo (Sendinblue):** 300 emails/day (~9,000/month), unlimited contacts, transactional & marketing.
* **Novu:** 30,000 notification events/month (In-app, push, email, SMS, chat).

### 6. Observability, Logs & Monitoring
* **Sentry:** 5,000 errors/month, 10,000 transactions, 1GB attachments, source maps support.
* **Better Stack (Uptime):** 10 monitors, 3-minute checks, incident alerting via email/Slack.
* **Axiom:** 0.5 GB log ingestion/month, 30 days retention, fast SQL-like queries.
* **Grafana Cloud:** 10,000 active metrics, 50GB logs, 50GB traces, 3 dashboards.

### 7. CI/CD & Developer Tools
* **GitHub Actions:** 2,000 minutes/month for private repositories; completely free for public repositories.
* **GitLab CI:** 400 compute minutes/month.
* **Tailscale:** Up to 3 users and 100 devices on a private WireGuard mesh network.

---

## ⚠️ Free-Tier Rules of Thumb & Common Traps

1. **Inactivity Sleep / Spin-Down:**
   * Free PaaS services (Render, Glitch) spin down after 15 minutes of inactivity; the next HTTP request takes 30–50 seconds to wake.
   * Supabase free projects pause after 1 week of no API activity. Restore takes 1–2 minutes via dashboard.
   * Neon scales compute to zero in 5 minutes, but serverless wake time is ~500ms (almost transparent to users).
2. **The Cloud Egress Trap:**
   * Traditional hyperscalers (AWS, Azure, GCP) charge high bandwidth fees once you exceed 1–10GB egress.
   * *Mitigation:* Use **Cloudflare R2** or route media traffic through **Cloudflare CDN** for $0 egress.
3. **Credit Card Requirements:**
   * Several platforms offer free tiers without requiring a payment method (e.g., Prisma Postgres, Vercel, Supabase, Qdrant, Render, Upstash).
   * Major clouds (Oracle Cloud, GCP, AWS) require a credit card for identity verification, even for Always-Free tiers.
4. **Single-Node Availability:**
   * Free database tiers are single-node instances without high-availability failover. Ensure daily or weekly automated backups (e.g. via BackupDrill or pg_dump to R2).

---

## 🔄 Syncing with Upstream Catalog

To refresh the catalog with the latest additions from `ripienaar/free-for-dev`:

```bash
python .agents/skills/free-for-dev/scripts/sync.py
```
This updates `data/free-for-dev.json` and `references/README.md` in-place.

