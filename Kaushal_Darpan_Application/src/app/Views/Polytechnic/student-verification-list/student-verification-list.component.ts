import { Component, ElementRef, ViewChild } from '@angular/core';
import { StudentVerificationDataModel, StudentVerificationDocumentsDataModel, StudentVerificationSearchModel, VerificationDocumentDetailList } from '../../../Models/StudentVerificationDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { StudentVerificationListService } from '../../../Services/StudentVerificationList/student-verification-list.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumDepartment, EnumRole, EnumStatus, EnumVerificationAction, GlobalConstants, enumExamStudentStatus } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import { StudentStatusHistoryComponent } from '../../Student/student-status-history/student-status-history.component';
import { ViewApplicationComponent } from '../../BTER/application-view/application-view.component';
import { ItiApplicationSearchmodel } from '../../../Models/ItiApplicationPreviewDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { HttpClient } from '@angular/common/http';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';


@Component({
  selector: 'app-student-verification-list',
  templateUrl: './student-verification-list.component.html',
  styleUrls: ['./student-verification-list.component.css'],
  standalone: false
})
export class StudentVerificationListComponent
{
  public StudentList: StudentVerificationDataModel[] = [];
  public VerificationDocumentDetailList: VerificationDocumentDetailList[] = []
  public StudentDocumentList = new StudentVerificationDocumentsDataModel();
  public Table_SearchText: string = "";
  public DocumentStatusList: any = []
  public searchRequest = new StudentVerificationSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new StudentVerificationDataModel();
  public searchrequest = new ItiApplicationSearchmodel()
  public ApprovedStatus: string = "0";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public isSubmitted: boolean = false;
  encryptedRows: any[] = [];
  public State: number = 0;
  public AppID: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';

  public Status: number = 0
    @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;
    @ViewChild('ViewAppModal') childAppComponent!: ViewApplicationComponent;
  constructor(private commonMasterService: CommonFunctionService, private StudentVerificationListService: StudentVerificationListService,
    private toastr: ToastrService, private loaderService: LoaderService, private routers: Router, private reportService: ReportService, private http: HttpClient,
    private modalService: NgbModal, private Swal2: SweetAlert2, public appsettingConfig: AppsettingService, private encryptionService: EncryptionService, 
    private activeroute: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = Number(this.activeroute.snapshot.queryParamMap.get('status') ?? 0);
    if( this.Status != 1) {
      this.searchRequest.Status = this.Status
    }
    await this.GetAllStudentData();
    await this.GetMasterDDL();
  }
  async DownloadApplicationForm(ApplicationID: number, SSOID: string) {
    try {
      
      this.loaderService.requestStarted();
      this.searchrequest.DepartmentID = EnumDepartment.BTER;
      this.searchrequest.ApplicationID = ApplicationID
      this.searchrequest.ApplicationId = ApplicationID
      this.searchrequest.SSOID = SSOID;
      console.log("searchrequest", this.searchrequest)
      await this.reportService.GetApplicationFormPreview1(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
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
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  openViewApplicationPopup(ApplicationID: number, SSOID: string) {
    
    this.childAppComponent.ApplicationID = ApplicationID;
    this.childAppComponent.SSOID = SSOID;
    this.childAppComponent.OpenViewApplicationPopup();

  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }
  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

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

  async UserRequest(content: any, ApplicationID: number) {


    const initialState = {
      ApplicationID: ApplicationID,
      Type: "Admin",
    };
    this.request.ApplicationID = ApplicationID
    this.GetById();

    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    /*this.modalReference.componentInstance.initialState = initialState;*/

  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('DocumentScruitny')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DocumentStatusList = data['Data'];

          if(
            this.sSOLoginDataModel.RoleID == EnumRole.BTERVerifier || 
            this.sSOLoginDataModel.RoleID == EnumRole.BTERVerifierDegreeLateral ||
            this.sSOLoginDataModel.RoleID == EnumRole.BTERVerifierDegreeNonEngg ||
            this.sSOLoginDataModel.RoleID == EnumRole.BTERVerifierDiplomaLaterl ||
            this.sSOLoginDataModel.RoleID == EnumRole.BTERVerifierDiplomaNonENG 
          ) {
            this.DocumentStatusList = this.DocumentStatusList.filter((x: any) => x.ID == 1 || x.ID == 2 || x.ID == 3 || x.ID == 5 || x.ID == 6);
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

  async ViewHistory(row: any, ID: number) {
    //this.searchRequest.action = "_GetstudentWorkflowdetails";
    //this.GetAllDataActionWise();
    this.childComponent.OpenVerificationPopup(ID);
  }

  encryptParameter(param: any) {
    return this.encryptionService.encryptData(param);
  }


  async GetAllStudentData() {
    try {
      // if (this.Status == EnumVerificationAction.Applied || this.Status == 0) {
      //   this.searchRequest.action = 'getalldata'
      // } else if (this.Status == EnumVerificationAction.Approved) {
      //   this.searchRequest.action = 'getalldata'
      // } else if (this.Status == EnumVerificationAction.Revert) {
      //   this.searchRequest.action = 'getalldata'
      // } else if (this.Status == EnumVerificationAction.Reject) {
      //   this.searchRequest.action = 'getalldata'
      // } else if (this.Status == EnumVerificationAction.Deficiency_uploaded) {
      //   this.searchRequest.action = 'getalldata'
      // }
      // else if (this.Status == EnumVerificationAction.Changed) {
      //   this.searchRequest.action = 'getalldata'
      // }
      // else if (this.Status == EnumVerificationAction.Notified) {
      //   this.searchRequest.action = 'getalldata'
      // }

      // else {
      //   this.searchRequest.action = 'Pending'
      // }

      if(this.Status == 9) {
        this.searchRequest.action = 'Pending'
      } else {
        this.searchRequest.action = 'getalldata'
      }

      // this.searchRequest.action = 'getalldata'
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng

      this.loaderService.requestStarted();
      await this.StudentVerificationListService.GetAllStudentData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data",data)
        this.StudentList = data.Data;
        console.log(this.StudentList, "show")

        this.encryptedRows = this.StudentList.map(Stud => {
          return {
            ...Stud,  // Copy existing row data
            encryptedApplicationID: this.encryptParameter(Stud.ApplicationID)  // Add the encrypted ApplicationID
          };
        });

      }, (error: any) => console.error(error))
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

  async ClearSearchData() {
    this.searchRequest.StudentName = '';
    this.searchRequest.Status = 0

    await this.GetAllStudentData();
  }


  async GetById() {
    try {
      this.loaderService.requestStarted();
      console.log(this.request.ApplicationID, "show me")

      await this.StudentVerificationListService.GetById(this.request.ApplicationID)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StudentDocumentList = data.Data;
          console.log(this.StudentDocumentList, "documentList")
          console.log(this.VerificationDocumentDetailList, "documentList22222")

          this.request = data['Data'];
          this.request.StudentName = data['Data']['StudentName'];
          this.request.FatherName = data['Data']['FatherName'];
          this.request.MotherName = data['Data']["MotherName"];
          this.request.MobileNumber = data['Data']["MobileNo"];
          this.request.Email = data['Data']["Email"];
          console.log(this.request, "request");


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
  //async Onrouting(ApplicationID: number) {
  //  
  //  if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER) {
  //    //this.routers.navigate(['/documentationscrutiny'], {
  //    //  queryParams: { ApplicationID: ApplicationID }
        
  //    //});
  //    this.AppID = ApplicationID
  //    await this.routers.navigate(['/StudentJanAadharDetail'],
  //      { queryParams: { ApplicationID: this.encryptionService.encryptData(this.AppID) } }
  //    );


  //  } else {
  //    this.routers.navigate(['/ItiDocumentScrutiny'], {
  //      queryParams: { AppID: ApplicationID }
  //    });
  //  }
  //}

  async Onrouting(ApplicationID: number) {
    
    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER) {
      this.AppID = ApplicationID
      await this.routers.navigate(['/documentationscrutiny'],
        { queryParams: { ApplicationID: this.encryptionService.encryptData(this.AppID) } }
      );


    } else {
      this.routers.navigate(['/ItiDocumentScrutiny'], {
        queryParams: { AppID: ApplicationID }
      });
    }
  }
}
