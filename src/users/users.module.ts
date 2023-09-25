import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { UserRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entity/user.entity';

@Module({
    controllers: [UserController],
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
          ]),
    ],
    providers: [UserService, UserRepository],
    exports: [UserService]
})
export class UsersModule {}
