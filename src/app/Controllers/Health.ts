import { SchemaValidator } from "@/app/Helpers/SchemaValidator";
import { HealthValidator } from "@/app/Validators/HealthValidator";
import { HttpContextContract } from "@/types";

export class Health {
  start({ request, response }: HttpContextContract) {
    const { some } = SchemaValidator.validateSchema(
      HealthValidator.start(),
      request.allParams()
    );

    return response.ok(some);
  }
}
