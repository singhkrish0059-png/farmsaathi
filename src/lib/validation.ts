import { z } from "zod";
export const registerSchema = z.object({
  role: z.enum(["BUYER", "FARMER"]), name: z.string().min(2).max(80), email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{10,13}$/, "Enter a valid mobile number"), password: z.string().min(8).max(100),
  village: z.string().optional(), district: z.string().optional(), state: z.string().optional(),
  farmingType: z.string().optional(), farmingExperience: z.coerce.number().min(0).max(80).optional(), bio: z.string().max(500).optional(),
});
export const productSchema = z.object({
  name: z.string().min(2).max(100), categoryId: z.string(), description: z.string().min(5).max(1000),
  price: z.coerce.number().positive(), unit: z.string().min(1).max(20), quantityAvailable: z.coerce.number().min(0),
  location: z.string().min(2).max(120), availabilityStatus: z.enum(["AVAILABLE", "OUT_OF_STOCK", "INACTIVE"]).default("AVAILABLE"),
  images: z.array(z.string()).max(6).default([]),
});
export const enquirySchema = z.object({ productId: z.string(), message: z.string().min(5).max(500) });
