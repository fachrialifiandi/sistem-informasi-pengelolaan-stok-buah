import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string()
    .min(1, { message: "Email Akun wajib diisi" })
    .email({ message: "Format Email tidak valid" }),
  password: z.string()
    .min(1, { message: "Password wajib diisi" })
    .min(8, { message: "Password minimal terdiri dari 8 karakter" })
});
