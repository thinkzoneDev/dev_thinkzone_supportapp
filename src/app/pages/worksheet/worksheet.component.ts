import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
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
import { DataService } from '../services/data.service';


@Component({
  selector: 'app-worksheet',
  templateUrl: './worksheet.component.html',
  styleUrls: ['./worksheet.component.scss']
})
export class WorksheetComponent implements OnInit {
  respons: any;
  main_arr: any = [];
  userid: any;
  worksheet: any = [];

  constructor(
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
    private storage: Storage,
    public dataServ: DataService,

    // public loadingCtrl: LoadingController
  ) {
    try{
      this.worksheet= JSON.parse(JSON.stringify(dataServ.getData('worksheetfile')));
    } catch(err){
      this.worksheet = [];
    }
    //this.worksheet = dataServ.getData('worksheetfile');
    for (var i = 0; i < this.worksheet.length; i++) {
      let obj = { url: '', name: '', stored: false, s3path:'' }
      let str = this.worksheet[i]
      obj.s3path = this.worksheet[i]
      obj.stored = false
      // obj.s3path = "https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls"
      
      const lastIndex = str.lastIndexOf(".")
      obj.name = str.substring(str.indexOf('=') + 1, lastIndex)
      this.worksheet[i] = obj
    }
    this.storage.get('storedFiles').then((value) => {
if(value && value.length > 0 ){
this.storedFiles = value;
}else {
this.storedFiles = [];
}
this.applyIcons();
    });
  }
  fileTransfer: FileTransferObject = this.transfer.create();
 
  ngOnInit() {
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


  storedFiles = [];
  download(path) {    
    // path = "https://file-examples.com/wp-content/uploads/2017/02/file_example_XLS_10.xls"
    this.presentLoadingDefault()
    let file_type = path.split('.').pop();
    let file = this.getMIMEtype(file_type);
    const url = path;
    var name =  new Date().getTime().toString(); // 'file';
    this.fileTransfer.download(url, this.file.dataDirectory + name + '.' + file_type).then((entry) => {
      const storedFile = {
        Hyper_URL: url,
        Native_URL: entry.toURL()
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
      if (error) {
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

  openOrDownload(link) {
    if (link.stored) this.viewFile(link);
    else this.download(link.s3path)
  }

  viewFile(link) {
    let file_type = link.stored_url.split('.').pop();
    let file = this.getMIMEtype(file_type);
    this.fileOpener.open(link.stored_url, file)
      .then(() => {})
      .catch(e => {
        this.toaster();
      });
  }


  deleteFile(link) {
    var _self = this;
    const file_path = link.stored_url.substr(0, link.stored_url.lastIndexOf("/"));
    const file_name = link.stored_url.substr(link.stored_url.lastIndexOf("/") + 1);
    this.file.removeFile(file_path, file_name).then((msg) => {
      if (msg) {
        const index = this.storedFiles.findIndex((f) => f.Native_URL == link.stored_url);
        if (index >= 0)
          this.storedFiles.splice(index, 1);

        _self.storage.set('storedFiles', this.storedFiles);
        _self.applyIcons();
      }

      else {
        this.showMsg();
      }

    });


  }

  applyIcons() {

    for (var l = 0; l < (this.worksheet || []).length; l++) {
      const http_url = this.worksheet[l];
      const stored = this.storedFiles.find((f) => f.Hyper_URL == http_url.s3path);
      if (stored) {
        this.worksheet[l].stored = true;
        this.worksheet[l].stored_url = stored.Native_URL;
      } else {
        this.worksheet[l].stored = false;
      }
    }
  }
 
  async  showMsg() {
    const toast = await this.toastCtrl.create({
      message: "This file cannot be deleted",
      duration: 3000
    });
    toast.present();
  }
}
