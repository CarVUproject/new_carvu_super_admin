import { z } from 'zod';
import { LoginSchema } from '@/schemas/authSchema';

export type LoginFormType = z.infer<typeof LoginSchema>;
export type LoginResType = {
  access: string;
  refresh: string;
};
