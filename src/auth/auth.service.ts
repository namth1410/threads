// auth.service.ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service'; // Service quản lý người dùng
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity } from '../sessions/session.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(SessionEntity)
    private sessionRepository: Repository<SessionEntity>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ username, password: hashedPassword });
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user; // Loại bỏ mật khẩu khỏi kết quả
      return result;
    }
    return null;
  }

  async validateRefreshToken(
    refreshToken: string,
  ): Promise<SessionEntity | null> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
    });
    if (!session) {
      return null;
    }

    try {
      // Kiểm tra refreshToken còn hợp lệ không
      this.jwtService.verify(refreshToken);
      return session;
    } catch (e) {
      return null;
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Thời hạn dài hơn cho refreshToken, ví dụ: 7 ngày
    });

    // Hủy phiên làm việc cũ nếu có
    await this.sessionRepository.delete({ userId: user.id });

    // Tạo phiên làm việc mới
    const session = this.sessionRepository.create({
      userId: user.id,
      token: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // Ví dụ: phiên làm việc sẽ hết hạn sau 1 giờ
    });

    await this.sessionRepository.save(session);

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  async logout(userId: number) {
    return this.sessionRepository.delete({ userId });
  }

  async validateSession(token: string): Promise<any> {
    const session = await this.sessionRepository.findOne({ where: { token } });
    return session ? session.userId : null;
  }
}
