/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Test, TestingModule } from "@nestjs/testing";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import {
  CreateProfileResponse,
  ProfileResponse,
} from "./dto/response/profile.response";
import { CreateProfileDTO } from "./dto/request/create-profile.request";
import { UpdateProfileDTO } from "./dto/request/update-profile.request";

describe("ProfileController", () => {
  let controller: ProfileController;
  let mockProfileService: {
    createProfile: jest.Mock;
    getProfile: jest.Mock;
    updateProfile: jest.Mock;
  };

  beforeEach(async () => {
    mockProfileService = {
      createProfile: jest.fn(),
      getProfile: jest.fn(),
      updateProfile: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: mockProfileService,
        },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  describe("createProfile", () => {
    it("should create a profile and return data", async () => {
      const mockReq = { user: { sub: "user123" } } as any;
      const dto: CreateProfileDTO = {
        displayName: "Test User",
        gender: "Male",
        birthDate: "2000-01-01",
        height: 180,
        weight: 70,
        profileImage: null,
      };

      const mockResponse: CreateProfileResponse = {
        email: "test@example.com",
        username: "testuser",
        profile: {} as ProfileResponse,
      };

      mockProfileService.createProfile.mockResolvedValue(mockResponse);

      const result = await controller.createProfile(mockReq, dto);

      expect(result).toEqual({ data: mockResponse });
      expect(mockProfileService.createProfile).toHaveBeenCalledWith(
        "user123",
        dto,
      );
    });
  });

  describe("getProfile", () => {
    it("should return profile data", async () => {
      const mockReq = { user: { sub: "user123" } } as any;

      const mockResponse: ProfileResponse = {
        userId: "user123",
        displayName: "Test User",
        gender: "Male",
        birthDate: "2000-01-01",
        age: 25,
        height: 180,
        weight: 70,
        zodiac: "Capricorn",
        horoscope: "Aquarius",
        interests: ["Coding", "Gaming"],
        profilePictureUrl: null,
      };

      mockProfileService.getProfile.mockResolvedValue(mockResponse);

      const result = await controller.getProfile(mockReq);

      expect(result).toEqual({ data: mockResponse });
      expect(mockProfileService.getProfile).toHaveBeenCalledWith("user123");
    });
  });

  describe("updateProfile", () => {
    it("should update a profile and return updated data", async () => {
      const mockReq = { user: { sub: "user123" } } as any;
      const dto: UpdateProfileDTO = {
        displayName: "Updated Name",
        height: 185,
        weight: 75,
        profilePictureUrl: "https://example.com/profile.jpg",
        interests: ["Reading"],
      };

      const mockResponse: ProfileResponse = {
        userId: "user123",
        displayName: "Updated Name",
        gender: "Male",
        birthDate: "2000-01-01",
        age: 25,
        height: 185,
        weight: 75,
        zodiac: "Capricorn",
        horoscope: "Aquarius",
        interests: ["Reading"],
        profilePictureUrl: "https://example.com/profile.jpg",
      };

      mockProfileService.updateProfile.mockResolvedValue(mockResponse);

      const result = await controller.updateProfile(mockReq, dto);

      expect(result).toEqual({ data: mockResponse });
      expect(mockProfileService.updateProfile).toHaveBeenCalledWith(
        "user123",
        dto,
      );
    });
  });
});
