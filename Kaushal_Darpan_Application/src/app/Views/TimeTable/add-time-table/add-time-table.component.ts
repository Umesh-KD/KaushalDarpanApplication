import { booleanAttribute, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BranchSubjectDataModel, TimeTableDataModels, TimeTableSearchModel, TimeTableValidateModel } from '../../../Models/TimeTableModels';
import { TimeTableService } from '../../../Services/TimeTable/time-table.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { map, of } from 'rxjs';
import * as XLSX from 'xlsx';
import { SweetAlert2 } from '../../../Common/SweetAlert2';


@Component({
    selector: 'app-add-time-table',
    templateUrl: './add-time-table.component.html',
    styleUrls: ['./add-time-table.component.css'],
    standalone: false
})
export class AddTimeTableComponent   {
  TimeTableForm!: FormGroup;
  public isUpdate: boolean = false;
  public TimeTableID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public State: number = -1;
  public ExamShiftList: any = [];
  public PaperList: any = [];
  public SubjectList: any = [];
  public SubjectCodeMasterDDLList: any[] = [];
  public SemesterList: any = [];
  public ImportExcelList: any[] = [];
  public BranchMasterList: any = []
  public SubjectMasterDDLList: any[] = [];
  public UserID: number = 0;
  public subjectCodeDDLRequest = new CommonDDLSubjectCodeMasterModel();

  public searchText: string = '';
  public SubjectCode: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new TimeTableDataModels()
  BranchSubjectFormGroup!: FormGroup
  branchSubjectReq = new BranchSubjectDataModel();
  public TimeTableData: any[] = []
  public branchSubjectData: any[] = []
  public searchRequest = new TimeTableSearchModel();
  isBranchSubSubmitted: boolean = false
  public subjectSearchReq = new CommonDDLSubjectMasterModel()
  TimeTableValidateReq = new TimeTableValidateModel();
  public AddedChoices: any = []
  public SelectedBranchMasterList:any=[]
  public filteredSemesterList:any=[]
  public SelectedSubjectList:any=[]
  public settingsMultiselect: object = {};
  public settingsMultiselector: object = {};
  isEditMode: boolean = false;
  public selectedFile: File | null = null;  // Store the selected file
  public importFile: any;
  public transactionData$: any;
  public minDate: string = '';
  public IsNull: boolean = false;
  @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails: any;
  // selectedFile: File | null = null;
  excelData: any[] = [];

  dropdownSettings = {
    singleSelection: false,
    idField: 'ShiftID',
    textField: 'ExamShift',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  constructor(
    private fb: FormBuilder,
    private TimeTableService: TimeTableService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private streamService: StreamMasterService,
    private Swal2: SweetAlert2
  ) {}

  async ngOnInit() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'StreamID',
      textField: 'Name',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      enableCheckAll: false

      
    };

    this.settingsMultiselector = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.TimeTableForm = this.fb.group({
      SemesterID: ['', [DropdownValidators]],
      ExamDate: ['', Validators.required],
      ShiftID: ['', [DropdownValidators]],
      SubjectCode: ['',],
      IsYearly:['']
    });
    this.BranchSubjectFormGroup = this.fb.group({
      SubjectCode: ['', ],
      selectedItems: [[], ],
    })
   
    await this.GetStreamMasterList();
    await this.GetPaperList();
    await this.GetSemesterList()
    await this.GetExamShift();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.TimeTableID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    
    if (this.TimeTableID) {
      await this.GetByID(this.TimeTableID)
      this.isEditMode = true;
      this.request.TimeTableID=this.TimeTableID
    }

    if (this.isEditMode) {
      this.TimeTableForm.get('SemesterID')?.disable();
    }
    this.ExaminationSchemeChange()
  }

  get _TimeTableForm() { return this.TimeTableForm.controls; }
  get _BranchSubjectFormGroup() { return this.BranchSubjectFormGroup.controls; }



  ExaminationSchemeChange() {
/*    this.request.SemesterID = 0*/
    if (this.request.IsYearly == 0) {
      this.filteredSemesterList = this.SemesterList.filter((item: any) => item.SemesterID <= 6);
    } else if (this.request.IsYearly == 1) {
      this.filteredSemesterList = this.SemesterList.filter((item: any) => item.SemesterID >= 7);
    } else {
      this.filteredSemesterList = this.SemesterList
      
    }


  }

  // exportToExcelData

  exportToExcel(): void {
    
    const unwantedColumns = ['AID', 'TimeTableID', 'StartTime', 'EndTime', 'EndTermID', 'FinancialYearID', 'InvigilatorID', 'StreamId',
                             'SubjectID', 'RTS', 'DepartmentID','BranchSubjectDataModel',
                            'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress'];
    const filteredData = this.ImportExcelList.map(item => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Create a new Excel workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Export the Excel file
    XLSX.writeFile(wb, 'ExportTimeTableData.xlsx');
  }


  onFileChange(event: any): void {
    debugger

    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.ImportExcelFile(file);
    }
   // this.selectedFile = null;
  }

  onFileChange1(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const sheetName: string = workbook.SheetNames[0];
        const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        console.log('Sheet Data:', jsonData); // Debug
        this.excelData = jsonData;
      };
      reader.readAsBinaryString(file);
    }
  }

  async GetImportExcelDataPopup(content: any) {
    
    /*    this.IsShowViewStudent = true;*/
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    return `with: ${reason}`;
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }

  ImportExcelFile(file: File): void {
    debugger;
    let mesg = '';

    this.TimeTableService.SampleImportExcelFile(file)
      .then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          
          this.ImportExcelList = data['Data'];
          console.log(this.ImportExcelList, "data in excel")

          if (this.ImportExcelList.length > 0) {
            this.GetImportExcelDataPopup(this.MyModel_ViewDetails);
            
          }

          this.GetSubjectCodeMasterDDL();
          //const paperCode = this.request.BranchSubjectDataModel[0].PaperCode.replace(/[^\d]/g, '').toString();
          //this.request.SubjectCode = paperCode
          this.ddlSemester_Change();


          this.transactionData$ = [];
          this.transactionData$ = of(this.request);
          this.transactionData$.pipe(
            map((data: any[]) => {
              // Assuming each item in the array is an object and you want to get key-value pairs
              return data.map((item: any) => {
                const keys = Object.keys(item);      //Extract keys
                const values = Object.values(item);  //Extract values

                keys.forEach((key) => {
                  if (item[key] === null || item[key] === undefined) {
                    this.ErrorMessage.push(`${key} value is null`);
                  }
                  console.log(this.ErrorMessage, "error")
                });

                //Check for null or undefined values in values
                values.forEach((value, index) => {

                  if (value === "null" || value === "") {
                    

                    mesg += `${keys[index]} value is null</br>`;

                    this.IsNull = true;
                  }

                });

                values.forEach((value, index) => {
                  if (Number(value) < 0) {
                    

                    mesg += `${keys[index]} value is invalid (negative) </br>`;

                    this.IsNull = true;
                  }

                });
                if (mesg != '') {
                  this.Swal2.Info(mesg);
                  //this.CloseModalPopup();
                  this.selectedFile = null;
                  // this.seatMetrix = []
                } else {
                  //this.seatMetrix = this.request.BranchSubjectDataModel;
                }


                return { keys, values };  // Return an object with separate keys and values arrays
              });
            })
          ).subscribe((result: any) => {
            this.request.BranchSubjectDataModel = result;
            console.log('Processed Data:', result);
            // `result` will be an array of objects with `keys` and `values` arrays
          });
          if (this.IsNull == true) {
            //this.DataExcel = [];
          }
        }
      });
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    //this.ImportExcelList = [];
  }

  async SaveImportExcelData() {
    
    this.isSubmitted = true;
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.ImportExcelList.forEach((e: any) =>
    {
         e.FinancialYearID = this.sSOLoginDataModel.FinancialYearID,
         e.EndTermID = this.sSOLoginDataModel.EndTermID,
         e.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    })
    try {
      await this.TimeTableService.SaveImportExcelData(this.ImportExcelList)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            //this.ResetControl();
            this.CloseModalPopup();
            this.router.navigate(['/timetable']);

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ExamShiftList = data['Data'];
          console.log("this.ExamShiftList", this.ExamShiftList)
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


  async SampleexportExcelData() {
    
    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.Action = 'GetdataSemester'
      this.loaderService.requestStarted();
      await this.TimeTableService.GetSampleTimeTable(this.searchRequest)
        .then((data: any) =>
        {
          
          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);
          if (data.State === EnumStatus.Success)
          {
            let dataExcel = data.Data;

            const unwantedColumns = [
              "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
            ];

            // Filter out unwanted columns
            const filteredData = dataExcel.map((item: { [x: string]: any; }) => {
              const filteredItem: any = {};
              Object.keys(item).forEach(key => {
                if (!unwantedColumns.includes(key)) {
                  filteredItem[key] = item[key];
                }
              });
              return filteredItem;
            });

            // Create Excel worksheet and workbook
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Auto-fit column widths
            const autoFitColumns = (ws: XLSX.WorkSheet, data: any[]) => {
              const colWidths = data.reduce((widths, row) => {
                Object.keys(row).forEach((key, colIndex) => {
                  const value = row[key] ? row[key].toString() : "";
                  const currentWidth = widths[colIndex] || key.length; // Use header length initially
                  widths[colIndex] = Math.max(currentWidth, value.length);
                });
                return widths;
              }, [] as number[]);

              ws['!cols'] = colWidths.map((width:any) => ({
                wch: width + 2 // Add some padding for better appearance
              }));
            };

            autoFitColumns(ws, filteredData);

            // Export the Excel file
            XLSX.writeFile(wb, this.generateFileName('xlsx'));


            //this.searchRequest = new BTERMeritSearchModel()
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error))
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

  async SampleexportExcelDataYearly() {
    
    try {
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.Action = 'GetdataYearly'
      this.loaderService.requestStarted();
      await this.TimeTableService.GetSampleTimeTable(this.searchRequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);
          if (data.State === EnumStatus.Success) {
            let dataExcel = data.Data;

            const unwantedColumns = [
              "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
            ];

            // Filter out unwanted columns
            const filteredData = dataExcel.map((item: { [x: string]: any; }) => {
              const filteredItem: any = {};
              Object.keys(item).forEach(key => {
                if (!unwantedColumns.includes(key)) {
                  filteredItem[key] = item[key];
                }
              });
              return filteredItem;
            });

            // Create Excel worksheet and workbook
            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

            // Auto-fit column widths
            const autoFitColumns = (ws: XLSX.WorkSheet, data: any[]) => {
              const colWidths = data.reduce((widths, row) => {
                Object.keys(row).forEach((key, colIndex) => {
                  const value = row[key] ? row[key].toString() : "";
                  const currentWidth = widths[colIndex] || key.length; // Use header length initially
                  widths[colIndex] = Math.max(currentWidth, value.length);
                });
                return widths;
              }, [] as number[]);

              ws['!cols'] = colWidths.map((width: any) => ({
                wch: width + 2 // Add some padding for better appearance
              }));
            };

            autoFitColumns(ws, filteredData);

            // Export the Excel file
            XLSX.writeFile(wb, this.generateFileNameYearly('xlsx'));


            //this.searchRequest = new BTERMeritSearchModel()
          } else {
            this.toastr.error(data.ErrorMessage);
          }
        }, (error: any) => console.error(error))
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

  async GetSubjectCodeMasterDDL() {

    try {
      
      this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.subjectCodeDDLRequest.SemesterID = this.request.SemesterID;

      console.log(this.subjectCodeDDLRequest, "this.subjectCodeDDLRequest")
      await this.commonMasterService.GetTimeTableSubjectCodeMasterDDL(this.subjectCodeDDLRequest)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.SubjectCodeMasterDDLList = data['Data'];
          console.log("SubjectCodeMasterDDLList",this.SubjectCodeMasterDDLList )
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async ddlSemester_Change() {
    try {
      
      this.loaderService.requestStarted();
      await this.commonMasterService.Subjects_Semester_SubjectCodeWise(this.request.SemesterID, this.sSOLoginDataModel.DepartmentID, this.request.SubjectCode, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data; 
          console.log("SubjectMasterDDLList",this.SubjectMasterDDLList)

          console.log("this.request.BranchSubjectDataModel", this.request.BranchSubjectDataModel)
          if (this.request.BranchSubjectDataModel.length > 0) {
            
            this.SubjectMasterDDLList = this.SubjectMasterDDLList.filter(subject =>
              !this.request.BranchSubjectDataModel.some(branch => branch.SubjectID === subject.ID)
            );
            console.log("Updated SubjectMasterDDLList",this.SubjectMasterDDLList);
          }
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


  validateTimes(): boolean
  {
    if (this.request.StartTime && this.request.EndTime)
    {
      const start = this.convertToMinutes(this.request.StartTime);
      const end = this.convertToMinutes(this.request.EndTime);
      if (start >= end)
      {
        this.toastr.error('End time must be after start time');
        return false;
      }
      else
      {
        return true;
      }
    }
    return false;
  }

  private convertToMinutes(time: string): number
{
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
  }

  async GetStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.streamService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("data of BranchMasterList",data)
          this.BranchMasterList = data['Data'];

          console.log("BranchMasterList",this.BranchMasterList)
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

  async GetPaperList() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetPaperList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PaperList = data['Data'];
          console.log("PaperList",this.PaperList)

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


  async GetSemesterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterList = data['Data'];

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

  async GetSubjectList()
  {
    try {
      this.subjectSearchReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.subjectSearchReq.EndTermID = this.sSOLoginDataModel.EndTermID
      this.subjectSearchReq.SemesterID = this.request.SemesterID
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMasterDDL_New(this.subjectSearchReq)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectList = data['Data'];

          console.log("SubjectList", this.SubjectList)

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

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.TimeTableService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          console.log(data, "data in getbyid")
     
          this.request = data.Data
          this.request.ExamDate = data.Data.ExamDate
          const dob = new Date(data['Data']['ExamDate']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0');
          const day = String(dob.getDate()).padStart(2, '0');
          this.request.ExamDate = `${year}-${month}-${day}`;
          if (this.request.SubjectCode == null || this.request.SubjectCode == undefined) {
            this.request.SubjectCode=''
          }

        
  /*        this.ExaminationSchemeChange()*/
          this.GetSubjectCodeMasterDDL();

          this.ddlSemester_Change();
          this.ExaminationSchemeChange()



          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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

  async saveData() {
    this.isSubmitted = true;
    if (this.TimeTableForm.invalid) {
      Object.keys(this.TimeTableForm.controls).forEach(key => {
        const control = this.TimeTableForm.get(key);

        if (control && control.invalid) {
          this.toastr.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });
      return;
    }
    if (this.request.BranchSubjectDataModel == null || this.request.BranchSubjectDataModel?.length == 0) {
      this.toastr.error('Please Add Atleaste one subject')
      return;
    }

    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      if (this.TimeTableID) {
        this.request.TimeTableID = this.TimeTableID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      console.log("request at saveData",this.request)
      await this.TimeTableService.SaveData(this.request)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl();
            this.router.navigate(['/timetable']);

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    } 
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }

    // if (this.validateTimes()) {

    //   this.loaderService.requestStarted();
    //   this.isLoading = true;
    //   try {
    //     if (this.TimeTableID) {
    //       this.request.TimeTableID = this.TimeTableID
    //       this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    //     } else {
    //       this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    //       this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    //     }
    //     this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    //     this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    //     this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;

    //     await this.TimeTableService.SaveData(this.request)
    //       .then((data: any) => {
    //         if (data.State == EnumStatus.Success) {
    //           this.toastr.success(data.Message)
    //           this.ResetControl();
    //           this.router.navigate(['/timetable']);

    //         } else {
    //           this.toastr.error(data.ErrorMessage)
    //         }
    //       })
    //   }

    //   catch (ex) { console.log(ex) }
    //   finally {
    //     setTimeout(() => {
    //       this.loaderService.requestEnded();
    //       this.isLoading = false;

    //     }, 200);
    //   }
    // }
  }

  async ResetControl() {
    this.isSubmitted = false;
    
    if(this.isEditMode) {
      this.request.TimeTableID = 0
      this.request.SubjectID = 0
      this.request.ExamDate = ''
      this.request.StartTime = ''
      this.request.SubjectCode = ''
      this.request.EndTime = ''
      this.request.ShiftID = 0
      this.request.EndTermID = 0
      this.request.FinancialYearID = 0
      this.request.ActiveStatus = true
      this.request.DeleteStatus = false
      this.request.UserID = 0
      this.request.ModifyBy = 0
      this.request.CreatedBy = 0
      this.request.DepartmentID = 0
      this.request.InvigilatorID = 0
      this.request.BranchSubjectDataModel = []
    } else {
      this.request = new TimeTableDataModels()
    }
    this.isBranchSubSubmitted = false;
    this.branchSubjectReq = new BranchSubjectDataModel()
  }

  onCancel(): void {
    this.router.navigate(['/timetable']);
  }

  // async AddBranchSubject() {
  //   if (this.request.SemesterID == 0) {
  //     this.toastr.error('Please Select Semester First For Adding Subject');
  //     return false;
  //   }

  //   this.isBranchSubSubmitted = true;
   
  //   if (this.BranchSubjectFormGroup.invalid){
  //     return console.log("error");
  //   }
    
  //   try {
  //     this.loaderService.requestStarted();
  //     this.TimeTableValidateReq.TimeTableID = this.request.TimeTableID
  //     this.TimeTableValidateReq.SemesterID = this.request.SemesterID;
  //     this.TimeTableValidateReq.SubjectCode = this.request.SubjectCode;
  //     // this.TimeTableValidateReq.StreamList = this.SelectedBranchMasterList;
  //     this.TimeTableValidateReq.SubjectList = this.SelectedSubjectList;
  //     console.log("TimeTableValidateReq",this.TimeTableValidateReq)
  //     try {
  //       this.loaderService.requestStarted();
  //       await this.TimeTableService.GetTimeTableBranchSubject(this.TimeTableValidateReq)
  //         .then((data: any) => {

  //           data = JSON.parse(JSON.stringify(data));
  //           //this.request.BranchSubjectDataModel = data['Data'];

  //           this.request.BranchSubjectDataModel=  this.mergeObjectListsWithoutDuplicates(this.request.BranchSubjectDataModel, data['Data'])

  //         }, (error:any) => console.error(error));
  //     }
  //     catch (Ex) {
  //       console.log(Ex);
  //     }
  //     finally {
  //       setTimeout(() => {
  //         this.loaderService.requestEnded();
  //       }, 200);
  //     }


  //     //this.request.BranchSubjectDataModel.push(
  //     //  {
  //     //    BranchID: this.branchSubjectReq.BranchID,
  //     //    BranchName: this.branchSubjectReq.BranchName,
  //     //    SubjectID: this.branchSubjectReq.SubjectID,
  //     //    SubjectName: this.branchSubjectReq.SubjectName,
  //     //    PaperCode: this.branchSubjectReq.PaperCode,
  //     //    InvigilatorID: this.branchSubjectReq.InvigilatorID,
  //     //    SemesterID: this.branchSubjectReq.SemesterID
  //     //  },

  //     //);
  //     console.log("branchSubjectReq",this.branchSubjectReq)
  //     console.log("BranchSubjectDataModel",this.request.BranchSubjectDataModel)

  //   }
  //   catch (ex) { console.log(ex) }
  //   finally {
  //     setTimeout(async () => {
  //       await this.ResetRow();
  //       this.loaderService.requestEnded();
  //       this.isLoading = false;
  //     }, 200);
  //   }

  // }

  // mergeObjectListsWithoutDuplicates(list1: any[], list2: any[]): any[] {
  //   const mergedList = [...list1, ...list2];
  //   return mergedList.filter((item, index, self) =>
  //     index === self.findIndex(t => t.BranchID === item.BranchID && t.SubjectID===item.SubjectID)
  //   );
  // }

  async AddBranchSubject() {
    if (this.request.SemesterID == 0) {
      this.toastr.error('Please Select Semester First For Adding Subject');
      return false;
    }

    this.isBranchSubSubmitted = true;
    
    if (this.BranchSubjectFormGroup.invalid){
      return console.log("error");
    }

    this.SelectedSubjectList.filter((item: any) => {
      this.request.BranchSubjectDataModel.map((x: any) => {
        if (x.SubjectID == item.ID) {
          this.request.BranchSubjectDataModel.splice(this.request.BranchSubjectDataModel.indexOf(x), 1);
        }
      })
    })

    this.SelectedSubjectList.map((item: any) => {

      const paperCodeMatch = item.Name.match(/\((.*?)\)/);
      const paperCode = paperCodeMatch ? paperCodeMatch[1] : '';

      const branchCodeMatch = paperCode.match(/[A-Za-z]+/); 
      const branchCode = branchCodeMatch ? branchCodeMatch[0] : '';
      this.GetStreamMasterList()
      
      const branchNameList = this.BranchMasterList.filter((branch: any) => branch.Code === branchCode)
      console.log(this.BranchMasterList)

      branchNameList.map((x: any) => {
        this.branchSubjectReq.BranchName = x.Name
        this.branchSubjectReq.BranchID = x.StreamID
      })
      

      this.request.BranchSubjectDataModel.push({
        SubjectID: item.ID,
        SubjectName: item.Name,
        PaperCode: paperCode,
        BranchName: this.branchSubjectReq.BranchName,
        BranchID: this.branchSubjectReq.BranchID
      })
    })

    console.log("request at AddBranchSubject",this.request)
    this.request.SubjectCode = ''
    this.SelectedSubjectList = []
  }

  async ResetRow() {
    this.isBranchSubSubmitted = false
    this.branchSubjectReq.SubjectID = 0;
    this.branchSubjectReq.SubjectName = '';
    this.request.SubjectCode = ''
  }

  async DeleteRow(item: BranchSubjectDataModel) {
    const index: number = this.request.BranchSubjectDataModel.indexOf(item);
    console.log("index", index)
    if (index != -1) {
      this.request.BranchSubjectDataModel.splice(index, 1)
      this.ddlSemester_Change();
    }
  }

  onItemSelect(item: any, centerID: number) {
  
    if (!this.SelectedBranchMasterList.includes(item))
    {
      this.SelectedBranchMasterList.push(item);
    }

  }

  onDeSelect(item: any, centerID: number) {

    this.SelectedBranchMasterList = this.SelectedBranchMasterList.filter((i: any) => i.StreamID !== item.StreamID);
 
  }

  onSelectAll(items: any[], centerID: number)
  {
   
   // this.SelectedInstituteList = [...items];

  }

  onDeSelectAll(centerID: number) {

    //this.SelectedInstituteList = [];

  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }

  // multiselect events
  public onFilterChanges(item: any) {
    console.log(item);
  }
  public onDropDownCloses(item: any) {
    console.log(item);
  }

  public onItemSelects(item: any) {
    console.log(item);
  }
  public onDeSelects(item: any) {
    console.log(item);
  }

  public onSelectAlls(items: any) {
    console.log(items);
  }
  public onDeSelectAlls(items: any) {
    console.log(items);
  }


  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `BTERSampleSemesterTimeTableList_${timestamp}.${extension}`;
  }
  generateFileNameYearly(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `BTERSampleYearlyTimeTableList_${timestamp}.${extension}`;
  }

}


