import { Component, ViewChild, Input } from '@angular/core';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { enumExamStudentStatus, EnumStatus, EnumVerificationAction } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../Services/Student/student.service';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { StudentMeritInfoModel } from '../../../Models/StudentMeritInfoDataModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { DocumentDetailsService } from '../../../Common/document-details';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-merit-correction',
  templateUrl: './merit-correction.component.html',
  styleUrls: ['./merit-correction.component.css'],
    standalone: false
})
export class CorrectionMeritComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @Input() CourseTypeId: number = 0;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public request=new StudentMeritInfoModel();
  public searchRequest = new StudentSearchModel();
  public isShowGrid: boolean = false;
  emitraRequest = new EmitraRequestDetails();
  public OTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudenetTranList: [] = [];
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  public searchssoform!: FormGroup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public totalAmount: number = 0;
  public enumExamStudentStatus = enumExamStudentStatus;
  public SemesterName: String = ''
  public StudentSubjectList: any[] = [];
  public isSubmitted: boolean = false
  public isShowSelected: boolean = false;
  public IsdocumentShow: boolean = false

  public ShowCommingSoon: boolean = false;
   dateConfiguration = new DateConfigurationModel();
  public DepartmentId: number = 1;

  public HelplineNumber: string = '';
  public ContactEmail: string = '';

 
  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastrService: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService
  ) { }

  async ngOnInit() {

    this.searchssoform = this.formBuilder.group({
      txtApplicationNo: ['', Validators.required],
    
      DOB: ['', Validators.required],

    })



    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //


    if (this.CourseTypeId == 1) {
      this.HelplineNumber = '+91-9461172833';
      this.ContactEmail = 'technicaladvisorceg@gmail.com';
    }
    else if (this.CourseTypeId == 2) {
      this.HelplineNumber = '+91-8619637821';
      this.ContactEmail = 'mahila.admission@gmail.com';
    }
    else if (this.CourseTypeId == 3) {
      this.HelplineNumber = ' +91-9461172833';
      this.ContactEmail = 'technicaladvisorceg@gmail.com';
    }
    else if (this.CourseTypeId == 4) {
      this.HelplineNumber = '+91-8619637821';
      this.ContactEmail = 'mahila.admission@gmail.com';
    }
    else if (this.CourseTypeId == 5) {
      this.HelplineNumber = ' +91-8619637821';
      this.ContactEmail = 'dte.Lateral@rajasthan.gov.in';
    }


  }

  openOTP(MobileNo: any) {
    this.childComponent.MobileNo = MobileNo
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.isShowGrid = this.request.ApplicationID > 0;
      if (this.request.IsEdit == false) {
        this.request.Action = 8
      }
      this.isShowSelected = true;
      //console.log("otp verified on the page")
    })
  }

  get _searchssoform() { return this.searchssoform.controls; }


  async onSearchClick() { await this.GetAllDataActionWise(); }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.request = new StudentMeritInfoModel();
    this.studentDetailsModel = new StudentDetailsModel();
  }



  async GetAllDataActionWise() {
    
    this.isSubmitted = true
    if (this.searchssoform.invalid) {
      return
    }

    //this.isShowGrid = true;
    this.searchRequest.action = "_getstudentmeritdata";
    this.request = new StudentMeritInfoModel()
    this.searchRequest.DepartmentID = 1;

    try {
      this.loaderService.requestStarted();
      await this.studentService.GetStudentMeritinfo(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


            this.request = data['Data'];

          //  this.isShowGrid = this.request.ApplicationID > 0;
          //  if (this.request.IsEdit == false) { 
          //  this.request.Action = 8
          //}
            /* alert(this.request.IsSupplement)*/
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;
            console.log(this.request)
            
            if (this.request) {
              this.openOTP(this.request.MobileNo);
              //this.isShowSelected = true;
            }
          } else {
            this.isShowGrid = false;
            this.toastrService.error("Data not found");
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

  async OnShow(Key: number) {
    if (Key == 1) {
      this.IsdocumentShow = true
    } else {
      this.IsdocumentShow = false
    }
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
            const index = this.request.RecheckDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.request.RecheckDocumentModel[index].FileName = data.Data[0].FileName;
              this.request.RecheckDocumentModel[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            console.log(this.request.RecheckDocumentModel)
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
            const index = this.request.RecheckDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.request.RecheckDocumentModel[index].FileName = '';
              this.request.RecheckDocumentModel[index].Dis_FileName = '';
            }
            console.log(this.request.RecheckDocumentModel)
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

  async OnImageUpload(Key:number,dOC:any)
{
    
    if (Key ==1) {
      dOC.ShowRemark = true;
      dOC.Isselect = true
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
      dOC.Isselect = false

    }

  }



  async DocumentSave() {
    console.log(this.request.RecheckDocumentModel)
    
    if (this.documentDetailsService.HasRequiredDocument(this.request.RecheckDocumentModel)) {
      return;
    }
    this.request.RecheckDocumentModel = this.request.RecheckDocumentModel.filter(e => e.Isselect == true)
  
    this.request.RecheckDocumentModel.forEach(e => {
      e.ModifyBy = this.sSOLoginDataModel.UserID
      e.status = EnumVerificationAction.ReCheck
      e.TransactionID = this.request.ApplicationID
      e.MeritId = this.request.MeritId;
    })
   
    try {

      this.loaderService.requestStarted();
      await this.studentService.SaveDocumentData(this.request.RecheckDocumentModel).then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (data.State == EnumStatus.Success) {

          this.toastrService.success(data.Message);
          this.isShowGrid = false;
          this.IsdocumentShow = false;
          //this.GetAllDataActionWise();

        }
        if (data.State === EnumStatus.Error) {
          this.toastrService.error(data.ErrorMessage);
        } else if (data.State === EnumStatus.Warning) {
          this.toastrService.warning(data.ErrorMessage);
        }
      });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }

  }


}

