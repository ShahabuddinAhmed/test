import { Schema, model } from "mongoose";


export interface UserInterface {
    id?: object | string;
    name: string;
    email: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

const schema = new Schema<UserInterface>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true }
    
}, { timestamps: true, versionKey: false });

export const UserModel = model<UserInterface>("User", schema);