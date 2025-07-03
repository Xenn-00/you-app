/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoginDTO } from "./dto/request/login.request";
import { RegisterDTO } from "./dto/request/register.request";
import { RegisterResponse } from "./dto/response/register.response";
import { LoginResponse } from "./dto/response/login.response";

describe("AuthController", () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("register", () => {
    it("should return WebResponse<RegisterResponse>", async () => {
      const dto: RegisterDTO = {
        email: "test@example.com",
        username: "testuser",
        password: "secure123",
        confirm_password: "secure123",
      };

      const expected: RegisterResponse = {
        username: "fake-username",
        email: "fake-email",
        profile: {
          about: {
            displayName: "fake-displayname",
            gender: "male",
            birthday: "2000-01-01",
            height: 183,
            weight: 70,
            zodiac: "zodiac",
            horoscope: "horoscope",
          },
          interests: [],
          profilePictureUrl: "string",
        },
      };

      mockAuthService.register.mockResolvedValue(expected);

      const res = await controller.register(dto);
      expect(res).toEqual({ data: expected });
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });

  describe("login", () => {
    it("should return WebResponse<LoginResponse>", async () => {
      const dto: LoginDTO = {
        identifier: "test@example.com",
        password: "secure123",
      };

      const expected: LoginResponse = {
        accessToken: "fake.jwt.token",
        user: {
          username: "fake-username",
          email: "fake-email",
          profile: {
            about: {
              displayName: "fake-displayname",
              gender: "male",
              birthday: "2000-01-01",
              height: 183,
              weight: 70,
              zodiac: "zodiac",
              horoscope: "horoscope",
            },
            interests: [],
            profilePictureUrl: "string",
          },
        },
      };

      mockAuthService.login.mockResolvedValue(expected);

      const res = await controller.login(dto);
      expect(res).toEqual({ data: expected });
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });
});
