import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { MessagebodyPage } from "./messagebody.page";

import { MatButtonModule } from "@angular/material";

const routes: Routes = [
  {
    path: "",
    component: MessagebodyPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatButtonModule,
  ],
  declarations: [MessagebodyPage],
  entryComponents: [MessagebodyPage],
})
export class MessagebodyPageModule {}
