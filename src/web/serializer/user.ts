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
        return users.map(user => UserSerializer.serializeUser(user));
    }
}
