// bonus.module.ts
import { Module } from '@nestjs/common';
import { BonusService } from './bonus.service';
import { BonusController } from './bonus.controller';
import {UserService} from "../user/user.service";
import {BonusApiController} from "./bonus.api.controller";

@Module({
  providers: [BonusService, UserService],
  exports: [BonusService],
  controllers: [BonusApiController, BonusController]
})
export class BonusModule {}
