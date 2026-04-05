import { z } from "zod";

export const registerSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    firstName: z
      .string()
      .min(1, "First name is required"),

    lastName: z
      .string()
      .min(1, "Last name is required")
});

export const loginSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),
});


 // After login – personalization
 export const onboardingSchema = z.object({
    firstName: z.string().min(1).optional(),

    lastName: z.string().min(1).optional(),

    avatar: z.string().url().optional(),

    preferredVibes: z.array(z.string()).optional(),

    budgetPreference: z.enum(["low", "medium", "high"]).optional(),

    companyType: z.enum(["solo", "friends", "couple", "family"]).optional(),
  });

