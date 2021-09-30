import { Component, OnInit } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController } from '@ionic/angular';
  import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeValue} from '@angular/platform-browser';
  import { RestApiService } from './../../rest-api.service';
  // Camera
  import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-issues',
  templateUrl: './issues.page.html',
  styleUrls: ['./issues.page.scss'],
})
export class IssuesPage implements OnInit {
  respons: any;
  main_arr: any = [];
  data :any ;
  usertype : any;

  all_images_arr: any = [];
  image_preview: any = null;
  imagebase64: any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public domSanitizer: DomSanitizer,
    private camera: Camera,
    public api: RestApiService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.getResponse();
  }

  async getResponse() {
    this.usertype = localStorage.getItem("_centertype");
    
    let loading = await this.loadingController.create({});
    await loading.present();
    await this.api.getallmanagersfeedback(this.usertype)
      .subscribe(res => {
        loading.dismiss();
        this.respons = res;
      }, err => {
        loading.dismiss();
      });
  }
  async save(){
    if(this.all_images_arr == null || this.all_images_arr == undefined || this.all_images_arr.length <= 0){
        this.showAlert('Take a Picture', 'Please Take a Picture.');
    }else if(this.main_arr.length <= 0 || this.main_arr.length < this.respons.length){
        this.showAlert('Feedback', 'Please enter all feedback details.');
    }else{
      let body = {
        userid : localStorage.getItem("_userid"),
        username : localStorage.getItem("_username"),
        usertype: localStorage.getItem("_centertype"),
        centerid : localStorage.getItem("_centerid"),
        centername : localStorage.getItem("_centername"),
        feedback : this.main_arr,
        images : this.all_images_arr
      }
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createmanagersfeedbackdetails(body).subscribe(res => {
        loading.dismiss();
        if(res && res.status){
          this.showAlert("Feedback", 'Feedback submitted successfully !');            
        }else{
          if(res && res.message){
            this.showAlert("Feedback", res.message);
          }
        }}, err => {loading.dismiss();});
        this.all_images_arr = [];
        this.navCtrl.navigateBack('/centers');
    }
  }
  // alert box
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
    // =====================================
    selectOnChange_single(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "issue_q": data.feedback,
            "issue_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    selectOnChange_multiple(data: any, answer: any){
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "issue_q": data.feedback,
            "issue_a": answer
        }
        this.insertIntoArray(data._id, newfeed);
    }

    dateOnChange(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "issue_q": data.feedback,
            "issue_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    inputOnchange(data: any, answer: any){
        let answer_arr = [];
        answer_arr.push(answer);
        let newfeed = {
            "_id" : data._id,
            "id" : data.id,
            "issue_q": data.feedback,
            "issue_a": answer_arr
        }
        this.insertIntoArray(data._id, newfeed);
    }

    insertIntoArray(_id, newfeed){
        let ele_found = false;
        let index = 0, i = 0;
        this.main_arr.forEach(ele => {
            if(ele['_id'] == _id){
                ele_found = true;
                index = i;
                return;
            }
            i++;
        });

        if(ele_found){
            this.main_arr.splice(index,1);
            this.main_arr.push(newfeed);
        }else{
            this.main_arr.push(newfeed);
        }
    }
    // =====================================

  // Take Picture
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
       this.image_preview = this.domSanitizer.bypassSecurityTrustResourceUrl("data:image/jpg;base64,"+imageData);
       //this.imagebase64 = imageData;
       this.all_images_arr = [];
       this.all_images_arr.push(imageData);
       //this.savePictureasBase64(imageData);
     }, (err) => {
        alert("error "+JSON.stringify(err))
     });
   }
}
