import { 
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne
 } from 'typeorm';
 
import { DoctorProfile } from '../../doctor/entities/doctor-profile.entity';

export enum UserRole {
  DOCTOR = 'DOCTOR',
  PATIENT = 'PATIENT',
}
import { PatientProfile } from '../../patient/entities/patient-profile.entity';


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @OneToOne(
  () => DoctorProfile,
  (doctorProfile) => doctorProfile.user,
  )
  doctorProfile: DoctorProfile;

  @OneToOne(
  () => PatientProfile,
  (patientProfile) => patientProfile.user,
  )
  patientProfile: PatientProfile;
}