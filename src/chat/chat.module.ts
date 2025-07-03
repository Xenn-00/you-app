import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Message, MessageSchema } from "./message.schema";
import { User, UserSchema } from "src/user/user.schema";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ChatPublisher } from "./publisher/chat.publisher";
import { RabbitModule } from "src/rabbitmq/rabbitmq.module";
import { ChatGateway } from "./chat.gateway";
import { RedisModule } from "src/redis/redis.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitModule,
    RedisModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatPublisher, ChatGateway],
  exports: [MongooseModule, ChatGateway, ChatService],
})
export class ChatModule {}
