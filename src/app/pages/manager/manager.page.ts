import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  LoadingController,
  ModalController
} from '@ionic/angular';

import { RestApiService } from '../../rest-api.service';

@Component({
  selector: 'app-manager',
  templateUrl: './manager.page.html',
  styleUrls: ['./manager.page.scss'],
})
export class ManagerPage implements OnInit {
  respons: any;
  main_arr: any = [];  
  userid: any;
  fileTransfer: FileTransferObject = this.transfer.create();
  links = [];
  storedFiles =[];

  filelist: any = [];
  folderlist: any= [];


  constructor(
    public router: Router,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertController: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public api: RestApiService,
    private loadingController: LoadingController,
    private transfer: FileTransfer,
    public file: File,
    private fileOpener: FileOpener,
    private storage: Storage
    // public loadingCtrl: LoadingController
  ) {
    this.userid = localStorage.getItem("_userid")
    this.getfilelist();
    this.getfolderlist();
  }

  ngOnInit() {}

  // ----------- new code --------------
  async getfilelist(){
    await this.api.getallfilelistbyapptype('managerapp').subscribe(res => {
      let value: any = [];
      if(res.length <= 0){
        this.filelist = [];
        this.links = [];
      }else{
        res.forEach(obj => {
          if(obj.type == 'file' && (obj.s3directory == undefined || obj.s3directory == null || obj.s3directory == '')){
            value.push(obj);
          } 
        });
        this.filelist = value;
        this.links = value;
        this.storage.get('storedFiles').then((value) => {
          if(value && value.length > 0 ){
            this.storedFiles = value;
          }else {
            this.storedFiles = [];
          }
          this.applyIcons();
        });
      }
    }, err => {});
  }

  async getfolderlist(){
    await this.api.getdistinctdirectorylistbyapptype('managerapp').subscribe(res => {
      this.folderlist = res;
    }, err => {});
  }

  folder_clicked(link){
    let navigationExtras: NavigationExtras = { state: { folderobj: link } };
    this.router.navigate(['manager-folderview'], navigationExtras);
  }
  // -----------------------------------

  async getManagerBoxData() {
    var _self  = this;
    await this.api.getAllFromManagersBox().
      subscribe(res => {
        _self.links = res;
        _self.storage.get('storedFiles').then((value) => {
          if(value && value.length > 0 ){
            this.storedFiles = value;
          }else {
            this.storedFiles = [];
          }
          _self.applyIcons();
        });
      }, err => {
      })
  }

  async  presentLoadingDefault() {
    let loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    loading.present();
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }


  
  download(path) {
    this.presentLoadingDefault()
    let file_type = path.split('.').pop();
    let file = this.getMIMEtype(file_type);
    const url = path;
    var file_name = new Date().getTime();
    this.fileTransfer.download(url, this.file.dataDirectory + file_name +  '.' + file_type).then((entry) => {
      const storedFile = {
        Hyper_URL:url,
        Native_URL:entry.toURL()
      }
      this.storedFiles.push(storedFile);
      this.storage.set('storedFiles', this.storedFiles).then(() => {
        this.applyIcons();
      });
    
      this.fileOpener.open(entry.toURL(), file)
        .then(() => {})
        .catch(e => {
            this.toaster();
          });
    }, (error) => {
      if(error){
        this.toaster();
      }
    });
  }

  async toaster() {
    const toast = await this.toastCtrl.create({
      message: "You are unable to open this file please download associated application to open this file",
      duration: 3000
    });
    toast.present();
  }

  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }

  openOrDownload(link){
    if(link.stored) this.viewFile(link);
    else this.download(link.s3path)
  }

  viewFile(link){
    let file_type = link.stored_url.split('.').pop();
    let file = this.getMIMEtype(file_type);
    this.fileOpener.open(link.stored_url, file)
    .then(() => {})
    .catch(e => {
        this.toaster();
      });
  }

  deleteFile(link){
    var _self = this;
    const file_path = link.stored_url.substr(0, link.stored_url.lastIndexOf("/"));
    const file_name =  link.stored_url.substr(link.stored_url.lastIndexOf("/")+1);
    this.file.removeFile(file_path, file_name).then((msg) => {
      if(msg){
        const index  = this.storedFiles.findIndex((f) => f.Native_URL == link.stored_url);
        if(index >= 0 )
          this.storedFiles.splice(index,1);
        _self.storage.set('storedFiles', this.storedFiles);
        _self.applyIcons();  
      }else{
        this.showMsg();
      }
    });
  }

  applyIcons(){
    for(var l =0; l< (this.links || []).length; l++){
      const http_url = this.links[l];
      const stored = this.storedFiles.find((f) => f.Hyper_URL == http_url.s3path);
      if(stored){
        this.links[l].stored = true;
        this.links[l].stored_url = stored.Native_URL; 
      }else{
        this.links[l].stored = false;
      }
    }
  }

  async  showMsg(){
    const toast = await this.toastCtrl.create({
      message: "This file cannot be deleted",
      duration: 3000
    });
    toast.present();
  }
}
