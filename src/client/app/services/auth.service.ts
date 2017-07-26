import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthService {

    private loginUrl = 'auth/login';
    private registerUrl = 'auth/register';
    private validateUrl = 'auth/validateToken';
    private updateUsernameUrl = 'auth/updateUsername';
    private facebookUrl = 'auth/facebook';
    constructor(private http: Http, private router: Router ) { }

    public logout(){
        localStorage.clear();
        location.reload();
    }
    public login(username: string, password: string) {
        let body = "username=" + username + "&password=" + password;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.loginUrl, body, options)
            .toPromise()
            .then(this.saveToken)
            .catch();
    }

    public register(username: string, password: string){
        let body = "username=" + username + "&password=" + password;
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.registerUrl, body, options)
            .toPromise()
            .then(this.saveToken)
            .catch();
    }

    public updateUsername(username: string){
        let body = "username=" + username+"&id="+localStorage["id"];
        let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(this.updateUsernameUrl, body, options)
            .toPromise()
            .then(this.saveToken)
            .catch();
    }

    public saveToken(res: Response) {
        let body = JSON.parse(res["_body"]);
        let success = body["success"];
        console.log(success);
        if(success==1){
            let token = body["token"];
            let id = body["id"];
            let username = body["username"];
            localStorage.setItem("token", token);
            localStorage.setItem("id", id);
            localStorage.setItem("username", username);
            console.log(res, success);
        }
        return success;
    }

    public getAuthdetails(){
        let username = localStorage['username'];
        let token = localStorage["token"];
        let id = localStorage["id"];
        return {
            token: token,
            id: id,
            username: username
        };
    }

    private handleError(error: Response | any) {
        // In a real world app, you might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

    public facebook(id: string){
        let headers = new Headers({ 'id': id, 'Access-Control-Allow-Origin': '*' });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.facebookUrl+"?id="+id, options)
            .toPromise()
            .then(this.saveToken)
            .catch(this.handleError);
    }
}
