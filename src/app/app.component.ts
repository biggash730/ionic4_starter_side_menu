import { Component, OnInit } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { StorageService } from './services/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit  {
  user: any;
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: StorageService,
    private router: Router, public alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    // this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.storage.isLoggedIn().then((val) => {
        if (val) {
          this.storage.getCurrentUser().then((v) => {
            this.user = v;
            this.router.navigate(['/home']);
          });
        } else {
          this.router.navigate(['/login']);
        }
      });
      this.splashScreen.hide();
      this.statusBar.styleDefault();
    });
  }
  async logout() {
    const alert = await this.alertCtrl.create({
      subHeader: 'App Logout',
      message: 'Are you sure you want to be logged out?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.storage.clear().then(
              res => {
                this.router.navigate(['/login']);
              },
              error => {
              }
            );
          }
        }
      ]
    });
    await alert.present();
  }
}
