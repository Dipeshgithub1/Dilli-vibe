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
      default:4
    },

    image: {
      type: String,
       default: ""
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

//index for search and recommemends
experienceSchema.index({
  mood:1,
  budgetPreference: 1,
  suitableFor: 1
});

experienceSchema.index({
  description: "text",
  area: "text",
  tags: "text"
})

export const Experience = mongoose.model<IExperience>(
    "Experience",
    experienceSchema
)