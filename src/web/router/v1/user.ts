import { Router, } from "express";
import { UserControllerInterface } from "../../controller/user";


export const newUserRouter = async (userController: UserControllerInterface): Promise<Router> => {
    const router = Router();
    router.post("/create", userController.create);
    return router;
};
