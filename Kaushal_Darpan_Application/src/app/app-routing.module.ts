
import { Title } from '@angular/platform-browser';
import { RouterModule, Routes, TitleStrategy, RouterStateSnapshot } from '@angular/router';
import { MasterLayoutComponent } from './Views/Shared/master-layout/master-layout.component';
import { HomeLayoutComponent } from './Views/Shared/home-layout/home-layout.component';
import { AuthLayoutComponent } from './Views/Shared/auth-layout/auth-layout.component';
import { Injectable, NgModule } from '@angular/core';
import { AuthGuard } from './Common/auth.guard.ts';
import { DTEApplicationLayoutComponent } from './Views/Shared/dte-application-layout/dte-application-layout.component';
import { Home2LayoutComponent } from './Views/Shared/home2-layout/home2-layout.component';
import { BterPublicInfoLayoutComponent } from './Views/Shared/bter-publicinfo-layout/bter-publicinfo-layout.component';
const routes: Routes = [
  //{ path: '**', component: PageNotFoundComponent },// create not found component
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'

  },
  {
    path: '', component: Home2LayoutComponent,
    children: [
      {
        path: '', loadChildren: () => import('./Views/Home/home2/home2.module').then(m => m.Home2Module), title: 'Main'
      },
      { path: 'dynamic-content-list/:dept_sub_id/:duct_id', loadChildren: () => import('./Views/Home/dynamic-content-list/dynamic-content-list.module').then(m => m.DynamicContentListModule) },

      { path: 'itipublicinfo', loadChildren: () => import('./Views/iti-public-info/iti-public-info.module').then(m => m.ITIPublicInfoModule) },
      { path: 'ItiInstructorForm', loadChildren: () => import('./Views/ITI/ITI_Instructor/iti-instructor-form/iti-instructor-form.module').then(m => m.ItiInstructorFormModule) },
      { path: 'ItiInstructorForm/:id', loadChildren: () => import('./Views/ITI/ITI_Instructor/iti-instructor-form/iti-instructor-form.module').then(m => m.ItiInstructorFormModule) },
      { path: 'MainItiInstructorForm', loadChildren: () => import('./Views/ITI/ITI_Instructor/main-iti-instructor-form/main-iti-instructor-form.module').then(m => m.MainItiInstructorFormModule) },

      /* { path: 'itipublicinfotabs', loadChildren: () => import('./Views/itipublic-info-tabs/itipublic-info-tabs.module').then(m => m.ITIPublicInfoTabsModule) }*/
    ]
  },

  {
    path: '', component: BterPublicInfoLayoutComponent,
    children: [
      { path: 'dtepublicinfo', loadChildren: () => import('./Views/dte-public-info/dte-public-info.module').then(m => m.DTEPublicInfoModule) },
      { path: 'dtepublicinfo1', loadChildren: () => import('./Views/dte-public-info/dte-public-info.module').then(m => m.DTEPublicInfoModule) },
      { path: 'dtepublicinfo2', loadChildren: () => import('./Views/dte-public-info/dte-public-info.module').then(m => m.DTEPublicInfoModule) },
      { path: 'dtepublicinfo3', loadChildren: () => import('./Views/dte-public-info/dte-public-info.module').then(m => m.DTEPublicInfoModule) },
      { path: 'dtepublicinfo4', loadChildren: () => import('./Views/dte-public-info/dte-public-info.module').then(m => m.DTEPublicInfoModule) },
      { path: 'dtepublicinfo5', loadChildren: () => import('./Views/dte-public-info/dte-public-info.module').then(m => m.DTEPublicInfoModule) },

      { path: 'dtepublicinfotabs', loadChildren: () => import('./Views/dtepublic-info-tabs/dtepublic-info-tabs.module').then(m => m.DTEPublicInfoTabsModule) }

    ]
  },

  {
    //front web - home
    path: '', component: HomeLayoutComponent,
    children: [
      {
        path: 'index', loadChildren: () => import('./Views/Home/home/home.module').then(m => m.HomeModule), title: 'Main'
      },
      //{
      //  path: 'placement', loadChildren: () => import('./Views/Home/home/home.module').then(m => m.HomeModule), title: 'Placement'
      //},
      {
        path: 'index', loadChildren: () => import('./Views/Home/home/home.module').then(m => m.HomeModule), title: 'Placement'
      },

      {
        path: 'allpost', loadChildren: () => import('./Views/Home/all-post/all-post.module').then(m => m.AllPostModule), title: 'All Campus List'
      },


      {
        path: 'ITIallpost', loadChildren: () => import('./Views/Home/iti-all-post/iti-all-post.module').then(m => m.ITIAllPostModule), title: 'All Campus List'
      },

      {
        path: 'ITIsinglepost', loadChildren: () => import('./Views/ITI/single-post/single-post.module').then(m => m.SinglePostModule), title: 'Campus Details'
      },
      {
        path: 'ITIViewplacedStudent', loadChildren: () => import('./Views/ITI/view-placed-student/view-placed-student.routing.module').then(m => m.ViewPlacedStudentRoutingModule), title: 'Placed Student Details'
      },


      {
        path: 'singlepost', loadChildren: () => import('./Views/Home/single-post/single-post.module').then(m => m.SinglePostModule), title: 'Campus Details'
      },
      {
        path: 'ViewplacedStudent', loadChildren: () => import('./Views/Home/view-placed-student/view-placed-student.routing.module').then(m => m.ViewPlacedStudentRoutingModule), title: 'Placed Student Details'
      },
      {
        path: 'citizensuggestion', loadChildren: () => import('./Views/Citizen-Suggestion/citizen-suggestion/citizen-suggestion-routing.module').then(m => m.CitizenSuggestionRoutingModule), title: 'Citizen Suggetion'
      },
      {
        path: 'citizensuggestionTrack', loadChildren: () => import('./Views/Citizen-Suggestion/citizen-suggestion-track/citizen-suggestion-track.module').then(m => m.CitizenSuggestionTrackModule), title: 'Citizen Suggetion Track'
      },
      { path: 'tpodetails', loadChildren: () => import('./Views/Home/tpo-home/tpo-home.module').then(m => m.TPOHomeModule), title: 'TPO Details' },
      { path: 'UserRequest', loadChildren: () => import('./Views/user-request/user-request.module').then(m => m.UserRequestModule) },
      { path: 'placement-data', loadChildren: () => import('./Views/Home/placement-data/placement-data.module').then(m => m.PlacementDataModule) },
      {
        path: 'allpostlist', loadChildren: () => import('./Views/Home/all-postlist/all-postlist.module').then(m => m.AllPostlistModule), title: 'All Campus ex-non List'
      }
    ]
  },
  {
    //admin
    path: '', component: MasterLayoutComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'profile', loadChildren: () => import('./Views/profile/profile.module').then(m => m.ProfileModule), title: 'Profile'
      },


      {
        path: 'dashboard', loadChildren: () => import('./Views/dashboard/dashboard.module').then(m => m.dashboardModule), title: 'Dashboard'
      },
      {
        path: 'rolemaster', loadChildren: () => import('./Views/role-master/role-master.routing.module').then(m => m.RoleMasterRoutingModule), title: 'Role Master'
      },
      {
        path: 'loader', loadChildren: () => import('./Views/Shared/loader/loader.module').then(m => m.LoaderModule),
      },

      { path: 'designationmaster', loadChildren: () => import('./Views/designation-master/designation-master.routing.module').then(m => m.DesignationRoutingModule), title: 'Designation Master' },

      { path: 'levelmaster', loadChildren: () => import('./Views/level-master/level-master.routing.module').then(m => m.LevelRoutingModule), title: 'Level Master' },
      { path: 'CenterCreate', loadChildren: () => import('./Views/CenterAllotment/center-allotment/center-allotment.routing.module').then(m => m.CenterAllotmentRoutingModule), title: 'Create Center' },
      { path: 'generate-cc-code', loadChildren: () => import('./Views/CenterAllotment/generate-cc-code/generate-cc-code.module').then(m => m.GenerateCcCodeModule), title: 'Generate CC Code' },
      { path: 'SubjectMaster', loadChildren: () => import('./Views/subject-master/subject-master-routing.module').then(m => m.SubjectMasterRoutingModule), title: 'Subject Master' },
      { path: 'SubjectCategory', loadChildren: () => import('./Views/subject-category/subject-category.module.ts').then(m => m.SubjectCategoryRoutingModule), title: 'Subject Category' },
      { path: 'PlacementDashboard/:id', loadChildren: () => import('./Views/placement-dashboard/placement-dashboard.module').then(m => m.PlacementDashboardModule), title: 'Placement Dashboard' },
      { path: 'PlacementDashReport/:id', loadChildren: () => import('./Views/placement-dash-report/placement-dash-report.routing.module').then(m => m.RoleMasterRoutingModule), title: 'Placement Dashboard Report' },

      //{ path: 'rolemenuright/:id', loadChildren: () => import('./Views/role-menu-right/role-menu-right.module').then(m => m.RoleMenuRightModule) },

      //Old Software Master
      { path: 'updatecollegemaster/:id', loadChildren: () => import('./Views/CollegeMaster/add-college-master/add-college-master.module').then(m => m.AddCollegeMasterModule), title: 'Update College' },
      { path: 'updatecollegemaster', loadChildren: () => import('./Views/CollegeMaster/add-college-master/add-college-master.module').then(m => m.AddCollegeMasterModule), title: 'Update College' },
      { path: 'collegemaster', loadChildren: () => import('./Views/CollegeMaster/college-master/college-master.module').then(m => m.CollegeMasterModule), title: 'College Master' },
      { path: 'collegemaster/:id', loadChildren: () => import('./Views/CollegeMaster/college-master/college-master.module').then(m => m.CollegeMasterModule), title: 'College Master' },
      { path: 'collegesjanaadhar', loadChildren: () => import('./Views/PreExam/colleges-janaadhar/colleges-janaadhar.module').then(m => m.CollegesJanaadharModule), title: 'College Janaadhaar' },
      { path: 'studentsjanaadhar', loadChildren: () => import('./Views/PreExam/students-janaadhar/students-janaadhar.module').then(m => m.StudentsJanaadharModule), title: 'Student Janaadhaar' },
      { path: 'janaadhar-list', loadChildren: () => import('./Views/PreExam/janaadhar-list/janaadhar.module').then(m => m.JanaadharModule), title: "Janaadhar" },
      { path: 'addbranchesmaster', loadChildren: () => import('./Views/BranchesMaster/add-branches-master/add-branches-master.module').then(m => m.AddBranchesMasterModule), title: 'Add Branch' },
      { path: 'addbranches', loadChildren: () => import('./Views/BranchesMaster/add-branches/add-branches.module').then(m => m.AddBranchesModule), title: 'Add Branch' },
      { path: 'updatebranchesmaster/:id', loadChildren: () => import('./Views/BranchesMaster/add-branches-master/add-branches-master.module').then(m => m.AddBranchesMasterModule), title: 'Update Branch' },


      { path: 'branchesmaster', loadChildren: () => import('./Views/BranchesMaster/branches-master/branches-master.module').then(m => m.BranchesMasterModule), title: 'Branch Master' },
      { path: 'updatepapersmaster/:id', loadChildren: () => import('./Views/PapersMaster/add-papers-master/add-papers-master.module').then(m => m.AddPapersMasterModule), title: 'Update Paper' },
      { path: 'addpapersmaster', loadChildren: () => import('./Views/PapersMaster/add-papers-master/add-papers-master.module').then(m => m.AddPapersMasterModule), title: 'Add Paper' },
      { path: 'papersmaster', loadChildren: () => import('./Views/PapersMaster/papers-master/papers-master.module').then(m => m.PapersMasterModule), title: 'Paper Master' },

      { path: 'updateGroup/:id', loadChildren: () => import('./Views/Groups/add-groups/add-groups.module').then(m => m.AddGroupsModule), title: 'Updat Group' },
      { path: 'addgroups', loadChildren: () => import('./Views/Groups/add-groups/add-groups.module').then(m => m.AddGroupsModule), title: 'Add Group' },
      { path: 'groups', loadChildren: () => import('./Views/Groups/groups/groups.module').then(m => m.GroupsModule), title: 'Group Master' },
      { path: 'dashboard-issue-tracker', loadChildren: () => import('./Views/dashboard-issue-tracker/dashboard-issue-tracker.module').then(m => m.dashboardIssueTrackerModule) },

      { path: 'addgroupcenter', loadChildren: () => import('./Views/GroupCenter/add-group-center/add-group-center.module').then(m => m.AddGroupCenterModule), title: 'Add Group Center' },
      { path: 'groupcenter', loadChildren: () => import('./Views/GroupCenter/group-center/group-center.module').then(m => m.GroupCenterModule), title: 'Group Center' },

      { path: 'addtimetable', loadChildren: () => import('./Views/TimeTable/add-time-table/add-time-table.module').then(m => m.AddTimeTableModule), title: 'Add Time Table' },
      { path: 'updatetimetable/:id', loadChildren: () => import('./Views/TimeTable/add-time-table/add-time-table.module').then(m => m.AddTimeTableModule), title: 'Update Time Table' },
      { path: 'timetable', loadChildren: () => import('./Views/TimeTable/time-table/time-table.module').then(m => m.TimeTableModule), title: 'Time Table' },
      { path: 'verify-timetable/:id', loadChildren: () => import('./Views/TimeTable/verify-time-table/verify-time-table.module').then(m => m.VerifyTimeTableModule), title: 'Time Table' },

      { path: 'addcenters', loadChildren: () => import('./Views/Centers/add-centers/add-centers.module').then(m => m.AddCentersModule), title: 'Add Center' },
      { path: 'centers', loadChildren: () => import('./Views/Centers/centers/centers.module').then(m => m.CentersModule), title: 'Centers' },
      { path: 'updatecentermaster', loadChildren: () => import('./Views/Centers/add-centers/add-centers.module').then(m => m.AddCentersModule), title: 'Update Center' },

      { path: 'editstudentsjanaadhar/:ExamMasterID', loadChildren: () => import('./Views/PreExam/add-edit-student-janaadhar/add-edit-student-janaadhar.module').then(m => m.AddEditStudentJanaadharModule), title: 'Edit Student Janaadhaar' },

      { path: 'addcommonsubjects', loadChildren: () => import('./Views/CommonSubjects/add-common-subjects/add-common-subjects.module').then(m => m.AddCommonSubjectsModule), title: 'Add Common Subject' },
      { path: 'commonsubjects', loadChildren: () => import('./Views/CommonSubjects/common-subjects/common-subjects.module').then(m => m.CommonSubjectsModule), title: 'Common Subject' },
      { path: 'roster-display', loadChildren: () => import('./Views/roste/roste.module').then(m => m.RosteModule), title: 'Roste Module' },

      { path: 'managetpo', loadChildren: () => import('./Views/TPOMaster/create-tpo/create-tpo.module').then(m => m.CreateTpoModule) },
      { path: 'tpo-details', loadChildren: () => import('./Views/TPOMaster/details-tpo/details-tpo.module').then(m => m.DetailsTpoModule) },
      { path: 'campusvalidation', loadChildren: () => import('./Views/campus-validation/campus-validation.module').then(m => m.CampusValidationModule) },

      { path: 'placementstudent', loadChildren: () => import('./Views/PlacementStudent/placement-student/placement-student.module').then(m => m.PlacementStudentModule), title: 'Placement student' },
      { path: 'menumaster', loadChildren: () => import('./Views/menu-master/menu-master.module').then(m => m.MenuMasterModule), title: 'Menu Master' },
      { path: 'centerallocation', loadChildren: () => import('./Views/Center_Allocation/center-allocation/center-allocation.module').then(m => m.CenterAllocationModule), title: 'Center Allocation' },

      { path: 'campuspost', loadChildren: () => import('./Views/campus-post/campus-post.module').then(m => m.CampusPostModule), title: 'Campus Post' },
      { path: 'campuspost/:id', loadChildren: () => import('./Views/campus-post/campus-post.module').then(m => m.CampusPostModule), title: 'Campus Post' },
      { path: 'campuspostlist', loadChildren: () => import('./Views/campus-post-list/campus-post-list.module').then(m => m.CampusPostListModule), title: 'Campus Post List' },

      { path: 'placementverifiedstudenttpo', loadChildren: () => import('./Views/PlacementVerifiedStudentTPO/placement-verified-student-tpo/placement-verified-student-tpo.module').then(m => m.PlacementVerifiedStudentTpoModule), title: 'Placement Verified Student TPO' },
      { path: 'updatecentermaster/:id', loadChildren: () => import('./Views/Centers/add-centers/add-centers.module').then(m => m.AddCentersModule), title: 'Update Center' },
      { path: 'rolemenurights', loadChildren: () => import('./Views/role-menu-rights/role-menu-rights.module').then(m => m.RoleMenuRightsModule), title: 'Role Menu Rights' },
      { path: 'rolemenurights/:id', loadChildren: () => import('./Views/role-menu-rights/role-menu-rights.module').then(m => m.RoleMenuRightsModule), title: 'Role Menu Rights' },
      { path: 'usermaster', loadChildren: () => import('./Views/user-master/user-master.module').then(m => m.UserMasterModule), title: 'User Master' },
      { path: 'usermenurights', loadChildren: () => import('./Views/user-menu-rights/user-menu-rights.module').then(m => m.UserMenuRightsModule), title: 'User Menu Rights' },
      { path: 'placementshortlistedstudents', loadChildren: () => import('./Views/placement-shortlisted-students/placement-shortlisted-students/placement-shortlisted-students.module').then(m => m.PlacementShortlistedStudentsModule), title: 'Placement Shortlisted Student' },
      { path: 'placementselectedstudents', loadChildren: () => import('./Views/placement-selected-students/placement-selected-students.module').then(m => m.PlacementSelectedStudentsModule), title: 'Placement Selected Student' },
      { path: 'AddHrmaster', loadChildren: () => import('./Views/Hr-Master/add-hr-master/add-hr-master.module').then(m => m.AddHrmasterModule), title: 'Add HR' },
      { path: 'Hrmaster', loadChildren: () => import('./Views/Hr-Master/hr-master/hr-master.module').then(m => m.HrmasterModule), title: 'HR Master' },
      { path: 'AddCompany', loadChildren: () => import('./Views/CompanyMaster/add-company-master/add-company-module').then(m => m.CompanyMasterModule), title: 'Add Company' },
      { path: 'CompanyMaster', loadChildren: () => import('./Views/CompanyMaster/company-master/company-master.module').then(m => m.CompanyMasterListModule), title: 'Company Master' },

      { path: 'addstaffmaster', loadChildren: () => import('./Views/staffMaster/add-staff-master/add-staff-master.module').then(m => m.AddStaffMasterModule), title: 'Add Staff' },
      { path: 'staffmaster', loadChildren: () => import('./Views/staffMaster/staff-master/staff-master.module').then(m => m.StaffMasterModule), title: 'Staff Master' },
      { path: 'addstaffbasicdetail', loadChildren: () => import('./Views/staffMaster/add-staff-basic-detail/add-staff-basic-detail.module').then(m => m.AddStaffBasicDetailModule), title: 'Add Staff Basic Details' },
      { path: 'addstaffbasicinfo', loadChildren: () => import('./Views/staffMaster/add-staff-basic-info/add-staff-basic-info.module').then(m => m.AddStaffBasicInfoModule) },

      /*{ path: 'InvigilatorAppointment', loadChildren: () => import('./Views/InvigilatorAppointment/invigilator-appointment/invigilator-appointment.module').then(m => m.InvigilatorAppointmentModule), title: 'Invigilator Appointment' },*/
      //reroute
      { path: 'InvigilatorAppointment', loadChildren: () => import('./Views/TimeTable/time-table/time-table.module').then(m => m.TimeTableModule), title: 'Invigilator Appointment' },

      { path: 'ExaminerAppointment', loadChildren: () => import('./Views/appoint-examiner/appoint-examiner.module').then(m => m.AppointExaminerModule), title: 'Examiner Appointment' },
      { path: 'abcidstudentdetails', loadChildren: () => import('./Views/abc-id-student-details/abc-id-student-details.module').then(m => m.AbcIdStudentDetailsModule), title: 'ABCID Student Details' },
      { path: 'exammaster', loadChildren: () => import('./Views/Exam Master/exam-master/exam-master.module').then(m => m.ExamMasterModule), title: 'Exam Master' },
      { path: 'addexam', loadChildren: () => import('./Views/Exam Master/add-exam/add-exam.module').then(m => m.AddExamModule), title: 'Add Exam' },
      { path: 'roomsmaster', loadChildren: () => import('./Views/Rooms/rooms-master/rooms-master.module').then(m => m.RoomsMasterModule), title: 'Room Master' },
      { path: 'addrooms', loadChildren: () => import('./Views/Rooms/add-rooms/add-rooms.module').then(m => m.AddRoomsModule), title: 'Add Room' },
      { path: 'scactivities', loadChildren: () => import('./Views/student-centered-activites-master/student-centered-activites.module').then(m => m.StudentCenteredActivitesModule), title: 'Student Centered Activites' },
      //{ path: 'addexam', loadChildren: () => import('./Views/Exam Master/add-exam/add-exam.module').then(m => m.AddExamModule) },

      { path: 'setexamattendance', loadChildren: () => import('./Views/SetExamAttendance/set-exam-attendance/set-exam-attendance.module').then(m => m.SetExamAttendanceModule), title: 'Set Exam Attendance' },
      { path: 'unlock-exam-attendance', loadChildren: () => import('./Views/SetExamAttendance/unlock-exam-attendance/unlock-exam-attendance.module').then(m => m.UnlockExamAttendanceModule), title: 'Unlock Exam Attendance' },
      { path: 'internal-exam-attendance', loadChildren: () => import('./Views/SetExamAttendance/internal-practical-exam-attendance/internal-practical-exam-attendance.module').then(m => m.InternalPracticalExamAttendanceModule), title: 'Set Exam Attendance' },
      { path: 'sca-exam-attendance', loadChildren: () => import('./Views/SetExamAttendance/sca-exam-attendance/sca-exam-attendance.module').then(m => m.SCAExamAttendanceModule), title: 'Set Exam Attendance' },
      { path: 'staffdashboard', loadChildren: () => import('./Views/staff-dashboard/staff-dashboard.module').then(m => m.StaffDashboardModule), title: 'Staff Dashboard' },
      { path: 'examinerdashboard', loadChildren: () => import('./Views/examiner-dashboard/examiner-dashboard.module').then(m => m.ExaminerDashboardModule), title: 'Examiner Dashboard' },
      { path: 'StaffDashReport/:id', loadChildren: () => import('./Views/staff-dash-report/staff-dash-report.module').then(m => m.StaffDashReportMasterModule), title: 'Staff Dashboard Report' },
      { path: 'Principledashboard', loadChildren: () => import('./Views/principle-dashboard/principle-dashboard.module').then(m => m.PrincipleDashboardModule), title: 'Principle Dashboard' },
      { path: 'StudentDashboard', loadChildren: () => import('./Views/student-dashboard/student-dashboard.module').then(m => m.StudentDashboardModule), title: 'Student Dashboard' },
      { path: 'StudentPendingFees', loadChildren: () => import('./Views/Student/pending-fees/pending-fees.module').then(m => m.PendingFeesModule), title: 'Student Pending Fees' },

      { path: 'StudentPaidFees', loadChildren: () => import('./Views/Student/paid-fees/paid-fees.module').then(m => m.PaidFeesModule), title: 'Student Paid Fees' },
      { path: 'StudentFailedFees', loadChildren: () => import('./Views/Student/paid-fees/paid-fees.module').then(m => m.PaidFeesModule), title: 'Student Paid Fees' },
      { path: 'StudentProfile', loadChildren: () => import('./Views/Student/student-profile/student-profile.module').then(m => m.StudentProfileModule), title: 'Student Profile' },
      { path: 'studentprofiledownload', loadChildren: () => import('./Views/Student/student-profile-download/student-profile-download.module').then(m => m.StudentProfileDownloadModule), title: 'Student Profile' },
      {
        path: 'StudentSsoMapping', loadChildren: () => import('./Views/Student/student-sso-mapping/student-sso-mapping.module').then(m => m.StudentSsoMappingModule), title: 'Student SSO Mapping'
      },
      { path: 'StudentEmitraFeePayment', loadChildren: () => import('./Views/Student/student-emitra-fee-payment/student-emitra-fee-payment.module').then(m => m.StudentEmitraFeePaymentModule), title: 'Student Emitra Fee Payment' },
      { path: 'GenerateEnrollment', loadChildren: () => import('./Views/generate-enroll/generate-enroll.module').then(m => m.GenerateEnrollModule), title: 'Generate Enrollment' },
      { path: 'TheoryMarks', loadChildren: () => import('./Views/theory-marks/theory-marks.module').then(m => m.theorymarksModule), title: 'Theory Marks' },
      
      { path: 'InternalPracticalStudent', loadChildren: () => import('./Views/internal-practical-student/internal-practical-student.module').then(m => m.InternalPracticalStudentModule), title: 'Internal Practical Student' },
      { path: 'InternalAssessmentStudents', loadChildren: () => import('./Views/internal-practical-student/internal-practical-student.module').then(m => m.InternalPracticalStudentModule), title: 'Internal Practical Student' },
      { path: 'GenerateRollnumber', loadChildren: () => import('./Views/generate-roll/generate-roll.module').then(m => m.GenerateRollModule), title: 'Generate Rollnumber' },
      { path: 'published-roll-no', loadChildren: () => import('./Views/published-roll-no/published-roll-no.module').then(m => m.PublishedRollNoModule), title: 'Published Roll No' },
      { path: 'copycheckdash', loadChildren: () => import('./Views/CopyChecker/copy-checker-dashboard/copy-checker-dashboard.module').then(m => m.CopyCheckerDashboardModule), title: 'Copy Checker Dashboard' },
      { path: 'generate-reval-rollnumber', loadChildren: () => import('./Views/generate-reval-roll-number/generate-reval-roll-number/generate-reval-roll-number.module').then(m => m.GenerateRevalRollNumberModule), title: 'Generate Reval Rollnumber' },
      { path: 'verify-reval-roll-number', loadChildren: () => import('./Views/generate-reval-roll-number/verify-reval-roll-number/verify-reval-roll-number.module').then(m => m.VerifyRevalRollNumberModule), title: 'Reval Rollnumber' },
      { path: 'theory-marks-reval', loadChildren: () => import('./Views/theory-marks-reval/theory-marks-reval.module').then(m => m.TheoryMarksRevalModule), title: 'Theory Marks' },

      { path: 'examiners', loadChildren: () => import('./Views/Examiner/examiners/examiners.module').then(m => m.ExaminersModule), title: 'Examiner' },
      { path: 'addexaminers', loadChildren: () => import('./Views/Examiner/add-examiner/add-examiner.module').then(m => m.AddExaminerModule), title: 'Add Examiner' },
      { path: 'AppointExaminerList', loadChildren: () => import('./Views/appoint-examiner-list/appoint-examiner-list.module').then(m => m.AppointExaminerListModule), title: 'Appoint Examiner List' },
      { path: 'SemesterDetails', loadChildren: () => import('./Views/Student/semester-details/semester-details.module').then(m => m.SemesterDetailsModule), title: 'Semester Details' },
      { path: 'ExamTicket', loadChildren: () => import('./Views/Student/exam-ticket/exam-ticket.module').then(m => m.ExamTicketModule), title: 'Exam Ticket' },
      { path: 'studentexamination', loadChildren: () => import('./Views/PreExam/pre-exam-student-examination/pre-exam-student-examination.module').then(m => m.PreExamStudentExaminationModule), title: 'Pre Exam Student Examination' },
      { path: 'studentexamination/:id', loadChildren: () => import('./Views/PreExam/pre-exam-student-examination/pre-exam-student-examination.module').then(m => m.PreExamStudentExaminationModule), title: 'Pre Exam Student Examination' },
      { path: 'studentexamination/:id/:instituteId', loadChildren: () => import('./Views/PreExam/pre-exam-student-examination/pre-exam-student-examination.module').then(m => m.PreExamStudentExaminationModule), title: 'Pre Exam Student Examination' },
      { path: 'preexamstudent', loadChildren: () => import('./Views/PreExam/pre-exam-student/pre-exam-student.module').then(m => m.PreExamStudentModule), title: 'Pre Exam Student Examination' },
      //{ path: 'preexamstudent/:id', loadChildren: () => import('./Views/reports/pre-exam-student-reoprt/pre-exam-student-reoprt.module').then(m => m.PreExamStudentReportModule), title: 'Pre Exam Student Examination' },
      //{ path: 'preexamstudent/:id/:instituteId', loadChildren: () => import('./Views/reports/pre-exam-student-reoprt/pre-exam-student-reoprt.module').then(m => m.PreExamStudentReportModule), title: 'Pre Exam Student Examination' },
      { path: 'detained-students', loadChildren: () => import('./Views/PreExam/detained-students/detained-students.module').then(m => m.DetainedStudentsModule), title: 'Detained Students' },
      { path: 'pre-exam-student-verification', loadChildren: () => import('./Views/PreExam/pre-exam-student-verification/pre-exam-student-verification.module').then(m => m.PreExamStudentVerificationModule), title: 'Student Verification' },

      { path: 'studentenrollment', loadChildren: () => import('./Views/studentenrollment/student-enrollment.module').then(m => m.StudentEnrollmentModule), title: 'Student Enrollment' },
      { path: 'studentenrollment/:id', loadChildren: () => import('./Views/studentenrollment/student-enrollment.module').then(m => m.StudentEnrollmentModule), title: 'Student Enrollment' },
      { path: 'studentenrollmentadmitted', loadChildren: () => import('./Views/student-enrollment-admitted/student-enrollment-admitted.module').then(m => m.StudentEnrollmentAdmittedModule), title: 'Student Enrollment' },
      { path: 'ItiStudentEnrollment', loadChildren: () => import('./Views/ITI/Examination/iti-student-enrollment/iti-student-enrollment.module').then(m => m.ItiStudentEnrollmentModule), title: 'Student Enrollment' },
      //{ path: 'studentenrollment/:id', loadChildren: () => import('./Views/reports/studentenrollmentreport/student-enrollment-report.module').then(m => m.StudentEnrollmentReportModule), title: 'ITI Student Enrollment' },
      //{ path: 'studentenrollment/:id', loadChildren: () => import('./Views/reports/studentenrollmentreport/student-enrollment-report.module').then(m => m.StudentEnrollmentReportModule), title: 'Student Enrollment' },
      //{ path: 'studentenrollment/:id/:instituteId', loadChildren: () => import('./Views/reports/studentenrollmentreport/student-enrollment-report.module').then(m => m.StudentEnrollmentReportModule), title: 'Student Enrollment' },
      { path: 'InvigilatorExamList', loadChildren: () => import('./Views/SetExamAttendance/invigilator-exam-list/invigilator-exam-list.module').then(m => m.InvigilatorExamListModule), title: 'Invigilator Exam List' },
      { path: 'GenerateAdmitcard', loadChildren: () => import('./Views/generate-admitcard/generate-admitcard.module').then(m => m.GenerateAdmitcardModule), title: 'Generate Admit Card' },
      { path: 'StudentDetailUpdate', loadChildren: () => import('./Views/student-detail-update/student-detail-update.module').then(m => m.StudentDetailUpdateModule), title: 'Update Student Detail' },
      { path: 'IssueCertificate', loadChildren: () => import('./Views/Principal/issue-certificate/issue-certificate.module').then(m => m.IssueCertificateModule), title: 'Issue Certificate' },
      { path: 'GenerateAdmitCardBulk', loadChildren: () => import('./Views/generate-admit-card-bulk/generate-admit-card-bulk.module').then(m => m.GenerateAdmitCardBulkModule), title: 'Bulk Generate Admit Card' },

      { path: 'ApplicationFormTab', loadChildren: () => import('./Views/ITI/application-form-tab/application-form-tab.module').then(m => m.ApplicationFormTabModule), title: 'ITI-Application Form' },
      { path: 'addressdetailsform', loadChildren: () => import('./Views/ITI/address-details-form-tab/address-details-form-tab.module').then(m => m.AddressDetailsFormTabModule), title: 'Address Details' },
      { path: 'documentdetailsform', loadChildren: () => import('./Views/ITI/document-details-form-tab/document-details-form-tab.module').then(m => m.DocumentDetailsFormTabModule), title: 'Document Details' },
      { path: 'optionsform', loadChildren: () => import('./Views/ITI/option-form-tab/option-form-tab.module').then(m => m.OptionFormTabModule), title: 'Options' },
      { path: 'Itipreviewform', loadChildren: () => import('./Views/ITI/preview-form-tab/preview-form-tab.module').then(m => m.PreviewFormTabModule), title: 'ITI Preview' },
      // { path: 'qualificationform', loadChildren: () => import('./Views/ITI/qualification-tab/qualification-tab.module').then(m => m.QualificationTabModule) },

      { path: 'Applicationform', loadChildren: () => import('./Views/Polytechnic/application-form/application-form.module').then(m => m.ApplicationFormModule), title: 'BTER-Application Form' },
      { path: 'QualificationForm', loadChildren: () => import('./Views/Polytechnic/qualification-form/qualification-form.module').then(m => m.QualificationFormModule), title: 'Qualifications' },
      { path: 'Personaldetails', loadChildren: () => import('./Views/Polytechnic/personal-details/personal-details.module').then(m => m.PersonalDetailsModule), title: 'Personal Details' },
      { path: 'PreviewForm', loadChildren: () => import('./Views/Polytechnic/preview-form/preview-form.module').then(m => m.PreviewFormModule), title: 'Preview Form' },


      { path: 'total-student-reported-list/:id/:anotherParam', loadChildren: () => import('./Views/BTER/nodal/verifier/nodal-verifier.module').then(m => m.NodalVerifierModule), title: 'Preview Form' },
      { path: 'nodal-dashboard-list', loadChildren: () => import('./Views/BTER/nodal/nodal-dashboard/nodal-dashboard.module').then(m => m.NodalDashboardModule), title: 'Preview Form' },


      { path: 'HiringRoleMaster', loadChildren: () => import('./Views/hiring-role-master/hiring-role-master.routing.module').then(m => m.HiringRoleMasterRoutingModule), title: 'Hiring Role Master' },
      { path: 'DownloadRollNumberList', loadChildren: () => import('./Views/download-roll-number-list/download-roll-number-list.module').then(m => m.DownloadRollNumberListModule), title: 'Download RollNumber List' },

      { path: 'CompanyValidation', loadChildren: () => import('./Views/company-validation/company-validation.module').then(m => m.CompanyValidationModule), title: 'Company Validation' },
      { path: 'HrMasterValidation', loadChildren: () => import('./Views/hr-master-validation/hr-master-validation.module').then(m => m.HrMasterValidationModule), title: 'HR Master Validation' },

      { path: 'DocumentForm', loadChildren: () => import('./Views/Polytechnic/document-form/document-form.module').then(m => m.DocumentFormModule), title: 'Document Form' },
      { path: 'Addressform', loadChildren: () => import('./Views/Polytechnic/address-form/address-form.module').then(m => m.AddressFormModule), title: 'Address Form' },
      { path: 'OptionalForm', loadChildren: () => import('./Views/Polytechnic/optional-form/optional-form.module').then(m => m.OptionalFormModule), title: 'Optional Form' },
      { path: 'Otherdetails', loadChildren: () => import('./Views/Polytechnic/other-details-form/other-details-form.module').then(m => m.OtherDetailsFormModule), title: 'Other Details' },
      //{ path: 'UserRequest', loadChildren: () => import('./Views/user-request/user-request.module').then(m => m.UserRequestModule), title: 'User Requst' },
      { path: 'StudentJanAadharDetail', loadChildren: () => import('./Views/Polytechnic/student-jan-aadhar-detail/student-jan-aadhar-detail.module').then(m => m.StudentJanAadharDetailModule), title: 'Student JanAadhaar Detail' },
      { path: 'StudentJanAadharDetail', loadChildren: () => import('./Views/Polytechnic/student-jan-aadhar-detail/student-jan-aadhar-detail.module').then(m => m.StudentJanAadharDetailModule), title: 'Student JanAadhaar Detail' },
      { path: 'StudentJanAadharDetail/:depid', loadChildren: () => import('./Views/Polytechnic/student-jan-aadhar-detail/student-jan-aadhar-detail.module').then(m => m.StudentJanAadharDetailModule), title: 'Student JanAadhaar Detail' },

      { path: 'DirectStudentJanAadharDetail', loadChildren: () => import('./Views/BTER/direct-student-jan-aadhar-detail/direct-student-jan-aadhar-detail.module').then(m => m.DirectStudentJanAadharDetailModule), title: 'Direct Student JanAadhaar Detail' },
      { path: 'DirectStudentJanAadharDetail/:depid', loadChildren: () => import('./Views/BTER/direct-student-jan-aadhar-detail/direct-student-jan-aadhar-detail.module').then(m => m.DirectStudentJanAadharDetailModule), title: 'Direct Student JanAadhaar Detail' },

      { path: 'groupcodeallocation', loadChildren: () => import('./Views/groupcode-allocation/groupcode-allocation.module').then(m => m.GroupcodeAllocationModule), title: 'Group Code Allocation' },
      { path: 'groupcodeadd', loadChildren: () => import('./Views/groupcode-allocation/add-groupcode/add-groupcode.module').then(m => m.GroupcodeAddModule), title: 'Add Group Code' },

      //reval
      { path: 'groupcodeallocationreval', loadChildren: () => import('./Views/groupcode-allocation-reval/groupcode-allocation-reval.module').then(m => m.GroupcodeAllocationModule), title: 'Group Code Allocation' },
      { path: 'groupcodeaddreval', loadChildren: () => import('./Views/groupcode-allocation-reval/add-groupcode-reval/add-groupcode-reval.module').then(m => m.GroupcodeAddRevalModule), title: 'Add Group Code' },


      { path: 'ititrade', loadChildren: () => import('./Views/ITI/ITI-Trade/add-iti-trade/add-iti-trade.module').then(m => m.AddItiTradeModule), title: 'ITI Trade' },
      { path: 'ititradelist', loadChildren: () => import('./Views/ITI/ITI-Trade/list-iti-trade/list-iti-trade.module').then(m => m.ListItiTradeModule), title: 'ITI Trade List' },
      { path: 'ititradeUpdate/:id', loadChildren: () => import('./Views/ITI/ITI-Trade/add-iti-trade/add-iti-trade.module').then(m => m.AddItiTradeModule), title: 'ITI Trade Update' },
      { path: 'ITICollegeMaster', loadChildren: () => import('./Views/ITI/ITIs/itis/itis.module').then(m => m.ITIsModule), title: 'ITI College Master' },
      { path: 'ITIRollListAdmitcard', loadChildren: () => import('./Views/ITI/ITIs/itis/itis.module').then(m => m.ITIsModule), title: 'ITI Admit Card/Roll Lisrt' },
      { path: 'additi', loadChildren: () => import('./Views/ITI/ITIs/add-itis/add-itis.module').then(m => m.AddITIsModule), title: 'Add ITI' },

      { path: 'AdminDashboardITI', loadChildren: () => import('./Views/ITI/admin-dashboard-iti/admin-dashboard-iti.module').then(m => m.AdminDashboardITIModule), title: 'Admin Dashboard ITI' },
      { path: 'SeatIntakesList', loadChildren: () => import('./Views/ITI/Intakes/seat-intakes-list/seat-intakes-list.module').then(m => m.SeatIntakesListModule), title: 'Seat Intakes List' },
      { path: 'AddSeatIntakes', loadChildren: () => import('./Views/ITI/Intakes/add-seat-intakes/add-seat-intakes.module').then(m => m.AddSeatIntakesModule), title: 'Add Seat Intakes' },
      { path: 'AddSeatsDistributions', loadChildren: () => import('./Views/ITI/Seats-Distributions/add-seats-distributions/add-seats-distributions.module').then(m => m.AddSeatsDistributionsModule), title: 'Add Seats Distributions' },
      { path: 'SeatsDistributionsList', loadChildren: () => import('./Views/ITI/Seats-Distributions/seats-distributions-list/seats-distributions-list.module').then(m => m.SeatsDistributionsListModule), title: 'Seats Distributions List' },
      { path: 'ImportantLinksList', loadChildren: () => import('./Views/ITI/Important-Links/important-links-list/important-links-list.module').then(m => m.ImportantLinksListModule), title: 'Important Links List' },
      { path: 'AddImportantLinks', loadChildren: () => import('./Views/ITI/Important-Links/add-important-links/add-important-links.module').then(m => m.AddImportantLinksModule), title: 'Add Important Links' },
      { path: 'TspAreasList', loadChildren: () => import('./Views/ITI/Tsp-Areas/tsp-areas-list/tsp-areas-list.module').then(m => m.TspAreasListModule), title: 'TSP Areas List' },
      { path: 'AddTspAreas', loadChildren: () => import('./Views/ITI/Tsp-Areas/add-tsp-areas/add-tsp-areas.module').then(m => m.AddTspAreasModule), title: 'AddItiApplication/3 TSP Areas' },

      { path: 'itifee', loadChildren: () => import('./Views/ITI/iti-fee/iti-fee.module').then(m => m.ItiFeeModule), title: 'ITI Fee' },

      { path: 'verifiers', loadChildren: () => import('./Views/DTE_Verifier/verifier/verifier.module').then(m => m.VerifierModule), title: 'Verifiers' },
      { path: 'addverifier', loadChildren: () => import('./Views/DTE_Verifier/add-verifier/add-verifier.module').then(m => m.AddVerifierModule), title: 'Add Verifier' },
      { path: 'assignapplication', loadChildren: () => import('./Views/DTE_AssignApplication/assign-application-list/assign-application-list.module').then(m => m.AssignApplicationListModule), title: 'Assign Application' },
      { path: 'addassignapplication', loadChildren: () => import('./Views/DTE_AssignApplication/add-assign-application/add-assign-application.module').then(m => m.AddAssignApplicationModule), title: 'Add Assign Application' },
      { path: 'assignedstudentsapplicaitons', loadChildren: () => import('./Views/DTE_AssignApplication/assigned-applications/assigned-applications.module').then(m => m.AssignedApplicationsModule), title: 'Assigned Students Applicaitons' },
      { path: 'verifystudentapplicaiton', loadChildren: () => import('./Views/DTE_AssignApplication/verify-student-application/verify-student-application.module').then(m => m.VerifyStudentApplicationModule), title: 'Verify Student Applicaiton' },
      { path: 'ItiApplication', loadChildren: () => import('./Views/ITI/iti-application/iti-application.module').then(m => m.ItiApplicationModule), title: 'ITI Application' },
      { path: 'ItiApplication/:id', loadChildren: () => import('./Views/ITI/iti-application/iti-application.module').then(m => m.ItiApplicationModule), title: 'ITI Application' },
      { path: 'itiformstable', loadChildren: () => import('./Views/ITI/DashboardComponent/iti-forms-table/iti-forms-table.module').then(m => m.ItiFormsTableModule), title: 'ITI Form' },
      { path: 'itiformsprioritylist', loadChildren: () => import('./Views/ITI/DashboardComponent/iti-forms-priority-list/iti-forms-priority-list.module').then(m => m.ItiFormsPriorityListModule), title: 'ITI Forms priority List' },

      { path: 'documentationscrutiny', loadChildren: () => import('./Views/BTER/application-form/documentation-scrutiny/documentation-scrutiny.module').then(m => m.DocumentationScrutinyModule), title: 'Documentation Scrutiny' },
      { path: 'StudentVerificationList', loadChildren: () => import('./Views/Polytechnic/student-verification-list/student-verification-list.module').then(m => m.StudentVerificationListModule), title: 'Student Verification List' },
      { path: 'NodalDashboardITI', loadChildren: () => import('./Views/ITI/nodal-dashboard-iti/nodal-dashboard-iti.module').then(m => m.NodalDashboardITIModule), title: 'Nodal Dashboard ITI' },

      { path: 'citizensuggestion', loadChildren: () => import('./Views/Citizen-Suggestion/citizen-suggestion/citizen-suggestion.module').then(m => m.CitizenSuggestionModule), title: 'Citizen Suggestion' },
      { path: 'citizenQueryDetails', loadChildren: () => import('./Views/Citizen-Suggestion/citizenquery-details/citizenquery-details.module').then(m => m.CitizenqueryDetailsModule), title: 'Citizen Query Details' },
      { path: 'citizenQueryDetails/:id', loadChildren: () => import('./Views/Citizen-Suggestion/citizenquery-details/citizenquery-details.module').then(m => m.CitizenqueryDetailsModule), title: 'Citizen Query Details' },
      { path: 'dtedashboard', loadChildren: () => import('./Views/dte-dashboard/dte-dashboard.module').then(m => m.DTEDashboardModule), title: 'DTE Dashboard' },
      { path: 'date-wise-attendance-report', loadChildren: () => import('./Views/Reports/date-wise-attendance-report/date-wise-attendance-report.module').then(m => m.DateWiseAttendanceReportModule) },
      { path: 'reports/:id', loadChildren: () => import('./Views/Reports/reports/reports.module').then(m => m.ReportsModule), title: 'Reports' },
      { path: 'emitraapplicationstatus', loadChildren: () => import('./Views/Student/emitra-application-status/emitra-application-status.module').then(m => m.EmitraApplicationStatusModule), title: 'Emitra Application Status' },
      { path: 'MigrationCertificate', loadChildren: () => import('./Views/result/Certificate/download-migration-certificate/download-migration-certificate.module').then(m => m.DownloadMigrationCertificateModule), title: 'Migration Certificate' },
      { path: 'DownloadMarksheet', loadChildren: () => import('./Views/result/marksheet-download/marksheet-download.module').then(m => m.MarksheetDownloadModule), title: 'Download Marksheet' },
      { path: 'marksheet-letter', loadChildren: () => import('./Views/result/Marksheet/marksheet-letter/marksheet-letter.module').then(m => m.MarksheetLetterModule), title: 'Marksheet Letter' },
      { path: 'CertificateLetter', loadChildren: () => import('./Views/result/Certificate/certificate-letter/certificate-letter.module').then(m => m.CertificateLetterModule), title: 'Certificate Letter' },
      { path: 'DiplomaLetter', loadChildren: () => import('./Views/result/Certificate/diploma-letter/diploma-letter.module').then(m => m.DiplomaLetterModule), title: 'Diploma Letter' },
      { path: 'ApplicationList', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule), title: 'Application List' },
      //{ path: 'applicationstatus', loadChildren: () => import('./Views/Student/emitra-application-status/emitra-application-status.module').then(m => m.EmitraApplicationStatusModule) },
      { path: 'MigrationCertificate', loadChildren: () => import('./Views/result/Certificate/download-migration-certificate/download-migration-certificate.module').then(m => m.DownloadMigrationCertificateModule), title: 'Download Migration Certificate' },
      { path: 'ProvisionalCertificate', loadChildren: () => import('./Views/result/Certificate/download-provisional-certificate/download-provisional-certificate.module').then(m => m.DownloadProvisionalCertificateModule), title: 'Migration Certificate' },
      { path: 'studentplacementconsent', loadChildren: () => import('./Views/Student/student-placement-consent/student-placement-consent.module').then(m => m.StudentPlacementConsentModule), title: 'Student Placement Consent' },
      { path: 'statics-report-provide-by-examiner', loadChildren: () => import('./Views/Reports/statics-report-provide-by-examiner/statics-report-provide-by-examiner.module').then(m => m.StaticsReportProvideByExaminerModule), title: 'StaticsReportProvideByExaminer' },
      { path: 'examiner-report-and-marks-tracking', loadChildren: () => import('./Views/Reports/examiner-report-and-marks-tracking/examiner-report-and-marks-tracking.module').then(m => m.ExaminerReportAndMarksTrackingModule), title: 'ExaminerReportAndMarksTracking' },


      { path: 'itistudentplacementconsent', loadChildren: () => import('./Views/Student/iti-student-placement-consent/iti-student-placement-consent.module').then(m => m.ITIStudentPlacementConsentModule), title: 'Student Placement Consent' },
      { path: 'itiplacementshortlistedstudents', loadChildren: () => import('./Views/ITI/placement-shortlisted-students/placement-shortlisted-students/placement-shortlisted-students.module').then(m => m.PlacementShortlistedStudentsModule), title: 'Placement Shortlisted Student' },
      { path: 'itiplacementselectedstudents', loadChildren: () => import('./Views/ITI/placement-selected-students/placement-selected-students.module').then(m => m.PlacementSelectedStudentsModule), title: 'Placement Selected Student' },
      



      { path: 'Revaluation', loadChildren: () => import('./Views/revaluation/revaluation.module').then(m => m.RevaluationModule), title: 'Revaluation' },
      { path: 'DocumentSetting', loadChildren: () => import('./Views/result/document-setting/document-setting.module').then(m => m.DocumentSettingModule), title: 'Document Setting' },
      { path: 'AddDocumentSetting', loadChildren: () => import('./Views/result/add-document-setting/add-document-setting.module').then(m => m.AddDocumentSettingModule), title: 'Add Document Setting' },
      { path: 'upcomingcampus', loadChildren: () => import('./Views/Student/upcoming-campus/upcoming-campus.module').then(m => m.UpcomingCampusModule), title: 'Upcoming Campus' },
      { path: 'MarksheetIssueDate', loadChildren: () => import('./Views/result/Marksheet/marksheet-issue-date/marksheet-issue-date.module').then(m => m.MarksheetIssueDateModule), title: 'Marksheet Issue Date' },

      // { path: 'ApplicationPaymentStatus', loadChildren: () => import('./Views/application-payment-status/application-payment-status.module').then(m => m.ApplicationPaymentStatusModule), title: 'Application Payment Status' },
      { path: 'firstyearadmission', loadChildren: () => import('./Views/Emitra/first-year-admission/first-year-admission.module').then(m => m.FirstYearAdmissionModule), title: 'First Year Admission' },
      { path: 'emitradashboard', loadChildren: () => import('./Views/Emitra/emitra-dashboard/emitra-dashboard.module').then(m => m.EmitraDashboardModule), title: 'Emitra Dashboard' },
      { path: 'emitra-fee-trn-history', loadChildren: () => import('./Views/Emitra/emitra-fee-transaction-history/emitra-fee-transaction-history.module').then(m => m.EmitraFeeTransactionHistoryModule), title: 'Emitra Transaction' },
      { path: 'lateralentry', loadChildren: () => import('./Views/Emitra/lateral-entry/lateral-entry.module').then(m => m.LateralEntryModule), title: 'Lateral Entry' },
      { path: 'knowmenu', loadChildren: () => import('./Views/Emitra/know-menu/know-menu.module').then(m => m.KnowMenuModule), title: 'Know Menu' },
      { path: 'applynow', loadChildren: () => import('./Views/Emitra/apply-now/apply-now.module').then(m => m.ApplyNowModule), title: 'Apply Now' },
      { path: 'knowmerit', loadChildren: () => import('./Views/Emitra/know-merit/know-merit.module').then(m => m.KnowMeritModule), title: 'Know Merit' },
      /*      { path: 'knowmerititi', loadChildren: () => import('./Views/Emitra/know-merit-iti/know-merit-iti.module').then(m => m.KnowMeritITIModule), title: 'Know Merit' },*/
      { path: 'UserResponse', loadChildren: () => import('./Views/user-request/user-response/user-response.module').then(m => m.UserResponseModule) },

      { path: 'principledashreport/:url', loadChildren: () => import('./Views/Reports/principle-dashboard-reports/principle-dashboard-reports.module').then(m => m.PrincipleDashboardReportsModule) },
      { path: 'collegewisereports', loadChildren: () => import('./Views/Reports/college-wise-reports/college-wise-reports.module').then(m => m.CollegeWiseReportsModule) },
      { path: 'CollegeWiseExaminationRpt', loadChildren: () => import('./Views/Reports/college-wise-examination-rpt/college-wise-examination-rpt.module').then(m => m.CollegeWiseExaminationRptModule) },
      { path: 'CollegeInformationReport', loadChildren: () => import('./Views/Reports/college-information-report/college-information-report.module').then(m => m.CollegeInformationReportModule) },
      { path: 'EWSReport', loadChildren: () => import('./Views/Reports/ews-report/ews-report.module').then(m => m.EWSReportModule) },
      { path: 'UFMStudentReport', loadChildren: () => import('./Views/Reports/ufm-student-report/ufm-student-report.module').then(m => m.UFMStudentReportModule) },
      { path: 'SessionalFailStudentReport', loadChildren: () => import('./Views/Reports/sessional-fail-student-report/sessional-fail-student-report.module').then(m => m.SessionalFailStudentReportModule) },
      { path: 'RMIFailStudentReport', loadChildren: () => import('./Views/Reports/rmi-fail-student-report/rmi-fail-student-report.module').then(m => m.RMIFailStudentReportModule) },
      { path: 'TheoryPaperFailStudent', loadChildren: () => import('./Views/Reports/theory-paper-fail-student/theory-paper-fail-student.module').then(m => m.TheoryFailStudentReportModule) },
      //{ path: 'StudentRevaluationDetailsReport', loadChildren: () => import('./Views/Reports/bter-student-revaluation-details-report/bter-student-revaluation-details-report.module').then(m => m.RevaluationStudentDetailsReportsModule) },
      { path: 'college-nodal/:url', loadChildren: () => import('./Views/Reports/college-nodal-reports/college-nodal-reports.module').then(m => m.CollegeNodalReportsModule) },

      { path: 'itimerit8th/:id', loadChildren: () => import('./Views/ITI/ItiMerit/iti-merit/iti-merit.module').then(m => m.ItiMeritModule), title: 'ITI Merit' },
      { path: 'itimerit10th/:id', loadChildren: () => import('./Views/ITI/ItiMerit/iti-merit/iti-merit.module').then(m => m.ItiMeritModule), title: 'ITI Merit' },
      { path: 'itimerit12th/:id', loadChildren: () => import('./Views/ITI/ItiMerit/iti-merit/iti-merit.module').then(m => m.ItiMeritModule), title: 'ITI Merit' },

      { path: 'promotedstudent', loadChildren: () => import('./Views/PreExam/promoted-student/promoted-student.module').then(m => m.PromotedStudentModule), title: 'Promoted Student' },

      // { path: 'btermerit', loadChildren: () => import('./Views/BterMerit/bter-merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
      { path: 'upwardmoment', loadChildren: () => import('./Views/Emitra/upward-moment/upward-moment.module').then(m => m.UpwardMomentModule), title: 'Upward Moment' },
      { path: 'upload-deficiency', loadChildren: () => import('./Views/Emitra/upload-deficiency/upload-deficiency.module').then(m => m.UploadDeficiencyModule), title: 'Upload Deficiency' },
      /*      { path: 'upwardmomentiti', loadChildren: () => import('./Views/Emitra/upward-moment-iti/upward-moment-iti.module').then(m => m.UpwardMomentITIModule), title: 'Upward Moment' },*/

      { path: 'StudentFeesTransactionHistoryRpt', loadChildren: () => import('./Views/Reports/student-fees-transaction-history-rpt/student-fees-transaction-history-rpt.module').then(m => m.StudentFeesTransactionHistoryRptModule), title: 'Student Fees Transaction History Report' },
      { path: 'ITIStudentFeesTransactionHistoryRpt', loadChildren: () => import('./Views/ITI/itistudent-fees-transaction-history/itistudent-fees-transaction-history.module').then(m => m.ITIStudentFeesTransactionHistoryModule), title: 'ITI Student Fees Transaction History Report' },
      { path: 'application-fees-trn-history', loadChildren: () => import('./Views/Reports/application-fees-transaction-history/application-fees-transaction-history.module').then(m => m.ApplicationFeesTransactionHistoryModule), title: 'Student Fees Transaction History Report' },
      { path: 'AdminUser', loadChildren: () => import('./Views/BTER/admin-user/admin-user.module').then(m => m.AdminUserModule), title: 'Admin User' },
      { path: 'ITIAdminUser', loadChildren: () => import('./Views/ITI/itiadmin-user/itiadmin-user.module').then(m => m.ITIAdminUserModule), title: 'ITI Admin User' },
      { path: 'master-configuration', loadChildren: () => import('./Views/master-configuration/master-configuration.module').then(m => m.MasterConfigurationModule), title: 'Master Configuration' },
      { path: 'master-configuration-bter', loadChildren: () => import('./Views/master-configuration-bter/master-configuration-bter.module').then(m => m.MasterConfigurationBTERModule), title: 'Master Configuration' },
      { path: 'RevaluationTab', loadChildren: () => import('./Views/Student/revaluation-tab/revaluation-tab.module').then(m => m.RevaluationTabModule) },
      { path: 'ReservationRoster', loadChildren: () => import('./Views/reservation-roster/reservation-roster.module').then(m => m.ReservationRosterModule) },
      { path: 'ITIAllotment', loadChildren: () => import('./Views/ITI/itiallotment/itiallotment.module').then(m => m.ITIAllotmentModule) },
      { path: 'StudentExaminationITI', loadChildren: () => import('./Views/ITI/Examination/student-examination-iti/student-examination-iti.module').then(m => m.StudentExaminationITIModule), title: 'Examination' },
      { path: 'GenerateRollnumberITI', loadChildren: () => import('./Views/ITI/Examination/generate-rollnumber-iti/generate-rollnumber-iti.module').then(m => m.GenerateRollnumberITIModule), title: 'Generate Roll Number' },
      { path: 'CenterCreateITI', loadChildren: () => import('./Views/ITI/Examination/center-create-iti/center-create-iti.module').then(m => m.CenterCreateITIModule), title: 'Create Center' },
      { path: 'AddCenterITI', loadChildren: () => import('./Views/ITI/Examination/add-center-iti/add-center-iti.module').then(m => m.AddCenterITIModule), title: 'Create Center' },

      { path: 'StudentsJoiningStatusMarks8th/:id', loadChildren: () => import('./Views/ITI/students-joining-status-marks/students-joining-status-marks.module').then(m => m.StudentsJoiningStatusMarksModule) },

      { path: 'StudentsJoiningStatusMarks10th/:id', loadChildren: () => import('./Views/ITI/students-joining-status-marks/students-joining-status-marks.module').then(m => m.StudentsJoiningStatusMarksModule) },
      { path: 'StudentsJoiningStatusMarks12th/:id', loadChildren: () => import('./Views/ITI/students-joining-status-marks/students-joining-status-marks.module').then(m => m.StudentsJoiningStatusMarksModule) },



      { path: 'Verifierdashboard', loadChildren: () => import('./Views/verifier-dashboard/verifier-dashboard.module').then(m => m.VerifierDashboardModule), title: 'verifier Dashboard' },
      { path: 'EnrollmentList', loadChildren: () => import('./Views/enrollment-list/enrollment-list.module').then(m => m.EnrollmentListModule), title: 'Enrollment List' },

      { path: 'ITIIMCAllocationList8th/:id', loadChildren: () => import('./Views/ITI/IMC-Allocation/imc-allocation-list/imc-allocation-list.module').then(m => m.IMCAllocationListModule) },

      { path: 'ITIIMCAllocationList10th/:id', loadChildren: () => import('./Views/ITI/IMC-Allocation/imc-allocation-list/imc-allocation-list.module').then(m => m.IMCAllocationListModule) },
      { path: 'ITIIMCAllocationList12th/:id', loadChildren: () => import('./Views/ITI/IMC-Allocation/imc-allocation-list/imc-allocation-list.module').then(m => m.IMCAllocationListModule) },


      { path: 'ITIIMCVerifyStudentPhone/:id/:TradeLevel', loadChildren: () => import('./Views/ITI/IMC-Allocation/verify-student-phone/verify-student-phone.module').then(m => m.VerifyStudentPhoneModule) },

      { path: 'ItiStudentEnrollment/:id', loadChildren: () => import('./Views/ITI/iti-student-enrollment-reports/iti-student-enrollment-reports.module').then(m => m.ItiStudentEnrollmentReportsModule), title: 'ITI Examiner' },
      { path: 'ItiStudentExam/:id', loadChildren: () => import('./Views/ITI/iti-student-exam-reports/iti-student-exam-reports.module').then(m => m.ItiStudentExamReportsModule), title: 'ITI Examiner' },
      { path: 'ITIExaminer', loadChildren: () => import('./Views/ITI/iti-examiner/iti-examiner.module').then(m => m.ItiExaminerModule), title: 'ITI Examiner' },
      { path: 'ITIExaminerList', loadChildren: () => import('./Views/ITI/iti-examiner-list/iti-examiner-list.module').then(m => m.ItiExaminerListModule), title: 'ITI Examiner Listing' },
      { path: 'iti-paper-upload', loadChildren: () => import('./Views/ITI/iti-paper-upload/iti-paper-upload.module').then(m => m.ItiPaperUploadModule), title: 'ITI Paper Upload' },
      { path: 'bter-paper-upload', loadChildren: () => import('./Views/BTER/paper-upload/bter-paper-upload.module').then(m => m.BterPaperUploadModule), title: 'BTER Paper Upload' },

      { path: 'NodalOfficers', loadChildren: () => import('./Views/NodalOfficer/nodal-list/nodal-list.module').then(m => m.NodalListModule) },
      { path: 'AddNodalOfficer', loadChildren: () => import('./Views/NodalOfficer/add-nodal/add-nodal-module').then(m => m.AddnodalModule) },
      { path: 'AddNodalOfficer/:id', loadChildren: () => import('./Views/NodalOfficer/add-nodal/add-nodal-module').then(m => m.AddnodalModule) },
      { path: 'GenerateMeritITI/:id', loadChildren: () => import('./Views/ITI/generate-merit/generate-merit-module').then(m => m.GenerateMeritModule) },
      { path: 'Generateenrollmentiti', loadChildren: () => import('./Views/ITI/Examination/generate-enrollment-iti/generate-enrollment-iti.module').then(m => m.GenerateEnrollmentITIModule), title: 'ITI-Generate-Enrollment' },
      { path: 'PracticalAssesment', loadChildren: () => import('./Views/ITI/Examination/internal-practical-assesment/internal-practical-assesment.module').then(m => m.InternalPracticalAssesmentModule) },
      { path: 'ItiCenterAllotment', loadChildren: () => import('./Views/Examination/iti-center-allotment/iti-center-allotment.module').then(m => m.ItiCenterAllotmentModule), title: 'ITI-Center-Allotment' },
      { path: 'StudentStatusHistory', loadChildren: () => import('./Views/Student/student-status-history/student-status-history.module').then(m => m.StudentStatusHistoryModule), title: 'Student-Status-History' },


      { path: 'ITIPendingFees', loadChildren: () => import('./Views/Student/itipending-fees/itipending-fees.module').then(m => m.ITIPendingFeesModule) },
      { path: 'ITIGenerateAdmitCard', loadChildren: () => import('./Views/ITI/Examination/iti-generate-admit-card/iti-generate-admit-card.module').then(m => m.ITIGenerateAdmitCardModule) },
      { path: 'ITIDownloadRollNoList', loadChildren: () => import('./Views/ITI/Examination/iti-download-roll-no-list/iti-download-roll-no-list.module').then(m => m.ITIDownloadRollNoListModule) },

      { path: 'examshift', loadChildren: () => import('./Views/ExamShiftMaster/exam-shift-master/exam-shift-master.module').then(m => m.ExamShiftMasterModule), title: 'Exam Shift' },
      { path: 'addexamshift', loadChildren: () => import('./Views/ExamShiftMaster/add-exam-shift/add-exam-shift.module').then(m => m.AddExamShiftModule), title: 'Add Exam Shift' },
      { path: 'PrincipleDashboardITI', loadChildren: () => import('./Views/ITI/principal-dashboard-iti/principal-dashboard-iti.module').then(m => m.PrincipalDashboardITIModule), title: 'Pricipal Dashboard ITI' },
      { path: 'student-customize-report', loadChildren: () => import('./Views/Reports/Customize-Report/customize-report/customize-report.module').then(m => m.CustomizeReportModule), title: 'Student Customized Report' },
      { path: 'StudentEnrollmentApprovalReject', loadChildren: () => import('./Views/student-enrollment-approval-reject/student-enrollment-approval-reject.module').then(m => m.StudentEnrollmentApprovalRejectModule) },

      { path: 'ItiStudentenrollment', loadChildren: () => import('./Views/ITI/Examination/iti-student-enrollment/iti-student-enrollment.module').then(m => m.ItiStudentEnrollmentModule), title: 'ITI-Student-Enrollment' },
      { path: 'attendance-time-table', loadChildren: () => import('./Views/BTER/attendance-time-table/attendance-time-table.module').then(m => m.AttendanceTimeTableModule), title: 'Student-Enrollment' },
      { path: 'student-attendance/:streamId/:semesterId/:subjectId/:sectionId', loadChildren: () => import('./Views/BTER/attendance-time-table/student-attendance/student-attendance.module').then(m => m.StudentAttendanceModule), title: 'Student-Enrollment' },
      { path: 'student-attendance', loadChildren: () => import('./Views/BTER/attendance-time-table/student-attendance/student-attendance.module').then(m => m.StudentAttendanceModule), title: 'Student-Enrollment' },
      { path: 'student-attendance-reports', loadChildren: () => import('./Views/BTER/attendance-time-table/student-attendance-reports/student-attendance-reports-component.module').then(m => m.StudentAttendanceReportsModule), title: 'Student-Enrollment' },
      { path: 'branch-wise-hod', loadChildren: () => import('./Views/BTER/attendance-time-table/branch-wise-hod/branch-wise-hod.module').then(m => m.BranchWiseHodModule), title: 'Add Group Code' },
      { path: 'branch-section-create', loadChildren: () => import('./Views/BTER/attendance-time-table/branch-section-create/branch-section-create.module').then(m => m.BranchSectionCreateModule), title: 'Add Group Code' },

      { path: 'iti-attendance', loadChildren: () => import('./Views/iti-attendance-module/iti-attendance.module').then(m => m.ITIAttendanceTimeTableModule), title: 'ITI-Student-Enrollment' },


      /*ITI-Inventory-Management-START*/
      { path: 'iti-items-master-list', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-items-master/iti-items-master.module').then(m => m.ITIItemsMasterModule) },
      { path: 'iti-add-item-master', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-items-master/iti-add-items-master/iti-add-items-master.module').then(m => m.ITIAddItemsMasterModule) },
      { path: 'iti-add-item-master/:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-items-master/iti-add-items-master/iti-add-items-master.module').then(m => m.ITIAddItemsMasterModule) },
      { path: 'iti-item-categories-master', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-categories-master/iti-categories-master.module').then(m => m.ITICategoriesMasterModule) },
      { path: 'iti-item-categories-master/:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-categories-master/iti-categories-master.module').then(m => m.ITICategoriesMasterModule) },
      { path: 'iti-equipments-master', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-master/iti-equipments-master.module').then(m => m.ITIEquipmentsMasterModule) },
      { path: 'iti-equipments-master/:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-master/iti-equipments-master.module').then(m => m.ITIEquipmentsMasterModule) },
      { path: 'iti-unit-master', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-unit-master/iti-unit-master.module').then(m => m.ITIUnitMasterModule) },
      { path: 'iti-unit-master:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-unit-master/iti-unit-master.module').then(m => m.ITIUnitMasterModule) },
      { path: 'iti-equipments-mapping', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-equipments-mapping-list/iti-equipments-mapping-list.module').then(m => m.ITITradeEquipmentsMappingListModule) },
      { path: 'iti-add-equipments-mapping', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-add-equipments-mapping/iti-add-equipments-mapping.module').then(m => m.ITIAddEquipmentsMappingModule) },
      { path: 'iti-add-equipments-mapping:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-add-equipments-mapping/iti-add-equipments-mapping.module').then(m => m.ITIAddEquipmentsMappingModule) },
      { path: 'iti-request-equipments-mapping/:id/:category/:equipment/:quantity/:OfficeID', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-add-request-labeling-equipments/iti-add-request-labeling-equipments.module').then(m => m.ITIAddRequestLabelingEquipmentsModule) },
      { path: 'iti-stocks', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-stocks-items-list/iti-stocks-items-list.module').then(m => m.ITIStocksItemsListModule) },
      { path: 'iti-add-issued-items', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-add-issued-items/iti-add-issued-items.module').then(m => m.ITIAddIssuedItemsModule) },
      { path: 'iti-add-issued-items/:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-add-issued-items/iti-add-issued-items.module').then(m => m.ITIAddIssuedItemsModule) },
      { path: 'iti-issued-items', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-issued-items-list/iti-issued-items-list.module').then(m => m.ITIIssuedItemsListModule) },
      { path: 'iti-return-items', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-return-items-list/iti-return-items-list.module').then(m => m.ITIReturnItemsListModule) },
      { path: 'iti-inventory-dashboard', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-inventory-management-dashboard/iti-inventory-management-dashboard.module').then(m => m.ITIInventoryManagementDashboardModule) },
      { path: 'iti-edit-item-master', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-items-master/iti-edit-item-master/iti-edit-item-master.module').then(m => m.ITIEditeItemMasterModule) },
      { path: 'iti-add-request-equipments', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-add-request-equipments-mapping/iti-add-request-equipments-mapping.module').then(m => m.ITIAddRequestEquipmentsMappingModule) },
      { path: 'iti-HOD-DTEEquipmentVerifications', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-equipment-verifications-mapping-list/iti-equipment-verifications-mapping-list.module').then(m => m.ITIEquipmentVerificationsMappingListModule) },
      { path: 'iti-auction-list', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-auction-list/iti-auction-list.module').then(m => m.ITIAuctionListModule) },

      /*ITI-Inventory-Management-END*/

      /*BTER-DTE-Inventory-Management*/
      { path: 'DteItemsMasterList', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteitems-master/dteitems-master-module').then(m => m.DteItemsMasterModule) },
      { path: 'AddDteItemMaster', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteitems-master/dteadd-items-master/dteadd-items-master-module').then(m => m.DteAddItemsMasterModule) },
      { path: 'AddDteItemMaster/:id', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteitems-master/dteadd-items-master/dteadd-items-master-module').then(m => m.DteAddItemsMasterModule) },
      { path: 'DteItemCategoriesMaster', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dtecategories-master/categories-master-module').then(m => m.DteCategoriesMasterModule) },
      { path: 'DteItemCategoriesMaster/:id', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dtecategories-master/categories-master-module').then(m => m.DteCategoriesMasterModule) },
      { path: 'DteEquipmentsMaster', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteequipments-master/dteequipments-master-module').then(m => m.DteEquipmentsMasterModule) },
      { path: 'DteEquipmentsMaster/:id', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteequipments-master/dteequipments-master-module').then(m => m.DteEquipmentsMasterModule) },
      { path: 'DteUnitMaster', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteunit-master/dteunit-master-module').then(m => m.DteUnitMasterModule) },
      { path: 'DteUnitMaster:id', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteunit-master/dteunit-master-module').then(m => m.DteUnitMasterModule) },
      { path: 'DteTradeEquipmentsMapping', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DTETradeEquipmentsMapping/dtetrade-equipments-mapping-list/dtetrade-equipments-mapping-list-module').then(m => m.DteTradeEquipmentsMappingListModule) },
      { path: 'AddDteTradeEquipmentsMapping', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DTETradeEquipmentsMapping/adddte-trade-equipments-mapping/adddte-trade-equipments-mapping.-module').then(m => m.AddDteTradeEquipmentsMappingModule) },
      { path: 'AddDteTradeEquipmentsMapping:id', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DTETradeEquipmentsMapping/adddte-trade-equipments-mapping/adddte-trade-equipments-mapping.-module').then(m => m.AddDteTradeEquipmentsMappingModule) },
      { path: 'RequestEquipmentsMapping/:id/:category/:equipment/:quantity', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DTETradeEquipmentsMapping/add-request-labeling-equipments/add-request-labeling-equipments.module').then(m => m.AddRequestLabelingEquipmentsModule) },
      { path: 'DteStocks', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dtestocks-items-list/dtestocks-items-list-module').then(m => m.DteStocksItemsListModule) },
      { path: 'AddDteIssuedItems', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DteIssued&ReturnItems/dteadd-issued-items/dteadd-issued-items-module').then(m => m.DteAddIssuedItemsModule) },
      { path: 'AddDteIssuedItems/:id', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DteIssued&ReturnItems/dteadd-issued-items/dteadd-issued-items-module').then(m => m.DteAddIssuedItemsModule) },
      { path: 'DteIssuedItems', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DteIssued&ReturnItems/dteissued-items-list/dteissued-items-list-module').then(m => m.DteIssuedItemsListModule) },
      { path: 'DteReturnItems', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DteIssued&ReturnItems/dtereturn-items-list/dtereturn-items-list-module').then(m => m.DteReturnItemsListModule) },
      { path: 'DTEInventoryDashboard', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/Dteinventory-management-dashboard/dteinventory-management-dashboard-module').then(m => m.DTEInventoryManagementDashboardModule) },
      { path: 'DteEditeItemMaster', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/dteitems-master/dteedite-item-master/dteedite-item-master.module').then(m => m.DteEditeItemMasterModule) },
      { path: 'add-request-dte-equipments', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DTETradeEquipmentsMapping/add-request-dte-trade-equipments-mapping/add-request-dte-trade-equipments-mapping.module').then(m => m.AddRequestDteTradeEquipmentsMappingModule) },
      { path: 'HOD-DTEEquipmentVerifications', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/DTETradeEquipmentsMapping/DTEEquipmentVerifications-mapping-list/DTEEquipmentVerifications-mapping-list-module').then(m => m.DTEEquipmentVerificationsMappingListModule) },
      { path: 'Auction-List', loadChildren: () => import('./Views/BTER/DTE-Inventory-Management/auction-list/auction-list.module').then(m => m.AuctionListModule) },
      /*BTER-DTE-Inventory-Management*/

      { path: 'Itisca', loadChildren: () => import('./Views/ITI/Examination/student-center-activity/student-center-activity.module').then(m => m.StudentCenterActivityModule) },
      { path: 'Ititheorymarks', loadChildren: () => import('./Views/ITI/Examination/theory-marks-iti/theory-marks-iti.module').then(m => m.TheoryMarksItiModule) },
      { path: 'TeacherDashboardITI', loadChildren: () => import('./Views/ITI/iti-teacher-dashboard/iti-teacher-dashboard.module').then(m => m.ITITeacherDashboardModule) },
      { path: 'AddITITimeTable', loadChildren: () => import('./Views/ITI/ITITimeTable/add-ititime-table/add-ititime-table.module').then(m => m.AddITITimeTableModule) },
      { path: 'ItiTimeTable', loadChildren: () => import('./Views/ITI/ITITimeTable/ititime-table/ititime-table.module').then(m => m.ITITimeTableModule), title: "ITI TimeTable" },
      // { path: 'ItiResult/:url', loadChildren: () => import('./Views/ITI/results/iti-result/iti-result.module').then(m => m.ItiResultModule), title: "ITI Result" },
      { path: 'result/:url', loadChildren: () => import('./Views/result/result/result.module').then(m => m.ResultModule), title: "Result" },
      { path: 'result', loadChildren: () => import('./Views/result/result/result.module').then(m => m.ResultModule), title: "Result" },


      { path: 'ITIInternalSliding8th/:id', loadChildren: () => import('./Views/ITI/StudentInternalSliding/internal-sliding/internal-sliding.module').then(m => m.InternalSlidingModule) },
      { path: 'ITIInternalSliding10th/:id', loadChildren: () => import('./Views/ITI/StudentInternalSliding/internal-sliding/internal-sliding.module').then(m => m.InternalSlidingModule) },
      { path: 'ITIInternalSliding12th/:id', loadChildren: () => import('./Views/ITI/StudentInternalSliding/internal-sliding/internal-sliding.module').then(m => m.InternalSlidingModule) },


      { path: 'bterinternalslidingEng/:id', loadChildren: () => import('./Views/BTER/internal-sliding/bter-internal-sliding.module').then(m => m.BterInternalSlidingModule), title: 'Internal Sliding' },
      { path: 'bterinternalslidingNonEng/:id', loadChildren: () => import('./Views/BTER/internal-sliding/bter-internal-sliding.module').then(m => m.BterInternalSlidingModule), title: 'Internal Sliding' },
      { path: 'bterinternalslidingLateral/:id', loadChildren: () => import('./Views/BTER/internal-sliding/bter-internal-sliding.module').then(m => m.BterInternalSlidingModule), title: 'Internal Sliding' },

      //{ path: 'Views\ITI\TimeTable\TimeTable', loadChildren: () => import('./Views/ITI/TimeTable/time-table/time-table.module').then(m => m.TimeTableModule) },
      //{ path: 'Views\ITI\TimeTable\AddTimeTable', loadChildren: () => import('./Views/ITI/TimeTable/add-time-table/add-time-table.module').then(m => m.AddTimeTableModule) },
      { path: 'InternalSliding', loadChildren: () => import('./Views/ITI/StudentInternalSliding/internal-sliding/internal-sliding.module').then(m => m.InternalSlidingModule) },
      //{ path: 'Views\ITI\TimeTable\TimeTable', loadChildren: () => import('./Views/ITI/TimeTable/time-table/time-table.module').then(m => m.TimeTableModule) },
      //{ path: 'Views\ITI\TimeTable\AddTimeTable', loadChildren: () => import('./Views/ITI/TimeTable/add-time-table/add-time-table.module').then(m => m.AddTimeTableModule) },
      { path: 'ItiDocumentScrutiny', loadChildren: () => import('./Views/ITI/TimeTable/iti-document-scrutiny/iti-document-scrutiny.module').then(m => m.ItiDocumentScrutinyModule) },
      { path: 'ITIAllotmentReporting', loadChildren: () => import('./Views/ITI/allotment-reporting/allotment-reporting.module').then(m => m.AllotmentReportingModule) },
      { path: 'ITICollegeTrade1', loadChildren: () => import('./Views/ITI/iti-collage-trade/iti-collage-trade.module').then(m => m.ITICollageTradeModule) },

      { path: 'ITISeatMatrix', loadChildren: () => import('./Views/ITI/itiseat-matrix/itiseat-matrix.module').then(m => m.ITISeatMatrixModule) },

      { path: 'AddSeatMetrix', loadChildren: () => import('./Views/ITI/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'ITI Add Seat Metrix' },
      { path: 'SeatMetrix', loadChildren: () => import('./Views/ITI/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.ListSeatMetrixModule), title: 'ITI Seat Metrix' },
      { path: 'ITICollegeAdmission', loadChildren: () => import('./Views/ITI/ITICollegeAdmissions/iticollege-admission/iticollege-admission.module').then(m => m.ITICollegeAdmissionModule) },

      { path: 'AddSeatMetrix8th/:id', loadChildren: () => import('./Views/ITI/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'ITI Add Seat Metrix' },
      { path: 'AddSeatMetrix10th/:id', loadChildren: () => import('./Views/ITI/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'ITI Add Seat Metrix' },
      { path: 'AddSeatMetrix12th/:id', loadChildren: () => import('./Views/ITI/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'ITI Add Seat Metrix' },



      { path: 'StudentJoinStatus/:id', loadChildren: () => import('./Views/student-join-status/student-join-status.module').then(m => m.StudentJoinStatusModule) },
      { path: 'Bterallotmentreporting', loadChildren: () => import('./Views/bter-allotment-reporting/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },

      { path: 'BTERSeatMatrix', loadChildren: () => import('./Views/BTER/itiseat-matrix/itiseat-matrix.module').then(m => m.ITISeatMatrixModule) },
      { path: 'examination-reports', loadChildren: () => import('./Views/Reports/examinations-reports/examinations-reports.module').then(m => m.ExaminationsReportsModule) },

      { path: 'BterReports', loadChildren: () => import('./Views/Reports/bter-reports/bter-reports.module').then(m => m.BterReportsModule) },
      { path: 'bter-result-reports', loadChildren: () => import('./Views/Reports/bter-result-reports/bter-result-reports.module').then(m => m.BterResultReportsModule) },
      { path: 'group-center-mapping-reports', loadChildren: () => import('./Views/Reports/group-center-mapping-reports/group-center-mapping-reports.module').then(m => m.GroupCenterMappingReportsModule) },
      { path: 'center-daily-reports', loadChildren: () => import('./Views/Reports/center-daily-reports/center-daily-reports.module').then(m => m.CenterDailyReportsModule) },

      { path: 'BTERAddSeatMetrixENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
      { path: 'BTERSeatMetrixENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Seat Metrix' },
      { path: 'BTERDirectSeatMetrixENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/direct-seat-metrix/direct-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Direct Seat Metrix' },

      { path: 'BTERAddSeatMetrixNonENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
      { path: 'BTERSeatMetrixNonENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Seat Metrix' },
      { path: 'BTERDirectSeatMetrixNonENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/direct-seat-metrix/direct-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Direct Seat Metrix' },

      { path: 'BTERAddSeatMetrixLit/:id', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
      { path: 'BTERSeatMetrixLit/:id', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Seat Metrix' },
      { path: 'BTERDirectSeatMetrix/:id', loadChildren: () => import('./Views/BTER/seat-metrix/direct-seat-metrix/direct-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Direct Seat Metrix' },

      { path: 'ITISeatMetrix', loadChildren: () => import('./Views/ITI/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.ListSeatMetrixModule) },

      { path: 'ITISeatMetrix8th/:id', loadChildren: () => import('./Views/ITI/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.ListSeatMetrixModule) },
      { path: 'ITISeatMetrix10th/:id', loadChildren: () => import('./Views/ITI/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.ListSeatMetrixModule) },
      { path: 'ITISeatMetrix12th/:id', loadChildren: () => import('./Views/ITI/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.ListSeatMetrixModule) },


      { path: 'ITICollegeTrade8th/:id', loadChildren: () => import('./Views/ITI/iti-collage-trade/iti-collage-trade.module').then(m => m.ITICollageTradeModule) },
      { path: 'ITICollegeTrade10th/:id', loadChildren: () => import('./Views/ITI/iti-collage-trade/iti-collage-trade.module').then(m => m.ITICollageTradeModule) },
      { path: 'ITICollegeTrade12th/:id', loadChildren: () => import('./Views/ITI/iti-collage-trade/iti-collage-trade.module').then(m => m.ITICollageTradeModule) },

      { path: 'BTERSeatIntakesList', loadChildren: () => import('./Views/BTER/Intakes/seat-intakes-list/seat-intakes-list.module').then(m => m.SeatIntakesListModule), title: 'Seat Intakes List' },
      { path: 'BTERAddSeatIntakes', loadChildren: () => import('./Views/BTER/Intakes/add-seat-intakes/add-seat-intakes.module').then(m => m.AddSeatIntakesModule), title: 'Add Seat Intakes' },
      { path: 'Bridgecourse', loadChildren: () => import('./Views/bridge-course/bridge-course.module').then(m => m.BridgeCourseModule) },
   
      { path: 'BTERAddSeatMetrix', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
      { path: 'IMCManagementAllotment', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment/imc-management-allotment.module').then(m => m.IMCManagementAllotmentModule) },
      { path: 'IMCManagementAllotmentVerify/:id', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment-verify/imc-management-allotment-verify.module').then(m => m.IMCManagementAllotmentVerifyModule) },


      { path: 'ITIAllotment8th/:id', loadChildren: () => import('./Views/ITI/allotment/allotment.module').then(m => m.AllotmentModule) },
      { path: 'ITIAllotment10th/:id', loadChildren: () => import('./Views/ITI/allotment/allotment.module').then(m => m.AllotmentModule) },
      { path: 'ITIAllotment12th/:id', loadChildren: () => import('./Views/ITI/allotment/allotment.module').then(m => m.AllotmentModule) },


      { path: 'btermeritENG/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
      { path: 'btermeritNonENG/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
      { path: 'btermeritLateral/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },


      { path: 'btermeritDegreeNonENG/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
      { path: 'btermeritDegreeLateral/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },



      { path: 'CorrectMeritENG/:id', loadChildren: () => import('./Views/BTER/BterMerit/correct-merit/correct-merit.module').then(m => m.CorrectMeritModule) },
      { path: 'CorrectMeritNonENG/:id', loadChildren: () => import('./Views/BTER/BterMerit/correct-merit/correct-merit.module').then(m => m.CorrectMeritModule) },
      { path: 'CorrectMeritLateral/:id', loadChildren: () => import('./Views/BTER/BterMerit/correct-merit/correct-merit.module').then(m => m.CorrectMeritModule) },

      { path: 'CorrectMeritDegreeNonENG/:id', loadChildren: () => import('./Views/BTER/BterMerit/correct-merit/correct-merit.module').then(m => m.CorrectMeritModule) },
      { path: 'CorrectMeritDegreeLateral/:id', loadChildren: () => import('./Views/BTER/BterMerit/correct-merit/correct-merit.module').then(m => m.CorrectMeritModule) },



      { path: 'AllotmentReportENG/:id', loadChildren: () => import('./Views/BTER/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },
      { path: 'AllotmentReportENG/:id/:AllotmentStatus', loadChildren: () => import('./Views/BTER/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },
      { path: 'AllotmentReportNonENG/:id', loadChildren: () => import('./Views/BTER/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },
      { path: 'AllotmentReportNonENG/:id/:AllotmentStatus', loadChildren: () => import('./Views/BTER/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },
      { path: 'AllotmentReportLateral/:id', loadChildren: () => import('./Views/BTER/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },
      { path: 'AllotmentReportLateral/:id/:AllotmentStatus', loadChildren: () => import('./Views/BTER/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },

      { path: 'allotment-report-download-ENG/:id', loadChildren: () => import('./Views/BTER/allotment-report-download/allotment-report-download.module').then(m => m.AllotmentReportDownloadModule), title: 'Allotment Report' },
      { path: 'allotment-report-download-ENG/:id/:AllotmentStatus', loadChildren: () => import('./Views/BTER/allotment-report-download/allotment-report-download.module').then(m => m.AllotmentReportDownloadModule), title: 'Allotment Report' },
      { path: 'allotment-report-download-NonENG/:id', loadChildren: () => import('./Views/BTER/allotment-report-download/allotment-report-download.module').then(m => m.AllotmentReportDownloadModule), title: 'Allotment Report' },
      { path: 'allotment-report-download-NonENG/:id/:AllotmentStatus', loadChildren: () => import('./Views/BTER/allotment-report-download/allotment-report-download.module').then(m => m.AllotmentReportDownloadModule), title: 'Allotment Report' },
      { path: 'allotment-report-download-Lateral/:id', loadChildren: () => import('./Views/BTER/allotment-report-download/allotment-report-download.module').then(m => m.AllotmentReportDownloadModule), title: 'Allotment Report' },
      { path: 'allotment-report-download-Lateral/:id/:AllotmentStatus', loadChildren: () => import('./Views/BTER/allotment-report-download/allotment-report-download.module').then(m => m.AllotmentReportDownloadModule), title: 'Allotment Report' },

      { path: 'ITIAllotmentReport', loadChildren: () => import('./Views/ITI/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },


      { path: 'BTERSeatAllotmentENG/:id', loadChildren: () => import('./Views/BTER/allotment/allotment.module').then(m => m.AllotmentModule) },
      { path: 'BTERSeatAllotmentNonENG/:id', loadChildren: () => import('./Views/BTER/allotment/allotment.module').then(m => m.AllotmentModule) },
      { path: 'BTERSeatAllotmentLateral/:id', loadChildren: () => import('./Views/BTER/allotment/allotment.module').then(m => m.AllotmentModule) },
      { path: 'college-admission-seat-allotment', loadChildren: () => import('./Views/CollegeAdmissionSeatAllotment/college-admission-seat-allotment/college-admission-seat-allotment.module').then(m => m.CollegeAdmissionSeatAllotmentModule), title: 'College Admission Seat Allotment' },


      { path: 'DirectAdmissionENG/:id', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule) },
      { path: 'DirectAdmissionNonENG/:id', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule) },
      { path: 'DirectAdmissionLateral/:id', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule) },


      { path: 'ITIDirectAdmission8th/:id', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule) },
      { path: 'ITIDirectAdmission10th/:id', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule) },
      { path: 'ITIDirectAdmission12th/:id', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule) },


      { path: 'IMCManagementAllotment', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment/imc-management-allotment.module').then(m => m.IMCManagementAllotmentModule), title: 'IMC Management Allotment' },
      { path: 'IMCManagementAllotmentVerify/:id', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment-verify/imc-management-allotment-verify.module').then(m => m.IMCManagementAllotmentVerifyModule), title: 'IMC Allotment Verify ' },
      { path: 'payment-service', loadChildren: () => import('./Views/PaymentService/payment-service/payment-service.module').then(m => m.PaymentServiceModule), title: 'Payment Service' },
      { path: 'add-payment-service', loadChildren: () => import('./Views/PaymentService/add-payment-service/add-payment-service.module').then(m => m.AddPaymentServiceModule), title: 'Payment Service' },


      { path: 'StudentJoinStatusENG/:id', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
      { path: 'StudentJoinStatusENG/:id/:status', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
      { path: 'StudentJoinStatusNonENG/:id', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
      { path: 'StudentJoinStatusLateral/:id', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
      { path: 'withdraw-allotment', loadChildren: () => import('./Views/BTER/withdraw-allotment/withdraw-allotment.module').then(m => m.WithdrawAllotmentModule) },


      { path: 'student-nodal-list/:id', loadChildren: () => import('./Views/BTER/Join/nodal-center-list/nodal-center-list.module').then(m => m.NodalCenterListModule) },
      { path: 'student-nodal-status/:id', loadChildren: () => import('./Views/BTER/Join/nodal-center-status/nodal-center-status.module').then(m => m.NodalCenterStatusModule) },


      { path: 'BterallotmentreportingENG/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },
      { path: 'BterallotmentreportingNonENG/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },
      { path: 'BterallotmentreportingLateral/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },
      { path: 'BterallotmentreportingDegreeNonENG/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },
      { path: 'BterallotmentreportingDegreeLatralNonENG/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },

      { path: 'StudentRequestList', loadChildren: () => import('./Views/Hostel-Management/student-request-list/student-request-list.module').then(m => m.StudentRequestListModule) },


      { path: 'HostelMeritlist', loadChildren: () => import('./Views/Hostel-Management/HostelMerit-list/HostelMerit-list.module').then(m => m.HostelMeritlistModule) },
      { path: 'Principalstudentmeritlist', loadChildren: () => import('./Views/Hostel-Management/Principal-student-merit-list/Principal-student-merit-list.module').then(m => m.PrincipalstudentmeritlistModule) },
      { path: 'objectionwindow', loadChildren: () => import('./Views/Hostel-Management/objection-window/objection-window.module').then(m => m.objectionwindowModule) },
      { path: 'HostelWardenStudentMeritlist', loadChildren: () => import('./Views/Hostel-Management/Hostel-Warden-Student-Merit-list/Hostel-Warden-Student-Merit-list.module').then(m => m.HostelWardenStudentMeritlistModule) },
      { path: 'HostelMeritlist/HostelGenerateMeritlist', loadChildren: () => import('./Views/Hostel-Management/Hostel-Generate-Merit-list/Hostel-Generate-Merit-list.module').then(m => m.HostelGenerateMeritlistModule) },
      { path: 'CorrectedMeritList', loadChildren: () => import('./Views/Hostel-Management/Corrected-Merit-List/Corrected-Merit-List.module').then(m => m.CorrectedMeritListModule) },

      { path: 'RoomAvailabilties', loadChildren: () => import('./Views/Hostel-Management/room-availabilties/room-availabilties.module').then(m => m.RoomAvailabiltiesModule) },
      { path: 'RoomAllotment', loadChildren: () => import('./Views/Hostel-Management/room-allotment/room-allotment.module').then(m => m.RoomAllotmentModule) },
      { path: 'HostelReports', loadChildren: () => import('./Views/Hostel-Management/hostel-reports/hostel-reports.module').then(m => m.HostelReportsModule) },
      { path: 'HostelDashboard', loadChildren: () => import('./Views/Hostel-Management/hostel-dashboard/hostel-dashboard.module').then(m => m.HostelDashboardModule) },

      { path: 'ApplyForHostel', loadChildren: () => import('./Views/Student/apply-for-hostel/apply-for-hostel.module').then(m => m.ApplyForHostelModule) },
      { path: 'CreateHostel', loadChildren: () => import('./Views/Hostel-Management/create-hostel/create-hostel.module').then(m => m.CreateHostelModule), title: 'Create Hostel' },
      { path: 'RoomSeatMaster', loadChildren: () => import('./Views/Hostel-Management/room-seat-master/room-seat-master.module').then(m => m.RoomSeatMasterModule), title: 'Room Seat Master' },
      { path: 'HostelFacility', loadChildren: () => import('./Views/Hostel-Management/facilities/facilities.module').then(m => m.FacilitiesModule), title: 'Hostel Facility' },

      { path: 'CollegeHostelDetails', loadChildren: () => import('./Views/Student/college-hostel-details/college-hostel-details.module').then(m => m.CollegeHostelDetailsModule), title: 'College Hostel Details' },

      { path: 'HostelRoomDetails', loadChildren: () => import('./Views/Hostel-Management/hostel-room-details/hostel-room-details.module').then(m => m.HostelRoomDetailsModule) },
      { path: 'HostelRoomDetails/:id', loadChildren: () => import('./Views/Hostel-Management/hostel-room-details/hostel-room-details.module').then(m => m.HostelRoomDetailsModule) },
      { path: 'addstudent', loadChildren: () => import('./Views/Student/add-student/add-student.module').then(m => m.AddStudentModule) },
      { path: 'IndustryInstitutePartnershipList', loadChildren: () => import('./Views/IndustryInstitutePartnershipMaster/industry-institute-partnership-master/industry-institute-partnership-master.module').then(m => m.IndustryInstitutePartnershipMasterModule) },
      { path: 'Add-IndustryInstitutePartnership', loadChildren: () => import('./Views/IndustryInstitutePartnershipMaster/add-industry-institute-partnership-master/add-industry-institute-partnership-master.module').then(m => m.AddIndustryInstitutePartnershipMasterModule) },
      { path: 'industryInstitutePartnership-validation', loadChildren: () => import('./Views/industry-institute-partnership-validation/industry-institute-partnership-validation.module').then(m => m.IndustryInstitutePartnershipValidationModule) },
      { path: 'EditMeritDocument', loadChildren: () => import('./Views/BTER/BterMerit/edit-merit-document/edit-merit-document.module').then(m => m.EditMeritDocumentModule) },
      { path: 'AllotmentConfiguration', loadChildren: () => import('./Views/master-configuration/allotment-configuration/allotment-configuration.module').then(m => m.AllotmentConfigurationModule) },

      { path: 'ITI-AddIndustryInstitutePartnership', loadChildren: () => import('./Views/ITI/ITI-IndustryInstitutePartnershipMaster/iti-add-industry-institute-partnership-master/iti-add-industry-institute-partnership-master.module').then(m => m.ITIAddIndustryInstitutePartnershipMasterModule) },
      { path: 'TIT-IndustryInstitutePartnershipList', loadChildren: () => import('./Views/ITI/ITI-IndustryInstitutePartnershipMaster/iti-industry-institute-partnership-master/iti-industry-institute-partnership-master.module').then(m => m.ITIIndustryInstitutePartnershipMasterModule) },
      { path: 'ITI-IndustryInstitutePartnership-validation', loadChildren: () => import('./Views/ITI/ITI-Industry-institute-partnership-validation/ITI-Industry-institute-partnership-validation.module').then(m => m.ITIIndustryInstitutePartnershipValidationModule) },

      { path: 'BlankReport', loadChildren: () => import('./Views/blank-report/blank-report.module').then(m => m.BlankReportModule) },
      { path: 'PaperCountCustomizeReport', loadChildren: () => import('./Views/Reports/Paper-Count-Customize-Report/Paper-Count-Customize-Report.module').then(m => m.PaperCountCustomizeReportModule), title: 'Paper-Count-Customize-Report' },
      { path: 'PaperCountReport/:repType/:sem', loadChildren: () => import('./Views/Reports/Paper-Count-Report/Paper-Count-Report.module').then(m => m.PaperCountReportModule), title: 'Paper-Count-Report' },
      { path: 'PaperCountReport', loadChildren: () => import('./Views/Reports/Paper-Count-Report/Paper-Count-Report.module').then(m => m.PaperCountReportModule), title: 'Paper-Count-Report' },
      { path: 'optional-format-report', loadChildren: () => import('./Views/Reports/download-optional-format-report/download-optional-format-report.module').then(m => m.DownloadOptionalFormatReportModule), title: 'Paper-Count-Report' },

      { path: 'AddItiCompanyMaster', loadChildren: () => import('./Views/ITI/ITICompanyMaster/additi-company-master/additi-company-module').then(m => m.ItiCompanyMasterModule) },
      { path: 'AddItiCompanyMaster/:id', loadChildren: () => import('./Views/ITI/ITICompanyMaster/additi-company-master/additi-company-module').then(m => m.ItiCompanyMasterModule) },
      { path: 'ItiCompanyMaster', loadChildren: () => import('./Views/ITI/ITICompanyMaster/iticompany-master/iticompany-master.module').then(m => m.ItiCompanyMasterListModule) },
      { path: 'ItiCompanyMasterValidation', loadChildren: () => import('./Views/ITI/ITICompanyMaster/iticompany-validation/iticompany-validation.module').then(m => m.ItiCompanyValidationModule) },

      { path: 'AddItiHrMaster', loadChildren: () => import('./Views/ITI/ItiHr-Master/add-itihr-master/add-itihr-master.module').then(m => m.AddItiHrmasterModule) },
      { path: 'AddItiHrMaster/:id', loadChildren: () => import('./Views/ITI/ItiHr-Master/add-itihr-master/add-itihr-master.module').then(m => m.AddItiHrmasterModule) },
      //{ path: 'ITIHrmaster', loadChildren: () => import('./Views/ITI/ItiHr-Master/itihr-master/itihr-master.module').then(m => m.ItiHrmasterModule) },

      { path: 'ItiHrmaster', loadChildren: () => import('./Views/ITI/ItiHr-Master/itihr-master/itihr-master.module').then(m => m.ItiHrmasterModule) },
      { path: 'ItiHrMasterValidation', loadChildren: () => import('./Views/ITI/ItiHr-Master/itihr-master-validation/itihr-master-validation.module').then(m => m.ItiHrMasterValidationModule) },

      { path: 'BlankReport', loadChildren: () => import('./Views/blank-report/blank-report.module').then(m => m.BlankReportModule) },
      { path: 'InstituteDetail', loadChildren: () => import('./Views/BTER/institute-detail/institute-detail.module').then(m => m.InstituteDetailModule) },


   


      { path: 'AddItiCampusPost', loadChildren: () => import('./Views/ITI/ITI-Campus/iticampus-post/iticampus-post.module').then(m => m.ItiCampusPostModule) },
      { path: 'AddItiCampusPost/:id', loadChildren: () => import('./Views/ITI/ITI-Campus/iticampus-post/iticampus-post.module').then(m => m.ItiCampusPostModule) },
      { path: 'ItiCampusPostList', loadChildren: () => import('./Views/ITI/ITI-Campus/iticampus-post-list/iticampus-post-list.module').then(m => m.ItiCampusPostListModule) },
      { path: 'ItiCampusPostValidation', loadChildren: () => import('./Views/ITI/ITI-Campus/iticampus-validation/iticampus-validation.module').then(m => m.ItiCampusValidationModule) },
      { path: 'Grievance', loadChildren: () => import('./Views/grievance/grievance.module').then(m => m.GrievanceModule) },
      { path: 'GrievanceList', loadChildren: () => import('./Views/GrievanceList/GrievanceList.module').then(m => m.GrievanceListModule) },
      { path: 'VerifyRollnumber/:id/:status', loadChildren: () => import('./Views/verify-roll-number/verify-roll-number.module').then(m => m.VerifyRollNumberModule) },
      { path: 'SchlorshipList', loadChildren: () => import('./Views/scholarship-list/scholarship-list.module').then(m => m.ScholarshipListModule) },
      { path: 'AddSchlorship', loadChildren: () => import('./Views/add-scholarship-list/add-scholarship-list.module').then(m => m.AddScholarshipListModule) },
      { path: 'create-guest-house', loadChildren: () => import('./Views/GuestRoom-Management/Create-GuestRoom/Create-GuestRoom.module').then(m => m.CreateGuestRoomModule), title: 'Create GuestRoom' },
      { path: 'guest-room-details', loadChildren: () => import('./Views/GuestRoom-Management/guest-room-details/guest-room-details.module').then(m => m.GuestRoomDetailsModule) },
      { path: 'guest-room-details/:id', loadChildren: () => import('./Views/GuestRoom-Management/guest-room-details/guest-room-details.module').then(m => m.GuestRoomDetailsModule) },
      { path: 'guest-room-apply', loadChildren: () => import('./Views/GuestRoom-Management/AddGuestApplyForGuestRoom/AddGuestApplyForGuestRoom.module').then(m => m.AddGuestApplyForGuestRoomModule), title: 'Add Guest Apply For GuestRoom' },
      { path: 'guest-house-facility', loadChildren: () => import('./Views/GuestRoom-Management/GuestRoomFacilities/GuestRoomFacilities.module').then(m => m.GuestRoomFacilitiesModule), title: 'GuestRoom Facility' },
      { path: 'guest-house-room-seat-master', loadChildren: () => import('./Views/GuestRoom-Management/guestroom-seat-master/guestroom-seat-master.module').then(m => m.GuestRoomSeatMasterModule), title: 'Room Seat Master' },
      { path: 'guestroomrequest', loadChildren: () => import('./Views/GuestRoom-Management/guest-room-request/guest-room-request.module').then(m => m.GuestRoomRequestModule) },
      { path: 'guestroomreport', loadChildren: () => import('./Views/GuestRoom-Management/guest-room-report/guest-room-report.module').then(m => m.GuestRoomReportModule) },

      { path: 'CenterAndSubjectWiseReport', loadChildren: () => import('./Views/Reports/Center-And-Subject-Wise-Report/Center-And-Subject-Wise-Report.module').then(m => m.CenterAndSubjectWiseReportModule), title: 'Center-And-Subject-Wise-Report' },

      { path: 'VerifyRollListPdf', loadChildren: () => import('./Views/verify-roll-list-pdf/verify-roll-list-pdf.module').then(m => m.VerifyRollListPdfModule) },

      { path: 'PaperSetter', loadChildren: () => import('./Views/PaperSetter/paper-setter/paper-setter.module').then(m => m.PaperSetterModule) },
      { path: 'PaperSetterList', loadChildren: () => import('./Views/PaperSetter/paper-setter-list/paper-setter-list.module').then(m => m.PaperSetterListModule) },
      { path: 'verify-paper-setter/:id', loadChildren: () => import('./Views/PaperSetter/paper-setter-verify/paper-setter-verify.module').then(m => m.PaperSetterVerifyModule), title: 'Verify Paper Setter' },

      { path: 'appointitiexaminer', loadChildren: () => import('./Views/ITI/appoint-itiexaminer/appoint-itiexaminer.module').then(m => m.AppointITIExaminerModule), title: 'Appoint Examiner' },
      { path: 'iti-appointed-examiner-details/:id/:status', loadChildren: () => import('./Views/ITI/Examination/ITI_Examiner/iti-appointed-examiner-details/iti-appointed-examiner-details.module').then(m => m.ItiAppointedExaminerDetailsModule), title: 'Examiner Details' },

      { path: 'iti-remuneration-details', loadChildren: () => import('./Views/ITI/Examination/ITI_Examiner/iti-remuneration-details/iti-remuneration-details.module').then(m => m.ItiRemunerationDetailsModule), title: 'Remuneration Details' },

      { path: 'iti-admin-remuneration-details', loadChildren: () => import('./Views/ITI/Examination/ITI_Examiner/iti-admin-remuneration-list/iti-admin-remuneration-details.module').then(m => m.ItiAdminRemunerationDetailsModule), title: 'Remuneration Admin Details' },

      { path: 'iti-practical-remuneration-details', loadChildren: () => import('./Views/ITI/ITI-Practical-Remuneration/iti-practical-remuneration-details/iti-practical-remuneration-details.module').then(m => m.ItiRemunerationDetailsModule), title: 'Remuneration Details' },

      { path: 'iti-admin-practical-remuneration-details', loadChildren: () => import('./Views/ITI/ITI-Practical-Remuneration/iti-admin-practical-remuneration-list/iti-admin-practical-remuneration-details.module').then(m => m.ItiAdminRemunerationDetailsModule), title: 'Remuneration Admin Details' },


      { path: 'ApplyDuplicateDocument', loadChildren: () => import('./Views/BTER/apply-duplicate-doc/apply-duplicate-doc.module').then(m => m.ApplyDuplicateDocModule) },
      { path: 'iti-studentprofiledownload', loadChildren: () => import('./Views/ITI/iti-student-profile-download/iti-student-profile-download.module').then(m => m.ITIStudentProfileDownloadModule), title: 'iti Student Profile' },
      { path: 'IndustryTrainingList', loadChildren: () => import('./Views/IndustryTraining-list/IndustryTraining-list.module').then(m => m.IndustryTrainingListModule) },


      { path: 'team-flying-squad', loadChildren: () => import('./Views/flying-squad/flying-squad.module').then(m => m.FlyingSquadModule) },
      { path: 'team-flying-reports/:id', loadChildren: () => import('./Views/Reports/flying-squad-reports/flying-squad-reports.module').then(m => m.FlyingSquadReportsModule) },
      { path: 'team-flying-reports', loadChildren: () => import('./Views/Reports/flying-squad-reports/flying-squad-reports.module').then(m => m.FlyingSquadReportsModule) },

      { path: 'PublishedEnrollNo', loadChildren: () => import('./Views/published-enroll-no/published-enroll-no.module').then(m => m.PublishedEnrollNoModule) },
      { path: 'verify-enroll-no', loadChildren: () => import('./Views/verify-enroll-no/verify-enroll-no.module').then(m => m.VerifyEnrollNoModule), title: 'Verify Enroll No' },
      { path: 'eligible-verification-enroll-no', loadChildren: () => import('./Views/eligible-verification-enroll-no/eligible-verification-enroll-no.module').then(m => m.EligibleVerificationEnrollNoModule) },
      { path: 'paper', loadChildren: () => import('./Views/paper/set-paper.module').then(m => m.SetPaperModule) },
      { path: 'bter-cerifications', loadChildren: () => import('./Views/BTER/bter-certificate/bter-certificate.module').then(m => m.BterCertificateModule) },
      { path: 'bter-marksheets', loadChildren: () => import('./Views/BTER/bter-marksheets/bter-marksheets.module').then(m => m.BterMarksheetsModule) },
      { path: 'bter-duplicate-certifications', loadChildren: () => import('./Views/BTER/bter-duplicate-certificate/bter-duplicate-certificate.module').then(m => m.BterDuplicateCertificateModule), title: 'Duplicate Certificate' },

      { path: 'placement-campus-reports/:id', loadChildren: () => import('./Views/Reports/placement-dashboard-reports/placement-dashboard-reports.module').then(m => m.PlacementDashReportModule) },
      { path: 'VerifyRollList', loadChildren: () => import('./Views/verify-roll-list/verify-roll-list.module').then(m => m.VerifyRollListModule) },
      { path: 'VerifyRollList/:id', loadChildren: () => import('./Views/verify-roll-list/verify-roll-list.module').then(m => m.VerifyRollListModule) },
      { path: 'VerifyAdmitCard/:id', loadChildren: () => import('./Views/verify-admit-card/verify-admit-card.module').then(m => m.VerifyAdmitCardModule) },
      { path: 'VerifyAdmitCard', loadChildren: () => import('./Views/verify-admit-card/verify-admit-card.module').then(m => m.VerifyAdmitCardModule) },
      { path: 'college-list-roll-admitcard', loadChildren: () => import('./Views/BTER/college-roll-list-admit-card/college-roll-list-admit-card.module').then(m => m.CollegeRollListAdmitCardModule), title: 'College Roll List Admit Card' },

      { path: 'itiRollList', loadChildren: () => import('./Views/ITI/iti-roll-list/iti-roll-list.module').then(m => m.ITIRollListModule), title: 'College Wise Roll List' },
      //{ path: 'itiRollList/:id', loadChildren: () => import('./Views/verify-roll-list/verify-roll-list.module').then(m => m.VerifyRollListModule) },
      //{ path: 'itiAdmitCard/:id', loadChildren: () => import('./Views/verify-admit-card/verify-admit-card.module').then(m => m.VerifyAdmitCardModule) },
      { path: 'itiAdmitCard', loadChildren: () => import('./Views/ITI/iti-admit-card-list/iti-admit-card.module').then(m => m.ItiAdmitCardModule), title:'College Wise Admit Card' },


      { path: 'optional-format-report', loadChildren: () => import('./Views/Reports/optional-format-report/optional-format-report.module').then(m => m.OptionalFormatReportModule), title: 'Optional Format Report ' },
      { path: 'ssoid-update', loadChildren: () => import('./Views/SsoidUpdate/ssoid-update/ssoid-update.module').then(m => m.SsoidUpdateModule), title: 'SSOID Update' },
      { path: 'add-center-observer', loadChildren: () => import('./Views/CenterObserver/add-center-observer/add-center-observer.module').then(m => m.AddCenterObserverModule), title: 'Center Observer' },
      { path: 'center-observer', loadChildren: () => import('./Views/CenterObserver/center-observer/center-observer.module').then(m => m.CenterObserverModule), title: 'Center Observer' },
      { path: 'verify-observer-deployment/:id', loadChildren: () => import('./Views/CenterObserver/verify-center-observer-deployment/verify-center-observer-deployment.module').then(m => m.VerifyCenterObserverDeploymentModule), title: 'Verify Center Observer' },
      { path: 'generate-observer-deployment-order/:id', loadChildren: () => import('./Views/CenterObserver/verify-center-observer-deployment/verify-center-observer-deployment.module').then(m => m.VerifyCenterObserverDeploymentModule), title: 'Verify Center Observer' },
      { path: 'staff-center-observer', loadChildren: () => import('./Views/staffMaster/staff-center-observer/staff-center-observer.module').then(m => m.StaffCenterObserverModule), title: ' Center Observer' },
      { path: 'staff-center-observer/:id', loadChildren: () => import('./Views/staffMaster/staff-center-observer/staff-center-observer.module').then(m => m.StaffCenterObserverModule), title: ' Center Observer' },

      { path: 'EnrollmentCancellationReport', loadChildren: () => import('./Views/Reports/enrollment-cancellation-report/enrollment-cancellation-report.module').then(m => m.EnrollmentCancellationReportModule) },
      { path: 'non-elective-form-filling-report', loadChildren: () => import('./Views/Reports/non-elective-form-filling-report/non-elective-form-filling-report.module').then(m => m.NonElectiveFormFillingReportModule), title: 'Non Elective Form Filling Report ' },
      { path: 'PayExamFee', loadChildren: () => import('./Views/Student/pay-exam-fee/pay-exam-fee.module').then(m => m.PayExamFeeModule), title: 'Pay Exam Fee' },
      { path: 'RedirectToSsoLogin', loadChildren: () => import('./Views/redirect-to-sso-login/redirect-to-sso-login.module').then(m => m.RedirectToSsoLoginModule) },

      { path: 'center-observer-deployment', loadChildren: () => import('./Views/CenterObserver/center-observer-deployment/center-observer-deployment.module').then(m => m.CenterObserverDeploymentModule), title: 'Center Observer' },
      { path: 'iti-center-observer', loadChildren: () => import('./Views/ITI/ItiCenterObserver/iti-center-observer/iti-center-observer.module').then(m => m.ItiCenterObserverModule), title: 'ITI Center Observer' },
      { path: 'add-iti-center-observer', loadChildren: () => import('./Views/ITI/ItiCenterObserver/add-iti-center-observer/add-iti-center-observer.module').then(m => m.AddItiCenterObserverModule), title: 'ITI Center Observer' },
      { path: 'iti-center-observer-deployment', loadChildren: () => import('./Views/ITI/ItiCenterObserver/iti-center-observer-deployment/iti-center-observer-deployment.module').then(m => m.ItiCenterObserverDeploymentModule), title: 'ITI Center Observer' },
      { path: 'verify-iti-observer-deployment/:id', loadChildren: () => import('./Views/ITI/ItiCenterObserver/verify-iti-center-observer-deployment/verify-iti-center-observer-deployment.module').then(m => m.VerifyItiCenterObserverDeploymentModule), title: 'ITI Center Observer' },
      { path: 'attendance-rpt-13b', loadChildren: () => import('./Views/Reports/attendance-rpt-13-b/attendance-rpt-13-b.module').then(m => m.AttendanceRpt13BModule), title: 'Attendance Report 13B' },
      { path: 'iti-center-observer-report', loadChildren: () => import('./Views/ITI/ItiCenterObserver/iti-center-observer-report/iti-center-observer-report.module').then(m => m.ItiCenterObserverReportModule), title: 'ITI Center Observer Report' },
      { path: 'rpt-33', loadChildren: () => import('./Views/Reports/rpt-33/rpt-33.module').then(m => m.Rpt33Module), title: 'rpt-33' },
      { path: 'daily-report-bhandar-form1', loadChildren: () => import('./Views/Reports/daily-report-bhandar-form1/daily-report-bhandar-form1.module').then(m => m.DailyReportBhandarForm1Module), title: 'rpt-33' },
      { path: 'report-23', loadChildren: () => import('./Views/Reports/report23/report23.module').then(m => m.Report23Module), title: 'Report-23' },
      { path: 'report-23', loadChildren: () => import('./Views/Reports/report23/report23.module').then(m => m.Report23Module), title: 'Report-23' },
      { path: 'download-student-enrollment-details', loadChildren: () => import('./Views/Reports/download-student-enrollment-details/download-student-enrollment-details.module').then(m => m.DownloadStudentEnrollmentDetailsModule), title: 'Download Student Enrollment Details' },
      { path: 'download-student-change-enrollment-details', loadChildren: () => import('./Views/Reports/download-student-change-enrollment-details/download-student-change-enrollment-details.module').then(m => m.DownloadStudentChangeEnrollmentDetailsModule), title: 'Download Student Enrollment Details' },

      /*{ path: 'flying-squad-deployment', loadChildren: () => import('./Views/CenterObserver/center-observer-deployment/center-observer-deployment.module').then(m => m.CenterObserverDeploymentModule), title: 'Center Observer' },*/
      { path: 'iti-flying-squad', loadChildren: () => import('./Views/ITI/ITIFlyingSquad/iti-flying-squad/iti-flying-squad.module').then(m => m.ItiCenterObserverModule), title: 'ITI  Flying Squad' },
      { path: 'add-iti-flying-squad', loadChildren: () => import('./Views/ITI/ITIFlyingSquad/add-iti-flying-squad/add-iti-flying-squad.module').then(m => m.AddItiCenterObserverModule), title: 'ITI Flying Squad' },
      { path: 'iti-flying-squad-deployment', loadChildren: () => import('./Views/ITI/ITIFlyingSquad/iti-flying-squad-deployment/iti-flying-squad-deployment.module').then(m => m.ItiCenterObserverDeploymentModule), title: 'ITI Flying Squad' },
      { path: 'verify-iti-flying-squad-deployment/:id', loadChildren: () => import('./Views/ITI/ITIFlyingSquad/verify-iti-flying-squad-deployment/verify-iti-flying-squad-deployment.module').then(m => m.VerifyItiCenterObserverDeploymentModule), title: 'ITI Flying Squad' },
      { path: 'iti-flying-squad-report', loadChildren: () => import('./Views/ITI/ITIFlyingSquad/iti-flying-squad-report/iti-flying-squad-report.module').then(m => m.ITIFlyingSquadReportModule), title: 'ITI Inspection Report' },
      { path: 'ApplyLeave', loadChildren: () => import('./Views/apply-leave/apply-leave.module').then(m => m.ApplyLeaveModule) },
      { path: 'LeaveList', loadChildren: () => import('./Views/leave-list/leave-list.module').then(m => m.LeaveListModule) },
      { path: 'LeaveValidation', loadChildren: () => import('./Views/leave-validation/leave-validation.module').then(m => m.LeaveValidationModule) },
      { path: 'LeaveValidation/:id', loadChildren: () => import('./Views/leave-validation/leave-validation.module').then(m => m.LeaveValidationModule) },

      { path: 'ItiCollegeReport', loadChildren: () => import('./Views/ITI/iti-college-report/iti-college-report.module').then(m => m.ItiCollegeReportModule) },

      { path: 'RegistrarDashboard', loadChildren: () => import('./Views/registrar-dashboard/registrar-dashboard.module').then(m => m.RegistrarDashboardModule) },
      { path: 'secretary-dashboard', loadChildren: () => import('./Views/secretary-jd-dashboard/secretary-jd-dashboard.module').then(m => m.SecretaryJDDashboardModule), title: 'Secretary Dashboard' },
      { path: 'jd-confidential-dashboard', loadChildren: () => import('./Views/secretary-jd-confidential-dashboard/secretary-jd-confidential-dashboard.module').then(m => m.SecretaryJdConfidentialDashboardModule), title: 'Secretary Dashboard' },


      { path: 'DispatchSuperintendent', loadChildren: () => import('./Views/DispatchManagement/DispatchSuperintendent-form/DispatchSuperintendent-form.module').then(m => m.DispatchSuperintendentFormModule), title: 'Dispatch Superintendent Form' },
      { path: 'DispatchSuperintendentList', loadChildren: () => import('./Views/DispatchManagement/DispatchSuperintendentList/DispatchSuperintendentList.module').then(m => m.DispatchSuperintendentListModule), title: 'Dispatch Superintendent List' },
      { path: 'DispatchToInstitute', loadChildren: () => import('./Views/DispatchManagement/dispatch-to-institute/dispatch-to-institute.module').then(m => m.DispatchToInstituteModule) },

      { path: 'DispatchGroupList', loadChildren: () => import('./Views/DispatchManagement/dispatch-group-list/dispatch-group-list.module').then(m => m.DispatchGroupListModule) },
      /*   { path: 'AllotmentStatus', loadChildren: () => import('./Views/Emitra/allotment-status/allot-status.module').then(m => m.AllotStatusModule) },*/
      { path: 'PrincipalDispatchGroup', loadChildren: () => import('./Views/DispatchManagement/principal-dispatch-group/principal-dispatch-group.module').then(m => m.PrincipalDispatchGroupModule) },

      { path: 'PolytechnicReport', loadChildren: () => import('./Views/polytechnic-report/polytechnic-report.module').then(m => m.PolytechnicReportModule) },
      { path: 'ExaminerReport', loadChildren: () => import('./Views/examiner-report/examiner-report.module').then(m => m.ExaminerReportModule) },
      { path: 'ExaminerDispatchVerify', loadChildren: () => import('./Views/DispatchManagement/examiner-dispatch-verify/examiner-dispatch-verify.module').then(m => m.ExaminerDispatchVerifyModule) },

      { path: 'DispatchPrincipalGroupCode', loadChildren: () => import('./Views/DispatchManagement/DispatchPrincipalGroupCode-form/DispatchPrincipalGroupCode-form.module').then(m => m.DispatchPrincipalGroupCodeFormModule), title: 'Dispatch Principal Group Code Form' },

      { path: 'DispatchPrincipalGroupCodeList', loadChildren: () => import('./Views/DispatchManagement/DispatchPrincipalGroupCode-list/DispatchPrincipalGroupCode-list.module').then(m => m.DispatchPrincipalGroupCodeListModule) },
      { path: 'ReceivedDispatchGroup', loadChildren: () => import('./Views/DispatchManagement/received-dispatch-group/received-dispatch-group.module').then(m => m.ReceivedDispatchGroupModule) },
      { path: 'DispatchSuperintendentDetailsList', loadChildren: () => import('./Views/DispatchManagement/DispatchSuperintendentDetailsList/DispatchSuperintendentDetailsList.module').then(m => m.DispatchSuperintendentDetailsListModule), title: 'Dispatch Superintendent Details List' },
      { path: 'CompanyMasterReport', loadChildren: () => import('./Views/CompanyMasterReport/CompanyMasterReport.module').then(m => m.CompanyMasterReportModule), title: 'Company Master Report' },
      { path: 'addBoardUniversity', loadChildren: () => import('./Views/Board-University/add-Board-University/add-Board-University.module').then(m => m.addBoardUniversityModule), title: 'add-Board-University' },
      { path: 'BoardUniversity', loadChildren: () => import('./Views/Board-University/Board-University/Board-University.module').then(m => m.BoardUniversityModule), title: 'Board-University' },
      { path: 'updateBoardUniversity/:id', loadChildren: () => import('./Views/Board-University/add-Board-University/add-Board-University.module').then(m => m.addBoardUniversityModule), title: 'Updat-Board-University' },
      { path: 'PaperCountReportNew', loadChildren: () => import('./Views/Reports/Paper-Count-Report-New/Paper-Count-Report-New.module').then(m => m.PaperCountReportNewModule), title: 'Paper-Count-Report-New' },
      { path: 'center-superintendent-allocation', loadChildren: () => import('./Views/Center_Allocation/center-superintendent-allocation/center-superintendent-allocation.module').then(m => m.CenterSuperintendentAllocationModule), title: 'center-superintendent-allocation' },
      { path: 'verify-center-superintendent', loadChildren: () => import('./Views/Center_Allocation/verify-center-superintendent/verify-center-superintendent.module').then(m => m.VerifyCenterSuperintendentModule), title: 'Center Superintendent' },
      { path: 'verify-center-superintendent/:id', loadChildren: () => import('./Views/Center_Allocation/verify-center-superintendent/verify-center-superintendent.module').then(m => m.VerifyCenterSuperintendentModule), title: 'Center Superintendent' },
      { path: 'iti-fees-peryear-list', loadChildren: () => import('./Views/ITI/itifees-per-year-list/itifees-per-year-list.module').then(m => m.ITIFeesPerYearListModule), title: 'iti-fees-peryear-list' },
      { path: 'add-iti-fees-peryear', loadChildren: () => import('./Views/ITI/iti-add-per-year-fees/iti-add-per-year-fees.module').then(m => m.ItiAddPerYearFeesModule), title: 'add-iti-fees-peryear' },

      { path: 'ITIUpdateCollegeProfile', loadChildren: () => import('./Views/ITI/iti-college-profile/iti-college-profile.module').then(m => m.ITICollegeProfileModule) },
      { path: 'ITIUpdateCollegeProfile/:id', loadChildren: () => import('./Views/ITI/iti-college-profile/iti-college-profile.module').then(m => m.ITICollegeProfileModule) },
      { path: 'DispatchSuperintendentAllottedExamDateList', loadChildren: () => import('./Views/DispatchManagement/DispatchSuperintendentAllottedExamDateList/DispatchSuperintendentAllottedExamDateList.module').then(m => m.DispatchSuperintendentAllottedExamDateListModule), title: 'Dispatch-Superintendent-Allotted-ExamDate-List' },
      { path: 'ITI-CollegeLoginInfoMaster', loadChildren: () => import('./Views/ITI/ITI-CollegeLoginInfoMaster/ITI-CollegeLoginInfoMaster.module').then(m => m.ITICollegeLoginInfoMasterModule), title: 'ITI-CollegeLoginInfo-Master' },

      { path: 'online-marking-report', loadChildren: () => import('./Views/Reports/online-marking-report-provide-by-examiner/online-marking-report-provide-by-examiner.module').then(m => m.OnlineMarkingReportProvideByExaminerModule) },
      { path: 'renumeration-examiner', loadChildren: () => import('./Views/renumeration-examiner/renumeration-examiner.module').then(m => m.RenumerationExaminerModule) },
      { path: 'renumeration-jd', loadChildren: () => import('./Views/renumeration-jd/renumeration-jd.module').then(m => m.RenumerationJdModule) },
      { path: 'unlock-application-form', loadChildren: () => import('./Views/ITI/unlock-application-form/unlock-application-form.module').then(m => m.UnlockApplicationFormModule) },
      { path: 'FeePaidByChallan', loadChildren: () => import('./Views/Emitra/fee-paid-by-challan/fee-paid-by-challan.module').then(m => m.FeePaidByChallanModule) },

      { path: 'renumeration-accounts', loadChildren: () => import('./Views/renumeration-accounts/renumeration-accounts.module').then(m => m.RenumerationAccountsModule) },
      { path: 'renumeration-fee-setter', loadChildren: () => import('./Views/renumeration-fee-setter/renumeration-fee-setter.module').then(m => m.RenumerationFeeSetterModule) },


      { path: 'companydispatchlist', loadChildren: () => import('./Views/DispatchManagement/company-dispatch-list/company-dispatch-list.module').then(m => m.CompanyDispatchListModule), title: 'Company Dispatch List' },
      { path: 'addcompanydispatch', loadChildren: () => import('./Views/DispatchManagement/add-company-dispatch/add-company-dispatch.module').then(m => m.addcompanydispatchModule), title: 'Add Company Dispatch' },
      { path: 'updatecompanydispatch/:id', loadChildren: () => import('./Views/DispatchManagement/add-company-dispatch/add-company-dispatch.module').then(m => m.addcompanydispatchModule), title: 'Add Company Dispatch' },
      { path: 'internal-practical-rpt-view', loadChildren: () => import('./Views/internal-practical-rpt-view/internal-practical-rpt-view.module').then(m => m.InternalPracticalRptViewModule) },
      { path: 'ScaReport', loadChildren: () => import('./Views/sca-report/sca-report.module').then(m => m.ScaReportModule) },
      { path: 'theory-marks-report', loadChildren: () => import('./Views/Reports/theory-marks-rpt-view/theory-marks-rpt-view.module').then(m => m.TheoryMarksRptViewModule), title: 'Theory Marks Report' },

      { path: 'AssignHod', loadChildren: () => import('./Views/assign-hod/assign-hod.module').then(m => m.AssignHodModule) },
      { path: 'PrincipleList', loadChildren: () => import('./Views/PrincipleUpdateList/PrincipleUpdateList.module').then(m => m.PrincipleListModule), title: 'Principle List' },
      {
        path: 'StudentSsoByTPOMapping', loadChildren: () => import('./Views/Student/student-sso-by-tpo-mapping/student-sso-by-tpo-mapping.module').then(m => m.StudentSsoByTpoMappingModule), title: 'Student SSO Mapping'
      },

      { path: 'ItiOptionForm/:trade/:type', loadChildren: () => import('./Views/ITI/iti-option-form-list/iti-option-form-list.module').then(m => m.ItiOptionFormListModule), title: 'ITI Option Form' },
      { path: 'Teacher-Wise-Report', loadChildren: () => import('./Views/teacher-wise-report/teacher-wise-report.module').then(m => m.TeacherWiseReportModule) },
      { path: 'Subject-Wise-Report', loadChildren: () => import('./Views/subject-wise-report/subject-wise-report.module').then(m => m.SubjectWiseReportModule) },
      { path: 'SignedCopyOfResult', loadChildren: () => import('./Views/SignedCopyOfResultMaster/SignedCopyOfResultMaster.module').then(m => m.SignedCopyOfResultMasterModule), title: 'Add SignedCopyOfResult' },
      { path: 'ItiCollegeUpdate', loadChildren: () => import('./Views/iti-college-update/iti-college-update.module').then(m => m.ItiCollegeUpdateModule) },
      { path: 'SignedCopyOfResult/:id', loadChildren: () => import('./Views/SignedCopyOfResultMaster/SignedCopyOfResultMaster.module').then(m => m.SignedCopyOfResultMasterModule), title: 'Add SignedCopyOfResult' },

      { path: 'CenterSuperintendentStudentReport', loadChildren: () => import('./Views/Reports/CenterSuperintendentStudentReport/CenterSuperintendentStudentReport.module').then(m => m.CenterSuperintendentStudentReportModule), title: 'Center-Superintendent-Student-Report' },
      { path: 'PrincipleMenuRight', loadChildren: () => import('./Views/principle-menu-right/principle-menu-right.module').then(m => m.PrincipleMenuRightModule) },

      { path: 'add-inspection', loadChildren: () => import('./Views/ITI/Inspection/add-inspection/add-inspection.module').then(m => m.AddInspectionModule), title: 'ITI Inspection' },
      { path: 'inspection-team', loadChildren: () => import('./Views/ITI/Inspection/inspection-team/inspection-team.module').then(m => m.InspectionTeamModule), title: 'ITI Inspection' },
      { path: 'inspection-deployment', loadChildren: () => import('./Views/ITI/Inspection/inspection-deployment/inspection-deployment.module').then(m => m.InspectionDeploymentModule), title: 'ITI Inspection' },
      { path: 'iti-inspection', loadChildren: () => import('./Views/ITI/Inspection/iti-inspection/iti-inspection.module').then(m => m.ITIInspectionModule), title: 'ITI Inspection' },
      { path: 'verify-iti-inspection', loadChildren: () => import('./Views/ITI/Inspection/verify-iti-inspection/verify-iti-inspection.module').then(m => m.VerifyITIInspectionModule), title: 'ITI Inspection' },
      { path: 'iti-inspection-report', loadChildren: () => import('./Views/ITI/Inspection/iti-inspection-report/iti-inspection-report.module').then(m => m.ITIInspectionReportModule), title: 'ITI Inspection Report' },


      { path: 'add-apprenticeship', loadChildren: () => import('./Views/ITI/ITI-Apprenticeship/add-apprenticeship/add-apprenticeship.module').then(m => m.AddApprenticeshipModule), title: 'ITI Apprenticeship' },
      { path: 'apprenticeship-team', loadChildren: () => import('./Views/ITI/ITI-Apprenticeship/apprenticeship-team/apprenticeship-team.module').then(m => m.ApprenticeshipTeamModule), title: 'ITI Apprenticeship' },
      { path: 'apprenticeship-deployment', loadChildren: () => import('./Views/ITI/ITI-Apprenticeship/apprenticeship-deployment/apprenticeship-deployment.module').then(m => m.ApprenticeshipDeploymentModule), title: 'ITI Apprenticeship' },
      { path: 'iti-apprenticeship', loadChildren: () => import('./Views/ITI/ITI-Apprenticeship/iti-apprenticeship/iti-Apprenticeship.module').then(m => m.ITIApprenticeshipModule), title: 'ITI Apprenticeship' },
      { path: 'iti-apprenticeship-report', loadChildren: () => import('./Views/ITI/ITI-Apprenticeship/iti-apprenticeship-report/iti-apprenticeship-report.module').then(m => m.ITIApprenticeshipReportModule), title: 'ITI Apprenticeship Report' },


      { path: 'add-public-info', loadChildren: () => import('./Views/PublicInfo/add-public-info/add-public-info.module').then(m => m.AddPublicInfoModule) },
      { path: 'public-info-list', loadChildren: () => import('./Views/PublicInfo/list-public-info/list-public-info.module').then(m => m.ListPublicInfoModule) },
      { path: 'ItiPlanning', loadChildren: () => import('./Views/ITI/iti-planning/iti-planning.module').then(m => m.ItiPlanningModule) },
      { path: 'admin-sca-marking', loadChildren: () => import('./Views/Admin-Internal-Marking/admin-sca-marking/admin-sca-marking.module').then(m => m.AdminSCAMarkingModule) },
      { path: 'admin-internal-marking', loadChildren: () => import('./Views/Admin-Internal-Marking/admin-internal-practical/admin-internal-practical.module').then(m => m.AdminInternalPracticalModule) },
      { path: 'admin-theory-marks-update', loadChildren: () => import('./Views/Admin-Internal-Marking/admin-theory-marks-update/admin-theory-marks-update.module').then(m => m.AdminTheoryMarksUpdateModule), title: 'Admin Theory Marks Update' },
      
      { path: 'itiprivateaddestablish', loadChildren: () => import('./Views/ITI/ITI-Private-EstablishManagement/ITI_Private_AddEstablish/ITI_Private_AddEstablish.module').then(m => m.ITIPrivateAddEstablishModule) },
      { path: 'additiprivatestaffmaster', loadChildren: () => import('./Views/ITI/ITI-Private-EstablishManagement/add-iti-private-staff-master/add-iti-private-staff-master.module').then(m => m.AddItiPrivateStaffMasterModule), title: 'Add ITI Private Staff' },

      { path: 'bter-application/:url', loadChildren: () => import('./Views/BTER/bter-application/bter-application.module').then(m => m.BTERApplicationModule), title: 'DTE Reports' },
      { path: 'bter-application/:url/:id', loadChildren: () => import('./Views/BTER/bter-application/bter-application.module').then(m => m.BTERApplicationModule), title: 'DTE Reports' },


      { path: 'ITI-Search', loadChildren: () => import('./Views/iti-search/iti-search.module').then(m => m.ITISearchModule) },
      { path: 'ItiPlanningList', loadChildren: () => import('./Views/ITI/iti-planning-list/iti-planning-list.module').then(m => m.ItiPlanningListModule) },


      { path: 'ITI-Govt-AddEstablish', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-AddEstablish/ITI-Govt-AddEstablish.module').then(m => m.ITIGovtAddEstablishModule), title: 'ITI-Govt-AddEstablish' },
      { path: 'ITIGovtEstablishStaffMaster', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-Establish-Staff-Master/ITI-Govt-Establish-Staff-Master.module').then(m => m.ITIGovtEstablishStaffMasterModule), title: 'ITI Govt Establish Staff Master' },

      { path: 'bter-establish-management-report', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-establish-management-report/bter-establish-management-report.module').then(m => m.BterEstablishManagementReportModule), title: 'bter-establish-management-report' },

      { path: 'principle-multiple-institute-alloat', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-Principal-Multiple-Institute-Alloat/ITI-Govt-Principal-Multiple-Institute-AlloatList.module').then(m => m.ITIGovtPrincipalMultipleInstituteAlloatListModule), title: 'Principle Multiple Alloat List' },
      { path: 'deficiency-application', loadChildren: () => import('./Views/DTE_AssignApplication/deficiency-application/deficiency-application.module').then(m => m.DeficiencyApplicationModule), title: 'Deficiency Application' },
      { path: 'deficiency-uploaded-application', loadChildren: () => import('./Views/DTE_AssignApplication/deficiency-uploaded-applications/deficiency-uploaded-applications.module').then(m => m.DeficiencyUploadedApplicationsModule), title: 'Deficiency Uploaded Application' },

      { path: 'iti-govt-office', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-Office/ITI-Govt-Office-routing.module').then(m => m.ITIGovtOfficeRoutingModule), title: 'ITI-Govt-Office' },
      { path: 'CollegeLoginInfoMaster', loadChildren: () => import('./Views/college-login-info-master/college-login-info-master.module').then(m => m.CollegeLoginInfoMasterModule) },
      { path: 'guestroomrequest/:Status', loadChildren: () => import('./Views/GuestRoom-Management/guest-room-request/guest-room-request.module').then(m => m.GuestRoomRequestModule) },

      { path: 'iti-govt-post', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-Post/ITI-Govt-Post-routing.module').then(m => m.ITIGovtPostRoutingModule), title: 'ITI-Govt-Post' },
      { path: 'ITIGovtEMZonalOfficeMaster', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-ZonalOfficeMaster/ITI-Govt-EM-ZonalOfficeMaster.module').then(m => m.ITIGovtEMZonalOfficeMasterModule), title: 'ITI Govt EM Zonal Office ' },
      { path: 'ITIGovtEMStaffProfile', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-StaffProfile/ITI-Govt-EM-StaffProfile.module').then(m => m.ITIGovtEMStaffProfileModule), title: 'ITI Govt EM StaffProfile' },
      { path: 'ITIGovtEMZonalOfficeList', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-ZonalOfficeList/ITI-Govt-EM-ZonalOfficeList.module').then(m => m.ITIGovtEMZonalOfficeListModule), title: 'ITI Govt EM Zonal Office ' },
      { path: 'iti-published-roll-no', loadChildren: () => import('./Views/ITI/Examination/published-roll-no-iti/published-roll-no-iti.module').then(m => m.PublishedRollNoITIModule), title: 'Published Roll No' },
      { path: 'ITIGovtEMEducationalQualification', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-EducationalQualification/ITI-Govt-EM-EducationalQualification.module').then(m => m.ITIGovtEMEducationalQualificationModule), title: 'ITI Govt EM Educational Qualification' },
      { path: 'ITIGovtEMServiceDetailsOfPersonal', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-ServiceDetailsOfPersonal/ITI-Govt-EM-ServiceDetailsOfPersonal.module').then(m => m.ITIGovtEMServiceDetailsOfPersonalModule), title: 'ITI Govt EM Service Details Of Personal' },
      /* { path: 'papperSetAssign', loadChildren: () => import('./Views/ITI/itipapper-setter/itipapper-setter.module').then(m => m.ITIPapperSetterModule) }, */
      { path: 'ITIGovtEMSanctionedPostBasedInstitute', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-SanctionedPostBasedInstitute/ITI-Govt-EM-SanctionedPostBasedInstitute.module').then(m => m.ITIGovtEMSanctionedPostBasedInstituteModule), title: 'ITI Govt EM Sanctioned Post Based Institute ' },
      { path: 'ITIGovtEMSanctionedPostBasedInstituteList', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-SanctionedPostBasedInstituteList/ITI-Govt-EM-SanctionedPostBasedInstituteList.module').then(m => m.ITIGovtEMSanctionedPostBasedInstituteListModule), title: 'ITI Govt EM Sanctioned Post Based Institute ' },
      { path: 'ITIGovtEMZonalOfficeITIPrincipalMaster', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-Govt-EM-ZonalOfficeITIPrincipalMaster/ITI-Govt-EM-ZonalOfficeITIPrincipalMaster.module').then(m => m.ITIGovtEMZonalOfficeITIPrincipalMasterModule), title: 'ITI Govt EM Zonal Office ITI Principal' },
      { path: 'papperSetAssign', loadChildren: () => import('./Views/ITI/itipapper-setter/paperSetterAssign/itipapper-setter.module').then(m => m.ITIPapperSetterModule), title: 'Paper Assign' },
      { path: 'PaperSetAssignList', loadChildren: () => import('./Views/ITI/itipapper-setter/paper-setter-assign-list/paper-setter-assign-list.module').then(m => m.PaperSetterAssignListModule), title: 'Paper Setter' },
      { path: 'PaperSetProfessor', loadChildren: () => import('./Views/ITI/itipapper-setter/paper-set-professor/paper-set-professor.module').then(m => m.PaperSetProfessorModule) },
      { path: 'PaperAutoSelect', loadChildren: () => import('./Views/ITI/itipapper-setter/paper-auto-select/paper-auto-select.module').then(m => m.PaperAutoSelectModule) },

      { path: 'website-settings', loadChildren: () => import('./Views/Website-Settings/website-setting/website-setting.module').then(m => m.WebsiteSettingModule), title: 'Website Settings' },
      { path: 'DynamicUploadContent', loadChildren: () => import('./Views/Website-Settings/highlights/highlights.module').then(m => m.HighlightsModule), title: 'Dynamic Upload Content' },
      { path: 'website-settings-downloads-fdgdsfgsf', loadChildren: () => import('./Views/Website-Settings/downloads/downloads.module').then(m => m.DownloadsModule), title: 'Website Settings' },
      { path: 'website-settings-circular-dfgdfgdsfg', loadChildren: () => import('./Views/Website-Settings/circular/circular.module').then(m => m.CircularModule), title: 'Website Settings' },
      { path: 'ItiCenterSuperintendent-sdfgsdfgdfs', loadChildren: () => import('./Views/ITI/iti-center-superintendent/iti-center-superintendent.module').then(m => m.ItiCenterSuperintendentModule) },
      { path: 'website-settings-downloads', loadChildren: () => import('./Views/Website-Settings/downloads/downloads.module').then(m => m.DownloadsModule), title: 'Website Settings' },
      { path: 'website-settings-circular', loadChildren: () => import('./Views/Website-Settings/circular/circular.module').then(m => m.CircularModule), title: 'Website Settings' },
      { path: 'ItiCenterSuperintendent', loadChildren: () => import('./Views/ITI/iti-center-superintendent/iti-center-superintendent.module').then(m => m.ItiCenterSuperintendentModule), title: 'Center Superintendent' },
      { path: 'ITIGOVTEMPersonalDetailsApplicationTab', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab/ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.module').then(m => m.ITIGOVTEMPersonalDetailsApplicationFormTabModule), title: 'Save Personal Details' },
      { path: 'AssignPracticalExaminer', loadChildren: () => import('./Views/ITI/assign-practical-examiner/assign-practical-examiner.module').then(m => m.AssignPracticalExaminerModule), title:'Assign Practical Examiner' },
      { path: 'AssignPracticalExaminerscvt', loadChildren: () => import('./Views/ITI/assign-practical-examiner/assign-practical-examiner.module').then(m => m.AssignPracticalExaminerModule), title:'Assign Practical Examiner'},
      { path: 'ITIGOVTEMPersonalDetailsApplicationTab/:id', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab/ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.module').then(m => m.ITIGOVTEMPersonalDetailsApplicationFormTabModule) },
      { path: 'ItiInvigilator', loadChildren: () => import('./Views/ITI/iti-invigilator/iti-invigilator.module').then(m => m.ItiInvigilatorModule), title:'ITI Invigilator' },
      { path: 'AddITIInvigilator', loadChildren: () => import('./Views/ITI/add-iti-invigilator/add-iti-invigilator.module').then(m => m.AddItiInvigilatorModule), title:'ITI Invigilator' },


      { path: 'UserRequestList', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/UserRequest/request-list/request-list.module').then(m => m.UserRequestListModule), title: 'User Request List' },
      { path: 'AddUserRequest', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/UserRequest/request-add/request-add.module').then(m => m.RequestUserAddModule), title: 'Add User Request' },
      { path: 'PaperSetterProfessorDashboard', loadChildren: () => import('./Views/ITI/itipapper-setter/itipaper-setter-professor-dashboard/itipaper-setter-professor-dashboard.module').then(m => m.ITIPaperSetterProfessorDashboardModule) },
      { path: 'AddUserRequest/:id', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/UserRequest/request-add/request-add.module').then(m => m.RequestUserAddModule) },
      { path: 'Department-Wise-Request-list', loadChildren: () => import('./Views/ITI/ITI-GOVT-EstablishManagement/UserRequest/DepartmentWiseRequest-list/DepartmentWiseRequest-list.module').then(m => m.DepartmentWiseRequestlistModule) },
      { path: 'CheckPdfVerification', loadChildren: () => import('./Views/ITI/check-pdf-verification/check-pdf-verification.module').then(m => m.CheckPdfVerificationModule) },

      { path: 'PaperSetProfessor/:id', loadChildren: () => import('./Views/ITI/itipapper-setter/paper-set-professor/paper-set-professor.module').then(m => m.PaperSetProfessorModule) },
      { path: 'ITIPaperUploaded-List', loadChildren: () => import('./Views/ITI/itipaper-uploaded-list/itipaper-uploaded-list.module').then(m => m.ITIPaperUploadedListModule), title: 'Upload Paper' },

      { path: 'ExamPaperDownload', loadChildren: () => import('./Views/ITI/exam-paper-download/exam-paper-download.module').then(m => m.ExamPaperDownloadModule), title: 'Exam Paper DownloadModule' },
      { path: 'PracticalExamPaperDownloadNCVT', loadChildren: () => import('./Views/ITI/practical-exam-paper-download-ncvt/practical-exam-paper-download-ncvt.module').then(m => m.PracticalExamPaperDownloadNCVTModule), title: 'Practical Exam PaperDownload' },
      { path: 'PracticalExaminerUndertaking', loadChildren: () => import('./Views/ITI/practical-examiner-undertaking/practical-examiner-undertaking.module').then(m => m.PracticalExaminerUndertakingModule), title: 'Practical Examiner Undertaking' },
      { path: 'PracticalExaminerRelieving', loadChildren: () => import('./Views/ITI/practical-examiner-relieving/practical-examiner-relieving.module').then(m => m.PracticalExaminerRelievingModule), title: 'Practical Examiner Relieving' },
      { path: 'FlyingSquadReport', loadChildren: () => import('./Views/ITI/flying-squad-report/flying-squad-report.module').then(m => m.FlyingSquadReportModule), title: 'Flying Squad Report' },
      { path: 'ObserverReport', loadChildren: () => import('./Views/ITI/observer-report/observer-report.module').then(m => m.ObserverReportModule), title: 'Observer Report' },
      { path: 'CenterPracticalExaminer', loadChildren: () => import('./Views/ITI/center-practical-examiner/center-practical-examiner.module').then(m => m.CenterPracticalExaminerModule) },
      { path: 'college-list/:type/:status', loadChildren: () => import('./Views/BTER/college-list/college-list.module').then(m => m.CollegeListModule), title: 'College List' },

      { path: 'CenterExamCoordinator', loadChildren: () => import('./Views/ITI/center-exam-coordinator/center-exam-coordinator.module').then(m => m.CenterExamCoordinatorModule), title: 'Center Exam Coordinator' },
      { path: 'IIPCollageReport', loadChildren: () => import('./Views/ITI/IIPCollageReport/iipcollage-report/iipcollage-report.module').then(m => m.IIPCollageReportModule) },


      { path: 'examiner-relieving-form', loadChildren: () => import('./Views/ITI/relieving-practical-examiner/relieving-practical-examiner.module').then(m => m.RelievingPracticalExaminerModule) },
      { path: 'ItiExamCoordinator', loadChildren: () => import('./Views/ITI/iti-exam-coordinator/iti-exam-coordinator.module').then(m => m.ItiExamCoordinatorModule) },
      { path: 'exam-co-ordinator-reliving-format', loadChildren: () => import('./Views/ITI/exam-co-ordinator-reliving-format/exam-co-ordinator-reliving-format.module').then(m => m.ExamCoOrdinatorRelivingFormatModule) },
      { path: 'undertaking-by-exminer', loadChildren: () => import('./Views/ITI/undertaking-by-exminer/undertaking-by-exminer.module').then(m => m.UndertakingByExminerModule) },
      { path: 'nodal-officer-exminer-report', loadChildren: () => import('./Views/ITI/nodal-officer-exminer-report/nodal-officer-exminer-report.module').then(m => m.NodalOfficerExminerReportModule) },
      { path: 'ITI-DispatchSuperintendentAllottedExamDateList', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-DispatchSuperintendentAllottedExamDateList/ITI-DispatchSuperintendentAllottedExamDateList.module').then(m => m.ITIDispatchSuperintendentAllottedExamDateListModule), title: 'ITI-Dispatch-Superintendent-Allotted-ExamDate-List' },
      { path: 'ITI-DispatchSuperintendent', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-DispatchSuperintendent-form/ITI-DispatchSuperintendent-form.module').then(m => m.ITIDispatchSuperintendentFormModule), title: 'ITI Dispatch Superintendent Form' },
      { path: 'ITI-DispatchSuperintendentDetailsList', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-DispatchSuperintendentDetailsList/ITI-DispatchSuperintendentDetailsList.module').then(m => m.ITIDispatchSuperintendentDetailsListModule), title: 'ITI Dispatch Superintendent Details List' },
      { path: 'ITI-DispatchSuperintendentList', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-DispatchSuperintendentList/ITI-DispatchSuperintendentList.module').then(m => m.ITIDispatchSuperintendentListModule), title: 'ITI Dispatch Superintendent List' },

      { path: 'CreateGuestHouse', loadChildren: () => import('./Views/added-guest-house/added-guest-house.module').then(m => m.AddedGuestHouseModule) },
      { path: 'nodal-officer-exminer-report-list', loadChildren: () => import('./Views/ITI/nodal-officer-exminer-report-list/nodal-officer-exminer-report-list.module').then(m => m.NodalOfficerExminerReportListModule) },
      { path: 'ITI-DispatchToInstitute', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Dispatch-to-institute/ITI-Dispatch-to-institute.module').then(m => m.ITIDispatchToInstituteModule) },
      { path: 'nodal-officer-exminer-report/:id', loadChildren: () => import('./Views/ITI/nodal-officer-exminer-report/nodal-officer-exminer-report.module').then(m => m.NodalOfficerExminerReportModule) },
      { path: 'prod-data', loadChildren: () => import('./Views/prod-data/prod-data.module').then(m => m.ProdDataModule) },
      { path: 'ITI-AdminExaminerCode', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Principal-dispatch-group/ITI-Principal-dispatch-group.module').then(m => m.ITIPrincipalDispatchGroupModule) },
      { path: 'ITIDispatchGroupList', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-DispatchGroupList/iti-dispatch-group-list.module').then(m => m.ITIDispatchGroupListModule) },
      { path: 'ITIReceivedDispatchGroup', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-ReceivedDispatchGroup/iti-received-dispatch-group.module').then(m => m.ITIReceivedDispatchGroupModule) },
      { path: 'ITIAddcompanydispatch', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Addcompanydispatch/iti-addcompanydispatch.module').then(m => m.ITIAddcompanydispatchModule), title: 'Add Company Dispatch' },
      { path: 'ITICompanydispatchlist', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Companydispatchlist/iti-companydispatchlist.module').then(m => m.ITICompanydispatchlistModule) },
      { path: 'ITIupdatecompanydispatch/:id', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Addcompanydispatch/iti-addcompanydispatch.module').then(m => m.ITIAddcompanydispatchModule), title: 'Add Company Dispatch' },
      { path: 'ITI-AssignExaminer', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-DispatchAdminCenterSuperintendentbundleList/ITI-DispatchAdminCenterSuperintendentbundleList.module').then(m => m.ITIDispatchAdminCenterSuperintendentbundleListModule), title: 'Assign Theory Checker' },
      { path: 'ITI-Dispatch-Add-GroupCode', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Dispatch-AddGroupCode/ITI-Dispatch-AddGroupCode.module').then(m => m.ITIDispatchAddGroupCodeModule), title: 'ITI Dispatch Add Group Code' },
      { path: 'ITI-Examiner-Dispatch-Verify', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Examiner-Dispatch-Verify/ITI-Examiner-Dispatch-Verify.module').then(m => m.ITIExaminerDispatchVerifyModule), title: 'ITI Examiner Dispatch Verify' },
      { path: 'staff-management-report', loadChildren: () => import('./Views/ITI/reports/staff-management-reports/staff-management-reports.module').then(m => m.StaffManagementReportsModule), title: 'staff-management-report' },
      
      //{ path: 'ITI-CBT-Center', loadChildren: () => import('./Views/ITI/cbt-center/cbt-center.module').then(m => m.cbtcenterModule) },
      { path: 'ITI-CBT-Center', loadChildren: () => import('./Views/ITI/cbt-center/cbt-center.module').then(m => m.cbtcenterModule), title: "ITI cbt center" },

      { path: 'iti_ncvt_data_import', loadChildren: () => import('./Views/ITI/ITI-NCVT/import-data/import-data.module').then(m => m.ImportDataModule), title: 'NCVT Exam DATA' },
      { path: 'iti_ncvt_data_push', loadChildren: () => import('./Views/ITI/ITI-NCVT/push-data/push-data.module').then(m => m.PushDataModule), title: 'NCVT PUSH DATA' },
      { path: 'iti_ncvt_pushed_data', loadChildren: () => import('./Views/ITI/ITI-NCVT/pushed-data/pushed-data.module').then(m => m.PushedDataModule), title: 'NCVT PUSHED DATA' },


      { path: 'correct-merit-document', loadChildren: () => import('./Views/BTER/Correct-Merit-Document/correct-merit-document/correct-merit-document.module').then(m => m.CorrectMeritDocumentModule), title: 'Correct Merit Document' },
      { path: 'nodal-list', loadChildren: () => import('./Views/BTER/nodal/nodal-list/nodal-list.module').then(m => m.NodalListModule), title: 'Nodal List' },
      { path: 'add-nodal', loadChildren: () => import('./Views/BTER/nodal/nodal-add/add-nodal.module').then(m => m.AddNodalModule), title: 'Add Nodal' },
      { path: 'ITI-AdminExaminerCode/:id', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Principal-dispatch-group/ITI-Principal-dispatch-group.module').then(m => m.ITIPrincipalDispatchGroupModule) },
      { path: 'ITI-Examiner-Dispatch-Verify/:Status', loadChildren: () => import('./Views/ITI/ITI-DispatchManagement/ITI-Examiner-Dispatch-Verify/ITI-Examiner-Dispatch-Verify.module').then(m => m.ITIExaminerDispatchVerifyModule), title: 'ITI Examiner Dispatch Verify' },

      { path: 'bter-em-stafflist', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-em-staff-list/bter-em-staff-list.module').then(m => m.BTEREMStaffListModule), title: 'Staff List' },
      { path: 'bter-em-add-staff', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/add-staff-initial-details/add-staff-initial-details.module').then(m => m.AddStaffInitialDetailsModule), title: 'Add Staff' },
      { path: 'bter-em-add-staff-principle', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/em-principle-staff/em-principle-staff.module').then(m => m.EMPrincipleStaffModule), title: 'Add Staff' },
      { path: 'bter-em-add-staff-details', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-em-add-staff-details/bter-em-add-staff-details.module').then(m => m.BterEMAddStaffDetailsModule), title: 'Add Staff' },


      { path: 'Pdf-Download', loadChildren: () => import('./Views/ITI/Pdf-Download/Pdf-Download-routing.module').then(m => m.PdfDownloadRoutingModule), title: 'Pdf-Download' },
      /*{ path: 'certificate', loadChildren: () => import('./Views/ITI/results/iti-certificate/iti-certificate-routing.module').then(m => m.ItiCertificateRoutingModule), title: 'certificate' },*/
      { path: 'certificate', loadChildren: () => import('./Views/ITI/results/iti-certificate/iti-certificate.module').then(m => m.ItiCertificateModule), title: 'certificate' },
      { path: 'marksheet', loadChildren: () => import('./Views/ITI/results/marksheet/marksheet.module').then(m => m.marksheetDownloadModule), title: 'Mark Sheet' },
      { path: 'c-form-report', loadChildren: () => import('./Views/ITI/results/c-form/c-form.module').then(m => m.CFormModule), title: 'Report' },
      { path: 'iti-results', loadChildren: () => import('./Views/ITI/results/iti-result/iti-result.module').then(m => m.ITIResultModule), title: 'ITI Result' },
      { path: 'iti-student-pass-fail-result', loadChildren: () => import('./Views/ITI/results/iti-student-pass-fail-result/iti-student-pass-fail-result.module').then(m => m.itiStudentPassFailResultModule), title: 'iti-student-pass-fail-result' },
     
      { path: 'pass-fail-report', loadChildren: () => import('./Views/ITI/results/pass-fail-report/pass-fail-report.module').then(m => m.passfailreportDownloadModule), title: 'pass-fail-report' },
      { path: 'trade-wise-result', loadChildren: () => import('./Views/ITI/results/iti-tradewiseresult/iti-tradewiseresult.module').then(m => m.ItiTradeWiseResultModule), title: 'trade-wise-result' },

      { path: 'ITITheoryExamReport', loadChildren: () => import('./Views/ITI/theory-exam-report/theory-exam-report.module').then(m => m.TheoryExamReportModule), title: 'Theory Exam Report' },
      { path: 'iti-college-search', loadChildren: () => import('./Views/ITI/results/iti-college-search/iti-college-search.module').then(m => m.ItiCollegeSearchModule), title: 'iti-college-search' },

      { path: 'ACP-Dashboard', loadChildren: () => import('./Views/BTER/acp-dashboard/acp-dashboard.module').then(m => m.ACPDashboardModule) },
      { path: 'Bter-AddUserRequest', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-em-UserRequest/bter-em-request-add/bter-em-request-add.module').then(m => m.BtereEMRequestAddModule), title: 'Bter-AddUserRequest' },
      { path: 'Bter-AddUserRequest/:id', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-em-UserRequest/bter-em-request-add/bter-em-request-add.module').then(m => m.BtereEMRequestAddModule), title: 'Bter-AddUserRequest' },
      { path: 'BterUserRequestList', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-em-UserRequest/bter-request-list/bter-request-list.module').then(m => m.BterUserRequestListModule) },
      { path: 'BterEmDepartmentWiseRequestlist', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-em-UserRequest/Bter-Em-DepartmentWiseRequest-list/Bter-Em-DepartmentWiseRequest-list.module').then(m => m.BterEmDepartmentWiseRequestlistModule) },

      { path: 'pass-fail-report', loadChildren: () => import('./Views/ITI/results/pass-fail-report/pass-fail-report.module').then(m => m.passfailreportDownloadModule), title: 'pass-fail-report' },
      { path: 'center-superitendent-exam-report', loadChildren: () => import('./Views/ITI/center-superitendent-exam-report/center-superitendent-exam-report.module').then(m => m.CenterSuperitendentExamReportModule) },
      { path: 'ACP-Dashboard', loadChildren: () => import('./Views/BTER/acp-dashboard/acp-dashboard.module').then(m => m.ACPDashboardModule) },
      { path: '8th-Final-admission', loadChildren: () => import('./Views/ITI/reports/final-admission/final-admission.module').then(m => m.FinalAdmissionModule) },
      { path: 'BterGovtEMSanctionedPostBasedInstituteList', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/Bter-Govt-EM-SanctionedPostBasedInstituteList/Bter-Govt-EM-SanctionedPostBasedInstituteList.module').then(m => m.BterGovtEMSanctionedPostBasedInstituteListModule), title: 'Bter Govt EM Sanctioned Post Based Institute ' },
      { path: 'ITIGenerateAdmitCard_RollNumberIn_Bulk', loadChildren: () => import('./Views/ITI/iti-admitcard-and-roll-no-bulk-generate/iti-admitcard-and-roll-no-bulk-generate.module').then(m => m.ITIAdmitcardAndRollNoBulkGenerateModule), title:'Generate Roll List/Admit card' },
      { path: '8th-admission-statistics', loadChildren: () => import('./Views/ITI/reports/iti-8th-admission-statistics/iti-8th-admission-statistics.module').then(m => m.Iti8ThAddmissionStatisticsModule), title: 'iti-8th-admission-statistics' },
      { path: '10th-admission-statistics', loadChildren: () => import('./Views/ITI/reports/iti-10th-admission-statistics/iti-10th-admission-statistics.module').then(m => m.Iti10ThAddmissionStatisticsModule), title: 'iti-10th-admission-statistics' },
      { path: 'session-configuration', loadChildren: () => import('./Views/ITI/Examination/iti-master-configuration/iti-master-configuration.module').then(m => m.ITIMasterConfigurationModule), title: 'Session Configuration' },
      { path: 'BterGovtEMServiceDetailsOfPersonal', loadChildren: () => import('./Views/BTER/BTER-GOVT-Establish-Management/bter-Govt-EM-ServiceDetailsOfPersonal/bter-Govt-EM-ServiceDetailsOfPersonal.module').then(m => m.bterGovtEMServiceDetailsOfPersonalModule), title: 'Bter Govt EM Service Details Of Personal' },
      { path: '8th-seat-utilization-status', loadChildren: () => import('./Views/ITI/reports/iti-8th-seat-utilization-status/iti-8th-seat-utilization-status.module').then(m => m.Iti8ThSeatUtilizationStatusModule), title: 'iti-8th-seat-utilization-status' },
      { path: '10th-seat-utilization-status', loadChildren: () => import('./Views/ITI/reports/iti-10th-seat-utilization-status/iti-10th-seat-utilization-status.module').then(m => m.Iti10ThSeatUtilizationStatusModule), title: 'iti-10th-seat-utilization-status' },
      { path: 'Final-admission', loadChildren: () => import('./Views/ITI/reports/final-admission/final-admission.module').then(m => m.FinalAdmissionModule) },
      { path: '10Final-admission', loadChildren: () => import('./Views/ITI/reports/final-admission/final-admission.module').then(m => m.FinalAdmissionModule) },
      { path: 'Genderadmission', loadChildren: () => import('./Views/ITI/reports/male-female-admission/male-female-admission.module').then(m => m.MaleFemaleAdmissionModule) },
      { path: '10Genderadmission', loadChildren: () => import('./Views/ITI/reports/male-female-admission/male-female-admission.module').then(m => m.MaleFemaleAdmissionModule) },
      { path: 'CenterWiseStudent', loadChildren: () => import('./Views/ITI/center-superintendent-student/center-superintendent-student.module').then(m => m.CenterSuperintendentStudentModule) },

      { path: 'iti-student-enrollment', loadChildren: () => import('./Views/ITI/itistudent-enrollment-admitted/itistudent-enrollment-admitted.module').then(m => m.ITIStudentEnrollmentAdmittedModule), title: 'Student Enrollment' },
      { path: 'iti-student-enrollment/:id', loadChildren: () => import('./Views/ITI/itistudent-enrollment-admitted/itistudent-enrollment-admitted.module').then(m => m.ITIStudentEnrollmentAdmittedModule), title: 'Student Enrollment' },

      { path: '8th-admissions-in-women-wing', loadChildren: () => import('./Views/ITI/reports/iti-8th-admissions-in-women-wing/iti-8th-admissions-in-women-wing.module').then(m => m.Iti8ThAdmissionsInWomenWingModule), title: 'iti-8th-admissions-in-women-wing' },
      { path: '10th-admissions-in-women-wing', loadChildren: () => import('./Views/ITI/reports/iti-10th-admissions-in-women-wing/iti-10th-admissions-in-women-wing.module').then(m => m.Iti10ThAdmissionsInWomenWingModule), title: 'iti-10th-admissions-in-women-wing' },
      { path: 'CenterTradeStudentReport', loadChildren: () => import('./Views/ITI/center-trade-student-report/center-trade-student-report.module').then(m => m.CenterTradeStudentReportModule) },


      { path: '8th-trade-wise-admission-status', loadChildren: () => import('./Views/ITI/reports/iti-8th-trade-wise-admission-status/iti-8th-trade-wise-admission-status.module').then(m => m.Iti8ThTradeWiseAdmissionStatusModule), title: '8th-trade-wise-admission-status' },
      { path: '10th-trade-wise-admission-status', loadChildren: () => import('./Views/ITI/reports/iti-10th-trade-wise-admission-status/iti-10th-trade-wise-admission-status.module').then(m => m.Iti10ThTradeWiseAdmissionStatusModule), title: '10th-trade-wise-admission-status' },
      { path: 'planning-details-report', loadChildren: () => import('./Views/ITI/reports/iti-planing-details/iti-planing-details.module').then(m => m.ItiPlaningDetailsModule), title: 'planing-details-report' },
      { path: 'ItiStaffDashboard', loadChildren: () => import('./Views/ITI/iti-staff-dashboard/iti-staff-dashboard.module').then(m => m.ItiStaffDashboardModule) },


      { path: '8th-category-wise-seat-utilization', loadChildren: () => import('./Views/ITI/reports/iti-8th-category-wise-seat-utilization/iti-8th-category-wise-seat-utilization.module').then(m => m.Iti8ThCategoryWiseSeatUtilizationModule), title: '8th-category-wise-seat-utilization' },
      { path: '10th-category-wise-seat-utilization', loadChildren: () => import('./Views/ITI/reports/iti-10th-category-wise-seat-utilization/iti-10th-category-wise-seat-utilization.module').then(m => m.Iti10ThCategoryWiseSeatUtilizationModule), title: '10th-category-wise-seat-utilization' },
      { path: 'StudentPlacementMapping', loadChildren: () => import('./Views/BTER/Student/student-placement-mapping/student-placement-mapping.module').then(m => m.StudentPlacementMappingModule) },


      { path: 'college-seat-metrix', loadChildren: () => import('./Views/ITI/seat-metrix/college-wise-seat-metrix/college-wise-seat-metrix.module').then(m => m.CollegeWiseSeatMetrixModule), title: 'ITI Seat Metrix' },

      { path: 'BTERUpwardList/:id', loadChildren: () => import('./Views/BTER/BTERUpwardList/BTERUpwardList.module').then(m => m.BTERUpwardListModule) },

      { path: 'ItiCentersuperintendentDashboard', loadChildren: () => import('./Views/ITI/iti-centersuperintendent-dashboard/iti-centersuperintendent-dashboard.module').then(m => m.ItiCentersuperintendentDashboardModule) },
      { path: 'Projects', loadChildren: () => import('./Views/Issue-tracker/projects/projects.module').then(m => m.ProjectsModule), title: 'Projects' },
      { path: 'AddProjects', loadChildren: () => import('./Views/Issue-tracker/add-projects/add-projects.module').then(m => m.AddProjectsModule), title: 'Add Projects' },
      
      { path: 'IssueTracker', loadChildren: () => import('./Views/Issue-tracker/issue-tracker/issue-tracker.module').then(m => m.IssueTrackerModule) },
      { path: 'add-issue-tracker', loadChildren: () => import('./Views/Issue-tracker/add-issue-tracker/add-issue-tracker.module').then(m => m.AddIssueTrackerModule) },

      { path: 'CampusPost-History', loadChildren: () => import('./Views/BTER/campus-post-history/campus-post-history.module').then(m => m.CampusPostHistoryModule) },
      {
        path: 'NCVTTotalInstituteReport', loadChildren: () => import('./Views/ITI/iti-ncvt-dashboard-institute-report/iti-ncvt-dashboard-institute-report.module').
          then(m => m.ITINcvtDashboardInstituteReportModule), title: 'ITI-NCVT-TotalInstitute-Report'
      },

      { path: 'iti-colleges-downloads', loadChildren: () => import('./Views/ITI/results/iti-college-download/iti-marksheet.module').then(m => m.ITImarksheetDownloadModule), title: 'ITIMarksheets' },


      { path: 'direct-allotment-list8/:id', loadChildren: () => import('./Views/ITI/direct-allotment/direct-allotment-list/direct-allotment-list.module').then(m => m.DirectAllotmentListModule), title: 'direct-allocation-list8' },
      { path: 'direct-allotment-list10/:id', loadChildren: () => import('./Views/ITI/direct-allotment/direct-allotment-list/direct-allotment-list.module').then(m => m.DirectAllotmentListModule), title: 'direct-allocation-list10' },
      { path: 'direct-allotment-list12/:id', loadChildren: () => import('./Views/ITI/direct-allotment/direct-allotment-list/direct-allotment-list.module').then(m => m.DirectAllotmentListModule), title: 'direct-allocation-list12' },
      { path: 'direct-student-allotment/:id/:TradeLevel', loadChildren: () => import('./Views/ITI/direct-allotment/direct-student-allotment/direct-student-allotment.module').then(m => m.VerifyStudentAllotModule) },
      /*{ path: 'AdminRollnumberList', loadChildren: () => import('./Views/generate-roll-AdminLevel/generate-roll-AdminLevelmodule').then(m => m.generateRollAdminLevelModule), title: 'List Rollnumber Show Admin' },*/
      { path: 'iti-student-pass-fail-result/:id', loadChildren: () => import('./Views/ITI/results/iti-student-pass-fail-result/iti-student-pass-fail-result.module').then(m => m.itiStudentPassFailResultModule), title: 'iti-student-pass-fail-result' },




      { path: 'instructor', loadChildren: () => import('./Views/ITI/ITI_Instructor/iti-instructor/iti-instructor.module').then(m => m.ItiInstructorModule) },
     { path: 'Vacantseat', loadChildren: () => import('./Views/ITI/reports/vacant-seat/vacant-seat.module').then(m => m.VacantSeatModule) },
  { path: '10Vacantseat', loadChildren: () => import('./Views/ITI/reports/vacant-seat/vacant-seat.module').then(m => m.VacantSeatModule) },
  { path: 'Reportingstatus', loadChildren: () => import('./Views/ITI/reports/iti-wise-reporting-status/iti-wise-reporting-status.module').then(m => m.ReportingStatusModule) },
  { path: '10Reportingstatus', loadChildren: () => import('./Views/ITI/reports/iti-wise-reporting-status/iti-wise-reporting-status.module').then(m => m.ReportingStatusModule) },
  { path: 'AgeStudentData', loadChildren: () => import('./Views/ITI/reports/age-wise-student-data/age-wise-student-data.module').then(m => m.AgeStudentDataModule) },
  { path: '10AgeStudentData', loadChildren: () => import('./Views/ITI/reports/age-wise-student-data/age-wise-student-data.module').then(m => m.AgeStudentDataModule) },
  { path: 'DirectAddmissionReport', loadChildren: () => import('./Views/ITI/reports/direct-admission-report/direct-admission-report.module').then(m => m.DirectAdmissionReportModule) },
  { path: 'studentWithdrawn-report', loadChildren: () => import('./Views/ITI/reports/student-withdrawn-report/student-withdrawn-report.module').then(m => m.studentwithdrawnreportModule) },
  { path: 'AllotmentReportCollege', loadChildren: () => import('./Views/ITI/reports/allotment-report-college/allotment-report-college.module').then(m => m.AllotmentReportCollegeModule) },
      { path: 'IMCAllotmentReport', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },
      { path: 'IMCAllotmentReport/:id', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },
      { path: 'view-verify-roll-list', loadChildren: () => import('./Views/view-verify-roll-list/view-verify-roll-list.module').then(m => m.ViewVerifyRollListModule) },
      { path: 'StaffRequestReport', loadChildren: () => import('./Views/Reports/BterEmStaffRequestRelievingJoiningReport/BterEmStaffRequestRelievingJoiningReport.module').then(m => m.BterEmStaffRequestRelievingJoiningReport) },
      { path: 'RevalAppointExaminerList', loadChildren: () => import('./Views/reval-appoint-examiner-list/reval-appoint-examiner-list.module').then(m => m.RevalAppointExaminerListModule), title: 'Reval Appoint Examiner List' },
      { path: 'examiner-reval', loadChildren: () => import('./Views/Examiner-Reval/reval-examiners/reval-examiners.module').then(m => m.RevalExaminersModule), title: 'Reval Examiner' },
      { path: 'add-examiner-reval', loadChildren: () => import('./Views/Examiner-Reval/reval-add-examiner/reval-add-examiner.module').then(m => m.RevalAddExaminerModule), title: 'Reval Add Examiner' },
      
      { path: 'ITIAllotmentReport/:id', loadChildren: () => import('./Views/ITI/reports/iti-allotment-report/iti-allotment-report.module').then(m => m.ITIAllotmentReportModule) },
      { path: 'StudentSeatAllotment', loadChildren: () => import('./Views/ITI/reports/iti-student-seat-allotment-report/iti-student-seat-allotment-report.module').then(m => m.ItiStudentSeatAllotmentReportModule) },
      { path: 'StudentSeatWithdrawReport', loadChildren: () => import('./Views/ITI/reports/student-seat-withdraw-report/student-seat-withdraw-report.module').then(m => m.StudentSeatWithdrawReportModule) },
      { path: 'CenterSuperintendentNcvtreport', loadChildren: () => import('./Views/Reports/center-superintendentreport/center-superintendentreport.module').then(m => m.CenterSuperintendentreportModule) },
  
  {
    path: 'allotment-report-admin', loadChildren: () => import('./Views/ITI/reports/allotment-report-college-admin/allotment-report-college-admin.module').
      then(m => m.AllotmentReportCollegeAdminModule)},
      { path: 'StudentEnrollmentCancelation', loadChildren: () => import('./Views/BTER/student-enrollment-cancelation/student-enrollment-cancelation.module').then(m => m.StudentEnrollmentCancelationModule) },
      { path: 'StudentJanaadharReport', loadChildren: () => import('./Views/ITI/studentjanaadhar-report/studentjanaadhar-report.module').then(m => m.StudentjanaadharReportModule) },
      { path: 'InstitutejanaadharReport', loadChildren: () => import('./Views/ITI/institutejanaadhar-report/institutejanaadhar-report.module').then(m => m.InstitutejanaadharReportModule) },


      { path: 'StudentCancellationVerify/:id', loadChildren: () => import('./Views/BTER/enrollment-cancelation-verify/enrollment-cancelation-verify.module').then(m => m.EnrollmentCancelationVerifyModule) },
      { path: 'StudentCancellationVerify', loadChildren: () => import('./Views/BTER/enrollment-cancelation-verify/enrollment-cancelation-verify.module').then(m => m.EnrollmentCancelationVerifyModule) },
      { path: 'ITIInvigilatorPaymentRequest', loadChildren: () => import('./Views/ITI/iti-invigilator-payment-request/iti-invigilator-payment-request.module').then(m => m.ITIInvigilatorPaymentRequestModule), title: 'ITIInvigilatorPaymentRequest' },
        { path: 'RollNoListByAdmin', loadChildren: () => import('./Views/RollNoListByAdmin/RollNoListByAdmin.module').then(m => m.RollNoListByAdminModule), title: 'RollNo List By Admin' },
        { path: 'CollegeListAdminLevel', loadChildren: () => import('./Views/CollegeMaster/CollegeListAdminLevel/CollegeListAdminLevel.module').then(m => m.CollegeListAdminLevelModule), title: 'College List Admin Level' },
        { path: 'ItiPromoteStudent', loadChildren: () => import('./Views/ITI/iti-promote-student/iti-promote-student.module').then(m => m.ItiPromoteStudentModule) },
        { path: 'ITSupportDashboard', loadChildren: () => import('./Views/BTER/it-support-dashboard/it-support-dashboard.module').then(m => m.ITSupportDashboardModule) },
        { path: 'EnrollmentCancellationList', loadChildren: () => import('./Views/BTER/enrollment-cancellation-list/enrollment-cancellation-list.module').then(m => m.EnrollmentCancellationListModule) },
      { path: 'InternalSlidingReport', loadChildren: () => import('./Views/ITI/reports/internal-sliding-report/internal-sliding-report.module').then(m => m.InternalSlidingReportModule), title: 'InternalSlidingReport' },
      { path: 'SwappingReport', loadChildren: () => import('./Views/ITI/reports/swapping-report/swapping-report.module').then(m => m.SwappingReportModule), title: 'SwappingReportForAdmin' },

      { path: 'iti-admin-remunerationInvigilator', loadChildren: () => import('./Views/ITI/iti-admin-remunerationInvigilator-details/iti-admin-remunerationInvigilator-details.module').then(m => m.ItiAdminRemunerationInvigilatorDetailsModule), title: 'iti-admin-remunerationInvigilator-details' },


      { path: 'center-superitendent-exam-report', loadChildren: () => import('./Views/ITI/center-superitendent-exam-report/center-superitendent-exam-report.module').then(m => m.CenterSuperitendentExamReportModule) },
      { path: 'center-superitendent-exam-report/:id', loadChildren: () => import('./Views/ITI/center-superitendent-exam-report/center-superitendent-exam-report.module').then(m => m.CenterSuperitendentExamReportModule) },
      { path: 'CenterSuperitendentExamReport', loadChildren: () => import('./Views/ITI/center-superitendent-exam-report-master/center-superitendent-exam-report-master.module').then(m => m. CenterSuperitendentExamReportMasterModule) },
      { path: 'ItiBGTHeadmaster', loadChildren: () => import('./Views/ITI/iti-bgt-headmaster/iti-bgt-headmaster.module').then(m => m.ItiBGTHeadMasterModule) },

        { path: 'iti-remunerationInvigilatorApproved-list', loadChildren: () => import('./Views/ITI/iti-admin-remunerationInvigilator-list/iti-admin-remunerationInvigilator-list.module').then(m => m.ItiAdminRemunerationInvigilatorlistModule), title: 'Invigilation Remuneration Approved list' },
        { path: 'staff-management-report', loadChildren: () => import('./Views/Reports/staff-management-reports/staff-management-reports.module').then(m => m.StaffManagementReportsModule), title: 'staff-management-report' },
      { path: 'statistics-report', loadChildren: () => import('./Views/Reports/bter-statistics-reports/bter-statistics-reports.module').then(m => m.StatisticsReportsModule), title: 'Statistics-report' },
      { path: 'PMNAM-MelaReportBeforeAfter', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/pmnam-mela-report-before-after/pmnam-mela-report-before-after.module').then(m => m.PMNAMMelaReportBeforeAfterModule), title: 'PMNAM Mela Report' },
      { path: 'PMNAM-MelaReportBeforeAfter-List', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/pmnam-mela-report-before-after-list/pmnam-mela-report-before-after-list.module').then(m => m.PMNAMMelaReportBeforeAfterListModule), title: 'PMNAM Mela Report List' },
      { path: 'bridge-course-report', loadChildren: () => import('./Views/Reports/bter-bridge-course-reports/bter-bridge-course-reports.module').then(m => m.BridgeCourseReportsModule), title: 'Bridge-Course-Report' },
      { path: 'mass-copping-report', loadChildren: () => import('./Views/Reports/bter-mass-copping-reports/bter-mass-copping-reports.module').then(m => m.MassCoppingReportsModule), title: 'Mass-Copping-Report' },
      { path: 'institute-student-report', loadChildren: () => import('./Views/Reports/bter-institute-student-reports/bter-institute-student-reports.module').then(m => m.InstituteStudentReportsModule), title: 'institute-student-report' },

      { path: 'staff-management-report', loadChildren: () => import('./Views/Reports/staff-management-reports/staff-management-reports.module').then(m => m.StaffManagementReportsModule), title: 'staff-management-report' },
      { path: 'branch-wise-statistical-reports', loadChildren: () => import('./Views/Reports/bter-branch-wise-statistical-reports/bter-branch-wise-statistical-reports.module').then(m => m.BranchWiseStatisticalReportsModule), title: 'branch-wise-statistical-reports' },

      { path: 'PMNAM-MelaReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/pmnam-mela-report/pmnam-mela-report.module').then(m => m.PmnamMelaReportModule) },
      { path: 'Workshop-progressReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/workshop-progress-report/workshop-progress-report.module').then(m => m.WorkshopProgressReportModule) },



      { path: 'NodalWorkshopReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/nodal-workshop-report/nodal-workshop-report.module').then(m => m.NodalWorkshopReportModule) },
      { path: 'QuaterWorkshopReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/quater-workshop-report/quater-workshop-report.module').then(m => m.QuaterWorkshopReportModule) },

      { path: 'ApprenticeshipRegistrationReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/apprenticeship-registration-report/apprenticeship-registration-report.module').then(m => m.ApprenticeshipRegistrationReportModule) },
      { path: 'ApprenticeshipRegistrationReport-list', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/apprenticeship-registration-report-list/apprenticeship-registration-report-list.module').then(m => m.ApprenticeshipRegistrationReportListModule) },

      { path: 'Workshop-progressReport-List', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/workshop-progress-report-list/workshop-progress-report-list.module').then(m => m.WorkshopProgressReportListModule) },

      { path: 'PaasoutRegistrationReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/passout-registration-report/passout-registration-report.module').then(m => m.PassoutRegistrationReportModule) },

      { path: 'PaasoutRegistrationReportList', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/passout-registration-report-list/passout-registration-report-list.module').then(m => m.PassoutRegistrationReportListModule) },


      { path: 'fresherRegistrationReport', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/fresher-registration-report/fresher-registration-report.module').then(m => m.fresherRegistrationReportModule) },

      { path: 'fresherRegistrationReportlist', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/fresher-registration-report-list/fresher-registration-report-list.module').then(m => m.fresherRegistrationReportListModule) },

      { path: 'BudgetDistribute', loadChildren: () => import('./Views/ITI/BudgetManagement/budget-distribute/budget-distribute.module').then(m => m.BudgetDistributeModule) },

        { path: 'DispatchToInstituteReval', loadChildren: () => import('./Views/DispatchManagementReval/dispatch-to-institute-reval/dispatch-to-institute-reval.module').then(m => m.DispatchToInstituteRevalModule) },
        { path: 'DispatchGroupRevalList', loadChildren: () => import('./Views/DispatchManagementReval/dispatch-group-reval-list/dispatch-group-reval-list.module').then(m => m.DispatchGroupRevalListModule) },
        { path: 'PrincipalDispatchRevalGroup', loadChildren: () => import('./Views/DispatchManagementReval/principal-dispatch-reval-group/principal-dispatch-reval-group.module').then(m => m.PrincipalDispatchRevalGroupModule) },
        { path: 'DispatchPrincipalRevalGroupCodeList', loadChildren: () => import('./Views/DispatchManagementReval/DispatchPrincipalRevalGroupCode-list/DispatchPrincipalRevalGroupCode-list.module').then(m => m.DispatchPrincipalRevalGroupCodeListModule) },
        { path: 'DispatchPrincipalRevalGroupCode', loadChildren: () => import('./Views/DispatchManagementReval/DispatchPrincipalRevalGroupCode-form/DispatchPrincipalRevalGroupCode-form.module').then(m => m.DispatchPrincipalRevalGroupCodeFormModule), title: 'Dispatch Principal Reval Group Code Form' },
      { path: 'ExaminerDispatchRevalVerify', loadChildren: () => import('./Views/DispatchManagementReval/examiner-dispatch-reval-verify/examiner-dispatch-reval-verify.module').then(m => m.ExaminerDispatchRevalVerifyModule) },
      { path: 'CollegeBudgetList', loadChildren: () => import('./Views/ITI/BudgetManagement/college-budget-list/college-budget-list.module').then(m => m.CollegeBudgetListModule)},
      { path: 'PlacementDataReport', loadChildren: () => import('./Views/Reports/placement-data-report/placement-data-report.module').then(m => m.PlacementDataReportModule) },
      { path: 'BudgetRequest', loadChildren: () => import('./Views/ITI/BudgetManagement/college-budget-request/college-budget-request.module').then(m => m.CollegeBudgetRequestModule) },
      
      { path: 'download-admit-card', loadChildren: () => import('./Views/BTER/download-admit-card-cs/download-admit-card-cs.module').then(m => m.DownloadAdmitCardCSModule), title: 'Download Admit Card' },

      { path: 'budgetrequeststatus', loadChildren: () => import('./Views/ITI/BudgetManagement/budget-request-status/budget-request-status.module').then(m => m.BudgetRequestStatusModule) },
      { path: 'principle-reply-admin-reval-dispatch-list', loadChildren: () => import('./Views/DispatchManagementReval/principle-reply-admin-reval-dispatch-list/principle-reply-admin-reval-dispatch-list.module').then(m => m.PrincipleReplyAdminRevalDispatchListModule) },
      { path: 'AdminRevalGroupCodeReceivedlist', loadChildren: () => import('./Views/DispatchManagementReval/AdminRevalGroupCodeReceived-list/AdminRevalGroupCodeReceived-list.module').then(m => m.AdminRevalGroupCodeReceivedlistModule) },
      { path: 'StudentRevaluationDetailsReport', loadChildren: () => import('./Views/Reports/bter-student-revaluation-details-report/bter-student-revaluation-details-report.module').then(m => m.RevaluationStudentDetailsReportsModule) },
      { path: 'StudentDetailsReport', loadChildren: () => import('./Views/Reports/student-examiner-details-report/student-examiner-details-report.module').then(m => m.StudentExaminerDetailsReportsModule) },
        { path: 'verify-aadhar', loadChildren: () => import('./Views/aadhar-varify/aadhar-varify.module').then(m => m.AadharVerifyDetailModule) },

      { path: 'SanctionOrder', loadChildren: () => import('./Views/ITI/SanctionOrder/SanctionOrder.module').then(m => m.SanctionOrderModule), title: 'Sanction Order' },
      { path: 'CenterSuperinstendentAbsentOrPresentReport', loadChildren: () => import('./Views/Reports/CenterSuperinstendent-A-P-Report/CenterSuperinstendent-A-P-Report.module').then(m => m.CenterSuperinstendentAPReportModule), title: 'Center Superinstendent AbsentOrPresent Report' },
        { path: '8th-admissions-in-women-wing', loadChildren: () => import('./Views/ITI/reports/iti-8th-admissions-in-women-wing/iti-8th-admissions-in-women-wing.module').then(m => m.Iti8ThAdmissionsInWomenWingModule), title: 'iti-8th-admissions-in-women-wing' },
        { path: '10th-admissions-in-women-wing', loadChildren: () => import('./Views/ITI/reports/iti-10th-admissions-in-women-wing/iti-10th-admissions-in-women-wing.module').then(m => m.Iti10ThAdmissionsInWomenWingModule), title: 'iti-10th-admissions-in-women-wing' },

      { path: 'IssueTracker', loadChildren: () => import('./Views/issue-tracker/issue-tracker.module').then(m => m.IssueTrackerModule) },
      { path: 'add-issue-tracker', loadChildren: () => import('./Views/BTER/add-issue-tracker/add-issue-tracker.module').then(m => m.AddIssueTrackerModule) },
      { path: 'IssuetrackerDashboard', loadChildren: () => import('./Views/BTER/IssueTracker-dashboard/issuetracker-dashboard.module').then(m => m.IssuetrackerDashboardModule) },
      { path: 'ReuploadDocumentList10th/:id', loadChildren: () => import('./Views/ITI/reupload-document-list/reupload-document-list.module').then(m => m.ReuploadDocumentListModule) },
      { path: 'ReuploadDocumentList8th/:id', loadChildren: () => import('./Views/ITI/reupload-document-list/reupload-document-list.module').then(m => m.ReuploadDocumentListModule) },
      { path: 'ReuploadDocumentList12th/:id', loadChildren: () => import('./Views/ITI/reupload-document-list/reupload-document-list.module').then(m => m.ReuploadDocumentListModule) },
      { path: 'ReuploadDocument', loadChildren: () => import('./Views/ITI/reupload-document/reupload-document.module').then(m => m.ReuploadDocumentModule) },
      { path: 'addidffund', loadChildren: () => import('./Views/ITI/idffund-details/idffund-details.module').then(m => m.IDFFundDetailsModule) },


      { path: 'IIP-List', loadChildren: () => import('./Views/BTER/iip-list/iip-list.module').then(m => m.IIPListModule) },
      { path: 'Add-IIP', loadChildren: () => import('./Views/BTER/add-iip/add-iip.module').then(m => m.AddIIPModule) },
      { path: 'add-imc-registration', loadChildren: () => import('./Views/ITI/IIP-Module/add-imc-registration/add-imc-registration.module').then(m => m.AddItiIMCRegistrationModule), title: 'ITI IMC Registration' },
      { path: 'add-imc-fund', loadChildren: () => import('./Views/ITI/IIP-Module/add-imc-fund/add-imc-fund.module').then(m => m.AddItiIMCFundModule), title: 'ITI IMC Fund' },
      { path: 'add-quater-repot', loadChildren: () => import('./Views/ITI/IIP-Module/add-quater-report/add-quater-repot.module').then(m => m.AddITIQuarterReportModule), title: 'ITI IMC Fund' },
      //{ path: 'inspection-team', loadChildren: () => import('./Views/ITI/Inspection/inspection-team/inspection-team.module').then(m => m.InspectionTeamModule), title: 'ITI Inspection' },
      //{ path: 'inspection-deployment', loadChildren: () => import('./Views/ITI/Inspection/inspection-deployment/inspection-deployment.module').then(m => m.InspectionDeploymentModule), title: 'ITI Inspection' },
      { path: 'iti-iip-manage', loadChildren: () => import('./Views/ITI/IIP-Module/iip-manage/iip-manage.module').then(m => m.ITIIIPManageModule), title: 'ITI IIP Manage' },
      //{ path: 'verify-iti-inspection', loadChildren: () => import('./Views/ITI/Inspection/verify-iti-inspection/verify-iti-inspection.module').then(m => m.VerifyITIInspectionModule), title: 'ITI Inspection' },
      //{ path: 'iti-inspection-report', loadChildren: () => import('./Views/ITI/Inspection/iti-inspection-report/iti-inspection-report.module').then(m => m.ITIInspectionReportModule), title: 'ITI Inspection Report' },

      { path: 'iti-direct-admission-student-initial-detail', loadChildren: () => import('./Views/ITI/Direct-Addmission-Form-ITI/iti-direct-student-jan-aadhar-detail/iti-direct-student-jan-aadhar-detail.module').then(m => m.ITIDirectStudentJanAadharDetailModule), title: 'ITI Direct Admission' },
      { path: 'direct-admission-application-form', loadChildren: () => import('./Views/ITI/Direct-Addmission-Form-ITI/iti-direct-application-form-tab/iti-direct-application-form-tab.module').then(m => m.ITIDirectApplicationFormTabModule), title: 'ITI-Application Form' },
      { path: 'iti-staff-management-report', loadChildren: () => import('./Views/ITI/reports/staff-management-reports/staff-management-reports.module').then(m => m.StaffManagementReportsModule), title: 'iti-staff-management-report' },

      { path: 'ExamNodalMapping', loadChildren: () => import('./Views/exam-nodal-mapping/exam-nodal-mapping.module').then(m => m.ExamNodalMappingModule) },


      { path: 'IDFFundDetailList', loadChildren: () => import('./Views/ITI/idffund-detail-list/idffund-detail-list.module').then(m => m.IDFFundDetailListModule) },

      { path: 'NcvtPracticalexamAttendence/:id', loadChildren: () => import('./Views/ITI/ncvt-practicalexam-attendence/ncvt-practicalexam-attendence.module').then(m => m.NcvtPracticalexamAttendenceModule) },
      { path: '2ndNcvtPracticalexamAttendence/:id', loadChildren: () => import('./Views/ITI/ncvt-practicalexam-attendence/ncvt-practicalexam-attendence.module').then(m => m.NcvtPracticalexamAttendenceModule) },



        { path: 'IDFFundDetailList', loadChildren: () => import('./Views/ITI/idffund-detail-list/idffund-detail-list.module').then(m => m.IDFFundDetailListModule) },

      { path: 'iti-dead-stock-report', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-dead-stock-report/iti-dead-stock-report.module').then(m => m.itideadstockreportModule) },
      { path: 'iti-auction-report', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-auction-report/iti-auction-report.module').then(m => m.itiauctionreportModule) },

      { path: 'NcvtDataBulkUpload', loadChildren: () => import('./Views/ITI/ncvt-data-bulk-upload/ncvt-data-bulk-upload.module').then(m => m.NcvtDataBulkUploadModule) },

      { path: 'iti-students-upgraded-by-upward', loadChildren: () => import('./Views/ITI/students-upgraded-by-upward/students-upgraded-by-upward.module').then(m => m.StudentUpgradedByUpwardModule), title: 'iti-students-upgraded-by-upward' },

      { path: 'IMCAllotmentReport', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },

      { path: 'IMCAllotmentReport/:id', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },

      { path: 'iti-allotment-report/:id/:iid', loadChildren: () => import('./Views/ITI/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },
     
       { path: 'iti-allotment-report/:id/:iid/:idd', loadChildren: () => import('./Views/ITI/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },

      { path: 'iti-allotment-report', loadChildren: () => import('./Views/ITI/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },

      { path: 'IMCAllotmentReport/:id/:iid', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },

      { path: 'SetCalendar', loadChildren: () => import('./Views/BTER/attendance-time-table/SetCalendar/SetCalendar.module').then(m => m.SetCalendarModule), title: 'Set-Calendar' },
      { path: 'ExaminerBundleList', loadChildren: () => import('./Views/ITI/Examination/examiner-bundle-list/examiner-bundle-list.module').then(m => m.ExaminerBundleListModule) },


    ]
  },
  

  {
    path: '', component: MasterLayoutComponent,
    children: [
      { path: 'emitradashboardnew', loadChildren: () => import('./Views/Emitra/emitra-dashboard/emitra-dashboard.module').then(m => m.EmitraDashboardModule), title: 'Emitra Dashboard' }
    ]
  },
  {
    //root
    path: '', component: AuthLayoutComponent,
    children: [

      { path: 'login', loadChildren: () => import('./Views/login/login.module').then(m => m.LoginModule), title: 'Login' },

      { path: 'bter-college-code-mapping', loadChildren: () => import('./Views/BTER/bter-college-code-mapping/bter-college-code-mapping.module').then(m => m.BterCollegeCodeMappingModule), title: 'bter colloge sso mapping' },

      { path: 'ITICollegeSSOMapping', loadChildren: () => import('./Views/iticollege-ssomapping/iticollege-ssomapping.module').then(m => m.ITICollegeSSOMappingModule), title: 'iti colloge sso mapping' },


      { path: 'student-login', loadChildren: () => import('./Views/student-login/student-login.module').then(m => m.StudentLoginModule), title: 'Student Login' },
      {
        path: 'ssologin', loadChildren: () => import('./Views/ssologin/ssologin.module').then(m => m.SSOLoginModule), title: 'SSO Login'
      },
      {
        path: 'ssologin/:id1', loadChildren: () => import('./Views/ssologin/ssologin.module').then(m => m.SSOLoginModule), title: 'SSO Login'
      },
      { path: 'PaymentStatus', loadChildren: () => import('./Views/Student/payment-status/payment-status.module').then(m => m.PaymentStatusModule), title: 'Payment Status' },
      { path: 'DepartmentLogin', loadChildren: () => import('./Views/department-login/department-login.module').then(m => m.DepartmentLoginModule) },


      { path: 'ApplicationPaymentStatus', loadChildren: () => import('./Views/application-payment-status/application-payment-status.module').then(m => m.ApplicationPaymentStatusModule), title: 'Application Payment Status' },
      { path: 'RevaluationStudentSearch', loadChildren: () => import('./Views/Student/revaluation-student-search/revaluation-student-search.module').then(m => m.RevaluationStudentSearchModule), title: 'Revaluation Student Search' },
      { path: 'RevaluationStudentVerify', loadChildren: () => import('./Views/Student/revaluation-student-verify/revaluation-student-verify.module').then(m => m.RevaluationStudentVerifyModule), title: 'Revaluation Student Verify' },
      { path: 'RevaluationStudentMakePayment', loadChildren: () => import('./Views/Student/revaluation-student-make-payment/revaluation-student-make-payment.module').then(m => m.RevaluationStudentMakePaymentModule), title: 'Revaluation Student Make Payment' },

      { path: 'ApplicationPaymentStatus', loadChildren: () => import('./Views/application-payment-status/application-payment-status.module').then(m => m.ApplicationPaymentStatusModule), title: 'Application Payment Status' },

      { path: 'AadharEsign', loadChildren: () => import('./Views/Aadhar/aadhar-esign/aadhar-esign.module').then(m => m.AadharEsignModule) },

      { path: 'ITIStudentPaymentStatus', loadChildren: () => import('./Views/ITI/student-payment-status/student-payment-status.module').then(m => m.StudentPaymentStatusModule) },


      { path: 'aadhar-esign', loadChildren: () => import('./Views/BTER/aadhar-esign/aadhar-esign.module').then(m => m.AadharEsignModule) },

      { path: 'collegepaymentstatus', loadChildren: () => import('./Views/BTER/college-payment-status/college-payment-status.module').then(m => m.CollegePaymentStatusModule) },


      //Add by balwant sir
      { path: 'IMCAllotmentReport', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },

      { path: 'IMCAllotmentReport/:id', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },

      { path: 'iti-allotment-report/:id/:iid', loadChildren: () => import('./Views/ITI/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },

      { path: 'iti-allotment-report', loadChildren: () => import('./Views/ITI/allotment-report/allotment-report.module').then(m => m.AllotmentReportModule) },

      { path: 'IMCAllotmentReport/:id/:iid', loadChildren: () => import('./Views/ITI/reports/imc-allotment-report/imc-allotment-report.module').then(m => m.IMCAllotmentReportModule) },
      { path: 'iti-students-upgraded-by-upward', loadChildren: () => import('./Views/ITI/students-upgraded-by-upward/students-upgraded-by-upward.module').then(m => m.StudentUpgradedByUpwardModule), title: 'iti-students-upgraded-by-upward' },
     
    ]
  },

  { path: 'StudentEmitraITIFeePayment', loadChildren: () => import('./Views/Student/student-emitra-iti-fee-payment/student-emitra-iti-fee-payment.module').then(m => m.StudentEmitraITIFeePaymentModule), title: '' },
  { path: 'Views\Emitra\FeePaidByChallan', loadChildren: () => import('./Views/Emitra/fee-paid-by-challan/fee-paid-by-challan.module').then(m => m.FeePaidByChallanModule) },



  //{ path: 'iti_admission', loadChildren: () => import('./Views/iti-public-info2/iti-public-info2.module').then(m => m.ITIPublicInfo2Module) },
  //{ path: 'itipublicinfotabs', loadChildren: () => import('./Views/iti-public-info-tabs/iti-public-info2-tabs.module').then(m => m.ITIPublicInfo2TabsModule) },

  {
    //root
    path: '', component: DTEApplicationLayoutComponent,
    children: [

      { path: 'DTEApplicationform', loadChildren: () => import('./Views/BTER/application-form/application-form/application-form.module').then(m => m.ApplicationFormModule), title: 'BTER-Application Form' },
      { path: 'EditOptionForm', loadChildren: () => import('./Views/BTER/edit-option-form/application-form/application-form.module').then(m => m.EditApplicationFormModule), title: 'BTER-Edit Option Form' },
      { path: 'DTEQualificationForm', loadChildren: () => import('./Views/BTER/application-form/qualification-form/qualification-form.module').then(m => m.QualificationFormModule), title: 'Qualifications' },
      { path: 'DTEPersonaldetails', loadChildren: () => import('./Views/BTER/application-form/personal-details/personal-details.module').then(m => m.PersonalDetailsModule), title: 'Personal Details' },
      { path: 'DTEPreviewForm', loadChildren: () => import('./Views/BTER/application-form/preview-form/preview-form.module').then(m => m.PreviewFormModule), title: 'Preview Form' },
      { path: 'DTEDocumentForm', loadChildren: () => import('./Views/BTER/application-form/document-form/document-form.module').then(m => m.DocumentFormModule), title: 'Document Form' },
      { path: 'DTEAddressform', loadChildren: () => import('./Views/BTER/application-form/address-form/address-form.module').then(m => m.AddressFormModule), title: 'Address Form' },
      { path: 'DTEOptionalForm', loadChildren: () => import('./Views/BTER/application-form/optional-form/optional-form.module').then(m => m.OptionalFormModule), title: 'Optional Form' },
      // { path: 'DTEOtherdetails', loadChildren: () => import('./Views/BTER/application-form/other-details-form/other-details-form.module').then(m => m.DTEOtherDetailsFormModule), title: 'Other Details' },
      //{ path: 'DTEStudentJanAadharDetail', loadChildren: () => import('./Views/BTER/application-form/student-jan-aadhar-detail/student-jan-aadhar-detail.module').then(m => m.StudentJanAadharDetailModule), title: 'Student JanAadhaar Detail' },
      // { path: 'DTEStudentJanAadharDetail/:depid', loadChildren: () => import('./Views/BTER/application-form/student-jan-aadhar-detail/student-jan-aadhar-detail.module').then(m => m.StudentJanAadharDetailModule), title: 'Student JanAadhaar Detail' },
      { path: 'DTEdocumentationscrutiny', loadChildren: () => import('./Views/BTER/application-form/documentation-scrutiny/documentation-scrutiny.module').then(m => m.DocumentationScrutinyModule), title: 'Documentation Scrutiny' },
      { path: 'DTEStudentVerificationList', loadChildren: () => import('./Views/BTER/application-form/student-verification-list/student-verification-list.module').then(m => m.StudentVerificationListModule), title: 'Student Verification List' },
      { path: 'DirectDTEApplicationform', loadChildren: () => import('./Views/BTER/direct-application-form/direct-application-form/direct-application-form.module').then(m => m.DirectApplicationFormModule), title: 'BTER-DirectApplication Form' },
          

    ]
  },
  { path: 'Views\BTER\StoreKeeper-dashboard', loadChildren: () => import('./Views/BTER/store-keeper-dashboard/store-keeper-dashboard.module').then(m => m.StoreKeeperDashboardModule) },
  { path: 'Views\BTER\Student-Section-Incharge', loadChildren: () => import('./Views/BTER/student-section-incharge/student-section-incharge.module').then(m => m.StudentSectionInchargeModule) },
  { path: 'PMNAM-MelaReportBeforeAfter', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/pmnam-mela-report-before-after/pmnam-mela-report-before-after.module').then(m => m.PMNAMMelaReportBeforeAfterModule) },
  { path: 'PaasoutRegistrationReportList', loadChildren: () => import('./Views/ITI/ApprenticeshipReport/passout-registration-report-list/passout-registration-report-list.module').then(m => m.PassoutRegistrationReportListModule) },

  
  
  













  
  
 

  { path: '**', loadComponent: () => import('./Views/errors/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent), title: '404 - Page not found' },

];
@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${title} - Kaushal Darpan`);
    }
  }
}
@NgModule({
  imports: [
    //RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, useHash: false,  paramsInheritanceStrategy: 'always' })

    RouterModule.forRoot(routes, {
      useHash: false, onSameUrlNavigation: 'reload', paramsInheritanceStrategy: 'always'
    })
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    }
  ]
})

    export class AppRoutingModule { }

  

