import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { CenterAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { VerifyRollNumberList } from '../../../Models/GenerateRollDataModels';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { ITICenterAllocationtDataModels } from '../../../Models/ITI/ITICenterAllocationDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ItiAssignExaminerService } from '../../../Services/ITIAssignExaminer/iti-assign-examiner.service';
import { ItiAssignExaminerSearchModel } from '../../../Models/ITI/AssignExaminerDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
import { BlankReportModel } from '../../../Models/ExamMasterDataModel';

@Component({
  selector: 'app-center-practical-examiner',
  standalone: false,
  templateUrl: './center-practical-examiner.component.html',
  styleUrl: './center-practical-examiner.component.css'
})
export class CenterPracticalExaminerComponent {
  commonMasterService = inject(CommonFunctionService);
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  Swal2 = inject(SweetAlert2);
  assignexaminerservice = inject(ItiAssignExaminerService);

  ActivatedRoute = inject(ActivatedRoute);
  public requestSSoApi = new CommonVerifierApiDataModel();
  public Reportsearchmodel = new BlankReportModel()
  toastr = inject(ToastrService);
  reportservice = inject(ReportService);
  loaderService = inject(LoaderService);
  modalService = inject(NgbModal);
  http = inject(HttpClient);
  appsettingConfig = inject(AppsettingService);
  @ViewChild('content') content: ElementRef | any;
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  assignedInstitutes: any = [];
  assignedInstitutesReady: boolean = false;
  closeResult: string | undefined;
  Table_SearchText: string = '';
  AssignExaminerMasterList: any[] = [];
  BackupCenterMasterList: any[] = [];
  searchRequest = new ItiAssignExaminerSearchModel();
  public CourseType: number = 0
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  request = new ITIAssignPracticaLExaminer();
  sSOLoginDataModel = new SSOLoginDataModel();

  SelectCenterMaster: any;
  GetStatusCenterSuperintendentData: any; UserID: number = 0;
  Status: number = 0
  PublishFileName: string = ''
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(...args: unknown[]);
  constructor() { }
  _EnumRole = EnumRole;
  async ngOnInit() {

    this.CourseType = Number(this.ActivatedRoute.snapshot.queryParamMap.get('id')?.toString())

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.CourseTypeID = this.CourseType;

    /*   this.GetStatusCenterSuperintendent();*/
    await this.GetAssignexaminer();

  }

  async GetAssignexaminer() {
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.Userid = this.sSOLoginDataModel.UserID
    this.searchRequest.DistrictID = this.sSOLoginDataModel.DistrictID
    if (this.sSOLoginDataModel.RoleID == 97) {
      this.searchRequest.Eng_NonEng =1
    }
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
    try {
      this.loaderService.requestStarted();
      await this.assignexaminerservice.GetCenterPracticalexaminer(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssignExaminerMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.AssignExaminerMasterList];
          console.log(data['Data'])
          //this.Status = data['Data'][0]['Status']
          //this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onSearchClick() {
    const searchCriteria: any = {
      CCCode: this.searchByCenterCode ? this.searchByCenterCode.trim().toLowerCase() : '',
      CenterName: this.searchByCenterName.trim().toLowerCase(),
    };
    this.AssignExaminerMasterList = this.BackupCenterMasterList.filter((center: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }

        const centerValue = center[key];

        // Handle number comparison by converting to string
        if (typeof centerValue === 'number') {
          return centerValue.toString().toLowerCase().includes(searchValue);
        }

        if (typeof centerValue === 'string') {
          return centerValue.toLowerCase().includes(searchValue);
        }

        return centerValue === searchValue;
      });
    });
  }

  resetList() {
    this.AssignExaminerMasterList = [...this.BackupCenterMasterList];
    this.searchByCenterCode = '';
    this.searchByCenterName = '';
  }


  

  CloseModal() {
    this.modalService.dismissAll();
    // Reset dropdown ready flag
    this.assignedInstitutesReady = false;
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


  //downloadPDF(type: any = '') {

  //  //if (type != 'order') {

  //  //  this.DownloadFile(this.PublishFileName, 'file download')

  //  //  return
  //  //}
  //  this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //  this.searchRequest.Eng_NonEng = this.CourseType;
  //  try {
  //    this.assignexaminerservice.DownloadItiPracticalExaminer(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //          this.GetAssignexaminer();
  //          /*this.GenerateCenterSuperintendentOrder(FileName, DownloadfileName, type)*/
  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, error => console.error(error));

  //  } catch (Ex) {
  //    console.log(Ex);
  //  }

  //}

  DownloadFile(FileName: string, DownloadfileName: string,Action:number=0): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      if (Action == 0) {
        downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      } else if (Action == 1) {
        downloadLink.download = this.generateAttendenceFileName(DownloadfileName); // Use DownloadfileName
      } else {
        downloadLink.download = this.generateMarkingFileName(DownloadfileName); // Use DownloadfileName
      }

      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `PracticalExaminerStudentReport_${timestamp}.pdf`;
  }

  generateAttendenceFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `PracticalExaminerAttendenceReport_${timestamp}.pdf`;
  }
  generateMarkingFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `PracticalExaminerMarksReport_${timestamp}.pdf`;
  }


  async OnDownloadReport(CenterID: number, SemesterID: number, ExaminerID: number, Subject:string) {

    this.Reportsearchmodel.DepartmentID = EnumDepartment.ITI;
    this.Reportsearchmodel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.Reportsearchmodel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.Reportsearchmodel.InstituteID = this.sSOLoginDataModel.InstituteID
    this.Reportsearchmodel.DistrictID = this.sSOLoginDataModel.DistrictID
    this.Reportsearchmodel.UserID = ExaminerID
    this.Reportsearchmodel.CenterID = CenterID
    this.Reportsearchmodel.SemesterID = SemesterID
    this.Reportsearchmodel.SubjectCode = Subject
    if (this.sSOLoginDataModel.RoleID == 97) {
      this.Reportsearchmodel.Eng_NonEng = 1
    }
    try {
      this.loaderService.requestStarted();
      await this.reportservice.PracticalExamAttendenceReport(this.Reportsearchmodel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        

          console.log(data['Data'])

          this.DownloadFile(data['Data'], 'file download',0)

          //this.Status = data['Data'][0]['Status']
          //this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }


  async OnDownloadMarkingReport(CenterID: number, SemesterID: number, ExaminerID: number, Subject: string, InstituteID: number = 0) {

    this.Reportsearchmodel.DepartmentID = EnumDepartment.ITI;
    this.Reportsearchmodel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.Reportsearchmodel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.Reportsearchmodel.InstituteID = this.sSOLoginDataModel.InstituteID
    this.Reportsearchmodel.DistrictID = this.sSOLoginDataModel.DistrictID
    this.Reportsearchmodel.UserID = ExaminerID
    this.Reportsearchmodel.CenterID = CenterID
    this.Reportsearchmodel.SemesterID = SemesterID
    this.Reportsearchmodel.SubjectCode = Subject
    if (this.sSOLoginDataModel.RoleID == 97) {
      this.Reportsearchmodel.Eng_NonEng = 1

      this.Reportsearchmodel.InstituteID = InstituteID
    }
    try {
      this.loaderService.requestStarted();
      await this.reportservice.PracticalExamMarkingReport(this.Reportsearchmodel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));


          console.log(data['Data'])

          this.DownloadFile(data['Data'], 'file download',2)

          //this.Status = data['Data'][0]['Status']
          //this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }


  async OnDownloadAttendenceReport(CenterID: number, SemesterID: number, ExaminerID: number, Subject: string,InstituteID:number=0) {

    this.Reportsearchmodel.DepartmentID = EnumDepartment.ITI;
    this.Reportsearchmodel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.Reportsearchmodel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.Reportsearchmodel.InstituteID = this.sSOLoginDataModel.InstituteID
    this.Reportsearchmodel.DistrictID = this.sSOLoginDataModel.DistrictID 
    this.Reportsearchmodel.UserID = ExaminerID
    this.Reportsearchmodel.CenterID = CenterID
    this.Reportsearchmodel.SemesterID = SemesterID
    this.Reportsearchmodel.SubjectCode = Subject
    if (this.sSOLoginDataModel.RoleID == 97) {
      this.Reportsearchmodel.Eng_NonEng = 1
      this.Reportsearchmodel.InstituteID = InstituteID
    }
    try {
      this.loaderService.requestStarted();
      await this.reportservice.PracticalExamReport(this.Reportsearchmodel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));


          console.log(data['Data'])

          this.DownloadFile(data['Data'], 'file download', 2)

          //this.Status = data['Data'][0]['Status']
          //this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }


}
