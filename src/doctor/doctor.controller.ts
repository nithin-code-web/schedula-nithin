import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Headers,    
  ForbiddenException
} from '@nestjs/common';

import { DoctorService } from './doctor.service';

import { JwtService } from '@nestjs/jwt';


@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('profile')
  createProfile(
    @Headers('authorization') authHeader: string,
    @Body() body: any) {
    this.verifyDoctor(authHeader);

    return this.doctorService.createProfile(body);
  }

  @Get('profile/:id')
  getProfile(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number) {
    this.verifyDoctor(authHeader);

    return this.doctorService.getProfile(id);
  }

  @Patch('profile/:id')
  updateProfile(
   @Headers('authorization') authHeader: string,
   @Param('id') id: number,
   @Body() body: any,)
   {
    this.verifyDoctor(authHeader);

    return this.doctorService.updateProfile(id, body);
  }

  private verifyDoctor(authHeader: string) {
  const token = authHeader.replace('Bearer ', '');

  const payload = this.jwtService.verify(token, {
    secret: 'my-secret-key',
  });

  if (payload.role !== 'DOCTOR') {
    throw new ForbiddenException(
      'Only doctors can access this API',
    );
  }

  return payload;
 }

}