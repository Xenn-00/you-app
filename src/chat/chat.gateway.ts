import { Logger } from "@nestjs/common";
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);
  private userSocketMap = new Map<string, string>(); // userId -> socketId

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.userSocketMap.set(userId, client.id);
      this.logger.log(`🟢 User ${userId} connected with socket ${client.id}`);
    } else {
      this.logger.warn(`User connected without userId`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.userSocketMap.entries()) {
      if (socketId === client.id) {
        this.userSocketMap.delete(userId);
        this.logger.log(`🔴 User ${userId} disconnected`);
        break;
      }
    }
  }

  emitMessageToUser(userId: string, payload: any) {
    const socketId = this.userSocketMap.get(userId);
    if (socketId) {
      this.server.to(socketId).emit("newMessage", payload);
      this.logger.log(`📤 Sent message to ${userId} via socket`);
    } else {
      this.logger.warn(`🚫 User ${userId} is offline, can't emit socket`);
    }
  }
}
