import { Request, Response } from "express";
import { UserServiceInterface } from "../../service/user";
import { UserInterface } from "../../model/user";
import { UserSerializer } from "../serializer/user";
import { Controller } from "./controller";
import { object, string } from "joi";
import { LoggerInterface } from "../../infra/logger";

export interface UserControllerInterface {
    create(req: Request, res: Response): any;
    list(req: Request, res: Response): any;
    update(req: Request, res: Response): any;
    delete(req: Request, res: Response): any;
}

export class UserController extends Controller implements UserControllerInterface {
    userService: UserServiceInterface;
    logger: LoggerInterface;
    constructor(userService: UserServiceInterface, logger: LoggerInterface) {
        super();
        this.userService = userService;
        this.logger = logger;
        this.create = this.create.bind(this);
        this.list = this.list.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
	}

    public async create(req: Request, res: Response) {
        const schema = object().keys({
            name: string().required(),
            email: string().email().required()
        });

		const { error, value: castedUser } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
            const { user, errMessage } = await this.userService.create(castedUser as UserInterface);
            if (errMessage) {
                return await this.sendResponse(400, "E_EXIST_USER", errMessage, null, [], res);
            }

            const response = await UserSerializer.serializeUser(user as UserInterface);
            return await this.sendResponse(200, "SUCCESS", "User Successfully created.",
                response, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "user.handler.create", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async list(req: Request, res: Response) {
        try {
            const users = await this.userService.getUserList();
            const response = await UserSerializer.serializeUsers(users as UserInterface[]);
            return await this.sendResponse(200, "SUCCESS", "User Successfully created.",
                response, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "user.handler.list", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async update(req: Request, res: Response) {
        const schema = object().keys({
            name: string().required(),
            email: string().email().required()
        });

		const { error, value: castedUser } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
            const { user, errMessage } = await this.userService.update(castedUser);
            if (errMessage) {
                return await this.sendResponse(400, "E_INVALID_USER", errMessage, null, [], res);
            }

            const response = await UserSerializer.serializeUser(user as UserInterface);
            return await this.sendResponse(200, "SUCCESS", "User Successfully updated.",
                response, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "user.handler.update", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async delete(req: Request, res: Response) {
        const schema = object().keys({
            email: string().email().required()
        });

		const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            return await this.sendResponse(400, "E_INVALID_DATA", "Please fill up all the required fields.",
                null, error.details, res
            );
        }

        try {
            const { errMessage } = await this.userService.deleteByEmail(req.body.email);
            if (errMessage) {
                return await this.sendResponse(400, "E_INVALID_USER", errMessage, null, [], res);
            }

            return await this.sendResponse(200, "SUCCESS", "User Successfully deleted.",
                null, [], res
            );

        } catch (err) {
            this.logger.info("Internal Server Error", "user.handler.delete", { err });
            return await this.sendResponse(500, "E_INTERNAL_SERVER_ERROR", "Internal Server Error",
                null, [], res
            );
        }
    }

    public async sendResponse(statusCode: number, code: string, message: string,
        data: any, errors: any[], res: Response, optional?: object): Promise<any> {
        return res.status(statusCode).send({ code, message, data, errors, ...optional });
    }
}

export const newUserController = async (userService: UserServiceInterface, logger: LoggerInterface):
    Promise<UserController> => {
    return new UserController(userService, logger);
};