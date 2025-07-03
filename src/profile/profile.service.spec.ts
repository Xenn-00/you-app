/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Test, TestingModule } from "@nestjs/testing";
import { ProfileService } from "./profile.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Profile } from "./profile.schema";
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { CreateProfileDTO } from "./dto/request/create-profile.request";
import { UpdateProfileDTO } from "./dto/request/update-profile.request";

// mock utils
jest.mock("src/common/utils/zodiac.util", () => ({
  getZodiacFromBirthday: jest.fn().mockReturnValue("Capricorn"),
}));
jest.mock("src/common/utils/horoscope.util", () => ({
  getHoroscopeFromBirthday: jest.fn().mockReturnValue("Goat"),
}));

describe("ProfileService", () => {
  let service: ProfileService;

  const fakeUserId = "507f1f77bcf86cd799439011";

  const mockUserModel = {
    findById: jest.fn(),
  };

  interface mockProfileModel extends jest.Mock {
    findOne: jest.Mock;
  }

  const mockProfileModel = jest.fn().mockImplementation((data) => ({
    ...data,
    save: jest.fn().mockResolvedValue({
      ...data,
      _id: "mocked-profile-id",
    }),
  })) as mockProfileModel;
  mockProfileModel.findOne = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Profile.name), useValue: mockProfileModel },
      ],
    }).compile();

    service = module.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  describe("createProfile", () => {
    it("should create a profile", async () => {
      const dto: CreateProfileDTO = {
        displayName: "Test User",
        gender: "Male",
        birthDate: "2000-01-01",
        height: 175,
        weight: 65,
        profileImage: null,
      };

      const fakeUser = {
        _id: fakeUserId,
        email: "test@example.com",
        username: "testuser",
      };

      mockUserModel.findById.mockResolvedValue(fakeUser);
      mockProfileModel.findOne.mockResolvedValue(null);

      const result = await service.createProfile(fakeUserId, dto);

      expect(result).toEqual({
        email: fakeUser.email,
        username: fakeUser.username,
        profile: expect.objectContaining({
          displayName: dto.displayName,
          gender: dto.gender,
          birthDate: dto.birthDate,
          zodiac: "Capricorn",
          horoscope: "Goat",
        }),
      });
    });

    it("should throw if userId is invalid", async () => {
      await expect(service.createProfile("invalid", {} as any)).rejects.toThrow(
        BadRequestException,
      );
    });

    it("should throw if user not found", async () => {
      mockUserModel.findById.mockResolvedValue(null);
      await expect(
        service.createProfile(fakeUserId, {} as any),
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw if profile already exists", async () => {
      mockUserModel.findById.mockResolvedValue({ _id: fakeUserId });
      mockProfileModel.findOne.mockResolvedValue({ _id: "existing-profile" });
      await expect(
        service.createProfile(fakeUserId, {} as any),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("getProfile", () => {
    it("should return profile data", async () => {
      const fakeUser = {
        _id: fakeUserId,
      };
      const fakeProfile = {
        displayName: "User",
        gender: "Male",
        birthDate: "2000-01-01",
        height: 170,
        weight: 65,
        zodiac: "Capricorn",
        horoscope: "Goat",
        interests: [],
        profilePictureUrl: null,
      };

      mockUserModel.findById.mockResolvedValue(fakeUser);
      mockProfileModel.findOne.mockResolvedValue(fakeProfile);

      const result = await service.getProfile(fakeUserId);

      expect(result).toMatchObject({
        userId: fakeUserId,
        displayName: fakeProfile.displayName,
        zodiac: "Capricorn",
        horoscope: "Goat",
      });
    });

    it("should throw if profile not found", async () => {
      mockUserModel.findById.mockResolvedValue({ _id: fakeUserId });
      mockProfileModel.findOne.mockResolvedValue(null);
      await expect(service.getProfile(fakeUserId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("updateProfile", () => {
    it("should update profile fields", async () => {
      const dto: UpdateProfileDTO = {
        displayName: "Updated",
        height: 180,
        interests: ["music"],
      };

      const fakeUser = {
        _id: fakeUserId,
      };
      const profileDoc = {
        displayName: "Old",
        gender: "Male",
        birthDate: "2000-01-01",
        height: 170,
        weight: 60,
        zodiac: "Capricorn",
        horoscope: "Goat",
        interests: [],
        profilePictureUrl: null,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUserModel.findById.mockResolvedValue(fakeUser);
      mockProfileModel.findOne.mockResolvedValue(profileDoc);

      const result = await service.updateProfile(fakeUserId, dto);

      expect(result.displayName).toBe("Updated");
      expect(result.height).toBe(180);
      expect(result.interests).toContain("music");
    });

    it("should throw if profile not found", async () => {
      mockUserModel.findById.mockResolvedValue({ _id: fakeUserId });
      mockProfileModel.findOne.mockResolvedValue(null);
      await expect(service.updateProfile(fakeUserId, {})).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
