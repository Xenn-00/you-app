import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const RegisterSchema = z
  .object({
    email: z.string().email(),
    username: z.string().min(1).max(100),
    password: z.string().min(8).max(150),
    confirm_password: z.string().min(8).max(150),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export class RegisterDTO extends createZodDto(RegisterSchema) {
  @ApiProperty({ default: "bakugou" })
  username: string;
  @ApiProperty({ default: "bakugou@ua.ac.jp" })
  email: string;
  @ApiProperty({ default: "katsuki123" })
  password: string;
  @ApiProperty({ default: "katsuki123" })
  confirm_password: string;
}
export type RegisterDTOType = z.infer<typeof RegisterSchema>;
