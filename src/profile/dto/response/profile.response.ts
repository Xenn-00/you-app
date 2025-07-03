import { ApiProperty } from "@nestjs/swagger";

export class ProfileResponse {
  @ApiProperty({ default: "6864b8dc8cd6e0dd22fd6016" })
  userId: string;
  @ApiProperty({ default: "Bakugou Katsuki" })
  displayName: string;
  @ApiProperty({ default: "Male" })
  gender: string;
  @ApiProperty({ default: "2002-10-07" })
  birthDate: string;
  @ApiProperty({ default: 22 })
  age: number;
  @ApiProperty({ default: 180 })
  height: number;
  @ApiProperty({ default: 70 })
  weight: number;
  @ApiProperty({ default: "Horse" })
  zodiac: string;
  @ApiProperty({ default: "Libra" })
  horoscope: string;
  @ApiProperty({ default: ["music", "superpower"] })
  interests: string[];
  @ApiProperty({ default: "https://cdn.domain.com/uploads/bakugo-pfp.jpg" })
  profilePictureUrl: string | null;
}

export class CreateProfileResponse {
  @ApiProperty({ default: "bakugou" })
  username: string;
  @ApiProperty({ default: "bakugou@ua.ac.jp" })
  email: string;
  @ApiProperty({ type: ProfileResponse })
  profile: ProfileResponse;
}
