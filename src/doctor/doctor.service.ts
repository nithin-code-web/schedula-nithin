import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from './entities/doctor-profile.entity';
import { 
    ConflictException,
    NotFoundException 
} from '@nestjs/common';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(DoctorProfile)
    private doctorRepository: Repository<DoctorProfile>,
  ) {}

  async createProfile(data: Partial<DoctorProfile>) {

  const existingProfile =
    await this.doctorRepository.findOne({
      where: {
        fullName: data.fullName,
      },
    });

  if (existingProfile) {
    throw new ConflictException(
      'Doctor profile already exists',
    );
  }

  const doctorProfile =
    this.doctorRepository.create(data);

  return this.doctorRepository.save(
    doctorProfile,
  );
    }

  async getProfile(id: number) {
  const profile = await this.doctorRepository.findOne({
    where: { id },
  });

  if (!profile) {
    throw new NotFoundException(
      'Doctor profile not found',
    );
  }

  return profile;
}

 async updateProfile(id: number, data: Partial<DoctorProfile>) {
  const profile = await this.doctorRepository.findOne({
    where: { id },
  });
  if (!profile) {
    throw new NotFoundException(
      'Doctor profile not found',
    );
  }
  await this.doctorRepository.update(id, data);
  return this.doctorRepository.findOne({
    where: { id },
  });
 }


 async findAll(
  page = 1,
  limit = 10,
  specialization?: string,
  search?: string,
) {
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  const query = this.doctorRepository.createQueryBuilder('doctor');

  if (specialization) {
    query.andWhere(
      'LOWER(doctor.specialization) = LOWER(:specialization)',
      { specialization },
    );
  }

  if (search) {
    query.andWhere(
      'LOWER(doctor.fullName) LIKE LOWER(:search)',
      { search: `%${search}%` },
    );
  }

  const skip = (page - 1) * limit;

  query.skip(skip).take(limit);

  return query.getMany();
}
}       