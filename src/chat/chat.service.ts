import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/user/user.schema";
import { Message } from "./message.schema";
import { ViewMessagesResponse } from "./dto/response/chat.response";
import { ChatPublisher } from "./publisher/chat.publisher";
import { SendMessageDTO } from "./dto/request/chat.request";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private readonly chatPublisher: ChatPublisher,
    private readonly redisService: RedisService,
  ) {}

  async viewMessages(
    currentUserId: string,
    targetUserId: string,
    offset = 0,
    limit = 50,
  ): Promise<ViewMessagesResponse[]> {
    if (currentUserId === targetUserId) {
      throw new BadRequestException("Cannot view messages with yourself");
    }
    if (
      !Types.ObjectId.isValid(currentUserId) ||
      !Types.ObjectId.isValid(targetUserId)
    ) {
      throw new BadRequestException("Invalid user ID");
    }

    const users = await this.userModel.find({
      _id: { $in: [currentUserId, targetUserId] },
    });

    if (users.length !== 2) {
      throw new NotFoundException("One or both users not found");
    }

    const messages = await this.messageModel
      .find({
        $or: [
          { senderId: currentUserId, receiverId: targetUserId },
          { senderId: targetUserId, receiverId: currentUserId },
        ],
      })
      .sort({ timestamp: 1 })
      .skip(offset)
      .limit(limit);

    return messages.map((msg) => ({
      from: msg.senderId.toString(),
      to: msg.receiverId.toString(),
      content: msg.content,
      isRead: msg.isRead,
      timestamp: msg.timestamp.toISOString(),
    }));
  }

  async sendMessage(senderId: string, dto: SendMessageDTO): Promise<void> {
    if (
      !Types.ObjectId.isValid(senderId) ||
      !Types.ObjectId.isValid(dto.receiverId)
    ) {
      throw new BadRequestException("Invalid user ID");
    }

    if (senderId === dto.receiverId) {
      throw new BadRequestException("Cannot send message to yourself");
    }

    const users = await this.userModel.find({
      _id: { $in: [senderId, dto.receiverId] },
    });

    if (users.length !== 2) {
      throw new NotFoundException("Sender or receiver not found");
    }

    const message = new this.messageModel({
      senderId,
      receiverId: dto.receiverId,
      content: dto.content,
      isRead: false,
      timestamp: new Date(),
    });

    await message.save();

    const payload = {
      from: senderId,
      to: dto.receiverId,
      content: dto.content,
      timestamp: message.timestamp.toISOString(),
    };

    await this.chatPublisher.sendMessage(payload);
  }

  async markMessageAsRead(
    currentUserId: string,
    senderId: string,
  ): Promise<number> {
    if (
      !Types.ObjectId.isValid(currentUserId) ||
      !Types.ObjectId.isValid(senderId)
    ) {
      throw new BadRequestException("Invalid user ID");
    }

    const users = await this.userModel.find({
      _id: { $in: [currentUserId, senderId] },
    });

    if (users.length !== 2) {
      throw new NotFoundException("Sender or receiver not found");
    }

    const result = await this.messageModel.updateMany(
      {
        senderId: senderId,
        receiverId: currentUserId,
        isRead: false,
      },
      {
        $set: { isRead: true },
      },
    );

    return result.modifiedCount;
  }

  async markUserAsHasUnread(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }

    await this.redisService.setUnread(userId);
  }

  async clearUserUnreadStatus(userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException("Invalid user ID");
    }

    await this.redisService.clearUnread(userId);
  }
}
