import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { HblSelectPasscodePage } from "./hbl-select-passcode.page";

const routes: Routes = [
  {
    path: "",
    component: HblSelectPasscodePage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HblSelectPasscodePage],
})
export class HblSelectPasscodePageModule {}
