import { Model } from "mongoose";
import mongodb from "mongodb";
import { UserInterface } from "../model/user";

export interface UserRepoInterface {
    create(user: UserInterface): Promise<UserInterface>;
    getByEmail(email: string): Promise<UserInterface | null>;
    getUserList(): Promise<UserInterface[]>;
    updateByEmail(user: UserInterface): any;
    deleteByEmail(email: string): Promise<mongodb.DeleteResult>;
}

export class UserRepo implements UserRepoInterface {
    constructor(private userModel: Model<UserInterface, {}, {}, {}>) {
        this.userModel = userModel;
    }

    public async create(user: UserInterface): Promise<UserInterface> {
        return this.userModel.create(user);
    }

    public async getByEmail(email: string): Promise<UserInterface | null> {
        return this.userModel.findOne({ email });
    }

    public async getUserList(): Promise<UserInterface[]> {
        return this.userModel.find();
    }

    public async updateByEmail(
        user: UserInterface
    ) {
        return this.userModel.updateOne({ email: user.email }, user);
    }

    public async deleteByEmail(email: string): Promise<mongodb.DeleteResult> {
        return this.userModel.deleteOne({ email });
    }
}

export const newUserRepo = async (
    userModel: Model<UserInterface, {}, {}, {}>
): Promise<UserRepoInterface> => {
    return new UserRepo(userModel);
};

export default UserRepo;
