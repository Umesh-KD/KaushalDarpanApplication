import { Component } from '@angular/core';
//import { FormBuilder } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { GuestRoomManagmentService } from '../../../Services/GuestRoomManagment/GuestRoomManagment.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
//import { ActivatedRoute } from '@angular/router';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GuestApplyForGuestRoomDataModel, GuestApplyForGuestRoomSearchModel } from '../../../Models/GuestRoom-Management/GuestRoomManagmentDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-guest-room-report',
  standalone: false,
  templateUrl: './guest-room-report.component.html',
  styleUrl: './guest-room-report.component.css'
})
export class GuestRoomReportComponent {
  groupForm!: FormGroup;
  public GFID: number | null = null;
  public isUpdate: boolean = false;
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  public tbl_txtSearch: string = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public searchRequest = new GuestApplyForGuestRoomSearchModel();
  public RequestList: any = [];
  public statusList: any = [];
  public filteredStatusList: any = [];
  modalReference: NgbModalRef | undefined;
  constructor(
    private commonMasterService: CommonFunctionService,
    private _GuestRoomManagmentService: GuestRoomManagmentService,
    private loaderService: LoaderService,

    public appsettingConfig: AppsettingService,
  ) { }


  async ngOnInit() {
    await this.GuestRequestList();
    await this.commonMaster();

    /*this.filteredStatusList = this.statusList.filter(item => item.ID !== 219 && item.ID !== 220);*/
    this.filteredStatusList = this.statusList.filter((item: { ID: number; }) => item.ID !== 219 && item.ID !== 220);

  }


  async commonMaster() {
    //
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
    //
    try {
      this.loaderService.requestStarted();
      await this._GuestRoomManagmentService.GuestRequestReportList(this.searchRequest)
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
    this.searchRequest.DepartmentID = 0;
    this.GuestRequestList();
  }

  exportToExcel(): void {
    const unwantedColumns = ['GuestReqID','Dis_EmpIDCardPhoto', 'IDProofNo', 'EmplDCardPhoto', 'Dis_IDProofPhoto', 'IDProofPhoto', 'Status'];
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
    XLSX.writeFile(wb, 'GuestRoomCheckInCheckOutReport.xlsx');
  }
}

