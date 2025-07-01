import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO, RegisterSchema } from "./dto/request/register.request";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { WebResponse } from "src/common/web.response";
import { RegisterResponse } from "./dto/response/register.response";
import { LoginDTO, LoginSchema } from "./dto/request/login.request";
import { LoginResponse } from "./dto/response/login.response";

@Controller("/api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  async register(
    @Body(new ZodValidationPipe<RegisterDTO>(RegisterSchema))
    body: RegisterDTO,
  ): Promise<WebResponse<RegisterResponse>> {
    const response = await this.authService.register(body);

    return {
      data: response,
    };
  }

  @Post("/login")
  async login(
    @Body(new ZodValidationPipe<LoginDTO>(LoginSchema))
    body: LoginDTO,
  ): Promise<WebResponse<LoginResponse>> {
    const response = await this.authService.login(body);

    return {
      data: response,
    };
  }
}
