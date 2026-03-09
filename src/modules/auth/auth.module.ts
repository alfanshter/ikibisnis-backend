import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

// User module (provides IUserRepository)
import { UserModule } from '../user/user.module';

// Role module (provides IRoleRepository)
import { RoleModule } from '../role/role.module';

// Application
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LogoutUseCase } from './application/use-cases/logout.use-case';

// Infrastructure
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { TokenBlacklistService } from './infrastructure/services/token-blacklist.service';

// Presentation
import { AuthController } from './presentation/auth.controller';

// Common
import { ResponseInterceptor } from '../../common/interceptors/response.interceptor';

@Module({
  imports: [
    UserModule,
    RoleModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('app.jwtSecret') ?? 'changeme',
        signOptions: {
          expiresIn: (config.get<string>('app.jwtExpiresIn') ?? '1d') as '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    LogoutUseCase,
    TokenBlacklistService,
    JwtStrategy,
    Reflector,
    ResponseInterceptor,
  ],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
