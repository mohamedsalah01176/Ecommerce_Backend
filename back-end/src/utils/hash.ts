import { compare, hash } from "bcrypt";

const hashPassword = async (
  value: string,
  saltRounds: number
): Promise<string> => {
  const result = await hash(value, saltRounds);
  return result;
};

const hashValidation = async (
  value: string,
  compareValue: string
): Promise<boolean> => {
  try {
    const isMatch = await compare(value, compareValue);
    return isMatch;
  } catch (error) {
    console.error("Error during hash comparison:", error);
    return false;
  }
};

const hashpass = {
  hashValidation,
  hashPassword,
};

export default hashpass;
