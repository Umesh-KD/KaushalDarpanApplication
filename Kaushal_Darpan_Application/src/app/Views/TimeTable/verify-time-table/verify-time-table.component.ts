import { Component, ElementRef, ViewChild } from '@angular/core';
import { TimeTableSearchModel } from '../../../Models/TimeTableModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { TimeTableService } from '../../../Services/TimeTable/time-table.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ReportBasedModel } from '../../../Models/ReportBasedDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-time-table',
  standalone: false,
  templateUrl: './verify-time-table.component.html',
  styleUrl: './verify-time-table.component.css'
})
export class VerifyTimeTableComponent {
  public searchRequest = new TimeTableSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public TimeTableList: any = [];
  public SearchTimeTableList: any = [];
  public ExamShiftList: any = [];
  public Table_SearchText: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public AllSelect: boolean = false;
  public TimeTableID: number = 0
  public TimeTableBranchSubList: any = []
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public ddlRollListStatus: number = 0
  public Status: number = 0
  public _enumRole = EnumRole
  public _RollListStatus = EnumEnrollNoStatus;
  public _GlobalConstants = GlobalConstants
  public tablerequest = new ReportBasedModel();
  constructor(
    private loaderService: LoaderService,
    private TimeTableService: TimeTableService,
    private commonMasterService: CommonFunctionService,
    private modalService: NgbModal,
    private activeroute: ActivatedRoute,
    private toaster:ToastrService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.Status = Number(this.activeroute.snapshot.paramMap.get('id') ?? 0)
    if (this.Status === 0) {
      this.Status = EnumEnrollNoStatus.Generated
    }
      
    this.GetExamShift()
    this.GetTimeTableList();
  }

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
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


  async GetTimeTableList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.Status = this.Status
    try {
      
      this.loaderService.requestStarted();
      await this.TimeTableService.VerificationTimeTableList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableList = data['Data'];
          this.SearchTimeTableList = [...data['Data']];
          console.log("TimeTableList",this.TimeTableList)
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

  ResetControl() {
    this.searchRequest = new TimeTableSearchModel()
    this.GetTimeTableList();
  }


  async ViewandUpdate(content: any, id: number) {
    this.TimeTableID = id
    await this.GetTimeTableByID(id)
   
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });


  }


  async GetTimeTableByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.TimeTableService.GetTimeTableByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TimeTableBranchSubList = data.Data

          console.log("TimeTableBranchSubList", this.TimeTableBranchSubList)

        }, (error: any) => console.error(error));
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


  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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


  async VerifyRollNumber() {
    try {

      


      if (this.Status == EnumEnrollNoStatus.Reverted) {
        const isAnySelected = this.TimeTableList.some((x: any) => x.Selected)
        if (!isAnySelected) {
          this.toaster.error('Please select at least one Item!');
          return;
        }
      }

      if (this.Status == EnumEnrollNoStatus.Verified) {
        var Selected = this.TimeTableList.filter((x: any) => x.Selected == true)
      } else {
        var Selected = this.TimeTableList
      }

      Selected.forEach((e: any) => {
        e.Status = this.ddlRollListStatus, e.ModifyBy = this.sSOLoginDataModel.UserID, e.EndTermID = this.sSOLoginDataModel.EndTermID,
          e.RoleID = this.sSOLoginDataModel.RoleID, e.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng,
          e.ModuleID = this.sSOLoginDataModel.Eng_NonEng==1 ?5:6
      })

      this.loaderService.requestStarted();
      //call
      await this.TimeTableService.SaveTimeTableWorkflow(Selected).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toaster.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.GetTimeTableList()

            this.TimeTableList.forEach((item:any) => item.Selected = false);
            this.AllSelect = false

          } else {
            this.toaster.error(data.ErrorMessage)
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

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.TimeTableList = isChecked;
    for (let item of this.TimeTableList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }


  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      console.log("otp verified on the page")

      this.VerifyRollNumber()
    })
  }

  async DownloadTimeTable1(fileType: 'pdf' | 'word') {
    try {
      this.loaderService.requestStarted();

      this.tablerequest.Action = this.searchRequest.SemesterID == 1 ? '_GetSemester' : '_GetYearly';
      this.tablerequest.SemesterID = this.searchRequest.SemesterID;
      this.tablerequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.tablerequest.ExamType = this.searchRequest.SemesterID;
      this.tablerequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.tablerequest.FileType = fileType; // 👈 Add file type to request

      await this.reportService.DownloadTimeTable(this.tablerequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          
          if (data.State == EnumStatus.Success) {
            const fileName = `timetable.${fileType === 'pdf' ? 'pdf' : 'docx'}`;
            this.DownloadFile(data.Data, fileName);
          } else {
            this.toaster.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
  const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

  const fileExtension = FileName.split('.').pop() || 'pdf'; 

  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
    const downloadLink = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    downloadLink.href = url;

    downloadLink.download = DownloadfileName ? `${DownloadfileName}.${fileExtension}` : FileName;

    downloadLink.click();
    window.URL.revokeObjectURL(url);
  });
 }
  generateFileName(extension: string): string
  {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    const d =this.searchRequest.SemesterID == 1 ? 'TimeTableSemesterReport' : 'TimeTableYearly'
    const ctype = this.sSOLoginDataModel.Eng_NonEng == 1 ? 'Engineering' : 'Non_Engineering'
    return `${d}${ctype}.${extension}`;
  }
}
