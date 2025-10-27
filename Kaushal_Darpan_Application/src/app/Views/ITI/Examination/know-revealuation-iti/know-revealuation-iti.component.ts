import { Component } from '@angular/core';
import { StudentMeritInfoModel } from '../../../../Models/StudentMeritInfoDataModel';
import { StudentSearchModel } from '../../../../Models/StudentSearchModel';
import { EmitraRequestDetails } from '../../../../Models/PaymentDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { StudentDetailsModel } from '../../../../Models/StudentDetailsModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { enumExamStudentStatus, EnumStatus, EnumVerificationAction } from '../../../../Common/GlobalConstants';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../../Services/Student/student.service';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { EmitraPaymentService } from '../../../../Services/EmitraPayment/emitra-payment.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { ITIStudentMeritInfoModel } from '../../../../Models/ITI/ITIStudentMeritInfoDataModel';
import { ITIStudentRevaluationService } from '../../../../Services/ITI/Examination/iti-student-revaluation.service';
import { ITIRevalRequestStudentDetailsModel, RVLstudentListModel, RVLStudentRevalRequestModel, StudentRevalRequestModel } from '../../../../Models/RevaluationModel';


@Component({
  selector: 'app-know-revealuation-iti',
  templateUrl: './know-revealuation-iti.component.html',
  styleUrl: './know-revealuation-iti.component.css',
  standalone: false
})
export class KnowRevealuationITIComponent {
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

  public searchRequest = new ITIRevalRequestStudentDetailsModel();
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
  public RVLApplicatiodata: any[] = [];
  public isSubmitted: boolean = false
  public isShowSelected: boolean = false;
  public IsdocumentShow: boolean = false
  public isOnStatus = false;
  SelectedStudent: any = {};
  modalRef1: NgbModalRef | null = null;
  public StudentOptionList: any = [];


  public StudentRevalRequest = new RVLStudentRevalRequestModel();
  public Request = new StudentRevalRequestModel();
  public RVLform!: FormGroup
  public RVLstudentList: RVLstudentListModel[] = [];
  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastrService: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,

    private StudentRevaluation: ITIStudentRevaluationService,
    private ITIStudentRevaluationService: ITIStudentRevaluationService,
  ) { }

  async ngOnInit() {

    this.RVLform = this.formBuilder.group({
      ApplicationNo: ['', Validators.required],
      RollNo: ['', Validators.required],

    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
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


  get _RVLform() { return this.RVLform.controls; }


  async onSearchClick() { await this.GetRVLApplicationNoData(); }

  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.request = new ITIStudentMeritInfoModel();
    this.studentDetailsModel = new StudentDetailsModel();
  }



  //async GetAllDataActionWise() {
  //  this.collegeMerit8 = [];
  //  this.collegeMerit10 = [];
  //  this.collegeMerit12 = [];
  //  this.isSubmitted = true
  //  if (this.searchssoform.invalid) {
  //    return
  //  }

  //  this.isShowGrid = true;
  //  this.searchRequest.action = "_getstudentmeritdata";
  //  this.searchRequest.DepartmentID = 2;
  //  this.request = new ITIStudentMeritInfoModel()

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.studentService.GetITIStudentMeritinfo(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {

  //          debugger;

  //          this.request = data['Data'].Table;
  //          this.requestData = data['Data'].Table[0];

  //          this.collegeMerit8 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 8);
  //          this.collegeMerit10 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 10);
  //          this.collegeMerit12 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 12);



  //          this.isShowGrid = this.requestData.ApplicationID > 0;
            
           

  //          if (this.requestData) {
  //            this.isShowSelected = true;
  //          }
  //        } else {
  //          this.isShowGrid = false;
  //          this.toastrService.error("Data not found");
  //        }
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

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



  async DocumentSave() { }

  async GetRVLApplicationNoData() {
    debugger
    this.isSubmitted = true
    if (this.RVLform.invalid) {
      return
    }
    this.isShowGrid = true;
    
    this.StudentRevalRequest.ApplicationNo = this.Request.ApplicationNo
    this.StudentRevalRequest.RollNo = this.Request.RollNo
    

    console.log('data view ==>',this.StudentRevalRequest)
    try {
      this.loaderService.requestStarted();
      await this.StudentRevaluation.GetRVLDetailByStudentApplicationNo(this.StudentRevalRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            debugger
            this.RVLApplicatiodata = data['Data']
            console.log("RVL Applicatio data ==>", this.RVLApplicatiodata);

          }
        }, error => console.error(error));
      
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

  //async openModal(model: any, row: any) {
  //  debugger
  //  try {
  //    await this.getRVLstudent(row.RevalRequestID)
  //    this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static', });
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  //async getRVLstudent(RevalRequestID: number) {
  //  debugger
  //  try {
  //    this.loaderService.requestStarted();
  //    this.StudentRevalRequest.RevalRequestID = RevalRequestID;

  //    await this.StudentRevaluation.getRVLstudent(this.StudentRevalRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.RVLstudentList = data.Data.Table;
  //        console.log(this.RVLstudentList)
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async openModal(model: any, item: any) {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.getRVLstudent(item.RevalRequestID);

      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
    }
    catch (error) {
      console.error(error);
      this.toastrService.error('Unable to open modal.');
    }
    finally {
      this.loaderService.requestEnded();
    }
  }




  async getRVLstudent(RevalRequestID: number) {
    debugger;
    try {
      this.StudentRevalRequest.RevalRequestID = RevalRequestID;

      const response: any = await this.StudentRevaluation.getRVLstudent(this.StudentRevalRequest);
      const data = JSON.parse(JSON.stringify(response));

      if (data?.State === EnumStatus.Success && data?.Data?.Table?.length) {
        this.RVLstudentList = data.Data.Table;
      } else {
        this.toastrService.warning('No data found!');
        this.RVLstudentList = [];
      }

    } catch (error) {
      console.error(error);
      this.toastrService.error('Failed to fetch student data.');
    }
  }


  CloseModal_RVLStudent() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }



  async EditData(content: any, rowData?: any) {

    this.isSubmitted = true;
    this.SelectedStudent = rowData;

    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    debugger
    if (rowData != null && rowData != undefined) {
      try {

        //this.searchRequest.PageNumber = this.pageNo
        //this.searchRequest.PageSize = this.pageSize
        //this.searchRequest.SortColumn = this.sortColumn
        //this.searchRequest.SortOrder = this.sortOrder
        this.searchRequest.RevalReqID = rowData.RevalRequestID
   

        this.searchRequest.action = "_getRevalDetailsbyRevalReqID"
      
        this.loaderService.requestStarted();
        await this.ITIStudentRevaluationService.GetAllRevalRequestDetails(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentOptionList = data.Data;
          console.log(this.StudentOptionList, "studetn")
          //this.totalRecord = this.StudentOptionList[0]?.TotalRecords;
          //this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          console.log(this.StudentOptionList)
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

      // }
    }
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

}
