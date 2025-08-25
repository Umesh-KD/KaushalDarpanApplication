
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
import { ItiAssignExaminerSearchModel, ITIPracticalExaminerSearchFilters } from '../../../Models/ITI/AssignExaminerDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
@Component({
  selector: 'app-practical-examiner-undertaking',
  standalone: false,
  templateUrl: './practical-examiner-undertaking.component.html',
  styleUrl: './practical-examiner-undertaking.component.css'
})
export class PracticalExaminerUndertakingComponent {
  commonMasterService = inject(CommonFunctionService);

  Swal2 = inject(SweetAlert2);
  assignexaminerservice = inject(ItiAssignExaminerService);
  ActivatedRoute = inject(ActivatedRoute);
  public requestSSoApi = new CommonVerifierApiDataModel();

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
  searchRequest = new ITIPracticalExaminerSearchFilters();
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

    if (this.sSOLoginDataModel.RoleID == 98 || this.sSOLoginDataModel.RoleID == 92) {
     await this.GetPracticalExaminerRelivingByUserId();
    } else {
      await this.GetAssignexaminer();
    }

    /*   this.GetStatusCenterSuperintendent();*/
    //await this.GetAssignexaminer();

  }

  async GetAssignexaminer() {
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID

    try {
      this.loaderService.requestStarted();
      await this.assignexaminerservice.GetCenterPracticalexaminerReliving(this.searchRequest)
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

  async GetPracticalExaminerRelivingByUserId() {
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.CenterCode = this.searchByCenterCode
    this.searchRequest.CenterName = this.searchByCenterName
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID

    try {
      this.loaderService.requestStarted();
      await this.assignexaminerservice.GetPracticalExaminerRelivingByUserId(this.searchRequest)
        .then((data: any) => {
          console.log("Raw API Response:", data);
          data = JSON.parse(JSON.stringify(data));
          this.AssignExaminerMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.AssignExaminerMasterList];
          console.log(data['Data'])
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  onSearchByRoleidClick() {
    if (this.sSOLoginDataModel.RoleID == 98 || this.sSOLoginDataModel.RoleID == 92) {
      this.GetPracticalExaminerRelivingByUserId();
    } else {
      this.GetAssignexaminer();
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



  downloadPDF(id: number) {

    debugger;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.CourseType;
    try {
      this.assignexaminerservice.DownloadItiPracticalExaminer(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.DownloadFile(data.Data, 'UndertakingExaminerDetails');
            
            /*this.GenerateCenterSuperintendentOrder(FileName, DownloadfileName, type)*/
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }

  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
    debugger;
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.pdf`;
  }

}
