import { Component, NgZone } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { RestApiService } from './../../rest-api.service';

// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-center',
  templateUrl: './center.page.html',
  styleUrls: ['./center.page.scss']
})
export class CenterPage {
  _operationdate: string;
  _userid: string;
  _username: string;
  _centerid: string;
  _centername: string;

  image:any='';
  imagebase64: any;
  confirmed: number = 0;
  
  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private zone: NgZone, 
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) {
    this._operationdate = localStorage.getItem("_operationdate");
    this._userid = localStorage.getItem("_userid");
    this._username = localStorage.getItem("_username");
    this._centerid = localStorage.getItem("_centerid");
    this._centername = localStorage.getItem("_centername");
  }

  goToCentersList() {
    this.navController.navigateBack('/home-results');
  }

  // Camera
  async takePicture() {
   const options: CameraOptions = {
      quality: 50, // 100
      destinationType: this.camera.DestinationType.DATA_URL,   // <- returns base64 code
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 200,
      targetHeight: 200
    }
    
    this.camera.getPicture(options).then((imageData) => {
      this.imagebase64 = imageData;
      this.savePictureasBase64(imageData);
      
    }, (err) => {
    // Handle error
    alert("error "+JSON.stringify(err))
    });
  }

  async savePictureasBase64(imageData){
    let body = {
      userid : localStorage.getItem("_userid"),
	    username : localStorage.getItem("_username"),
      centerid : localStorage.getItem("_centerid"),
      centername : localStorage.getItem("_centername"),
      imageurl : "",
      imagebase64 : imageData
    }
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.savecenterimage(body)
      .subscribe(res => {
        loading.dismiss();
        this.showAlert('Pic Sharing', 'Center image', 'Image sharing '+res['status']+' !!!');
      }, err => {
        loading.dismiss();
      });
  }

  // get geolocation
  async getGeolocation() {
    try {
      this.geolocation.getCurrentPosition().then((resp) => {
        let body = {
          userid : localStorage.getItem("_userid"),
          username : localStorage.getItem("_username"),
          centerid : localStorage.getItem("_centerid"),
          centername : localStorage.getItem("_centername"),
          latlng : {lat: resp.coords.latitude, lng: resp.coords.longitude}
        }
        this.showConfirm('Confirmation  !','', 'Do you want to share your current location?<br>latitude:<strong>'+resp.coords.latitude+'</strong>   longitude:<strong>'+resp.coords.longitude+'</strong>', body);
      }).catch((error) => {
      });      
    } catch(e) {
      alert('WebView geo error');
    }
  }

  async savegeolocation(body) {
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.savegeolocation(body)
      .subscribe(res => {
        loading.dismiss();
        this.showAlert('Location Sharing', 'Center location', 'Location sharing '+res['status']+' !!!');         
      }, err => {
        loading.dismiss();
      });
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
            this.confirmed = 0;
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.confirmed = 1;
            this.savegeolocation(body);
          }
        }
      ]
    });
    await alert.present();
  }
}
