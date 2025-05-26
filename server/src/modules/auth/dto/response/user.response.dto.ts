import { User } from '@prisma/client';
import { plainToClass, Expose } from 'class-transformer';

export class UserResponseDto implements Omit<User, 'password'> {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  isEmailConfirmed: boolean;

  @Expose()
  companyId: string | null;

  @Expose()
  foto: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt: Date | null;

  static mapFrom(data: User): UserResponseDto {
    return plainToClass(UserResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
