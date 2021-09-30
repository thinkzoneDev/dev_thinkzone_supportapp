import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", loadChildren: "./pages/login/login.module#LoginPageModule" },
  {
    path: "register",
    loadChildren: "./pages/register/register.module#RegisterPageModule",
  },
  { path: "about", loadChildren: "./pages/about/about.module#AboutPageModule" },
  {
    path: "settings",
    loadChildren: "./pages/settings/settings.module#SettingsPageModule",
  },
  {
    path: "edit-profile",
    loadChildren:
      "./pages/edit-profile/edit-profile.module#EditProfilePageModule",
  },
  {
    path: "home-results",
    loadChildren:
      "./pages/home-results/home-results.module#HomeResultsPageModule",
  },
  {
    path: "center",
    loadChildren: "./pages/center/center.module#CenterPageModule",
  },
  {
    path: "feedback",
    loadChildren: "./pages/feedback/feedback.module#FeedbackPageModule",
  },
  {
    path: "payment",
    loadChildren: "./pages/payment/payment.module#PaymentPageModule",
  },
  {
    path: "assessment",
    loadChildren: "./pages/assessment/assessment.module#AssessmentPageModule",
  },
  {
    path: "community",
    loadChildren: "./pages/community/community.module#CommunityPageModule",
  },
  {
    path: "issues",
    loadChildren: "./pages/issues/issues.module#IssuesPageModule",
  },
  {
    path: "survey-issues",
    loadChildren:
      "./pages/survey-issues/survey-issues.module#SurveyIssuesPageModule",
  },
  {
    path: "expense",
    loadChildren: "./pages/expense/expense.module#ExpensePageModule",
  },
  {
    path: "message",
    loadChildren: "./pages/message/message.module#MessagePageModule",
  },
  {
    path: "manager-box",
    loadChildren: "./pages/manager/manager.module#ManagerPageModule",
  },
  {
    path: "manager-folderview",
    loadChildren:
      "./pages/managerfolderview/managerfolderview.module#ManagerfolderviewPageModule",
  },
  {
    path: "calender-todo",
    loadChildren: "./pages/calender/calender.module#CalenderComponentModule",
  },
  {
    path: "anganwadi",
    loadChildren: "./pages/anganwadi/anganwadi.module#AnganwadiComponentModule",
  },
  {
    path: "centers",
    loadChildren: "./pages/centers/centers.module#CentersComponentModule",
  },
  {
    path: "fellow",
    loadChildren: "./pages/fellow/fellow.module#FellowComponentModule",
  },
  {
    path: "training",
    loadChildren: "./pages/training/training.module#TrainingComponentModule",
  },
  {
    path: "school",
    loadChildren: "./pages/school/school.module#SchoolComponentModule",
  },
  {
    path: "main-menu",
    loadChildren: "./pages/main-menu/main-menu.module#MainMenuModule",
  },
  {
    path: "add-task/:selectdate",
    loadChildren: "./pages/addTask/addTask.module#AddTaskPageModule",
  },

  {
    path: "training-module",
    loadChildren:
      "./pages/training-modules/training.module#TrainingModuleComponentModule",
  },
  {
    path: "training-content",
    loadChildren:
      "./pages/training-content/training.module#TrainingModuleComponentModule",
  },

  { path: "quiz", loadChildren: "./pages/quiz/quiz.module#QuizPageModule" },

  { path: "video", loadChildren: "./pages/video/video.module#VideoPageModule" },
  {
    path: "worksheet",
    loadChildren: "./pages/worksheet/worksheet.module#WorksheetPageModule",
  },

  {
    path: "showpushnotification/:message",
    loadChildren:
      "./pages/showpushnotification/showpushnotification.module#ShowpushnotificationPageModule",
  },
  {
    path: "profile",
    loadChildren: "./pages/profile/profile.module#ProfilePageModule",
  },
  { path: "test", loadChildren: "./pages/test/test.module#TestPageModule" },
  { path: "hbl", loadChildren: "./pages/hbl/hbl.module#HblPageModule" },
  {
    path: "hbl-teacher-details",
    loadChildren:
      "./pages/hbl-teacher-details/hbl-teacher-details.module#HblTeacherDetailsPageModule",
  },
  {
    path: "hbl-teacherinfo",
    loadChildren:
      "./pages/hbl-teacherinfo/hbl-teacherinfo.module#HblTeacherinfoPageModule",
  },
  {
    path: "hblpasscodewiseteacher",
    loadChildren:
      "./pages/hblpasscodewiseteacher/hblpasscodewiseteacher.module#HblpasscodewiseteacherPageModule",
  },
  {
    path: "hbl-school-by-passcode",
    loadChildren:
      "./pages/hbl-school-by-passcode/hbl-school-by-passcode.module#HblSchoolByPasscodePageModule",
  },
  {
    path: "hblschool-wisedata",
    loadChildren:
      "./pages/hblschool-wisedata/hblschool-wisedata.module#HblschoolWisedataPageModule",
  },  { path: 'school-details', loadChildren: './pages/school-details/school-details.module#SchoolDetailsPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
