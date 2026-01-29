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
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attendance-rpt-13-b',
  standalone: false,
  templateUrl: './attendance-rpt-13-b.component.html',
  styleUrl: './attendance-rpt-13-b.component.css'
})
export class AttendanceRpt13BComponent {
  public ExamShiftDDL: any = []
  public sSOLoginDataModel = new SSOLoginDataModel()
  public request = new AttendanceRpt13BDataModel()
  Report13BForm!: FormGroup;
  isSubmitted: boolean = false
  CenterId: number = 0
  CSId: number = 0

  constructor(
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.Report13BForm = this.fb.group({
      ExamDate: ['', Validators.required],
      ShiftID: ['',[DropdownValidators]],
      ExamCategoryID: ['',[DropdownValidators]],
    })
    this.CenterId = Number( this.activateRoute.snapshot.queryParamMap.get('centerid'));
    this.CSId = Number( this.activateRoute.snapshot.queryParamMap.get('csid'));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID
    this.getMasterData();
   
  }  

  get report13BForm() { return this.Report13BForm.controls; }
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


  async onDownload() {
    this.isSubmitted = true
    if(this.Report13BForm.invalid){
      this.Report13BForm.markAllAsTouched();
      return
    }
    try {
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.RoleID = this.sSOLoginDataModel.RoleID
      this.request.StudentExamType = this.request.ExamCategoryID
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      
      if((this.sSOLoginDataModel.RoleID === EnumRole.Admin
        || this.sSOLoginDataModel.RoleID === EnumRole.AdminNon
        || this.sSOLoginDataModel.RoleID === EnumRole.JDConfidential_Eng
        || this.sSOLoginDataModel.RoleID === EnumRole.JDConfidential_NonEng
        || this.sSOLoginDataModel.RoleID === EnumRole.Secretary_JD
        || this.sSOLoginDataModel.RoleID === EnumRole.Secretary_JD_NonEng)
        && this.CenterId > 0
      ) {
        this.request.InstituteID = this.CenterId
      }
      await this.reportService.AttendanceReport13B(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("AttendanceReport13B data",data)
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

  getSemesterCode(semesterId: number): string {
    debugger
    return semesterId ? semesterId.toString() : '';
  }
  getInstituteCode(instituteName: string): string {
    // Extract text before "-"
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
  
    return `Attendance_13_B_${formattedDate}_${instituteCode}`;

  }
}
