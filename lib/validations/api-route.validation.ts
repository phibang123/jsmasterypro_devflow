import { z } from "zod";

export const UserSchemaAPI = z.object({
  name: z.string().min(1, { message: "Name is required." }),
  username: z
    .string()
    .min(3, { message: "Username must be at lease 3 characters long." }),
  email: z.string().email({ message: "Please provide a valid email address." }),
  bio: z.string().optional(),
  image: z.string().url({ message: "Please provide a valid URL." }).optional(),
  location: z.string().optional(),
  portfolio: z
    .string()
    .url({ message: "Please provide a valid URL." })
    .optional(),
  reputation: z.number().optional(),
});

export const AccountSchemaAPI = z.object({
  userId: z.string().min(1, { message: "User ID is required." }),
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().url({ message: "Please provide a valid URL" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long." })
    .max(100, { message: "Password cannot exceed 100 characters." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Password must contain at least one special character.",
    })
    .optional(),
  provider: z.string().min(1, { message: "Provider is required" }),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
});

export const SignInWithOAuthSchemaAPI = z.object({
  provider: z.enum(["google", "github"]),
  providerAccountId: z
    .string()
    .min(1, { message: "Provider Account ID is required" }),
  user: z.object({
    name: z.string().min(1, { message: "Name is required." }),
    username: z
      .string()
      .min(3, { message: "Username must be at lease 3 characters long." }),
    email: z
      .string()
      .email({ message: "Please provide a valid email address." }),
    image: z
      .string()
      .url({ message: "Please provide a valid URL." })
      .optional(),
  }),
});
