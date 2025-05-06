import {Injectable} from '@nestjs/common';
import {PrismaService} from "../../prisma/prisma.service";
import {CreateProductDto} from './dto/create-product.dto';
import {UpdateProductDto} from './dto/update-product.dto';
import {Subject} from "rxjs";
import { StorageService } from '../storage/storage.service';
import {Product, Prisma, Review} from '@prisma/client';

@Injectable()
export class ProductService {
    constructor(
        private prisma: PrismaService,
        public storageService: StorageService,
    ) {}

    private productUpdates$ = new Subject<any>();

    get productUpdates() {
        return this.productUpdates$.asObservable();
    }

    async create(createProductDto: CreateProductDto) {
        let imageKey: string | undefined;
        
        if (createProductDto.image) {
            imageKey = await this.storageService.uploadFile(createProductDto.image);
        }

        const { image, ...productData } = createProductDto;
        const product = await this.prisma.product.create({
            data: {
                ...productData,
                imageKey,
            } as Prisma.ProductCreateInput,
        });

        this.productUpdates$.next({type: 'create', product});
        return product;
    }

    async findAll(): Promise<(Product & { reviews: Review[] })[]> {
        return this.prisma.product.findMany({
            include: { reviews: true },
        });
    }

    async findOne(id: string): Promise<(Product & { reviews: Review[] }) | null> {
        const numericId = Number(id);
        if (isNaN(numericId)) return null;

        return this.prisma.product.findUnique({
            where: { id: numericId },
            include: { reviews: true }, // включаем отзывы
        });
    }

    async update(id: number, updateProductDto: UpdateProductDto) {
        let imageKey: string | undefined;
        
        if (updateProductDto.image) {
            imageKey = await this.storageService.uploadFile(updateProductDto.image);
        }

        const { image, ...productData } = updateProductDto;
        const updated = await this.prisma.product.update({
            where: {id},
            data: {
                ...productData,
                imageKey,
            } as Prisma.ProductUpdateInput,
        });

        this.productUpdates$.next({type: 'update', product: updated});
        return updated;
    }

    async remove(id: number) {
        const product = await this.prisma.product.findUnique({
            where: { id }
        }) as (Product & { imageKey: string | null }) | null;

        if (product?.imageKey) {
            await this.storageService.deleteFile(product.imageKey);
        }

        const reviews = await this.prisma.review.findMany({
            where: {
                productId: id,
            },
        });

        for (const review of reviews) {
            await this.prisma.review.delete({
                where: {
                    id: review.id,
                },
            });
        }

        const deleted = await this.prisma.product.delete({ where: { id } });
        this.productUpdates$.next({ type: 'delete', id });

        return deleted;
    }
}