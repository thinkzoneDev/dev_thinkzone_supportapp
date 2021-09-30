import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  AlertController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

@Component({
  selector: "app-hbl",
  templateUrl: "./hbl.page.html",
  styleUrls: ["./hbl.page.scss"],
})
export class HblPage implements OnInit {
  showtable: boolean = true;
  selectedMonth: number;
  passcode: string;
  teacherId: string;
  userid: string = localStorage.getItem("_userid");
  studentDetails: string[];
  res: any;

  constructor(
    public api: RestApiService,
    public alertController: AlertController,
    private route: ActivatedRoute,
    public loadingController: LoadingController,
    public navParams: NavParams,
    private screenOrientation: ScreenOrientation,
    public modalController: ModalController
  ) {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    this.res = this.navParams.data.res;
    console.log(this.res);
    this.passcode = this.res.passcode;
    this.teacherId = this.res.teacherId;
    console.log(this.screenOrientation.type);

    this.showConfirm(
      "Message",
      "",
      "Please Select the month to get student details"
    );
  }
  ngOnInit() {}

  monthlist = [
    { value: 1, month: "Month 1" },
    { value: 2, month: "Month 2" },
    { value: 3, month: "Month 3" },
    { value: 4, month: "Month 4" },
    { value: 5, month: "Month 5" },
    { value: 6, month: "Month 6" },
    { value: 7, month: "Month 7" },
    { value: 8, month: "Month 8" },
    { value: 9, month: "Month 9" },
    { value: 10, month: "Month 10" },
    { value: 11, month: "Month 11" },
    { value: 12, month: "Month 12" },
  ];

  async selectOnChange_month(e) {
    this.selectedMonth = e.target.value;
    const year = new Date().getFullYear();
    console.log(year, this.selectedMonth);
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api
      .getpostcallactivities(this.teacherId, this.selectedMonth, year)
      .subscribe(
        (res) => {
          loading.dismiss();
          if (res.length > 0) {
            this.studentDetails = res;
            console.log(this.studentDetails);
            this.showtable = true;
          } else {
            this.showtable = false;
            this.studentDetails = [];
            this.showConfirm(
              "Alert",
              "",
              "No Data found for month " + this.selectedMonth
            );
          }
        },
        (err) => {
          console.error(err);
          loading.dismiss();
        }
      );
  }

  // confirm box
  async showConfirm(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {},
        },
        {
          text: "Ok",
          handler: () => {},
        },
      ],
    });
    await alert.present();
  }

  //Close modal
  closeModal() {
    this.screenOrientation.lock(
      this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY
    );
    this.modalController.dismiss();
  }
}
