import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { StudentExamDetails } from '../../../../Models/DashboardCardModel';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { PlacementReportService } from '../../../../Services/PlacementReport/PlacementReport.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { PlacementReportSearchModels } from '../../../../Models/PlacementDashReportModel';
import { EM_TransferSystemSearchModel } from '../../../../Models/BTER/BTER_EstablishManagementDataModel';
import { BTEREMStaffServiceDetailsService } from '../../../../Services/BTER/BTER_EM_StaffServiceDetails/bter-em-staff-service-details.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-transfer-request-list',
  templateUrl: './transfer-request-list.component.html',
  styleUrls: ['./transfer-request-list.component.css'],
  standalone: false
})
export class TransferRequestListComponent implements OnInit {
  Message: string = '';
  ErrorMessage: string = '';
  State: boolean = false;
  // viewAdminDashboardList: StudentExamDetails[] = [];
  filteredData: any[] = [];
  displayedColumns: string[] = ['SrNo', 'NAME', 'SSOID', 'TransferCategory', 'ReasonDescription', 'CreatedDate','Action'];
  dataSource: MatTableDataSource<StudentExamDetails> = new MatTableDataSource();
  totalRecords: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  sSOLoginDataModel: any;
  id: any;
  _EnumRole = EnumRole;
  InstituteMasterList: any = [];
  SemesterMasterList: any = [];
  Table_SearchText: string = '';
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;

  modalReference: NgbModalRef | undefined;

  public searchRequest = new EM_TransferSystemSearchModel();
  public EM_TransferProcessList:any=[];
  public EM_TransferSystemEXTList:any=[];

  constructor(
    private PlacementDashService: PlacementReportService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private staffServiceDetailsService: BTEREMStaffServiceDetailsService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.activatedRoute.paramMap.subscribe(params => {
      this.id = params.get('id')
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.EM_TransferSystem_GetData();

    // await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
    //   .then((data: any) => {
    //     data = JSON.parse(JSON.stringify(data));
    //     this.InstituteMasterList = data['Data'];
    //   }, (error: any) => console.error(error));

    // await this.commonMasterService.SemesterMaster()
    //   .then((data: any) => {
    //     data = JSON.parse(JSON.stringify(data));
    //     this.SemesterMasterList = data['Data'];
    //   }, (error: any) => console.error(error));
  }


  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.EM_TransferProcessList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StaffTransferList.xlsx');
  }

//   async GetAllData() {
// //    debugger
//     let requestData: PlacementReportSearchModels = {
//       DepartmentID: this.sSOLoginDataModel.DepartmentID,
//       Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
//       CollegeID : this.sSOLoginDataModel.InstituteID,
//       RoleID:this.sSOLoginDataModel.RoleID,
//       Id: this.id,
//       Gender: '',
//       StudentName: ''
//     }

//     await this.PlacementDashService.GetAllData(requestData)
//       .then((data: any) => {
//         data = JSON.parse(JSON.stringify(data));

//         this.viewAdminDashboardList = data['Data'];
//         this.filteredData = [...this.viewAdminDashboardList]; // Copy full dataset
//         this.dataSource = new MatTableDataSource(this.filteredData);
//         this.dataSource.sort = this.sort;
//         this.totalRecords = this.filteredData.length;
//         this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
//         this.updateTable();
//       }, (error: any) => console.error(error)
//       );
//   }


async EM_TransferSystem_GetData() {
        debugger
        try {
          this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
          this.searchRequest.Action = "EM_TransferSystemListmain";
          this.searchRequest.StatusID = 0;
          await this.staffServiceDetailsService.GetEM_TransferSystemData(this.searchRequest).then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.EM_TransferProcessList = data.Data;
              this.filteredData = [...this.EM_TransferProcessList]; // Copy full dataset
              this.dataSource = new MatTableDataSource(this.filteredData);
              this.dataSource.sort = this.sort;
              this.totalRecords = this.filteredData.length;
              this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
              this.updateTable();
            } else {
              this.EM_TransferProcessList = [];
            }

          })
        } catch (error) {
          console.error(error);
        }
      }

  async onTransferSystemEXT(model: any, TransferSystemID: number) {
      debugger
      try {
        this.loaderService.requestStarted();
        try {
          this.searchRequest.StaffID = this.sSOLoginDataModel.StaffID
          this.searchRequest.Action = "EM_TransferSystemEXT";
          this.searchRequest.StatusID = 0;
          this.searchRequest.TransferSystemID = TransferSystemID;
          await this.staffServiceDetailsService.GetEM_TransferSystemData(this.searchRequest).then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State === EnumStatus.Success) {
              this.EM_TransferSystemEXTList = data.Data;
            } else {
              this.EM_TransferSystemEXTList = [];
            }
          })
        } catch (error) {
          console.error(error);
        }
        this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;

    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    filterValue = filterValue.trim().toLowerCase();

    if (filterValue === "all" || filterValue === "") {
      this.filteredData = [...this.EM_TransferProcessList]; // Reset to full dataset
    } else {
      this.filteredData = this.EM_TransferProcessList.filter((item:any) =>
        Object.values(item).some(value =>
          value != null && value.toString().toLowerCase().includes(filterValue)
        )
      );
    }

    this.totalRecords = this.filteredData.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Reset to first page after filtering
    this.updateTable();
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);

    this.dataSource.data = this.filteredData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }


    CloseModal() {
      this.modalService.dismissAll();
      this.modalReference?.close();
    }

}


