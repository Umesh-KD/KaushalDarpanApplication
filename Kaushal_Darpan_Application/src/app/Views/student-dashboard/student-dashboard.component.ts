import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StudentDashboardModel } from '../../Models/StudentDashboardModel';
import { StudentSearchModel } from '../../Models/StudentSearchModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { StudentService } from '../../Services/Student/student.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumDepartment, EnumRole, EnumStatus, EnumUserType, GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { StudentDetailsModel } from '../../Models/StudentDetailsModel';
import { EncryptionService } from '../../Services/EncryptionService/encryption-service.service';
import { MenuByUserAndRoleWiseModel } from '../../Models/MenuByUserAndRoleWiseModel';
import { MenuService } from '../../Services/Menu/menu.service';
import { MasterLayoutComponent } from '../Shared/master-layout/master-layout.component';
import { DownloadMarksheetSearchModel } from '../../Models/DownloadMarksheetDataModel';
import { ReportService } from '../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  standalone: false
})


export class StudentDashboardComponent implements OnInit {

  public _GlobalConstants: any = GlobalConstants;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new StudentSearchModel();
  public StudantDashboardList: StudentDashboardModel[] = [];

  public StudantCourseList: StudentDetailsModel[] = [];

  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  StudentRecentActivityList: any[] = [];
  StudentMarksheetList: any[] = [];
  public downloadReq = new DownloadMarksheetSearchModel();



  
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  @ViewChild('modal_StudetnCourseType') modal_GenrateOTP: any;
  constructor(
    private commonMasterService: CommonFunctionService,
    private studentService: StudentService,
    private toastr: ToastrService,
    private routers: Router,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private encryptionService: EncryptionService,
    private router: ActivatedRoute, 
    private modalService: NgbModal, 
    public appsettingConfig: AppsettingService, 
    private Swal2: SweetAlert2, 
    private route: Router,
    private menuService: MenuService,
    private parent: MasterLayoutComponent,
    private reportService: ReportService,  
    private http: HttpClient,
     
  ) { }
  
  async ngOnInit()
  {

    //this.Swal2.ConfirmationWithSelect("oops no record found, Kindly map sso to application", async (result: any) =>
    //{
    //  console.log(result);

    //  if (!result)
    //  {

    //  }

    //}, 'OK');
    //return;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel.UserType == EnumUserType.STUDENT || this.sSOLoginDataModel.UserType == EnumUserType.CITIZEN)
    {

      if (this.sSOLoginDataModel.StudentID == 0)
      {
        await this.GetStudentCourses();
        if (this.StudantCourseList?.length == 0)
        {
          this.Swal2.Confirmation("Click 'OK' to proceed with registering this SSO ID on the Kaushal Darpan portal.", async (result: any) => {
            //this.sSOLoginDataModel.DepartmentID = result;
            //session
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
            //window.open("/StudentSsoMapping", "_Self")
            this.route.navigateByUrl('/StudentSsoMapping');
          }, 'OK');
        }
        else if (this.StudantCourseList?.length == 1)
        {
          debugger
          this.sSOLoginDataModel.StudentID = this.StudantCourseList[0]?.StudentID;
          this.sSOLoginDataModel.DepartmentID = this.StudantCourseList[0]?.DepartmentID;
          localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
          this.IsShowDashboard = true;
          //changes
          await this.GetProfileDashboard();
          await this.GetStudentDashboard();

        
 
          this.route.navigateByUrl('/dashboard');
        //  window.open("/dashboard", "_Self")
        }
        else if (this.StudantCourseList?.length > 1)
        {
          this.openModalCource(this.modal_GenrateOTP);
        }
      }
      else
      {
        this.IsShowDashboard = true;
        await this.GetProfileDashboard();
        await this.GetStudentDashboard();
   
      }
    }


    //changes for menu not binding 
    this.parent.LoadMenuStudent(
      this.parent.sSOLoginDataModel.UserID,
      this.parent.sSOLoginDataModel.RoleID,
      this.sSOLoginDataModel.DepartmentID
    );

    this.parent.InstituteName = this.ProfileLists?.InstituteName;

    await this.GetStudentRecentActivity();
    await this.GetStudentMarksheetList();
  }


  async openModalCource(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async GetStudentCourses() {
    this.StudantCourseList = [];
    try {
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.action = "GetStudentCourseDetailsBySSOID";
      this.loaderService.requestStarted();
      await this.studentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudantCourseList = data['Data'];
            console.log(this.StudantCourseList + "Course LIST");
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStudentDashboard() {
    debugger
    this.StudantDashboardList = [];
    try {

      this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.studentService.GetStudentDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudantDashboardList = data['Data'];
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetProfileDashboard() {
    debugger
    try {
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;

      this.loaderService.requestStarted();
      await this.studentService.GetProfileDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {

            this.ProfileLists = data['Data'][0];
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  @ViewChild('content') content: ElementRef | any;

  async openModal(content: any) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  CloseModal() {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  SetStudentDepartment(item: any)
  {
    this.sSOLoginDataModel.StudentID = item.StudentID;
    this.sSOLoginDataModel.DepartmentID = item.DepartmentID;
    localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
    this.CloseModal();
    //window.open("/dashboard", "_Self")

    this.route.navigate(['/dashboard']);
    this.IsShowDashboard = true;
    this.GetStudentDashboard();
    this.GetProfileDashboard();
  }


  async Redirect(key:number) {
 

    if (key == EnumDepartment.BTER) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'], { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.BTER) } });
    } else if (key == EnumDepartment.ITI) {
      this.CloseModal()
      await this.route.navigate(['/StudentJanAadharDetail'], { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI) } });
    } else if (key == 4) {
      this.CloseModal()
      this.route.navigate(['/StudentJanAadharDetail'], { queryParams: { deptid: this.encryptionService.encryptData(EnumDepartment.ITI), isDirectAdmission: true } });
      
    }
  }


  async resetSSO() {

    this.Swal2.Confirmation(
      "Are you sure you want to unmap this SSO?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {

            this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
            this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
            this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
            this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;

            console.log('Reset Payload:', this.searchRequest);

            this.loaderService.requestStarted();

            await this.studentService.ResetStudentSsoMapping(this.searchRequest)
              .then((data: any) => {

                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {

                  this.toastr.success(data.Message || 'SSO Unmapped Successfully');

                  this.sSOLoginDataModel.StudentID = 0;

                  localStorage.setItem(
                    'SSOLoginUser',
                    JSON.stringify(this.sSOLoginDataModel)
                  );
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);

                  
                }
                else {

                  this.toastr.error(
                    data.ErrorMessage || 'Unable to unmap student'
                  );

                }

              }, (error: any) => {

                console.error(error);
                this.toastr.error('API Error');

              });

          }
          catch (ex) {

            console.log(ex);
            this.toastr.error('Something went wrong');

          }
          finally {

            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);

          }
        }
      },
      'Yes'
    );
  }

  async GetStudentRecentActivity() {
  try {

    const response: any = await this.studentService.GetStudentRecentActivity(this.sSOLoginDataModel.StudentID);
    if (response?.State === 1 || response?.State === 'Success') {
      this.StudentRecentActivityList = response.Data || [];
    } else {
      this.StudentRecentActivityList = [];
    }

  } catch (error) {
    console.error(error);
    this.StudentRecentActivityList = [];
  }
}
async GetStudentMarksheetList() {
  try {

    const response: any =
      await this.studentService.GetStudentMarksheetList(
        this.sSOLoginDataModel.StudentID
      );
    if (response?.State === 1 || response?.State === 'Success') {
      this.StudentMarksheetList = response.Data || [];
    } else {
      this.StudentMarksheetList = [];
    }

  } catch (error) {
    console.error(error);
    this.StudentMarksheetList = [];
  }
}

async DownloadMarksheet(row: any) {
    debugger
    //debugger
    try {
      this.downloadReq.DepartmentID = row.DepartmentID;
      this.downloadReq.Eng_NonEngID = row.Eng_NonEng;
      //this.downloadReq.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.downloadReq.EndTermID = row.EndTermID;
      
      this.downloadReq.StudentID = row.StudentID;
      this.downloadReq.SemesterID = row.SemesterID;
      this.downloadReq.ResultTypeID = row.ResultTypeID;
      this.downloadReq.IsRevised = row.IsRevised;
      this.downloadReq.IsReval = row.IsReval;
      console.log(JSON.stringify(this.downloadReq),'SearchRequestData')
      const requestArray = [this.downloadReq];
      this.loaderService.requestStarted();

      await this.reportService.DownloadMarksheet(this.downloadReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, row.RollNo);
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf', DownloadfileName); 
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string, name: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `Marksheet_${name}_${timestamp}.${extension}`;
  }
}
