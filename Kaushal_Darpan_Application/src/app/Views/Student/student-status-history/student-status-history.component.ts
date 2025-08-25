import { Component, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIAdminUserService } from '../../../Services/ITI/ITI-Admin-User/itiadmin-user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-student-status-history',  
  templateUrl: './student-status-history.component.html',
  styleUrl: './student-status-history.component.css',
  standalone: false
})
export class StudentStatusHistoryComponent {
  public CommonRemark:string=''
  public UserID: number = 0;
  public UserAdditionID: number = 0;
  public ProfileID: number = 0;
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsView: boolean = false;
  public State: number = 0;
  public Message: string = '';
  //public CreateDate: string = '';
  public ErrorMessage: string = '';
  public AdminUserFormGroup!: FormGroup;
  public AdminUserList: any = [];
  public isShowGrid: boolean = false;
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []
  public StudentHistoryModelList: any[] = []
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public searchRequest = new StudentSearchModel();
  @ViewChild('modal_StudentStatusHistory') modal_StudentStatusHistory: any;
  @ViewChild('modal_StudentVerificationHistory') modal_StudentVerificationHistory: any;
  @ViewChild('modal_StudentReverteDocument') modal_StudentReverteDocument: any;

  constructor(private commonMasterService: CommonFunctionService,
    private adminUserService: ITIAdminUserService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private toastr: ToastrService,
    private loaderService: LoaderService, private Swal2: SweetAlert2,
    private studentService: ApplicationStatusService,
    private appsettingConfig: AppsettingService
  ) {

  }

  async ngOnInit() {

  }


  OpenHistoryPopup()
  {
    this.ViewHistory(this.modal_StudentStatusHistory)
    this.GetAllDataActionWise();
  }
  async GetAllDataActionWise()
  {
    this.isShowGrid = true;
    this.searchRequest.action = "_GetstudentWorkflowdetails";
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.studentService.StudentApplicationStatus(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            this.searchRequest.CreateDate = data['Data']['CreateDate'];
            console.log(this.searchRequest.CreateDate, 'CreatedDate')
            console.log(this.StudentDetailsModelList, 'List')
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


  async ViewHistory(content: any) { 

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
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
  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  OpenVerificationPopup(ID:number) {
    this.ViewHistory(this.modal_StudentVerificationHistory)
    this.GetAllverificationData(ID);
  }


  async GetAllverificationData(ID:number) {
    this.isShowGrid = true;
    this.searchRequest.studentId =ID
    this.searchRequest.action = "GetVerificationWorkflowdetails";
    this.StudentHistoryModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.studentService.StudentApplicationStatus(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentHistoryModelList = data['Data'];
            this.CommonRemark = data['Data'][0]['CommonRemark']
            console.log(this.CommonRemark,"copmksdfnjks")
            this.searchRequest.CreateDate = data['Data']['CreateDate'];
            console.log(this.searchRequest.CreateDate, 'CreatedDate')
            console.log(this.StudentHistoryModelList, 'List12')
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




  OpenRevertDocumentPopup(ID:number,ApplicationID:number) {
    this.ViewHistory(this.modal_StudentReverteDocument)

    this.GetaAllRevertDocument(ID, ApplicationID);
  }


  async GetaAllRevertDocument(ID: number, ApplicationID:number) {
    this.isShowGrid = true;
    this.searchRequest.DocumentMasterID = ID
    this.searchRequest.action = "GetRevetedDocumentList";
    this.searchRequest.studentId = ApplicationID
    this.StudentHistoryModelList = [];

    try {
      this.loaderService.requestStarted();

      await this.studentService.StudentApplicationStatus(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentHistoryModelList = data['Data'];
            this.searchRequest.CreateDate = data['Data']['CreateDate'];
            console.log(this.searchRequest.CreateDate, 'CreatedDate')
            console.log(this.StudentHistoryModelList, 'List')
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



}
