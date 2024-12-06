import { HealthValidator } from "@/app/Validators/HealthValidator";
import { HttpContextContract } from "@/types";
import { request } from "http";

export class Health {
  start({ request, response }: HttpContextContract) {
    return response.ok({
      ok: true,
    });
  }
  show({ response, request }: HttpContextContract) {
    return response.ok({ status: true, data: request.allParams() });
  }
}
