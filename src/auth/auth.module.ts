import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/user/user.schema";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AccessJWTStrategy } from "./strategy/access.strategy";
import { Profile, ProfileSchema } from "src/profile/profile.schema";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>("JWT_SECRET");
        if (!secret) throw new Error("JWT_SECRET is not defined in env");

        const expiresIn = configService.get<string>("JWT_EXPIRY");
        if (!expiresIn) throw new Error("JWT_EXPIRY is not defined in env");

        const options: JwtModuleOptions = {
          secret,
          signOptions: {
            algorithm: "HS256",
            expiresIn,
          },
        };
        return options;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessJWTStrategy],
})
export class AuthModule {}
