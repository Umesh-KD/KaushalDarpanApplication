import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
    private route: Router
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
          this.sSOLoginDataModel.StudentID = this.StudantCourseList[0]?.StudentID;
          this.sSOLoginDataModel.DepartmentID = this.StudantCourseList[0]?.DepartmentID;
          localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel))
          this.IsShowDashboard = true;
          //changes 
          await this.GetStudentDashboard();
          await this.GetProfileDashboard();
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
        await this.GetStudentDashboard();
        await this.GetProfileDashboard();
      }
    }
    //else {
    //  //Redirect To Emitra Application
    //  window.open('/emitradashboard', "_self");
    //}
    //await this.GetAllData();
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
    try {
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

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
  
  

}
