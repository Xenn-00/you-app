/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from "@nestjs/testing";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { ViewMessagesResponse } from "./dto/response/chat.response";
import { SendMessageDTO } from "./dto/request/chat.request";

describe("ChatController", () => {
  let controller: ChatController;
  let chatService: ChatService;

  const mockChatService = {
    viewMessages: jest.fn(),
    sendMessage: jest.fn(),
    markMessageAsRead: jest.fn(),
    clearUserUnreadStatus: jest.fn(),
  };

  const mockReq = {
    user: {
      sub: "mock-user-id",
    },
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
      ],
    }).compile();

    controller = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);

    jest.clearAllMocks();
  });

  describe("viewMessages", () => {
    it("should return messages", async () => {
      const expectedMessages: ViewMessagesResponse[] = [
        {
          from: "user1",
          to: "user2",
          content: "Hello",
          isRead: false,
          timestamp: new Date().toISOString(),
        },
      ];

      mockChatService.viewMessages.mockResolvedValue(expectedMessages);

      const result = await controller.viewMessages(
        mockReq,
        "target-user-id",
        0,
        10,
      );

      expect(result).toEqual({ data: expectedMessages });
      expect(mockChatService.viewMessages).toHaveBeenCalledWith(
        "mock-user-id",
        "target-user-id",
        0,
        10,
      );
    });
  });

  describe("sendMessage", () => {
    it("should call sendMessage and return success", async () => {
      const dto: SendMessageDTO = {
        receiverId: "target-user-id",
        content: "Hello there!",
      };

      mockChatService.sendMessage.mockResolvedValue(undefined);

      const result = await controller.sendMessage(mockReq, dto);

      expect(result).toEqual({ data: "Message sent" });
      expect(mockChatService.sendMessage).toHaveBeenCalledWith(
        "mock-user-id",
        dto,
      );
    });
  });

  describe("markAsRead", () => {
    it("should mark messages as read and clear unread status", async () => {
      mockChatService.markMessageAsRead.mockResolvedValue(3);
      mockChatService.clearUserUnreadStatus.mockResolvedValue(undefined);

      const result = await controller.markAsRead(mockReq, {
        senderId: "sender-id",
      });

      expect(result).toEqual({ data: "3 messages marked as read" });
      expect(mockChatService.markMessageAsRead).toHaveBeenCalledWith(
        "mock-user-id",
        "sender-id",
      );
      expect(mockChatService.clearUserUnreadStatus).toHaveBeenCalledWith(
        "mock-user-id",
      );
    });
  });
});
