import { email, z } from "zod";


 // REGISTER (STEP 1)

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),

      firstName:z
      .string()
      .min(1,"First name is required"),

      lastName:z
      .string()
      .min(1,"Last name is required")
  }),
});


 // LOGIN (STEP 2)
 
export const loginSchema = z.object({
  body: z.object({
    email: z
      .string()
      .email("Invalid email address")
      .transform((val) => val.toLowerCase()),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
});


 // After login – personalization
 export const onboardingSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),

    lastName: z.string().min(1).optional(),

    avatar: z.string().url().optional(),

    preferredVibes: z.array(z.string()).optional(),

    budgetPreference: z.enum(["low", "medium", "high"]).optional(),

    companyType: z.enum(["solo", "friends", "couple", "family"]).optional(),
  }),
});
