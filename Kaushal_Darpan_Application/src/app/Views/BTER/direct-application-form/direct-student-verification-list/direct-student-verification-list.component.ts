import { Component, ElementRef, ViewChild } from '@angular/core';
import { StudentVerificationDataModel, StudentVerificationDocumentsDataModel, StudentVerificationSearchModel, VerificationDocumentDetailList } from '../../../../Models/StudentVerificationDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { StudentVerificationListService } from '../../../../Services/StudentVerificationList/student-verification-list.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumDepartment, EnumStatus, EnumVerificationAction, enumExamStudentStatus } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { StudentStatusHistoryComponent } from '../../../Student/student-status-history/student-status-history.component';


@Component({
  selector: 'app-direct-student-verification-list',
  templateUrl: './direct-student-verification-list.component.html',
  styleUrls: ['./direct-student-verification-list.component.css'],
  standalone: false
})
export class DirectStudentVerificationListComponent {
  public StudentList: StudentVerificationDataModel[] = [];
  public VerificationDocumentDetailList: VerificationDocumentDetailList[] = []
  public StudentDocumentList = new StudentVerificationDocumentsDataModel();
  public Table_SearchText: string = "";
  public DocumentStatusList: any = []
  public searchRequest = new StudentVerificationSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new StudentVerificationDataModel()
  public ApprovedStatus: string = "0";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public Status: number = 0
  @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;
  constructor(private commonMasterService: CommonFunctionService, private StudentVerificationListService: StudentVerificationListService,
    private toastr: ToastrService, private loaderService: LoaderService, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2, public appsettingConfig: AppsettingService, private activeroute: ActivatedRoute) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = Number(this.activeroute.snapshot.queryParamMap.get('status') ?? 0);

    await this.GetAllStudentData();
    await this.GetMasterDDL();
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


  async GetAllStudentData() {
    try {
      if (this.Status == EnumVerificationAction.Applied || this.Status == 0) {
        this.searchRequest.action = 'getalldata'
      } else if (this.Status == EnumVerificationAction.Approved) {
        this.searchRequest.action = 'Total_verified'
      } else if (this.Status == EnumVerificationAction.Revert) {
        this.searchRequest.action = 'Total_Revert'
      } else if (this.Status == EnumVerificationAction.Reject) {
        this.searchRequest.action = 'Total_Reject'
      } else if (this.Status == EnumVerificationAction.Deficiency_uploaded) {
        this.searchRequest.action = 'Deficiency_uploaded'
      }
      else if (this.Status == EnumVerificationAction.Changed) {
        this.searchRequest.action = 'Changed_List'
      }
      else if (this.Status == EnumVerificationAction.Notified) {
        this.searchRequest.action = 'Notified_List'
      }

      else {
        this.searchRequest.action = 'Pending'
      }


      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID

      this.loaderService.requestStarted();
      await this.StudentVerificationListService.GetAllStudentData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentList = data.Data;
        console.log(this.StudentList, "show")
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

    this.GetAllStudentData();
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
  async Onrouting(ApplicationID: number) {
    
    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER) {
      this.routers.navigate(['/documentationscrutiny'], {
        queryParams: { ApplicationID: ApplicationID }
      });
    } else {
      this.routers.navigate(['/ItiDocumentScrutiny'], {
        queryParams: { AppID: ApplicationID }
      });
    }
  }


}
