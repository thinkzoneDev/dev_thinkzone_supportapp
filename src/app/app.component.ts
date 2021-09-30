import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  NgZone,
} from "@angular/core";
import {
  Platform,
  NavController,
  IonRouterOutlet,
  AlertController,
  Events,
} from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Router } from "@angular/router";
import { Pages } from "./interfaces/pages";

import { RestApiService } from "./rest-api.service";

import { TranslateService } from "@ngx-translate/core";

import { ActionSheetController } from "@ionic/angular";

// push notification
import { FCM } from "@ionic-native/fcm/ngx";

import { UserprofileimageService } from "./pages/services/userprofileimage.service";
@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  public appPages: Array<{}>;
  _userid: string;
  _username: string;
  _emailid: string;
  Language = false;
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  engLanguage: Boolean = true;
  isLanguage: any;
  isChecked: boolean = false;
  passcodeArray: any;
  //@ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;
  @ViewChild(IonRouterOutlet) routerOutlet: IonRouterOutlet;

  user_profile_image: string = ""; // default user image

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private alertController: AlertController,
    private fcm: FCM,
    private router: Router,
    public Loggedevents: Events,
    public translate: TranslateService,
    public _ngZone: NgZone,
    public api: RestApiService,
    public actionSheetController: ActionSheetController,
    private userprofileimageService: UserprofileimageService
  ) {
    this.user_profile_image = userprofileimageService.fetchUserprofimage();
    this.translate.setDefaultLang("odia");

    this.backButtonEvent();

    this.appPages = [
      {
        title: "Centers",
        url: "/centers",
        direct: "forward",
        icon: "../assets/icon/student.png",
        img: "../assets/icon/student.png",
        isimg: true,
      },
      {
        title: "Calendar to do",
        url: "/calender-todo",
        direct: "forward",
        icon: "../assets/icon/calender.png",
        img: "../assets/icon/calender.png",
        isimg: true,
      },
      {
        title: "Training Assessment",
        url: "/training",
        direct: "forward",
        icon: "../assets/icon/training.png",
        img: "../assets/icon/training.png",
        isimg: true,
      },
      {
        title: "Gallery",
        url: "/manager-box",
        direct: "forward",
        icon: "../assets/icon/gal.png",
        img: "../assets/icon/gal.png",
        isimg: true,
      },
      {
        title: "Survey",
        url: "/survey-issues",
        direct: "forward",
        icon: "../assets/icon/ass.png",
        img: "../assets/icon/ass.png",
        isimg: true,
      },
      {
        title: "Messages",
        url: "/message",
        direct: "forward",
        icon: "mail-unread",
      },
      {
        title: "About",
        url: "/about",
        direct: "forward",
        icon: "at",
      },
    ];

    this._userid = localStorage.getItem("_userid");

    if (this._userid == null) {
      this.navCtrl.navigateRoot("/");
    } else {
      // setTimeout(() => {
      this.setUserDetails();
      // }, 2000)

      this.navCtrl.navigateRoot("/main-menu");

      // if(this.tapped){
      //   this.router.navigate(['/message'], { queryParams: { data: JSON.stringify(this.tapped) } });
      // } else {
      //   this.navCtrl.navigateRoot('/main-menu');
      // }
    }

    this.Loggedevents.subscribe("Logged", (data) => {
      this.setUserDetails();
    });

    this.initializeApp();
  }
  ischeck: boolean = false;
  tapped = null;

  toggleTheme(event) {
    if (event.detail.checked) {
      document.body.setAttribute("color-theme", "dark");
    } else {
      document.body.setAttribute("color-theme", "light");
    }
  }

  // --->>>Below code commented because default language set to Odia<<<---
  // async presentActionSheet() {
  //   let EnglishButton: any = {
  //     text: "English",
  //     role: "destructive",
  //     handler: () => {
  //       this.updateCheckedOptions("Eng");
  //     },
  //   };

  //   let odiaButton: any = {
  //     text: "ଓଡିଆ",
  //     handler: () => {
  //       this.updateCheckedOptions("Odia");
  //     },
  //   };
  //   if (this.ischeck) {
  //     odiaButton.cssClass = "icon-drink actionSheet_withIcomoon";
  //   } else {
  //     EnglishButton.cssClass = "icon-drink actionSheet_withIcomoon";
  //   }

  //   const actionSheet = await this.actionSheetController.create({
  //     header: "Language",
  //     buttons: [
  //       EnglishButton,
  //       odiaButton,
  //       {
  //         text: "Cancel",
  //         icon: "close",
  //         role: "cancel",
  //         handler: () => {},
  //       },
  //     ],
  //   });
  //   await actionSheet.present();
  // }

  // updateCheckedOptions(type) {
  //   this.ischeck = false;
  //   if (type == "Eng") {
  //     this.engLanguage = !this.engLanguage;
  //     this.translate.setDefaultLang("en");
  //   } else {
  //     this.engLanguage = !this.engLanguage;
  //     this.translate.setDefaultLang("odia");
  //     this.ischeck = true;
  //   }

  //   // this.engLanguage = !this.engLanguage;
  //   // if(this.engLanguage)
  //   // this.translate.setDefaultLang('en');
  //   // else
  //   // this.translate.setDefaultLang('odia');
  // }

  setUserDetails() {
    this._ngZone.run(() => {
      this._username = localStorage.getItem("_username");
      this._emailid = localStorage.getItem("_emailid");
    });
  }

  initializeApp() {
    this.platform
      .ready()
      .then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide(); // Push notification starts from here
        this.fcm.getToken().then((token) => {
          localStorage.setItem("fcm_token", token);
          this.api.adduserdevice();
        });

        this.fcm.onTokenRefresh().subscribe((token) => {
          localStorage.setItem("fcm_rtoken", token);
          this.api.adduserdevice();
        });

        this.fcm.onNotification().subscribe((data) => {
          if (data.wasTapped) {
            //this.router.navigate(['/showpushnotification', data.message]);
            // this.router.navigate(['/message'], data);
            //alert("here");

            //this.tapped = data;

            this.router.navigate(["/message"], {
              queryParams: { data: JSON.stringify(data) },
            });
          } else {
            //this.router.navigate(['/showpushnotification', data.message]);
            //this.tapped = null;
          }
        });
      })
      .catch(() => {});
  }

  goToEditProgile() {
    this.navCtrl.navigateForward("edit-profile");
  }

  changelanguage(event, language) {}
  searchData(event) {}
  async logout() {
    const alert = await this.alertController.create({
      header: "Logout",
      subHeader: "",
      message: "Are you Sure?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Ok",
          handler: async () => {
            let token = localStorage.getItem("fcm_token");
            let rtoken = localStorage.getItem("fcm_rtoken");

            this.navCtrl.navigateRoot("/");
            const data = { userid: this._emailid, deviceId: token };
            await this.api.removeuserdevice(data).subscribe(
              (res) => {},
              (err) => {}
            );
            localStorage.clear();
            localStorage.setItem("fcm_token", token);
            localStorage.setItem("fcm_rtoken", rtoken);
          },
        },
      ],
    });
    await alert.present();
  }
  showLanguage() {
    this.Language = !this.Language;
  }
  backButtonEvent() {
    this.platform.backButton.subscribeWithPriority(0, () => {
      if (this.routerOutlet && this.routerOutlet.canGoBack()) {
        this.routerOutlet.pop();
      } /*else if (this.router.url === '/center') {
        this.navCtrl.navigateRoot('/home-results');
      }*/ else {
        this.exitTheApp(this.router.url);
      }
    });
  }

  async exitTheApp(url) {
    const alert = await this.alertController.create({
      header: "Exit",
      subHeader: "",
      message: "Are you Sure?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: (blah) => {},
        },
        {
          text: "Ok",
          handler: () => {
            navigator["app"].exitApp();
          },
        },
      ],
    });
    await alert.present();
  }
}
