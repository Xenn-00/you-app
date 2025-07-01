import * as argon2 from "argon2";
import * as crypto from "crypto";

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16);
  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 12,
    timeCost: 4,
    parallelism: 2,
    hashLength: 32,
    salt,
  });
}

export async function verifyPassword(
  hash: string,
  plain: string,
): Promise<boolean> {
  return argon2.verify(hash, plain);
}
