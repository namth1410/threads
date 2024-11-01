import { Role } from 'src/common/enums/role.enum';
import { UserEntity } from 'src/users/user.entity';

// user-response.dto.ts
export class UserResponseDto {
  id: number;
  username: string;
  email?: string;
  displayId: string;
  role: Role;
  createdAt: Date;

  constructor(user: UserEntity) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.displayId = user.displayId;
    this.role = user.role;
    this.createdAt = user.createdAt;
  }
}
