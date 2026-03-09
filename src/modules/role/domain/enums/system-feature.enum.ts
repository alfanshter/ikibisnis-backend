/**
 * All available system features that can be granted to a role.
 * Extend this enum as the system grows.
 *
 * 1. Dashboard
 * 2. User Management — Role & Users
 * 3. Projects
 * 4. Penawaran (Quotation)
 * 5. Hutang & Piutang
 * 6. Laporan — Harian, Neraca, Laba Rugi, Arus Kas
 * 7. Settings
 */
export enum SystemFeature {
  // ── 1. Dashboard ────────────────────────────────────────────────────────────
  DASHBOARD = 'dashboard',

  // ── 2. User Management ──────────────────────────────────────────────────────
  USER_MANAGEMENT_ROLES = 'user_management_roles',
  USER_MANAGEMENT_USERS = 'user_management_users',

  // ── 3. Projects ─────────────────────────────────────────────────────────────
  PROJECTS = 'projects',

  // ── 4. Penawaran (Quotation) ─────────────────────────────────────────────────
  PENAWARAN = 'penawaran',

  // ── 5. Hutang & Piutang ──────────────────────────────────────────────────────
  HUTANG_PIUTANG = 'hutang_piutang',

  // ── 6. Laporan ───────────────────────────────────────────────────────────────
  LAPORAN_HARIAN = 'laporan_harian',
  LAPORAN_NERACA = 'laporan_neraca',
  LAPORAN_LABA_RUGI = 'laporan_laba_rugi',
  LAPORAN_ARUS_KAS = 'laporan_arus_kas',

  // ── 7. Settings ──────────────────────────────────────────────────────────────
  SETTINGS = 'settings',
}
