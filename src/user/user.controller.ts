import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Redirect,
  Render,
  Res
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { BonusService } from '../bonus/bonus.service';
import {Bonus} from "../bonus/entities/bonus.entity";
import {Response} from "express";

@Controller('user')
export class UserController {
  constructor(
      private readonly userService: UserService,
      private readonly bonusService: BonusService,
  ) {}

  @Get()
  @Render('user')
  async findAll() {
    const users = await this.userService.findAll();
    return { users };
  }

  @Get('new')
  @Render('user-new')
  getCreateForm() {
    return {};
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto,
               @Res() res: Response) {
    const user = await this.userService.create(createUserDto);

    if (createUserDto.bonusPoints !== undefined) {
      await this.bonusService.create({
        points: Number(createUserDto.bonusPoints),
        status: createUserDto.bonusStatus || 'bronze',
        userId: user.id
      });
    } else {
      await this.bonusService.create({
        points: 0,
        status: 'bronze',
        userId: user.id,
      });
    }
    return res.redirect(`/user/${user.id}`)
  }

  @Get(':id')
  @Render('user-show')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const bonus: Bonus | null = await this.bonusService.findByUserId(user.id);
    return { user, bonus };
  }

  @Get(':id/edit')
  @Render('user-edit')
  async edit(@Param('id') id: string) {
    const user = await this.userService.findOne(+id);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const bonus = await this.bonusService.findByUserId(user.id);
    if (!bonus) {
      throw new NotFoundException('Бонус для пользователя не найден');
    }

    return { user, bonus };
  }

  @Post(':id')
  @Redirect('/user/:id')
  async update(
      @Param('id') id: string,
      @Body() updateUserDto: UpdateUserDto
  ) {
    const user = await this.userService.update(+id, updateUserDto);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const existingBonus = await this.bonusService.findByUserId(user.id);

    if (!existingBonus) {
      await this.bonusService.create({
        userId: user.id,
        points: 0,
        status: 'bronze',
      });
    }

    return { url: `/user/${user.id}` };
  }

  @Delete(':id')
  @Redirect('/user')
  async remove(@Param('id') id: string) {
    const userId = +id;

    await this.bonusService.removeByUserId(userId);

    return this.userService.remove(userId);
  }

  @Delete('bonus/:id')
  async removeBonus(@Param('id') id: string) {
    return this.bonusService.remove(+id);
  }
}
