import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile]),AuthModule],
  providers: [PatientService],
  controllers: [PatientController]
})
export class PatientModule {}
