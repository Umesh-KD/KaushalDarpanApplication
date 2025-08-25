import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../Services/Report/report.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { AttendanceRpt23DataModel } from '../../../Models/ReportBasedDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumRole, GlobalConstants } from '../../../Common/GlobalConstants';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';

@Component({
  selector: 'app-report23',
  templateUrl: './report23.component.html',
  styleUrl: './report23.component.css',
  standalone: false
})
export class Report23Component {
  public sSOLoginDataModel = new SSOLoginDataModel()
  Report23Form!: FormGroup;
  isSubmitted: boolean = false
  request = new AttendanceRpt23DataModel();
  ExamShiftDDL: any = []
  SubjectMasterDDLList: any = []
  StreamMasterDDLList: any = []
  SemesterMasterDDLList: any = []
  CenterMasterDDLList: any = []
  centerSearchReq = new RequestBaseModel();
  _EnumRole = EnumRole;
  public InstituteMasterDDLList: any = []

  constructor(
    private commonMasterService: CommonFunctionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loaderService: LoaderService,
  ) {}

  async ngOnInit() {
    this.Report23Form = this.fb.group({
      ExamDate: ['', Validators.required],
      ShiftID: ['',[DropdownValidators]],
      SubjectID: ['',[DropdownValidators]],
      SemesterID: ['',[DropdownValidators]],
      StreamID: ['',[DropdownValidators]],
      InstituteID: [''],
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetExamShiftData();
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.getCenterMasterList();
   
  } 

  get report23Form() { return this.Report23Form.controls; }

  async getCenterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("InstituteMasterDDLList", this.InstituteMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetExamShiftData() {
    try {
      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
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

  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
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

  async ddlSemester_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.request.StreamID!, this.sSOLoginDataModel.DepartmentID, this.request.SemesterID,)
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

  async onSubmit() {
    this.isSubmitted = true;
    if(this.Report23Form.invalid){
      this.toastr.error("Please fill all the required fields")
      return
    }
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    if(this.sSOLoginDataModel.RoleID == EnumRole.Invigilator || this.sSOLoginDataModel.RoleID == EnumRole.Invigilator_NonEng){
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID
    }
    
    try {
      this.loaderService.requestStarted();
      await this.reportService.Report23(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DownloadFile(data.Data)
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
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

  onResetControl() {
    this.request.StreamID = 0;
    this.request.SemesterID = 0;
    this.request.SubjectID = 0;
    this.request.ExamDate = '';
    this.request.ShiftID = 0;
    this.request.ExamCategoryID = 0
  }
}
