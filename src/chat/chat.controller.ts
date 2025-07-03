import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ChatService } from "./chat.service";
import { AccessGuard } from "src/auth/guard/access.guard";
import { Request } from "express";
import { ApiWebResponse, WebResponse } from "src/common/web.response";
import { ViewMessagesResponse } from "./dto/response/chat.response";
import { ZodValidationPipe } from "src/common/pipes/zod-validation.pipe";
import { SendMessageDTO, SendMessageSchema } from "./dto/request/chat.request";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Chat")
@Controller("/api")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get("viewMessages")
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiQuery({
    name: "userId",
    required: true,
    type: String,
    description: "Target user ID to fetch messages with",
    example: "64f1f0c7b621f45adfde1234",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "Pagination offset",
    example: 0,
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Pagination limit",
    example: 50,
  })
  @ApiWebResponse(ViewMessagesResponse)
  async viewMessages(
    @Req() req: Request & { user: { sub: string } },
    @Query("userId") targetUserId: string,
    @Query("offset", new ParseIntPipe({ optional: true })) offset?: number,
    @Query("limit", new ParseIntPipe({ optional: true })) limit?: number,
  ): Promise<WebResponse<ViewMessagesResponse[]>> {
    const userId = req.user.sub;
    const response = await this.chatService.viewMessages(
      userId,
      targetUserId,
      offset,
      limit,
    );

    return {
      data: response,
    };
  }

  @Post("sendMessage")
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiBody({ type: SendMessageDTO })
  @ApiOkResponse({
    description: "Message sent successfully",
    schema: {
      type: "object",
      properties: {
        data: { type: "string", example: "Message sent" },
      },
    },
  })
  async sendMessage(
    @Req() req: Request & { user: { sub: string } },
    @Body(new ZodValidationPipe<SendMessageDTO>(SendMessageSchema))
    body: SendMessageDTO,
  ): Promise<WebResponse<string>> {
    const userId = req.user.sub;
    await this.chatService.sendMessage(userId, body);

    return { data: "Message sent" };
  }

  @Patch("markAsRead")
  @UseGuards(AccessGuard)
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        senderId: {
          type: "string",
          example: "6864b8dc8cd6e0dd22fd6016",
        },
      },
      required: ["senderId"],
    },
  })
  @ApiOkResponse({
    description: "Messages marked as read",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "string",
          example: "5 messages marked as read",
        },
      },
    },
  })
  async markAsRead(
    @Req() req: Request & { user: { sub: string } },
    @Body() body: { senderId: string },
  ): Promise<WebResponse<string>> {
    const userId = req.user.sub;
    const modified = await this.chatService.markMessageAsRead(
      userId,
      body.senderId,
    );
    await this.chatService.clearUserUnreadStatus(userId);

    return {
      data: `${modified} messages marked as read`,
    };
  }
}
