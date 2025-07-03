import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { AccessGuard } from "src/auth/guard/access.guard";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import {
  CreateProfileDTO,
  CreateProfileSchema,
} from "./dto/request/create-profile.request";
import { ApiWebResponse, WebResponse } from "src/common/web.response";
import {
  CreateProfileResponse,
  ProfileResponse,
} from "./dto/response/profile.response";
import { ProfileService } from "./profile.service";
import {
  UpdateProfileDTO,
  UpdateProfileSchema,
} from "./dto/request/update-profile.request";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags("Profile")
@Controller("/api")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AccessGuard)
  @Post("createProfile")
  @ApiBearerAuth()
  @ApiBody({ type: CreateProfileDTO })
  @ApiWebResponse(CreateProfileResponse)
  async createProfile(
    @Req() req: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe<CreateProfileDTO>(CreateProfileSchema))
    body: CreateProfileDTO,
  ): Promise<WebResponse<CreateProfileResponse>> {
    const userId = req.user.sub;
    const response = await this.profileService.createProfile(userId, body);

    return {
      data: response,
    };
  }

  @UseGuards(AccessGuard)
  @Get("getProfile")
  @ApiBearerAuth()
  @ApiWebResponse(ProfileResponse)
  async getProfile(
    @Req() req: Request & { user: { sub: string } },
  ): Promise<WebResponse<ProfileResponse>> {
    const userId = req.user.sub;
    const response = await this.profileService.getProfile(userId);

    return {
      data: response,
    };
  }

  @UseGuards(AccessGuard)
  @Patch("updateProfile")
  @ApiBearerAuth()
  @ApiBody({ type: UpdateProfileDTO })
  @ApiWebResponse(ProfileResponse)
  async updateProfile(
    @Req() req: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe<UpdateProfileDTO>(UpdateProfileSchema))
    body: UpdateProfileDTO,
  ): Promise<WebResponse<ProfileResponse>> {
    const userId = req.user.sub;
    const response = await this.profileService.updateProfile(userId, body);

    return {
      data: response,
    };
  }
}
