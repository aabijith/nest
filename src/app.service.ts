import { HttpException, Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello(): string {
    throw new HttpException({ status: 200, message: "Nest connected!" }, 200);
  }
}
