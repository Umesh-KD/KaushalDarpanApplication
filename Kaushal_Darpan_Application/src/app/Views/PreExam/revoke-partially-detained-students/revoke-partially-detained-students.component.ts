import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GetPartiallyDetainedStudentDataModel, PreExamStudentDataModel } from '../../../Models/PreExamStudentDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { PreExamStudentExaminationService } from '../../../Services/PreExamStudent/pre-exam-student-examination.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
  selector: 'app-revoke-partially-detained-students',
  standalone: false,
  templateUrl: './revoke-partially-detained-students.component.html',
  styleUrl: './revoke-partially-detained-students.component.css'
})
export class RevokePartiallyDetainedStudentsComponent {
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new GetPartiallyDetainedStudentDataModel();

  public SearchStudentDataFormGroup!: FormGroup;

  public SemesterMasterList: any = [];
  public SessionTypeList: any = [];
  public InstituteMasterList: any = [];
  public StreamMasterList: any = [];
  public PartiallyDetainedStudentList: any = [];
  public StudentPapersList: any = [];

  closeResult: string | undefined;

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default

  constructor(
    private commonMasterService: CommonFunctionService,
    private preExamStudentExaminationService: PreExamStudentExaminationService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private Swal2: SweetAlert2,
  ){ }

  async ngOnInit() {
    this.SearchStudentDataFormGroup = this.formBuilder.group({
      txtEnrollmentNo: [''],
      ddlInstituteID: [''],
      ddlStreamID: [''],
      ddlSemesterID: [''],
      txtStudentName: [''],
    })

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetMasterData();

    await this.GetPartiallyDetainedStudentList();
  }

  async GetMasterData() {
    //debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetExamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.SessionTypeList = data['Data'];
        }, (error: any) => console.error(error));
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

  async GetPartiallyDetainedStudentList() {
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.Action = "GetPartiallyDetainedStudentList";
      
      await this.preExamStudentExaminationService.GetPartiallyDetainedStudentList(this.request).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.PartiallyDetainedStudentList = data['Data'];
          this.loadInTable();
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_Clear() {
    this.request = new GetPartiallyDetainedStudentDataModel();
    await this.GetPartiallyDetainedStudentList();
  }

  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.PartiallyDetainedStudentList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  // (replace org. list here)
  async sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.PartiallyDetainedStudentList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.PartiallyDetainedStudentList.length;
  }
  // (replace org. list here)
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }

  // end table feature

  async openDetainedSubjectDetails(content: any, StudentID: number, StudentExamID: number) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetStudentPaperDetails(StudentID, StudentExamID);
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

  closeModalStudentPaperList() {
    this.modalService.dismissAll();
    this.StudentPapersList = [];
  }

  async GetStudentPaperDetails(StudentID: number, StudentExamID: number) {
    try {

      const paperReq: any = {};
      paperReq.StudentExamID = StudentExamID;
      paperReq.Action = "GetStudentPaperDetails";

      await this.preExamStudentExaminationService.GetPartiallyDetainedStudentList(paperReq).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.StudentPapersList = data['Data'];
        }
        else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  // 1. Checks if all items in the list are checked
  isAllSelected(): boolean {
    if (!this.StudentPapersList || this.StudentPapersList.length === 0) {
      return false;
    }
    return this.StudentPapersList.every((row: any) => row.Selected);
  }

  // 2. Toggles all rows based on the header checkbox state
  toggleAll(event: any): void {
    const isChecked = event.target.checked;
    this.StudentPapersList.forEach((row: any) => row.Selected = isChecked);
  }

  // 3. Helper method to extract data when you need to process selected rows (e.g., on a button click)
  getSelectedRows() {
    const selectedPapers = this.StudentPapersList.filter((row: any) => row.Selected);
    console.log('Selected Papers:', selectedPapers);
  }

  async RevokePartiallyDetainedStudents() {
    
    try {
      const anySelected = this.StudentPapersList.some((row: any) => row.Selected);
      if (!anySelected) {
        this.toastr.error('Please select at least one paper to revoke.');
        return;
      }

      this.Swal2.Confirmation("Are you sure to revoke partially detained student selected papers?", async (result: any) => {
        if (result.isConfirmed) {
          const selectedPapers = this.StudentPapersList.filter((row: any) => row.Selected);
          console.log('Selected Papers:', selectedPapers);

          selectedPapers.forEach((row: any) => {
            row.UserID = this.sSOLoginDataModel.UserID;
          });

          await this.preExamStudentExaminationService.RevokePartiallyDetainedStudent(selectedPapers).then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.closeModalStudentPaperList();
              await this.GetPartiallyDetainedStudentList();
            }
            else {
              this.toastr.error(data.ErrorMessage);
            }
          })
        }
      });
      
    } catch (error) {
      console.error(error);
    }
  }
}
