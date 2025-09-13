import { z } from "zod";

export const orderSchema = z.object({
  price: z
    .string()
    .nonempty("Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a valid number greater than 0",
    }),
  quantity: z
    .string()
    .nonempty("Quantity is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Quantity must be a valid number greater than 0",
    }),
});
