import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RabbitService } from "./rabbitmq.service";

@Module({
  imports: [
    ConfigModule,
    RabbitMQModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>("RABBITMQ_URI");
        if (!uri) {
          throw new Error("RABBITMQ_URI environment variable is not set");
        }
        return {
          exchanges: [
            {
              name: "message.exchange",
              type: "topic",
            },
          ],
          uri,
          connectionInitOptions: { wait: true },
        };
      },
    }),
  ],
  providers: [RabbitService],
  exports: [RabbitMQModule, RabbitService],
})
export class RabbitModule {}
