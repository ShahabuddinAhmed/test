import { Router } from "express";
import { UserControllerInterface } from "../../controller/user";
import { newUserRouter } from "./user";
import { newHealthRouter } from "./health";


export const newV1Router = async (userController: UserControllerInterface): Promise<Router> => {
    const v1 = Router();
    v1.use("/v1/health", await newHealthRouter());
    v1.use("/v1/user", await newUserRouter(userController));

    v1.use("*", (req, res) => {
        res.status(404).send({
            code: "PAGE_NOT_FOUND",
            message: "please be sane and hit correct endpoints",
            response: null,
            error: null
        });
    });

    return v1;
};
