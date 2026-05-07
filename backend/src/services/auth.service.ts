import { User } from "../model/user.model";
import { comparePassword, hashPassword } from "../util/hash";
import { generateAccessToken,generateRefreshToken } from "../util/token";
import bcrypt from "bcryptjs";

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const registerUser = async(data:RegisterInput) => {
const existingUser = await User.findOne({ email: data.email });

if (existingUser) {
    throw new Error("Email is already registered");
  }

  const user = await User.create(data);

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
 
// store hashed refresh token 
  user.refreshToken = await bcrypt.hash(refreshToken,10);
  await user.save();

return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isOnboarded: user.isOnboarded,
    }
  };
}

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

//  update hashed refresh token
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save();

return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isOnboarded: user.isOnboarded,
    },
  };
}
