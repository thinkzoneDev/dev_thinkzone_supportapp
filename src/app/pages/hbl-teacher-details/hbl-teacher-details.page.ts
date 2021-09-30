import { HblTeacherinfoPage } from "./../hbl-teacherinfo/hbl-teacherinfo.page";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { NavController, PopoverController } from "@ionic/angular";

@Component({
  selector: "app-hbl-teacher-details",
  templateUrl: "./hbl-teacher-details.page.html",
  styleUrls: ["./hbl-teacher-details.page.scss"],
})
export class HblTeacherDetailsPage implements OnInit {
  passcode: string;
  constructor(
    private navController: NavController,
    private popoverController: PopoverController,

    private route: ActivatedRoute
  ) {
    // this.route.queryParams.subscribe((params) => {
    //   // if (params && params.paramiters) {
    //   //   const qryParams = JSON.parse(params.paramiters);
    //   //   console.log("--> qryParams: " + JSON.stringify(qryParams));
    //   // }
    //   console.log(params);
    // });
    // console.log(this.passcode);
  }

  searchText: string;

  ngOnInit() {}

  teacherDetails = [
    { id: "1", name: "Abinash Shaini" },
    { id: "2", name: "guru saho" },
    { id: "3", name: "shrideep mohapatra" },
    { id: "4", name: "Rajashree biswal" },
    { id: "5", name: "Mitu sir" },
  ];

  teacherDetailsBackup = [
    { id: "1", name: "Abinash Shaini" },
    { id: "2", name: "guru saho" },
    { id: "3", name: "shrideep mohapatra" },
    { id: "4", name: "Rajashree biswal" },
    { id: "5", name: "Mitu sir" },
  ];

  goToStudentList(teacher) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        parameter: teacher,
      },
    };
    this.navController.navigateForward("/hbl", navigationExtras);
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
        return item.name.toLowerCase().includes(this.searchText.toLowerCase());
      });
      this.teacherDetails = arr1;
    } else {
      this.teacherDetails = this.teacherDetailsBackup;
    }
  }

  ionClear() {
    this.teacherDetails = this.teacherDetailsBackup;
  }
}
