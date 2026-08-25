import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus ,EnumDepartment} from '../../../Common/GlobalConstants';
import { CommonDDLCommonSubjectModel } from '../../../Models/CommonDDLCommonSubjectModel';
import { CommonDDLExaminerGroupCodeModel } from '../../../Models/CommonDDLExaminerGroupCodeModel';
import { ExaminerDataModel, TeacherForExaminerSearchModel } from '../../../Models/ExaminerDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ExaminerService } from '../../../Services/Examiner/examiner.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';
import { ItiExaminerService } from '../../../Services/ItiExaminer/iti-examiner.service';
import { ItiAssignStudentExaminer, ItiExaminerDataModel, ITIExaminerUploadFilesModel, ITITeacherForExaminerSearchModel } from '../../../Models/ItiExaminerDataModel';
import { CommonDDLSubjectCodeMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { AppsettingService } from '../../../Common/appsetting.service';
@Component({
  selector: 'app-iti-appoint-examiner-report',
  templateUrl: './iti-appoint-examiner-report.component.html',
  styleUrl: './iti-appoint-examiner-report.component.css',
  standalone: false
})
export class AppointexaminerreportComponent {
  public HRManagerID: number = 0;
  public SemesterMasterDDLList: any[] = [];
  public filterSemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StaffForExaminerList: ItiAssignStudentExaminer[] = [];
  public Table_SearchText: any = '';
  public _enumDepartment = EnumDepartment
  public AppointExaminer = new ItiExaminerDataModel();
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITITeacherForExaminerSearchModel();
  public ExaminerUploadFileRequest = new ITIExaminerUploadFilesModel()
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  private modalRef!: NgbModalRef;
  public uploaddataFormGroup!: FormGroup;
  constructor(
    private examinerservice: ItiExaminerService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private staffMasterService: StaffMasterService,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);

    this.getStaffForExaminerData();
    this.uploaddataFormGroup = this.formBuilder.group({
      Remarks: ['', Validators.required]
    });

  }

  async getStaffForExaminerData() {
    
    try {

      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.sSOID = this.sSOLoginDataModel.SSOID;
     
      await this.examinerservice.GetTeacherForExaminerReport(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        this.StaffForExaminerList = data.Data;
        console.log("this.StaffForExaminerList", this.StaffForExaminerList)
      })
    } catch (error) {
      console.error(error)
    }
  }
    

  async exportExcelData() {
    debugger;
    try {
      // Prepare request
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.sSOID = this.sSOLoginDataModel.SSOID;

      this.loaderService.requestStarted();

      const data: any = await this.examinerservice.GetTeacherForExaminerReport(this.searchRequest);

      if (data.State !== EnumStatus.Success) {
        this.toastr.error(data.ErrorMessage);
        return;
      }

      const DataExcel = data.Data || [];

      if (!DataExcel || DataExcel.length === 0) {
        this.toastr.error("No data available for export.");
        return;
      }

      const unwantedColumns = [
        "DepartmentID", "Eng_NonEng", "EndTermID",
        "TermPart", "ModifyBy", "IPAddress", "RoleID",
        "StartValue", "GroupCodeID", "SemesterId", "CommonSubjectID"
      ];

      const filteredData = DataExcel.map((item: any) => {
        const obj: any = {};
        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            obj[key] = item[key];
          }
        });
        return obj;
      });

      const headerMap = [
        { header: 'S No', key: 'SNo' },
        { header: 'Examiner', key: 'ExaminerName' },
        { header: 'Year', key: 'SemesterName' },
        { header: 'Trade', key: 'SubjectName' },
        { header: 'Subject', key: 'StreamName' },
        { header: 'Status', key: 'PresentStatus' },
        { header: 'Rollno', key: 'RollNo' },
        { header: 'Min Marks', key: 'MinMarks' },
        { header: 'Max Marks', key: 'MaxMarks' },
        { header: 'Obtained Marks', key: 'ObtainedMarks' }
      ];

      const excelData = filteredData.map((item: any, index: number) => {
        const row: any = {};
        headerMap.forEach(h => {
          row[h.header] = h.key === 'SNo' ? index + 1 : (item[h.key] ?? '');
        });
        return row;
      });

      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);

      const MIN_WIDTH = 10;
      const PADDING = 2;

      ws['!cols'] = headerMap.map(h => {
        let maxLength = h.header.length;
        excelData.forEach((row: any) => {
          const text = row[h.header] == null ? '' : String(row[h.header]);
          maxLength = Math.max(maxLength, text.length);
        });
        return { wch: Math.max(MIN_WIDTH, maxLength + PADDING) };
      });

      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'GroupCodeAllocation');

      const now = new Date();
      const fileName = `Appoint_examiner_Report_${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}.xlsx`;

      XLSX.writeFile(wb, fileName);

    } catch (ex) {
      console.error(ex);
      this.toastr.error("Unexpected error during export.");
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async downloadCenterWiseReport()
  {
    debugger

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.sSOID = this.sSOLoginDataModel.SSOID;

    await this.examinerservice.TeacherForExaminerReportDewnloadPdf(this.searchRequest)
      .subscribe({
        next: (blob: Blob) => {

          const now = new Date();
          const dateTime =
            now.getFullYear().toString() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);

          const fileName = `Teacher_For_Examiner_Report_${dateTime}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          this.toastr.warning('Failed to download report');
        }
      });
  }



  async downloadCenterWiseReportnew() {
    debugger

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.sSOID = this.sSOLoginDataModel.SSOID;

    await this.examinerservice.TeacherForExaminerReportDewnloadPdfNew(this.searchRequest)
      .subscribe({
        next: (blob: Blob) => {

          const now = new Date();
          const dateTime =
            now.getFullYear().toString() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);

          const fileName = `Teacher_For_Examiner_Report_${dateTime}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          this.toastr.warning('Failed to download report');
        }
      });
  }


  SaveExaminerUploadFileRequest(content: any) {
    debugger
    this.uploaddataFormGroup.reset();
    this.ITIExaminerUploadFilesByAction()

    debugger
    this.modalRef = this.modalService.open(content, { size: 'lg', backdrop: 'static', centered: true });
  }

  CloseModalPopup() {
    this.isSubmitted = false;
    this.ExaminerUploadFileRequest = new ITIExaminerUploadFilesModel();
    this.uploaddataFormGroup.reset();

    this.modalService.dismissAll();
  }


  async ITIExaminerUploadFilesByAction() {
    debugger

    this.isSubmitted = true;
    this.ExaminerUploadFileRequest.SSOID = this.sSOLoginDataModel.SSOID;    
    this.ExaminerUploadFileRequest.EndTermID = this.sSOLoginDataModel.EndTermID;    
    this.ExaminerUploadFileRequest.Action = "GetbyID";    
    debugger
    try {
     
      this.loaderService.requestStarted();
      debugger

      this.examinerservice.ITIExaminerUploadFilesByAction(this.ExaminerUploadFileRequest)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success)
            {

              const record = data?.Data?.[0];

              if (record) {
                this.ExaminerUploadFileRequest = record;

                this.uploaddataFormGroup.patchValue({
                  Remarks: record.Remarks || ''
                });
              }

              //this.ExaminerUploadFileRequest = data['Data'][0];
              //this.uploaddataFormGroup.patchValue({
              //  Remarks: this.ExaminerUploadFileRequest.Remarks ?? ''
              //});
              //this.toastr.success(data.Message);
            }
            else
            {
              this.toastr.error(this.ErrorMessage);
            }
          });

    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }
  async SaveExaminerUploadFileRequestData() {
    debugger
    this.isSubmitted = true;
    
    if (this.uploaddataFormGroup.invalid) {
      this.toastr.error('Please fill all required fields.');
      return;
    }

    if (!this.ExaminerUploadFileRequest.FileName || this.ExaminerUploadFileRequest.FileName === '') {
      this.toastr.error('Please upload the required document.');
      return;
    }

    this.ExaminerUploadFileRequest.UploadedID = this.ExaminerUploadFileRequest.UploadedID;
    this.ExaminerUploadFileRequest.UserID = this.sSOLoginDataModel.UserID;
    this.ExaminerUploadFileRequest.SSOID = this.sSOLoginDataModel.SSOID;
    this.ExaminerUploadFileRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.ExaminerUploadFileRequest.ExaminerID = this.ExaminerUploadFileRequest.ExaminerID;
    this.ExaminerUploadFileRequest.Action = "Insert";
    this.ExaminerUploadFileRequest.Remarks = this.uploaddataFormGroup.get('Remarks')?.value;
    debugger
    try {
      this.isSubmitted = true;
      if (this.uploaddataFormGroup.invalid) {
        console.log('Form is invalid');
        return;
      }
      this.loaderService.requestStarted();
      debugger
      this.examinerservice.ITIExaminerUploadFiles(this.ExaminerUploadFileRequest)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              this.toastr.success(data.Message);
              this.CloseModalPopup();
              this.getStaffForExaminerData();
             
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          });
     

    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {

        if (this.file.size > 2000000) {
          this.toastr.error('Select less then 2MB File');
          return;
        }
        this.loaderService.requestStarted();

        let uploadModel = new UploadFileModel();

        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITI/ExaminerUploadFile";


        await this.commonMasterService
          .UploadDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == 'UploadFile') {

                this.ExaminerUploadFileRequest.FileName =
                  data['Data'][0]['FileName'];
              }
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage);
            } else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

}
