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
  CenterId: number= 0

  constructor(
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.CenterId = Number( this.activatedRoute.snapshot.queryParamMap.get('centerid'));
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
    debugger
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
      this.request.BranchCode=row.BranchCode;
      
      if((this.sSOLoginDataModel.RoleID === EnumRole.Admin || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon) && this.CenterId > 0){
        this.request.InstituteID = this.CenterId;
      }

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

  getSemesterCode(semesterId: number): string {
    debugger
    const semester = this.SemesterMasterDDL.find(
      (s: any) => s.SemesterID === Number(semesterId)
    );
  
    // Take first character from "1st Semester", "2nd Semester", etc.
    return semester ? semester.SemesterName.charAt(0) : '';
    // return semester ? semester.SemesterName.match(/\d/)?.[0] ?? '' : '';
  }
  getBranchCode(streamId: number): string {
    debugger
    const stream = this.StreamMasterDDL.find(
      (s:any) => s.StreamID === Number(streamId)
    );
  
    return stream
      ? stream.StreamName.match(/\(([^)]+)\)/)?.[1] ?? ''
      : '';
  }

  getInstituteCode(instituteName: string): string {
    return instituteName.split('-')[0].trim();
  }
  

  generateFileName(extension: string): string {
    // const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    // return `file_${timestamp}.${extension}`;
    debugger
    if (!this.request.ExamDate) {
      this.toastr.error('Exam Date not selected');
      return '';
    }
    
    const datePart = this.request.ExamDate.split('T')[0]; // "2025-12-16

    const [yyyy, mm, dd] = datePart.split('-');
    const formattedDate = `${dd}${mm}${yyyy}`; // 16122025
         
    const instituteCode = this.getInstituteCode(this.sSOLoginDataModel.InstituteName);  
    const semestercode = this.getSemesterCode(this.request.SemesterID); 
    const branchCode = this.request.BranchCode;    
    const papercode=this.request.SubjectCode;
  
    return `33_${formattedDate}_${instituteCode}_${semestercode}_${branchCode}_${papercode}.${extension}`;

  }

 
}
