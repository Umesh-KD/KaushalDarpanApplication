import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { CenterAllocationSearchModel, CenterAllocationtDataModels, InstituteList } from '../../../Models/CenterAllocationDataModels';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { VerifyRollNumberList } from '../../../Models/GenerateRollDataModels';

@Component({
  selector: 'app-center-superintendent-allocation',
  templateUrl: './center-superintendent-allocation.component.html',
  styleUrls: ['./center-superintendent-allocation.component.css'],
  standalone: false
})
export class CenterSuperintendentAllocationComponent implements OnInit {
  commonMasterService = inject(CommonFunctionService);
  centerAllocationService = inject(CenterAllocationService);
  GetRollService = inject(GetRollService);
  centerCreation = inject(CenterAllotmentService);
  toastr = inject(ToastrService);
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
  CenterMasterList: any[] = [];
  searchRequest = new CenterAllocationSearchModel();
  FilteredInstituteList: any[] = [];
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  request = new CenterAllocationtDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  BackupCenterMasterList: any[] = [];
  SelectCenterMaster: any;
  GetStatusCenterSuperintendentData: any;
  UserID: number = 0;
  constructor(...args: unknown[]);
  constructor() { }
  _EnumRole = EnumRole;
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    await this.GetStatusCenterSuperintendent();
    await this.GetCenterMasterList();

  }

  async GetCenterMasterList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.CenterCode = this.searchByCenterCode;

    try {
      this.loaderService.requestStarted();
      await this.centerAllocationService.GetCenterSuperintendent(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.CenterMasterList];
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async onSearchClick() {
    await this.GetCenterMasterList();
  }

  async resetList() {
    this.CenterMasterList = [];
    this.searchByCenterCode = '';
    this.searchByCenterName = '';
    await this.GetCenterMasterList();
  }


  async openModal(content: any, row: any, indexNum: number) {
    console.log(row, 'RowData');
    try {
      this.SelectCenterMaster = row;
      this.UserID = 0;
      this.assignedInstitutesReady = false;
      this.assignedInstitutes = [];
      await this.GetStaffTypeDDL(this.SelectCenterMaster);
      this.assignedInstitutesReady = true;
      this.UserID = row && row.UserID > 0 ? row.UserID : 0;
      await this.modalService
        .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error('Error opening modal:', error);
      this.toastr.error('Failed to open modal. Please try again.');
    }
  }

  async GetStaffTypeDDL(row: any) {
    try {

      let obj = {
        InstituteID: row.InstituteID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng

      }
      this.commonMasterService.CenterSuperitendentDDL(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.assignedInstitutes = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
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


  AssignCenterSuperintendent() {
    if (this.UserID >= 0 && this.UserID != null && this.UserID != undefined) {
      let obj = {
        CenterAssignedID: 0,
        CenterID: this.SelectCenterMaster.CenterID,
        InsituteID: this.SelectCenterMaster.InstituteID,
        UserID: this.UserID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        CreatedBy: this.sSOLoginDataModel.UserID,
        ModifyBy: this.sSOLoginDataModel.UserID,
      }
      try {
        // //Call service to save data
        this.centerCreation.AssignCenterSuperintendent(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State === EnumStatus.Success) {
              this.toastr.success(this.Message);
              this.CloseModal();
              this.GetCenterMasterList();
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          })
          .catch((error: any) => {
            console.error(error);
            this.toastr.error("An error occurred while saving the data.");
          });

      } catch (ex) {
        console.log(ex);
        this.toastr.error("An unexpected error occurred.");
      }
    }

  }

  downloadPDF(type: any) {

    if (this.CenterMasterList.some(x => x.UserName?.replace("N/A", "") == "") == true) {
      this.toastr.warning("First appoint center superintendent!");
      return;
    }

    if (type == 'view' && this.GetStatusCenterSuperintendentData?.Status == 12
      || this.GetStatusCenterSuperintendentData?.Status == 13
      || this.GetStatusCenterSuperintendentData?.Status == 14) {
      this.GetStatus(4);
    } else {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      try {
        this.centerAllocationService.DownloadCenterSuperintendent(this.searchRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.DownloadFile(data.Data, 'file download');
              this.GetStatusCenterSuperintendent();
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
  }

  DownloadFile(FileName: string, DownloadfileName: string): void {
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

  forwardStatus() {

    let object: VerifyRollNumberList[] = [{
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      PDFType: 4,
      Status: 12,
      RollListID: this.GetStatusCenterSuperintendentData?.RollListID,
      InstituteID: 0,
      StreamID: 0,
      SemesterID: 0,
      CenterName: '',
      InstituteNameEnglish: '',
      BranchCode: '',
      StudentType: '',
      EndTermName: '',
      FinancialYearName: '',
      Totalstudent: 0,
      StudentTypeID: 0,
      Selected: false,
      UserID: 0,
      RoleID: 0,
      ModuleID: 0,
      ActionCode: '',
      IsRegistrarVerified: false,
      IsExaminationVerified: false
    }]
    try {
      this.GetRollService.SaveWorkflow(object)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            //this.GetStatus(4)
            this.GetStatusCenterSuperintendent();
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


  GetStatus(status: any) {
    try {
      this.centerAllocationService.GetStatusCenterSuperintendentOrder(status, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            console.log(data.Data)

            this.GetStatusCenterSuperintendentData = data.Data[0]
            if (this.GetStatusCenterSuperintendentData && this.GetStatusCenterSuperintendentData?.FileName) {
              this.DownloadFile(this.GetStatusCenterSuperintendentData?.FileName, 'file download');
            }

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

  GetStatusCenterSuperintendent() {
    this.centerAllocationService.GetStatusCenterSuperintendentOrder(4, this.sSOLoginDataModel.Eng_NonEng)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          console.log(data.Data)

          this.GetStatusCenterSuperintendentData = data.Data[0]
        }
        else {
          this.toastr.error(data.ErrorMessage)
          //    data.ErrorMessage
        }
      }, error => console.error(error));
  }
}








