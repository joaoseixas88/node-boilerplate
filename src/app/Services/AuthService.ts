import { AuthTokenCreator } from "@/types";
import { compare } from "bcrypt";

export class AuthService {
  constructor(private readonly authGenerator: AuthTokenCreator) {}
  async signin({ email, password }: { email: string; password: string }) {
		
	}
}
