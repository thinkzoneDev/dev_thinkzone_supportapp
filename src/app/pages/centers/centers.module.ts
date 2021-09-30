import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController } from '@ionic/angular';
  
import { IonicModule } from '@ionic/angular';

import { CentersComponent } from './centers.component';


import { RestApiService } from './../../rest-api.service';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: CentersComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [CentersComponent]
})
export class CentersComponentModule {
  _username: string = localStorage.getItem('_username').toUpperCase();
  searchKey = '';
  yourLocation = '123 Test Street';
  themeCover = 'assets/img/ionic4-Start-Theme-cover.jpg';

  current_date: string;
  centers: any=[];

  constructor(
    public navController: NavController,
    public api: RestApiService) {

  } 
}
