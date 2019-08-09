import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ApisService } from '../services/apis.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loading: boolean;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private apisService: ApisService,
              private storageService: StorageService,
              public toastController: ToastController) { }

  ngOnInit() {
    this.loading = false;
    this.loginForm = this.formBuilder.group({
      username : [null, Validators.required],
      password : [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.loading = true;
    this.apisService.login(form)
      .subscribe(res => {
        this.loading = false;
        if (res.success) {
          this.storageService.setLoggedIn();
          this.storageService.setCurrentUser(res.data);
          this.storageService.setToken(res.data.token);
          this.router.navigate(['/setup']);
          this.storageService.presentToast('Login Successful');
        }
      }, (err) => {
        console.log(err);
      });
  }
}
