// manzooma_store_v2 — Lesson 67 dataset (Performance Tuning, Security & Backup)

/** Memory tuning parameters for postgresql.conf. */
export const MEMORY_PARAMS = [
  {name: 'shared_buffers', value: '4GB', pct: 25, color: 'blue', desc: '25% of total RAM · shared cache'},
  {name: 'work_mem', value: '64MB', pct: 60, color: 'amber', desc: 'per-sort/hash work_mem'},
  {name: 'maintenance_work_mem', value: '512MB', pct: 75, color: 'purple', desc: 'VACUUM · CREATE INDEX'},
  {name: 'effective_cache_size', value: '12GB', pct: 75, color: 'green', desc: 'planner hint · 75% of RAM'},
];

/** Security roles & permissions. */
export const SECURITY_ROLES = [
  {name: 'readonly_analyst', privileges: 'SELECT', tables: 'all tables in public', color: 'blue', canWrite: false, canAdmin: false},
  {name: 'db_admin', privileges: 'ALL', tables: 'all schemas', color: 'purple', canWrite: true, canAdmin: true},
  {name: 'app_user', privileges: 'SELECT, INSERT, UPDATE', tables: 'store_orders, store_order_items', color: 'amber', canWrite: true, canAdmin: false},
  {name: 'audit_viewer', privileges: 'SELECT (audit_logs)', tables: 'store_audit_logs only', color: 'green', canWrite: false, canAdmin: false},
];

/** Administration commands for Scene 3. */
export const ADMIN_COMMANDS = [
  "-- Step 1: create roles with least privilege",
  "CREATE ROLE readonly_analyst WITH LOGIN PASSWORD 'Sec#2026';",
  "CREATE ROLE db_admin WITH LOGIN PASSWORD 'Adm#2026' SUPERUSER;",
  "",
  "-- Step 2: grant table-level permissions",
  "GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_analyst;",
  "REVOKE DELETE ON store_orders FROM app_user;",
  "",
  "-- Step 3: enable Row-Level Security on sensitive tables",
  "ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;",
  "CREATE POLICY orders_isolation ON store_orders",
  "  USING (customer_id = current_setting('app.user_id')::int);",
  "",
  "-- Step 4: encrypted binary backup",
  "pg_dump -U postgres -F c -b -v -f manzooma_backup.dump manzooma_store_v2",
];

/** Backup & restore commands. */
export const BACKUP_RESTORE = [
  '-- Backup (compressed binary dump)',
  "pg_dump -U postgres -F c -b -v \\",
  "  -f /backups/manzooma_v2_prod.dump \\",
  '  manzooma_store_v2',
  '',
  '-- Restore (instant disaster recovery)',
  'pg_restore -U postgres -d manzooma_store_v2 \\',
  '  -v -j 4 /backups/manzooma_v2_prod.dump',
  '',
  '-- Schedule daily at 02:00 AM via pg_cron',
  "SELECT cron.schedule('nightly_backup', '0 2 * * *',",
  "  $$pg_dump -U postgres -F c -f /backups/manzooma_v2_$(date +%F).dump manzooma_store_v2$$);",
];

/** WAL & pg_hba.conf configuration for Scene 4. */
export const WAL_CONFIG = [
  '-- postgresql.conf · Write-Ahead Logging',
  "wal_level = 'replica'",
  'max_wal_size = 2GB',
  'min_wal_size = 256MB',
  'checkpoint_timeout = 5min',
  "archive_mode = on",
  "archive_command = 'test ! -f /archive/%f && cp %p /archive/%f'",
  '',
  '-- pg_hba.conf · client authentication rules',
  '# TYPE  DATABASE            USER               ADDRESS          METHOD',
  'host    manzooma_store_v2   readonly_analyst   10.0.0.0/8       scram-sha-256',
  'host    manzooma_store_v2   db_admin           10.0.0.0/8       scram-sha-256',
  'host    all                 all                0.0.0.0/0        reject',
];

/** pg_roles system catalog entries. */
export const PG_ROLES_CATALOG = [
  {rolname: 'postgres', rolsuper: true, rolcanlogin: true, color: 'purple'},
  {rolname: 'db_admin', rolsuper: true, rolcanlogin: true, color: 'purple'},
  {rolname: 'readonly_analyst', rolsuper: false, rolcanlogin: true, color: 'blue'},
  {rolname: 'app_user', rolsuper: false, rolcanlogin: true, color: 'amber'},
  {rolname: 'audit_viewer', rolsuper: false, rolcanlogin: true, color: 'green'},
];

/** Enterprise deployment stats for Scene 5. */
export const ENTERPRISE_TUNING = {
  beforeMs: 2400,
  afterMs: 960,
  speedupPct: 60,
  recoverySeconds: 45,
  backupSizeMb: 248,
  encryptedDump: 'manzooma_v2_prod.dump',
  rlsPoliciesActive: 12,
  rolesCount: 5,
};

/** Enterprise tuning code for Scene 5. */
export const ENTERPRISE_TUNING_CODE = [
  '-- Lesson 67 · Enterprise Tuning & Security on manzooma_store_v2',
  '',
  '-- Memory tuning (postgresql.conf)',
  "ALTER SYSTEM SET shared_buffers = '4GB';",
  "ALTER SYSTEM SET work_mem = '64MB';",
  "ALTER SYSTEM SET effective_cache_size = '12GB';",
  "SELECT pg_reload_conf();",
  '',
  '-- Encrypted binary backup export',
  "pg_dump -U admin_user -F c -b -f /backups/manzooma_v2_prod.dump manzooma_store_v2",
  '',
  '-- Result: 60% faster queries · 45s disaster recovery · 100% secured',
];
