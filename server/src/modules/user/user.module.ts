import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../../shared/repositories';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class UserModule {}
