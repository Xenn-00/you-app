import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const UpdateProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  height: z.number().min(0).max(300).optional(),
  weight: z.number().min(0).max(500).optional(),
  profilePictureUrl: z.string().url().optional(),
  interests: z.array(z.string().min(1)).optional(),
});

export class UpdateProfileDTO extends createZodDto(UpdateProfileSchema) {
  @ApiProperty({ default: "Bakugou Katsuki" })
  displayName?: string;
  @ApiProperty({ default: 180 })
  height?: number;
  @ApiProperty({ default: 70 })
  weight?: number;
  @ApiProperty({
    type: String,
    nullable: true,
    default: "https://cdn.domain.com/uploads/bakugo-pfp.jpg",
  })
  profilePictureUrl?: string;
  @ApiProperty({ type: Array, default: ["music", "superpower"] })
  interests?: string[];
}
export type UpdateProfileDTOType = z.infer<typeof UpdateProfileSchema>;
