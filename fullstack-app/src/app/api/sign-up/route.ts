import dbCoonect from "@/lib/dbConnect";
import userModel from "@/model/user";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    await dbCoonect();

    try {
      const {username, email, password} =  await request.json()
      const existingUserVerifiedByUsername = await userModel.findOne({
        username,
        isverified: true
       })
       if(existingUserVerifiedByUsername){
           return Response.json(
               {
                   success: false,
                   message: "Username already exists."
               },
               {
                   status: 400
               }
           )
       }

       const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      const existingUserVerifiedByEmail = await userModel.findOne({email})
      if(existingUserVerifiedByEmail){
          if(existingUserVerifiedByEmail.isVerified){
            return Response.json({
                success: false,
                message: "User already exists."
            },{status: 500})
          }else{
            const hashedPassword = await bcrypt.hash(password, 10)
            existingUserVerifiedByEmail.password = hashedPassword
            existingUserVerifiedByEmail.verifyCode = verifyCode
            existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserVerifiedByEmail.save()
          }
      }else{
       const hashPassword = await bcrypt.hash(password, 10)
       const expiryDate = new Date()
       expiryDate.setHours(expiryDate.getHours() + 1)
    
     const newUser =  new userModel({
        username,
        email,
        password: hashPassword,
        verifyCode: verifyCode,
        verifyCodeExpires : expiryDate,
        isverified: false,
        isAcceptingMessages: true,
        messages: [],
       })

       await newUser.save()
      }
      // send verification email
     const emailResponse = await sendVerificationEmail(email, username, verifyCode)
     if(!emailResponse.success){
        return Response.json({
            success: false,
            message: emailResponse.message
        },{status: 500})
     }

     return Response.json({
        success: true,
        message: "User registered successfully. Please check your email for verification code."
    },{status: 500})
    } catch (error) {
        console.log("Error registering user:", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user."
            },
            {
                status: 500 
            }
        )
    }
}

