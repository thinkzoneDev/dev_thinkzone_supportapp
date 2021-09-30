import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController,
  MenuController,
  ToastController,
  AlertController,
  LoadingController,
  ModalController,
  Events,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";

import { Router } from "@angular/router";
import { IonSlides } from "@ionic/angular";
import { UserprofileimageService } from "../services/userprofileimage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  slideOpts: any;
  @ViewChild("mySlider") slides: IonSlides;
  isgetstarted: boolean = false;
  isWelcome: boolean = true;
  islastslide = false;
  public loginFormGroup: FormGroup;
  public signinFormGroup: FormGroup;

  fcm_token: any;
  fcm_rtoken: any;
  _status: boolean = true;
  _message: string = "";
  email: any;
  password: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public api: RestApiService,
    public router: Router,
    public modalController: ModalController,
    public Loginevents1: Events,
    private userprofileimageService: UserprofileimageService
  ) {
    this.loginFormGroup = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    // this.slides.startAutoplay();
  }

  ngOnInit() {
    this.loginFormGroup = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  // on logging in

  async onLoggedin() {
    const data = {
      userid: this.loginFormGroup.value.email,
      password: this.loginFormGroup.value.password,
      usertype: "manager",
    };
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.authenticateuser(data).subscribe(
      (res) => {
        loading.dismiss();
        console.log(res);

        if (res["success"] == "success") {
          localStorage.setItem("_userid", res["userid"]);
          localStorage.setItem("_username", res["username"]);
          localStorage.setItem("_emailid", res["emailid"]);
          localStorage.setItem("managertype", res["managertype"]);
          this.Loginevents1.publish("Logged", "Logged user");

          this.navController.navigateRoot("/main-menu");
        }
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: "Forgot Password?",
      message: "Enter you email address to send a reset link password.",
      inputs: [
        {
          name: "email",
          type: "email",
          placeholder: "Email",
        },
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: "Confirm",
          handler: async () => {
            const loader = await this.loadingController.create({
              duration: 2000,
            });

            loader.present();
            loader.onWillDismiss().then(async (l) => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: "Email was sended successfully.",
                duration: 3000,
                position: "bottom",
              });

              toast.present();
            });
          },
        },
      ],
    });

    await alert.present();
  }

  goToRegister() {
    this.navController.navigateForward("/register");
  }

  onSkip() {
    this.router.navigateByUrl("/prelogin");
  }
  async onNext() {
    this.islastslide = await this.slides.isEnd();
    if (this.islastslide) {
      this.slides.slideNext();
    } else {
      this.router.navigateByUrl("/prelogin");
    }
  }
  onGetStarted() {
    this.router.navigateByUrl("/prelogin");
  }

  async signin() {
    this._status = true;
    if (this.email && this.password) {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
        let data = {
          userid: this.email,
          password: this.password,
          usertype: "manager",
        };
        let loading = await this.loadingController.create({});
        await loading.present();
        await this.api.authenticateuser(data).subscribe(
          (res) => {
            this.userprofileimageService.getuserprofileimage(res);
            loading.dismiss();
            console.log("res-->", res);
            if (res["success"] == "success") {
              this._status = true;
              this._message = "";
              let uid = res["userid"];
              let uname = res["username"];
              localStorage.setItem("_userid", res["userid"]);
              localStorage.setItem("_username", res["username"]);
              localStorage.setItem("_emailid", res["emailid"]);
              localStorage.setItem("_image", res["image"]);
              localStorage.setItem("_passcode", res["passcode"]);
              localStorage.setItem("managertype", res["managertype"]);
              this.api.adduserdevice();
              this.Loginevents1.publish("Logged", "Logged user");
              // save token id -----------------------------------
              this.api.getfcmtokenidbyuserid(uid).subscribe(
                (res1) => {
                  if (res1.length > 0) {
                    let tid = res1[0]["_id"];
                    const obj = {
                      userid: uid,
                      username: uname,
                      token: this.fcm_token,
                      refresh_token: this.fcm_rtoken,
                    };
                    this.api.updatefcmtokenid(tid, obj).subscribe((res2) => {});
                  } else {
                    const obj = {
                      userid: uid,
                      username: uname,
                      token: this.fcm_token,
                      refresh_token: this.fcm_rtoken,
                    };
                    this.api.createnewfcmtokenid(obj).subscribe((res3) => {});
                  }
                },
                (err) => {
                  this._status = false;
                  this._message = "Network Error!!!";
                  loading.dismiss();
                }
              );
              this.navController.navigateRoot("/main-menu");
            } else {
              this._status = false;
              this._message = "worng email id or password !";
            }
          },
          (err) => {
            this._status = false;
            this._message = "Network Error!!!";
            loading.dismiss();
          }
        );
      } else {
        this.toaster();
      }
    } else {
      this.toaster1();
    }
  }
  async toaster() {
    const toast = await this.toastCtrl.create({
      message: "Please input valid email id",
      duration: 2000,
    });
    toast.present();
  }
  async toaster1() {
    const toast = await this.toastCtrl.create({
      message: "Please Enter email id and password",
      duration: 2000,
    });
    toast.present();
  }

  showPassword = false;
  passwordToggle = "eye";
  togglePassword(): void {
    this.showPassword = !this.showPassword;
    if (this.passwordToggle == "eye") {
      this.passwordToggle = "eye-off";
    } else {
      {
        this.passwordToggle = "eye";
      }
    }
  }
}
