import { Component, OnInit } from "@angular/core";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";

import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
  Events,
} from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";

@Component({
  selector: "app-addTask",
  templateUrl: "./addTask.page.html",
  styleUrls: ["./addTask.page.scss"],
})
export class AddTaskPage implements OnInit {
  respons: any;
  main_arr: any = [];
  description: any;
  task: any;
  userid: any;
  todayDate: any;
  selectedate: any;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    public route: ActivatedRoute,
    private localNotifications: LocalNotifications,
    private loadingController: LoadingController,
    public events1: Events
  ) {
    this.userid = localStorage.getItem("_userid");
    this.todayDate = this.route.snapshot.params["selectdate"];
    var date1 = this.todayDate.split("-");
    var newDate = date1[1] + "/" + date1[0] + "/" + date1[2];
    this.selectedate = new Date(newDate).toISOString();
    // var tempdate= new Date( parseInt(date1[2]), parseInt(date1[1]) -1 , parseInt(date1[0]));
    // var day = 60 * 60 * 24 * 1000;
    // var endDate = new Date(tempdate.getTime() + day);
    // this.selectedate = endDate.toISOString();
  }

  ngOnInit() {}
  selected_time;
  allHours = [];
  async savetask() {
    if (
      this.task != undefined &&
      this.description != undefined &&
      this.userid != undefined
    ) {
      const select_time = new Date(this.selected_time);
      const hours = select_time.getHours();
      const minutes = select_time.getMinutes();
      const seconds = select_time.getSeconds();

      const getDate = new Date(this.selectedate).setHours(
        hours,
        minutes,
        seconds
      );
      let body = {
        task: this.task,
        description: this.description,
        userid: this.userid,
        status: "pending",
        task_date: new Date(getDate).toISOString(), //this.selectedate.setHours(hours, minutes, seconds),
      };
      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.Manager_task(body).subscribe(
        (res) => {},
        (err) => {}
      );

      loading.dismiss();

      const event_date_temp = new Date(this.selectedate);
      const event_date_1 = new Date(
        event_date_temp.getFullYear(),
        event_date_temp.getMonth(),
        event_date_temp.getDate(),
        hours - 1,
        minutes,
        0
      );

      const event_date_2 = new Date(
        event_date_temp.getFullYear(),
        event_date_temp.getMonth(),
        event_date_temp.getDate(),
        hours - 2,
        minutes,
        0
      );

      const event_date_3 = new Date(
        event_date_temp.getFullYear(),
        event_date_temp.getMonth(),
        event_date_temp.getDate(),
        hours - 3,
        minutes,
        0
      );

      this.allHours.push(event_date_1, event_date_2, event_date_3);
      for (var i = 0; i < 3; i++) {
        if (this.allHours[i] > new Date()) {
          var time = this.allHours[i].toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          var title = this.task + " at " + time;
          this.localNotifications.schedule({
            id: Math.floor(1000 + Math.random() * 9000),
            title: title,
            text: this.description,
            trigger: { at: this.allHours[i] },
            // trigger: {at: new Date(new Date().getTime() + 3600)},
            led: "FF0000",
            sound: null,
            foreground: true,
            vibrate: true,
          });
        }
      }
      this.events1.publish("AddedTask", "Hello from page1!");
      this.toast("Save successfully");
      this.task = "";
      this.description = "";

      this.navCtrl.pop();
    } else {
      this.toast("All field is mandatory");
    }
  }

  async toast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: "bottom",
      closeButtonText: "OK",
      showCloseButton: true,
    });
    toast.present();
  }
}
