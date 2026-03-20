import mongoose ,{Schema,Document} from "mongoose";

export interface IExperience extends Document {
  name:string;
  description:string;
  area:string;
  moods : ("chill"| "fun" |"romantic"| "explore" | "food" | "social")[];
  //user mood chill, romantic, food, fun
  budgetPreference: "low" | "medium" | "high";
  suitableFor: ("solo" | "friends" | "couple" | "family")[];

  tags: string[];

  timePreference?: ("morning" | "afternoon" | "evening" | "night")[];

  popularityScore?: number;

  rating?: number;
  image?: string;

  location? : {
   lat: number;
   lng: number;
  }

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
      enum: ["chill", "fun", "romantic", "explore", "food", "social"],
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
      index: true,
    },

    timePreference: {
      type: [String],
      enum: ["morning", "afternoon", "evening", "night"],
      default:[],
    },

    popularityScore: {
      type: Number,
      default: 0,
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

    location: {
      lat: Number,
      lng: Number,
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
experienceSchema.index({tags:1});
experienceSchema.index({area:1,budgetPreference: 1 });
experienceSchema.index({rating:-1})



export const Experience = mongoose.model<IExperience>(
    "Experience",
    experienceSchema
)