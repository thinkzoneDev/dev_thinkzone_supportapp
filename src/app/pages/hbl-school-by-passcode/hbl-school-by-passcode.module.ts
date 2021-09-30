import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HblSchoolByPasscodePage } from './hbl-school-by-passcode.page';

const routes: Routes = [
  {
    path: '',
    component: HblSchoolByPasscodePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HblSchoolByPasscodePage]
})
export class HblSchoolByPasscodePageModule {}
