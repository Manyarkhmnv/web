import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  NotFoundException,
  Redirect,
  Res
} from '@nestjs/common';
import { BonusService } from './bonus.service';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import {UpdateUserDto} from "../user/dto/update-user.dto";
import {UserService} from "../user/user.service";

@Controller('bonus')
export class BonusController {
  constructor(private readonly bonusService: BonusService,
              private readonly userService: UserService) {}

  @Post()
  create(@Body() dto: CreateBonusDto) {
    return this.bonusService.create(dto);
  }


  @Get()
  findAll() {
    return this.bonusService.findAll();
  }
  @Patch(':id')
  @Redirect('/user/:id')
  async update(@Param('id') id: string, @Body() updateBonusDto: UpdateBonusDto) {
      const bonus = await this.bonusService.findOne(+id);
      if (!bonus) {
          throw new NotFoundException('Бонус не найден');
      }

      await this.bonusService.update(+id, updateBonusDto);

      return { url: `/user/${bonus.userId}` };
  }



  @Get(':id')
  @Redirect('/bonus/:id')
  async findOne(@Param('id') id: string) {
    const bonus = await this.bonusService.findOne(+id);
  }

  @Delete(':id')
  @Redirect('/user/:id')
  async remove(@Param('id') id: string) {
    const bonus = await this.bonusService.findOne(+id)
    if (!bonus) {
      throw new NotFoundException('Бонус не найден')
    }
    await this.bonusService.remove(+id);
    return { url: `/user/${bonus.userId}` };
  }
}
