import {Injectable} from '@nestjs/common';
import {PrismaService} from '../../prisma/prisma.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {Prisma, User, Bonus} from "@prisma/client";
import {BonusService} from "../bonus/bonus.service";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {
    }

    async create(data: CreateUserDto): Promise<User> {
        const existingUser = await this.prisma.user.findUnique({
            where: {email: data.email},
        });

        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const user = await this.prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
            }
        });

        return user;
    }

    async findOne(id: number): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: {id},
            include: {
                bonus: true,
            }
        });
    }

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany({
            include: {
                bonus: true,
            }
        });
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const bonus = await this.prisma.bonus.findUnique({
            where: { userId: id }
        }) as Bonus | null;

        if (bonus && bonus.id) {
            await this.prisma.bonus.update({
                where: { id: bonus.id },
                data: {
                    points: Number(data.bonusPoints),
                    status: data.bonusStatus,
                }
            });
        }

        return this.prisma.user.update({
            where: {id},
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                email: data.email,
            }
        });
    }

    async remove(id: number): Promise<User> {
        await this.prisma.bonus.deleteMany({
            where: { userId: id }
        });

        return this.prisma.user.delete({
            where: {id},
        });
    }
}
