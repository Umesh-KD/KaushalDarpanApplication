import { Component, ViewChild } from '@angular/core';
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
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import Swal from 'sweetalert2';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

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
  public HostelStatusList: any = [];
  public titleDDLBranchTrade: string = ''
  public status: number = 0
  public deallocateRequest = new DeallocateRoomDataModel();
  _EnumRole = EnumRole;

  @ViewChild('otpModal') childComponent!: OTPModalComponent;

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
    await this.GetHostelStatusDDL();
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    await this.GetReportData();
  }

  async GetHostelStatusDDL() {
    try {
      await this.commonFunctionService.GetHostelStatusDDL().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelStatusList = data['Data'];
      })
    } catch (error) {
      console.error(error);
    }
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
    this.Searchrequest = new StudentRequestDataModal();
    await this.GetReportData();
  }

  exportToExcel1(): void {
    const unwantedColumns = ['InstituteId', 'ApplicationId', 'StudentId', 'SemesterId', 'AllotmentStatus', 'BrachId', 'AllotmentStatus1', 'EndTermID'];

    const filteredData = this.ReportList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = Object.keys(filteredData[0] || {}).map(key => ({
      wch: Math.max(
        key.length, // Header length
        ...filteredData.map((item: any) => (item[key] ? item[key].toString().length : 0)) // Max content length
      ) + 2
    }));

    ws['!cols'] = columnWidths;

    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1'; 
        if (!ws[cellAddress]) continue;

        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } }, 
          fill: { fgColor: { rgb: "#f3f3f3" } }, 
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'HostelAllotedRoomAndSeatReportData.xlsx');
  }

  exportToExcel(): void {

    const columnMapping: any = {
      SrNo: 'Sr. No.',
      InstituteName: 'Institute Name',
      StudentName: 'Student Name',
      ApplicationId: 'Application No',
      StreamName: 'Branch',
      SemesterName: 'Semester',
      EndTermName: 'Session',
      RoomType: 'Room Type',
      MobileNo: 'Mobile No',
      Status: 'Status',
      
    };

    const wantedColumns = Object.keys(columnMapping);

    const exportData = this.ReportList.map((row: any, index: number) => {
      const formattedRow: any = {};

      wantedColumns.forEach(col => {
        const header = columnMapping[col];

        if (col === 'SrNo') {
          formattedRow[header] = index + 1;
        } else {
          formattedRow[header] = row[col];
        }
      });

      return formattedRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = [
      { wch: 8 }, { wch: 38 }, { wch: 25 }, { wch: 18 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 18 }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const todayDate = new Date().toISOString().split('T')[0];
    const fileName = `Student_Apply_Hostel_Report_Data_${todayDate}.xlsx`;

    XLSX.writeFile(wb, fileName);
  }


  
  

  async deallocationRoomRemark(item: any) {
    this.Swal2.Confirmation("Are you sure you want to Deallocate this  ?",
    async (result: any) => {
      
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Deallocate Room ',
          input: 'textarea',
          inputLabel: 'Remark',
          inputPlaceholder: 'Enter your remark here...',
          inputAttributes: {
            'aria-label': 'Type your remark here'
          },
          showCancelButton: true,
          confirmButtonText: 'Save Remark',
          cancelButtonText: 'Cancel'
        }).then(async (result: any) => {
          if (result.isConfirmed && result.value?.trim()) {
            const remark = result.value.trim();
            // await this.DeallocateRoom(item, remark);
            await this.openOTPModal(item, remark);
          } else if (result.isConfirmed && !result.value?.trim()) {
            this.toastr.warning('Remark is required.');
          }
        });
      }
    })
    
  }

  async DeallocateRoom(item: any, remark: string = '') {
    
    this.deallocateRequest.AllotSeatId = item.AllotSeatId
    this.deallocateRequest.ReqId = item.ReqId
    this.deallocateRequest.Remark = remark
    this.deallocateRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.deallocateRequest.UserID = this.sSOLoginDataModel.UserID
    this.deallocateRequest.Action = 'DeallocateStudent'

    try {
      
      await this.studentRequestService.DeallocateRoom(this.deallocateRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.deallocateRequest = new DeallocateRoomDataModel();
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

    this.Swal2.Confirmation("Are you sure you want to Deallocate this  ?",
    async (result: any) => {
      
      if (result.isConfirmed) {
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
    })
    
  }

  async openOTPModal(item: any, remark: string) {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.DeallocateRoom(item, remark);
  }

  async DeallocateRoom_6thSemStudent(){
    this.deallocateRequest.RoleID = this.sSOLoginDataModel.RoleID
    this.deallocateRequest.UserID = this.sSOLoginDataModel.UserID
    this.deallocateRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.deallocateRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.deallocateRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.deallocateRequest.Action = 'Deallocate6thSemStudent'
    try {
      await this.studentRequestService.DeallocateRoom(this.deallocateRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.deallocateRequest = new DeallocateRoomDataModel();
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

  async openOTPModal_6thSemDallocation() {
    this.Swal2.Confirmation("Are you sure you want to Deallocate 6th Semester Students  ?",
    async (result: any) => {
      if (result.isConfirmed) {
        this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

        // await for open model
        await this.childComponent.OpenOTPPopup();

        // await OTP verification
        await this.childComponent.waitForVerification();

        // do work
        await this.DeallocateRoom_6thSemStudent();
      }
    })
  }
}
