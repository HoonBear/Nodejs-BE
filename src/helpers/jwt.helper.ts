import jwt from "jsonwebtoken";
import { singleton } from "tsyringe";
import { numberOrNull } from "../interfaces/types";
import { User } from "../models/User.model";

export class TokenData {
  userId: number = 0;
  createAt: number = 0;
  expiresIn: number = 0;
  constructor(data: any) {
    if (data) {
      this.userId = Number(data.data.id);
      this.createAt = Number(data.iat);
      this.expiresIn = Number(data.exp);
    }
  }
}
// tslint:disable-next-line: max-classes-per-file
@singleton()
class JWTHelper {
  generateToken = (
    user: User,
    secretSignature,
    tokenLife
  ): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
      const { id, displayName, userEmail } = user;
      const userData = {
        id,
        displayName,
        userEmail,
      };

      jwt.sign(
        { data: userData },
        secretSignature,
        {
          expiresIn: tokenLife,
        },
        (error, token) => {
          if (error) {
            return reject(error);
          }
          resolve(token);
        }
      );
    });
  };

  verifyToken = (token: string, secretKey: string): Promise<TokenData> => {
    return new Promise((resolve) => {
      jwt.verify(token, secretKey, (error: any, decoded) => {
        if (error) {
          throw {
            error_name: error.name,
            error_message: error.message,
            expired_at: error.expiredAt,
          };
        }
        resolve(new TokenData(decoded));
      });
    });
  };
}
export default JWTHelper;
