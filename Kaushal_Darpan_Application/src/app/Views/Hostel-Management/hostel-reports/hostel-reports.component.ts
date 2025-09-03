import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DeallocateRoomDataModel, StudentRequestDataModal } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-hostel-reports',
  standalone: false,
  
  templateUrl: './hostel-reports.component.html',
  styleUrl: './hostel-reports.component.css'
})
export class HostelReportsComponent {
  public Searchrequest = new StudentRequestDataModal()
  public ViewRequest: any = {};
  public Request: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ReqId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public ReportList: any = [];
  public SemesterDDLList: any = [];
  public BrachDDLList: any = [];
  public titleDDLBranchTrade: string = ''
  public status: number = 0
  public deallocateRequest = new DeallocateRoomDataModel();

  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal) { }


  async ngOnInit() {
    this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    this.status = Number(this.activatedRoute.snapshot.queryParamMap.get('status')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;

    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.titleDDLBranchTrade = 'Branch'
    }
    else if (this.sSOLoginDataModel.DepartmentID == 2) {
      this.titleDDLBranchTrade = 'Trade'
    }

    if(this.status) {
      this.Searchrequest.status = this.status
    }

    //this.RequestFormGroup = this.formBuilder.group({
    //  StudentName: [''],
    //  ClassPercentage: [''],
    //  StreamName: ['']
    //});
    
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    await this.GetReportData();
  }

  async GetReportData() {
    try {
      

      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.loaderService.requestStarted();
      await this.studentRequestService.GetReportData(this.Searchrequest)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ReportList = data['Data'];

          console.log(this.ReportList)
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


  async GetBranchMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BrachDDLList = data['Data'];
          console.log(this.BrachDDLList)
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

  async GetSemesterMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterDDLList = data['Data'];
          console.log(this.SemesterDDLList)
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


  async ResetControl() {
    this.isSubmitted = false;
  }

  exportToExcel(): void {
    // List of columns to exclude from export
    const unwantedColumns = ['InstituteId', 'ApplicationId', 'StudentId', 'SemesterId', 'AllotmentStatus', 'BrachId', 'AllotmentStatus1', 'EndTermID'];

    // Filter the data based on unwanted columns
    const filteredData = this.ReportList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    // Create worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate column widths based on max length of content in each column
    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map((item: any) => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2 // Add extra padding
    }));

    // Apply column widths
    ws['!cols'] = columnWidths;

    // Apply header styling (bold + background color)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1'; // First row (headers)
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } }, // Bold text, white color
          fill: { fgColor: { rgb: "#f3f3f3" } }, // Light background color
          alignment: { horizontal: "center", vertical: "center" } // Center-align text
        };
      }
    }

    // Create a new workbook and append the sheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the file as "HostelAllotedRoomAndSeatReportData.xlsx"
    XLSX.writeFile(wb, 'HostelAllotedRoomAndSeatReportData.xlsx');
  }

  async DeallocateRoom(item: any) {
    this.deallocateRequest.AllotSeatId = item.AllotSeatId
    this.deallocateRequest.ReqId = item.ReqId
    this.deallocateRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.deallocateRequest.UserID = this.sSOLoginDataModel.UserID
    this.deallocateRequest.Action = 'DeallocateStudent'

    try {
      
      await this.studentRequestService.DeallocateRoom(this.deallocateRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.GetReportData();
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
        
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  async DeallocateRoom_EnrollCancelStudent(item: any) {
    this.deallocateRequest.AllotSeatId = item.AllotSeatId
    this.deallocateRequest.ReqId = item.ReqId
    this.deallocateRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.deallocateRequest.UserID = this.sSOLoginDataModel.UserID
    this.deallocateRequest.Action = 'EnrollCancelledDeallocate'

    try {
      
      await this.studentRequestService.DeallocateRoom(this.deallocateRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.GetReportData();
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
        
      })
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
}
