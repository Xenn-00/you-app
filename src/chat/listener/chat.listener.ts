import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";
import { ChatPayload } from "../dto/request/chat.request";
import { NotifierService } from "./notifier.service";
import { ChatGateway } from "../chat.gateway";
import { ChatService } from "../chat.service";

@Injectable()
export class ChatListener {
  constructor(
    private readonly notifierService: NotifierService,
    private readonly chatGateway: ChatGateway,
    private readonly chatService: ChatService,
  ) {}
  private readonly logger = new Logger(ChatListener.name);

  @RabbitSubscribe({
    exchange: "message.exchange",
    routingKey: "message.received",
    queue: "chat.queue",
  })
  public async handleMessage(message: ChatPayload): Promise<void> {
    this.logger.log(
      `📨 Message received from ${message.from} → ${message.to} | "${message.content}"`,
    );

    this.notifierService.notifyUser(message.to, message.content);

    this.logger.log(`[WS] Would emit message to ${message.to}`);

    await this.chatService.markUserAsHasUnread(message.to);

    this.chatGateway.emitMessageToUser(message.to, {
      from: message.from,
      content: message.content,
      timestamp: message.timestamp,
    });
  }
}
