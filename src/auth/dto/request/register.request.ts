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

export type RegisterDTO = z.infer<typeof RegisterSchema>;
