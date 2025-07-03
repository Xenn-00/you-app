import { ApiProperty } from "@nestjs/swagger";

class Profile {
  @ApiProperty({ default: "" })
  displayName: string;
  @ApiProperty({ default: "" })
  gender: string;
  @ApiProperty({ default: "" })
  birthday: string;
  @ApiProperty({ default: 0 })
  height: number;
  @ApiProperty({ default: 0 })
  weight: number;
  @ApiProperty({ default: "" })
  zodiac: string;
  @ApiProperty({ default: "" })
  horoscope: string;
}

class InitialProfileRegisterResponse {
  @ApiProperty({ type: Profile })
  about: Profile;
  @ApiProperty({ type: Array, default: [] })
  interests: string[];
  @ApiProperty({ type: String, nullable: true, default: null })
  profilePictureUrl: string | null;
}
class User {
  @ApiProperty({ default: "bakugou@ua.ac.jp" })
  email: string;
  @ApiProperty({ default: "bakugou" })
  username: string;
  @ApiProperty({ type: InitialProfileRegisterResponse })
  profile: InitialProfileRegisterResponse;
}

export class LoginResponse {
  @ApiProperty({ default: "access-jwt-token" })
  accessToken: string;
  @ApiProperty({ type: User })
  user: User;
}
