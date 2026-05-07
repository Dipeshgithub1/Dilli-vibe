import mongoose, { Schema, Document,Model } from "mongoose";
import bcrypt from "bcryptjs";
import { moods, budgetPreferences, companyTypes } from "../util/auth.schema";

export type Mood = (typeof moods)[number];

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  // Onboarding / Preferences
  preferredVibes: Mood[];
  budgetPreference?: (typeof budgetPreferences)[number];
  companyType?: (typeof companyTypes)[number];
   isOnboarded: boolean;
  
  //Auth
  authProvider: "local" | "google";
  googleId?: string;
  refreshToken?:string | null;
  
  comparePassword(candidate: string): Promise<boolean>;
}

//Schema
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index:true  //fast lookup
    },
    password: {
      type: String,
      required:true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
      index:true
    },
    googleId: {
      type: String,
      index: true,
      sparse: true, // allows null values
    },
   
preferredVibes: {
   type: [String],
   enum: moods,
   default: [],
   index: true,
 },
 budgetPreference: {
 type: String,
 enum: budgetPreferences,
 index:true,
 },
companyType:{
  type:String,
  enum: companyTypes,
  index:true,
  },
 isOnboarded: {
type: Boolean,
default: false,
index:true,
},
refreshToken : {
  type:String,
  default:null,
  select:false,
}

  },
  { timestamps: true }
);

//  Hash password before save
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//  Compare password
userSchema.methods.comparePassword = async function (candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
