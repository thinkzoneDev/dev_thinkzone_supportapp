import { Component, OnInit } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import {
  ModalController,
  LoadingController,
  AlertController,
} from "@ionic/angular";
import { RestApiService } from "src/app/rest-api.service";
import { NavController, PopoverController, NavParams } from "@ionic/angular";
@Component({
  selector: "app-hbl-select-passcode",
  templateUrl: "./hbl-select-passcode.page.html",
  styleUrls: ["./hbl-select-passcode.page.scss"],
})
export class HblSelectPasscodePage implements OnInit {
  managerId: string;
  passcodeArray: string[];
  managerType: string;
  constructor(
    private modalController: ModalController,
    private navController: NavController,
    public api: RestApiService,
    public loadingController: LoadingController,
    private router: Router,
    public alertController: AlertController
  ) {
    this.managerId = localStorage.getItem("_userid");
    this.managerType = localStorage.getItem("managertype");
    this.getPasscodeByManager(this.managerId);
  }

  ngOnInit() {}

  async getPasscodeByManager(managerId) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.api.getPasscodeByManager(managerId).subscribe(
      (res) => {
        loading.dismiss();
        if (res.length > 0) {
          this.passcodeArray = res;
          console.log(this.passcodeArray);
        } else {
          this.showConfirm("Message", "", "No Passcode Found");
          this.closeModal();
        }
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    );
  }

  async goToTeacherDetails(passcode) {
    this.closeModal();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        passcode: passcode,
      },
    };
    if (this.managerType == "manager") {
      this.navController.navigateForward(
        ["hblpasscodewiseteacher"],
        navigationExtras
      );
    } else if (this.managerType == "crc") {
      this.navController.navigateForward(
        ["hbl-school-by-passcode"],
        navigationExtras
      );
    } else {
      this.closeModal();
    }
  }

  closeModal() {
    this.modalController.dismiss(null, "backdrop");
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
