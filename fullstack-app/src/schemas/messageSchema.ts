import {z} from "zod";

export const messageSchema = z.object({
    content: z
    .string()
    .min(2, {message: "Please provide a message"})
    .max(300, {message: "Message must be at most 300 characters long"})
}) 