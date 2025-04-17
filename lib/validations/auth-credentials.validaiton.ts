import { z } from "zod";

export const AuthorizeCredentialsSchemaAUTH = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  image: z.string().url(),
});
