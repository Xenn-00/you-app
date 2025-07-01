import { Module } from "@nestjs/common";
import { ChatPublisher } from "./chat.publisher";
import { RabbitModule } from "src/rabbitmq/rabbitmq.module";

@Module({
  imports: [RabbitModule],
  providers: [ChatPublisher],
  exports: [ChatPublisher],
})
export class ChatPublisherModule {}
