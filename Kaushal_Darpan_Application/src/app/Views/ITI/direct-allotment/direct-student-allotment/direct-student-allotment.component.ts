import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { IMCAllocationDataModel, IMCAllocationSearchModel } from '../../../../Models/ITIIMCAllocationDataModel';
import { IMCAllocationService } from '../../../../Services/ITI/IMC-Allocation/imc-allocation.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { EnumDepartment, EnumStatus, GlobalConstants, enumExamStudentStatus } from '../../../../Common/GlobalConstants';
import { AllotmentDocumentModel, AllotmentReportingModel } from '../../../../Models/ITI/AllotmentreportDataModel';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITIAllotmentService } from '../../../../Services/ITI/ITIAllotment/itiallotment.service';
import { DirectAllocationDataModel, DirectAllocationSearchModel } from '../../../../Models/ITIAllotmentDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { DeleteDocumentDetailsModel } from '../../../../Models/DeleteDocumentDetailsModel';
import { DocumentDetailsService } from '../../../../Common/document-details';
import { UploadFileModel } from '../../../../Models/UploadFileModel';
import { IMCManagementAllotmentService } from '../../../../Services/BTER/IMC-Management-Allotment/imc-management-allotment.service';
import { BTERIMCAllocationDataModel } from '../../../../Models/BTERIMCAllocationDataModel';


@Component({
  selector: 'app-direct-student-allotment',
  standalone: false,

  templateUrl: './direct-student-allotment.component.html',
  styleUrl: './direct-student-allotment.component.css'
})
export class VerifyStudentAllotComponent {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  searchText: string = '';
  public IMCAllocationModel: DirectAllocationDataModel[] = [];
  request = new DirectAllocationDataModel()
  public searchRequest = new DirectAllocationSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public ApplicationIdS: string | null = null;
  public ApplicationId: number | null = null;
  public StudentVerifyPhoneData: any = [];
  public DirectAdmissionTypeList: any = [];
  public AllotedCategoryTypeList: any = [];
  public StudentOptinalTradeList: any = [];
  public StudentDetailsList: any = [];
  public ShiftUnitList: any = [];
  public GenderList: any = []
  public CategoryList:any=[];
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public NewMobileNo: string = '';
  public NewAadharNo: string = '';
  public Gender: number = 0;
  public DetailsBox: boolean = false;
  public ApplicationAlloted: boolean = true;
  public requestReporting = new AllotmentReportingModel()
  changeMobilerequest = new BTERIMCAllocationDataModel()
  UpdateDetailsModelData = new BTERIMCAllocationDataModel()

  public TradeBox: boolean = false;
  public IsOBC: boolean = true;
  public IsGEN: boolean = true;
  public IsST: boolean = true;
  public IsSC: boolean = true;
  public Isremarkshow: boolean = false
  public remarkheader: boolean = false

  public studentPhoto: string = '';
  public studentPhotoFolder: string = '';

  public totalSC: number = 0;
  public totalSCF: number = 0;
  public totalST: number = 0;
  public totalSTF: number = 0;
  public totalGEN: number = 0;
  public totalGENF: number = 0;
  public totalOBC: number = 0;
  public totalOBCF: number = 0;
  public totalMBC: number = 0;
  public totalMBCF: number = 0;
  public totalEWS: number = 0;
  public totalEWSF: number = 0;
  public totalDEV: number = 0;
  public totalDEVF: number = 0;
  public totalMIN: number = 0;
  public totalMINF: number = 0;
  public totalTSP: number = 0;
  public totalTSPF: number = 0;
  public totalSAH: number = 0;
  public totalSAHF: number = 0;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public filteredDocumentDetails: AllotmentDocumentModel[] = []

  public isAdmission: number = 0
  public DateConfigSetting: any = [];
  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    //private IMCAllocationService: IMCAllocationService,
    private allotmentService: ITIAllotmentService,
    private sMSMailService: SMSMailService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private IMCManagementAllotmentService: IMCManagementAllotmentService,
    private modalService: NgbModal, private http: HttpClient, private sanitizer: DomSanitizer, public appsettingConfig: AppsettingService,
    private documentDetailsService: DocumentDetailsService,

    private Swal2: SweetAlert2) {
  }

  async ngOnInit()
  {

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.searchRequest.TradeLevel = parseInt(this.routers.snapshot.paramMap.get('TradeLevel')??'0',10);
    await this.GetDateConfig();


    this.routers.paramMap.subscribe(params => {
      this.ApplicationIdS = params.get('id')
    });


    // const tradeLevel = this.routers.snapshot.paramMap.get('TradeLevel');
    // this.searchRequest.TradeLevel = tradeLevel ? parseInt(tradeLevel, 10) : 0;

    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;

    await this.GetMasterData();

    if (this.ApplicationIdS)
    {
      this.searchRequest.ApplicationID = parseInt(this.ApplicationIdS);
      await this.getAllDataList();
      this.GetStudentDetailsList();
      this.GetTradeListByCollege();
      this.DetailsBox = false;
      //this.TradeBox = true;
      this.isUpdate = true
    }

    //this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
  }


    async GetMasterData() {
      try {
        this.loaderService.requestStarted();
        debugger
        await this.commonMasterService.GetCommonMasterData('Gender')
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.GenderList = data['Data'];
            //this.GenderList = [{ "Name": "Female", "ID": "98" }, { "Name": "Transgender", "ID": "99" }];
  
          }, (error: any) => console.error(error)
          );
  
        await this.commonMasterService.CasteCategoryA()
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.CategoryList = data['Data'];
          }, (error: any) => console.error(error)
          );
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }
  

  //StatusUpdate(): string {
  //  if (this.StudentDetailsList.CasteCategoryNameEnglish == 'OBC')
  //  {

  //  }
  //  else if (this.searchRequest.TradeLevel == 10) {
  //    return '/ITIIMCAllocationList10th/' + this.searchRequest.TradeLevel
  //  }
  //  else {
  //    return '/default-path'; // or any other fallback path
  //  }
  //}


  async StatusUpdate() {

    try {
      if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'OBC') {
        this.IsSC = false;
        this.IsST = false;
      }
      else if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'ST') {
        this.IsSC = false;
        this.IsOBC = false;
      }
      else if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'SC') {
        this.IsST = false;
        this.IsOBC = false;
      }
      else if (this.StudentDetailsList[0].CasteCategoryNameEnglish == 'GENERAL') {
        this.IsST = false;
        this.IsOBC = false;
        this.IsSC = false;
      }
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


  getRouterLink(): string {
    if (this.searchRequest.TradeLevel == 8) {
      return '/direct-allotment-list8/8';
    } else if (this.searchRequest.TradeLevel == 10) {
      return '/direct-allotment-list10/10';
    } else if (this.searchRequest.TradeLevel == 12) {
      return '/direct-allotment-list12/12';
    } else {
      return "";
    }
  }

  async getAllDataList() {
    try {
      this.loaderService.requestStarted();
      this.TradeBox = false;
      this.DetailsBox = true;
      await this.allotmentService.GetStudentDetails(this.searchRequest)
        .then((data: any) => {
          debugger;
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (data && data.Data && data.Data.Table && data.Data.Table.length > 0) {

            this.StudentVerifyPhoneData = data['Data'].Table;

            this.request.MobileNo = data['Data'].Table[0].MobileNo;
            this.request.ApplicationID = data['Data'].Table[0].ApplicationID;
            this.request.TradeLevel = data['Data'].Table[0].ApplicationID;
            this.requestReporting = data['Data'].Table[0];
            this.requestReporting.AllotmentDocumentModel = data['Data'].Table1;
            this.requestReporting.AllotmentDocumentModel.forEach(e => e.DocumentStatus = true)

            this.UpdateDetailsModelData.MobileNo=this.requestReporting.MobileNo??"";
            this.NewAadharNo=this.requestReporting.AadharNo??"";
            this.UpdateDetailsModelData.CategoryID=Number(this.requestReporting.CasteCategoryID??0);
            if(this.requestReporting.AllotedGender=='Female'){
              this.UpdateDetailsModelData.Gender=98
            }
            else if(this.requestReporting.AllotedGender=='Male'){
              this.UpdateDetailsModelData.Gender=97
            }
            else{
              this.UpdateDetailsModelData.Gender=99
            }
            // this.UpdateDetailsModelData.Gender=Number(this.requestReporting.AllotedGender??0);
            //alert(this.StudentVerifyPhoneData[0].ApplicationVerified);
            //if (this.StudentVerifyPhoneData[0].ApplicationVerified !== 0) {
            //  this.ApplicationAlloted = false;
            //} else {
            //  this.ApplicationAlloted == true;
            //}
            // debugger
            // // bypass
            // this.StudentVerifyPhoneData[0].ApplicationAllotedDir == 0
            if (this.StudentVerifyPhoneData[0].ApplicationAllotedDir == 1) {
              this.ApplicationAlloted = true;
              this.TradeBox = false;
            } else {
              this.ApplicationAlloted = false;
              this.TradeBox = true;
            }
            //if (this.requestReporting.AllotmentDocumentModel.length > 0)
            const photoDoc = this.requestReporting.AllotmentDocumentModel.find((x: any) => x.ColumnName === 'StudentPhoto');
            this.studentPhoto = photoDoc ? photoDoc.FileName : "";
            this.studentPhotoFolder = photoDoc ? photoDoc.FolderName : "";

            //this.GetTradeListByCollege();
            // alert(this.request.MobileNo);
            console.log(this.StudentVerifyPhoneData, "StudentVerifyPhoneData")
          }
          else
          {

            this.Swal2.Confirmation("No Application Found", async (result: any) => {
              if (result.isConfirmed)
              {

                this.router.navigate([ this.getRouterLink()]);
                
              }
              else
              {
                let displayMessage = this.Message ?? this.ErrorMessage;
                this.toastr.error(displayMessage);
                this.isLoading = false;
              }
            },'Ok',false);



          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public isSupp: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;


  @ViewChild('appMenu', { static: false }) menuElementRef!: ElementRef;
  async openPdfModal(url: string): Promise<void> {

    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.add('DocShowers'); // or any class you want
    }


    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }

  async GetStudentDetailsList() {
    try {
      this.loaderService.requestStarted();
      await this.allotmentService.StudentDetailsList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentDetailsList = data['Data'];
          console.log(this.StudentDetailsList, "StudentDetailsList")
          this.StatusUpdate();
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async UpdateMobileNo()
  {


    if (this.NewMobileNo.length === 10)
    {
      this.changeMobilerequest.ApplicationID = this.request.ApplicationID;

            this.changeMobilerequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.changeMobilerequest.ModifyBy = this.sSOLoginDataModel.UserID;
      this.changeMobilerequest.MobileNo = this.NewMobileNo;
      try {
        this.loaderService.requestStarted();
        await this.IMCManagementAllotmentService.UpdateMobileNo(this.changeMobilerequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success('Update Success');
              setTimeout(() => {
                location.reload();   // 🔄 reload page after success
              }, 1000);
            } else {
              this.toastr.warning(data.Message);
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
    else {
      this.toastr.warning('Please Enter 10 Digits Mobile No');
    }
  }

  openUpdateDetailsOTP() {
    debugger
    if (this.NewAadharNo.length > 0 || this.NewMobileNo.length > 0 || this.UpdateDetailsModelData.Gender!=0 || this.UpdateDetailsModelData.CategoryID!=0)
      {
        if(this.NewMobileNo.length>0 ){
          if (this.NewMobileNo.length !== 10) {
            this.toastr.warning('Please Enter 10 Digits Mobile No');
            return;
          }
        }
      this.childComponent.MobileNo = this.UpdateDetailsModelData.MobileNo;
      this.CloseModal();
      this.childComponent.OpenOTPPopup();
      var th = this;
      this.toastr.success('OTP sent successfully to student mobile no');
      this.childComponent.onVerified.subscribe(() => {
        th.UpdateDetails();
      });
    }
    else {
      this.toastr.warning('Please Enter Fields ');
    }
  }


  async UpdateDetails()
  {

    debugger
    if (this.NewAadharNo.length > 0 || this.NewMobileNo.length > 0 || this.UpdateDetailsModelData.Gender!=0 || this.UpdateDetailsModelData.CategoryID!=0)
    {
      // if(this.NewMobileNo.length>0 ){
      //   if (this.NewMobileNo.length !== 10) {
      //     this.toastr.warning('Please Enter 10 Digits Mobile No');
      //     return;
      //   }
      // }
      this.UpdateDetailsModelData.ApplicationID = this.request.ApplicationID;
      this.UpdateDetailsModelData.CreatedBy = this.sSOLoginDataModel.UserID;
      this.UpdateDetailsModelData.ModifyBy = this.sSOLoginDataModel.UserID;
      this.UpdateDetailsModelData.AadharNo = this.NewAadharNo;
      // this.UpdateDetailsModelData.MobileNo = this.NewMobileNo;

      try {
        this.loaderService.requestStarted();
        await this.IMCManagementAllotmentService.UpdateAllotmentDetails(this.UpdateDetailsModelData)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success('Update Success');
              setTimeout(() => {
                location.reload();   // 🔄 reload page after success
              }, 1000);
            } else {
              this.toastr.warning(data.Message);
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
    else {
      this.toastr.warning('Please Enter Fields ');
    }
  }


  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.DetailsBox = false;
          this.TradeBox = true;
          this.CloseModal();
          this.GetStudentDetailsList();
          this.GetTradeListByCollege();

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
      else {
        this.toastr.error('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastr.warning('Please Enter OTP');
    }
  }



  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      this.request.MobileNo = this.sSOLoginDataModel.Mobileno;
      await this.sMSMailService.SendMessage(this.request.MobileNo, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastr.success('OTP resent successfully');
            }
          }
          else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async GetTradeListByCollege() {
    try {

      this.loaderService.requestStarted();//this.sSOLoginDataModel.InstituteID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      await this.allotmentService.GetTradeListByCollege(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentOptinalTradeList = data['Data'];


         this.totalSC   = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.SC || 0), 0);
         this.totalSCF  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.SC_F || 0), 0);
         this.totalST   = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.ST || 0), 0);
         this.totalSTF  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.ST_F || 0), 0);
         this.totalGEN  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.GEN || 0), 0);
         this.totalGENF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.GEN_F || 0), 0);
         this.totalOBC  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.OBC || 0), 0);
         this.totalOBCF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.OBC_F || 0), 0);
         this.totalMBC  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.MBC || 0), 0);
         this.totalMBCF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.MBC_F || 0), 0);
         this.totalEWS  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.EWS || 0), 0);
         this.totalEWSF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.EWS_F || 0), 0);
         this.totalDEV  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.DEV || 0), 0);
         this.totalDEVF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.DEV_F || 0), 0);
         this.totalMIN  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.MIN || 0), 0);
         this.totalMINF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.MIN_F || 0), 0);
         this.totalTSP  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.TSP || 0), 0);
         this.totalTSPF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.TSP_F || 0), 0);
         this.totalSAH  = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.SAH || 0), 0);
         this.totalSAHF = this.StudentOptinalTradeList.reduce((sum: any, x: any) => sum + (x.SAH_F || 0), 0);


          // alert(this.request.MobileNo);
          console.log(this.StudentOptinalTradeList, "StudentOptinalTradeList")
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


  async TradeWithAllot(content: any, CollegeTradeID: number, SeatMetrixId: number, AllotedCategory: string, SeatMetrixColumn: string,TradeName:string='') {
    //alert(CollegeTradeID);
    //alert(AllotedCategory);
    debugger;
    this.request.ShiftUnit = 0;
    this.request.CollegeTradeID = CollegeTradeID;
    this.request.SeatMetrixId = SeatMetrixId;
    this.searchRequest.CollegeTradeID = CollegeTradeID;
    this.request.AllotedCategory = AllotedCategory;
    this.request.SeatMetrixColumn = SeatMetrixColumn;

    this.request.TradeName = TradeName;


    try {
      this.loaderService.requestStarted();
      await this.allotmentService.ShiftUnitList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ShiftUnitList = data['Data'];
          //this.GetTradeListByCollege();
          // alert(this.request.MobileNo);
          console.log(this.ShiftUnitList, "ShiftUnitList")
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }




    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });


    //this.openModalChangeMobileNo("abc");
  }


  async SaveTradeWithAllot() {
    try {
      this.loaderService.requestStarted();
      this.request.TradeLevel = this.searchRequest.TradeLevel
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.request.DocumentList = this.requestReporting.AllotmentDocumentModel
      await this.allotmentService.UpdateAllotments(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.getAllDataList();
            this.toastr.success('Student Allotment Successfully');
            this.resetOTPControls();
            this.CloseModal();
            if (this.searchRequest.TradeLevel == 8) {
              this.Router.navigate(['/direct-allotment-list8', 8]);
            } else if (this.searchRequest.TradeLevel == 10) {
              this.Router.navigate(['/direct-allotment-list10', 10]);
            } else if (this.searchRequest.TradeLevel == 12) {
              this.Router.navigate(['/direct-allotment-list12', 12]);
            }
          }
          else {
            this.toastr.success(data.Message);
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

  //Start Section Model
  async openModalGenerateOTP(content: any) {
    this.OTP = '';
    this.MobileNo = '';
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = this.request.MobileNo;
    this.SendOTP();
  }
  async openModalChangeMobileNo(content: any) {

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
  CloseModal() {



    this.modalService.dismissAll();
  }

  resetOTPControls() {
    this.OTP = "";
    this.GeneratedOTP = "";

  }

  startTimer(): void {
    this.showResendButton = false;
    this.timeLeft = GlobalConstants.DefaultTimerOTP * 60;


    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
        this.showResendButton = true; // Show the button when time is up
      }
    }, 1000); // Update every second
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  @ViewChild('content') content: ElementRef | any;

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //Modal Section END

  ClosePopupAndGenerateAndViewPdf(): void {
    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.remove('DocShowers'); // or any class you want
    }
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }

  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
  }

  async OnRemarkChange(dOC: any, index: number) {

    if (index == 0) {
      dOC.ShowRemark = true;
      dOC.DocumentStatus = false

    } else {
      dOC.ShowRemark = false;
      dOC.DocumentStatus = true
      dOC.Remark = '';
    }
    //
    //console.log(this.request.AllotmentDocumentModel)
    this.Isremarkshow = this.requestReporting.AllotmentDocumentModel.some((x: any) => x.DocumentStatus === false);

    this.remarkheader = this.Isremarkshow;
  }

  openSubmitOTP()
  {
    const filteredDocuments1 = this.requestReporting.AllotmentDocumentModel
    filteredDocuments1.forEach((e: any) => e.IsMandatory = 1)

    if (this.documentDetailsService.HasRequiredDocument(filteredDocuments1)) {
      return;
    }
    if (this.request.ShiftUnit == 0) {
      this.toastr.error("Please select shift unit ")
      return
    }

    this.childComponent.MobileNo = this.requestReporting.MobileNo;
    this.CloseModal();
    this.childComponent.OpenOTPPopup();
    var th = this;
    this.toastr.success('OTP sent successfully to student mobile no');
    this.childComponent.onVerified.subscribe(() => {
      th.SaveTradeWithAllot();
    });
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

          if (data.State == EnumStatus.Success) {
            //add/update document in js list
            const index = this.requestReporting.AllotmentDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.requestReporting.AllotmentDocumentModel[index].FileName = data.Data[0].FileName;
              this.requestReporting.AllotmentDocumentModel[index].Dis_FileName = data.Data[0].Dis_FileName;
            }
            console.log(this.requestReporting.AllotmentDocumentModel)
            //reset file type
            event.target.value = null;
          }
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage)
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.ErrorMessage)
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

          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            const index = this.requestReporting.AllotmentDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            if (index !== -1) {
              this.requestReporting.AllotmentDocumentModel[index].FileName = '';
              this.requestReporting.AllotmentDocumentModel[index].Dis_FileName = '';
            }
            console.log(this.requestReporting.AllotmentDocumentModel)
          }
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }



  async GetDateConfig()
  {
    debugger
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      //CourseTypeId: this.searchRequest.CourseTypeId,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: "DIRECT ALLOTMENT REPORTING",
      SSOID: this.sSOLoginDataModel.SSOID
    }
    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        this.isAdmission = this.DateConfigSetting[0]['DIRECT ALLOTMENT REPORTING'];
        console.log(this.DateConfigSetting[0]['DIRECT ALLOTMENT REPORTING']);

      }, (error: any) => console.error(error)
    );


    if ( this.isAdmission==0)
    {


      this.Swal2.showRedirectMessage('Reporting Date Is Closed',this.getRouterLink());

      // setTimeout(() => {
      //   this.router.navigate([this.getRouterLink()]);
      // }, 1000);

      // this.Swal2.Confirmation("Reporting Date Is Closed", async (result: any) => {
      //   if (result.isConfirmed) {

      //     this.router.navigate([this.getRouterLink()]);

      //   }
      // }, 'Ok', false);

    }

  }

}
