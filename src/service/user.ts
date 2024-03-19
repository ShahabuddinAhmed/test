import { UserInterface } from "../model/user";
import { UserRepoInterface } from "../repo/user";

export interface UserServiceInterface {
    create(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }>;
    getUserList(): Promise<UserInterface[]>;
    updateByEmail(user: UserInterface): Promise<UserInterface | null>;
    deleteByEmail(email: string): Promise<boolean>;
}

export class UserService implements UserServiceInterface {
    constructor(private userRepo: UserRepoInterface) {
        this.userRepo = userRepo;
    }

    public async create(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }> {
        const checkUser = await this.userRepo.getByEmail(user.email);
        if (checkUser) {
            return { user: null, errMessage: "This User is already exist" };
        }
        return { user: await this.userRepo.create(user), errMessage: "" };
    }

    public async getUserList(): Promise<UserInterface[]> {
        return this.userRepo.getUserList();
    }

    public async updateByEmail(user: UserInterface): Promise<UserInterface | null> {
        // const updated = await this.userRepo.updateByEmail(user);
        // updated.acknowledged;
        return user;
    }

    public async deleteByEmail(email: string): Promise<boolean> {
        const deleted = await this.userRepo.deleteByEmail(email);
        return deleted.acknowledged;
    }
}

export const newUserService = async (userRepo: UserRepoInterface) => {
    return new UserService(userRepo);
};