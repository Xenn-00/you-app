import { Module } from "@nestjs/common";
import { RabbitModule } from "src/rabbitmq/rabbitmq.module";
import { ChatListener } from "./chat.listener";
import { NotifierService } from "./notifier.service";
import { ChatModule } from "../chat.module";

@Module({
  imports: [RabbitModule, ChatModule],
  providers: [ChatListener, NotifierService],
})
export class ChatListenerModule {}
