import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class Message extends Document {
  @Prop({ required: true, ref: "User" })
  senderId: mongoose.Types.ObjectId;

  @Prop({ required: true, ref: "User" })
  receiverId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
