import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { ManagerfolderviewPage } from "./managerfolderview.page";

import { MatButtonModule, MatIconModule } from "@angular/material";

const routes: Routes = [
  {
    path: "",
    component: ManagerfolderviewPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [ManagerfolderviewPage],
})
export class ManagerfolderviewPageModule {}
