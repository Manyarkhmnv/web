import {NestFactory} from "@nestjs/core";
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from "path";
import {ValidationPipe} from '@nestjs/common';
import {AppModule} from "./app.module";
import * as expressHbs from 'express-handlebars';
import * as express from 'express';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {RequestTimeInterceptor} from './interceptors/request-time.interceptor';
import methodOverride from 'method-override';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.useGlobalInterceptors(new RequestTimeInterceptor());

    const config = new DocumentBuilder()
        .setTitle('API')
        .setDescription('API для управления сущностями')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useStaticAssets(join(process.cwd(), "public"));
    app.setBaseViewsDir(join(process.cwd(), "views"));
    
    const hbs = expressHbs.create({
        helpers: {
            ifEquals: function (arg1: any, arg2: any, options: any) {
                return arg1 === arg2 ? options.fn(this) : options.inverse(this);
            }
        },
        layoutsDir: join(process.cwd(), "views/layouts"),
        partialsDir: join(process.cwd(), "views/partials"),
        extname: '.hbs'
    });

    app.engine('hbs', hbs.engine);
    app.setViewEngine('hbs');
    app.use(express.urlencoded({ extended: true }));
    
    app.use(methodOverride('_method'));

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
