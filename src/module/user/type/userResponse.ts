import { User } from "@prisma/client";

export type UserResponse = Omit<User, 'createdAt' | 'updatedAt' | 'password'>;