import prisma from '@/services/prisma.service';
import bcrypt from 'bcryptjs';

export async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { user_id: userId },
    select: {
      user_id: true,
      email: true,
      full_name: true,
      current_level: true,
      role: true,
      avatar_url: true,
      created_at: true,
    },
  });
}

export async function updateUserProfile(userId: string, data: { full_name?: string; avatar_url?: string }) {
  return prisma.user.update({
    where: { user_id: userId },
    data,
    select: {
      user_id: true,
      email: true,
      full_name: true,
      avatar_url: true,
    },
  });
}

export async function changeUserPassword(userId: string, oldPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { user_id: userId } });
  if (!user) throw new Error('User not found');

  const isValid = await bcrypt.compare(oldPassword, user.password_hash);
  if (!isValid) return false;

  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { user_id: userId },
    data: { password_hash },
  });

  return true;
}