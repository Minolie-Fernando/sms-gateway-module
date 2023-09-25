import { Injectable } from "@nestjs/common";
import { UserDto } from "./user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User } from "./entity/user.entity";
import { Model } from "mongoose";

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async save(userData: UserDto): Promise<UserDto> {
    const newUser = new this.userModel(userData);

    const savedUser = await newUser.save();

    return savedUser;
  }
}
