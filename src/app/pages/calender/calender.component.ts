import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, MenuController, LoadingController, Events } from '@ionic/angular';
import * as moment from "moment";

import { RestApiService } from './../../rest-api.service';

@Component({
  selector: "app-calender",
  templateUrl: "./calender.component.html",
  styleUrls: ["./calender.component.scss"]
})
export class CalenderComponent implements OnInit {
  calendar: any;
  eventSource: any = [];
  isUpToday: any = Date;
  gtUpToday: any = Date;

  isToday: boolean;
  viewTitle: any;
  selectDate: any;
  userid: any;
  Task = "Task";
  complete: any = "";
  Description = "Description";

  showdata = false;

  selectStatus: any;
  selectedId: any;
  showHideAddIcon: boolean = true;
  TaskData: any = [];

  selectformatData: any;
  istodate: any;

  currentDate: any = new Date();
  showTaskDate: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public api: RestApiService,
    private alertController: AlertController,
    public loadingController: LoadingController,
    public events2: Events
  ) {

    this.events2.subscribe('AddedTask', (data) => {
      this.getData();
    });
    this.getData();

    this.userid = localStorage.getItem("_userid")
    this.calendar = {
      mode: "month",
      currentDate: new Date()
    };
  }

  ngOnInit() { }
  onCurrentDateChanged(event: Date) {
    this.isUpToday = new Date(event);
    if (this.isUpToday.getMonth() != this.currentDate.getMonth()) {
      this.currentDate = this.isUpToday;
      this.getData();
    }


    this.gtUpToday = new Date(event);
    this.isUpToday.setHours(0, 0, 0, 0);
    this.gtUpToday.setHours(0, 0, 0, 0);

    event.setHours(0, 0, 0, 0);
    this.isToday = this.isUpToday.getTime() === event.getTime();
    this.selectDate = event;

    this.selectformatData = moment(this.isUpToday).format("DD-MM-YYYY")
    this.istodate = moment(new Date()).format("DD-MM-YYYY")

    if (this.isUpToday > new Date() || this.selectformatData == this.istodate) {
      this.showHideAddIcon = true;
    } else {
      this.showHideAddIcon = false;
    }

  }

  async getData() {
    var date = this.currentDate;
    const loading = await this.loadingController.create({});
    await loading.present();
    var _self = this

    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    var gtdata = new Date(lastDay.setHours(23, 59, 59, 59))

    await this.api.getManagerTask(this.userid, firstDay, gtdata).
      subscribe(res => {
        _self.TaskData = res;
        _self.TaskData.sort((a, b) => {
          if( new Date(a.task_date) > new Date(b.task_date))
            return 1 ;
          if( new Date(a.task_date) < new Date(b.task_date))
            return -1 ;
          return 1;  
        })
      }, err => {
      })
    loading.dismiss();
  }

  async updateStatus() {
    await this.api.updatestatus(this.selectedId, this.selectStatus).subscribe(res => {
      this.getData();
    }, err => {
    })
  }

  async openmodel() {
    const alert = await this.alertController.create({
      header: 'Update Status',
      subHeader: '',
      message: '',
      inputs: [{
        type: 'radio',
        label: 'Complete',
        value: 'complete'
      }, {
        type: 'radio',
        label: 'Incomplete',
        value: 'Incomplete'
      }],
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }, {
        text: 'Update',
        handler: (data: string) => {
          this.selectStatus = data;
          this.updateStatus();
        }
      }]
    });
    await alert.present();
  }


  gotoAdd() {
    const selectedDate: any = this.selectformatData;
    this.navController.navigateForward('add-task/' + selectedDate);
  }
  task_datee: any;
  async showDetails(data) {
  
    var isdate = new Date(data.task_date);// .getDate();
    this.task_datee = moment(isdate).format("MMM DD, YYYY hh:mm A");

    const alert = await this.alertController.create({
      header: this.task_datee,
      subHeader:data.task,
      message: data.description,
      
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
        }
      }]
    });
    await alert.present();
  }
  getDate(date) { 
    var isdate = new Date(date).getDate();
    this.showTaskDate = moment(date).format("MMM");
    return isdate
  }

  onEventSelected(event) {
   
  }
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
   
  }
  gotoBack() {
    const today = moment(this.selectDate).format("YYYY-MM-DD");
    const nextMonth = moment(today).subtract(1, "M");
    var month = moment(nextMonth).format("YYYY-MM-DD");
    new Date(month);
    this.calendar = {
      mode: "month",
      currentDate: new Date(month)
    };
  }
  gotoNext() {
    const today = moment(this.selectDate).format("YYYY-MM-DD");
    const nextMonth = moment(today).add(1, "M");
    var month = moment(nextMonth).format("YYYY-MM-DD");
    new Date(month);
    this.calendar = {
      mode: "month",
      currentDate: new Date(month)
    };
  }
}
