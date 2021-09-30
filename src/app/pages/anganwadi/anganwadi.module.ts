import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AnganwadiComponent } from './anganwadi.component';

const routes: Routes = [
  {
    path: '',
    component: AnganwadiComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AnganwadiComponent]
})
export class AnganwadiComponentModule {}
