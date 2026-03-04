import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ResponseMessage } from '../../../common/decorators/response-message.decorator';
import { ResponseInterceptor } from '../../../common/interceptors/response.interceptor';
import { LoginDto } from '../application/dtos/login.dto';
import { LoginResponseDto } from '../application/dtos/login-response.dto';
import { LoginUseCase } from '../application/use-cases/login.use-case';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
@UseInterceptors(ResponseInterceptor)
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

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
}
