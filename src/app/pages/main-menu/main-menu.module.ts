import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { MainMenuComponent } from "./main-menu.component";

import { MatButtonModule, MatSliderModule } from "@angular/material";

//use for language change
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClientModule, HttpClient } from "@angular/common/http";

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

const routes: Routes = [
  {
    path: "",
    component: MainMenuComponent,
  },
];

@NgModule({
  imports: [
    //use for language change
    HttpClientModule,
    TranslateModule.forChild(),

    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    MatSliderModule,
    MatButtonModule,
  ],
  declarations: [MainMenuComponent],
})
export class MainMenuModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
