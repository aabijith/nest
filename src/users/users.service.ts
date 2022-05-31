import { user, loginUser } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import {
  HttpException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";

import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel("Users") private readonly userModel: Model<user>,
    @InjectModel("Users") private updateUser: Model<UpdateUserDto>,
    private jwtService: JwtService
  ) {}

  async create(createUserDto: user) {
    if (!createUserDto.email) {
      throw new UnprocessableEntityException("Email id is required");
    } else if (!createUserDto.password) {
      throw new UnprocessableEntityException("Password is required");
    } else if (!createUserDto.username) {
      throw new UnprocessableEntityException("User name is required");
    } else {
      const emailExists = await this.findUserByEmail(createUserDto.email);
      if (emailExists) {
        throw new HttpException(
          {
            status: 409,
            message: "Email already exists",
          },
          409
        );
      } else {
        const newUser = new this.userModel(createUserDto);
        const result = await newUser.save();
        if (!result._id) {
          throw new HttpException(
            {
              status: 404,
              message: "User not created",
            },
            404
          );
        } else
          throw new HttpException(
            { status: 200, message: "User registration successful" },
            200
          );
      }
    }
  }

  async login(createUserDto: loginUser): Promise<any> {
    const user: any = await this.findUserByEmail(createUserDto.email);
    if (user && user.password == createUserDto.password) {
      const token = this.jwtService.sign({
        email: user.email,
        username: user.username,
        role: user.role,
      });
      throw new HttpException(
        {
          status: 200,
          message: `Login successful`,
          access_token: token,
        },
        200
      );
    } else if (!user) {
      throw new HttpException(
        {
          status: 400,
          message: "Invalid Email id",
        },
        400
      );
    } else if (user && user.password != createUserDto.password) {
      throw new HttpException(
        {
          status: 401,
          message: "Invalid password",
        },
        401
      );
    }
  }

  async findAll(): Promise<any> {
    const result: Array<any> = await this.userModel.find().exec();
    if (!result || result.length == 0) {
      throw new HttpException(
        {
          status: 204,
          message: "Data not found",
        },
        204
      );
    } else {
      return result.map((obj) => ({
        id: obj.id,
        email: obj.email,
        user_name: obj.username,
      }));
    }
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException(
        {
          status: 204,
          message: "User not found",
        },
        204
      );
    } else {
      return {
        id: user._id,
        email: user.email,
        user_name: user.username,
      };
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updated_user = await this.updateUser.findById(id);
    if (updated_user) {
      if (updateUserDto.email) {
        updated_user.email = updateUserDto.email;
      }
      if (updateUserDto.password) {
        updated_user.password = updateUserDto.password;
      }
      if (updateUserDto.user_name) {
        updated_user.username = updateUserDto.user_name;
      }
      updated_user.save();
    } else {
      throw new HttpException(
        {
          status: 204,
          message: "User not found",
        },
        204
      );
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (user) {
      user.delete();
    } else {
      throw new HttpException(
        {
          status: 200,
          message: "User not found",
        },
        200
      );
    }
  }

  async findUserByEmail(email): Promise<user> {
    return await this.updateUser.findOne({
      email: email,
    });
  }
}
