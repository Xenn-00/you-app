import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Profile, ProfileSchema } from "./profile.schema";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { User, UserSchema } from "src/user/user.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [MongooseModule],
})
export class ProfileModule {}
