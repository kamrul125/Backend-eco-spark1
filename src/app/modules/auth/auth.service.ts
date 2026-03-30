
import { prisma } from '../../../config/prisma'; 
import { generateToken } from '../../../utils/jwt';
import { hashPassword, comparePassword } from '../../../utils/bcrypt';

export const registerUser = async (name: string, email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("Email already registered");
  }

  const hashed = await hashPassword(password);
  
  const user = await prisma.user.create({
    data: { 
      name, 
      email, 
      password: hashed 
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;
  
  const token = generateToken({ id: user.id, role: user.role as string });
  
  return { user: userWithoutPassword, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ 
    where: { email } 
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid credentials");
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user;

  const token = generateToken({ id: user.id, role: user.role as string });
  
  return { user: userWithoutPassword, token };
};