import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { CalenderComponent } from './calender.component';
import { NgCalendarModule } from "ionic2-calendar";

const routes: Routes = [
  {
    path: '',
    component: CalenderComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgCalendarModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes)
  ],
  declarations: [CalenderComponent]
})
export class CalenderComponentModule {}
