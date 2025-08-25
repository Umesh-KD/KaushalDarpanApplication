import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GuestApplyForGuestRoomDataModel, GuestApplyForGuestRoomSearchModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-guest-room-request',
  standalone: false,
  templateUrl: './guest-room-request.component.html',
  styleUrl: './guest-room-request.component.css'
})
export class GuestRoomRequestComponent {
  groupForm!: FormGroup;
  GFID: number | null = null;
  isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  Table_SearchText: string = "";
  tbl_txtSearch: string = '';
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  request = new GuestApplyForGuestRoomDataModel()
  searchRequest = new GuestApplyForGuestRoomSearchModel();
  RequestList: any = [];
  statusList: any = [];
  filteredStatusList: any = [];
  modalReference: NgbModalRef | undefined;
  GetStatusID: number = 0;
  _EnumRole = EnumRole;
  displayedColumns: string[] = [
    'SNo', 'RequestName', 'RoleNameEnglish', 'DepartmentName', 'InstituteName',
    'EmplDCardPhoto', 'FromDate', 'FromTime', 'ToDate', 'ToTime', 'StatusName','Remark', 'Action'
  ];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _GuestRoomManagmentService: GuestRoomManagmentService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,    
    public appsettingConfig: AppsettingService,
  ) { }


  async ngOnInit() {    
    this.groupForm = this.fb.group({
      ddlStatus: [1, [DropdownValidators]],
      txtRemark: ['', Validators.required]
    });

    await this.GuestRequestList();
    await this.commonMaster();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetStatusID = Number(this.route.snapshot.paramMap.get('Status')) || 0;
    this.searchRequest.Status = this.GetStatusID;

    if (this.GetStatusID != 0) {
      this.GuestRequestList();
    }

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filteredStatusList = this.statusList.filter((item: { ID: number; }) => item.ID !== 215 && item.ID !== 219 && item.ID !== 220);
  }
  
  async commonMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType("GuestRoomStatus")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.statusList = data['Data'];
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

  async GuestRequestList() {
    try {
      this.loaderService.requestStarted();
      await this._GuestRoomManagmentService.GuestRequestList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.RequestList = data['Data'];
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

  GuestRequestListCancel() {
    this.searchRequest.Status = 0;
    this.searchRequest.DepartmentID = 1;
    this.GuestRequestList();
  }

  async onSubmit(model: any, userSubmitData: any) {
    try {
      this.request = { ...userSubmitData };
      this.request.Status = 0;
      this.request.Remark = '';
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  async CheckIn(userSubmitData: any) {
    try {
      this.request = { ...userSubmitData };

      if (this.request.Status === 217) {
        this.request.Status = 220;
      }
      else {
        this.request.Status = 219;
      }
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;

      try {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        await this._GuestRoomManagmentService.updateReqStatusCheckInOut(this.request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.CloseModal();
              this.GuestRequestList();
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
          })
      }
      catch (ex) { console.log(ex) }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoading = false;

        }, 200);
      }
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.request.Status = 0;
    this.request.Remark = '';
    this.isSubmitted = false;
  }

  async updateReqStatus() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      await this._GuestRoomManagmentService.updateReqStatus(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.CloseModal();
            this.GuestRequestList();
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  exportToExcel(): void {
    const unwantedColumns = ['GuestReqID','Dis_EmpIDCardPhoto','IDProofNo','EmplDCardPhoto','Dis_IDProofPhoto','IDProofPhoto','Status'];
    const filteredData = this.RequestList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'GuestRoomRequestList.xlsx');
  }

}
