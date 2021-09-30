import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { HblschoolWisedataPage } from "./hblschool-wisedata.page";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

const routes: Routes = [
  {
    path: "",
    component: HblschoolWisedataPage,
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TranslateModule.forChild(),
  ],
  declarations: [HblschoolWisedataPage],
})
export class HblschoolWisedataPageModule {}
