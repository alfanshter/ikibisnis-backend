/**
 * Seed: Roles + Admin User
 *
 * Run: npm run seed:admin
 *
 * Roles seeded (UUID preserved sesuai data lokal):
 *   • Admin          — eb24c357-2001-46f1-a51f-1ec16523d4de
 *   • Direktur       — 9265b7bd-0056-494d-85ea-9ee3b2d602fe
 *   • Finance Manager— d62ad306-f6a3-42ea-9a94-a339b99a06b8
 *   • Staff          — 15b4c036-f686-44a5-b062-a114c7a751a8
 *
 * Users seeded:
 *   • admin@ikibisnis.com    / Admin@123    (Admin)
 *   • direktur@ikibisnis.com / Direktur@123 (Direktur)
 */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import 'reflect-metadata';
import { config } from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

config(); // load .env

// ── DataSource (standalone, tidak pakai AppModule) ───────────────────────────
const SeedDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_DATABASE ?? 'ikibisnis_db',
  ssl: process.env.DB_SSL === 'true',
  entities: [join(__dirname, '../../modules/**/*.orm-entity{.ts,.js}')],
  synchronize: false,
  logging: false,
});

// ── Data Roles ────────────────────────────────────────────────────────────────
const ROLES = [
  {
    id: 'eb24c357-2001-46f1-a51f-1ec16523d4de',
    name: 'Admin',
    description: 'Administrator dengan akses penuh ke seluruh fitur sistem',
    badge_color: '#65A30D',
    is_active: true,
    permissions: [
      { feature: 'dashboard', actions: ['read'] },
      { feature: 'user_management_roles', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'user_management_users', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'projects', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'penawaran', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'laporan_harian', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'laporan_neraca', actions: ['read'] },
      { feature: 'laporan_laba_rugi', actions: ['read'] },
      { feature: 'laporan_arus_kas', actions: ['read'] },
      { feature: 'settings', actions: ['read', 'write', 'update', 'delete'] },
    ],
  },
  {
    id: '9265b7bd-0056-494d-85ea-9ee3b2d602fe',
    name: 'Direktur',
    description: 'Direktur - Hak akses semuanya',
    badge_color: '#00f900',
    is_active: true,
    permissions: [
      { feature: 'dashboard', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'user_management_roles', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'user_management_users', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'projects', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'penawaran', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'laporan_harian', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'laporan_neraca', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'laporan_laba_rugi', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'laporan_arus_kas', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'settings', actions: ['read', 'write', 'update', 'delete'] },
      { feature: 'hutang_piutang', actions: ['read', 'write', 'update', 'delete'] },
    ],
  },
  {
    id: 'd62ad306-f6a3-42ea-9a94-a339b99a06b8',
    name: 'Finance Manager',
    description: 'Mengelola semua laporan keuangan perusahaan',
    badge_color: '#4F46E5',
    is_active: true,
    permissions: [
      { feature: 'dashboard', actions: ['read'] },
      { feature: 'laporan_harian', actions: ['read', 'write'] },
      { feature: 'laporan_neraca', actions: ['read'] },
      { feature: 'laporan_laba_rugi', actions: ['read'] },
      { feature: 'laporan_arus_kas', actions: ['read'] },
      { feature: 'projects', actions: ['read'] },
      { feature: 'penawaran', actions: ['read'] },
      { feature: 'user_management_users', actions: ['read'] },
    ],
  },
  {
    id: '15b4c036-f686-44a5-b062-a114c7a751a8',
    name: 'Staff',
    description: 'Staff',
    badge_color: '#9333EA',
    is_active: true,
    permissions: [
      { feature: 'dashboard', actions: ['read'] },
      { feature: 'user_management_users', actions: ['read'] },
      { feature: 'user_management_roles', actions: ['read'] },
      { feature: 'projects', actions: ['read', 'write'] },
      { feature: 'penawaran', actions: ['read', 'write'] },
      { feature: 'laporan_neraca', actions: ['read'] },
      { feature: 'laporan_harian', actions: ['read'] },
      { feature: 'laporan_laba_rugi', actions: ['read'] },
      { feature: 'laporan_arus_kas', actions: ['read'] },
      { feature: 'settings', actions: ['read'] },
    ],
  },
];

// ── Data Users ────────────────────────────────────────────────────────────────
const USERS = [
  {
    email: 'admin@ikibisnis.com',
    password: 'Admin@123',
    full_name: 'Super Admin',
    phone: '08123456789',
    address: '-',
    gender: 'male',
    role_name: 'Admin',
  },
  {
    email: 'direktur@ikibisnis.com',
    password: 'Direktur@123',
    full_name: 'Direktur Utama',
    phone: '08234567890',
    address: '-',
    gender: 'male',
    role_name: 'Direktur',
  },
];

// ── Main ──────────────────────────────────────────────────────────────────────
async function seed() {
  await SeedDataSource.initialize();
  console.log('✅ Database connected\n');

  const queryRunner = SeedDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    // ── Step 1: Seed Roles ───────────────────────────────────────────────────
    console.log('📦 Seeding roles...');

    const roleIdMap: Record<string, string> = {};

    for (const role of ROLES) {
      const existing = await queryRunner.query(
        `SELECT id FROM roles WHERE name = $1 LIMIT 1`,
        [role.name],
      );

      if (existing.length > 0) {
        roleIdMap[role.name] = existing[0].id;
        console.log(`  ℹ️  Role "${role.name}" sudah ada (id: ${existing[0].id}), skip`);
        continue;
      }

      const result = await queryRunner.query(
        `INSERT INTO roles (id, name, description, badge_color, is_active, permissions, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6::jsonb, NOW(), NOW())
         RETURNING id`,
        [
          role.id,
          role.name,
          role.description,
          role.badge_color,
          role.is_active,
          JSON.stringify(role.permissions),
        ],
      );

      roleIdMap[role.name] = result[0].id;
      console.log(`  ✅ Role "${role.name}" dibuat (id: ${result[0].id})`);
    }

    // ── Step 2: Seed Users ───────────────────────────────────────────────────
    console.log('\n👤 Seeding users...');

    for (const user of USERS) {
      const existing = await queryRunner.query(
        `SELECT id FROM users WHERE email = $1 LIMIT 1`,
        [user.email],
      );

      if (existing.length > 0) {
        console.log(`  ℹ️  User "${user.email}" sudah ada, skip`);
        continue;
      }

      const roleId = roleIdMap[user.role_name];
      if (!roleId) {
        throw new Error(`Role "${user.role_name}" tidak ditemukan di roleIdMap`);
      }

      const passwordHash = await bcrypt.hash(user.password, 12);
      const userId = crypto.randomUUID();

      const result = await queryRunner.query(
        `INSERT INTO users (
           id, full_name, email, password_hash, phone, address,
           gender, role_id, is_active, created_at, updated_at
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
         RETURNING id`,
        [
          userId,
          user.full_name,
          user.email,
          passwordHash,
          user.phone,
          user.address,
          user.gender,
          roleId,
          true,
        ],
      );

      console.log(`  ✅ User "${user.email}" dibuat (id: ${result[0].id})`);
    }

    await queryRunner.commitTransaction();

    // ── Summary ──────────────────────────────────────────────────────────────
    console.log('\n🎉 Seeding selesai!');
    console.log('════════════════════════════════════════════════');
    console.log('📋 ROLES:');
    for (const r of ROLES) {
      console.log(`   • ${r.name.padEnd(16)} ${r.id}`);
    }
    console.log('────────────────────────────────────────────────');
    console.log('👤 USERS:');
    for (const u of USERS) {
      console.log(`   • ${u.email.padEnd(30)} role: ${u.role_name}`);
      console.log(`     password: ${u.password}`);
    }
    console.log('════════════════════════════════════════════════');
    console.log('⚠️  Ganti password setelah login pertama!');

  } catch (error) {
    await queryRunner.rollbackTransaction();
    console.error('\n❌ Seeding gagal, semua perubahan di-rollback');
    console.error(error);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await SeedDataSource.destroy();
  }
}

void seed();
