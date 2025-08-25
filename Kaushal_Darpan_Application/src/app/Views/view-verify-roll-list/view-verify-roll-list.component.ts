import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EnumEnrollNoStatus, EnumRole, EnumRollNoStatus, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { DownloadnRollNoModel, GenerateRollSearchModel, VerifyRollNumberList } from '../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GetRollService } from '../../Services/GenerateRoll/generate-roll.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../Services/Report/report.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-verify-roll-list',
  standalone: false,
  templateUrl: './view-verify-roll-list.component.html',
  styleUrl: './view-verify-roll-list.component.css'
})
export class ViewVerifyRollListComponent {
  public SearchForm!: FormGroup;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StudentTypeList: any[] = [];
  public ExamList: any[] = [];
  public Table_SearchText: any = '';
  public VerifyRollList: VerifyRollNumberList[] = [];
  public InstituteMasterList: any = [];
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new GenerateRollSearchModel();
  public UserID: number = 0;
  public currentStatus: number = 0;
  public _RollListStatus = EnumEnrollNoStatus;
  public _GlobalConstants = GlobalConstants
  public AllSelect: boolean = false;
  public ShowForwardedButton: boolean = false;
  public ShowGenrateRollNo: boolean = true;
  public ShowPublishButton: boolean = false;
  public Enrollnostatus: number = 0;
  public RollStatusList: any[] = [];
  public _EnumEnRollStatus = EnumEnrollNoStatus
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public ddlRollListStatus: number = 0
  public _enumRole = EnumRole
  public IsRegistrarVerified: boolean = false
  public IsExaminationVerified: boolean = false
  public InstituteMasterDDLList: any[] = [];

  //table feature default
  public paginatedInTableData: any[] = []; //copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = '50';
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public SearchReqForEnroll = new GenerateRollSearchModel()
  public Status: number = 0
  public insDisabled: boolean = false;

  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  closeResult: string | undefined;

  timeLeft: number = GlobalConstants.DefaultTimerOTP; // Total countdown time in seconds (2 minutes)
  showResendButton: boolean = false; // Whether to show the "Resend OTP" button
  private interval: any; // Holds the interval reference
  public MobileNo: number = 0;
  public OTP: string = '';
  public GeneratedOTP: string = '';
  constructor(
    private commonMasterService: CommonFunctionService,
    private GetRollService: GetRollService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private reportService: ReportService, private toastrService: ToastrService, private appsettingConfig: AppsettingService, private http: HttpClient, private Swal2: SweetAlert2,
    private getRollService: GetRollService,
    private sMSMailService: SMSMailService,
    private modalService: NgbModal,
    private activeroute: ActivatedRoute
  ) { }

  async ngOnInit() {

    //debugger
    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );
    let _status = Number(this.activeroute.snapshot.paramMap.get('id')?.toString());
    if (!isNaN(_status)) {
      this.Status = EnumEnrollNoStatus.Generated
    }
    this.UserID = this.sSOLoginDataModel.UserID;
    this.MobileNo = Number(this.sSOLoginDataModel.Mobileno ?? 0)

    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.insDisabled = true;
    }

    await this.getInstituteMasterList();
    await this.GetAllData();
  }

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })

      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterDDLList = data['Data'];
        }, (error: any) => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetFilter() {
    this.searchRequest.InstituteID = 0 
    this.searchRequest.SemesterID = 0
    this.GetAllData()
  }

  async GetAllData() {
    debugger
    try {

      this.VerifyRollList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.action = "_VerifyRollListPdfOnlyAdmin"
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {

        this.searchRequest.Status = 13;
      }
      // else if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge && this.Status == EnumEnrollNoStatus.Forwarded || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng && this.Status == EnumEnrollNoStatus.Forwarded) {
      //  this.searchRequest.IsExaminationVerified = false
      //  this.searchRequest.action = "_VerifyRollListPdfReportExaminer"
      //  this.searchRequest.Status = this.Status

      //} else if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge && this.Status == EnumEnrollNoStatus.Verified || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng && this.Status == EnumEnrollNoStatus.Verified) {
      //  this.searchRequest.IsExaminationVerified = true
      //  this.searchRequest.action = "_VerifyRollListPdfReportExaminer"
      //} else if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge && this.Status == EnumEnrollNoStatus.Reverted || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng && this.Status == EnumEnrollNoStatus.Reverted) {
      //  this.searchRequest.Status = this.Status

      //} else if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge && this.Status == EnumEnrollNoStatus.Published || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng && this.Status == EnumEnrollNoStatus.Published) {
      //  this.searchRequest.Status = this.Status
      
      //}



      //else if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar && this.Status == EnumEnrollNoStatus.Forwarded || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng && this.Status == EnumEnrollNoStatus.Forwarded) {
      //  this.searchRequest.IsRegistrarVerified = false
      //  this.searchRequest.action = "_VerifyRollListPdfReportRegistrar"
      //  this.searchRequest.Status = this.Status

      //} else if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar && this.Status == EnumEnrollNoStatus.Verified || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng && this.Status == EnumEnrollNoStatus.Verified) {
      //  this.searchRequest.IsRegistrarVerified = true
      //  this.searchRequest.action = "_VerifyRollListPdfReportRegistrar"
      //  /*     this.searchRequest.Status = this.Status*/
      //} else if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar && this.Status == EnumEnrollNoStatus.Reverted || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng && this.Status == EnumEnrollNoStatus.Reverted) {
      //  this.searchRequest.Status = this.Status
      //} else if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar && this.Status == EnumEnrollNoStatus.Published || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng && this.Status == EnumEnrollNoStatus.Published) {
      //  this.searchRequest.Status = this.Status
      //}

      this.loaderService.requestStarted();
      //call
      await this.GetRollService.VerifyRollListPdf(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.VerifyRollList = data['Data'];

            if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng) {
              this.VerifyRollList = this.VerifyRollList.filter(x => x.Status != 0)
            }
     /*       this.GetVerifyRollData();*/
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async downloadData(request: DownloadnRollNoModel[]) {
    try {
      
      request.forEach(e => e.DepartmentID = this.sSOLoginDataModel.DepartmentID)
      this.loaderService.requestStarted();
      await this.reportService.DownloadStudentRollNumber(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "Data");
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastrService.error(data.ErrorMessage)
            //    data.ErrorMessage
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

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }




  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.VerifyRollList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }

  async GetVerifyRollData() {
    try {

      //session
      this.SearchReqForEnroll.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchReqForEnroll.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchReqForEnroll.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchReqForEnroll.action = "_GetStatusVerifyAdmidCardListPdf"
        
 
/*      this.SearchReqForEnroll.Status = EnumEnrollNoStatus.Forwarded;*/
      this.SearchReqForEnroll.PDFType = 1;
/*      this.SearchReqForEnroll.ModuleID = 2;*/

      this.loaderService.requestStarted();
      //call
      await this.getRollService.GetVerifyRollData(this.SearchReqForEnroll).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.RollStatusList = data['Data'];
            if (this.RollStatusList?.length > 0) {
              this.ShowHideButtons(this.RollStatusList[0].Status);
            }
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  ShowHideButtons(status: number) {
    
    this.Enrollnostatus = status;
    if (status == EnumEnrollNoStatus.Generated) {
      this.ShowForwardedButton = true;
    }
    else if (status == EnumEnrollNoStatus.Forwarded) {
      this.ShowGenrateRollNo = false;
      this.ShowForwardedButton = false;
    }
    else if (status == EnumEnrollNoStatus.Verified) {
      this.ShowPublishButton = true;
      this.ShowGenrateRollNo = false;
    }
    else if (status == EnumEnrollNoStatus.Reverted) {
      this.ShowGenrateRollNo = true;
    }
    else if (status == EnumEnrollNoStatus.Published) {
      this.ShowPublishButton = false;
      this.ShowGenrateRollNo = false;
    }
  }

 

  async SaveApplicationWorkFlow(Action: number) {
    try
    {
      //session

      //if (Action == EnumEnrollNoStatus.Verified) {
      //  if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
      //    if (this.VerifyRollList.some(x => x.Selected && x.Status == EnumEnrollNoStatus.Verified)) {
      //      this.toastrService.error("Cannot forwad Verified Roll item")
      //      return
      //    }
      //  }
      //}
     
      var Selected: VerifyRollNumberList[] = []

      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon ||
        this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge && Action == EnumEnrollNoStatus.Reverted ||
        this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng && Action == EnumEnrollNoStatus.Reverted
        || this.sSOLoginDataModel.RoleID == EnumRole.Registrar && Action == EnumEnrollNoStatus.Reverted ||
        this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng && Action == EnumEnrollNoStatus.Reverted) {
        const isAnySelected = this.VerifyRollList.some(x => x.Selected)
        if (!isAnySelected) {
          this.toastrService.error('Please select at least one College!');
          return;
        }

      }
      
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon || Action == EnumEnrollNoStatus.Reverted || Action == EnumEnrollNoStatus.Verified
      
      ) {
        Selected = this.VerifyRollList.filter(e => e.Selected == true)
      } else{
        Selected = this.VerifyRollList
      }

     
   


      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin && Action == EnumEnrollNoStatus.Forwarded || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon && Action == EnumEnrollNoStatus.Forwarded) {
        this.IsExaminationVerified = false
        this.IsRegistrarVerified = false

      }
      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin && Action == EnumEnrollNoStatus.Published || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon && Action == EnumEnrollNoStatus.Published) {
        this.IsExaminationVerified = true;
        this.IsRegistrarVerified = true;

      }



      if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge && Action == EnumEnrollNoStatus.Verified || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng && Action == EnumEnrollNoStatus.Verified) {
        this.IsExaminationVerified = true


      }

      if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar && Action == EnumEnrollNoStatus.Verified || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng && Action == EnumEnrollNoStatus.Verified) {
        this.IsRegistrarVerified = true


      }


      if (this.sSOLoginDataModel.RoleID == EnumRole.Admin || this.sSOLoginDataModel.RoleID == EnumRole.AdminNon) {
        Selected.forEach(e => {
          e.UserID = this.sSOLoginDataModel.UserID,
            e.Status = Action,
            e.EndTermID = this.sSOLoginDataModel.EndTermID,
            e.RoleID = this.sSOLoginDataModel.RoleID
          e.ModuleID = 3,
            e.IsExaminationVerified = this.IsExaminationVerified,
            e.IsRegistrarVerified = this.IsRegistrarVerified

        })
      }
      if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng) {
         Selected.forEach(e => {
          e.UserID = this.sSOLoginDataModel.UserID,
            e.Status = Action,
            e.EndTermID = this.sSOLoginDataModel.EndTermID,
            e.RoleID = this.sSOLoginDataModel.RoleID
          e.ModuleID = 3,
         
            e.IsRegistrarVerified = this.IsRegistrarVerified

        })
      
      }

      if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng) {
        Selected.forEach(e => {
          e.UserID = this.sSOLoginDataModel.UserID,
            e.Status = Action,
            e.EndTermID = this.sSOLoginDataModel.EndTermID,
            e.RoleID = this.sSOLoginDataModel.RoleID
          e.ModuleID = 3,

            e.IsExaminationVerified = this.IsExaminationVerified

        })

      }



      if (this.sSOLoginDataModel.RoleID == EnumRole.Registrar || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge || this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge_NonEng || this.sSOLoginDataModel.RoleID == EnumRole.Registrar_NonEng) {
        Selected.forEach(e => {
          if (e.IsExaminationVerified == true && e.IsRegistrarVerified == true && e.Status == EnumEnrollNoStatus.Verified) {
            e.Status = EnumEnrollNoStatus.Verified

          } else if (e.IsExaminationVerified == false && e.Status == EnumEnrollNoStatus.Verified || e.IsRegistrarVerified == false && e.Status == EnumEnrollNoStatus.Verified) {
            e.Status = EnumEnrollNoStatus.Forwarded
          } else {
            e.Status = Action
            e.IsExaminationVerified = false
            e.IsRegistrarVerified = false

          }
        })

      }
      /*      this.SearchReqForEnroll.action = "_GenerateRollNumbers"*/

      


      this.loaderService.requestStarted();
      //call
      await this.getRollService.SaveWorkflow(Selected).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success)
          {
            this.toastrService.success(this.Message)
            /*    this.CloseOTPModal()*/
        
            this.CloseOTPModal()
            /*            this.toastrService.success(data.Message)*/
            this.GetAllData()
            this.AllSelect = false;
            this.VerifyRollList.forEach(item => item.Selected = false);


     
          } else
          {
            this.toastrService.error(data.ErrorMessage)
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  VerifyRollNumber()
  {

    if (this.ddlRollListStatus > 0) {
      if (this.ddlRollListStatus == EnumEnrollNoStatus.Reverted)
      {
        this.Swal2.Confirmation("Are you sure you want to revert Roll list?", async (result: any) => {
          // Check if the user confirmed the action
          if (result.isConfirmed) {
            this.SaveApplicationWorkFlow(EnumEnrollNoStatus.Reverted);
          }
        });
      }

      if (this.ddlRollListStatus == EnumEnrollNoStatus.Verified) {

        if (this.currentStatus == EnumEnrollNoStatus.Published) {

          this.Swal2.Info('The Enroll number has already been published and cannot be verified again.');

        }
        else {
          this.Swal2.Confirmation("Are you sure you want to verified Roll list?", async (result: any) => {
            // Check if the user confirmed the action
            if (result.isConfirmed) {
              this.openModalGenerateOTP(this.modal_GenrateOTP);
            }
          });
        }

        //this.ChangeRollNoStatus("_UpdateStatusVerify", EnumRollNoStatus.Verified);
      }


    }
    else {

      this.toastrService.error('please select status')
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

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




  async VerifyOTP()
  {
    if (this.OTP.length > 0) {
      if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
        try
        {
          //Call Function
          this.SaveApplicationWorkFlow(EnumEnrollNoStatus.Verified);

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
        this.toastrService.warning('Invalid OTP Please Try Again');
      }
    }
    else {
      this.toastrService.warning('Please Enter OTP');
    }
  }




  //async VerifyOTPPublish() {
  //  if (this.OTP.length > 0) {
  //    if ((this.OTP == GlobalConstants.DefaultOTP) || (this.OTP == this.GeneratedOTP)) {
  //      try {
  //        //Call Function
  //        this.SaveApplicationWorkFlow(EnumEnrollNoStatus.Published);

  //      }
  //      catch (ex) {
  //        console.log(ex);
  //      }
  //      finally {
  //        setTimeout(() => {
  //          this.loaderService.requestEnded();
  //        }, 200);
  //      }


  //    }
  //    else {
  //      this.toastrService.warning('Invalid OTP Please Try Again');
  //    }
  //  }
  //  else {
  //    this.toastrService.warning('Please Enter OTP');
  //  }
  //}






  async SendOTP(isResend?: boolean) {
    try {
      this.GeneratedOTP = "";
      this.loaderService.requestStarted();
      //this.sSOLoginDataModel.Mobileno = "7737348604";

      await this.sMSMailService.SendMessage(this.sSOLoginDataModel.Mobileno, "OTP")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.startTimer();
            //open modal popup
            this.GeneratedOTP = data['Data'];
            if (isResend) {
              this.toastrService.success('OTP resent successfully');
            }
          }
          else {
            this.toastrService.warning('Something went wrong');
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
  async openModalGenerateOTP(content: any)
  {
    const isAnySelected = this.VerifyRollList.some(x => x.Selected)
    //if (!isAnySelected) {
    //  this.toastrService.error('Please select at least one College!');
    //  return;
    //}

    this.resetOTPControls();
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  
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


  CloseOTPModal() {

    this.modalService.dismissAll();
  }
}
