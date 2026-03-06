import { Response } from 'express';
import { ZodType } from 'zod';

export const parseOrRespond = <T>(
  schema: ZodType<T>,
  data: unknown,
  res: Response
) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    res.status(400).json({
      error: 'Invalid request',
      details: result.error.flatten(),
    });
    return null;
  }

  return result.data;
};
