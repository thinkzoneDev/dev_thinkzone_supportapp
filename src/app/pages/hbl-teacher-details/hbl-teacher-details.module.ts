import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { HblTeacherDetailsPage } from "./hbl-teacher-details.page";

const routes: Routes = [
  {
    path: "",
    component: HblTeacherDetailsPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HblTeacherDetailsPage],
})
export class HblTeacherDetailsPageModule {}
