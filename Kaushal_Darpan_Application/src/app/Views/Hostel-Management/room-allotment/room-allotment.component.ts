import { Component, ElementRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SearchRequestRoomAllotment } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { DomSanitizer } from '@angular/platform-browser';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { HostelRoomSeatSearchModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { HostelRoomDetailsService } from '../../../Services/HostelRoomDetails/hostel-room-details.service';
import * as XLSX from 'xlsx';
import { SearchRequest } from '../../../Models/CitizenSuggestionDataModel';

@Component({
  selector: 'app-room-allotment',
  standalone: false,
  
  templateUrl: './room-allotment.component.html',
  styleUrl: './room-allotment.component.css'
})
export class RoomAllotmentComponent {
  public Searchrequest = new SearchRequestRoomAllotment()
  public searchRequestHostelRoom = new HostelRoomSeatSearchModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public HostelID: number = 0;
  public UserID: number = 0;
  public AllotSeatId: number = 0;
  public ReqId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public RequestFormGroup!: FormGroup;
  public ViewRequestFormGroup!: FormGroup;
  public AllotRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public StudentReqListList: any = [];
  public SemesterDDLList: any = [];
  public RoomTypeDDLList: any = [];
  public RoomNoDDLList: any = [];
  public BrachDDLList: any = [];
  public RelationQueryDDL: any = [];
  public CancelRequest: any;
  public Allotmentrequest = new RoomAllotmentDataModel();
  public request: any;
  public ViewRequest: any = {};
  public StaticFileRootPathURL: any = {};
  public _GlobalConstants: any = {};

  timeLeft: number = GlobalConstants.DefaultTimerOTP;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  public DetailsBox: boolean = false;
  public TradeBox: boolean = false;
  closeResult: string | undefined;
  showResendButton: boolean = false;
  private interval: any;
  public titleDDLBranchTrade: string = '';

  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private _HostelManagmentService: HostelManagmentService,
    private commonFunctionService: CommonFunctionService,
    private hostelRoomDetailsService: HostelRoomDetailsService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private sMSMailService: SMSMailService,
    private sanitizer: DomSanitizer,
    private modalService: NgbModal) { }


  async ngOnInit() {
    
    this.RequestFormGroup = this.formBuilder.group({
      //otp: ['', Validators.required],
      remark: ['', Validators.required],
    });

    this.ViewRequestFormGroup = this.formBuilder.group({
      ClassDocument: ['']
    });


    this.AllotRequestFormGroup = this.formBuilder.group({
      roomTypeId: ['', [DropdownValidators]],
      roomNoId: ['', [DropdownValidators]],
      //HostelFeesReciept: ['', [DropdownValidators]],
      //fessAmount: ['', Validators.required],
      fessAmount: [{ value: '', disabled: true }, Validators.required],
      relation: ['', [DropdownValidators]],
      //contactPersonName: ['', Validators.required],
      contactPersonName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      //mobileNo: ['', Validators.required],
      mobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
    });
    this.AllotSeatId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.titleDDLBranchTrade = 'Branch'
    }
    else if (this.sSOLoginDataModel.DepartmentID == 2) {
      this.titleDDLBranchTrade = 'Trade'
    }

    await this.GetAllData();
    await this.GetBranchMasterDDL();
    await this.GetSemesterMasterDDL();
    await this.GetRoomTypeDDL();
    await this.GetReletionDDL();
    

  }

  get _AllotRequestFormGroup() { return this.AllotRequestFormGroup.controls; }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _ViewRequestFormGroup() { return this.ViewRequestFormGroup.controls; }

  allowOnlyAlphabets(event: KeyboardEvent) {
    const charCode = event.key;
    const pattern = /^[a-zA-Z\s]*$/;
    if (!pattern.test(charCode)) {
      event.preventDefault();
    }
  }


  async GetAllData() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      //this.Searchrequest.InstituteID = 9;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      //if (this.Searchrequest.AffidavitDoc == 2) {
      //  this.Searchrequest.AffidavitDoc = 0
      //}
      //this.Searchrequest.HostelID = 2;
      await this.studentRequestService.GetAllRoomAllotment(this.Searchrequest)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StudentReqListList = data['Data'];

          console.log('Student List==>',this.StudentReqListList)
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

  async GetBranchMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BrachDDLList = data['Data'];
          console.log(this.BrachDDLList)
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

  async GetSemesterMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterDDLList = data['Data'];
          console.log(this.SemesterDDLList)
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






  async GetRoomNoDDL() {
    debugger
    try {
      this.searchRequestHostelRoom.HostelID = this.sSOLoginDataModel.HostelID;
      this.searchRequestHostelRoom.RoomType = this.Allotmentrequest.RoomTypeId;
      this.searchRequestHostelRoom.EndTermID = this.sSOLoginDataModel.EndTermID;
     // alert(this.searchRequestHostelRoom.EndTermID);
      this.loaderService.requestStarted();
      await this.hostelRoomDetailsService.GetRoomDDLList(this.searchRequestHostelRoom.HostelID, this.searchRequestHostelRoom.RoomType, this.searchRequestHostelRoom.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomNoDDLList = data['Data'];
          this.Allotmentrequest.FessAmount = this.RoomNoDDLList[0].FeePerBad
          console.log('Room DDL List',this.RoomNoDDLList)
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

  async GetRoomTypeDDL() {
    
    this.HostelID = this.sSOLoginDataModel.HostelID;
    //alert(this.HostelID);
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetRoomTypeDDLByHostel('HostelRoomSeatType', this.HostelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomTypeDDLList = data['Data'];
          console.log("Hostel Room Seat List", this.RoomTypeDDLList);
          //this.GetRoomNoDDL();
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


  async GetReletionDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetReletionDDL('RelationType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RelationQueryDDL = data['Data'];
          console.log("RelationType", this.RelationQueryDDL);
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


  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest = new SearchRequestRoomAllotment();
    this.Allotmentrequest = new RoomAllotmentDataModel();
    this.AllotRequestFormGroup.reset();
    this.RequestFormGroup.reset();
    this.GetAllData();
  }


  async onSubmit(model: any, userSubmitData: any) {
    
    try {
      this.request = { ...userSubmitData };
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  async saveData() {
    
    this.Allotmentrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.Allotmentrequest.InstituteId = this.sSOLoginDataModel.InstituteID
   // this.Allotmentrequest.InstituteId = 9
    this.Allotmentrequest.ReqId = this.request.ReqId;
    this.Allotmentrequest.EndTermId = this.request.EndTermID;
    this.isSubmitted = true;
    if (this.AllotRequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.AllotSeatId) {
        this.Allotmentrequest.AllotSeatId = this.AllotSeatId
        this.Allotmentrequest.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.Allotmentrequest.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.studentRequestService.SaveData(this.Allotmentrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.CloseModal();
            this.GetAllData();

          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }


  async AllotmentCancelData() {
    
    console.log("remark value is", this.Allotmentrequest.Remark)
    this.Allotmentrequest.ReqId = this.request.ReqId;
    this.Allotmentrequest.AllotmentStatus = 6;
    this.isSubmitted = true;
    if (this.RequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.ReqId) {
        this.Allotmentrequest.ReqId = this.ReqId
        this.Allotmentrequest.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.Allotmentrequest.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      await this.studentRequestService.AllotmentCancelData(this.Allotmentrequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetAllData();
          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }



  async onView(model: any, studentData: any) {
    
    try {
      this.ViewRequest = { ...studentData };
      this.RequestFormGroup.patchValue({
        ClassDocument: this.ViewRequest.ClassDocument,
      });
      this.viewDocumentUrl(this.ViewRequest.ClassDocument);
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }

  public file!: File;

  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];

      if (this.file) {
        //  Check file size (max 2MB)
        if (this.file.size > 2 * 1024 * 1024) {
          this.toastr.error('Select a file less than 2MB');
          return;
        }

        //  Proceed with upload
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type === "Photo") {
                this.Allotmentrequest.HostelFeesReciept = data['Data'][0]["FileName"];
                this.Allotmentrequest.Dis_HostelFeesReciept = data['Data'][0]["Dis_FileName"];
              }

              event.target.value = null; // Clear file input
            } else if (this.State === EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            } else if (this.State === EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage);
            }
          })
          .catch((error: any) => {
            console.error("Upload Error:", error);
            this.toastr.error("An error occurred while uploading the file.");
          });
      }
    } catch (Ex) {
      console.log("Exception in file upload:", Ex);
      this.toastr.error("Unexpected error occurred.");
    } finally {
      this.loaderService.requestEnded();
    }
  }



  //async onFilechange(event: any, Type: string) {
  //  try {

  //    this.file = event.target.files[0];
  //    if (this.file) {
  //      if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          
  //        if (this.file.size > 2000000) {
  //          this.toastr.error('Select less then 2MB File')
  //          return
  //        }
         
  //      }
  //      else {// type validation
  //        this.toastr.error('Select Only jpeg/jpg/png file')
  //        return
  //      }
  //      // upload to server folder
  //      this.loaderService.requestStarted();

  //      await this.commonFunctionService.UploadDocument(this.file)
  //        .then((data: any) => {
  //          data = JSON.parse(JSON.stringify(data));

  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];

  //          if (this.State == EnumStatus.Success) {
  //            if (Type == "Photo") {
  //              this.Allotmentrequest.HostelFeesReciept = data['Data'][0]["FileName"];
  //              this.Allotmentrequest.Dis_HostelFeesReciept = data['Data'][0]["Dis_FileName"];

  //            }
              
  //            event.target.value = null;
  //          }
  //          if (this.State == EnumStatus.Error) {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //          else if (this.State == EnumStatus.Warning) {
  //            this.toastr.warning(this.ErrorMessage)
  //          }
  //        });
  //    }
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    /*setTimeout(() => {*/
  //    this.loaderService.requestEnded();
  //    /*  }, 200);*/
  //  }
  //}


  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonFunctionService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            //this.request.Dis_CompanyName = '';
            this.request.HostelFeesReciept = '';
          }
          //else if (Type == "Sign") {
          //  this.requestStudent.Dis_StudentSign = '';
          //  this.requestStudent.StudentSign = '';
          //}
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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



  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
     
      this.MobileNo = this.sSOLoginDataModel.Mobileno;
      await this.sMSMailService.SendMessage(this.MobileNo, "OTP")
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


  async VerifyOTP() {
    
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.DetailsBox = false;
          this.TradeBox = true;
          this.CloseModal();
          this.GetAllData();
          this.AllotmentCancelData();

          //this.GetTradeListByCollege();

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

  //Start Section Model




  async openModalGenerateOTP(content: any, allotmentCancelData: any) {
    this.OTP = '';
    this.MobileNo = '';
    this.request = { ...allotmentCancelData };
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.MobileNo = "9649343543";
    //this.MobileNo = this.request.MobileNo;
    this.SendOTP();
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

  viewDocumentUrl(documentPath: string): any {
    
    // If you're using Angular's sanitizer for URLs
    return this.sanitizer.bypassSecurityTrustResourceUrl(documentPath);
  }


  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  exportToExcel(): void {
    const unwantedColumns = ['InstituteId','ApplicationId','StudentId','SemesterId','AllotmentStatus','BrachId','AllotmentStatus1','EndTermID'];
    const filteredData = this.StudentReqListList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'VerifiedStudentHostelAppliedReportData.xlsx');
  }
}
