import mongoose ,{Schema,Document} from "mongoose";

export interface IExperience extends Document {
  name:string;
  description:string;
  area:string;
  moods : string[]; //user mood chill, romantic, food, fun
  budgetPreference: "low" | "medium" | "high";
  suitableFor: ("solo" | "friends" | "couple" | "family")[];

  tags: string[];
  rating?: number;
  image?: string;

  isActive: boolean;

}


const experienceSchema = new Schema <IExperience>(
    {
     name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
      index: true,
    },
    moods: {
      type: [String],
      required: true,
      index: true,
    },

    budgetPreference: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      index: true,
    },

    suitableFor: {
      type: [String],
      enum: ["solo", "friends", "couple", "family"],
      required: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
    },

    image: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    },
    {
        timestamps:true
    }
)

export const Experience = mongoose.model<IExperience>(
    "Experience",
    experienceSchema
)