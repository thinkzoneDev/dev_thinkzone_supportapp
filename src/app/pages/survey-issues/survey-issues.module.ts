import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";

import { SurveyIssuesPage } from "./survey-issues.page";

import { MatButtonModule } from "@angular/material";

const routes: Routes = [
  {
    path: "",
    component: SurveyIssuesPage,
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
  ],
  declarations: [SurveyIssuesPage],
})
export class SurveyIssuesPageModule {}
