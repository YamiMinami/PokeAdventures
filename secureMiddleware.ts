import { NextFunction, Request, Response} from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
    if (req.session.username) {
        res.locals.username = req.session.username;
        next();
    } else {
        res.redirect("/");
    }
};