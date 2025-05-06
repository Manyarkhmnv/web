// src/product/product.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Render,
  Res,
  HttpException,
  HttpStatus,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto/create-product.dto';
import { UpdateProductDto } from '../product/dto/update-product.dto';
import { Response } from 'express';
import { Multer } from 'multer';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Render('products')
  async findAll() {
    const products = await this.productService.findAll();
    const productsWithUrls = await Promise.all(products.map(async product => {
      let imageUrl = null;
      const imageKey = (product as any).imageKey;
      if (imageKey) {
        imageUrl = await this.productService.storageService.getFileUrl(imageKey);
      }
      return {
        ...product,
        imageUrl
      };
    }));
    
    return {
      title: 'Все товары',
      products: productsWithUrls
    };
  }

  @Get('create')
  @Render('create-product')
  getCreateForm() {
    return {
      title: 'Создать товар'
    };
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    if (file) {
      createProductDto.image = file;
    }
    const product = await this.productService.create(createProductDto);
    return res.redirect(`/product/${product.id}`);
  }

  @Get(':id/edit')
  @Render('edit-product')
  async getEditForm(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    return {
      title: `Редактировать ${product.name}`,
      product,
      layout: 'main'
    };
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }
    if (file) {
      updateProductDto.image = file;
    }
    await this.productService.update(numericId, updateProductDto);
    return res.redirect(`/product/${id}`);
  }

  @Get('image/:imageKey')
  async getImage(@Param('imageKey') imageKey: string, @Res() res: Response) {
    try {
      const url = await this.productService.storageService.getFileUrl(imageKey);
      return res.redirect(url);
    } catch (error) {
      throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
    }
  }

  @Get(':id')
  @Render('product')
  async findOne(@Param('id') id: string) {
    const product = await this.productService.findOne(id);
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    
    let imageUrl = null;
    const imageKey = (product as any).imageKey;
    if (imageKey) {
      imageUrl = await this.productService.storageService.getFileUrl(imageKey);
    }


    return {
      title: product.name,
      product: {
        ...product,
        imageUrl
      }
    };
  }
}
