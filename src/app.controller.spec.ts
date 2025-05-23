import { Test, TestingModule } from "@nestjs/testing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("AppController", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // describe("root", () => {
  //   it('should return "Hello World!"', () => {
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  //     expect(appController.getHello()).toBe("Hello World!");
  //   });
  // });
});
