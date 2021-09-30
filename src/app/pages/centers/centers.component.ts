import { Component, OnInit } from "@angular/core";
import {
  LoadingController,
  NavController,
  AlertController,
} from "@ionic/angular";

import { RestApiService } from "./../../rest-api.service";

declare var $;

@Component({
  selector: "app-centers",
  templateUrl: "./centers.component.html",
  styleUrls: ["./centers.component.scss"],
})
export class CentersComponent implements OnInit {
  hideShowDiv = true;
  ShowSchoolDiv = false;
  ShowfellowDiv = false;
  Tempcenters: any = [];
  isSearch: any;
  aganData: any = [
    { name: "Center1" },
    { name: "Center1" },
    { name: "Center1" },
    { name: "Center1" },
  ];
  centers: any = [];
  schoolCenters: any = [];
  fellowCenters: any = [];
  _isData = false;
  constructor(
    public api: RestApiService,
    public loadingController: LoadingController,
    public navCtrl: NavController,
    public alertController: AlertController
  ) {
    this.getCenterData();
    setTimeout(() => {
      $(".SchoolshowhideAnimation").hide();
      $(".FelloshowhideAnimation").hide();
    }, 500);
  }

  ngOnInit() {}

  ShowHideDiv(val) {
    if (val == 0) {
      this.hideShowDiv = !this.hideShowDiv;
      if (!this.hideShowDiv) {
        $(".showhideAnimation").hide(700);
      } else {
        this.ShowSchoolDiv = false;
        this.ShowfellowDiv = false;
        $(".showhideAnimation").show(800);
        $(".SchoolshowhideAnimation").hide();
        $(".FelloshowhideAnimation").hide();
      }
    } else if (val == 1) {
      this.ShowSchoolDiv = !this.ShowSchoolDiv;
      if (!this.ShowSchoolDiv) {
        $(".SchoolshowhideAnimation").hide(700);
      } else {
        this.hideShowDiv = false;
        this.ShowfellowDiv = false;
        $(".SchoolshowhideAnimation").show(800);
        $(".showhideAnimation").hide();
        $(".FelloshowhideAnimation").hide();
      }
    } else {
      this.ShowfellowDiv = !this.ShowfellowDiv;
      if (!this.ShowfellowDiv) {
        $(".FelloshowhideAnimation").hide(700);
      } else {
        this.hideShowDiv = false;
        this.ShowSchoolDiv = false;
        $(".FelloshowhideAnimation").show(800);
        $(".showhideAnimation").hide();
        $(".SchoolshowhideAnimation").hide();
      }
    }
  }

  async moveToIssues(center) {
    console.log("@@--> center: " + JSON.stringify(center));
    console.log(
      "@@--> centertype: " +
        center.centertype +
        "    centername: " +
        center.centername +
        "    centerid: " +
        center.centerid +
        "    usertype: " +
        center.usertype
    );
    localStorage.setItem("_centertype", center.usertype); //centertype
    localStorage.setItem("_centername", center.centername);
    localStorage.setItem("_centerid", center.centerid);
    let body = {
      userid: localStorage.getItem("_userid"),
      usertype: localStorage.getItem("_centertype"),
      centerid: localStorage.getItem("_centerid"),
    };
    //set value in localstorey
    //
    const loading = await this.loadingController.create({});
    await loading.present();
    var _instance = this;
    this.api.checkemanagersfeedbackdetails(body).subscribe(async (res) => {
      await loading.dismiss();
      if (res.allowed) {
        _instance.navCtrl.navigateForward("/issues");
      } else {
        _instance.showAlert("Feedback", res.message);
      }
    });
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      //  subHeader: subHeader,
      message: message,
      buttons: ["OK"],
    });
    await alert.present();
  }

  searchaData(event) {
    let iscenters = [];
    if (event.target.value) {
      console.log(event.target.value);
      iscenters = this.Tempcenters.filter((item) => {
        return (
          (item.centername || "")
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) >= 0 ||
          (item.block || "")
            .toLowerCase()
            .indexOf(event.target.value.toLowerCase()) >= 0
        );
      });
      console.log(iscenters);
    } else {
      iscenters = this.Tempcenters;
    }

    this.centers = iscenters.filter((data) => data.centertype == "anganwadi");
    this.schoolCenters = iscenters.filter(
      (data) => data.centertype == "school"
    );
    this.fellowCenters = iscenters.filter(
      (data) => data.centertype == "fellow"
    );

    this.ShowSchoolDiv = true;
    this.ShowfellowDiv = true;
    this.hideShowDiv = true;

    $(".showhideAnimation").show(300);
    $(".SchoolshowhideAnimation").show(300);
    $(".FelloshowhideAnimation").show(300);

    const _data =
      this.centers.length == 0 ? (this._isData = true) : (this._isData = false);
  }
  /*
  async getCenterData() {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api.getallcentersallocatedbyuserid(localStorage.getItem('_userid')).subscribe(res => {
        if (Object.keys(res).length > 0) {
          this.Tempcenters = res[0] ? res[0]['centers'] : [];
          const data = this.Tempcenters
          let _self = this;
          this.schoolCenters = [];
          this.centers = [];
          this.fellowCenters = []
          if (data && data.length > 0) {
            const totalCenters = data
            totalCenters.forEach(function(value){
              if(value &&  value.centertype && value.centertype.toLowerCase()  == "anganwadi"){
                _self.centers.push(value);
              }
              if(value && value.centertype && value.centertype.toLowerCase() == "school"){
                _self.schoolCenters.push(value);
              }
              if(value && value.centertype && value.centertype.toLowerCase() == "fellow"){
                _self.fellowCenters.push(value);
              }
            })
            if (this.centers.length == 0) {
              this._isData = true;
            }
          }
        } else {
          this.centers = [];
        }
      }, err => {
      });
    setTimeout(() => {
      loading.dismiss();
    }, 600)
  }
  */
  async getCenterData() {
    const loading = await this.loadingController.create({});
    await loading.present();
    this.api
      .getallcentersallocatedbyuserid(localStorage.getItem("_userid"))
      .subscribe(
        (res) => {
          //console.log('@@--> res: '+JSON.stringify(res));
          if (Object.keys(res).length > 0) {
            const data = res ? res : [];

            this.centers = [];
            this.schoolCenters = [];
            this.fellowCenters = [];

            if (data && data.length > 0) {
              this.centers = data.filter(
                (obj) =>
                  obj &&
                  obj.usertype &&
                  obj.usertype.toLowerCase() == "anganwadi"
              );
              this.schoolCenters = data.filter(
                (obj) =>
                  obj && obj.usertype && obj.usertype.toLowerCase() == "school"
              );
              this.fellowCenters = data.filter(
                (obj) =>
                  obj && obj.usertype && obj.usertype.toLowerCase() == "fellow"
              );

              if (this.centers.length == 0) {
                this._isData = true;
              }
            }
            loading.dismiss();
          } else {
            this.centers = [];
            loading.dismiss();
          }
        },
        (err) => {
          loading.dismiss();
        }
      );
  }

  getColor() {
    return "#" + ((Math.random() * 0xffffff) << 0).toString(16);
  }

  setCenters(data) {}
}
