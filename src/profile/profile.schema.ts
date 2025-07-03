import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";

@Schema()
export class Profile extends Document {
  @Prop({ required: true, ref: "User", unique: true })
  userId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  displayName: string;

  @Prop({ enum: ["Male", "Female", "Other"], required: true })
  gender: string;

  @Prop({ required: true })
  birthDate: string;

  @Prop()
  horoscope: string;

  @Prop()
  zodiac: string;

  @Prop()
  height: number;

  @Prop()
  weight: number;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop()
  profilePictureUrl?: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
