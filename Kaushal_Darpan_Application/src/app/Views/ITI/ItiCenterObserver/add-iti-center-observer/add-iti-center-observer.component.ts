import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ObserverDetailsDataModel, CenterObserverDataModel, StaffMasterDDLDataModel } from '../../../../Models/CenterObserverDataModel';
import { CenterObserverService } from '../../../../Services/CenterObserver/center-observer.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { FlyingSquadService } from '../../../../Services/FlyingSquad/flying-squad.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import * as XLSX from 'xlsx';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITICenterObserverService } from '../../../../Services/ITI/ITICenterObserver/iticenter-observer.service';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { ITI_InspectionDropdownModel } from '../../../../Models/ITI/ITI_InspectionDataModel';

@Component({
  selector: 'app-add-iti-center-observer',
  standalone: false,
  templateUrl: './add-iti-center-observer.component.html',
  styleUrl: './add-iti-center-observer.component.css'
})
export class AddItiCenterObserverComponent {
  FlyingSquadForm!: FormGroup;
  CenterObserverForm!: FormGroup;
  displayedColumns: string[] = ['SrNo', 'Name', 'Institute', 'SSOID', 'Stream', 'CourseTypeName', 'ExamShift', 'ExamDate','Incharge', 'Actions'];
  DistrictMasterDDL: any;
  SemesterMasterDDL: any[] = [];
  StreamMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  ExamShiftDDL: any[] = [];
  InstituteMasterDDL: any[] = [];
  filterData: any[] = [];
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  sSOLoginDataModel = new SSOLoginDataModel();
  isSubmitted: boolean = false;
  // Pagination related variables
  totalRecords: number = 0;
  TeamId: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  SSOIDExists: boolean = false;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  requestObj = new ObserverDetailsDataModel();
  request = new CenterObserverDataModel();
  CenterObserverTeamID: number = 0;
  public requestStaff = new StaffMasterDDLDataModel();
  isFormSubmitted: boolean = false
  requestTrade = new ItiTradeSearchModel()
  requestIti = new ItiCollegesSearchModel()
  requestDropdown = new ITI_InspectionDropdownModel()
  isFormReadOnly: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private flyingSquadService: FlyingSquadService,
    private http: HttpClient,
    private centerObserverService: CenterObserverService,
    private loaderService: LoaderService,
    private router: Router,
    private route: ActivatedRoute,
    private itiCenterObserverService: ITICenterObserverService,
    private itiInspectionService: ITIInspectionService,
  ) { }

  async ngOnInit() { 
    this.FlyingSquadForm = this.fb.group({
      // StreamID: ['', [DropdownValidators]],
      DistrictID: ['', [DropdownValidators]],
      InstituteID: ['',[DropdownValidators]],
      StaffID: ['', [DropdownValidators]],
      
    });
    this.CenterObserverForm = this.fb.group({
      TeamName: ['', Validators.required]
    })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CenterObserverTeamID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    console.log("this.CenterObserverTeamID",this.CenterObserverTeamID);
    if (this.CenterObserverTeamID) {
      await this.GetByID()
    }
    this.getMasterData();
    // this.getFlyingSquad();
  }

  get centerObserverForm() { return this.CenterObserverForm.controls; }
  get formFlyingSquad() { return this.FlyingSquadForm.controls; }

  async getMasterData() {
    try {
      this.requestTrade.action='_getAllData'
      await this.commonMasterService.TradeListGetAllData(this.requestTrade).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      })
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DistrictMasterDDL = data.Data;
      })

      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })

      // await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
      //   data = JSON.parse(JSON.stringify(data));
      //   this.ExaminerDDL = data.Data;
      // })

    } catch (error) {
      console.error(error);
    }
  }

  // GetInstituteMaster_ByDistrictWise() {
  //   this.requestIti.action='_getDatabyDistrict'
  //   this.requestIti.DistrictID = this.requestObj.DistrictID;
  //   this.requestIti.ManagementTypeID = this.requestObj.ManagementTypeID;
  //   this.commonMasterService.ItiCollegesGetAllData(this.requestIti).then((data: any) => {
  //     data = JSON.parse(JSON.stringify(data));
  //     this.InstituteMasterDDL = data.Data;
  //     console.log("this.InstituteMasterDDL",this.InstituteMasterDDL)
  //   })
  // }

  GovtITICollege_DistrictWise(ID: any) {
    debugger
    this.InstituteMasterDDL = []
    this.requestDropdown.action='GovtITICollege_DistrictWise'
    this.requestDropdown.DistrictID = this.requestObj.DistrictID;
    this.requestDropdown.ManagementTypeID = 1;
    this.commonMasterService.GovtITICollege_DistrictWise(ID, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
      console.log("this.InstituteMasterDDL",this.InstituteMasterDDL)
    })
  }

  GetStaff_InstituteWise() {
    this.requestStaff.InstituteID = this.requestObj.InstituteID;
    this.requestStaff.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.commonMasterService.ITIGetStaff_InstituteWise(this.requestStaff).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      debugger;
      this.ExaminerDDL = data.Data;
      //this.ExaminerDDL = [{ StaffID: 1, Name: 'Staff 1', SSOID: 'Staff1' },{ StaffID: 2, Name: 'Staff 2', SSOID: 'Staff2' },{ StaffID: 3, Name: 'Staff 3', SSOID: 'Staff3' }];
    })
  }

  // GetStaff_InstituteWise() {
  //   this.ExaminerDDL = []
  //   this.requestDropdown.action='GetStaff_InstituteWise'
  //   this.requestDropdown.InstituteID = this.requestObj.InstituteID;
  //   this.requestDropdown.DepartmentID = EnumDepartment.ITI;
  //   this.itiInspectionService.GetITIInspectionDropdown(this.requestDropdown).then((data: any) => {
  //     data = JSON.parse(JSON.stringify(data));
  //     this.ExaminerDDL = data.Data;
  //   })
  // }

  async GetByID() {
    try {
      this.loaderService.requestStarted();
      await this.itiCenterObserverService.GetByID(this.CenterObserverTeamID, this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
       
        console.log("getbyid", data)
        if (data.State == EnumStatus.Success) {
          this.CenterObserverForm.get('TeamName')?.disable();
          this.request = data.Data;
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async getFlyingSquad() {
    
    try {
      //this.isSubmitted = true;
      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      };
      await this.flyingSquadService.getFlyingSquad(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
         
          this.filterData = data;  // Populate filtered data with the fetched data
          this.dataSource.data = this.filterData;
          this.dataSource.sort = this.sort;  // Set sort behavior
          this.totalRecords = this.filterData.length;
          this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
          this.updateTable();  // Update table based on pagination
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  postFlyingSquadForm() {
    this.isSubmitted = true;
    if(this.FlyingSquadForm.invalid) {
      console.log("Invalid");
      
      return
    }
    const IsDuplicate = this.request.ObserverDetails.some((element: any) =>
      this.requestObj.StaffID == element.StaffID
    );
    if (IsDuplicate) {
      this.toastr.error('Already Exists');
      return;
    }

    this.requestObj.DistrictName = this.DistrictMasterDDL.find((x: any) => x.ID == this.requestObj.DistrictID)?.Name;
    this.requestObj.InstituteName = this.InstituteMasterDDL.find(x => x.ID == this.requestObj.InstituteID)?.Name;
    // this.requestObj.StreamName = this.StreamMasterDDL.find(x => x.Id == this.requestObj.StreamID)?.TradeName;
    // this.requestObj.SemesterName = this.SemesterMasterDDL.find(x => x.SemesterID == this.requestObj.SemesterID)?.SemesterName;
    // this.requestObj.ShiftName = this.ExamShiftDDL.find(x => x.ShiftID == this.requestObj.ShiftID)?.ExamShift;
    this.requestObj.StaffName = this.ExaminerDDL.find(x => x.UserID == this.requestObj.StaffID)?.Name;
    this.requestObj.SSOID = this.ExaminerDDL.find(x => x.UserID == this.requestObj.StaffID)?.SSOID;

    console.log(this.requestObj);

    this.request.ObserverDetails.push(this.requestObj);

    this.dataSource.data = this.request.ObserverDetails;
    this.dataSource.sort = this.sort;

    this.totalRecords = this.request.ObserverDetails.length;
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.updateTable();

    this.requestObj = new ObserverDetailsDataModel();
    this.isSubmitted = false;
  }


  async DeleteRow(item: ObserverDetailsDataModel) {
    const index: number = this.request.ObserverDetails.indexOf(item);
    console.log("index", index)
    if (index != -1) {
      this.request.ObserverDetails.splice(index, 1)
      // this.ddlSemester_Change();
    }
  }

  SetInchargeFlyingSquad(staff: any) {
    this.request.ObserverDetails.forEach(element => {
      if (element.StaffID == staff.StaffID) {
        element.IsIncharge = !element.IsIncharge;
      }
    })
  }

  async SaveDate() {
    this.isFormSubmitted = true
    if(this.CenterObserverForm.invalid) return;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.request.UserID = this.sSOLoginDataModel.UserID;

    if (this.request.ObserverDetails.length == 0) {
      this.toastr.error("Please Add At Least One Member in Team");
      return;
    }

    if (this.request.ObserverDetails.length == 1) {
      this.request.ObserverDetails.forEach(element => {
        element.IsIncharge = true
      })
    } 

    const hasIncharge = this.request.ObserverDetails.some(x => x.IsIncharge == true);
    if (!hasIncharge) {
      this.toastr.error("Please Select Incharge");
      return;
    }

    try {
      this.loaderService.requestStarted();
      await this.itiCenterObserverService.SaveData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        if(data.State === EnumStatus.Success){
          this.toastr.success("Saved Successfully");
          this.router.navigate(['/iti-center-observer']);
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    if (this.currentPage < 1) this.currentPage = 1;
    else if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
    this.updateTable();  // Update table when pagination changes
  }

  updateTable(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = Math.min(startIndex + this.pageSize, this.totalRecords);
    this.dataSource.data = this.request.ObserverDetails.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
    this.isFormReadOnly = true;
  }

  updatePaginationIndexes(): void {
    this.startInTableIndex = (this.currentPage - 1) * this.pageSize + 1;
    this.endInTableIndex = Math.min(this.currentPage * this.pageSize, this.totalRecords);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterData = this.filterData.filter(item =>
      Object.values(item).some(value =>
        value != null && value.toString().toLowerCase().includes(filterValue.trim().toLowerCase())
      )
    );
    this.totalRecords = this.filterData.length; // Update the total record count after filtering
    this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
    this.currentPage = 1; // Reset to the first page after filtering
    this.updateTable();  // Update table with filtered data
  }

  exportToExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.filterData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'Reports.xlsx');
  }

  public downloadPDF() {
    const margin = 10;
    const pageWidth = 210 - 2 * margin;
    const pageHeight = 200 - 2 * margin;

    const doc = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: [210, 300],
    });

    const pdfTable = this.pdfTable.nativeElement;

    doc.html(pdfTable, {
      callback: function (doc) {
        doc.save('Report.pdf');
      },
      x: margin,
      y: margin,
      width: pageWidth,
      windowWidth: pdfTable.scrollWidth,
    });
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
    return `file_${timestamp}.${extension}`;
  }
}
