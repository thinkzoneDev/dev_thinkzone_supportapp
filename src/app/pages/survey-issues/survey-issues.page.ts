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

@Component({
  selector: 'app-survey-issues',
  templateUrl: './survey-issues.page.html',
  styleUrls: ['./survey-issues.page.scss'],
})
export class SurveyIssuesPage implements OnInit {
  respons: any;
  main_arr: any = [];
  data :any ;
  usertype : any;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
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
    await this.api.getallmanagersSurvey()
      .subscribe(res => {
        loading.dismiss();
        this.respons = res;
      }, err => {
        loading.dismiss();
      });
  }
  async save(){
    if(this.main_arr.length <= 0 || this.main_arr.length < this.respons.length){
        this.showAlert('Survey', 'Please enter survey details !!!');
    }else{
      let body = {
        userid : localStorage.getItem("_userid"),
        username : localStorage.getItem("_username"),
        centerid : localStorage.getItem("_centerid"),
        centername : localStorage.getItem("_centername"),
        feedback : this.main_arr
      }
      let loading = await this.loadingController.create({});
      await loading.present();
      await this.api.createmanagersSurveydetails(body)
        .subscribe(res => {
          loading.dismiss();
         this.showAlert("Survey", res.status);            
        }, err => {
          loading.dismiss();
        });
        this.navCtrl.navigateBack('/main-menu');
    }
  }
  // alert box
  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
    //  subHeader: subHeader,
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
}
