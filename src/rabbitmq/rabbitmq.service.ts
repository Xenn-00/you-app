import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";

@Injectable()
export class RabbitService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  private readonly logger = new Logger(RabbitService.name);

  async publishMessage<T>(
    exchange: string,
    routingKey: string,
    payload: T,
  ): Promise<void> {
    try {
      await this.amqpConnection.publish(exchange, routingKey, payload);
      this.logger.log(
        `✅ Message published to "${exchange}" with routing key "${routingKey}"`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to publish message to "${exchange}" -> "${routingKey}"`,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        error.stack || error,
      );

      throw new InternalServerErrorException(
        "RabbitMQ publish failed. Please try again later.",
      );
    }
  }
}
