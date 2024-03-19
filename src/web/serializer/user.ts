import { UserInterface } from "../../model/user";

export class UserSerializer {
    public static async serializeUser(user: UserInterface) {
        return {
			id: user.id,
            name: user.name,
            email: user.email
        };
    }

    public static async serializeUsers(users: UserInterface[]) {
        return await Promise.all(
            users.map(async user => await UserSerializer.serializeUser(user))
        );
    }
}
