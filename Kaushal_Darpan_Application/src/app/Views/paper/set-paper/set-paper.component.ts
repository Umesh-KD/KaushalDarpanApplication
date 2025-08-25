import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from 'jspdf';
import { AppsettingService } from '../../../Common/appsetting.service';
import { GlobalConstants } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import { PaperService } from '../../../Services/Papers/papers.service';

@Component({
  selector: 'app-set-paper',
  standalone: false,
  templateUrl: './set-paper.component.html',
  styleUrl: './set-paper.component.css'
})
export class SetPaperComponent {
  paperForm!: FormGroup;
  EditDataFormGroup!: FormGroup;
  AssignStaffDataFormGroup!: FormGroup;
  displayedColumns: string[] = ['SrNo', 'Stream', 'SemesterName', 'CourseTypeName', 'EndTermName', 'QuestionLimit', 'Actions'];
  displayedQuestionColumns: string[] = ['SrNo', 'QuestionText', 'SemesterName', 'SubjectName', 'TradeName', 'Actions'];
  displayedAssignStaffColumns: string[] = ['SrNo', 'Name', 'SSOID', 'SemesterName', 'SubjectName', 'TradeName','QuestionLimit', 'Actions'];
  SemesterMasterDDL: any[] = [];
  StreamMasterDDL: any[] = [];
  SubjectMasterDDL: any[] = [];
  ExaminerDDL: any[] = [];
  filterData: any[] = [];
  filterQuestionData: any[] = [];
  filterAssignStaffData: any[] = [];
  private _liveAnnouncer = inject(LiveAnnouncer);
  dataSource = new MatTableDataSource<any>([]);
  dataQuestionSource = new MatTableDataSource<any>([]);
  dataAssignStaffSource = new MatTableDataSource<any>([]);
  sSOLoginDataModel = new SSOLoginDataModel();
  isSubmitted: boolean = false;
  // Pagination related variables
  totalRecords: number = 0;
  totalQuestionRecords: number = 0;
  pageQuestionSize: number = 10;
  totalAssignStaffRecords: number = 0;
  pageAssignStaffSize: number = 10;
  pageSize: number = 10;
  currentPage: number = 1;
  currentQuestionPage: number = 1;
  currentAssignStaffPage: number = 1;
  SSOIDExists: boolean = false;
  totalPages: number = 0;
  totalQuestionPages: number = 0;
  totalAssignStaffPages: number = 0;
  startInTableIndex: number = 1;
  closeResult: string | undefined;
  endInTableIndex: number = 10;
  questionLimit: number = 100;
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatSort) sortQuestion!: MatSort;
  @ViewChild(MatSort) sortAssignStaff!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginatorQuestion!: MatPaginator;
  @ViewChild(MatPaginator) paginatorAssignStaff!: MatPaginator;
  modalReference: NgbModalRef | undefined;
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private commonMasterService: CommonFunctionService,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService, private paperService: PaperService, private toastr: ToastrService,
    private router: Router,) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getMasterData();
    this.getPaper();
  }

  ngOnInit() {
    this.paperForm = this.fb.group({
      SubjectID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SemesterID: [0, Validators.required],
      QuestionLimit: ['', Validators.required]
    });
    this.AssignStaffDataFormGroup = this.fb.group({      
      ID: [''],
      PaperID: [''],
      SubjectID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SemesterID: [0, Validators.required],
      QuestionLimit: ['', Validators.required],
      StaffID: [0, Validators.required]
    });

    this.EditDataFormGroup = this.fb.group({
      ID: [''],
      QuestionId: [''],
      SubjectID: [0, Validators.required],
      StreamID: [0, Validators.required],
      SemesterID: [0, Validators.required],
      Question: ['', Validators.required],
      Option1: ['', Validators.required],
      Option2: ['', Validators.required],
      Option3: ['', Validators.required],
      Option4: ['', Validators.required],
      Answer: [0, Validators.required]
    });

    //this.EditDataFormGroup.get('SubjectID')!.disable();
    //this.EditDataFormGroup.get('SemesterID')!.disable();
    //this.EditDataFormGroup.get('StreamID')!.disable();
    //this.AssignStaffDataFormGroup.get('SubjectID')!.disable();
    //this.AssignStaffDataFormGroup.get('SemesterID')!.disable();
    //this.AssignStaffDataFormGroup.get('StreamID')!.disable();
  }
  get formPaperForm() { return this.paperForm.controls; }
  get formEditData() { return this.EditDataFormGroup.controls; }
  get formAssignStaffData() { return this.AssignStaffDataFormGroup.controls; }

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
      await this.commonMasterService.Examiner_SSOID(this.sSOLoginDataModel.DepartmentID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminerDDL = data.Data;
      })
    } catch (error) {
      console.error(error);
    }
  }

  SubjectMaster_StreamIDWise(ID: any) {
    this.commonMasterService.SubjectMaster_StreamIDWise(this.paperForm.value.StreamID, this.sSOLoginDataModel.DepartmentID, ID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })
  }
  getSubjectMasterDDL(StreamID: any,ID:any) {
    this.commonMasterService.SubjectMaster_StreamIDWise(StreamID, this.sSOLoginDataModel.DepartmentID, ID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })
  }

  async getPaper() {
    try {
      //this.isSubmitted = true;
      let obj = {
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
      };
      await this.paperService.GetSetPaper(obj)
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

  postpaperForm() {
    this.isSubmitted = true;
    if (this.paperForm.invalid || this.paperForm.value.StreamID === 0 || this.paperForm.value.DistrictID === 0 || this.paperForm.value.SemesterID === 0 || this.paperForm.value.ShiftID === 0 || this.paperForm.value.InstituteID === 0) {
      this.isSubmitted = false;
      this.toastr.warning('Please fill all required fields correctly.');
      return
    }
    try {
      let obj = {
        StreamID: this.paperForm.value.StreamID,
        SemesterID: this.paperForm.value.SemesterID,
        SubjectID: this.paperForm.value.SubjectID,
        QuestionLimit: this.paperForm.value.QuestionLimit,
        EndTermId: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        ActiveStatus: 1,
        DeleteStatus: 0,
        CreatedBy: this.sSOLoginDataModel.RoleID,
        ModifyBy: this.sSOLoginDataModel.RoleID
      };
      this.paperService.PostSetPaper(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          if (data == 1) {
            this.getPaper();
            this.toastr.success('Update Successfully');
            this.paperForm.reset({
              SubjectID: 0,
              StreamID: 0,
              SSOID: 0,
              SemesterID: 0,
              DistrictID: 0,
              InstituteID: 0,
              ShiftID: 0,
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
            ID: staff.ID,
            DeleteStatus: 1,
            EndTermId: this.sSOLoginDataModel.EndTermID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
          };
          this.paperService.PostSetPaper(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              this.toastr.success('Update Successfully');
              this.getPaper()
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

  async EditData(content: any, rowData?: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        await this.SubjectMaster_StreamIDWise1(rowData.StreamID, this.sSOLoginDataModel.DepartmentID, rowData.SemesterID);
      }
      this.questionLimit = rowData.QuestionLimit;
      console.log(this.questionLimit);
      this.EditDataFormGroup.patchValue({
        ID: rowData.ID,
        SubjectID: rowData.SubjectID,
        StreamID: rowData.StreamID,
        SemesterID: rowData.SemesterID,
        QuestionId: rowData.QuestionId,
        Question: '',
        Option1: '',
        Option2: '',
        Option3: '',
        Option4: '',
        Answer: 0,
      });
      this.isSubmitted = false;
      this.GetAllQuestion();
    } else {
      this.EditDataFormGroup.patchValue({
        Question: '',
        QuestionId: '',
        Option1: '',
        Option2: '',
        Option3: '',
        Option4: '',
        Answer: 0
      })
    }
  }

  SubjectMaster_StreamIDWise1(StreamID: any, DepartmentID: any, ID: any) {
    this.commonMasterService.SubjectMaster_StreamIDWise(this.EditDataFormGroup.value.StreamID, this.sSOLoginDataModel.DepartmentID, ID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.SubjectMasterDDL = data.Data;
    })

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

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
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

 

/*  Question ADD Edit Details Start*/

  async GetAllQuestion() {
    try {
      // Create the object for the POST request
      let obj = {
        QuestionText: "",
        // QuestionId: this.EditDataFormGroup.value.QuestionId,
        PaperID: this.EditDataFormGroup.value.ID,
        SemesterID: this.EditDataFormGroup.value.SemesterID,
        StreamID: this.EditDataFormGroup.value.StreamID,
        SubjectID: this.EditDataFormGroup.value.SubjectID
      };

      await this.paperService.GetAllQuestion(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.filterQuestionData = data;  // Populate filtered data with the fetched data
          this.dataQuestionSource.data = this.filterQuestionData;
          this.dataQuestionSource.sort = this.sortQuestion;  // Set sort behavior
          this.totalQuestionRecords = this.filterQuestionData.length;
          this.totalQuestionPages = Math.ceil(this.totalQuestionRecords / this.pageQuestionSize);
          this.updateQuestionTable();  // Update table based on pagination
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  async SaveQuestionData() {
    this.isSubmitted = true;

    // Map options to the format required for AnswerOptions
    const options = [
      this.EditDataFormGroup.value.Option1,
      this.EditDataFormGroup.value.Option2,
      this.EditDataFormGroup.value.Option3,
      this.EditDataFormGroup.value.Option4
    ];

    const answerOptions = options.map((option, index) => {
      return [option, index + 1 === this.EditDataFormGroup.value.Answer]; // Answer is 1-based index
    });

    try {
      // Create the object for the POST request
      let obj = {
        OperationType: this.EditDataFormGroup.value.QuestionId > 0 ? 'UPDATE' : 'POST',
        QuestionText: this.EditDataFormGroup.value.Question,
        QuestionId: this.EditDataFormGroup.value.QuestionId,
        PaperID: this.EditDataFormGroup.value.ID,
        SemesterID: this.EditDataFormGroup.value.SemesterID,
        StreamID: this.EditDataFormGroup.value.StreamID,
        SubjectID: this.EditDataFormGroup.value.SubjectID,
        AnswerOptions: JSON.stringify(answerOptions) // Convert the options to JSON
      };

      await this.paperService.PostAddQuestion(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          console.log(data);
          /*let getFilterQuestionData = data;*/
          this.GetAllQuestion();
          this.EditDataFormGroup.patchValue({
            ID: this.EditDataFormGroup.value.ID,
            SubjectID: this.EditDataFormGroup.value.SubjectID,
            StreamID: this.EditDataFormGroup.value.StreamID,
            SemesterID: this.EditDataFormGroup.value.SemesterID,
            QuestionId: '',
            Question: '',
            Option1: '',
            Option2: '',
            Option3: '',
            Option4: '',
            Answer: 0,
          });
          this.isSubmitted = false;
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }

    // Here you can send `obj` in your HTTP request
  }

  updateQuestionTable(): void {
    const startIndex = (this.currentQuestionPage - 1) * this.pageQuestionSize;
    const endIndex = Math.min(startIndex + this.pageQuestionSize, this.totalQuestionRecords);
    this.dataQuestionSource.data = this.filterQuestionData.slice(startIndex, endIndex);
    this.updatePaginationQuestionIndexes();
  }

  onPaginationQuestionChange(event: PageEvent): void {
    this.pageQuestionSize = event.pageSize;
    this.currentQuestionPage = event.pageIndex + 1;
    if (this.currentQuestionPage < 1) this.currentQuestionPage = 1;
    else if (this.currentQuestionPage > this.totalQuestionPages) this.currentQuestionPage = this.totalQuestionPages;
    this.updateQuestionTable();  // Update table when pagination changes
  }

  updatePaginationQuestionIndexes(): void {
    this.startInTableIndex = (this.currentQuestionPage - 1) * this.pageQuestionSize + 1;
    this.endInTableIndex = Math.min(this.currentQuestionPage * this.pageQuestionSize, this.totalQuestionRecords);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async EditQuestionData(rowData: any) {
    try {
      let obj = {
        OperationType: 'GET',
        QuestionId: rowData.QuestionId
      };

      await this.paperService.GetByIdQuestion(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data'][0]));
          let answerOptionsString = data.AnswerOptions;
          try {
            answerOptionsString = answerOptionsString.replace(/\b([a-zA-Z0-9_]+)\b/g, '"$1"');
            answerOptionsString = `[${answerOptionsString}]`;
            const answerOptions = JSON.parse(answerOptionsString);
            const correctAnswerIndex = answerOptions.findIndex((option: boolean[]) => option[1] === true);

            this.EditDataFormGroup.patchValue({
              Question: data.QuestionText,
              QuestionId: data.QuestionId,
              Option1: answerOptions[0][0],
              Option2: answerOptions[1][0],
              Option3: answerOptions[2][0],
              Option4: answerOptions[3][0],
              Answer: (correctAnswerIndex + 2),
            });
          } catch (error) {
            console.error("Error parsing answer options:", error);
          }
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  onQuestionDelete(rowData: any) {
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
            OperationType: 'DELETE',
            QuestionId: rowData.QuestionId
          };

          this.paperService.PostAddQuestion(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              if (data == 1) {
                this.toastr.success('Update Question Successfully');
                this.GetAllQuestion();
              }
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

  /*  Question ADD Edit Details End*/

  /*Assign Staff Start*/
  async AssignStaffData(content: any, rowData?: any) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    if (rowData != null && rowData != undefined) {
      if (rowData.StreamID != null) {
        await this.SubjectMaster_StreamIDWise1(rowData.StreamID, this.sSOLoginDataModel.DepartmentID, rowData.SemesterID);
      }
      this.questionLimit = rowData.QuestionLimit;
      console.log(this.questionLimit);
      this.AssignStaffDataFormGroup.patchValue({
        ID: 0,
        PaperID: rowData.ID,
        SubjectID: rowData.SubjectID,
        StreamID: rowData.StreamID,
        SemesterID: rowData.SemesterID,
        QuestionLimit: '',
        StaffID: 0,
      });
      this.isSubmitted = false;
      this.GetAllAssignStaffData();
    } else {
      this.AssignStaffDataFormGroup.patchValue({
        QuestionLimit: '',
        StaffID: 0,
      })
    }
  }

  async SaveAssignStaffData() {
    this.isSubmitted = true;
    try {
      // Create the object for the POST request
      let obj = {
        OperationType: this.AssignStaffDataFormGroup.value.ID > 0 ? 'UPDATE' : 'POST',
        ID: this.AssignStaffDataFormGroup.value.ID,
        PaperID: this.AssignStaffDataFormGroup.value.PaperID,
        SemesterID: this.AssignStaffDataFormGroup.value.SemesterID,
        StreamID: this.AssignStaffDataFormGroup.value.StreamID,
        SubjectID: this.AssignStaffDataFormGroup.value.SubjectID,
        QuestionLimit: this.AssignStaffDataFormGroup.value.QuestionLimit,
        StaffID: this.AssignStaffDataFormGroup.value.StaffID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        ActiveStatus: 1,
        DeleteStatus: 0,
        CreatedBy: this.sSOLoginDataModel.RoleID,
        ModifyBy: this.sSOLoginDataModel.RoleID
      };

      await this.paperService.PostAddAssignStaff(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          console.log(data);
          /*let getFilterQuestionData = data;*/
          this.GetAllAssignStaffData();
          this.AssignStaffDataFormGroup.patchValue({
            ID: 0,
            PaperID: this.AssignStaffDataFormGroup.value.PaperID,
            SubjectID: this.AssignStaffDataFormGroup.value.SubjectID,
            StreamID: this.AssignStaffDataFormGroup.value.StreamID,
            SemesterID: this.AssignStaffDataFormGroup.value.SemesterID,
            QuestionLimit: '',
            StaffID: 0
          });
          this.isSubmitted = false;
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  async GetAllAssignStaffData() {
    try {
      // Create the object for the POST request
      let obj = {
        ID: this.AssignStaffDataFormGroup.value.ID,
        PaperID: this.AssignStaffDataFormGroup.value.PaperID,
        SemesterID: this.AssignStaffDataFormGroup.value.SemesterID,
        StreamID: this.AssignStaffDataFormGroup.value.StreamID,
        SubjectID: this.AssignStaffDataFormGroup.value.SubjectID,
        StaffID: this.AssignStaffDataFormGroup.value.StaffID
      };

      await this.paperService.GetAllPaperAssignStaff(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data']));
          this.filterAssignStaffData = data;  // Populate filtered data with the fetched data
          this.dataAssignStaffSource.data = this.filterAssignStaffData;
          this.dataAssignStaffSource.sort = this.sortAssignStaff;  // Set sort behavior
          this.totalAssignStaffRecords = this.filterAssignStaffData.length;
          this.totalAssignStaffPages = Math.ceil(this.totalAssignStaffRecords / this.pageAssignStaffSize);
          this.updateAssignStaffTable();  // Update table based on pagination
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  updateAssignStaffTable(): void {
    const startIndex = (this.currentAssignStaffPage - 1) * this.pageAssignStaffSize;
    const endIndex = Math.min(startIndex + this.pageAssignStaffSize, this.totalAssignStaffRecords);
    this.dataAssignStaffSource.data = this.filterAssignStaffData.slice(startIndex, endIndex);
    this.updatePaginationAssignStaffIndexes();
  }

  onPaginationAssignStaffChange(event: PageEvent): void {
    this.pageAssignStaffSize = event.pageSize;
    this.currentAssignStaffPage = event.pageIndex + 1;
    if (this.currentAssignStaffPage < 1) this.currentAssignStaffPage = 1;
    else if (this.currentAssignStaffPage > this.totalAssignStaffPages) this.currentAssignStaffPage = this.totalAssignStaffPages;
    this.updateAssignStaffTable();  // Update table when pagination changes
  }

  updatePaginationAssignStaffIndexes(): void {
    this.startInTableIndex = (this.currentAssignStaffPage - 1) * this.pageAssignStaffSize + 1;
    this.endInTableIndex = Math.min(this.currentAssignStaffPage * this.pageAssignStaffSize, this.totalAssignStaffRecords);
  }

  async EditAssignStaffData(rowData: any) {
    try {
      let obj = {
        OperationType: 'GET',
        ID: rowData.ID
      };

      await this.paperService.GetByIdPaperAssignStaff(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data['Data'][0]));
          try {
            this.AssignStaffDataFormGroup.patchValue({
              ID:data.ID,
              StaffID: data.StaffID,
              QuestionLimit: data.QuestionLimit
            });
          } catch (error) {
            console.error("Error parsing answer options:", error);
          }
        }, error => console.error(error));

    } catch (Ex) {
      console.log(Ex);
    }
  }

  onAssignStaffDelete(rowData: any) {
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
            OperationType: 'DELETE',
            ID: rowData.ID
          };

          this.paperService.PostAddAssignStaff(obj)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data['Data']));
              if (data == 1) {
                this.toastr.success('Update AssignStaff Successfully');
                this.GetAllAssignStaffData();
              }
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


  /*Assign Staff End*/

  /*Filter Data Download Start*/
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

  /*Filter Data Download End*/
}

