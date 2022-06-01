import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { httpInterceptor, JwtStrategy } from "./core/core.index";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: "./.env" }),
    UsersModule,
    PassportModule,
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_user_name}:${process.env.DB_pass}@cluster0.utx3d6h.mongodb.net/?retryWrites=true&w=majority`
    ),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_INTERCEPTOR,
      useClass: httpInterceptor,
    },
  ],
})
export class AppModule {}
