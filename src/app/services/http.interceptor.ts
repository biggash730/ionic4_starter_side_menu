import { Injectable, ViewChild } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent,
    HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { Storage } from '@ionic/storage';
import { flatMap, tap } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';
// import { ToastController, Nav } from 'ionic-angular';
// import { currentUser, invalidToken, loggedIn } from '../../providers/contants';
// import { LoginPage } from '../../pages/login/login';

@Injectable()
export class Interceptor implements HttpInterceptor {

    constructor(private storage: Storage, public toastController: ToastController) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent |
    HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
        return from(this.storage.get('TOKEN')).pipe(
            flatMap((token) => {
                let authReq = req.clone();
                if (token) {
                    const tkn = JSON.parse(token);
                    authReq = req.clone({ setHeaders: { Authorization: `Bearer ${tkn}` } });
                }
                return next.handle(authReq);
            }),
            tap((response: HttpResponse<any>) => {
                if (response.status === 200) {
                    if (response.status === 200 && req.method !== 'GET' && !this.isQueryPost(response.url)) {
                        this.presentToast(response.body.message);
                    }

                    if (req.method !== 'GET' && !this.isQueryPost(req.url)) {
                        if (!response.body.success) {
                            // this.showToast(response.body.message);
                        }
                    }
                }
            }, err => {
                if (err.error) {
                    if (err.error.message === 'No message available') {
                        this.presentToast(err.error.error);
                    } else { this.presentToast(err.error.message || err.message); }
                } else if (err.message) { this.presentToast(err.message); }
            }));
    }



    private isQueryPost(url: string) {
        const querySuffix = '/query';
        return url.indexOf(querySuffix, url.length - querySuffix.length) !== -1;
    }

    async presentToast(msg) {
        const toast = await this.toastController.create({
            message: msg,
            duration: 2000,
            position: 'top'
        });
        toast.present();
    }

}
