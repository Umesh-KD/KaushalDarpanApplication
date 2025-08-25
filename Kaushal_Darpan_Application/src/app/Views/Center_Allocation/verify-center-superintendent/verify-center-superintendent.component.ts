import { HttpClient } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumEnrollNoStatus, GlobalConstants, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { VerifyRollNumberList, GenerateRollSearchModel, DownloadnRollNoModel } from '../../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-verify-center-superintendent',
  standalone: false,
  templateUrl: './verify-center-superintendent.component.html',
  styleUrl: './verify-center-superintendent.component.css'
})
export class VerifyCenterSuperintendentComponent {
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
  public Status:number=0

  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  closeResult: string | undefined;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

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
    private reportService: ReportService, 
    private toastrService: ToastrService, 
    private appsettingConfig: AppsettingService, 
    private http: HttpClient, 
    private Swal2: SweetAlert2,
    private getRollService: GetRollService,
    private activeroute: ActivatedRoute
  ) { }

  async ngOnInit() {


    this.sSOLoginDataModel = await JSON.parse(
      String(localStorage.getItem('SSOLoginUser'))
    );
    this.Status = Number(this.activeroute.snapshot.paramMap.get('id') ?? 0)
    if (this.Status === 0) {
      this.Status = EnumEnrollNoStatus.Generated
    }

    this.UserID = this.sSOLoginDataModel.UserID;
    this.MobileNo = Number(this.sSOLoginDataModel.Mobileno ?? 0)
    await this.GetAllData()
  }

  async ResetFilter() {
    this.searchRequest.InstituteID = 0 
    this.searchRequest.SemesterID = 0
    this.GetAllData()
  }

  async GetAllData() {
    try {

      this.VerifyRollList = [];
      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.action = "_VerifyCenterSuperintendentPdf"
      this.searchRequest.Status = this.Status


      this.loaderService.requestStarted();
      //call
      await this.GetRollService.VerifyRollListPdf(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.VerifyRollList = data['Data'];

            if (this.sSOLoginDataModel.RoleID == EnumRole.ExaminationIncharge) {
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
      this.SearchReqForEnroll.PDFType = 4;
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
    
    try {
      var Selected: VerifyRollNumberList[] = []

      const isAnySelected = this.VerifyRollList.some(x => x.Selected)
      if (!isAnySelected) {
        this.toastrService.error('Please select at least one College!');
        return;
      }

      Selected = this.VerifyRollList.filter(e => e.Selected == true)

      Selected.forEach(e => {
        e.UserID = this.sSOLoginDataModel.UserID,
        e.Status = Action,
        e.EndTermID = this.sSOLoginDataModel.EndTermID,
        e.RoleID = this.sSOLoginDataModel.RoleID
      })

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
        
            // this.CloseOTPModal()
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

  VerifyRollNumber() {

    if (this.ddlRollListStatus > 0) {
      if (this.ddlRollListStatus == EnumEnrollNoStatus.Reverted)
      {
        this.Swal2.Confirmation("Are you sure you want to revert?", async (result: any) => {
          // Check if the user confirmed the action
          if (result.isConfirmed) {
            this.SaveApplicationWorkFlow(EnumEnrollNoStatus.Reverted);
          }
        });
      }

      if (this.ddlRollListStatus == EnumEnrollNoStatus.Verified) {
        this.Swal2.Confirmation(`Are you sure you want to verify ? <br> Once You verify then it can't be reverted`, async (result: any) => {
            // Check if the user confirmed the action
            if (result.isConfirmed) {
              this.GenerateOTP_Verify();
            }
          }
        );

      }
    } else {
      this.toastrService.error('please select status')
    }
  }

  GenerateOTP_Verify() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.SaveApplicationWorkFlow(EnumEnrollNoStatus.Verified);
    })
  }
}
