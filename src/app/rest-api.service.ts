import { Injectable } from "@angular/core";
import { Observable, of, from, throwError } from "rxjs";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";

//---------------------- Packages for Offline Syncing ------------------------
import { OfflineManagerService } from "./networkService/offline-manager.service";
import {
  NetworkService,
  ConnectionStatus,
} from "./networkService/network.service";
import { Storage } from "@ionic/storage";
//----------------------------------------------------------------------------

const API_STORAGE_KEY = "specialkey";
const httpOptions = {
  headers: new HttpHeaders({ "Content-Type": "application/json" }),
};
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: "root",
})
export class RestApiService {
  url: string;
  constructor(
    private http: HttpClient,
    private networkService: NetworkService,
    private storage: Storage,
    private offlineManager: OfflineManagerService
  ) {
    //this.savefeedbackData();
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error("An error occurred:", error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // return an observable with a user-facing error message
    return throwError("Something bad happened; please try again later.");
  }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  // ------------------------------------ my coding starts from here ----------------------------------
  // authenticate user
  authenticateuser(data): Observable<any> {
    return this.http
      .post(baseUrl + "authenticateuser", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  adduserdevice() {
    if (localStorage.getItem("_emailid") && localStorage.getItem("fcm_token")) {
      const data = {
        userid: localStorage.getItem("_emailid"),
        deviceId: localStorage.getItem("fcm_token"),
      };
      this.http
        .post(baseUrl + "adduserdevice", data, httpOptions)
        .subscribe((res) => {});
    }
    // const data = {
    //   userid: res['emailid'],
    //   //devices: [{
    //   deviceId: this.fcm_token
    //   //}]
    // }
  }

  removeuserdevice(data): Observable<any> {
    return this.http
      .post(baseUrl + "removeuserdevice", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // getcurrentdate
  getcurrentdate(): Observable<any> {
    this.url = baseUrl + "getcurrentdate";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  //ManagerTast as calender to do
  Manager_task(data): Observable<any> {
    this.url = baseUrl + "addManagerTask";
    return this.http
      .post(this.url, data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getManagerTask(id, date, gtdata): Observable<any> {
    this.url = baseUrl + "getManagerTask";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getManagerTask"));
    } else {
      return this.http
        .post(
          this.url,
          { user_id: id, date: date, gtdata: gtdata },
          httpOptions
        )
        .pipe(
          map(this.extractData),
          tap((res) => {
            this.setLocalData("_getManagerTask", res);
          }),
          catchError(this.handleError)
        );
    }
  }

  updatestatus(id, status): Observable<any> {
    this.url = baseUrl + "updateStatusTask";
    return this.http
      .post(this.url, { _id: id, status: status }, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getAllFromManagersBox(): Observable<any> {
    this.url = baseUrl + "getAllFromManagersBox";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getAllFromManagersBox"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getAllFromManagersBox", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getallfilelistbyapptype(apptype): Observable<any> {
    this.url = baseUrl + "getallfilelistbyapptype/" + apptype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallfilelistbyapptype"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallfilelistbyapptype", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getdistinctdirectorylistbyapptype(apptype): Observable<any> {
    this.url = baseUrl + "getdistinctdirectorylistbyapptype/" + apptype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getdistinctdirectorylistbyapptype"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getdistinctdirectorylistbyapptype", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getallfilelistinsidedirectorybyapptype(
    apptype,
    directoryname
  ): Observable<any> {
    this.url =
      baseUrl +
      "getallfilelistinsidedirectorybyapptype/" +
      apptype +
      "/" +
      directoryname;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallfilelistinsidedirectorybyapptype"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallfilelistinsidedirectorybyapptype", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  getnotificationdata(data, type): Observable<any> {
    this.url = baseUrl + "getnotificationdata/" + data + "/" + type;
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }
  updateviewnotification(data) {
    this.url = baseUrl + "updateviewnotificationdata/" + data;
    return this.http.get(this.url, httpOptions).toPromise();
  }

  // Save result of API requests to sqLite db
  private setLocalData(key, data) {
    this.storage.ready().then(() => {
      this.storage.set(`${API_STORAGE_KEY}-${key}`, data);
    });
  }

  // Get cached API result from sqLite db
  private getLocalData(key) {
    return this.storage.get(`${API_STORAGE_KEY}-${key}`);
  }

  // Teacher training
  // get all modules
  getalltrainingmodules(): Observable<any> {
    this.url = baseUrl + "getalltrainingmodules";
    //  if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //    return from(this.getLocalData('_getalltrainingmodules'));
    //  } else {
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      // tap(res => {
      //
      //    this.setLocalData('_getalltrainingmodules', res);
      // }),
      catchError(this.handleError)
    );
    // }
  }

  // get all submodules of a module
  getalltrainingsubmodules(moduleid): Observable<any> {
    this.url = baseUrl + "getalltrainingsubmodules/" + moduleid;
    // if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //   return from(this.getLocalData('_getalltrainingsubmodules'));
    // } else {
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {
        // this.setLocalData('_getalltrainingsubmodules', res);
      }),
      catchError(this.handleError)
    );
    // }
  }

  //get user by userid
  getuserbyuserid(userid): Observable<any> {
    this.url = baseUrl + "getuserbyuserid/" + userid;
    // if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //   return from(this.getLocalData('_getuserbyuserid'));
    // } else {
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {
        // this.setLocalData('_getuserbyuserid', res);
      }),
      catchError(this.handleError)
    );
    // }
  }

  // get all training contents
  getalltrainingcontents(moduleid, submoduleid): Observable<any> {
    this.url =
      baseUrl + "getalltrainingcontents/" + moduleid + "/" + submoduleid;
    // if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //   return from(this.getLocalData('_getalltrainingcontents'));
    // } else {
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {
        // this.setLocalData('_getalltrainingcontents', res);
      }),
      catchError(this.handleError)
    );
    // }
  }

  // save teacher training session
  savetchtraining(data): Observable<any> {
    this.url = baseUrl + "savetchtraining";
    // if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //   return from(this.offlineManager.storeRequest(this.url, 'POST', data));
    // } else {
    return this.http.post(this.url, data, httpOptions).pipe(
      map(this.extractData),
      catchError((err) => {
        // this.offlineManager.storeRequest(this.url, 'POST', data);
        throw new Error(err);
      })
    );
    // }
  }

  // get teacher training details
  gettchtrainingdetails(userid, moduleid, submoduleid): Observable<any> {
    this.url =
      baseUrl +
      "gettchtrainingdetails/" +
      userid +
      "/" +
      moduleid +
      "/" +
      submoduleid;
    // if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //   return from(this.getLocalData('_gettchtrainingdetails'));
    // } else {
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {
        // this.setLocalData('_gettchtrainingdetails', res);
      }),
      catchError(this.handleError)
    );
    // }
  }
  //get teachers by manager by passcode
  getAllteachersbypasscode(passcode): Observable<any> {
    this.url = baseUrl + "/getallteachersbypasscode/" + passcode;
    // if (this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline) {
    //   return from(this.getLocalData('_gettchtrainingdetails'));
    // } else {
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {
        // this.setLocalData('_gettchtrainingdetails', res);
      }),
      catchError(this.handleError)
    );
    // }
  }
  //get post call activities  of teacher
  getpostcallactivities(userid, selectedmonth, year): Observable<any> {
    this.url =
      baseUrl +
      "gettranspostcallactivitiesbypasscodebyuserid/" +
      userid +
      "/" +
      selectedmonth +
      "/" +
      year;

    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
    // }
  }

  // getallcentersallocatedbyuserid
  getallcentersallocatedbyuserid(_userid): Observable<any> {
    //let apiurl = 'getallcentersallocatedbyuserid';
    let apiurl = "allocatedcenter_getdetailsbymanagerid";
    this.url = baseUrl + apiurl + "/" + _userid;

    this.show(this.url);
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_" + apiurl));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_" + apiurl, res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // getcenter feedback
  getallcenterfeedback(): Observable<any> {
    this.url = baseUrl + "getallcenterfeedback";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // savedailyinfo
  savedailyinfo(data): Observable<any> {
    return this.http
      .post(baseUrl + "savedailyinfo", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // savecenterimage
  savecenterimage(data): Observable<any> {
    return this.http
      .post(baseUrl + "savecenterimage", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // savegeolocation
  savegeolocation(data): Observable<any> {
    return this.http
      .post(baseUrl + "savegeolocation", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager center feedback
  createcenterfeedbackmgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createcenterfeedbackmgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all paymentinfo
  getallpaymentinfo(): Observable<any> {
    this.url = baseUrl + "getallpaymentinfo";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager paymentinfo
  createpaymentinfomgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createpaymentinfomgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all assessment
  getallassessment(): Observable<any> {
    this.url = baseUrl + "getallassessment";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager assessment
  createassessmentmgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createassessmentmgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all community
  getallcommunityvisit(): Observable<any> {
    this.url = baseUrl + "getallcommunityvisit";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save manager community
  createcommunitymgr(data): Observable<any> {
    return this.http
      .post(baseUrl + "createcommunitymgr", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get all issue
  getallissues(): Observable<any> {
    this.url = baseUrl + "getallissues";
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  //get all managersfeedback
  getallmanagersfeedback(usertype): Observable<any> {
    this.url = baseUrl + "/getallmanagersfeedbacks/" + usertype;
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallmanagersfeedbacks"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallmanagersfeedbacks", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  //get all managers survey
  getallmanagersSurvey(): Observable<any> {
    this.url = baseUrl + "/getallmastermanagersurveys";
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      return from(this.getLocalData("_getallmastermanagersurveys"));
    } else {
      return this.http.get(this.url, httpOptions).pipe(
        map(this.extractData),
        tap((res) => {
          this.setLocalData("_getallmastermanagersurveys", res);
        }),
        catchError(this.handleError)
      );
    }
  }

  // save online feedback
  // savefeedbackData(){
  //   if(this.networkService.getCurrentNetworkStatus() != ConnectionStatus.Offline){
  //     const data = from(this.getLocalData('_createmanagersfeedbackdetails'));
  //     return this.http.post(baseUrl + 'createmanagersfeedbackdetails', data, httpOptions).pipe(
  //       map(this.extractData),
  //       catchError(this.handleError));
  //   }

  // }

  // save managerissue
  createmanagersfeedbackdetails(data): Observable<any> {
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      debugger;
      this.setLocalData("_createmanagersfeedbackdetails", data);
    } else {
      return this.http
        .post(baseUrl + "createmanagersfeedbackdetails", data, httpOptions)
        .pipe(map(this.extractData), catchError(this.handleError));
    }
  }

  checkemanagersfeedbackdetails(data): Observable<any> {
    if (
      this.networkService.getCurrentNetworkStatus() === ConnectionStatus.Offline
    ) {
      debugger;
      this.setLocalData("_checkemanagersfeedbackdetails", data);
    } else {
      return this.http
        .post(baseUrl + "checkemanagersfeedbackdetails", data, httpOptions)
        .pipe(map(this.extractData), catchError(this.handleError));
    }
  }

  // save manager survey
  createmanagersSurveydetails(data): Observable<any> {
    return this.http
      .post(baseUrl + "savedetailsmanagersurvey", data, httpOptions)
      .pipe(
        // createmanagersSurveydetails
        map(this.extractData),
        catchError(this.handleError)
      );
  }

  // save daily expenses
  savedailyexpense(data): Observable<any> {
    return this.http
      .post(baseUrl + "savedailyexpense", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get messages by userid
  getmessagesbyuserid(userid): Observable<any> {
    this.url = baseUrl + "getmessagesbyuserid/" + userid;
    return this.http
      .get(this.url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // update message status by id
  updatemessagebyid(id, data): Observable<any> {
    this.url = baseUrl + "updatemessagebyid/" + id;
    return this.http
      .put(this.url, data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get fcm token all
  getallfcmtokenids(): Observable<any> {
    return this.http
      .get(baseUrl + "getallfcmtokenids", httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // get fcm token by userid
  getfcmtokenidbyuserid(userid): Observable<any> {
    return this.http
      .get(baseUrl + "getfcmtokenidbyuserid/" + userid, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // save fcm token
  createnewfcmtokenid(data): Observable<any> {
    return this.http
      .post(baseUrl + "createnewfcmtokenid", data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  // update fcm token
  updatefcmtokenid(id, data): Observable<any> {
    return this.http
      .put(baseUrl + "updatefcmtokenid/" + id, data, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  //-------------------------------------------------------------------------

  getClassroom(): Observable<any> {
    return this.http
      .get(baseUrl, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  getClassroomById(id: string): Observable<any> {
    const url = `${baseUrl}/${id}`;
    return this.http
      .get(url, httpOptions)
      .pipe(map(this.extractData), catchError(this.handleError));
  }

  postClassroom(data): Observable<any> {
    const url = `${baseUrl}/add_with_students`;
    return this.http
      .post(url, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  updateClassroom(id: string, data): Observable<any> {
    const url = `${baseUrl}/${id}`;
    return this.http
      .put(url, data, httpOptions)
      .pipe(catchError(this.handleError));
  }

  deleteClassroom(id: string): Observable<{}> {
    const url = `${baseUrl}/${id}`;
    return this.http
      .delete(url, httpOptions)
      .pipe(catchError(this.handleError));
  }

  show(url: string) {}

  //Manager App NEw Reqquirment
  getPasscodeByManager(managerid): Observable<any> {
    this.url = baseUrl + "/getpasscodebymanagerid/" + managerid;
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
  }

  getDashboardDetails(passcode): Observable<any> {
    this.url = baseUrl + "/getdashboarddetails/" + passcode;
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
  }

  //Teacher Under Manager
  getAllTeachersUnderManager(managerid, passcode): Observable<any> {
    this.url =
      baseUrl + "getteacherbymgridpasscode/" + managerid + "/" + passcode;
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
  }

  //Get all schools under Passcodes
  getAllScholsUnderPasscode(passcode): Observable<any> {
    this.url = baseUrl + "getalludisecodesregisteredbypasscode/" + passcode;
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
  }

  //Get all teachers under School
  getAllTeachersUnderSchool(passcode, udisecode): Observable<any> {
    this.url =
      baseUrl +
      "getallteacherlistbypasscodebyudisecode/" +
      passcode +
      "/" +
      udisecode;
    return this.http.get(this.url, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
  }

  //Get students data by school and class
  getStudentsDataByClass(studentClass, teacherData): Observable<any> {
    this.url = baseUrl + "getallstudentsbyuseridlistbyclass/" + studentClass;
    return this.http.post(this.url, teacherData, httpOptions).pipe(
      map(this.extractData),
      tap((res) => {}),
      catchError(this.handleError)
    );
  }
}
