import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumDepartment, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CookieService } from 'ngx-cookie-service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { StudentService } from '../../../Services/Student/student.service';
import { ToastrService } from 'ngx-toastr';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { DocumentDetailsDataModel } from '../../../Models/ITIFormDataModel';
import { DocumentDetailList } from '../../../Models/ApplicationFormDataModel';
import { VerificationDocumentDetailList } from '../../../Models/StudentVerificationDataModel';
import { ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { DocumentDetailsModel } from '../../../Models/DocumentDetailsModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { Router } from '@angular/router';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';

@Component({
    selector: 'app-emitra-application-status',
    templateUrl: './emitra-application-status.component.html',
    styleUrls: ['./emitra-application-status.component.css'],
    standalone: false
})
export class EmitraApplicationStatusComponent
{
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public DOB: string = '';
  public ApplicationID:number=0
  public searchRequest = new StudentSearchModel();
  public _EnumDepartment = EnumDepartment;
  public _EnumVerfication = EnumVerificationAction;
  public isShowGrid: boolean = false;

  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []
  public DocumentList: DocumentDetailsModel[] = []
  public DefaultApplicationText: String = '';
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public messageModel = new ApplicationMessageDataModel()
  public CommonRemark:string=''
    
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(
    private loaderService: LoaderService, 
    private commonservice: CommonFunctionService, 
    public appsettingConfig: AppsettingService,
    private studentService: ApplicationStatusService, 
    private modalService: NgbModal, 
    private toastrService: ToastrService,
    private sMSMailService: SMSMailService, 
    private cookieService: CookieService, 
    private cdRef: ChangeDetectorRef, 
    private documentDetailsService: DocumentDetailsService,
    public encryptionService: EncryptionService,
    private route: Router
   
  ) { }

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  onSearchClick() {
    if (this.searchRequest.DepartmentID == 0) {
      this.toastrService.warning("Please Select Department");
      return
    }
    this.GetAllDataActionWise()
  }
  ResetControl() {
    this.searchRequest = new StudentSearchModel()
  }
  async GetAllDataActionWise() {
    this.isShowGrid = true;

    this.searchRequest.action = "_GetApplicationStatus";
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      await this.studentService.StudentApplicationStatus(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log(this.StudentDetailsModelList)
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
  async openModal(content: any, ApplicationID:number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetDatabyID(ApplicationID)
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
  CloseModal() {
    this.modalService.dismissAll();
  }

  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel = new UploadFileModel();
      uploadModel.FileExtention = item.FileExtention ?? "";
      uploadModel.MinFileSize = item.MinFileSize ?? "";
      uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      uploadModel.FolderName = item.FolderName ?? "";
      //call
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.DocumentList.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.DocumentList[index].FileName = data.Data[0].FileName;
              this.DocumentList[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            console.log(this.DocumentList)
            //reset file type
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastrService.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastrService.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {
    try {
      // delete from server folder
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.DocumentList.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.DocumentList[index].FileName = '';
              this.DocumentList[index].Dis_FileName = '';
            }
            console.log(this.DocumentList)
          }
          if (this.State == EnumStatus.Error) {
            this.toastrService.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async GetDatabyID(ApplicationID: number) {

    this.ApplicationID = ApplicationID


    try {
      this.loaderService.requestStarted();

      await this.studentService.GetByID(ApplicationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DocumentList = data['Data'];
            this.DocumentList.forEach(e => e.FileName = '')
            this.DocumentList = this.DocumentList.map(doc => ({
              ...doc,
              DisplayColumnNameEn: doc.DisplayColumnNameEn.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
            }));
            this.CommonRemark = data['Data'][0]['CommonRemark']
            console.log(this.DocumentList)
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
  async DocumentSave() {
    console.log(this.DocumentList)

    if (this.documentDetailsService.HasRequiredDocument(this.DocumentList)) {
      return;
    }


    this.DocumentList.forEach(e => {
      e.ModifyBy = this.sSOLoginDataModel.UserID
     
    })
    const isEmpty = this.DocumentList.some(x => x.FileName == '' && x.Dis_FileName == '')
    if (isEmpty) {
      this.toastrService.error("Please Upload File ")
      return
    }
    try { 

    this.loaderService.requestStarted();
    await this.studentService.SaveDocumentData(this.DocumentList).then((data: any) => {

      data = JSON.parse(JSON.stringify(data));
      this.State = data['State'];
      this.Message = data['Message'];
      this.ErrorMessage = data['ErrorMessage'];

      if (data.State == EnumStatus.Success) {

        this.toastrService.success(data.Message);
        this.CloseModal()
  
      }
      if (data.State === EnumStatus.Error) {
        this.toastrService.error(data.ErrorMessage);
      } else if (data.State === EnumStatus.Warning) {
        this.toastrService.warning(data.ErrorMessage);
      }
    });
  } catch(Ex) {
    console.log(Ex);
  } finally {
    this.loaderService.requestEnded();
  }

  }
  async Redirect(key: number, ApplicationID: number) {

    if (key == EnumDepartment.BTER)
    {
      await this.route.navigate(['/PreviewForm'], { queryParams: { AppID: this.encryptionService.encryptData(ApplicationID) } });
    } else if (key == EnumDepartment.ITI)
    {

      await this.route.navigate(['/Itipreviewform'], { queryParams: { AppID: this.encryptionService.encryptData(ApplicationID) } });
    }
    
  }

  

}
