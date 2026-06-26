import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signup(email: string, password: string, role: string) {
    return this.userService.create({
      email,
      password,
      role: role as any,
    });
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('Invalid password');
    }

    const payload = {
      sub : user.id,
      email : user.email,
      role : user.role,
    }

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}