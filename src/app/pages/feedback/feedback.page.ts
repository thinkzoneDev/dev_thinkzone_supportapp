import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';

import { RestApiService } from './../../rest-api.service';

  
// Camera
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// Geolocation
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedbacks: any;
  feedback_selected: any;
  centerfeedback_arr: any = [];
  imagebase64: any;
  latlng: any={};
  selected_option: any = '';
  selected_options: any = [];
  picture: any;

  check_status_picshare: boolean = false;
  check_status_locshare: boolean = false;
  check_status_feedback: boolean = false;
  status_picshare: string = 'Not Set';
  status_locshare: string = 'Not Set';

  constructor(
    public navController: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private camera: Camera,
    private geolocation: Geolocation
  ) { }

  ngOnInit() {
      this.picture = '/assets/img/center/pic.jpg';
    this.getFeedback();
  }

  async getFeedback() {
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallcenterfeedback()
      .subscribe(res => {
        loading.dismiss();
        this.feedbacks = res;
      }, err => {
        loading.dismiss();
      });
  }
  // Save all center feedback process starts from here
  async save(){
    if(!this.check_status_picshare){
      this.showAlert('Please check', 'Center image', 'No images shared yet !!!');
    }else if(!this.check_status_locshare){
      this.showAlert('Please check', 'Center location', 'No location shared yet !!!');
    }else{
      if(this.centerfeedback_arr.length <= 0 || this.centerfeedback_arr.length < this.feedbacks.length){
        this.showAlert('Center feedback', 'Center feedback', 'Please select all feedbacks !!!');
      }else{
        let body = {
          userid : localStorage.getItem("_userid"),
          username : localStorage.getItem("_username"),
          centerid : localStorage.getItem("_centerid"),
          centername : localStorage.getItem("_centername"),
          date : new Date(),
          centrefeedback : this.centerfeedback_arr,
          latlng : this.latlng,
          imageurl : '',
          contentType : 'image/jpeg',
          image : this.imagebase64
        }
        let loading = await this.loadingController.create({});
        await loading.present();
        await this.api.savedailyinfo(body)
          .subscribe(res => {
            loading.dismiss();
            this.showAlert('Center feedback', 'Center feedback', 'Center feedback saved '+res['status']+' !!!');
          }, err => {
            loading.dismiss();
          });
          this.navController.navigateBack('/center');
      }  
    }
  }
  
  async saveCenterfeedback(){
    if(this.centerfeedback_arr.length > 0){
      let body = {
        userid : localStorage.getItem("_userid"),
        username : localStorage.getItem("_username"),
        centerid : localStorage.getItem("_centerid"),
        centername : localStorage.getItem("_centername"),
        centrefeedback : this.centerfeedback_arr
      }
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createcenterfeedbackmgr(body)
        .subscribe(res => {
          loading.dismiss();
          this.showAlert('Center feedback', 'Center feedback', 'Center feedback saved '+res['status']+' !!!');
        }, err => {
          loading.dismiss();
        });
        this.navController.navigateBack('/center');
    }else{
      this.showAlert('Center feedback', 'Center feedback', 'Please select some feedback !!!');
    }
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
       this.picture = 'data:image/jpeg;base64,' + imageData;
       this.imagebase64 = imageData;
       this.check_status_picshare = true;
       this.status_picshare = 'Ok';
     }, (err) => {
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
     let loading = await this.loadingController.create({});
     await loading.present();
     try {
       this.geolocation.getCurrentPosition().then((resp) => {
         var obj = {lat: resp.coords.latitude, lng: resp.coords.longitude};
         this.latlng = obj;
         loading.dismiss();
         this.check_status_locshare = true;
         this.status_locshare = 'Ok';
         this.showAlert("Location", "Current location", "Latitude: "+resp.coords.latitude+"    <br>Longitude: "+resp.coords.longitude)
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
          }
        }, {
          text: 'Ok',
          handler: () => {
            this.savegeolocation(body);
          }
        }
      ]
    });
    await alert.present();
  }

    // =====================================
    selectOnChange_single(feedback: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : feedback._id,
            "id" : feedback.id,
            "feedback_q": feedback.feedback,
            "feedback_a": answer_arr
        }
        this.insertIntoArray(feedback._id, newfeed);
    }

    selectOnChange_multiple(feedback: any, answer: any){
        let newfeed = {
            "_id" : feedback._id,
            "id" : feedback.id,
            "feedback_q": feedback.feedback,
            "feedback_a": answer
        }
        this.insertIntoArray(feedback._id, newfeed);
    }

    dateOnChange(feedback: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : feedback._id,
            "id" : feedback.id,
            "feedback_q": feedback.feedback,
            "feedback_a": answer_arr
        }
        this.insertIntoArray(feedback._id, newfeed);
    }

    inputOnchange(feedback: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : feedback._id,
            "id" : feedback.id,
            "feedback_q": feedback.feedback,
            "feedback_a": answer_arr
        }
        this.insertIntoArray(feedback._id, newfeed);
    }

    insertIntoArray(_id, newfeed){
        let ele_found = false;
        let index = 0, i = 0;
        this.centerfeedback_arr.forEach(ele => {
            if(ele['_id'] == _id){
                ele_found = true;
                index = i;
                return;
            }
            i++;
        });

        if(ele_found){
            this.centerfeedback_arr.pop(index);
            this.centerfeedback_arr.push(newfeed);
        }else{
            this.centerfeedback_arr.push(newfeed);
        }
    }
    // =====================================
}
