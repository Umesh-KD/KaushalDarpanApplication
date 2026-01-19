import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
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
import { ItiAssignStudentExaminer, ItiExaminerDataModel, ITITeacherForExaminerSearchModel } from '../../../Models/ItiExaminerDataModel';
import { CommonDDLSubjectCodeMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { MatSelectChange } from '@angular/material/select';
import * as XLSX from 'xlsx';
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
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];

  constructor(
    private examinerservice: ItiExaminerService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private staffMasterService: StaffMasterService,
    private Swal2: SweetAlert2

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);

    this.getStaffForExaminerData();

  }

  async getStaffForExaminerData() {
    debugger
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

}
