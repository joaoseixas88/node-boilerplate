import { BaseValidator } from "@/types";
import { z } from "zod";

export class HealthValidator extends BaseValidator {
  static start() {
    return z.object({
      some: z.string(),
    });
  }
}
