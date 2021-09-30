
import { Component, Input, ViewChild } from '@angular/core';
import { NgModule } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { RestApiService } from './../../rest-api.service';
// import { Training2Page } from '../training2/training2.page';
import { DataService } from '../services/data.service';
// import { TranslateConfigService } from './../../translate-config.service';
import { IonSlides } from '@ionic/angular';


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
@NgModule({
  declarations: [],
  imports: []
})
export class TrainingComponent {
  slideOpts: any;
  @ViewChild('slider') slider: IonSlides;

  public allmodule_list: any = [];
  public allmodule_name: any[];
  public allsubmodule_list: any = [];
  toolbarshadow = true;
  init_module = '';

  public profile_data: any = [];
  userid: string = '';
  username: string = '';
  usertype: string = '';
  gender: string = '';
  dob: string = '';
  regdate: string = '';
  emailid: string = '';
  contactno: string = '';
  address: string = '';
  bdate;
  bmonth;
  byear;

  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  hide_class_field = false;

  options = {
    slidesPerView: 1.2,
    centeredSlides: true
  };

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalController: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    public dataService: DataService
  ) {
    this._userid = localStorage.getItem('_userid');
    this._username = localStorage.getItem('_username');
    this._centerid = '';
    this._centername = '';
    this.getAllModules();
    this.getUserProfile();
    this.slideOpts = {
      initialSlide: 0,
      runCallbacksOnInit: true,
      centeredSlides: true,
      loop: true,
      pager: true,
      slidesPerView: 1,
      autoplay: true,
      spaceBetween: 10
    };
  }
  ngOnInit() {
  }
  async getUserProfile() {
    await this.api.getuserbyuserid(this._userid)
      .subscribe(res => {
        this.profile_data = res;
        if (this.profile_data.length > 0) {
          this.username = this.profile_data[0].username;
        }
      }, err => {
        this.showAlert('Profile Error', '', 'Unable to fetch user profile by this time');
      });
  }
  async getAllModules() {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingmodules()
      .subscribe(res => {
        this.allmodule_list = res;
        loading.dismiss();
        // load on page load time
        this.allmodule_name = [];
        if (this.allmodule_list.length > 0) {
          let count = true;
          this.allmodule_list.forEach(element => {
            element.selected = count;
            count = false;
            this.allmodule_name.push(element);
          });
        }
      }, err => {
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time');
      });
  }

  reloadData($event) {
  }
  async getAllSubmodules(moduleid) {
    const loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getalltrainingsubmodules(moduleid)
      .subscribe(res => {
        this.allsubmodule_list = res;
        this.allsubmodule_list.forEach(element => {
          element.progress = Math.round(Math.random() * 100); // change this to original value
        });
        this.createSubmodulesModal();
        loading.dismiss();
      }, err => {
        loading.dismiss();
        this.showAlert('Teacher training', '', 'Unable to fetch modules at this time !!!');
      });
  }

  async createSubmodulesModal() {
    this.dataService.setData('submodules', this.allsubmodule_list);
    this.navController.navigateForward('training-module');
  }

  module_select_onchange(value) {
    this.allmodule_name.forEach(element => {
      element.selected = false;
    });
    value.selected = true;
    this.getAllSubmodules(value.moduleid);
  }

  async submodule_click(submodule) {
    
  }

  async explor() {
    this.navController.navigateForward('/profile');
  }

  // alert box
  async showAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  // confirm box
  async showConfirm(header: string, subHeader: string, message: string, body: any) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Ok',
          handler: () => { }
        }
      ]
    });
    await alert.present();
  }

  logScrolling(event) {
    if (event.detail.currentY === 0) {
      this.toolbarshadow = true;
    } else {
      this.toolbarshadow = false;
    }
  }
  ionViewWillEnter(slides: IonSlides) {
    this.slider.startAutoplay();
  }
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }


  ionViewDidEnter() {
    this.slider.update();
  }

  ionViewWillLeave() {
    this.slider.stopAutoplay()
  }

}
