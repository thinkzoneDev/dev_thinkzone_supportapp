import { Component, OnInit } from "@angular/core";
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController,
} from "@ionic/angular";

import { ActivatedRoute } from "@angular/router";
import { RestApiService } from "./../../rest-api.service";
import { MessagebodyPage } from "./../modal/messagebody/messagebody.page";

@Component({
  selector: "app-message",
  templateUrl: "./message.page.html",
  styleUrls: ["./message.page.scss"],
})
export class MessagePage implements OnInit {
  isUnread: boolean = false;

  userid: string = localStorage.getItem("_userid");
  respons: [any];
  my_key: any;
  searchText: string;
  notification_bkp: any;

  notificationdata: [];
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private route: ActivatedRoute,
    private loadingController: LoadingController
  ) {
    // this.NotificationData();

    this.route.queryParams.subscribe((params) => {
      console.log(params);

      const _geturldata = JSON.parse(params.data);
      this.openMessage(_geturldata);
    });
  }

  ngOnInit() {
    this.getResponse();
  }

  async NotificationData() {
    const self = this;
    await this.api.getnotificationdata(this.userid, 0).subscribe(
      (res) => {
        // console.log("2res", res);
        // console.log("2 res len", res.length);
        self.notificationdata = res;
        console.log("self.notificationdata", self.notificationdata);
      },
      (err) => {}
    );
  }
  async getResponse() {
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getmessagesbyuserid(this.userid).subscribe(
      (res) => {
        loading.dismiss();
        this.respons = res;
        this.notificationdata = res;
        console.log("this.respons", this.notificationdata);
        this.notification_bkp = this.notificationdata;
      },
      (err) => {
        loading.dismiss();
      }
    );
  }

  onSearch(event) {
    const input = (this.searchText = event.target.value);

    if (input != null && input != undefined && input.length >= 0) {
      console.log("if");
      let array = this.notification_bkp.filter((item) => {
        return item.title
          .toLocaleLowerCase()
          .includes(input.toLocaleLowerCase());
      });
      this.notificationdata = array;
    } else {
      console.log("else");
      this.notificationdata = this.notification_bkp;
    }
  }

  ionClear() {
    this.notificationdata = this.notification_bkp;
  }

  async openMessage(res) {
    // this.userunreadmessage.updateuserunreadmessage();
    const modal = await this.modalController.create({
      component: MessagebodyPage,
      componentProps: { res: res }, // <-- this is used to pass data from  this page to the modal page that will open on click
    });
    this.updateMessageStatus(res);
    return await modal.present();
  }
  async updateMessageStatus(res) {
    if (res["status"] === "unread") {
      const _id = res["_id"];
      const id = res["id"];
      const userid = res["userid"];
      const title = res["title"];
      const message = res["message"];
      const status = "read";
      const readon = new Date();

      const body = {
        id: id,
        userid: userid,
        title: title,
        message: message,
        status: status,
        readon: readon,
      };

      const loading = await this.loadingController.create({});
      await loading.present();
      await this.api.updatemessagebyid(_id, body).subscribe(
        (res) => {
          loading.dismiss();
          // this.getResponse();
        },
        (err) => {
          loading.dismiss();
        }
      );
      this.getResponse();
    }
  }
  // async openMessage(res) {
  //     console.log("12345 here",res)
  //     const modal = await this.modalController.create({
  //         component: MessagebodyPage,
  //         componentProps: { res: res } //<-- this is used to pass data from  this page to the modal page that will open on click
  //     });
  //     this.updateMessageStatus(res);
  //     return await modal.present();
  // }
  // async updateMessageStatus(res) {
  //     console.log("12345",res)
  //     if (res.status == 'unread') {
  //         let _id = res._id;
  //         let id = res.id;
  //         let userid = res.userid;
  //         let title = res.title;
  //         let message = res.message;
  //         let status = 'read';
  //         let readon = new Date;

  //         const body = {
  //             id: id,
  //             userid: userid,
  //             title: title,
  //             message: message,
  //             status: status,
  //             readon: readon
  //         };

  //         let loading = await this.loadingController.create({});
  //         await loading.present();
  //         await this.api.updatemessagebyid(_id, body)
  //             .subscribe(res => {
  //                 loading.dismiss();
  //             }, err => {
  //                 loading.dismiss();
  //             });
  //         this.getResponse();
  //     }
  // }
}
