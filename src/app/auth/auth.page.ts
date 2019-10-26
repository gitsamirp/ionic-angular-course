import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController, private alertCtrl: AlertController) {

   }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.authService.login();
    this.loadingCtrl.create({keyboardClose: true, message: "Logging In..."}).then(
      loadingEl => {
        loadingEl.present();
        this.authService.signup(email, password).subscribe(resData => {
          this.isLoading = false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        }, errorResponse => {
          loadingEl.dismiss();
          console.log(errorResponse);
          const code = errorResponse.error.error.message;
          let messaage = 'Could not signup please try again';
          if (code === 'EMAIL_EXISTS') {
            messaage = 'This email address already exists!';
          }
          this.showAlert(messaage);
        });
      }
    );
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertCtrl.create({
      header: 'Auth Failed',
      message: message,
      buttons: ['ok']
    }).then(alertEl => alertEl.present());
  }

}
