/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { ChatService } from "./chat.service";
import { getModelToken } from "@nestjs/mongoose";
import { User } from "src/user/user.schema";
import { Message } from "./message.schema";
import { RedisService } from "src/redis/redis.service";
import { ChatPublisher } from "./publisher/chat.publisher";
import { SendMessageDTO } from "./dto/request/chat.request";
import { BadRequestException } from "@nestjs/common";

const mockUserId = "64bfa0b2736a2f0d14e763fa";
const anotherUserId = "64bfa0b2736a2f0d14e763fb";

describe("ChatService", () => {
  let service: ChatService;

  const mockUserModel = {
    find: jest.fn(),
  };

  const mockMessageModel = {
    find: jest.fn(),
    updateMany: jest.fn(),
    save: jest.fn(),
  };

  const mockChatPublisher = {
    sendMessage: jest.fn(),
  };

  const mockRedisService = {
    setUnread: jest.fn(),
    clearUnread: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
        { provide: getModelToken(Message.name), useValue: mockMessageModel },
        { provide: ChatPublisher, useValue: mockChatPublisher },
        { provide: RedisService, useValue: mockRedisService },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    jest.clearAllMocks();
  });

  describe("viewMessages", () => {
    it("should return messages between users", async () => {
      mockUserModel.find.mockResolvedValue([
        { _id: mockUserId },
        { _id: anotherUserId },
      ]);

      mockMessageModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([
          {
            senderId: mockUserId,
            receiverId: anotherUserId,
            content: "Hello",
            isRead: false,
            timestamp: new Date("2023-01-01T00:00:00.000Z"),
          },
        ]),
      });

      const result = await service.viewMessages(mockUserId, anotherUserId);
      expect(result).toEqual([
        {
          from: mockUserId,
          to: anotherUserId,
          content: "Hello",
          isRead: false,
          timestamp: "2023-01-01T00:00:00.000Z",
        },
      ]);
    });

    it("should throw error on same user id", async () => {
      await expect(
        service.viewMessages(mockUserId, mockUserId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("markMessageAsRead", () => {
    it("should mark messages as read", async () => {
      mockUserModel.find.mockResolvedValue([
        { _id: mockUserId },
        { _id: anotherUserId },
      ]);
      mockMessageModel.updateMany.mockResolvedValue({ modifiedCount: 3 });

      const result = await service.markMessageAsRead(mockUserId, anotherUserId);
      expect(result).toBe(3);
    });
  });

  describe("markUserAsHasUnread", () => {
    it("should call redis setUnread", async () => {
      await service.markUserAsHasUnread(mockUserId);
      expect(mockRedisService.setUnread).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("clearUserUnreadStatus", () => {
    it("should call redis clearUnread", async () => {
      await service.clearUserUnreadStatus(mockUserId);
      expect(mockRedisService.clearUnread).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe("sendMessage", () => {
    it("should send a message and call publisher", async () => {
      mockUserModel.find.mockResolvedValue([
        { _id: mockUserId },
        { _id: anotherUserId },
      ]);

      const mockSave = jest.fn().mockResolvedValue(undefined);
      const mockMessageInstance = {
        save: mockSave,
        timestamp: new Date("2023-01-01T00:00:00.000Z"),
      };

      service["messageModel"] = jest
        .fn()
        .mockImplementation(() => mockMessageInstance) as any;

      const dto: SendMessageDTO = {
        receiverId: anotherUserId,
        content: "Hello",
      };

      await service.sendMessage(mockUserId, dto);

      expect(mockSave).toHaveBeenCalled();
      expect(mockChatPublisher.sendMessage).toHaveBeenCalledWith({
        from: mockUserId,
        to: anotherUserId,
        content: "Hello",
        timestamp: "2023-01-01T00:00:00.000Z",
      });
    });
  });
});
