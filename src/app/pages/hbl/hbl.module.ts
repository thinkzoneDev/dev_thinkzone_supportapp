import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { IonicModule } from "@ionic/angular";

import { HblPage } from "./hbl.page";

import { MatNativeDateModule } from "@angular/material/core";
import { MatTableModule } from "@angular/material/table";
const routes: Routes = [
  {
    path: "",
    component: HblPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
    MatNativeDateModule,
    MatTableModule,
  ],
  declarations: [HblPage],
})
export class HblPageModule {}
