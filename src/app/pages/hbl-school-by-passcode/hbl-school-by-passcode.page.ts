import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  LoadingController,
  ModalController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { RestApiService } from "src/app/rest-api.service";

import { HblschoolWisedataPage } from "../hblschool-wisedata/hblschool-wisedata.page";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { SchoolDetailsPage } from "../school-details/school-details.page";

@Component({
  selector: "app-hbl-school-by-passcode",
  templateUrl: "./hbl-school-by-passcode.page.html",
  styleUrls: ["./hbl-school-by-passcode.page.scss"],
})
export class HblSchoolByPasscodePage implements OnInit {
  passcode: any;
  searchText: string;
  managerId: any = localStorage.getItem("_userid");
  schoolDetails: string[];
  schoolDetailsBackup: any;
  schoolAvailabe: boolean;
  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private popoverController: PopoverController,
    public api: RestApiService,
    public loadingController: LoadingController,
    private modalController: ModalController,
    private screenOrientation: ScreenOrientation
  ) {
    this.route.queryParams.subscribe((params) => {
      this.passcode = params.passcode;
      this.getAllScholsUnderPasscode(this.passcode);
    });
  }

  ngOnInit() {}
  async getAllScholsUnderPasscode(passcode) {
    const loading = await this.loadingController.create();
    await loading.present();
    this.api.getAllScholsUnderPasscode(passcode).subscribe(
      (res) => {
        loading.dismiss();
        console.log(res.udisecodelist);
        if (res.udisecodelist.length > 0) {
          this.schoolAvailabe = true;
          this.schoolDetails = res.udisecodelist;
          this.schoolDetailsBackup = this.schoolDetails;
        } else {
          this.schoolAvailabe = false;
        }
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    );
  }

  async goToStudentList(udisecode, schoolname) {
    const modal = await this.modalController.create({
      component: HblschoolWisedataPage,
      componentProps: {
        res: {
          udisecode: udisecode,
          passcode: this.passcode,
          schoolName: schoolname,
        },
      },
    });
    modal.onDidDismiss().then((res) => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
    return await modal.present();
  }

  search_school(event) {
    this.searchText = event.target.value;
    if (
      this.searchText != null &&
      this.searchText != undefined &&
      this.searchText.length >= 0
    ) {
      let arr1 = this.schoolDetailsBackup.filter((item) => {
        return item.schoolname
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      });
      this.schoolDetails = arr1;
      if (this.schoolDetails.length > 0) {
        this.schoolAvailabe = true;
      } else {
        this.schoolAvailabe = false;
      }
    } else {
      this.schoolDetails = this.schoolDetailsBackup;
    }
  }

  ionClear() {
    this.schoolDetails = this.schoolDetailsBackup;
  }

  async schoolDetailsPae(udisecode, schoolname) {
    const modal = await this.modalController.create({
      component: SchoolDetailsPage,
      cssClass: "transparent-modal",
      componentProps: {
        res: {
          udiseCode: udisecode,
          passcode: this.passcode,
          schoolName: schoolname,
        },
      },
      showBackdrop: true,
    });
    modal.onDidDismiss().then((data) => {});
    return await modal.present();
  }
}
