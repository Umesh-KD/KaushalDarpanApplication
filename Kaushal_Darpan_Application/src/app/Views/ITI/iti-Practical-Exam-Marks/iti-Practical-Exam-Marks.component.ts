import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { ITIExaminerDataModel, ITIExamMarksDataModel, ITIStudentExamMarksDataModel } from '../../../Models/DocumentDetailsModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-iti-Practical-Exam-Marks',
  standalone: false,
  templateUrl: './iti-Practical-Exam-Marks.component.html',
  styleUrl: './iti-Practical-Exam-Marks.component.css'
})
export class itiPracticalExamMarksComponent {



  public State: number = 0;
  public Message: any = [];
  showDownloadOptions = false;
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Status: number = 0
  public ExaminerDataList: any = [];
  public InstituteMasterDDLList: any = [];
  public CenterDDLlist: any = [];
  public TimeTableList: any = [];
  public ExamMarksGroup!: FormGroup;

  public UserID: number = 0;
  searchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = '';
  public SearchTimeTableList: any = []
  ExaminerDataRequest = new ITIExaminerDataModel();
  //public request = new ITIExamMarksDataModel()
  public ObtainMarksRequest = new ITIStudentExamMarksDataModel()

  sSOLoginDataModel = new SSOLoginDataModel();
  public tablerequest: any = [];
  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private centerAllocationService: ITICenterAllocationService,
    private apiService: ItiTradeService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    this.ExamMarksGroup = this.formBuilder.group({
      txtExamMarks: [
        null,
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'), 
          Validators.min(1),
          Validators.max(250)
        ]
      ]
           
    })




      this.route.queryParams.subscribe(params => {
        this.ExaminerDataRequest.CenterID = params['CenterID'] ? +params['CenterID'] : 0;
        this.ExaminerDataRequest.SemesterID = params['SemesterID'] ? +params['SemesterID'] : 0;
        this.ExaminerDataRequest.StreamID = params['StreamID'] ? +params['StreamID'] : 0;
      });
   

    await this.GetPracticalExamMarksList();
   
  }
  get _ExamMarksGroup() { return this.ExamMarksGroup.controls; }

  async GetPracticalExamMarksList() {

    this.ExaminerDataRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.ExaminerDataRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    ;


    try {
      this.loaderService.requestStarted();
      await this.apiService.GetStudentExamReportForITI(this.ExaminerDataRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExaminerDataList = data['Data'];
          console.log("Paper Upload Reports List ===>", this.ExaminerDataList)
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


  async ViewandEdit(content: any, row: any) {
    
    this.ObtainMarksRequest.StudentExamPaperMarksID = row.StudentExamPaperMarksID
    this.ObtainMarksRequest.ObtainedMarks = row.ObtainedMarks
    this.isSubmitted = false;
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'sm', keyboard: true, centered: true });

  }
  CloseModalPopup() {
    this.modalService.dismissAll();
  }


  async SaveExamMarksData() {
    try {
      this.isSubmitted = true;
      if (this.ExamMarksGroup.invalid) {
        return;
      }

      debugger;
      this.loaderService.requestStarted();
      this.ObtainMarksRequest.UserID = this.sSOLoginDataModel.UserID;

      await this.apiService.UpdateStudentExamMarksDataWeb(this.ObtainMarksRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
          
            this.ExamMarksGroup.reset();
            this.CloseModalPopup();
            this.GetPracticalExamMarksList();
          }
          else
          {
            this.toastr.warning(this.Message??this.ErrorMessage
            );
      
          }

        })

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

  preventInvalidKeys(event: KeyboardEvent) {
    if (['-', '+', 'e', 'E'].includes(event.key)) {
      event.preventDefault();
    }
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'
    ];
    if (allowedKeys.includes(event.key)) {
      return;
    }
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  exportToExcelExamMarksData() {
    debugger
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy',
      'ModifyDate', 'IPAddress', 'CenterID', 'DownloadDate', 'Password', 'FileName',
      'EndTermID', 'InstituteID', 'CourseType', 'StudentExamID', 'SemesterID',
      'StudentTypeID', 'SubjectId', 'isAllow', 'StudentExamID1', 'IsChecked',
      'Latitude', 'Longitude', 'JobCardImage'
    ];

    const filteredData = this.ExaminerDataList.map(
      (item: { [key: string]: any }, index: number) => {
        const filteredItem: any = {
          SNo: index + 1
        };

        Object.keys(item).forEach(key => {
          if (!unwantedColumns.includes(key)) {
            if (key === 'IsDownload') {
              filteredItem[key] = item[key] ? 'Yes' : 'No';
            } else {
              filteredItem[key] = item[key];
            }
          }
        });

        return filteredItem;
      }
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const colWidths = Object.keys(filteredData[0]).map(key => {
      let maxLength = key.length;

      filteredData.forEach((row: { [x: string]: any; }) => {
        const cellValue = row[key];
        if (cellValue !== null && cellValue !== undefined) {
          maxLength = Math.max(maxLength, cellValue.toString().length);
        }
      });

      return { wch: maxLength + 2 };
    });

    ws['!cols'] = colWidths;

    const range = XLSX.utils.decode_range(ws['!ref']!);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (ws[cellAddress]) {
        ws[cellAddress].s = { font: { bold: true } };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB').split('/').join('-');
    XLSX.writeFile(wb, `Exam_Marks_Data_${dateStr}.xlsx`);
  }



  
}
