import { z } from 'zod';

const emptyToUndefined = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }

  return value;
};

const optionalQueryString = z.preprocess(emptyToUndefined, z.string().trim().max(200).optional());
const optionalBooleanQuery = z.preprocess(
  emptyToUndefined,
  z.enum(['true', 'false']).optional()
);
const optionalNumberQuery = (schema: z.ZodNumber) =>
  z.preprocess(emptyToUndefined, z.coerce.number().pipe(schema).optional());

export const registerBodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(255),
  password: z.string().min(8).max(128),
});

export const loginBodySchema = z.object({
  email: z.email().max(255),
  password: z.string().min(1).max(128),
});

export const verifyEmailBodySchema = z
  .object({
    verificationToken: z.string().trim().optional(),
    token: z.string().trim().optional(),
  })
  .refine((value) => Boolean(value.verificationToken || value.token), {
    message: 'verificationToken or token is required',
  });

export const createListBodySchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(4000).optional().or(z.literal('')),
  isPublic: z.boolean().optional(),
});

export const updateListBodySchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(4000).optional().or(z.literal('')),
    isPublic: z.boolean().optional(),
  })
  .refine((value) => value.title !== undefined || value.description !== undefined || value.isPublic !== undefined, {
    message: 'At least one field must be provided',
  });

export const saveProgramBodySchema = z.object({
  programId: z.string().trim().min(1),
});

export const addListItemBodySchema = z.object({
  programId: z.string().trim().min(1),
  commentary: z.string().trim().max(4000).optional().or(z.literal('')),
});

export const updateListItemBodySchema = z
  .object({
    commentary: z.string().trim().max(4000).optional().or(z.literal('')),
    displayOrder: z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional()),
  })
  .refine((value) => value.commentary !== undefined || value.displayOrder !== undefined, {
    message: 'commentary or displayOrder is required',
  });

export const searchProgramsQuerySchema = z
  .object({
    search: optionalQueryString,
    interests: z.preprocess(emptyToUndefined, z.string().regex(/^\d+(,\d+)*$/).optional()),
    type: z.preprocess(emptyToUndefined, z.enum(['PROGRAM', 'COMPETITION']).optional()),
    isFree: optionalBooleanQuery,
    isSelective: optionalBooleanQuery,
    rating: z.preprocess(
      emptyToUndefined,
      z.enum(['MOST_RECOMMENDED', 'HIGHLY_RECOMMENDED']).optional()
    ),
    zip: optionalQueryString,
    locationQuery: optionalQueryString,
    season: z.preprocess(emptyToUndefined, z.enum(['Spring', 'Summer', 'Fall']).optional()),
    onlineOnly: optionalBooleanQuery,
    includeOnline: optionalBooleanQuery,
    grades: z.preprocess(emptyToUndefined, z.string().regex(/^\d+(,\d+)*$/).optional()),
    international: optionalBooleanQuery,
    collegeCredit: optionalBooleanQuery,
    oneOnOne: optionalBooleanQuery,
    lat: optionalNumberQuery(z.number().min(-90).max(90)),
    lng: optionalNumberQuery(z.number().min(-180).max(180)),
    radiusMiles: optionalNumberQuery(z.number().positive().max(500)),
    sort: z.preprocess(
      emptyToUndefined,
      z.enum(['relevancy', 'rating', 'deadline', 'distance']).optional()
    ),
    page: optionalNumberQuery(z.number().int().positive()),
    limit: optionalNumberQuery(z.number().int().positive().max(100)),
  })
  .refine(
    (value) =>
      (value.lat === undefined && value.lng === undefined) ||
      (value.lat !== undefined && value.lng !== undefined),
    {
      message: 'lat and lng must be provided together',
      path: ['lat'],
    }
  );
