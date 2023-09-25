import { Body, Controller, Post } from "@nestjs/common";
import { UserDto } from "./user.dto";
import { UserService } from "./users.service";
import { User } from "./entity/user.entity";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  
  @Post('create-user')
  async createUser(@Body() userDto: UserDto): Promise<User> {
    return this.userService.create(userDto);
  }
}
