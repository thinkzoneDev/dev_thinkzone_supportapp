import { HblPageModule } from "./pages/hbl/hbl.module";
import { HblschoolWisedataPageModule } from "./pages/hblschool-wisedata/hblschool-wisedata.module";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";

// Modal Pages
import { ImagePageModule } from "./pages/modal/image/image.module";
import { SearchFilterPageModule } from "./pages/modal/search-filter/search-filter.module";
import { SigninPageModule } from "./pages/modal/signin/signin.module";
import { MessagebodyPageModule } from "./pages/modal/messagebody/messagebody.module";
import { ExpensemodalPageModule } from "./pages/modal/expensemodal/expensemodal.module";
import { HblSelectPasscodePageModule } from "./pages/hbl-select-passcode/hbl-select-passcode.module";
import { HblTeacherinfoPageModule } from "./pages/hbl-teacherinfo/hbl-teacherinfo.module";
import { SchoolDetailsPageModule } from "./pages/school-details/school-details.module";

// Components
import { NotificationsComponent } from "./components/notifications/notifications.component";

// Camera
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
// Geolocation
import { Geolocation } from "@ionic-native/geolocation/ngx";

// push notification
import { FCM } from "@ionic-native/fcm/ngx";
import { NgCalendarModule } from "ionic2-calendar";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject,
} from "@ionic-native/file-transfer/ngx";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";

import { IonicStorageModule } from "@ionic/storage";

//use for language change
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { QuizPageModule } from "./pages/quiz/quiz.module";

import { Diagnostic } from "@ionic-native/diagnostic/ngx";
import { VideoPlayer, VideoOptions } from "@ionic-native/video-player/ngx";
import { ScreenOrientation } from "@ionic-native/screen-orientation/ngx";
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";

//Material Imports
import { MatButtonModule } from "@angular/material";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent, NotificationsComponent],
  imports: [
    //use for language change
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IonicStorageModule.forRoot(),
    IonicStorageModule.forRoot({
      name: "__mydb",
      driverOrder: ["indexeddb", "sqlite", "websql"],
    }),
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ImagePageModule,
    SigninPageModule,
    MessagebodyPageModule,
    ExpensemodalPageModule,
    SearchFilterPageModule,
    NgCalendarModule,
    QuizPageModule,
    MatButtonModule,
    HblschoolWisedataPageModule,
    HblSelectPasscodePageModule,
    HblTeacherinfoPageModule,
    HblPageModule,
    SchoolDetailsPageModule,
  ],
  entryComponents: [NotificationsComponent],
  providers: [
    StatusBar,
    SplashScreen,
    FCM,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Camera,
    LocalNotifications,
    FileTransfer,
    File,
    FileOpener,
    Geolocation,
    Diagnostic,
    VideoPlayer,
    ScreenOrientation,
    // VideoOptions
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
