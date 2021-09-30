import { Component, OnInit, ViewChild } from "@angular/core";
import {
  NavController,
  MenuController,
  ModalController,
  LoadingController,
} from "@ionic/angular";
import { IonSlides } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { RestApiService } from "./../../rest-api.service";
import { UserprofileimageService } from "../services/userprofileimage.service";
import { AppComponent } from "./../../app.component";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { HblSelectPasscodePage } from "../hbl-select-passcode/hbl-select-passcode.page";

@Component({
  selector: "app-main-menu",
  templateUrl: "./main-menu.component.html",
  styleUrls: ["./main-menu.component.scss"],
})
export class MainMenuComponent implements OnInit {
  _username: string;
  slideOpts: any;
  userid: any;
  notificationlength: any;
  passcodeArray: any;
  dashboardDetails: any;
  userCount: any = 0;
  studentsCount: any = 0;
  baselineCount: any = 0;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public translate: TranslateService,
    public api: RestApiService,
    private userprofileimageService: UserprofileimageService,
    private parent: AppComponent,
    private modalController: ModalController,
    private screenOrientation: ScreenOrientation,
    public loadingController: LoadingController
  ) {
    this.translate.setDefaultLang("odia");
    this._username = localStorage.getItem("_username");
    this.userid = localStorage.getItem("_userid");
    parent.user_profile_image = userprofileimageService.fetchUserprofimage();

    this.NotificationData();
    setInterval(() => {
      this.NotificationData();
    }, 5000);

    // this.screenOrientation.unlock();
    // this.screenOrientation.onChange().subscribe(() => {
    //   this.screenOrientation.unlock();
    // });
    this.unlockSo();
    this.getPasscodeByManager(this.userid);
  }

  ngOnInit() {}

  unlockSo() {
    this.screenOrientation.unlock();
  }

  async NotificationData() {
    //await this.api.getnotificationdata(this.userid,1).subscribe(
    await this.api.getmessagesbyuserid(this.userid).subscribe(
      (res) => {
        // console.log("1res", res);
        // console.log("res len", res.length);
        this.notificationlength = res.length;
        //console.log(this.notificationlength);
      },
      (err) => {}
    );
  }

  ionViewWillEnter(slides: IonSlides) {
    this.menuCtrl.enable(true);
  }

  ButtonClicked(path) {
    this.api.updateviewnotification(this.userid);
    this.navController.navigateForward(path);
  }

  navigateTo() {
    this.navController.navigateForward("hbl");
  }

  async openPasscodeMOdal() {
    const modal = await this.modalController.create({
      component: HblSelectPasscodePage,
      cssClass: "transparent-modal",
    });
    modal.onDidDismiss().then((res) => {});
    return await modal.present();
  }

  async getPasscodeByManager(managerId) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.api.getPasscodeByManager(managerId).subscribe(
      (res) => {
        loading.dismiss();
        this.passcodeArray = res;
        console.log("passcode", this.passcodeArray);
        this.passcodeArray.forEach((element) => {
          if (element.passcodetype == "primary") {
            this.getDashboardDetails(element.passcode);
          } else {
            console.log("No primary passcode found");
          }
        });
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    );
  }

  async getDashboardDetails(passcode) {
    this.api.getDashboardDetails(passcode).subscribe(
      (res) => {
        this.dashboardDetails = res;
        console.log("dashboard", this.dashboardDetails);
        this.userCount = this.dashboardDetails.allusercount;
        this.studentsCount = this.dashboardDetails.allstudentcount;
        this.baselineCount = this.dashboardDetails.baselinecount;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
