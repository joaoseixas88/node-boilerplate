import { HttpContextContract } from "@/types";

export class Health {
  start({ request, response }: HttpContextContract) {
    return response.ok(request.allParams());
  }
}
