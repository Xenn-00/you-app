import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { LoginPayload } from "../dto/request/login.request";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AccessJWTStrategy extends PassportStrategy(Strategy, "accessJWT") {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>("JWT_SECRET");
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      algorithms: ["HS256"],
    });
  }

  validate(payload: LoginPayload) {
    return payload;
  }
}
