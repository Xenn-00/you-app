import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const SendMessageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1),
});

export class SendMessageDTO extends createZodDto(SendMessageSchema) {
  @ApiProperty({ default: "64f1f0c7b621f45adfde1234" })
  receiverId: string;
  @ApiProperty({ default: "Oh yeahhh!!" })
  content: string;
}
export type SendMessageDTOType = z.infer<typeof SendMessageSchema>;

export type ChatPayload = {
  from: string;
  to: string;
  content: string;
  timestamp: string;
};
