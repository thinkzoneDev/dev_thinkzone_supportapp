import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable, from, of, forkJoin } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

// import { StoredRequest } from './../models/stored.request.model';
 
const STORAGE_REQ_KEY = 'storedreq';
 
@Injectable({
  providedIn: 'root'
})
export class OfflineManagerService {
  constructor(
    private storage: Storage, 
    private http: HttpClient, 
    private toastController: ToastController
  ) { }
 
  
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
