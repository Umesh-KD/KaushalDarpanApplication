import { Component, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AttendanceRpt13BDataModel } from '../../../Models/ReportBasedDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

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
  public SemesterMasterList: any = []
  CenterId: number= 0
  // @ViewChild(OTPModuleComponent) childComponent!: OTPModuleComponent;

  constructor(
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
  ) {}

  async ngOnInit() {
    this.CenterId = Number( this.activatedRoute.snapshot.queryParamMap.get('centerid'));
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

      await this.commonMasterService.SemesterMaster()
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterList = data['Data'];
        this.SemesterMasterList = this.SemesterMasterList.filter((item: any) => ![7, 8, 9].includes(item.SemesterID));
      }, (error: any) => console.error(error));

    } catch (error) {
      console.error(error);
    }
  }

  async onDownload(row: any) {
    debugger
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.ExamDate = row.ExamDate;
      this.request.ShiftID = row.ShiftID;
      this.request.SemesterID = row.SemesterID;
      if((this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon) && this.CenterId > 0){
        this.request.InstituteID = this.CenterId;
      }

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
    // const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    // return `file_${timestamp}.${extension}`;
    if (!this.request.ExamDate) {
      this.toastr.error('Exam Date not selected');
      return '';
    }

    const datePart = this.request.ExamDate.split('T')[0]; // "2025-12-16

    const [yyyy, mm, dd] = datePart.split('-');
    const formattedDate = `${dd}${mm}${yyyy}`; // 16122025
    
    const instituteCode = this.getInstituteCode(this.sSOLoginDataModel.InstituteName);  
    const semestercode = this.getSemesterCode(this.request.SemesterID); 

    return `CS_Diary_${formattedDate}_${instituteCode}_${semestercode}.${extension}`;
  }

  async DailyReportBhandarForm() {
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.UserID = this.sSOLoginDataModel.UserID
      this.request.RoleID = this.sSOLoginDataModel.RoleID
      if((this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon) && this.CenterId > 0){
        this.request.InstituteID = this.CenterId;
      }
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


  getSemesterCode(semesterId: number): string {
    debugger
    const semester = this.SemesterMasterList.find(
      (s: any) => s.SemesterID === Number(semesterId)
    );
    return semester ? semester.SemesterName.charAt(0) : '';
  }

  getInstituteCode(instituteName: string): string {
    // Extract text before "-"
    return instituteName.split('-')[0].trim();
  }
 
}
