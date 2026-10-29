import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { HostelInstituteMappingModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dte-hostel-institute-mapping-list',
  standalone: false,
  templateUrl: './dte-hostel-institute-mapping-list.component.html',
  styleUrl: './dte-hostel-institute-mapping-list.component.css'
})
export class DteHostelInstituteMappingListComponent {
  public Table_SearchText: string = "";
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];

  public HostelInstituteMappingList: any = [];
  public MenuAllowedRoleList: any = [];
  public InstituteMaster: any = [];
  HostelInstituteMappingRequest = new HostelInstituteMappingModel()

  public IsShowAddButton: boolean = true;
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private studentRequestService: StudentRequestService,

  ) { }

  redirectToMapping(mappingId: number) {
    this.router.navigate(['/Hostel-Institute-Mapping'], {
      queryParams: { id: mappingId }
    });
  }

  editMapping(mappingId: number) {
    this.router.navigate(['/Hostel-Institute-Mapping'], {
      queryParams: { id: mappingId }
    });
  }
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMenuPermission();
    await this.GetInstitute();
    await this.GetAllHostelInstituteMappingList();
  }

  async GetMenuPermission() {

    debugger
    const baseRoute = this.router.url.split('?')[0].split('/').filter(Boolean)[0] ?? '';

    var request: any = {
      FilterBy: baseRoute,
      MasterCode: "GetAllowedRoleForMenu"
    }

    await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if (data.State == EnumStatus.Success) {
        this.MenuAllowedRoleList = data.Data

        if (!this.MenuAllowedRoleList.some(
          (item: any) => Number(item.RoleID) == Number(this.sSOLoginDataModel.RoleID)
        )) {
          // Navigate to dashboard if RoleID is not allowed
          this.router.navigate(['/dashboard']);
        }
      }
    })
  }

  async GetInstitute() {



  

    await this.commonMasterService.InstituteMaster(1).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      if (data.State == EnumStatus.Success) {
        this.InstituteMaster = data.Data

  
      }
    })
  }


  async onResetSearch() {
    this.HostelInstituteMappingRequest.InstituteID = ''
    this.GetAllHostelInstituteMappingList()
  }
  async GetAllHostelInstituteMappingList() {
    try {
      debugger
      this.loaderService.requestStarted();

      await this._HostelManagmentService.GetAllHostelInstituteMappingList(this.HostelInstituteMappingRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelInstituteMappingList = data['Data'];

          if (this.HostelInstituteMappingList && this.HostelInstituteMappingList?.length > 0) {
            this.IsShowAddButton = false;
          }

          console.log(this.HostelInstituteMappingList, "GetAllHostelInstituteMappingList")
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

  async unmapHostel(mappingId: number) {

    this.Swal2.Confirmation("Are you sure you want to unmap this hostel?",
      async (result: any) => {

        if (result.isConfirmed) {

          try {
            console.log("Clicked OK, ID:", mappingId);

            this.loaderService.requestStarted();

            const res: any = await this._HostelManagmentService.UnmapHostelInstitute(mappingId);

            console.log("API Response:", res);

            if (res && (res.State === 1 || res.state === 1)) {
              this.toastr.success(res.Message || "Unmapped successfully");
              await this.GetAllHostelInstituteMappingList();
            } else {
              this.toastr.error(res?.ErrorMessage || "Unmap failed");
            }

          } catch (error) {
            console.error("Error:", error);
            this.toastr.error("Something went wrong");
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }

        }

      });

  }
  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    const dir = this.sortDirection === 'asc' ? 1 : -1;
    const isDateCol = column === 'CreatedDate' || column === 'ModifyDate';
    const isNumCol = column === 'ActiveStatus';

    this.HostelInstituteMappingList = [...this.HostelInstituteMappingList].sort((a: any, b: any) => {
      let x = a[column];
      let y = b[column];

      if (isDateCol) {
        x = this.parseDateOrNull(x) ?? 0;
        y = this.parseDateOrNull(y) ?? 0;
      } else if (isNumCol) {
        x = Number(x) || 0;
        y = Number(y) || 0;
      } else {
        x = (x ?? '').toString().toLowerCase();
        y = (y ?? '').toString().toLowerCase();
      }

      if (x < y) return -1 * dir;
      if (x > y) return 1 * dir;
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return 'ti ti-arrows-sort';
    return this.sortDirection === 'asc' ? 'ti ti-sort-ascending' : 'ti ti-sort-descending';
  }

  // Parses 'dd-MM-yyyy HH:mm:ss' or 'dd-MM-yyyy hh:mm:ss tt'
  private parseDateOrNull(value: string): number | null {
    if (!value) return null;
    const m = value.match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{1,2}):(\d{2}):(\d{2})\s*(AM|PM)?$/i);
    if (!m) return null;
    let hours = parseInt(m[4], 10);
    if (m[7]) {
      hours = hours % 12;
      if (m[7].toUpperCase() === 'PM') hours += 12;
    }
    return new Date(+m[3], +m[2] - 1, +m[1], hours, +m[5], +m[6]).getTime();
  }

  exportToExcel(): void {
    if (!this.HostelInstituteMappingList || this.HostelInstituteMappingList.length === 0) {
      this.toastr.warning("No data available to export.");
      return;
    }
    const unwantedColumns = ['DesignationID'];

    const columnOrder = [
      'HostelName', 'InstituteNames',    'CreatedBy', 'CreatedDate', 'ModifyBy', 'ModifyDate'
    ];

    const filteredData = this.HostelInstituteMappingList.map((item: any) => {
      const row: any = {};
      columnOrder.forEach(col => {
        if (!unwantedColumns.includes(col)) {
          row[col] = item[col] ?? ''; // fallback if value missing
        }
      });

      return row;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    XLSX.writeFile(wb, `designation_master_${timestamp}.xlsx`);
  }

}
