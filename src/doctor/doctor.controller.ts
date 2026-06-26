import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Headers,    
  ForbiddenException,
} from '@nestjs/common';

import { DoctorService } from './doctor.service';

import { JwtService } from '@nestjs/jwt';

import { Query } from '@nestjs/common';


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

  @Get()
findAll(
  @Query('page') page?: number,
  @Query('limit') limit?: number,
  @Query('specialization') specialization?: string,
  @Query('search') search?: string,
) {
  return this.doctorService.findAll(
    Number(page) || 1,
    Number(limit) || 10,
    specialization,
    search,
  );
}

  @Get('profile/:id')
  getProfile(
    @Headers('authorization') authHeader: string,
    @Param('id') id: number) {
    this.verifyDoctor(authHeader);

    return this.doctorService.getProfile(id);
  }
  
  @Get(':id')
getDoctorById(
  @Param('id') id: number,
) {
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