import mongoose from "mongoose";
import { config } from "dotenv";

config();

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}`);
mongoose.Promise = global.Promise;

export default mongoose;