import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1).max(120).optional()
});

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const CreateProjectSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().max(2000).optional(),
    settings: z.record(z.any()).optional()
});

export const UpdateProjectSchema = CreateProjectSchema.partial();

export const CreatePageSchema = z.object({
    name: z.string().min(1).max(200),
    slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
    meta: z.record(z.any()).optional(),
    order: z.number().int().min(0).optional()
});
export const UpdatePageSchema = CreatePageSchema.partial();

export const CreateElementSchema = z.object({
    type: z.string().min(1).max(64),
    parentId: z.string().uuid().nullable().optional(),
    x: z.number().int().optional(),
    y: z.number().int().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    rotation: z.number().optional(),
    zIndex: z.number().int().optional(),
    styles: z.record(z.any()).optional(),
    attrs: z.record(z.any()).optional(),
    order: z.number().int().optional()
});
export const UpdateElementSchema = CreateElementSchema.partial();