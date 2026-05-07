import mongoose, { Schema, Document } from "mongoose";
import { moods, companyTypes, budgetPreferences } from "../util/auth.schema";

export type Mood = (typeof moods)[number];
export type CompanyType = (typeof companyTypes)[number];
export type BudgetPreference = (typeof budgetPreferences)[number];

export interface IExperience extends Document {
  name: string;
  slug: string;

  description: string;
  area: string;

  moods: Mood[];

  budgetPreference: BudgetPreference;

  suitableFor: CompanyType[];

  tags: string[];

  category?: string;

  timePreference?: (
    | "morning"
    | "afternoon"
    | "evening"
    | "night"
  )[];

  popularityScore: number;

  rating: number;

  totalRatings: number;

  image?: string;

  location?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };

  isActive: boolean;
}

const experienceSchema = new Schema<IExperience>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    moods: {
      type: [String],
      enum: moods,
      required: true,
      index: true,
    },

    budgetPreference: {
      type: String,
      enum: budgetPreferences,
      required: true,
      index: true,
    },

    suitableFor: {
      type: [String],
      enum: companyTypes,
      required: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    category: {
      type: String,
      trim: true,
      index: true,
    },

    timePreference: {
      type: [String],
      enum: ["morning", "afternoon", "evening", "night"],
      default: [],
    },

    popularityScore: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 4,
    },

    totalRatings: {
      type: Number,
      default: 0,
      min: 0,
    },

    image: {
      type: String,
      trim: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        index: "2dsphere",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Search & Recommendation Indexes
experienceSchema.index({
  name: "text",
  description: "text",
  tags: "text",
});

experienceSchema.index({
  moods: 1,
  budgetPreference: 1,
  suitableFor: 1,
});

experienceSchema.index({
  area: 1,
  popularityScore: -1,
});

experienceSchema.index({
  isActive: 1,
  rating: -1,
});

export const Experience = mongoose.model<IExperience>(
  "Experience",
  experienceSchema
);