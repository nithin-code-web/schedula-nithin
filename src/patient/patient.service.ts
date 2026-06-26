import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from './entities/patient-profile.entity';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(PatientProfile)
    private patientRepository: Repository<PatientProfile>,
  ) {}

  async createProfile(data: Partial<PatientProfile>) {
    const existingProfile = await this.patientRepository.findOne({
      where: {
        fullName: data.fullName,
      },
    });

    if (existingProfile) {
      throw new ConflictException(
        'Patient profile already exists',
      );
    }

    const patientProfile =
      this.patientRepository.create(data);

    return this.patientRepository.save(
      patientProfile,
    );
  }

  async getProfile(id: number) {
    const profile = await this.patientRepository.findOne({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(
        'Patient profile not found',
      );
    }

    return profile;
  }

  async updateProfile(
    id: number,
    data: Partial<PatientProfile>,
  ) {
    const profile = await this.patientRepository.findOne({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException(
        'Patient profile not found',
      );
    }

    await this.patientRepository.update(id, data);

    return this.patientRepository.findOne({
      where: { id },
    });
  }
}