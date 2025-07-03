import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.client = new Redis({
      host: this.configService.get<string>("REDIS_HOST", "localhost"),
      port: this.configService.get<number>("REDIS_PORT", 6380),
      password: this.configService.get<string>("REDIS_PASSWORD"),
    });

    this.client.on("connect", () => {
      this.logger.log("✅ Redis connected successfully");
    });

    this.client.on("error", (err) => {
      this.logger.log("❌ Redis failed to connect: ", err);
    });
  }

  async setUnread(userId: string): Promise<void> {
    await this.client.set(`user:${userId}:has_unread`, "1");
  }

  async clearUnread(userId: string): Promise<void> {
    await this.client.del(`user:${userId}:has_unread`);
  }

  async hasUnread(userId: string): Promise<boolean> {
    const value = await this.client.get(`user:${userId}:has_unread`);
    return value === "1";
  }
}
