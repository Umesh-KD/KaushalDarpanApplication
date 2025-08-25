import { Component, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AttendanceRpt13BDataModel } from '../../../Models/ReportBasedDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-daily-report-bhandar-form1',
  standalone: false,
  templateUrl: './daily-report-bhandar-form1.component.html',
  styleUrl: './daily-report-bhandar-form1.component.css'
})
export class DailyReportBhandarForm1Component {
  public ExamShiftDDL: any = []
  public sSOLoginDataModel = new SSOLoginDataModel()
  public request = new AttendanceRpt13BDataModel()
  public TableData: any = []
  // @ViewChild(OTPModuleComponent) childComponent!: OTPModuleComponent;

  constructor(
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
  ) {}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID
    this.getMasterData();
    this.DailyReportBhandarForm()
   
  }

  // openOTP(MobileNo: any) {
  //   this.childComponent.MobileNo = "";
  //   this.childComponent.OpenOTPPopup();

  //   this.childComponent.onVerified.subscribe(() => {
  //     console.log("otp verified on the page")
  //   })
  // }

  

  async getMasterData() {
    try {
      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }

  async onDownload(row: any) {
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.ExamDate = row.ExamDate;
      this.request.ShiftID = row.ShiftID;
      this.request.SemesterID = row.SemesterID;

      // this.request.StudentExamType = 78
      await this.reportService.DailyReport_BhandarForm1(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.DownloadFile(data.Data)
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error)
    } 
  }

  DownloadFile(FileName: string): void {

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

  async DailyReportBhandarForm() {
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.UserID = this.sSOLoginDataModel.UserID
      this.request.RoleID = this.sSOLoginDataModel.RoleID
      await this.reportService.DailyReportBhandarForm(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.TableData = data.Data
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
}
