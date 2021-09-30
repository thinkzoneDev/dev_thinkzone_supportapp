import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  NavController,
  ModalController,
  LoadingController,
  AlertController,
  Events,
} from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { RestApiService } from "./../../../rest-api.service";
import { ToastController } from "@ionic/angular";
import { UserprofileimageService } from "../../services/userprofileimage.service";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.page.html",
  styleUrls: ["./signin.page.scss"],
})
export class SigninPage implements OnInit {
  public signinFormGroup: FormGroup;

  fcm_token: any;
  fcm_rtoken: any;

  _status: boolean = true;
  _message: string = "";
  email: any;
  password: any;

  @Input() value: any;
  constructor(
    private formBuilder: FormBuilder,
    private navController: NavController,
    private modalController: ModalController,
    private sanitizer: DomSanitizer,
    public alertController: AlertController,
    public loadingController: LoadingController,
    public api: RestApiService,
    private toastCtrl: ToastController,
    public Loginevents1: Events,
    private userprofileimageService: UserprofileimageService
  ) {
    this.fcm_token = localStorage.getItem("fcm_token");
    this.fcm_rtoken = localStorage.getItem("fcm_rtoken");
    this.signinFormGroup = this.formBuilder.group({
      email: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.signinFormGroup = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required])],
    });
  }

  closeModal() {
    this.modalController.dismiss();
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
            console.log("res",res)
            if (res["success"] == "success") {
              this._status = true;
              this._message = "";
              let uid = res["userid"];
              let uname = res["username"];
              localStorage.setItem("_userid", res["userid"]);
              localStorage.setItem("_username", res["username"]);
              localStorage.setItem("_emailid", res["emailid"]);
              localStorage.setItem("_image", res["image"]);
              localStorage.setItem("_passcode",res["passcode"]);
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
                      refresh_tokean: this.fcm_rtoken,
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
              // -------------------------------------------------
              this.navController.navigateRoot("/main-menu");
              this.closeModal();
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
