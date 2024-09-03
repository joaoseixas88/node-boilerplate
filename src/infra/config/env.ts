import { z, ZodError } from "zod";

const envValidator = z.object({
  DATABASE_URL: z.string(),
});

const env = () => {
  try {
    const env = envValidator.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      console.error(issue);
    }
    process.exit(1);
  }
};
const Env = env();

export default Env;
