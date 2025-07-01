import { z } from "zod";

export const CreateProfileSchema = z.object({
  displayName: z.string().min(1),
  gender: z.enum(["Male", "Female"]),
  birthday: z.string().regex(/^\d{2}-\d{2}-\d{4}$/), // dd-mm-yy
  height: z.number().min(0).max(300),
  weight: z.number().min(0).max(500),
  profileImage: z.string().url().nullable().optional(),
});

export type CreateProfileDTO = z.infer<typeof CreateProfileSchema>;
