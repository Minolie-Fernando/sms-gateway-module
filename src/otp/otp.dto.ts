import { UserDto } from "../users/user.dto";

export class OtpDto {
  subject?: string;
  messageBody: string;
  userDetails: UserDto;
}

export class PinDto {
  pin: string;
  pinId: string;
}
