import { ApiProperty } from "@nestjs/swagger";

export class ViewMessagesResponse {
  @ApiProperty({ default: "6864b8dc8cd6e0dd22fd6016" })
  from: string;
  @ApiProperty({ default: "64f1f0c7b621f45adfde1234" })
  to: string;
  @ApiProperty({ default: "HIRE ME!" })
  content: string;
  @ApiProperty({ default: false })
  isRead: boolean;
  @ApiProperty({ default: "2025-07-02T09:32:55.428Z" })
  timestamp: string;
}
