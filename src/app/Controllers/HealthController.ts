import { HttpContextContract } from "@/types";

export default class HealthController {
  start({ request, response }: HttpContextContract) {
    return response.ok({
      ok: true,
    });
  }
  show({ response, request }: HttpContextContract) {
    return response.ok({ status: true, data: request.allParams() });
  }
}
