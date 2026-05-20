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
import { StudentService } from '../../Services/Student/student.service';
import { ReAssignTeacherDataModel, ReAssignTeacherSaveModel } from '../../Models/StudentSearchModel';

@Component({
  selector: 'app-ReAssignTeacherForAttendance',
  standalone: false,
  templateUrl: './ReAssignTeacherForAttendance.component.html',
  styleUrl: './ReAssignTeacherForAttendance.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReAssignTeacherForAttendanceComponent implements OnInit {
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
  AssignedTeacher_SSOList: any[] = [];
  AssignedTeacher_SSOUpdatedList: any[] = [];
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
  public filterModel = new ReAssignTeacherDataModel();
  public ReAssignSaveData = new ReAssignTeacherSaveModel();
  ReAssignTeacherFormGroup!: FormGroup;

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
    private studentService: StudentService,
  ) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.InstituteName = this.sSOLoginDataModel.FirstName;

  }


  ngOnInit() {
    this.filterData = [];
    this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.filterModel.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.filterModel.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.filterModel.InstituteId = this.sSOLoginDataModel.InstituteID;
    //this.TableForm = this.fb.group({
    //  SemesterID: [null, [Validators.required, DropdownValidators]], // initialize with null
    //  StreamID: [null, [Validators.required, DropdownValidators]],   // initialize with null
    //  DayID: [0, []],
    //  SectionID: [[]],
    //  SubjectID: [0, []],
    //  StaffID: [0, []],
    //  AttendanceStartTime: [''],
    //  AttendanceEndTime: ['']
    //});

    // this.filterModel.SSOID = "0";
    this.TableForm = this.fb.group({
      SSOID: ['', Validators.required],
      From_Date: ['', Validators.required],
      To_Date: ['', Validators.required]
    });

    
    this.getMasterData();
    this.AssignedTeacher_SSOData();
   
    this.ReAssignTeacherFormGroup = this.fb.group({
      SSOID: ['', Validators.required],
      From_Date: ['', Validators.required],
      To_Date: ['', Validators.required]
    });
  }
  get formTable() { return this.TableForm.controls; }
  get _ReAssignTeacherFormGroup() { return this.ReAssignTeacherFormGroup.controls; }

  async getMasterData() {
    debugger
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

  async getSubjectMasterDDL(ID: any, SemesterID: any) {
    if (ID && SemesterID != "" && SemesterID != null) {
      this.commonMasterService.SubjectMaster_StreamIDWise(ID, this.sSOLoginDataModel.DepartmentID, SemesterID).then((data: any) => {
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

  


  async AssignedTeacher_SSOData(){
    debugger
    // const GetSemesterID = this.TableForm.get('SemesterID')?.value;
    let obj={
      InstituteID:this.sSOLoginDataModel.InstituteID,
      DepartmentID:this.sSOLoginDataModel.DepartmentID
    }
    // GetBranchSectionAcRosterData_SSOData
    await this.staffMasterService.GetAssignedTeacher_SSOData(obj)
    .then((data:any)=>{
      data=JSON.parse(JSON.stringify(data));
      this.AssignedTeacher_SSOList=data.Data;

    },(error:any)=>console.error(error)
  );

      // await this.staffMasterService.GetBranchSectionAcRosterData(obj)
      // .then((data: any) => {
      //   data = JSON.parse(JSON.stringify(data));
      //   this.GetSectionData = data.Data;
      //   this.allSections = data.Data;
      //   this.GetSectionData = [...this.allSections];
      // }, (error: any) => console.error(error)
      // );

  }


  async ReAssignTeacherForAttendance() {
    try {
      debugger
      
      this.isSubmitted = true;
      if (this.TableForm.invalid) return;

      this.filterModel.InstituteId = this.sSOLoginDataModel.InstituteID;
      this.filterModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      console.log(this.filterModel);
      console.log(this.TableForm.value);
      console.log(this.filterModel.SSOID);
      //if (this.TableForm.invalid) {
      //  this.toastr.warning("Please select Semester or Stream !")
      //  return;
      //} 
      this.loaderService.requestStarted();
      const response = await this.studentService.GetReAssignTeacher(this.filterModel);
      const data = JSON.parse(JSON.stringify(response));
      if (data.State === EnumStatus.Success) {
        this.filterData = data.Data;
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

  resetForm(): void {
    this.filterModel = new ReAssignTeacherDataModel();
    this.totalRecords = 0;
    this.displayedColumns = [];
    this.filterData = [];
    this.ReAssignTeacherForAttendance();
  }

  buildDynamicColumns(): void {
    if (!this.filterData.length) return;

    const sampleItem = this.filterData[0];
    const columnKeys = Object.keys(sampleItem);

    // List of columns you want to exclude
    const excludedColumns = ['ID', 'StaffID', 'rdID','AssignedStaffID'];

    this.columnSchema = columnKeys
      .filter(key => !excludedColumns.includes(key))
      .map(key => ({
        key,
        label: this.formatColumnLabel(key),
        isDate: key.toLowerCase().includes('date')
      }));



    this.columnSchema.push({ key: 'Action', label: 'Action', isAction: true });
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

  onRowChecked(element: any) {
    console.log('Row checked:', element);
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
    this.isSubmitted = true;
    debugger
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
          debugger
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

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download =   'RosterDisplay_PDFTimeTable.pdf';
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

  async ReAssignTeacherFor(content: any) {
    debugger;

    console.log(this.AssignedTeacher_SSOList);
    // ✅ Check if at least one record is selected
    const selectedRecords = this.dataSource.data.filter((x: any) => x.isSelected);

    if (!selectedRecords || selectedRecords.length === 0) {
     
      this.toastr.warning('Please select at least one record before saving.');
      return;
    }
    // ✅ More than one record selected
    if (selectedRecords.length > 1) {
      this.toastr.warning('Please select only one record.');
      return;
    }

    const selectedRecord = selectedRecords[0];

    if(selectedRecord.StaffID){
      this.AssignedTeacher_SSOUpdatedList=this.AssignedTeacher_SSOList.filter(
        (x:any)=>x.ID!=selectedRecord.StaffID
      );
    }
    // If valid, continue with modal logic
    debugger
    this.ReAssignSaveData.From_Date = this.formatDate(selectedRecord.FromDate);
    this.ReAssignSaveData.To_Date = this.formatDate(selectedRecord.ToDate);
    this.ReAssignSaveData.StaffID = selectedRecord.StaffID;
    this.ReAssignSaveData.AssignTeacherForSubjectID = selectedRecord.ID;
    this.ReAssignSaveData.rdID = selectedRecord.rdID;
    this.ReAssignSaveData.SSOIDBY = this.sSOLoginDataModel.SSOID;

    console.log(this.AssignedTeacher_SSOUpdatedList);
    try {
      await this.modalService
        .open(content, {
          size: 'xl',
          ariaLabelledBy: 'modal-basic-title',
          backdrop: 'static',
        })
        .result;

    } catch (reason: any) {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }
  }


  formatDate(dateStr: string): string {

    if (!dateStr) return '';

    // dd-MM-yyyy -> yyyy-MM-dd
    const parts = dateStr.split('-');

    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }

  async ReAssignTeacherForSaveLC() {
    debugger
    this.isSubmitted = true;
    this.ReAssignSaveData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.ReAssignSaveData.InstituteID = this.sSOLoginDataModel.DepartmentID;
    this.ReAssignSaveData.SSOID = this.ReAssignSaveData.SSOID;
    await this.studentService.ReAssignTeacherForSaveLC(this.ReAssignSaveData)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        debugger
        

        if (data.State === EnumStatus.Success) {
          this.toastr.success('Section data saved successfully!');
          this.isSubmitted = false;
          this.CloseModalReAssignTeacherForSave();
          
          this.filterModel = new ReAssignTeacherDataModel(); 
          setTimeout(() => {

            window.location.reload();
          }, 1500);

        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);

          setTimeout(() => {
            window.location.reload();
          }, 1500);

        } else {
          this.toastr.error('Some error! Please check.');
        }


      }, (error: any) => console.error(error)
      );

   

  }
  async CloseModalReAssignTeacherForSave() {
    this.ReAssignSaveData.SSOID = "";
    
  }

}


