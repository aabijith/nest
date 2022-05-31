import * as mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

// create-user.dto.ts
export class CreateUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
}
export interface user {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface loginUser {
  email: string;
  password: string;
}
