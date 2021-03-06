import { Request, Response, NextFunction } from 'express';
import { Users } from '../../db/models/_';
import { TokenService } from '../../services/_';
import * as passport from 'passport';


class AuthSocialController {

    public authenticate(social, req: Request, res: Response, next: NextFunction) {
        console.log(req.headers["id"], req.query["id"], "authen");
        req.headers["id"] = req.query["id"];
        passport.authenticate(social, { scope: ['email'] })(req, res, next);
    }
    public callback(social, req: Request, res: Response, next: NextFunction) {
        console.log(req.headers["id"]);
        passport.authorize(social, function (err, user, info) {
            if (err) {
                res.cookie("snackbar-message", social + " login failed :(");
                res.redirect("/");
                return;
            }
            if (info === 3) {
                res.cookie("token", req.cookies["token"], { httpOnly: true });
                res.cookie("snackbar-message", social + " linked with a different account");
                return res.redirect('/');
            }

            res.cookie("id", user.id);
            if (user.username) {
                res.cookie("username", user.username);
            }
            res.cookie("token", TokenService.getToken(user.id), { httpOnly: true });
            res.cookie("snackbar-message", social + " login successful!");
            res.redirect("/");

        })(req, res, next);
    }
}



export default new AuthSocialController();
