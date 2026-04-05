import bcrypt from "bcryptjs";

const envSalt = Number(process.env.SALT_ROUNDS) || 10;
const SALT_ROUNDS = isNaN(envSalt) || envSalt < 1 ? 10 : envSalt;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};


