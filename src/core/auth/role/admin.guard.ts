import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request.user.role == "admin") {
      return true;
    } else
      throw new HttpException(
        {
          status: 401,
          message: "Invalid user",
        },
        401
      );
  }
}
