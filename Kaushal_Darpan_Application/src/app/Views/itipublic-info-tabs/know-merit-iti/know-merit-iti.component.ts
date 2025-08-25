import { Component } from '@angular/core';
import { StudentMeritInfoModel } from '../../../Models/StudentMeritInfoDataModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { enumExamStudentStatus, EnumStatus, EnumVerificationAction } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../Services/Student/student.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { ITIStudentMeritInfoModel } from '../../../Models/ITI/ITIStudentMeritInfoDataModel';

@Component({
  selector: 'app-know-merit-iti',
  templateUrl: './know-merit-iti.component.html',
  styleUrl: './know-merit-iti.component.css',
  standalone: false
})
export class KnowMeritITIComponent {
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public collegeMerit8: [] = [];
  public collegeMerit10: [] = [];
  public collegeMerit12: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public request = new ITIStudentMeritInfoModel();

  public requestData: any;

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
  public isOnStatus = false;
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
    await this.GetPublicInfoStatus();
  }



  async GetPublicInfoStatus() {
    try {
      await this.commonservice.GetPublicInfoStatus(2)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.Data[0].IsOnAllotmentStatus == 1) {
            this.isOnStatus = true;
          } else {
            this.isOnStatus = false;
          }
          //IsOnKnowMerit, 1 IsOnAllotmentStatus, 1 IsOnUpwardMovement

        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {

      }, 200);
    }
  }


  get _searchssoform() { return this.searchssoform.controls; }


  async onSearchClick() { await this.GetAllDataActionWise(); }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.request = new ITIStudentMeritInfoModel();
    this.studentDetailsModel = new StudentDetailsModel();
  }



  async GetAllDataActionWise() {
    this.collegeMerit8 = [];
    this.collegeMerit10 = [];
    this.collegeMerit12 = [];
    this.isSubmitted = true
    if (this.searchssoform.invalid) {
      return
    }

    this.isShowGrid = true;
    this.searchRequest.action = "_getstudentmeritdata";
    this.searchRequest.DepartmentID = 2;
    this.request = new ITIStudentMeritInfoModel()

    try {
      this.loaderService.requestStarted();
      await this.studentService.GetITIStudentMeritinfo(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {

            debugger;

            this.request = data['Data'].Table;
            this.requestData = data['Data'].Table[0];

            this.collegeMerit8 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 8);
            this.collegeMerit10 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 10);
            this.collegeMerit12 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 12);





           






            this.isShowGrid = this.requestData.ApplicationID > 0;
            
           

            if (this.requestData) {
              this.isShowSelected = true;
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
            //const index = this.request.RecheckDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            //if (index !== -1) {
            //  this.request.RecheckDocumentModel[index].FileName = data.Data[0].FileName;
            //  this.request.RecheckDocumentModel[index].Dis_FileName = data.Data[0].Dis_FileName;
            //}
     /*       console.log(this.request.RecheckDocumentModel)*/
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
            //const index = this.request.RecheckDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            //if (index !== -1) {
            //  this.request.RecheckDocumentModel[index].FileName = '';
            //  this.request.RecheckDocumentModel[index].Dis_FileName = '';
            //}
          /*  console.log(this.request.RecheckDocumentModel)*/
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

  async OnImageUpload(Key: number, dOC: any) {

    if (Key == 1) {
      dOC.ShowRemark = true;
      dOC.Isselect = true
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
      dOC.Isselect = false

    }

  }



  async DocumentSave() {
   /* console.log(this.request.RecheckDocumentModel)*/
    //
    //if (this.documentDetailsService.HasRequiredDocument(this.request.RecheckDocumentModel)) {
    //  return;
    //}
    //this.request.RecheckDocumentModel = this.request.RecheckDocumentModel.filter(e => e.Isselect == true)

    //this.request.RecheckDocumentModel.forEach(e => {
    //  e.ModifyBy = this.sSOLoginDataModel.UserID
    //  e.status = EnumVerificationAction.ReCheck
    //  e.TransactionID = this.request.ApplicationID
    //  e.MeritId = this.request.MeritId;
    //})

    //try {

    //  this.loaderService.requestStarted();
    //  await this.studentService.SaveDocumentData(this.request.RecheckDocumentModel).then((data: any) => {

    //    data = JSON.parse(JSON.stringify(data));
    //    this.State = data['State'];
    //    this.Message = data['Message'];
    //    this.ErrorMessage = data['ErrorMessage'];

    //    if (data.State == EnumStatus.Success) {

    //      this.toastrService.success(data.Message);


    //    }
    //    if (data.State === EnumStatus.Error) {
    //      this.toastrService.error(data.ErrorMessage);
    //    } else if (data.State === EnumStatus.Warning) {
    //      this.toastrService.warning(data.ErrorMessage);
    //    }
    //  });
    //} catch (Ex) {
    //  console.log(Ex);
    //} finally {
    //  this.loaderService.requestEnded();
    //}

  }


}
