/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { getModelToken } from "@nestjs/mongoose";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/user.schema";
import { Profile } from "src/profile/profile.schema";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { RegisterDTO } from "./dto/request/register.request";
import { LoginDTO } from "./dto/request/login.request";
import * as passwordUtil from "src/common/utils/password.util";

describe("AuthService", () => {
  let service: AuthService;

  interface MockUserModel extends jest.Mock {
    findOne: jest.Mock;
    create: jest.Mock;
  }

  const mockUserModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({
      ...data,
      _id: "mocked-user-id",
    }),
  })) as MockUserModel;

  mockUserModel.findOne = jest.fn();
  mockUserModel.create = jest.fn();

  const mockProfileModel = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Profile.name), useValue: mockProfileModel },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user", async () => {
      const dto: RegisterDTO = {
        email: "test@example.com",
        username: "testuser",
        password: "password123",
        confirm_password: "password123",
      };

      const fakeUserId = "fake-user-id";

      mockUserModel.findOne.mockResolvedValue(null);
      jest.spyOn(passwordUtil, "hashPassword").mockResolvedValue("hashedpass");

      const mockSavedUser = {
        _id: fakeUserId,
        email: dto.email,
        username: dto.username,
        save: jest.fn().mockResolvedValue({}),
      };

      mockUserModel.create = jest.fn().mockReturnValue(mockSavedUser);
      mockSavedUser.save.mockResolvedValue(mockSavedUser);

      mockProfileModel.findOne.mockResolvedValue(null);

      const result = await service.register(dto);

      expect(result).toEqual({
        email: dto.email,
        username: dto.username,
        profile: {
          about: {
            displayName: "",
            gender: "",
            birthday: "",
            horoscope: "",
            zodiac: "",
            height: 0,
            weight: 0,
          },
          interests: [],
          profilePictureUrl: null,
        },
      });

      expect(mockUserModel.findOne).toHaveBeenCalledWith({
        $or: [{ email: dto.email }, { username: dto.username }],
      });
    });

    it("should throw ConflictException if email/username exists", async () => {
      const dto: RegisterDTO = {
        email: "existing@example.com",
        username: "existinguser",
        password: "password123",
        confirm_password: "password123",
      };

      mockUserModel.findOne.mockResolvedValue({}); // simulate user exists

      await expect(service.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    it("should return accessToken and user info", async () => {
      const dto: LoginDTO = {
        identifier: "testuser",
        password: "password123",
      };

      const fakeUser = {
        _id: "fake-id",
        email: "test@example.com",
        username: "testuser",
        password: "hashedpass",
        profile: {},
      };

      mockUserModel.findOne.mockResolvedValue(fakeUser);
      jest.spyOn(passwordUtil, "verifyPassword").mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue("fake-jwt-token");
      mockProfileModel.findOne.mockResolvedValue(null);

      const result = await service.login(dto);

      expect(result).toEqual({
        accessToken: "fake-jwt-token",
        user: {
          email: fakeUser.email,
          username: fakeUser.username,
          profile: {
            about: {
              displayName: "",
              gender: "",
              birthday: "",
              horoscope: "",
              zodiac: "",
              height: 0,
              weight: 0,
            },
            interests: [],
            profilePictureUrl: null,
          },
        },
      });

      expect(mockUserModel.findOne).toHaveBeenCalled();
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: fakeUser._id,
        email: fakeUser.email,
      });
    });

    it("should throw if user not found", async () => {
      mockUserModel.findOne.mockResolvedValue(null);

      await expect(
        service.login({ identifier: "wrong", password: "123" }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw if password invalid", async () => {
      const fakeUser = {
        email: "a@b.com",
        password: "hashed",
        _id: "fake",
      };

      mockUserModel.findOne.mockResolvedValue(fakeUser);
      jest.spyOn(passwordUtil, "verifyPassword").mockResolvedValue(false);

      await expect(
        service.login({ identifier: "a@b.com", password: "wrongpass" }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
