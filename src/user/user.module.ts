import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BonusModule } from '../bonus/bonus.module';
import { UserApiController } from "./user.api.controller";
import { UserResolver } from './user.resolver';

@Module({
  imports: [BonusModule],
  controllers: [UserController, UserApiController],
  providers: [UserService, UserResolver],
})
export class UserModule {}
