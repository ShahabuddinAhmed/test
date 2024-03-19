import { UserInterface } from "../model/user";
import { UserRepoInterface } from "../repo/user";

export interface UserServiceInterface {
    create(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }>;
    getUserList(): Promise<UserInterface[]>;
    update(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }>;
    deleteByEmail(email: string): Promise<{ errMessage: string }>;
}

export class UserService implements UserServiceInterface {
    constructor(private userRepo: UserRepoInterface, private redisClient: any) {
        this.userRepo = userRepo;
        this.redisClient = redisClient;
    }

    public async create(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }> {
        const checkUser = await this.userRepo.getByEmail(user.email);
        if (checkUser) {
            return { user: null, errMessage: "This User is already exist" };
        }
        return { user: await this.userRepo.create(user), errMessage: "" };
    }

    public async getUserList(): Promise<UserInterface[]> {
        let users = await this.redisClient.get("users");
        users = JSON.parse(users);

        if (!users?.length) {
            await this.updateCache();
        }
        users = await this.redisClient.get("users");

        return JSON.parse(users);
    }

    public async update(user: UserInterface): Promise<{ user: UserInterface | null; errMessage: string }> {
        const { email, name } = user;
        const checkUser = await this.userRepo.getByEmail(email);
        if (!checkUser) {
            return { user: null, errMessage: "Please provide valid email address" };
        }

        await this.userRepo.updateByEmail(email, name);
        await this.updateCache();
        return { user, errMessage: "" };
    }

    public async deleteByEmail(email: string): Promise<{ errMessage: string }> {
        const deleted = await this.userRepo.deleteByEmail(email);
        if (!deleted.deletedCount) {
            return { errMessage: "Please provide valid data or failed to delete data" };
        }
        await this.updateCache();
        return { errMessage: "" };
    }

    private async updateCache(): Promise<void> {
        const users = await this.userRepo.getUserList();
        await this.redisClient.set("users", JSON.stringify(users));
    }
}

export const newUserService = async (userRepo: UserRepoInterface, redisClient: any) => {
    return new UserService(userRepo, redisClient);
};