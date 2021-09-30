import { Component, OnInit } from "@angular/core";

import { UserprofileimageService } from "../services/userprofileimage.service";
import { AppComponent } from "./../../app.component";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  username: string;
  userid: any;
  email: string;
  passcode: string;

  constructor(
    private userprofileimageService: UserprofileimageService,
    public parent: AppComponent
  ) {
    this.username = localStorage.getItem("_username");
    this.userid = localStorage.getItem("_userid");
    this.email = localStorage.getItem("_emailid");
    this.passcode = localStorage.getItem("_passcode");
    parent.user_profile_image = userprofileimageService.fetchUserprofimage();
  }

  ngOnInit() {}
}
