import { Component, OnInit } from "@angular/core";
import {
  AlertController,
  LoadingController,
  ModalController,
  NavParams,
} from "@ionic/angular";
import { RestApiService } from "./../../rest-api.service";

@Component({
  selector: "app-school-details",
  templateUrl: "./school-details.page.html",
  styleUrls: ["./school-details.page.scss"],
})
export class SchoolDetailsPage implements OnInit {
  udisecode: string;
  passcode: string;
  studentClass: string = "all";
  schoolName: string;
  teacherArray: string[];
  studentDetails: string[];
  studentsregistred: number = 0;
  baselineComplete: number = 0;

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    public loadingController: LoadingController,
    public api: RestApiService,
    public alertController: AlertController
  ) {
    this.udisecode = this.navParams.data.res.udiseCode;
    this.passcode = this.navParams.data.res.passcode;
    this.schoolName = this.navParams.data.res.schoolName;
    console.log(this.udisecode, this.passcode, this.schoolName);
  }

  ngOnInit() {
    this.getAllTeachersUnderSchool(this.passcode, this.udisecode);
  }

  //Get all Teachers Under Passcode And School
  async getAllTeachersUnderSchool(passcode, udisecode) {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api.getAllTeachersUnderSchool(passcode, udisecode).subscribe(
      (res) => {
        loading.dismiss();
        this.teacherArray = res[0].user;
        this.getStudentsDataByClass(this.studentClass, this.teacherArray);
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    );
  }

  async getStudentsDataByClass(studentClass, userArray) {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api.getStudentsDataByClass(studentClass, userArray).subscribe(
      (res) => {
        loading.dismiss();
        if (res.length > 0) {
          this.studentsregistred = res.length;
          res.forEach((element) => {
            if (element.mainbaselinestatus == "yes") {
              this.baselineComplete += 1;
            }
          });
        } else {
          this.studentDetails = [];
          this.showConfirm(
            "Alert",
            "",
            "No Students Registred in " + this.schoolName + " school"
          );
          this.closeModal();
        }
      },
      (err) => {
        console.error(err);
        loading.dismiss();
      }
    );
  }

  closeModal() {
    this.modalCtrl.dismiss();
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
}
