import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
   if(connection.isConnected) {
       console.log("already connected");
       return;
   }
   try {
  const db =  await mongoose.connect(process.env.MONGODB_URI || "", {});
  connection.isConnected = db.connections[0].readyState;
  console.log("connected to MongoDB succesfully");
   } catch (error) {
    console.log("error connecting to MongoDB", error);

    process.exit(1);
   }
}

export default dbConnect