import { Injectable, Logger } from "@nestjs/common";
import { RabbitService } from "src/rabbitmq/rabbitmq.service";

@Injectable()
export class ChatPublisher {
  constructor(private readonly rabbitService: RabbitService) {}
  private readonly logger = new Logger();
  async sendMessage(message: any): Promise<void> {
    await this.rabbitService.publishMessage(
      "message.exchange",
      "message.received",
      message,
    );
  }
}
