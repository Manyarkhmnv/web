import {AppController} from "./app.controller";
import {AppService} from "./app.service";
import {ConfigModule} from "@nestjs/config";
import {Module, NestModule, MiddlewareConsumer} from "@nestjs/common";
import {UserModule} from './user/user.module';
import {ReviewModule} from './review/review.module';
import {TestdriveModule} from './testdrive/testdrive.module';
import {ProductModule} from './product/product.module';
import {BonusModule} from './bonus/bonus.module';
import {PrismaModule} from "../prisma/prisma.module";
import {UserController} from "./user/user.controller";
import {BonusController} from "./bonus/bonus.controller";
import {TestdriveController} from "./testdrive/testdrive.controller";
import {ProductController} from "./product/product.controller";
import {ReviewController} from "./review/review.controller";
import {UserService} from "./user/user.service";
import {BonusService} from "./bonus/bonus.service";
import {TestdriveService} from "./testdrive/testdrive.service";
import {ProductService} from "./product/product.service";
import {ReviewService} from "./review/review.service";
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheControlMiddleware } from './common/middleware/cache-control.middleware';
import { StorageModule } from './storage/storage.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        CacheModule.register({
            ttl: 5000,
            max: 100,
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: true,
        }),
        UserModule,
        ReviewModule,
        TestdriveModule,
        ProductModule,
        BonusModule,
        PrismaModule,
        StorageModule,
    ],
    controllers: [AppController, UserController, BonusController, TestdriveController, ProductController, ReviewController],
    providers: [AppService, UserService, BonusService, TestdriveService, ProductService, ReviewService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(CacheControlMiddleware)
            .forRoutes('*');
    }
}
