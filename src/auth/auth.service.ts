import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/user/user.schema";
import { RegisterDTO } from "./dto/request/register.request";
import { hashPassword, verifyPassword } from "src/common/utils/password.util";
import { RegisterResponse } from "./dto/response/register.response";
import { LoginDTO, LoginPayload } from "./dto/request/login.request";
import { LoginResponse } from "./dto/response/login.response";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger();

  async register(data: RegisterDTO): Promise<RegisterResponse> {
    const { email, username, password } = data;

    const existing = await this.userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existing) {
      throw new ConflictException("Email or Username already exists");
    }

    const start = Date.now();
    const hashed = await hashPassword(password);
    this.logger.debug(`Hashing took: ${Date.now() - start} ms`);
    // ⚠️ Heads up: Password hashing is a CPU-bound operation.
    //
    // In Rust (my primary stack), I'd typically handle this by spawning the operation to a dedicated thread
    // via `tokio::task::spawn_blocking`, ensuring non-blocking async performance.
    //
    // Unfortunately, Node.js lacks native support for true multithreaded CPU workloads
    // (unless you explicitly manage Worker Threads, which isn't ergonomic in NestJS).
    //
    // As a compromise, I’ve tuned `memoryCost`, `parallelism`, and `hashLength` in Argon2 to reduce latency.
    // While this improves performance (~<100ms per hash), it does reduce security
    // and opens up potential vulnerabilities to GPU-based brute-force attacks.
    //
    // This is a deliberate trade-off to maintain acceptable UX and response times under this tech stack.

    const user = new this.userModel({
      email,
      username,
      password: hashed,
      profile: {
        about: "",
        interest: [],
        profileImage: null,
      },
    });
    await user.save();

    return {
      email: user.email,
      username: user.username,
      profile: {
        bio: user.profile.bio,
        interest: user.profile.interests,
        profilePictureUrl: user.profile.profilePictureUrl,
      },
    };
  }

  async login(data: LoginDTO): Promise<LoginResponse> {
    const user = await this.userModel.findOne(
      {
        $or: [{ email: data.identifier }, { username: data.identifier }],
      },
      {
        email: 1,
        username: 1,
        password: 1,
        profile: 1,
      },
    );

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const match = await verifyPassword(user.password, data.password); // Also blocking
    if (!match) throw new UnauthorizedException("Invalid credentials");

    const payload: LoginPayload = {
      sub: user._id as string,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);

    return {
      accessToken: token,
      user: {
        email: user.email,
        username: user.username,
        profile: {
          bio: user.profile?.bio ?? "",
          interest: user.profile?.interests ?? [],
          profilePictureUrl: user.profile?.profilePictureUrl ?? null,
        },
      },
    };
  }
}
