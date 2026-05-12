import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { AppsettingService } from '../../Common/appsetting.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StaffMasterService } from '../../Services/StaffMaster/staff-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../Common/GlobalConstants';
import { BTERSectionAddDataModel } from '../../Models/BTER/BTERSectionAddDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AttendanceServiceService } from '../../Services/AttendanceServices/attendance-service.service';
import { RosterDisplayTimeTableDataModel } from '../../Models/StaffMasterDataModel';
@Component({
  selector: 'app-bter-room-utilization',
  standalone: false,
  templateUrl: './bter-room-utilization.component.html',
  styleUrl: './bter-room-utilization.component.css'
})
export class BterRoomUtilizationComponent {
  displayedColumns: string[] = [];
  columnSchema: Array<{ key: string; label: string; isAction?: boolean; isDate?: boolean }> = [];

  dataSource = new MatTableDataSource<any>();
  dynamicColumns: string[] = [];
  filterData: any[] = [];
  EditDataFormGroup!: FormGroup;
  isSubmitted: boolean = false;
  StreamMasterDDL: any[] = [];
  SemesterMasterDDL: any[] = [];
  DayList: any[] = [];
  SubjectMasterDDL: any[] = [];
  GetSectionData: any[] = [];
  InstituteMasterDDL: any[] = [];
  DistrictMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  allSections: any[] = [];
  timeColumns: string[] = [];
  InstituteName!: string;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  TableForm!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  _RosterDisplayTimeTableDataModel = new RosterDisplayTimeTableDataModel();
  private _liveAnnouncer = inject(LiveAnnouncer);
  checkedAll: boolean = false;
  // Pagination related variables
  totalRecords = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  startInTableIndex = 1;
  endInTableIndex = 10;
  AddedSectionList: BTERSectionAddDataModel[] = [];
  streamId!: number;
  semesterId!: number;
  subjectId!: number;
  minTime = '09:00';
  maxTime = '18:00'; // 6:00 PM in 24-hour format
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  modalRef1: NgbModalRef | null = null;
  closeResult: string | undefined;
  totalRecord1 = 0;
  dataSource1!: MatTableDataSource<any>;
  GetGenerateTimetableData: any = [];
  @ViewChild('paginator1') paginator1!: MatPaginator;
  filterModel: any = {
    StaffID: 0,
    StreamID: 0,
    SubjectID: 0,
    InstituteID: 0,
    EndTermID: 0,
    DepartmentID: 0,
    CourseTypeID: 0,
    SemesterID: 0,
    SectionID: 0,
    DayID: 0,
    AttendanceEndDate: '',
    AttendanceStartDate: ''
    /*AttendanceDate: ''*/
  };
  minEndDate: string | null = null;
  constructor(
    private fb: FormBuilder,
    private loaderService: LoaderService,
    private staffMasterService: StaffMasterService,
    private http: HttpClient, private route: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private attendanceServiceService: AttendanceServiceService,
  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.InstituteName = this.sSOLoginDataModel.FirstName;

  }


  ngOnInit() {
    this.filterData = [];
    this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filterModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.filterModel.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.filterModel.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.TableForm = this.fb.group({
      SemesterID: [0,],
      StreamID: [0,],
      DayID: [0, []],
      SectionID: [[]],
      SubjectID: [0, []],
      StaffID: [0, []],
      AttendanceStartDate: [''],
      AttendanceEndDate: ['']
    });
    this.DayListBind();

    this.getMasterData();
    /* this.GetAllRosterDisplay();*/

    this.GetAllRosterDisplay();

  }
  get formTable() { return this.TableForm.controls; }

  DayListBind() {
    this.DayList = [
      { DayID: 2, DayName: 'Monday' },
      { DayID: 3, DayName: 'Tuesday' },
      { DayID: 4, DayName: 'Wednesday' },
      { DayID: 5, DayName: 'Thursday' },
      { DayID: 6, DayName: 'Friday' },
      { DayID: 7, DayName: 'Saturday' },
      { DayID: 1, DayName: 'Sunday' },
    ];
  }


  onStartDateChange(event: any) {

    const startDate = event.target.value;
    if (startDate) {
      this.minEndDate = startDate; // set min for end date
      const endDate = this.TableForm.value.AttendanceEndDate;

      // if already selected end date is smaller, reset it
      if (endDate && endDate < startDate) {
        this.TableForm.patchValue({ AttendanceEndDate: '' });
      }
    }
  }


  async getMasterData() {
    try {

      await this.GetStaff_InstituteWise();

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDL = data.Data;
        this.cd.detectChanges();
      })
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
        this.cd.detectChanges();
      })
      //await this.commonMasterService.GetDistrictMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.DistrictMasterDDL = data.Data;
      //});
      /*    this.getSubjectMasterDDL(this.streamId, this.semesterId);*/
    } catch (error) {
      console.error(error);
    }
  }

  async getSubjectMasterDDL() {

    if (this.filterModel.SemesterID && this.filterModel.StreamID) {
      this.commonMasterService.SubjectMaster_StreamIDWise(this.filterModel.StreamID, this.sSOLoginDataModel.DepartmentID, this.filterModel.SemesterID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SubjectMasterDDL = data.Data;
      })
    }
  }

  async GetStaff_InstituteWise() {
    let obj = {
      InstituteID: this.sSOLoginDataModel.InstituteID,
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

  onChangeDay(event: any) {
    const value = event.target.value;
    console.log("Selected:", value);
    // Convert to number (optional but recommended)
    this.filterModel.DayID = Number(value);
    console.log("Updated Model:", this.filterModel.DayID);
  }

  formatDate(value: any): string {
    if (!value) return '';

    const d = value instanceof Date ? value : new Date(value);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  async GetAllRosterDisplay() {
    debugger;
    try {

      debugger
      const rawStart = this.TableForm.value.AttendanceStartDate;
      const rawEnd = this.TableForm.value.AttendanceEndDate;

      // Parse correctly whether string or Date
      const formattedDateStart =
        typeof rawStart === 'string'
          ? rawStart
          : this.formatDate(rawStart);

      const formattedDateEnd =
        typeof rawEnd === 'string'
          ? rawEnd
          : this.formatDate(rawEnd);


      this.filterModel.AttendanceStartDate = formattedDateStart
      this.filterModel.AttendanceEndDate = formattedDateEnd

      this.loaderService.requestStarted();
      const response = await this.staffMasterService.GetAllRoomUtilizationReport(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.filterData = data.Data;
        // this.filterData = this.filterData.filter((item: any) => item.SemesterID == this.filterModel.SemesterID && item.StreamID == this.filterModel.StreamID)

        //let filteredData = data.Data;

        //if (
        //  (this.filterModel.SemesterID && this.filterModel.SemesterID !== 0) ||
        //  (this.filterModel.StreamID && this.filterModel.StreamID !== 0)
        //) {
        //  filteredData = filteredData.filter((item: any) => {
        //    const semesterMatch =
        //      !this.filterModel.SemesterID || this.filterModel.SemesterID === 0
        //        ? true
        //        : item.SemesterID === this.filterModel.SemesterID;

        //    const streamMatch =
        //      !this.filterModel.StreamID || this.filterModel.StreamID === 0
        //        ? true
        //        : item.StreamID === this.filterModel.StreamID;

        //    return semesterMatch && streamMatch;
        //  });
        //} else {

        //  this.toastr.warning("Please select Semester or Stream !")
        //}






        this.buildDynamicColumns();
        this.dataSource = new MatTableDataSource(this.filterData);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.totalRecords = this.filterData.length;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
        this.updateTable();

      } else {
        if (this.dataSource) {
          this.dataSource.data = [];
        }
        else {
          this.dataSource = new MatTableDataSource();
        }
      }
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  trackByFn(index: number, item: any): any {
    return item.id || index; // use unique ID if available
  }



  async BindSubject() {
    this.TableForm.patchValue({
      SubjectID: 0,
    });
    const GetstreamId = this.TableForm.get('StreamID')?.value;
    const GetSemesterID = this.TableForm.get('SemesterID')?.value;
    let obj = {
      Action: "GET_BY_ID",
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      StreamID: GetstreamId,

    }
    await this.staffMasterService.GetBranchSectionData(obj)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetSectionData = data.Data;
        this.allSections = data.Data;
        this.GetSectionData = [...this.allSections];
      }, (error: any) => console.error(error)
      );

  }

  async DeleteRow(Id: number = 0) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          if (Id > 0) {
            try {
              let request =
              {
                ID: Id,
                CreatedBy: this.sSOLoginDataModel.UserID
              };
              //Show Loading
              this.loaderService.requestStarted();
              /*     alert(isParent)*/
              await this.staffMasterService.DeleteRosterDisplay(request)
                .then(async (data: any) => {
                  data = JSON.parse(JSON.stringify(data));
                  console.log(data)

                  if (data.State == EnumStatus.Success) {
                    this.toastr.success(data.Message)
                    //this.GetOfficeMasterList()
                    // await this.GetEducationDetails();
                    this.GetAllRosterDisplay();
                  }
                  else {
                    this.toastr.error(data.ErrorMessage)
                  }

                }, (error: any) => console.error(error)
                );
            }
            catch (ex) {
              console.log(ex);
            }
            finally {
              setTimeout(() => {
                this.loaderService.requestEnded();
              }, 200);
            }
          }



        }

      });
  }



  resetForm(): void {
    this.filterModel = {
      StaffID: 0,
      SubjectID: 0,
      InstituteID: 0,
      SemesterID: 0,
      StreamID: 0,
      /*AttendanceDate: '',*/
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CourseTypeID: this.sSOLoginDataModel.Eng_NonEng
    };
    this.totalRecords = 0;
    this.displayedColumns = [];
    this.filterData = [];
    this.GetAllRosterDisplay();
  }

  buildDynamicColumns(): void {
    if (!this.filterData.length) return;

    const sampleItem = this.filterData[0];
    const columnKeys = Object.keys(sampleItem);

    // List of columns you want to exclude
    const excludedColumns = ['ID', 'InstituteID', 'SubjectID', 'EndTermName', 'SemesterID', 'StaffID', 'StreamID', 'CourseTypeID', 'DepartmentID', 'EndTermID'];

    this.columnSchema = columnKeys
      .filter(key => !excludedColumns.includes(key))
      .map(key => ({
        key,
        label: this.formatColumnLabel(key),
        isDate: key.toLowerCase().includes('date')
      }));




    this.displayedColumns = this.columnSchema.map(col => col.key);
  }

  formatColumnLabel(key: string): string {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  }

  onPaginationChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.updateTable();
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  exportToExcel(): void {
    const filteredData = this.filterData.map(({ StudentID, ...rest }) => rest);
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `RosterDasplay.xlsx`);
  }





  reset() {
    this.TableForm.reset();
    this.isSubmitted = false;
    this.TableForm.patchValue({
      SubjectID: 0,
      StreamID: 0,
      StaffID: 0,
      DayID: 0,
      SectionID: 0,
      SemesterID: 0,
      /* AttendanceDate: new Date(),*/
      AttendanceStartTime: '09:00',
      AttendanceEndTime: '10:00'
    });
  }



  async GenerateTimetableData(content: any) {
    debugger;
    this.isSubmitted = true;
    // Open only once, store reference
    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    // Handle result or dismissal
    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );

    this._RosterDisplayTimeTableDataModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this._RosterDisplayTimeTableDataModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this._RosterDisplayTimeTableDataModel.SemesterID = 0;
    this._RosterDisplayTimeTableDataModel.StreamID = this.filterModel.StreamID;
    this._RosterDisplayTimeTableDataModel.SubjectID = 0;

    await this.GetRosterDisplay_PDFTimeTablePDF();

    await this.attendanceServiceService.GetRosterDisplay_PDFTimeTable(this._RosterDisplayTimeTableDataModel)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.GetGenerateTimetableData = data.Data
        this.totalRecord1 = data['Data'].length;
        if (this.GetGenerateTimetableData && this.GetGenerateTimetableData.length > 0) {
          // Extract all keys from the first object
          const allKeys = Object.keys(this.GetGenerateTimetableData[0]);
          // Filter keys that look like time slots (contain ":")
          this.timeColumns = allKeys.filter(k => k.includes(':'));
        }

        console.log(this.GetGenerateTimetableData)
        this.initTable1(this.GetGenerateTimetableData);
      }, (error: any) => console.error(error)
      );

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

  CloseModal1() {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
      this.modalRef1 = null;
      this.isSubmitted = false;
    }
  }
  initTable1(data: any) {
    this.dataSource1 = new MatTableDataSource(data);
    this.dataSource1.paginator = this.paginator1;
    this.dataSource1.sort = this.sort;
  }

  async GetRosterDisplay_PDFTimeTablePDF() {
    debugger
    try {

      this.loaderService.requestStarted();

      debugger;

      this._RosterDisplayTimeTableDataModel.StaffID = this.filterModel.StaffID;

      await this.attendanceServiceService.GetRosterDisplay_PDFTimeTable(this._RosterDisplayTimeTableDataModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GetGenerateTimetableData = data.Data
          this.totalRecord1 = data['Data'].length;
          if (this.GetGenerateTimetableData && this.GetGenerateTimetableData.length > 0) {
            // Extract all keys from the first object
            const allKeys = Object.keys(this.GetGenerateTimetableData[0]);
            // Filter keys that look like time slots (contain ":")
            this.timeColumns = allKeys.filter(k => k.includes(':'));
          }

          console.log(this.GetGenerateTimetableData)
          this.initTable1(this.GetGenerateTimetableData);
        }, (error: any) => console.error(error)
        );




      await this.attendanceServiceService.GetRosterDisplay_PDFTimeTableDownload(this._RosterDisplayTimeTableDataModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const today = new Date();

            // Format date as DD-MM-YYYY
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();

            const formattedDate = `${dd}-${mm}-${yyyy}`;

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `RosterDisplay_PDFTimeTable_${formattedDate}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
