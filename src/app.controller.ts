import { Controller, Get, Render, Query } from "@nestjs/common";
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render("index")
  getIndex() {
    return {
      view: 'index',
      title: 'MusicHall - Главная',
      locals: {}
    };
  }

  @Get("/catalog")
  @Render("catalog")
  getCatalogPage(@Query("auth") auth: string) {
    return {
      view: 'catalog',
      title: 'MusicHall - Каталог',
      user: auth === "true" ? { name: "Иван Иванов" } : null,
      locals: {}
    };
  }

  @Get("/comments")
  @Render("comments")
  getCommentsPage(@Query("auth") auth: string) {
    return {
      view: 'comments',
      title: 'MusicHall - Отзывы',
      user: auth === "true" ? { name: "Иван Иванов" } : null,
      locals: {}
    };
  }

  @Get("/contacts")
  @Render("contacts")
  getContactsPage(@Query("auth") auth: string) {
    return {
      view: 'contacts',
      title: 'MusicHall - Контакты',
      user: auth === "true" ? { name: "Иван Иванов" } : null,
      locals: {}
    };
  }

  @Get("/cooperation")
  @Render("cooperation")
  getCooperationPage(@Query("auth") auth: string) {
    return {
      view: 'cooperation',
      title: 'MusicHall - Сотрудничество',
      user: auth === "true" ? { name: "Иван Иванов" } : null,
      locals: {}
    };
  }

  @Get("/bonus")
  @Render("bonus")
  getBonusPage(@Query("auth") auth: string) {
    return {
      view: 'bonus',
      title: 'MusicHall - Бонусы',
      user: auth === "true" ? { name: "Иван Иванов" } : null,
      locals: {}
    };
  }

  @Get("/test-form")
  @Render("test-form")
  getTestFormPage(@Query("auth") auth: string) {
    return {
      view: 'test-form',
      title: 'MusicHall - Тестовая форма',
      user: auth === "true" ? { name: "Иван Иванов" } : null,
      locals: {}
    };
  }
}
