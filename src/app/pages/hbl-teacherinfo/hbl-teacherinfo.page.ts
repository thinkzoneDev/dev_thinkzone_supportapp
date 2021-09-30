import { Component, OnInit } from "@angular/core";
import { NavParams } from "@ionic/angular";

@Component({
  selector: "app-hbl-teacherinfo",
  templateUrl: "./hbl-teacherinfo.page.html",
  styleUrls: ["./hbl-teacherinfo.page.scss"],
})
export class HblTeacherinfoPage implements OnInit {
  teachrDetails: any;
  constructor(private navParams: NavParams) {
    this.teachrDetails = this.navParams.data.res.userDetails;
    console.log(this.teachrDetails);
  }

  ngOnInit() {}
}
