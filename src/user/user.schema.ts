import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true })
  password: string;

  @Prop({
    type: {
      bio: { type: String, default: "" },
      interests: { type: [String], default: [] },
      profilePictureUrl: { type: String, default: null },
    },
    default: {},
  })
  profile: {
    bio: string;
    interests: string[];
    profilePictureUrl: string | null;
  };
  @Prop({ default: Date.now })
  createdAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);
