import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { CreateProfileDTO } from "./dto/request/create-profile.request";
import {
  CreateProfileResponse,
  ProfileResponse,
} from "./dto/response/profile.response";
import { User } from "src/user/user.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { getZodiacFromBirthday } from "src/common/utils/zodiac.util";
import { getHoroscopeFromBirthday } from "src/common/utils/horoscope.util";
import { Profile } from "./profile.schema";
import { UpdateProfileDTO } from "./dto/request/update-profile.request";

dayjs.extend(customParseFormat);
@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Profile.name) private profileModel: Model<Profile>,
  ) {}

  private readonly logger = new Logger();
  async createProfile(
    userId: string,
    dto: CreateProfileDTO,
  ): Promise<CreateProfileResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const existingProfile = await this.profileModel.findOne({
      userId: user._id,
    });
    if (existingProfile) {
      throw new ConflictException("Profile already created");
    }

    const zodiac = getZodiacFromBirthday(dto.birthDate);
    const horoscope = getHoroscopeFromBirthday(dto.birthDate);

    const profile = new this.profileModel({
      userId: user._id,
      displayName: dto.displayName,
      gender: dto.gender,
      birthDate: dto.birthDate,
      horoscope,
      zodiac,
      height: dto.height,
      weight: dto.weight,
      profilePictureUrl: dto.profileImage,
      interests: [],
    });
    await profile.save();

    const age = dayjs().diff(dto.birthDate, "year");

    return {
      email: user.email,
      username: user.username,
      profile: {
        userId: user._id as string,
        displayName: profile.displayName,
        gender: profile.gender,
        birthDate: profile.birthDate,
        age,
        height: profile.height,
        weight: profile.weight,
        zodiac: profile.zodiac,
        horoscope: profile.horoscope,
        interests: profile.interests,
        profilePictureUrl: profile.profilePictureUrl ?? null,
      },
    };
  }

  async getProfile(userId: string): Promise<ProfileResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const profile = await this.profileModel.findOne({
      userId: user._id,
    });

    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    const age = dayjs().diff(profile.birthDate, "year");

    return {
      userId: user._id as string,
      displayName: profile.displayName,
      gender: profile.gender,
      birthDate: profile.birthDate,
      age,
      height: profile.height,
      weight: profile.weight,
      zodiac: profile.zodiac,
      horoscope: profile.horoscope,
      interests: profile.interests,
      profilePictureUrl: profile.profilePictureUrl ?? null,
    };
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDTO,
  ): Promise<ProfileResponse> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException("User not found");

    const profile = await this.profileModel.findOne({ userId: user._id });
    if (!profile) {
      throw new NotFoundException("Profile not found");
    }

    if (dto.displayName !== undefined) {
      profile.displayName = dto.displayName;
    }

    if (dto.height !== undefined) {
      profile.height = dto.height;
    }

    if (dto.weight !== undefined) {
      profile.weight = dto.weight;
    }

    if (dto.profilePictureUrl !== undefined) {
      profile.profilePictureUrl = dto.profilePictureUrl;
    }

    if (dto.interests !== undefined && Array.isArray(dto.interests)) {
      const interestSet = new Set([
        ...(profile.interests ?? []),
        ...dto.interests,
      ]);
      profile.interests = Array.from(interestSet);
    }

    await profile.save();

    const age = dayjs().diff(profile.birthDate, "year");

    return {
      userId: user._id as string,
      displayName: profile.displayName,
      gender: profile.gender,
      birthDate: profile.birthDate,
      age,
      height: profile.height,
      weight: profile.weight,
      zodiac: profile.zodiac,
      horoscope: profile.horoscope,
      interests: profile.interests,
      profilePictureUrl: profile.profilePictureUrl ?? null,
    };
  }
}
