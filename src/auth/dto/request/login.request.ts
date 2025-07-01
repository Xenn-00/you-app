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
export type LoginDTO = z.infer<typeof LoginSchema>;

export class LoginPayload {
  sub: string;
  email: string;
}
