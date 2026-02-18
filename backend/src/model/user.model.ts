import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { string } from "zod";

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  // Onboarding / Preferences
  preferredVibes: string[];
  budgetPreference?: "low" | "medium" | "high";
  companyType?: "solo" | "friends" | "couple" | "family";
  isOnboarded: boolean;
  
  authProvider: "local" | "google";
  googleId?: string;
  
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
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
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: String,
    avatar: String,
    preferredVibes: {
      type: [String],
      default: [],
      index:true,
    },
    budgetPreference: {
      type: String,
      enum: ["low", "medium", "high"],
    },
    companyType:{
      type:string,
      enum:["solo", "friends", "couple", "family"]
      
    },
    isOnboarded: {
   type: Boolean,
   default: false,
}

  },
  { timestamps: true }
);

//  Hash password before save
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);

});

//  Compare password
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
