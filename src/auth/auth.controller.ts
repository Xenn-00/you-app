import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDTO, RegisterSchema } from "./dto/request/register.request";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { ApiWebResponse, WebResponse } from "src/common/web.response";
import { RegisterResponse } from "./dto/response/register.response";
import { LoginDTO, LoginSchema } from "./dto/request/login.request";
import { LoginResponse } from "./dto/response/login.response";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("/api")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  @ApiBody({ type: RegisterDTO })
  @ApiWebResponse(RegisterResponse)
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
  @ApiBody({ type: LoginDTO })
  @ApiWebResponse(LoginResponse)
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
