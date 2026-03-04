import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoleModule } from './modules/role/role.module';
import { databaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    // ── Configuration ──────────────────────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig, appConfig],
      cache: true, // cache parsed config for performance
    }),

    // ── PostgreSQL / TypeORM ───────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('database.host'),
        port: config.get<number>('database.port'),
        username: config.get<string>('database.username'),
        password: config.get<string>('database.password'),
        database: config.get<string>('database.database'),
        ssl: config.get<boolean>('database.ssl')
          ? { rejectUnauthorized: false }
          : false,
        // Never use synchronize:true in production — use migrations
        synchronize: config.get<boolean>('database.synchronize') ?? false,
        logging: config.get<boolean>('database.logging') ?? false,
        autoLoadEntities: true, // auto-picks up forFeature() entities
        // Connection pool tuning for high performance
        extra: {
          max: 20, // max pool connections
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        },
      }),
    }),

    // ── Rate Limiting ──────────────────────────────────────────────────────────
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('app.throttleTtl') ?? 60000,
          limit: config.get<number>('app.throttleLimit') ?? 100,
        },
      ],
    }),

    // ── In-Memory Cache (L1) ───────────────────────────────────────────────────
    CacheModule.register({
      isGlobal: true,
      ttl: 60, // seconds
      max: 500, // max cached items
    }),

    // ── Feature Modules ────────────────────────────────────────────────────────
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
