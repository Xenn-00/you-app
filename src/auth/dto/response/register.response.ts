export class RegisterResponse {
  username: string;
  email: string;
  profile: InitialProfileRegisterResponse;
}

class InitialProfileRegisterResponse {
  bio: string;
  interest: string[];
  profilePictureUrl: string | null;
}
