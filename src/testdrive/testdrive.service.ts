import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateTestdriveDto } from "./dto/create-testdrive.dto";
import { UpdateTestdriveDto } from "./dto/update-testdrive.dto";

@Injectable()
export class TestdriveService {
  constructor(private prisma: PrismaService) {}

  async create(createTestdriveDto: CreateTestdriveDto) {
    const { userId, ...rest } = createTestdriveDto;
    const data: any = { ...rest };

    if (userId) {
      data.user = { connect: { id: userId } };
    }

    return this.prisma.testDrive.create({
      data,
    });
  }

  async findAll() {
    return this.prisma.testDrive.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            bonusId: true,
            bonus: true,
          },
        },
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.testDrive.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            bonusId: true,
            bonus: true,
          },
        },
      },
    });
  }

  async update(id: number, updateTestdriveDto: UpdateTestdriveDto) {
    const { userId, ...rest } = updateTestdriveDto;
    const data: any = { ...rest };

    if (userId) {
      data.user = { connect: { id: userId } };
    }

    return this.prisma.testDrive.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            bonusId: true,
            bonus: true,
          },
        },
      },
    });
  }

  async remove(id: number) {
    return this.prisma.testDrive.delete({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            bonusId: true,
            bonus: true,
          },
        },
      },
    });
  }
}
