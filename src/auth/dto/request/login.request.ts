import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const LoginSchema = z
  .object({
    identifier: z.string().min(3),
    password: z.string().min(6),
  })
  .refine(
    (data) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return (
        emailRegex.test(data.identifier) ||
        /^[a-zA-Z0-9_]+$/.test(data.identifier)
      );
    },
    {
      message: "Identifier must be a valid email or username",
      path: ["Identifier"],
    },
  );
// By looking at the design, it looks we can login either with email or username
// So that, I use regex to validate the input, is it email or username
export class LoginDTO extends createZodDto(LoginSchema) {
  @ApiProperty({
    description: "you can give an input either username or email, e.g: bakugou",
    default: "bakugou",
  })
  identifier: string;
  @ApiProperty({ default: "katsuki123" })
  password: string;
}
export type LoginDTOType = z.infer<typeof LoginSchema>;

export class LoginPayload {
  sub: string;
  email: string;
}
