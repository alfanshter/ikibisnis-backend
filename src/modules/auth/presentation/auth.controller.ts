import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { LoginDto } from '../application/dtos/login.dto';
import { LoginResponseDto } from '../application/dtos/login-response.dto';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import {
  LogoutUseCase,
  LogoutResponseDto,
} from '../application/use-cases/logout.use-case';
import type { JwtPayload } from '../infrastructure/strategies/jwt.strategy';

interface RequestWithUser extends Request {
  user: JwtPayload;
}

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Login berhasil')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @ApiOperation({ summary: 'Login pengguna dengan email & password' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'Email atau password salah' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  async login(@Body() dto: LoginDto): Promise<LoginResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Logout berhasil')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout — cabut JWT token yang sedang aktif',
    description:
      'Token akan dimasukkan ke blacklist hingga expired. ' +
      'Setelah logout, token ini tidak bisa digunakan lagi meskipun belum expired.',
  })
  @ApiResponse({ status: 200, description: 'Logout berhasil' })
  @ApiResponse({
    status: 401,
    description: 'Token tidak valid atau sudah logout',
  })
  async logout(@Request() req: RequestWithUser): Promise<LogoutResponseDto> {
    return this.logoutUseCase.execute(req.user);
  }
}
