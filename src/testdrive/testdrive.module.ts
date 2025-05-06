import { Module } from '@nestjs/common';
import { TestdriveService } from './testdrive.service';
import { TestdriveController } from './testdrive.controller';
import { TestdriveApiController } from "./testdrive.api.controller";
import { TestdriveResolver } from './testdrive.resolver';

@Module({
  controllers: [TestdriveController, TestdriveApiController],
  providers: [TestdriveService, TestdriveResolver],
})
export class TestdriveModule {}
