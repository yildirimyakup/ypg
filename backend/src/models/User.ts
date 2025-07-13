import {Schema, model, Document} from "mongoose";

export interface IUser extends Document {
    ad: string;
    email: string;
    sifreHash:string;
    rol: string;
    kod?: string;
    sinifId?: string;
}

const userSchema = new Schema<IUser>({
    ad: { type: String, required: true },
    email: { type: String, required: true ,unique: true},
    sifreHash: { type: String},
    rol: { type: String, required: true },
    kod: { type: String },
    sinifId: { type: String },
})

export const User = model<IUser>("User", userSchema);