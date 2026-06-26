import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Get, Headers, ForbiddenException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(
      body.email,
      body.password,
      body.role,
    );
  }

  @Post('login')
login(@Body() body: any) {
  return this.authService.login(
    body.email,
    body.password,
  );
}
@Get('test')
test() {
  return {
    message: 'Protected Route',
  };
}
@Get('doctor/profile')
doctorProfile(
  @Headers('authorization') authHeader: string,
) {
  const token = authHeader.replace('Bearer ', '');

  const payload = this.jwtService.verify(token, {
    secret: 'my-secret-key',
  });

  if (payload.role !== 'DOCTOR') {
    throw new ForbiddenException(
      'Only doctors can access this route',
    );
  }

  return {
    message: 'Doctor Profile Access Granted',
    user: payload,
  };
}

@Get('patient/profile')
patientProfile(
  @Headers('authorization') authHeader: string,
) {
  const token = authHeader.replace('Bearer ', '');

  const payload = this.jwtService.verify(token, {
    secret: 'my-secret-key',
  });

  if (payload.role !== 'PATIENT') {
    throw new ForbiddenException(
      'Only patients can access this route',
    );
  }

  return {
    message: 'Patient Profile Access Granted',
    user: payload,
  };
}

}