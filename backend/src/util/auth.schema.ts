import { z } from "zod";


export const moods = [
  "chill",
  "fun",
  "romantic",
  "explore",
  "food",
  "social",
] as const;

export const budgetPreferences = [
  "low",
  "medium",
  "high",
] as const;

export const companyTypes = [
  "solo",
  "friends",
  "couple",
  "family",
] as const;

export const registerSchema = z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
    .max(
      100,
      "Password too long"
    )
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    ),

    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .max(
      50,
      "First name too long"
    ),

    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .max(
      50,
      "Last name too long"
    ),
});

export const loginSchema = z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .toLowerCase(),

    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters"),
});


 // After login – personalization
 export const onboardingSchema = z.object({
    firstName: z
    .string()
    .min(1)
    .max(50)
    .optional(),

    lastName: z.
    string()
    .min(1)
    .max(50)
    .optional(),

    avatar: z
    .string()
    .trim()
    .url("Avatar must be a valid URL")
    .optional(),

    preferredVibes: z
      .array(z.enum(moods))
      .max(5,"Too many vibe selections")
      .optional(),

    budgetPreference: z.enum(budgetPreferences).optional(),

companyType: z.enum(companyTypes).optional()
  })
  .refine(
    (data) =>
      Object.keys(data).length > 0,
    {
      message:
        "At least one onboarding field is required",
    }
  );

export type RegisterInput =
  z.infer<
    typeof registerSchema
  >;

export type LoginInput =
  z.infer<
    typeof loginSchema
  >;

export type OnboardingInput =
  z.infer<
    typeof onboardingSchema
  >;