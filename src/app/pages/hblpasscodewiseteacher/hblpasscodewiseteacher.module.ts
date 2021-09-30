import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HblpasscodewiseteacherPage } from './hblpasscodewiseteacher.page';

const routes: Routes = [
  {
    path: '',
    component: HblpasscodewiseteacherPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HblpasscodewiseteacherPage]
})
export class HblpasscodewiseteacherPageModule {}
