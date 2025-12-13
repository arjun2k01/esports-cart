import { z } from "zod";

// ✅ Auth Validation Schemas
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long")
    .trim(),
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain uppercase")
    .regex(/[0-9]/, "Password must contain number")
    .regex(/[!@#$%^&*]/, "Password must contain special character"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email").toLowerCase().trim(),
  password: z.string().min(1, "Password required"),
});

export const productSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(10).max(2000),
  price: z.number().positive("Price must be positive"),
  stock: z.number().int().min(0),
  category: z.enum(["headsets", "controllers", "mousepads", "keyboards"]),
  image: z.string().url("Invalid image URL"),
});

export const orderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1),
      })
    )
    .min(1, "Order must have items"),
  shippingAddress: z.object({
    street: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    postalCode: z.string().min(5),
    country: z.string().min(2),
  }),
});

// Validation helper
export const validateInput = (schema, data) => {
  try {
    return schema.parse(data);
  } catch (error) {
    throw new Error(error.errors[0].message);
  }
};
