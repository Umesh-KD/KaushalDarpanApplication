import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { FlyingSquadService } from '../../../Services/FlyingSquad/flying-squad.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { AppsettingService } from '../../../Common/appsetting.service';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { Acedmic } from '../../../Models/AcedmicInterface';
import { MenuService } from '../../../Services/Menu/menu.service';

@Component({
  selector: 'app-add-flying-squad',
  standalone: false,
  templateUrl: './add-flying-squad.component.html',
  styleUrl: './add-flying-squad.component.css'
})
export class AddFlyingSquadComponent {
  FlyingSquadForm!: FormGroup;
  FlyingTeamSquadForm!: FormGroup;
  displayedColumns: string[] = ['SrNo', 'Name', 'Institute', 'SSOID', 'CourseTypeName', 'Incharge', 'Actions'];
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
  lstAcedmicYear!: Acedmic;
  lstAcedmicYearList!: Acedmic[];
  getFlyingSquadTeamData: any[] = [];
  getFlyingSquadTeamDefault= signal('');
  isSubmitted: boolean = false;
  closeResult: string | undefined;
  // Pagination related variables
  totalRecords: number = 0;
  TeamId: number = 0;
  TeamDeploymentID: number = 0;
  FlyingSquadDeploymentID: number = 0;
  pageSize: number = 10;
  currentPage: number = 1;
  SSOIDExists: boolean = false;
  totalPages: number = 0;
  startInTableIndex: number = 1;
  endInTableIndex: number = 10;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private fb: FormBuilder,
    
    private http: HttpClient,
    private commonMasterService: CommonFunctionService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService, private flyingSquadService: FlyingSquadService, private toastr: ToastrService,
    private router: Router,) {
  }

  async ngOnInit() {
    this.TeamId = parseInt(this.activatedRoute.snapshot.paramMap.get('id') ?? "0");
    this.TeamDeploymentID = parseInt(this.activatedRoute.snapshot.paramMap.get('TeamDeploymentID') ?? "0");
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.FlyingSquadForm = this.fb.group({
      SubjectID: [0, Validators.required],
      //StreamID: [0, Validators.required],
      StaffID: [0, Validators.required],
      //SemesterID: [0, Validators.required],
      DistrictID: [0, Validators.required],
      InstituteID: [0, Validators.required]
    });
    this.FlyingTeamSquadForm = this.fb.group({
      TeamName: ['']
    });
    await this.getMasterData();
    
    await this.getFlyingTeamSquad();
    await this.AddTeamData();
  }
  get formFlyingSquad() { return this.FlyingSquadForm.controls; }
  get flyingTeamSquadForm() { return this.FlyingTeamSquadForm.controls; }

  async getMasterData() {
    try {
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
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

      await this.menuService.GetAcedmicYearList()
        .then((AcedmicYear: any) => {
          AcedmicYear = JSON.parse(JSON.stringify(AcedmicYear));
          this.lstAcedmicYearList = AcedmicYear['Data'];
          this.lstAcedmicYear = this.lstAcedmicYearList.filter(x => x.EndTermID == this.sSOLoginDataModel.EndTermID)[0];
          //this.loaderService.requestEnded();
        }, error => console.error(error));

    } catch (error) {
      console.error(error);
    }
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }
 
  GetInstituteMaster_ByDistrictWise(ID: any) {
    this.commonMasterService.GovtInstitute_DistrictWise(ID, this.sSOLoginDataModel.EndTermID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterDDL = data.Data;
    })
  }

  GetStaff_InstituteWise(ID: any) {
    let obj = {
      InstituteID: ID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      RoleID: this.sSOLoginDataModel.RoleID
    }
    this.commonMasterService.GetStaff_InstituteWise(obj).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.ExaminerDDL = data.Data;
    })
  }

  async getFlyingSquad() {
    try {
      //this.isSubmitted = true;
      let obj = {
        TeamID:this.TeamId,
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
    const formValue = this.FlyingSquadForm.getRawValue();
    if (this.FlyingSquadForm.invalid || this.FlyingSquadForm.value.DistrictID === 0 ||  this.FlyingSquadForm.value.InstituteID === 0) {
      this.isSubmitted = false;
      this.toastr.warning('something went wrong please try again');
      return
    }

    // Check for duplicates
    const duplicateExists = this.filterData.some(item => {
      return item.TeamID == this.TeamId && item.StaffID === formValue.StaffID;
    });


    if (duplicateExists) {
      this.toastr.warning('Duplicate Team Member.');
      return;
    }

    try {
      let obj = {
        DistrictID: this.FlyingSquadForm.value.DistrictID,
        InstituteID: this.FlyingSquadForm.value.InstituteID,
        EndTermId: this.sSOLoginDataModel.EndTermID,
        StaffID: this.FlyingSquadForm.value.StaffID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        TeamID: this.TeamId,
        TeamDeploymentID: this.TeamDeploymentID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        CreatedBy: this.sSOLoginDataModel.RoleID,
        ModifyBy: this.sSOLoginDataModel.RoleID
      };
      this.flyingSquadService.postFlyingSquadForm(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          if (data == 1) {
            this.getFlyingSquad();
            this.toastr.success('Update Successfully');
            this.FlyingSquadForm.reset({
              SubjectID: 0,
              StaffID: 0,
              DistrictID: 0,
              InstituteID: 0
            });
          }
          
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }

  }

  onDelete(staff: any): void {
    Swal.fire({
      title: 'Are you sure you want to delete?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,  // This shows the "No" button
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true  // This makes the "No" button appear on the left
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks "Yes"
        try {
          let obj = {
            DistrictID: staff.DistrictID,
            InstituteID: staff.InstituteID,
            EndTermId: this.sSOLoginDataModel.EndTermID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
            TeamID: this.TeamId,
            ActiveStatus: 0,
            ID: staff.ID,
            DeleteStatus: 1,
            ModifyBy: this.sSOLoginDataModel.RoleID
          };

          this.flyingSquadService.postFlyingSquadForm(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.getFlyingSquad()
              //this.CloseModal();
              //this.getData();
            }, error => console.error(error));

        } catch (Ex) {
          console.log(Ex);
        }
        console.log('Deleted!');
        // Perform the delete action here (e.g., call your delete API)
      } else {
        // If the user clicks "No" or closes the dialog
        console.log('Delete cancelled!');
      }
    });
  }

  SetInchargeFlyingSquad(staff: any, event:any) {
    Swal.fire({
      title: 'Are you sure This Member Set Incharge?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,  // This shows the "No" button
      confirmButtonText: 'Yes, Set Incharge it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true  // This makes the "No" button appear on the left
    }).then((result) => {
      if (result.isConfirmed) {
        // If the user clicks "Yes"
        try {
          this.flyingSquadService.SetInchargeFlyingSquad(staff.ID, staff.TeamID, event.isTrusted == true ? 1 : 0)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.getFlyingSquad();
            }, error => console.error(error));

        } catch (Ex) {
          console.log(Ex);
        }
        console.log('Deleted!');
        // Perform the delete action here (e.g., call your delete API)
      } else {
        // If the user clicks "No" or closes the dialog
        console.log('Delete cancelled!');
      }
    });
  }

  async EditData(content: any, rowData?: any) {
    this.isSubmitted = true;   
    //if (rowData != null && rowData != undefined) {
    //  if (rowData.StreamID != null) {
    //    await this.getSubjectMasterDDL(rowData.StreamID, rowData.SemesterID);
    //  }
    //  this.SSOIDExists = true;
    //  this.EditDataFormGroup.patchValue({
    //    ID: rowData.ID,
    //    SubjectID: rowData.SubjectID,
    //    AssignToSSOID: rowData.StaffSSOID,
    //    StreamID: rowData.StreamID,
    //    SemesterID: rowData.SemesterID
    //  })
    //} else {
    //  this.isSubmitted = false;
    //  this.EditDataFormGroup.patchValue({
    //    ID: 0,
    //    SubjectID: 0,
    //    AssignToSSOID: '',
    //    StreamID: 0,
    //    SemesterID: 0
    //  })
    //  //this.EditDataFormGroup.reset();
    //  //this.clearValidationErrors();
    //}
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
    this.dataSource.data = this.filterData.slice(startIndex, endIndex);
    this.updatePaginationIndexes();
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
    const unwantedColumns = [
      "ID", "TeamID"
    ];
    const filteredData = this.filterData.map((item: { [x: string]: any; }) => {
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

  postFlyingTeamSquadForm() {
    this.isSubmitted = true;
    try {
      let obj = {
        OperationType: this.FlyingTeamSquadForm.value.TeamID > 0 ? "UPDATE" : "POST",
        TeamName: this.FlyingTeamSquadForm.value.TeamName == null || this.FlyingTeamSquadForm.value.TeamName == "" ? this.getFlyingSquadTeamDefault() : this.getFlyingSquadTeamDefault() + '-' + this.FlyingTeamSquadForm.value.TeamName,
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        ActiveStatus: 1,
        DeleteStatus: 0,
        CreatedBy: this.sSOLoginDataModel.RoleID,
        ModifyBy: this.sSOLoginDataModel.RoleID
      };
      this.flyingSquadService.postTeamFlyingSquadForm(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          if (data == 1) {
            this.toastr.success('Update Successfully');
            this.getFlyingTeamSquad();
            this.isSubmitted = false;           
          }

        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }

  }

  async getFlyingTeamSquad() {
    try {
      //this.isSubmitted = true;
      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      };
      await this.flyingSquadService.GetTeamFlyingSquad(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.getFlyingSquadTeamData = data;  // Populate filtered data with the fetched data
          this.AddTeamData();
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  async AddTeamData() {
    this.FlyingTeamSquadForm.patchValue({
      TeamName: ''
    });
    let getFlyingSquadTeamData = this.getFlyingSquadTeamData;
    let maxId = 0;
    if (getFlyingSquadTeamData.length > 0) {
      maxId = (Math.max(...getFlyingSquadTeamData.map(o => o.ID)) + 1)
    } else {
      maxId = 1;
    }
    this.getFlyingSquadTeamDefault.set(this.lstAcedmicYear?.EndTermName + '-FS' + maxId)   
  }

  async AddTeamMemberData(content: any, teamId: any) {
    this.TeamId = teamId;
    await this.getFlyingSquad();
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

}
