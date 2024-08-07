import {z} from "zod";

export const userValidation = z
.string()
.min(3, "Username must be at least 3 characters long")
.max(20, "Username must be at most 20 characters long")
.regex(/^[a-zA-Z0-9]+$/, "Username must only contain letters and numbers");

export const signUpSchema = z.object({
    username: userValidation,
    email: z.string().email({message: "Please provide a valid email"}),
    password: z
.string()
.min(3, "Password must be at least 3 characters long")
.max(20, "Password must be at most 20 characters long")
.regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&,])[A-Za-z\d@$!%*?&,]{8,}$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")

})