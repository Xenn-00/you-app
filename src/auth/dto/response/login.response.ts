export class LoginResponse {
  accessToken: string;
  user: User;
}

class User {
  email: string;
  username: string;
  profile: InitialProfileRegisterResponse;
}

class InitialProfileRegisterResponse {
  bio: string;
  interest: string[];
  profilePictureUrl: string | null;
}
