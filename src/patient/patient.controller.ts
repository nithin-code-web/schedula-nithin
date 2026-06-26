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

import { PatientService } from './patient.service';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';


@Controller('patient')
export class PatientController {
    constructor(
        private readonly patientService: PatientService,
        private readonly jwtService: JwtService,
    ) {}

  private verifyPatient(authHeader: string) {
  const token = authHeader.replace('Bearer ', '');

  const payload = this.jwtService.verify(token, {
    secret: 'my-secret-key',
  });

  if (payload.role !== 'PATIENT') {
    throw new ForbiddenException(
      'Only patients can access this API',
    );
  }

  return payload;
}

    @Post('profile')
    createProfile(
        @Headers('authorization') authHeader: string,
        @Body() body: any) {
        this.verifyPatient(authHeader);

        return this.patientService.createProfile(body);
    }

    @Get('profile/:id')
    getProfile(
        @Headers('authorization') authHeader: string,
        @Param('id') id: number) {
        this.verifyPatient(authHeader);

        return this.patientService.getProfile(id);
    }

    @Patch('profile/:id')
    updateProfile(
        @Headers('authorization') authHeader: string,
        @Param('id') id: number,
        @Body() body: any,
    ) {
        this.verifyPatient(authHeader);

        return this.patientService.updateProfile(id, body);
    }
}