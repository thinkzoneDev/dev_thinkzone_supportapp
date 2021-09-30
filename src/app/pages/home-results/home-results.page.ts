import { Component } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController } from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RestApiService } from './../../rest-api.service';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage {
  _username: string = localStorage.getItem('_username').toUpperCase();
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';

  current_date: string;
  centers: any;

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService) {
   
    this.centers = [];
    this.api.getcurrentdate()
        .subscribe(res => {
          if(Object.keys(res).length > 0 ){
            this.current_date = res['current'];
          }else{
            this.current_date = '';
          }            
        }, err => {
        });

        this.api.getallcentersallocatedbyuserid(localStorage.getItem('_userid'))
        .subscribe(res => {
          
          if(Object.keys(res).length > 0 ){
            this.centers = res[0]['centers'];
          }else{
            this.centers = [];
          }            
        }, err => {
        });
  
  }

  centerButtonClicked(center: any){
    if(Object.keys(center).length > 0){
      localStorage.setItem("_operationdate", this.current_date);
      localStorage.setItem("_centerid", center.centerid);
      localStorage.setItem("_centername", center.centername);
      this.navController.navigateForward('/center');
    }
  }
  goToManager() {
    this.navController.navigateForward('fellow');
  }
  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  settings() {
    this.navController.navigateForward('settings');
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter () {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  async notifications(ev: any) {
    this.navController.navigateForward('/message');
  }
}
