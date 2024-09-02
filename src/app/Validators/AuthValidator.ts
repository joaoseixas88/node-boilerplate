import { BaseValidator } from "@/types";
import { z } from "zod";

export class AuthValidator extends BaseValidator {
  static authenticate() {
    return z.object({
      email: z.string(),
      password: z.string(),
    });
  }
}
