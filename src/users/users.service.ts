import { Injectable } from "@nestjs/common";
import { UserDto } from "./user.dto";
import { UserRepository } from "./users.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(userDetails: UserDto): Promise<UserDto> {
    return this.userRepository.save(userDetails);
  }
}
