import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { user, loginUser } from "./dto/create-user.dto";
import { JwtAuthGuard, AdminAuthGuard } from "src/core/core.index";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("/login")
  async login(@Body() loginUserDto: loginUser) {
    const create_user: any = await this.usersService.login(loginUserDto);
    return create_user;
  }

  @Post("/register")
  async create(@Body() createUserDto: user) {
    const create_user: any = await this.usersService.create(createUserDto);
    return create_user;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/list")
  async findAll() {
    const users = await this.usersService.findAll();
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get("/list/:id")
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Patch("/list/:id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard, AdminAuthGuard)
  @Delete("/list/:id")
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
