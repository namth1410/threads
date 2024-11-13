// jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserEntity } from '../users/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(UserEntity) // Inject repository của UserEntity
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any): Promise<UserEntity | null> {
    // Tìm người dùng dựa trên ID (payload.sub chứa userId)
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      // Nếu không tìm thấy user hoặc tokenVersion không khớp, từ chối truy cập
      return null;
    }
    return user; // Trả về user nếu tìm thấy
  }
}
