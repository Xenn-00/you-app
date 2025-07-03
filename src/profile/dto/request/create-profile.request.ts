import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateProfileSchema = z.object({
  displayName: z.string().min(1),
  gender: z.enum(["Male", "Female"]),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid_date" }), // yyyy-mm-dd
  height: z.number().min(0).max(300),
  weight: z.number().min(0).max(500),
  profileImage: z.string().url().nullable().optional(),
});

export class CreateProfileDTO extends createZodDto(CreateProfileSchema) {
  @ApiProperty({ default: "Bakugou Katsuki" })
  displayName: string;
  @ApiProperty({ default: "Male" })
  gender: "Male" | "Female";
  @ApiProperty({ default: "2002-10-07" })
  birthDate: string;
  @ApiProperty({ default: 180 })
  height: number;
  @ApiProperty({ default: 70 })
  weight: number;
}
export type CreateProfileDTOType = z.infer<typeof CreateProfileSchema>;
