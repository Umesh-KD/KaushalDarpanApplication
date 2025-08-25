import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./Views/Shared/auth-layout/auth-layout.component";
import { HomeLayoutComponent } from "./Views/Shared/home-layout/home-layout.component";
import { MasterLayoutComponent } from "./Views/Shared/master-layout/master-layout.component";

export const routes: Routes = [
    //{ path: '**', component: PageNotFoundComponent },// create not found component
    {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        //front web - home
        path: '', component: HomeLayoutComponent,
        children: [
            {
                path: '', loadChildren: () => import('./Views/Home/home/home.module').then(m => m.HomeModule), title: 'Home'
            },
            {
                path: 'home', loadChildren: () => import('./Views/Home/home/home.module').then(m => m.HomeModule), title: 'Home'
            },
            {
                path: 'allpost', loadChildren: () => import('./Views/Home/all-post/all-post.module').then(m => m.AllPostModule), title: 'All Campus List'
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
        ]
    },
    {
        //admin
        path: '', component: MasterLayoutComponent,
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
                path: 'Rolemaster', loadChildren: () => import('./Views/role-master/role-master.routing.module').then(m => m.RoleMasterRoutingModule), title: 'Role Master'
            },
            {
                path: 'loader', loadChildren: () => import('./Views/Shared/loader/loader.module').then(m => m.LoaderModule),
            },

            { path: 'designationmaster', loadChildren: () => import('./Views/designation-master/designation-master.routing.module').then(m => m.DesignationRoutingModule), title: 'Designation Master' },

            { path: 'levelmaster', loadChildren: () => import('./Views/level-master/level-master.routing.module').then(m => m.LevelRoutingModule), title: 'Level Master' },
            { path: 'CenterCreate', loadChildren: () => import('./Views/CenterAllotment/center-allotment/center-allotment.routing.module').then(m => m.CenterAllotmentRoutingModule), title: 'Create Center' },
            { path: 'SubjectMaster', loadChildren: () => import('./Views/subject-master/subject-master-routing.module').then(m => m.SubjectMasterRoutingModule), title: 'Subject Master' },
            { path: 'SubjectCategory', loadChildren: () => import('./Views/subject-category/subject-category.module.ts').then(m => m.SubjectCategoryRoutingModule), title: 'Subject Category' },
            { path: 'PlacementDashboard/:id', loadChildren: () => import('./Views/placement-dashboard/placement-dashboard.module').then(m => m.PlacementDashboardModule), title: 'Placement Dashboard' },
            { path: 'PlacementDashReport/:id', loadChildren: () => import('./Views/placement-dash-report/placement-dash-report.routing.module').then(m => m.RoleMasterRoutingModule), title: 'Placement Dashboard Report' },

            //{ path: 'rolemenuright/:id', loadChildren: () => import('./Views/role-menu-right/role-menu-right.module').then(m => m.RoleMenuRightModule) },
            //Old Software Master
            { path: 'updatecollegemaster/:id', loadChildren: () => import('./Views/CollegeMaster/add-college-master/add-college-master.module').then(m => m.AddCollegeMasterModule), title: 'Update College' },
            { path: 'updatecollegemaster', loadChildren: () => import('./Views/CollegeMaster/add-college-master/add-college-master.module').then(m => m.AddCollegeMasterModule), title: 'Update College' },
            { path: 'collegemaster', loadChildren: () => import('./Views/CollegeMaster/college-master/college-master.module').then(m => m.CollegeMasterModule), title: 'College Master' },
            { path: 'collegesjanaadhar', loadChildren: () => import('./Views/PreExam/colleges-janaadhar/colleges-janaadhar.module').then(m => m.CollegesJanaadharModule), title: 'College Janaadhaar' },
            { path: 'studentsjanaadhar', loadChildren: () => import('./Views/PreExam/students-janaadhar/students-janaadhar.module').then(m => m.StudentsJanaadharModule), title: 'Student Janaadhaar' },
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

            { path: 'addgroupcenter', loadChildren: () => import('./Views/GroupCenter/add-group-center/add-group-center.module').then(m => m.AddGroupCenterModule), title: 'Add Group Center' },
            { path: 'groupcenter', loadChildren: () => import('./Views/GroupCenter/group-center/group-center.module').then(m => m.GroupCenterModule), title: 'Group Center' },

            { path: 'addtimetable', loadChildren: () => import('./Views/TimeTable/add-time-table/add-time-table.module').then(m => m.AddTimeTableModule), title: 'Add Time Table' },
            { path: 'updatetimetable/:id', loadChildren: () => import('./Views/TimeTable/add-time-table/add-time-table.module').then(m => m.AddTimeTableModule), title: 'Update Time Table' },
            { path: 'timetable', loadChildren: () => import('./Views/TimeTable/time-table/time-table.module').then(m => m.TimeTableModule), title: 'Time Table' },

            { path: 'addcenters', loadChildren: () => import('./Views/Centers/add-centers/add-centers.module').then(m => m.AddCentersModule), title: 'Add Center' },
            { path: 'centers', loadChildren: () => import('./Views/Centers/centers/centers.module').then(m => m.CentersModule), title: 'Centers' },
            { path: 'updatecentermaster', loadChildren: () => import('./Views/Centers/add-centers/add-centers.module').then(m => m.AddCentersModule), title: 'Update Center' },

            { path: 'editstudentsjanaadhar/:ExamMasterID', loadChildren: () => import('./Views/PreExam/add-edit-student-janaadhar/add-edit-student-janaadhar.module').then(m => m.AddEditStudentJanaadharModule), title: 'Edit Student Janaadhaar' },

            { path: 'addcommonsubjects', loadChildren: () => import('./Views/CommonSubjects/add-common-subjects/add-common-subjects.module').then(m => m.AddCommonSubjectsModule), title: 'Add Common Subject' },
            { path: 'commonsubjects', loadChildren: () => import('./Views/CommonSubjects/common-subjects/common-subjects.module').then(m => m.CommonSubjectsModule), title: 'Common Subject' },

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
          { path: 'addstaffbasicdetail', loadChildren: () => import('./Views/staffMaster/add-staff-basic-detail/add-staff-basic-detail.module').then(m => m.AddStaffBasicDetailModule), title: 'Add staff basic Details' },
            { path: 'AddStaffBasicInfo', loadChildren: () => import('./Views/staffMaster/add-staff-basic-info/add-staff-basic-info.module').then(m => m.AddStaffBasicInfoModule) },
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
            { path: 'staffdashboard', loadChildren: () => import('./Views/staff-dashboard/staff-dashboard.module').then(m => m.StaffDashboardModule), title: 'Staff Dashboard' },
            { path: 'StaffDashReport/:id', loadChildren: () => import('./Views/staff-dash-report/staff-dash-report.module').then(m => m.StaffDashReportMasterModule), title: 'Staff Dashboard Report' },
            { path: 'Principledashboard', loadChildren: () => import('./Views/principle-dashboard/principle-dashboard.module').then(m => m.PrincipleDashboardModule), title: 'Principle Dashboard' },
            { path: 'StudentDashboard', loadChildren: () => import('./Views/student-dashboard/student-dashboard.module').then(m => m.StudentDashboardModule), title: 'Student Dashboard' },
            { path: 'StudentPendingFees', loadChildren: () => import('./Views/Student/pending-fees/pending-fees.module').then(m => m.PendingFeesModule), title: 'Student Pending Fees' },

            { path: 'StudentPaidFees', loadChildren: () => import('./Views/Student/paid-fees/paid-fees.module').then(m => m.PaidFeesModule), title: 'Student Paid Fees' },
            { path: 'StudentProfile', loadChildren: () => import('./Views/Student/student-profile/student-profile.module').then(m => m.StudentProfileModule), title: 'Student Profile' },
            { path: 'studentprofiledownload', loadChildren: () => import('./Views/Student/student-profile-download/student-profile-download.module').then(m => m.StudentProfileDownloadModule), title: 'Student Profile' },
            {
                path: 'StudentSsoMapping', loadChildren: () => import('./Views/Student/student-sso-mapping/student-sso-mapping.module').then(m => m.StudentSsoMappingModule), title: 'Student SSO Mapping'
            },
            { path: 'StudentEmitraFeePayment', loadChildren: () => import('./Views/Student/student-emitra-fee-payment/student-emitra-fee-payment.module').then(m => m.StudentEmitraFeePaymentModule), title: 'Student Emitra Fee Payment' },
            { path: 'GenerateEnrollment', loadChildren: () => import('./Views/generate-enroll/generate-enroll.module').then(m => m.GenerateEnrollModule), title: 'Generate Enrollment' },
            { path: 'TheoryMarks', loadChildren: () => import('./Views/theory-marks/theory-marks.module').then(m => m.theorymarksModule), title: 'Theory Marks' },
            { path: 'InternalPracticalStudent', loadChildren: () => import('./Views/internal-practical-student/internal-practical-student.module').then(m => m.InternalPracticalStudentModule), title: 'Internal Practical Student' },
            { path: 'GenerateRollnumber', loadChildren: () => import('./Views/generate-roll/generate-roll.module').then(m => m.GenerateRollModule), title: 'Generate Rollnumber' },
            { path: 'generaterevalrollnumber', loadChildren: () => import('./Views/generate-reval-roll-number/generate-reval-roll-number/generate-reval-roll-number.module').then(m => m.GenerateRevalRollNumberModule), title: 'Generate Reval Rollnumber' },

            { path: 'copycheckdash', loadChildren: () => import('./Views/CopyChecker/copy-checker-dashboard/copy-checker-dashboard.module').then(m => m.CopyCheckerDashboardModule), title: 'Copy Checker Dashboard' },


            { path: 'examiners', loadChildren: () => import('./Views/Examiner/examiners/examiners.module').then(m => m.ExaminersModule), title: 'Examiner' },
            { path: 'addexaminers', loadChildren: () => import('./Views/Examiner/add-examiner/add-examiner.module').then(m => m.AddExaminerModule), title: 'Add Examiner' },
            { path: 'AppointExaminerList', loadChildren: () => import('./Views/appoint-examiner-list/appoint-examiner-list.module').then(m => m.AppointExaminerListModule), title: 'Appoint Examiner List' },
            { path: 'SemesterDetails', loadChildren: () => import('./Views/Student/semester-details/semester-details.module').then(m => m.SemesterDetailsModule), title: 'Semester Details' },
            { path: 'ExamTicket', loadChildren: () => import('./Views/Student/exam-ticket/exam-ticket.module').then(m => m.ExamTicketModule), title: 'Exam Ticket' },
            { path: 'studentexamination', loadChildren: () => import('./Views/PreExam/pre-exam-student-examination/pre-exam-student-examination.module').then(m => m.PreExamStudentExaminationModule), title: 'Pre Exam Student Examination' },
            { path: 'preexamstudent', loadChildren: () => import('./Views/PreExam/pre-exam-student/pre-exam-student.module').then(m => m.PreExamStudentModule), title: 'Pre Exam Student Examination' },
            { path: 'preexamstudent/:id', loadChildren: () => import('./Views/reports/pre-exam-student-reoprt/pre-exam-student-reoprt.module').then(m => m.PreExamStudentReportModule), title: 'Pre Exam Student Examination' },
            { path: 'preexamstudent/:id/:instituteId', loadChildren: () => import('./Views/reports/pre-exam-student-reoprt/pre-exam-student-reoprt.module').then(m => m.PreExamStudentReportModule), title: 'Pre Exam Student Examination' },
            { path: 'studentenrollment', loadChildren: () => import('./Views/studentenrollment/student-enrollment.module').then(m => m.StudentEnrollmentModule), title: 'Student Enrollment' },
            { path: 'studentenrollmentadmitted', loadChildren: () => import('./Views/student-enrollment-admitted/student-enrollment-admitted.module').then(m => m.StudentEnrollmentAdmittedModule), title: 'Student Enrollment' },
            { path: 'ItiStudentEnrollment', loadChildren: () => import('./Views/ITI/Examination/iti-student-enrollment/iti-student-enrollment.module').then(m => m.ItiStudentEnrollmentModule), title: 'Student Enrollment' },
            { path: 'studentenrollment/:id', loadChildren: () => import('./Views/reports/studentenrollmentreport/student-enrollment-report.module').then(m => m.StudentEnrollmentReportModule), title: 'ITI Student Enrollment' },
            { path: 'studentenrollment/:id', loadChildren: () => import('./Views/reports/studentenrollmentreport/student-enrollment-report.module').then(m => m.StudentEnrollmentReportModule), title: 'Student Enrollment' },
            { path: 'studentenrollment/:id/:instituteId', loadChildren: () => import('./Views/reports/studentenrollmentreport/student-enrollment-report.module').then(m => m.StudentEnrollmentReportModule), title: 'Student Enrollment' },
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

          { path: 'attendance-time-table', loadChildren: () => import('./Views/BTER/attendance-time-table/attendance-time-table.module').then(m => m.AttendanceTimeTableModule), title: 'Student-Enrollment' },
          { path: 'student-attendance/:streamId/:semesterId/:subjectId/:sectionId', loadChildren: () => import('./Views/BTER/attendance-time-table/student-attendance/student-attendance.module').then(m => m.StudentAttendanceModule), title: 'Student-Enrollment' },
          { path: 'student-attendance', loadChildren: () => import('./Views/BTER/attendance-time-table/student-attendance/student-attendance.module').then(m => m.StudentAttendanceModule), title: 'Student-Enrollment' },
          { path: 'branch-wise-hod', loadChildren: () => import('./Views/BTER/attendance-time-table/branch-wise-hod/branch-wise-hod.module').then(m => m.BranchWiseHodModule), title: 'Add Group Code' },
          { path: 'branch-section-create', loadChildren: () => import('./Views/BTER/attendance-time-table/branch-section-create/branch-section-create.module').then(m => m.BranchSectionCreateModule), title: 'Add Group Code' },


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
            { path: 'StudentJanAadharDetail/:depid', loadChildren: () => import('./Views/Polytechnic/student-jan-aadhar-detail/student-jan-aadhar-detail.module').then(m => m.StudentJanAadharDetailModule), title: 'Student JanAadhaar Detail' },

            { path: 'groupcodeallocation', loadChildren: () => import('./Views/groupcode-allocation/groupcode-allocation.module').then(m => m.GroupcodeAllocationModule), title: 'Group Code Allocation' },
            { path: 'groupcodeadd', loadChildren: () => import('./Views/groupcode-allocation/add-groupcode/add-groupcode.module').then(m => m.GroupcodeAddModule), title: 'Add Group Code' },


            { path: 'ititrade', loadChildren: () => import('./Views/ITI/ITI-Trade/add-iti-trade/add-iti-trade.module').then(m => m.AddItiTradeModule), title: 'ITI Trade' },
            { path: 'ititradelist', loadChildren: () => import('./Views/ITI/ITI-Trade/list-iti-trade/list-iti-trade.module').then(m => m.ListItiTradeModule), title: 'ITI Trade List' },
            { path: 'ititradeUpdate/:id', loadChildren: () => import('./Views/ITI/ITI-Trade/add-iti-trade/add-iti-trade.module').then(m => m.AddItiTradeModule), title: 'ITI Trade Update' },
            { path: 'ITICollegeMaster', loadChildren: () => import('./Views/ITI/ITIs/itis/itis.module').then(m => m.ITIsModule), title: 'ITI College Master' },
            { path: 'additi', loadChildren: () => import('./Views/ITI/ITIs/add-itis/add-itis.module').then(m => m.AddITIsModule), title: 'Add ITI' },

            { path: 'AdminDashboardITI', loadChildren: () => import('./Views/ITI/admin-dashboard-iti/admin-dashboard-iti.module').then(m => m.AdminDashboardITIModule), title: 'Admin Dashboard ITI' },
            { path: 'SeatIntakesList', loadChildren: () => import('./Views/ITI/Intakes/seat-intakes-list/seat-intakes-list.module').then(m => m.SeatIntakesListModule), title: 'Seat Intakes List' },
            { path: 'AddSeatIntakes', loadChildren: () => import('./Views/ITI/Intakes/add-seat-intakes/add-seat-intakes.module').then(m => m.AddSeatIntakesModule), title: 'Add Seat Intakes' },
            { path: 'AddSeatsDistributions', loadChildren: () => import('./Views/ITI/Seats-Distributions/add-seats-distributions/add-seats-distributions.module').then(m => m.AddSeatsDistributionsModule), title: 'Add Seats Distributions' },
            { path: 'SeatsDistributionsList', loadChildren: () => import('./Views/ITI/Seats-Distributions/seats-distributions-list/seats-distributions-list.module').then(m => m.SeatsDistributionsListModule), title: 'Seats Distributions List' },
            { path: 'ImportantLinksList', loadChildren: () => import('./Views/ITI/Important-Links/important-links-list/important-links-list.module').then(m => m.ImportantLinksListModule), title: 'Important Links List' },
            { path: 'AddImportantLinks', loadChildren: () => import('./Views/ITI/Important-Links/add-important-links/add-important-links.module').then(m => m.AddImportantLinksModule), title: 'Add Important Links' },
            { path: 'TspAreasList', loadChildren: () => import('./Views/ITI/Tsp-Areas/tsp-areas-list/tsp-areas-list.module').then(m => m.TspAreasListModule), title: 'TSP Areas List' },
            { path: 'AddTspAreas', loadChildren: () => import('./Views/ITI/Tsp-Areas/add-tsp-areas/add-tsp-areas.module').then(m => m.AddTspAreasModule), title: 'Add TSP Areas' },

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

            { path: 'documentationscrutiny', loadChildren: () => import('./Views/Polytechnic/documentation-scrutiny/documentation-scrutiny.module').then(m => m.DocumentationScrutinyModule), title: 'Documentation Scrutiny' },
            { path: 'StudentVerificationList', loadChildren: () => import('./Views/Polytechnic/student-verification-list/student-verification-list.module').then(m => m.StudentVerificationListModule), title: 'Student Verification List' },
            { path: 'NodalDashboardITI', loadChildren: () => import('./Views/ITI/nodal-dashboard-iti/nodal-dashboard-iti.module').then(m => m.NodalDashboardITIModule), title: 'Nodal Dashboard ITI' },

            { path: 'citizensuggestion', loadChildren: () => import('./Views/Citizen-Suggestion/citizen-suggestion/citizen-suggestion.module').then(m => m.CitizenSuggestionModule), title: 'Citizen Suggestion' },
            { path: 'citizenQueryDetails', loadChildren: () => import('./Views/Citizen-Suggestion/citizenquery-details/citizenquery-details.module').then(m => m.CitizenqueryDetailsModule), title: 'Citizen Query Details' },
            { path: 'dtedashboard', loadChildren: () => import('./Views/dte-dashboard/dte-dashboard.module').then(m => m.DTEDashboardModule), title: 'DTE Dashboard' },
            // { path: 'dte/:url', loadChildren: () => import('./Views/reports/dte-reports/dte-reports.module').then(m => m.DteReportsModule), title: 'DTE Reports' },
            { path: 'emitraapplicationstatus', loadChildren: () => import('./Views/Student/emitra-application-status/emitra-application-status.module').then(m => m.EmitraApplicationStatusModule), title: 'Emitra Application Status' },
            { path: 'MigrationCertificate', loadChildren: () => import('./Views/result/Certificate/download-migration-certificate/download-migration-certificate.module').then(m => m.DownloadMigrationCertificateModule), title: 'Migration Certificate' },
            { path: 'DownloadMarksheet', loadChildren: () => import('./Views/result/marksheet-download/marksheet-download.module').then(m => m.MarksheetDownloadModule), title: 'Download Marksheet' },
            { path: 'MarksheetLetter', loadChildren: () => import('./Views/result/Marksheet/marksheet-letter/marksheet-letter.module').then(m => m.MarksheetLetterModule), title: 'Marksheet Letter' },
            { path: 'CertificateLetter', loadChildren: () => import('./Views/result/Certificate/certificate-letter/certificate-letter.module').then(m => m.CertificateLetterModule), title: 'Certificate Letter' },
            { path: 'DiplomaLetter', loadChildren: () => import('./Views/result/Certificate/diploma-letter/diploma-letter.module').then(m => m.DiplomaLetterModule), title: 'Diploma Letter' },
            { path: 'ApplicationList', loadChildren: () => import('./Views/StudentApplication/application-list/application-list.module').then(m => m.ApplicationListModule), title: 'Application List' },
            //{ path: 'applicationstatus', loadChildren: () => import('./Views/Student/emitra-application-status/emitra-application-status.module').then(m => m.EmitraApplicationStatusModule) },
            { path: 'MigrationCertificate', loadChildren: () => import('./Views/result/Certificate/download-migration-certificate/download-migration-certificate.module').then(m => m.DownloadMigrationCertificateModule), title: 'Download Migration Certificate' },
            { path: 'ProvisionalCertificate', loadChildren: () => import('./Views/result/Certificate/download-provisional-certificate/download-provisional-certificate.module').then(m => m.DownloadProvisionalCertificateModule), title: 'Migration Certificate' },
            { path: 'studentplacementconsent', loadChildren: () => import('./Views/Student/student-placement-consent/student-placement-consent.module').then(m => m.StudentPlacementConsentModule), title: 'Student Placement Consent' },

            { path: 'Revaluation', loadChildren: () => import('./Views/revaluation/revaluation.module').then(m => m.RevaluationModule), title: 'Revaluation' },
            { path: 'DocumentSetting', loadChildren: () => import('./Views/result/document-setting/document-setting.module').then(m => m.DocumentSettingModule), title: 'Document Setting' },
            { path: 'AddDocumentSetting', loadChildren: () => import('./Views/result/add-document-setting/add-document-setting.module').then(m => m.AddDocumentSettingModule), title: 'Add Document Setting' },
            { path: 'upcomingcampus', loadChildren: () => import('./Views/Student/upcoming-campus/upcoming-campus.module').then(m => m.UpcomingCampusModule), title: 'Upcoming Campus' },
            { path: 'MarksheetIssueDate', loadChildren: () => import('./Views/result/Marksheet/marksheet-issue-date/marksheet-issue-date.module').then(m => m.MarksheetIssueDateModule), title: 'Marksheet Issue Date' },

            { path: 'ApplicationPaymentStatus', loadChildren: () => import('./Views/application-payment-status/application-payment-status.module').then(m => m.ApplicationPaymentStatusModule), title: 'Application Payment Status' },
            { path: 'firstyearadmission', loadChildren: () => import('./Views/Emitra/first-year-admission/first-year-admission.module').then(m => m.FirstYearAdmissionModule), title: 'First Year Admission' },
            { path: 'emitradashboard', loadChildren: () => import('./Views/Emitra/emitra-dashboard/emitra-dashboard.module').then(m => m.EmitraDashboardModule), title: 'Emitra Dashboard' },
            { path: 'lateralentry', loadChildren: () => import('./Views/Emitra/lateral-entry/lateral-entry.module').then(m => m.LateralEntryModule), title: 'Lateral Entry' },
            { path: 'knowmenu', loadChildren: () => import('./Views/Emitra/know-menu/know-menu.module').then(m => m.KnowMenuModule), title: 'Know Menu' },
            { path: 'applynow', loadChildren: () => import('./Views/Emitra/apply-now/apply-now.module').then(m => m.ApplyNowModule), title: 'Apply Now' },
            { path: 'knowmerit', loadChildren: () => import('./Views/Emitra/know-merit/know-merit.module').then(m => m.KnowMeritModule), title: 'Know Merit' },
            { path: 'UserResponse', loadChildren: () => import('./Views/user-request/user-response/user-response.module').then(m => m.UserResponseModule) },

            { path: 'principledashreport/:url', loadChildren: () => import('./Views/Reports/principle-dashboard-reports/principle-dashboard-reports.module').then(m => m.PrincipleDashboardReportsModule) },
            { path: 'collegewisereports', loadChildren: () => import('./Views/Reports/college-wise-reports/college-wise-reports.module').then(m => m.CollegeWiseReportsModule) },
            { path: 'CollegeWiseExaminationRpt', loadChildren: () => import('./Views/Reports/college-wise-examination-rpt/college-wise-examination-rpt.module').then(m => m.CollegeWiseExaminationRptModule) },
            { path: 'college-nodal/:url', loadChildren: () => import('./Views/Reports/college-nodal-reports/college-nodal-reports.module').then(m => m.CollegeNodalReportsModule) },

            { path: 'itimerit8th/:id', loadChildren: () => import('./Views/ITI/ItiMerit/iti-merit/iti-merit.module').then(m => m.ItiMeritModule), title: 'ITI Merit' },
            { path: 'itimerit10th/:id', loadChildren: () => import('./Views/ITI/ItiMerit/iti-merit/iti-merit.module').then(m => m.ItiMeritModule), title: 'ITI Merit' },

            { path: 'promotedstudent', loadChildren: () => import('./Views/PreExam/promoted-student/promoted-student.module').then(m => m.PromotedStudentModule), title: 'Promoted Student' },

            // { path: 'btermerit', loadChildren: () => import('./Views/BterMerit/bter-merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
          { path: 'upwardmoment', loadChildren: () => import('./Views/Emitra/upward-moment/upward-moment.module').then(m => m.UpwardMomentModule), title: 'Upward Movement' },

            { path: 'StudentFeesTransactionHistoryRpt', loadChildren: () => import('./Views/Reports/student-fees-transaction-history-rpt/student-fees-transaction-history-rpt.module').then(m => m.StudentFeesTransactionHistoryRptModule), title: 'Student Fees Transaction History Report' },
            { path: 'ITIStudentFeesTransactionHistoryRpt', loadChildren: () => import('./Views/ITI/itistudent-fees-transaction-history/itistudent-fees-transaction-history.module').then(m => m.ITIStudentFeesTransactionHistoryModule), title: 'ITI Student Fees Transaction History Report' },
            { path: 'AdminUser', loadChildren: () => import('./Views/BTER/admin-user/admin-user.module').then(m => m.AdminUserModule), title: 'Admin User' },
            { path: 'ITIAdminUser', loadChildren: () => import('./Views/ITI/itiadmin-user/itiadmin-user.module').then(m => m.ITIAdminUserModule), title: 'ITI Admin User' },
            { path: 'master-configuration', loadChildren: () => import('./Views/master-configuration/master-configuration.module').then(m => m.MasterConfigurationModule), title: 'Master Configuration' },
            { path: 'RevaluationTab', loadChildren: () => import('./Views/Student/revaluation-tab/revaluation-tab.module').then(m => m.RevaluationTabModule) },
            { path: 'ReservationRoster', loadChildren: () => import('./Views/reservation-roster/reservation-roster.module').then(m => m.ReservationRosterModule) },
            { path: 'ITIAllotment', loadChildren: () => import('./Views/ITI/itiallotment/itiallotment.module').then(m => m.ITIAllotmentModule) },
            { path: 'StudentExaminationITI', loadChildren: () => import('./Views/ITI/Examination/student-examination-iti/student-examination-iti.module').then(m => m.StudentExaminationITIModule) },
            { path: 'GenerateRollnumberITI', loadChildren: () => import('./Views/ITI/Examination/generate-rollnumber-iti/generate-rollnumber-iti.module').then(m => m.GenerateRollnumberITIModule) },
            { path: 'CenterCreateITI', loadChildren: () => import('./Views/ITI/Examination/center-create-iti/center-create-iti.module').then(m => m.CenterCreateITIModule) },
            { path: 'AddCenterITI', loadChildren: () => import('./Views/ITI/Examination/add-center-iti/add-center-iti.module').then(m => m.AddCenterITIModule) },

            { path: 'StudentsJoiningStatusMarks8th/:id', loadChildren: () => import('./Views/ITI/students-joining-status-marks/students-joining-status-marks.module').then(m => m.StudentsJoiningStatusMarksModule) },

            { path: 'StudentsJoiningStatusMarks10th/:id', loadChildren: () => import('./Views/ITI/students-joining-status-marks/students-joining-status-marks.module').then(m => m.StudentsJoiningStatusMarksModule) },



            { path: 'Verifierdashboard', loadChildren: () => import('./Views/verifier-dashboard/verifier-dashboard.module').then(m => m.VerifierDashboardModule), title: 'verifier Dashboard' },
            { path: 'EnrollmentList', loadChildren: () => import('./Views/enrollment-list/enrollment-list.module').then(m => m.EnrollmentListModule), title: 'Enrollment List' },

            { path: 'ITIIMCAllocationList8th/:id', loadChildren: () => import('./Views/ITI/IMC-Allocation/imc-allocation-list/imc-allocation-list.module').then(m => m.IMCAllocationListModule) },

            { path: 'ITIIMCAllocationList10th/:id', loadChildren: () => import('./Views/ITI/IMC-Allocation/imc-allocation-list/imc-allocation-list.module').then(m => m.IMCAllocationListModule) },


            { path: 'ITIIMCVerifyStudentPhone/:id', loadChildren: () => import('./Views/ITI/IMC-Allocation/verify-student-phone/verify-student-phone.module').then(m => m.VerifyStudentPhoneModule) },

            { path: 'ItiStudentEnrollment/:id', loadChildren: () => import('./Views/ITI/iti-student-enrollment-reports/iti-student-enrollment-reports.module').then(m => m.ItiStudentEnrollmentReportsModule), title: 'ITI Examiner' },
            { path: 'ItiStudentExam/:id', loadChildren: () => import('./Views/ITI/iti-student-exam-reports/iti-student-exam-reports.module').then(m => m.ItiStudentExamReportsModule), title: 'ITI Examiner' },
            { path: 'ITIExaminer', loadChildren: () => import('./Views/ITI/iti-examiner/iti-examiner.module').then(m => m.ItiExaminerModule), title: 'ITI Examiner' },
            { path: 'ITIExaminerList', loadChildren: () => import('./Views/ITI/iti-examiner-list/iti-examiner-list.module').then(m => m.ItiExaminerListModule), title: 'ITI Examiner Listing' },
            { path: 'iti-paper-upload', loadChildren: () => import('./Views/ITI/iti-paper-upload/iti-paper-upload.module').then(m => m.ItiPaperUploadModule), title: 'ITI Paper Upload' },

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


            { path: 'Itisca', loadChildren: () => import('./Views/ITI/Examination/student-center-activity/student-center-activity.module').then(m => m.StudentCenterActivityModule) },
            { path: 'Ititheorymarks', loadChildren: () => import('./Views/ITI/Examination/theory-marks-iti/theory-marks-iti.module').then(m => m.TheoryMarksItiModule) },
            { path: 'TeacherDashboardITI', loadChildren: () => import('./Views/ITI/iti-teacher-dashboard/iti-teacher-dashboard.module').then(m => m.ITITeacherDashboardModule) },
            { path: 'AddITITimeTable', loadChildren: () => import('./Views/ITI/ITITimeTable/add-ititime-table/add-ititime-table.module').then(m => m.AddITITimeTableModule) },
            { path: 'ItiTimeTable', loadChildren: () => import('./Views/ITI/ITITimeTable/ititime-table/ititime-table.module').then(m => m.ITITimeTableModule), title: "ITI TimeTable" },
            //{ path: 'ItiResult/:url', loadChildren: () => import('./Views/ITI/results/iti-result/iti-result.module').then(m => m.ItiResultModule), title: "ITI Result" },
            { path: 'result/:url', loadChildren: () => import('./Views/result/result/result.module').then(m => m.ResultModule), title: "Result" },
            { path: 'result', loadChildren: () => import('./Views/result/result/result.module').then(m => m.ResultModule), title: "Result" },


            { path: 'ITIInternalSliding8th/:id', loadChildren: () => import('./Views/ITI/StudentInternalSliding/internal-sliding/internal-sliding.module').then(m => m.InternalSlidingModule) },
            { path: 'ITIInternalSliding10th/:id', loadChildren: () => import('./Views/ITI/StudentInternalSliding/internal-sliding/internal-sliding.module').then(m => m.InternalSlidingModule) },

            { path: 'bterinternalslidingEng/:id', loadChildren: () => import('./Views/BTER-InternalSliding/bter-internal-sliding/bter-internal-sliding.module').then(m => m.BterInternalSlidingModule), title: 'Internal Sliding' },
            { path: 'bterinternalslidingNonEng/:id', loadChildren: () => import('./Views/BTER-InternalSliding/bter-internal-sliding/bter-internal-sliding.module').then(m => m.BterInternalSlidingModule), title: 'Internal Sliding' },
            { path: 'bterinternalslidingLateral/:id', loadChildren: () => import('./Views/BTER-InternalSliding/bter-internal-sliding/bter-internal-sliding.module').then(m => m.BterInternalSlidingModule), title: 'Internal Sliding' },

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


            { path: 'StudentJoinStatus/:id', loadChildren: () => import('./Views/student-join-status/student-join-status.module').then(m => m.StudentJoinStatusModule) },
            { path: 'Bterallotmentreporting', loadChildren: () => import('./Views/bter-allotment-reporting/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },

            { path: 'BTERSeatMatrix', loadChildren: () => import('./Views/BTER/itiseat-matrix/itiseat-matrix.module').then(m => m.ITISeatMatrixModule) },
            { path: 'BterReports', loadChildren: () => import('./Views/Reports/bter-reports/bter-reports.module').then(m => m.BterReportsModule) },

            { path: 'BTERAddSeatMetrixENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
            { path: 'BTERSeatMetrixENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Seat Metrix' },

            { path: 'BTERAddSeatMetrixNonENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
            { path: 'BTERSeatMetrixNonENG/:id', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Seat Metrix' },

            { path: 'BTERAddSeatMetrixLit/:id', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
            { path: 'BTERSeatMetrixLit/:id', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.BTERSeatMetrixListModule), title: 'Seat Metrix' },


            { path: 'ITICollegeTrade8th/:id', loadChildren: () => import('./Views/ITI/iti-collage-trade/iti-collage-trade.module').then(m => m.ITICollageTradeModule) },
            { path: 'ITICollegeTrade10th/:id', loadChildren: () => import('./Views/ITI/iti-collage-trade/iti-collage-trade.module').then(m => m.ITICollageTradeModule) },

            { path: 'BTERSeatIntakesList', loadChildren: () => import('./Views/BTER/Intakes/seat-intakes-list/seat-intakes-list.module').then(m => m.SeatIntakesListModule), title: 'Seat Intakes List' },
            { path: 'BTERAddSeatIntakes', loadChildren: () => import('./Views/BTER/Intakes/add-seat-intakes/add-seat-intakes.module').then(m => m.AddSeatIntakesModule), title: 'Add Seat Intakes' },
            { path: 'Bridgecourse', loadChildren: () => import('./Views/bridge-course/bridge-course.module').then(m => m.BridgeCourseModule) },


           
            { path: 'BTERAddSeatMetrix', loadChildren: () => import('./Views/BTER/seat-metrix/add-seat-metrix/add-seat-metrix.module').then(m => m.AddSeatMetrixModule), title: 'Add Seat Metrix' },
            /*      { path: 'BTERSeatMetrix', loadChildren: () => import('./Views/BTER/seat-metrix/list-seat-metrix/list-seat-metrix.module').then(m => m.ListSeatMetrixModule), title: 'Seat Metrix' },*/
            { path: 'IMCManagementAllotment', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment/imc-management-allotment.module').then(m => m.IMCManagementAllotmentModule) },
            { path: 'IMCManagementAllotmentVerify/:id', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment-verify/imc-management-allotment-verify.module').then(m => m.IMCManagementAllotmentVerifyModule) },


            { path: 'ITIAllotment8th/:id', loadChildren: () => import('./Views/ITI/itiallotment/itiallotment.module').then(m => m.ITIAllotmentModule) },
            { path: 'ITIAllotment10th/:id', loadChildren: () => import('./Views/ITI/itiallotment/itiallotment.module').then(m => m.ITIAllotmentModule) },

            { path: 'btermeritENG/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
            { path: 'btermeritNonENG/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },
            { path: 'btermeritLateral/:id', loadChildren: () => import('./Views/BTER/merit/bter-merit.module').then(m => m.BterMeritModule), title: 'BTER Merit' },


            { path: 'BTERSeatAllotmentENG/:id', loadChildren: () => import('./Views/BTER/allotment/allotment.module').then(m => m.AllotmentModule) },
            { path: 'BTERSeatAllotmentNonENG/:id', loadChildren: () => import('./Views/BTER/allotment/allotment.module').then(m => m.AllotmentModule) },
            { path: 'BTERSeatAllotmentLateral/:id', loadChildren: () => import('./Views/BTER/allotment/allotment.module').then(m => m.AllotmentModule) },



            { path: 'IMCManagementAllotment', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment/imc-management-allotment.module').then(m => m.IMCManagementAllotmentModule), title: 'IMC Management Allotment' },
            { path: 'IMCManagementAllotmentVerify/:id', loadChildren: () => import('./Views/BTER/IMC-Allocation-BTER/imc-management-allotment-verify/imc-management-allotment-verify.module').then(m => m.IMCManagementAllotmentVerifyModule), title: 'IMC Allotment Verify ' },


            { path: 'StudentJoinStatusENG/:id', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
            { path: 'StudentJoinStatusENG/:id/:status', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
            { path: 'StudentJoinStatusNonENG/:id', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },
            { path: 'StudentJoinStatusLateral/:id', loadChildren: () => import('./Views/BTER/Join/list/student-join-status.module').then(m => m.StudentJoinStatusModule) },


            { path: 'BterallotmentreportingENG/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },
            { path: 'BterallotmentreportingNonENG/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },
            { path: 'BterallotmentreportingLateral/:id', loadChildren: () => import('./Views/BTER/Join/change-status/bter-allotment-reporting.module').then(m => m.BterAllotmentReportingModule) },

            { path: 'StudentRequestList', loadChildren: () => import('./Views/Hostel-Management/student-request-list/student-request-list.module').then(m => m.StudentRequestListModule) },
            { path: 'RoomAvailabilties', loadChildren: () => import('./Views/Hostel-Management/room-availabilties/room-availabilties.module').then(m => m.RoomAvailabiltiesModule) },
            { path: 'RoomAllotment', loadChildren: () => import('./Views/Hostel-Management/room-allotment/room-allotment.module').then(m => m.RoomAllotmentModule) },
            { path: 'HostelReports', loadChildren: () => import('./Views/Hostel-Management/hostel-reports/hostel-reports.module').then(m => m.HostelReportsModule) },
            { path: 'HostelDashboard', loadChildren: () => import('./Views/Hostel-Management/hostel-dashboard/hostel-dashboard.module').then(m => m.HostelDashboardModule) },

            { path: 'ApplyForHostel', loadChildren: () => import('./Views/Student/apply-for-hostel/apply-for-hostel.module').then(m => m.ApplyForHostelModule) },
            { path: 'CreateHostel1', loadChildren: () => import('./Views/Hostel-Management/create-hostel/create-hostel.module').then(m => m.CreateHostelModule), title: 'Create Hostel' },
            { path: 'RoomSeatMaster', loadChildren: () => import('./Views/Hostel-Management/room-seat-master/room-seat-master.module').then(m => m.RoomSeatMasterModule), title: 'Room Seat Master' },
            { path: 'HostelFacility', loadChildren: () => import('./Views/Hostel-Management/facilities/facilities.module').then(m => m.FacilitiesModule), title: 'Hostel Facility' },
            { path: 'CollegeHostelDetails', loadChildren: () => import('./Views/Student/college-hostel-details/college-hostel-details.module').then(m => m.CollegeHostelDetailsModule), title: 'College Hostel Details' },

            { path: 'HostelRoomDetails', loadChildren: () => import('./Views/Hostel-Management/hostel-room-details/hostel-room-details.module').then(m => m.HostelRoomDetailsModule) },
            { path: 'HostelRoomDetails/:id', loadChildren: () => import('./Views/Hostel-Management/hostel-room-details/hostel-room-details.module').then(m => m.HostelRoomDetailsModule) },
          { path: 'AddStudent', loadChildren: () => import('./Views/Student/add-student/add-student.module').then(m => m.AddStudentModule) },
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
          { path: 'iti-request-equipments-mapping/:id/:category/:equipment/:quantity', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-add-request-labeling-equipments/iti-add-request-labeling-equipments.module').then(m => m.ITIAddRequestLabelingEquipmentsModule) },
          { path: 'iti-stocks', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-stocks-items-list/iti-stocks-items-list.module').then(m => m.ITIStocksItemsListModule) },
          { path: 'iti-add-issued-items', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-add-issued-items/iti-add-issued-items.module').then(m => m.ITIAddIssuedItemsModule) },
          { path: 'iti-add-issued-items/:id', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-add-issued-items/iti-add-issued-items.module').then(m => m.ITIAddIssuedItemsModule) },
          { path: 'iti-issued-items', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-issued-items-list/iti-issued-items-list.module').then(m => m.ITIIssuedItemsListModule) },
          { path: 'iti-return-items', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-Issued-return-items/iti-return-items-list/iti-return-items-list.module').then(m => m.ITIReturnItemsListModule) },
          { path: 'iti-inventory-dashboard', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-inventory-management-dashboard/iti-inventory-management-dashboard.module').then(m => m.ITIInventoryManagementDashboardModule) },
          { path: 'iti-edit-item-master', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-items-master/iti-edit-item-master/iti-edit-item-master.module').then(m => m.ITIEditeItemMasterModule) },
          { path: 'iti-add-request-equipments', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-add-request-equipments-mapping/iti-add-request-equipments-mapping.module').then(m => m.ITIAddRequestEquipmentsMappingModule) },
          { path: 'HOD-DTEEquipmentVerifications', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-equipments-mapping/iti-equipment-verifications-mapping-list/iti-equipment-verifications-mapping-list.module').then(m => m.ITIEquipmentVerificationsMappingListModule) },
          { path: 'Auction-List', loadChildren: () => import('./Views/ITI/ITI-Inventory-Management/iti-auction-list/iti-auction-list.module').then(m => m.ITIAuctionListModule) },

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
        ]
    },
    {
        //root
        path: '', component: AuthLayoutComponent,
        children: [
            { path: 'login', loadChildren: () => import('./Views/login/login.module').then(m => m.LoginModule), title: 'Login' },
            {
                path: 'ssologin', loadChildren: () => import('./Views/ssologin/ssologin.module').then(m => m.SSOLoginModule), title: 'SSO Login'
            },
            {
                path: 'ssologin/:id1', loadChildren: () => import('./Views/ssologin/ssologin.module').then(m => m.SSOLoginModule), title: 'SSO Login'
            },
            { path: 'PaymentStatus', loadChildren: () => import('./Views/Student/payment-status/payment-status.module').then(m => m.PaymentStatusModule), title: 'Payment Status' },


            { path: 'ApplicationPaymentStatus', loadChildren: () => import('./Views/application-payment-status/application-payment-status.module').then(m => m.ApplicationPaymentStatusModule), title: 'Application Payment Status' },
            { path: 'Views/Student/RevaluationStudentSearch', loadChildren: () => import('./Views/Student/revaluation-student-search/revaluation-student-search.module').then(m => m.RevaluationStudentSearchModule), title: 'Revaluation Student Search' },
            { path: 'Views/Student/RevaluationStudentVerify', loadChildren: () => import('./Views/Student/revaluation-student-verify/revaluation-student-verify.module').then(m => m.RevaluationStudentVerifyModule), title: 'Revaluation Student Verify' },
            { path: 'Views/Student/RevaluationStudentMakePayment', loadChildren: () => import('./Views/Student/revaluation-student-make-payment/revaluation-student-make-payment.module').then(m => m.RevaluationStudentMakePaymentModule), title: 'Revaluation Student Make Payment' },

            { path: 'ApplicationPaymentStatus', loadChildren: () => import('./Views/application-payment-status/application-payment-status.module').then(m => m.ApplicationPaymentStatusModule), title: 'Application Payment Status' },
           // { path: 'AllotmentStatus', loadChildren: () => import('./Views/BTER/bter-allotment-status/bter-allotment-status.module').then(m => m.BTERAllotmentStatusModule) },
        ]
    },

    { path: 'StudentEmitraITIFeePayment', loadChildren: () => import('./Views/Student/student-emitra-iti-fee-payment/student-emitra-iti-fee-payment.module').then(m => m.StudentEmitraITIFeePaymentModule), title: '' },
    { path: 'Views\Emitra\FeePaidByChallan', loadChildren: () => import('./Views/Emitra/fee-paid-by-challan/fee-paid-by-challan.module').then(m => m.FeePaidByChallanModule) },




    { path: '**', loadComponent: () => import('./Views/errors/page-not-found/page-not-found.component').then(c => c.PageNotFoundComponent), title: '404 - Page not found' },
];
