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
  selector: "app-hblschool-wisedata",
  templateUrl: "./hblschool-wisedata.page.html",
  styleUrls: ["./hblschool-wisedata.page.scss"],
})
export class HblschoolWisedataPage implements OnInit {
  showtable: boolean = true;
  studentClass: string;
  passcode: string;
  udiseCode: string;
  userid: string = localStorage.getItem("_userid");
  studentDetails: string[];
  res: any;
  teacherArray: any;
  schoolName: string;

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
    this.passcode = this.res.passcode;
    this.udiseCode = this.res.udisecode;
    this.schoolName = this.res.schoolName;
    this.studentClass = "1";

    this.getAllTeachersUnderSchool(this.passcode, this.udiseCode);
  }
  ngOnInit() {}

  //Get all Teachers Under Passcode And School
  async getAllTeachersUnderSchool(passcode, udisecode) {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api.getAllTeachersUnderSchool(passcode, udisecode).subscribe(
      (res) => {
        loading.dismiss();
        this.teacherArray = res[0].user;
        this.loadData(this.studentClass, this.teacherArray);
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    );
  }

  async classOnChange(e) {
    this.studentClass = e.target.value;
    console.log(this.studentClass);
    this.loadData(this.studentClass, this.teacherArray);
  }

  async loadData(studentClass, teacherArray) {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api.getStudentsDataByClass(studentClass, teacherArray).subscribe(
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
            "No Data found for month " + this.studentClass
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
