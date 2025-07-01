import { Module } from "@nestjs/common";
import { RabbitModule } from "./rabbitmq/rabbitmq.module";
import { ChatListenerModule } from "./chat/listener/listener.module";
import { ChatPublisherModule } from "./chat/publisher/publisher.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./user/user.module";
import { ProfileModule } from "./profile/profile.module";
import { ChatModule } from "./chat/chat.module";
import { AuthModule } from "./auth/auth.module";
import { ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri:
          configService.get<string>("MONGO_URI") ||
          "mongodb://mongo:27017/youapp",
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,
        },
      ],
    }),
    RabbitModule,
    AuthModule,
    UserModule,
    ProfileModule,
    ChatModule,
    ChatListenerModule,
    ChatPublisherModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
