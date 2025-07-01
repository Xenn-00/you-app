import { RabbitSubscribe } from "@golevelup/nestjs-rabbitmq";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class ChatListener {
  private readonly logger = new Logger(ChatListener.name);

  @RabbitSubscribe({
    exchange: "message.exchange",
    routingKey: "message.received",
    queue: "chat.queue",
  })
  public handleMessage(message: any): void {
    this.logger.log(`Received message: ${JSON.stringify(message)}`);
  }
}
