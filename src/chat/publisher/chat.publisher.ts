import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ChatPublisher {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  async sendMessage(message: any): Promise<void> {
    try {
      await this.amqpConnection.publish(
        "message.exchange",
        "message.received",
        message,
      );
      console.log("Message sent successfully:", message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }
}
