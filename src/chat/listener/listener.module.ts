import { Module } from "@nestjs/common";
import { RabbitModule } from "src/rabbitmq/rabbitmq.module";

@Module({
  imports: [RabbitModule],
})
export class ChatListenerModule {}
