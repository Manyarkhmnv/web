import { Prisma } from '@prisma/client';

export class Bonus {
    id: number;
    points: number;
    status: string;
    userId: number;
}
