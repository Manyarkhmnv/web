import {Injectable, NotFoundException} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {CreateBonusDto} from './dto/create-bonus.dto';
import {UpdateBonusDto} from './dto/update-bonus.dto';
import {Bonus, Prisma} from "@prisma/client";
import {UserService} from "../user/user.service";

@Injectable()
export class BonusService {
    constructor(private readonly prisma: PrismaService, private readonly userService: UserService) {
    }

    async create(createBonusDto: CreateBonusDto): Promise<Bonus> {
        const pointsNumber = parseInt(createBonusDto.points.toString(), 10);
        const user = await this.userService.findOne(createBonusDto.userId);

        if (!user) {
            throw new NotFoundException(`User ${createBonusDto.userId} not found`);
        }

        return this.prisma.bonus.create({
            data: {
                points: pointsNumber,
                status: createBonusDto.status || 'bronze',
                userId: user.id,
            },
        });
    }

    async update(id: number, updateBonusDto: UpdateBonusDto): Promise<Bonus> {
        return this.prisma.bonus.update({
            where: { id },
            data: {
                points: parseInt(updateBonusDto.points.toString(), 10),
                status: updateBonusDto.status,
            },
        });
    }

    async findByUserId(userId: number): Promise<Bonus | null> {
        return this.prisma.bonus.findFirst({
            where: { userId },
        });
    }

    async findAll(): Promise<Bonus[]> {
        return this.prisma.bonus.findMany({
            include: { user: true }
        });
    }

    async findOne(id: number): Promise<Bonus | null> {
        const bonus = await this.prisma.bonus.findUnique({
            where: { id }
        });
        if (!bonus) throw new NotFoundException('Бонус не найден');
        return bonus;
    }

    async remove(id: number): Promise<Bonus> {
        return this.prisma.bonus.update({
            where: { id },
            data: {
                points: 0,
                status: 'bronze',
            }
        });
    }

    async removeByUserId(userId: number): Promise<void> {
        await this.prisma.bonus.deleteMany({
            where: { userId },
        });
    }

    async findAllPaginated(page: number, limit: number) {
        const [items, total] = await this.prisma.$transaction([
            this.prisma.bonus.findMany({
                skip: (page - 1) * limit,
                take: limit,
                include: { user: true },
            }),
            this.prisma.bonus.count(),
        ]);

        return {
            items,
            total,
        };
    }
}
