import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { AddTaskPage } from "./addTask.page";

import { RestApiService } from "./../../rest-api.service";

import { MatButtonModule } from "@angular/material";

const routes: Routes = [
  {
    path: "",
    component: AddTaskPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatButtonModule,
  ],
  declarations: [AddTaskPage],
})
export class AddTaskPageModule {
  constructor(public api: RestApiService) {}
}
