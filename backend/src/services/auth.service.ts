import { User } from "../model/user.model";
import { comparePassword, hashPassword } from "../util/hash";
import jwt from "jsonwebtoken";


interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}: RegisterInput) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email is already registered");
  }


  const user = await User.create({
    email,
    password,      
    firstName,
    lastName,
  });

  return {
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");;
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user._id,
      email: user.email,
    },
  };
};
