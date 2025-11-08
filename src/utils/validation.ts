import { z } from 'zod';

/**
 * Input validation schemas using Zod
 */

// Authentication schemas
export const emailSchema = z
  .string()
  .trim()
  .email({ message: 'Invalid email address' })
  .max(255, { message: 'Email must be less than 255 characters' });

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(100, { message: 'Password must be less than 100 characters' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' });

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: 'Name is required' })
  .max(100, { message: 'Name must be less than 100 characters' })
  .regex(/^[a-zA-Z\s'-]+$/, { message: 'Name can only contain letters, spaces, hyphens, and apostrophes' });

export const studentIdSchema = z
  .string()
  .trim()
  .min(1, { message: 'Student ID is required' })
  .max(50, { message: 'Student ID must be less than 50 characters' })
  .regex(/^[a-zA-Z0-9-]+$/, { message: 'Student ID can only contain letters, numbers, and hyphens' });

// Chat schemas
export const messageSchema = z
  .string()
  .trim()
  .min(1, { message: 'Message cannot be empty' })
  .max(5000, { message: 'Message must be less than 5000 characters' });

// Contact form schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z
    .string()
    .trim()
    .min(1, { message: 'Subject is required' })
    .max(200, { message: 'Subject must be less than 200 characters' }),
  message: z
    .string()
    .trim()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(2000, { message: 'Message must be less than 2000 characters' })
});

// Profile update schema
export const profileSchema = z.object({
  name: nameSchema,
  phone: z
    .string()
    .trim()
    .regex(/^[+]?[\d\s()-]*$/, { message: 'Invalid phone number format' })
    .max(20, { message: 'Phone number must be less than 20 characters' })
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .trim()
    .max(100, { message: 'Department must be less than 100 characters' })
    .optional()
    .or(z.literal('')),
  year: z
    .number()
    .int()
    .min(1, { message: 'Year must be at least 1' })
    .max(10, { message: 'Year must be less than 10' })
    .optional()
    .nullable()
});

// Announcement schema
export const announcementSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  content: z
    .string()
    .trim()
    .min(1, { message: 'Content is required' })
    .max(10000, { message: 'Content must be less than 10000 characters' }),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  publish_date: z.string().datetime(),
  expires_at: z.string().datetime().optional().nullable()
});

// Event schema
export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: 'Title is required' })
    .max(200, { message: 'Title must be less than 200 characters' }),
  description: z
    .string()
    .trim()
    .max(2000, { message: 'Description must be less than 2000 characters' })
    .optional(),
  date: z.string().datetime(),
  location: z
    .string()
    .trim()
    .max(200, { message: 'Location must be less than 200 characters' })
    .optional(),
  category: z
    .string()
    .trim()
    .min(1, { message: 'Category is required' })
    .max(50, { message: 'Category must be less than 50 characters' })
});

// Knowledge base schema
export const knowledgeBaseSchema = z.object({
  category: z
    .string()
    .trim()
    .min(1, { message: 'Category is required' })
    .max(50, { message: 'Category must be less than 50 characters' }),
  question: z
    .string()
    .trim()
    .min(1, { message: 'Question is required' })
    .max(500, { message: 'Question must be less than 500 characters' }),
  answer: z
    .string()
    .trim()
    .min(1, { message: 'Answer is required' })
    .max(5000, { message: 'Answer must be less than 5000 characters' }),
  keywords: z
    .array(z.string().trim().max(50))
    .max(20, { message: 'Maximum 20 keywords allowed' })
    .optional()
});

/**
 * Sanitize HTML to prevent XSS attacks
 */
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Validate and sanitize URL
 */
export const sanitizeURL = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new Error('Invalid protocol');
    }
    return parsed.toString();
  } catch {
    return '';
  }
};
