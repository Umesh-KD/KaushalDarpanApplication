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
  selector: 'app-rpt-33',
  standalone: false,
  templateUrl: './rpt-33.component.html',
  styleUrl: './rpt-33.component.css'
})
export class Rpt33Component {
  public ExamShiftDDL: any = []
  public sSOLoginDataModel = new SSOLoginDataModel()
  public request = new AttendanceRpt13BDataModel()
  public StreamMasterDDL: any = []
  public SemesterMasterDDL: any = []
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
    this.request.UserID = this.sSOLoginDataModel.UserID
    this.getMasterData();
    this.GetRport33Data()
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

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })

      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }

  formatDateToISO(dateStr: string): string {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;  // '2025-05-15'
  }

  async onDownload(row: any) {
    const formattedDate = this.formatDateToISO(row.ExamDate);
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.SemesterID = row.semesterid;
      this.request.SubjectID = row.SubjectId;
      this.request.SubjectCode = row.PaperCode;
      this.request.ShiftID = row.ExamShift;
      this.request.ExamDate = formattedDate;
      

      await this.reportService.Report33(this.request).then((data: any) => {
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

  async GetRport33Data() {
    
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.StudentExamType = 78

      
      await this.reportService.GetRport33Data(this.request).then((data: any) => {
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
}
