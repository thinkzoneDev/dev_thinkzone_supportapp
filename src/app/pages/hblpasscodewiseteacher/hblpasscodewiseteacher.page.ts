import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import {
  LoadingController,
  ModalController,
  NavController,
  PopoverController,
} from "@ionic/angular";
import { RestApiService } from "src/app/rest-api.service";
import { HblTeacherinfoPage } from "../hbl-teacherinfo/hbl-teacherinfo.page";
import { HblPage } from "../hbl/hbl.page";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";

@Component({
  selector: "app-hblpasscodewiseteacher",
  templateUrl: "./hblpasscodewiseteacher.page.html",
  styleUrls: ["./hblpasscodewiseteacher.page.scss"],
})
export class HblpasscodewiseteacherPage implements OnInit {
  passcode: any;
  searchText: string;
  managerId: any = localStorage.getItem("_userid");
  teacherDetails: string[];
  teacherDetailsBackup: any;
  teachrAvailabe: boolean;

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
      this.getAllTeachersUnderManager(this.managerId, this.passcode);
    });
  }

  ngOnInit() {}

  async getAllTeachersUnderManager(managerId, passcode) {
    console.log("ManagerDI", managerId, passcode);

    const loading = await this.loadingController.create();
    await loading.present();
    this.api.getAllTeachersUnderManager(managerId, passcode).subscribe(
      (res) => {
        loading.dismiss();
        console.log("--->", res);

        if (res.length > 0) {
          this.teachrAvailabe = true;
          this.teacherDetails = res;
          this.teacherDetailsBackup = this.teacherDetails;
        } else {
          this.teachrAvailabe = false;
        }
      },
      (err) => {
        loading.dismiss();
        console.log(err);
      }
    );
  }

  async goToStudentList(teacher) {
    // const navigationExtras: NavigationExtras = {
    //   queryParams: {
    //     teacherId: teacher,
    //     passcode: this.passcode,
    //   },
    // };
    // this.navController.navigateForward("/hbl", navigationExtras);
    const modal = await this.modalController.create({
      component: HblPage,
      componentProps: {
        res: {
          teacherId: teacher,
          passcode: this.passcode,
        },
      },
    });
    modal.onDidDismiss().then((res) => {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    });
    return await modal.present();
  }

  async goToTeacherInfo(user) {
    console.log(user);
    const popover = await this.popoverController.create({
      component: HblTeacherinfoPage,
      cssClass: "contact-popover",
      componentProps: {
        res: {
          userDetails: user,
        },
      },
      showBackdrop: true,
      translucent: true,
      animated: true,
    });
    popover.onDidDismiss().then(() => {});
    return await popover.present();
  }

  search_student(event) {
    this.searchText = event.target.value;
    if (
      this.searchText != null &&
      this.searchText != undefined &&
      this.searchText.length >= 0
    ) {
      let arr1 = this.teacherDetailsBackup.filter((item) => {
        return item.username
          .toLowerCase()
          .includes(this.searchText.toLowerCase());
      });
      this.teacherDetails = arr1;
      if (this.teacherDetails.length > 0) {
        this.teachrAvailabe = true;
      } else {
        this.teachrAvailabe = false;
      }
    } else {
      this.teacherDetails = this.teacherDetailsBackup;
    }
  }

  ionClear() {
    this.teacherDetails = this.teacherDetailsBackup;
  }
}
