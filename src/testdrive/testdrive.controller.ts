import {Controller, Get, Post, Body, Patch, Param, Delete, Res, NotFoundException} from '@nestjs/common';
import { TestdriveService } from './testdrive.service';
import { CreateTestdriveDto } from './dto/create-testdrive.dto';
import { UpdateTestdriveDto } from './dto/update-testdrive.dto';
import { Response } from 'express';

@Controller('testdrive')
export class TestdriveController {
  constructor(private readonly testdriveService: TestdriveService) {}

  @Post()
  async create(@Body() createTestdriveDto: CreateTestdriveDto) {
    return await this.testdriveService.create(createTestdriveDto);
  }

  @Get()
  async findAll() {
    return await this.testdriveService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const testdrive = await this.testdriveService.findOne(+id);
    if (!testdrive) {
      throw new NotFoundException('Testdrive not found');
    }
    return testdrive;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTestdriveDto: UpdateTestdriveDto) {
    return await this.testdriveService.update(+id, updateTestdriveDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.testdriveService.remove(+id);
  }
}

