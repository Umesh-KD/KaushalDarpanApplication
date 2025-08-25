import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITIGenerateRollData } from '../../../../Models/ITI/ITIGenerateRollDataModels';
import { ITIGenerateEnrollData, ITIGenerateEnrollSearchModel } from '../../../../Models/ITI/ITIGenerateEnrollDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { GenerateRollNumberITIService } from '../../../../Services/ITI/ITIGenerateRoll/generate-roll-number-iti.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { ITIGenrateEnrollService } from '../../../../Services/ITI/ITIGenerateEnroll/ITIGenerateEnroll.service';
@Component({
  selector: 'app-generate-enrollment-iti',
  standalone: false,
  
  templateUrl: './generate-enrollment-iti.component.html',
  styleUrl: './generate-enrollment-iti.component.css'
})
export class GenerateEnrollmentITIComponent {
  public SearchForm!: FormGroup
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  public StudentList: ITIGenerateEnrollData[] = []
  public InstituteMasterList: any = []
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIGenerateEnrollSearchModel()
  public InitialValue: number = 0
  public UserID: number = 0
  public AllSelect: boolean = false
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isGenerateDisabled: boolean = false;
  public isReGenerateVisible: boolean = false;
  public PublishVisible: boolean = false
  public OTP: string = '';
  public GeneratedOTP: string = '';
  public MobileNo: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference

  ItiTradeList: any = [];
  public tradeSearchRequest = new ItiTradeSearchModel();
  constructor(
    private commonMasterService: CommonFunctionService,
    private GetEnrollService: ITIGenrateEnrollService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private sMSMailService: SMSMailService, private cookieService: CookieService
  ) { }

  async ngOnInit() {

    this.SearchForm = this.formBuilder.group(
      {
        ddlInstitute: [''],
        ddlSemester: [''],
        ddlStream: ['']


      })


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    this.searchRequest.StreamID = 0;
    this.GetAllData();

    
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamName().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllData() {
    try {
      this.StudentList = []
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      //call
      this.loaderService.requestStarted();
      await this.GetEnrollService.GetGenerateEnrollData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
            console.log(this.StudentList, "Studentlist")
            this.updateButtonStates()
            //table feature load
/*            this.loadInTable();*/
            //end table feature load
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

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }
  async SaveAllData() {
    try {
      //
      /*    this.refreshBranchRefValidation(true);*/
      //
      //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
      //  return console.log("error")
      //}

      const isAnySelected = this.StudentList.some(x => x.Marked)
      //if (!isAnySelected) {
      //  this.toastr.error('Please select at least one Student!');
      //  return;
      //}

      this.isSubmitted = true;
      this.loaderService.requestStarted();

      const selectedStudents = this.StudentList.filter(student => student.Marked)
      console.log(' student Subjects:', selectedStudents);

      await this.GetEnrollService.SaveEnrolledData(this.StudentList)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)


            await this.ResetControl()
            await this.GetAllData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action Short List!');
        });
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

 

  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
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




  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new ITIGenerateEnrollSearchModel()

    this.SubjectMasterDDLList = [];
    this.StudentList = [];
    this.AllSelect = false


  }


  async OnPublish() {

    this.isSubmitted = true;
    //
    /*    this.refreshBranchRefValidation(true);*/
    //
    //if (this.PlacementShortListStudentForm.invalid) {CloseViewStudentDetailsEditStudentData
    //  return console.log("error")
    //}



    try {
      this.loaderService.requestStarted();




      this.StudentList.forEach((item) => {
        item.ModifyBy = this.sSOLoginDataModel.UserID
      })

      await this.GetEnrollService.OnPublish(this.StudentList)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)


            this.CloseModal()
            await this.ResetControl()
            await this.GetAllData();


          }
          else {

            this.toastr.error(this.ErrorMessage)

          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action Short List!');
        });
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




  async VerifyOTP() {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try {
          this.OnPublish()
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
        this.toastr.warning('Invalid OTP Please Try Again');
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
      //this.sSOLoginDataModel.Mobileno = "8905268611";
      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
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



  //Start Section Model
  async openModalGenerateOTP(content: any) {


    const IsGenerated = this.StudentList.some((x) => x.temp_Enrollment == '' || x.temp_Enrollment == null)
    if (IsGenerated) {
      this.toastr.warning("Generate SRN before publishing.")
      return
    }

    const isAnySelected = this.StudentList.some(x => x.Marked)
    



    this.Swal2.Confirmation("Are you sure you want to publish?", async (result: any) => {
      // Check if the user confirmed the action
      if (result.isConfirmed) {
        this.isSubmitted = true;
        // Any additional logic or actions can be placed here if needed

        this.OTP = '';
        this.MobileNo = '';
        this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });


        this.SendOTP();

      }
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

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  //Modal Section END

  updateButtonStates() {
    
    const hasEnrollmentNumbers = this.StudentList.some((student) => student.temp_Enrollment);
    console.log(hasEnrollmentNumbers, "hasEnrollmentNumbers")
    if (hasEnrollmentNumbers) {

      this.isGenerateDisabled = true;
      this.isReGenerateVisible = true
    } else {
      this.isGenerateDisabled = false;

    }

    const allEnroll = this.StudentList.every((student) => student.temp_Enrollment)
    if (allEnroll == true) {
      this.PublishVisible = true
    }
    // Disable "Generate Enroll" button



  }


  async GetTradeListDDL() {
    try {
      this.tradeSearchRequest.CollegeID = this.searchRequest.InstituteID
      this.tradeSearchRequest.action = '_getDatabyCollege'
      this.loaderService.requestStarted();
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeList = data.Data
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
