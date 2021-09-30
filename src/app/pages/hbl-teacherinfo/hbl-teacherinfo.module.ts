import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HblTeacherinfoPage } from './hbl-teacherinfo.page';

const routes: Routes = [
  {
    path: '',
    component: HblTeacherinfoPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HblTeacherinfoPage]
})
export class HblTeacherinfoPageModule {}
