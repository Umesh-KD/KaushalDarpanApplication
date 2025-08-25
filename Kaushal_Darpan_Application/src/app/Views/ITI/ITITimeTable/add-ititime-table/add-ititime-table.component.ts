import { booleanAttribute, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, RequiredValidator, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { StreamMasterService } from '../../../../Services/BranchesMaster/branches-master.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../../../Models/CommonDDLSubjectMasterModel';
import { TradeSubjectDataModel, ITITimeTableDataModels, TimeTableValidateModel, ITITimeTableSearchModel } from '../../../../Models/ITI/ITITimeTableModels';
import { ITITimeTableService } from '../../../../Services/ITI/ITITimeTable/ititime-table.service';
import { SubjectList } from '../../../../Models/TimeTableModels';
import { ChangeDetectorRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { TimeTableService } from '../../../../Services/TimeTable/time-table.service';
import { map, of } from 'rxjs';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-add-ititime-table',
  standalone: false,
  
  templateUrl: './add-ititime-table.component.html',
  styleUrl: './add-ititime-table.component.css'
})
export class AddITITimeTableComponent {
    ITITimeTableForm!: FormGroup;
    public isUpdate: boolean = false;
    public TimeTableID: number | null = null;
    public Message: any = [];
    public ErrorMessage: any = [];
    public isLoading: boolean = false;
    public isSubmitted: boolean = false;
    public minDate: string = '';
    public State: number = -1;
    public ExamShiftList: any = [];
    public PaperList: any = [];
    public SubjectList: any = [];
    public SubjectCodeMasterDDLList: any[] = [];
    public SemesterList: any = [];
    public TradeMasterList: any = []
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
    request = new ITITimeTableDataModels()
    TradeSubjectFormGroup!: FormGroup
    tradeSubjectReq = new TradeSubjectDataModel();
    isTradeSubSubmitted: boolean = false
    public subjectSearchReq = new CommonDDLSubjectMasterModel()
    TimeTableValidateReq = new TimeTableValidateModel();
    public AddedChoices: any = []
    public SelectedTradeMasterList: any = []
    public SelectedSubjectList: any = []
    public settingsMultiselect: object = {};
    public settingsMultiselector: object = {};
    isEditMode: boolean = false;
    public SubjectName:string = '';
    public searchRequest = new ITITimeTableSearchModel()
    public importFile: any;
    public selectedFile: File | null = null;  // Store the selected file
    public ImportExcelList: any[] = [];
    @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails: any;
    public transactionData$: any;
    public IsNull: boolean = false;

    constructor(
      private fb: FormBuilder,
      private ITITimeTableService: ITITimeTableService,
      private route: ActivatedRoute,
      private router: Router,
      private toastr: ToastrService,
      private commonMasterService: CommonFunctionService,
      private loaderService: LoaderService,
      private modalService: NgbModal,
      private streamService: StreamMasterService,
      private cdr: ChangeDetectorRef,
      private TimeTableService: TimeTableService,
      private Swal2: SweetAlert2,
    ) { }

    async ngOnInit() {
      // this.settingsMultiselect = {
      //   singleSelection: false,
      //   idField: 'StreamID',
      //   textField: 'Name',
      //   allowSearchFilter: true,
      //   limitSelection: -1,
      //   clearSearchFilter: true,
      //   maxHeight: 197,
      //   itemsShowLimit: 10,
      //   searchPlaceholderText: 'Search...',
      //   noDataAvailablePlaceholderText: 'Not Found',
      //   closeDropDownOnSelection: false,
      //   showSelectedItemsAtTop: false,
      //   defaultOpen: false,
      //   enableCheckAll: false
      // };

      // this.settingsMultiselector = {
      //   singleSelection: false,
      //   idField: 'ID',
      //   textField: 'Name',
      //   enableCheckAll: true,
      //   selectAllText: 'Select All',
      //   unSelectAllText: 'Unselect All',
      //   allowSearchFilter: true,
      //   limitSelection: -1,
      //   clearSearchFilter: true,
      //   maxHeight: 197,
      //   itemsShowLimit: 10,
      //   searchPlaceholderText: 'Search...',
      //   noDataAvailablePlaceholderText: 'Not Found',
      //   closeDropDownOnSelection: false,
      //   showSelectedItemsAtTop: false,
      //   defaultOpen: false,
      // };

      const today = new Date();
      this.minDate = today.toISOString().split('T')[0];

      this.ITITimeTableForm = this.fb.group({
        SemesterID: ['', [DropdownValidators]],
        ExamDate: ['', Validators.required],
        ShiftID: ['', [DropdownValidators]],
        SubjectName: ['', Validators.required],
        TradeName: ['', Validators.required],
      });
      // this.TradeSubjectFormGroup = this.fb.group({
      //   SubjectCode: ['',],
      //   selectedItems: [[],],
      //   TradeID: ['',],
      //   SubjectName :['',]
      // })

      await this.GetITITradeNameDDl();
      await this.GetPaperList();
      await this.GetSemesterList()
      await this.GetExamShift();
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   
      this.TimeTableID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
      if (this.TimeTableID) {
        await this.GetByID(this.TimeTableID)
        this.isEditMode = true;
        this.request.TimeTableID = this.TimeTableID
      }

      if (this.isEditMode) {
        this.ITITimeTableForm.get('SemesterID')?.disable();
      }
    }

    get _TimeTableForm() { return this.ITITimeTableForm.controls; }
    get _TradeSubjectFormGroup() { return this.TradeSubjectFormGroup.controls; }


    async GetExamShift() {
      try {
        this.loaderService.requestStarted();
        var DepartmentID = EnumDepartment.ITI
        await this.commonMasterService.GetExamShift(DepartmentID)
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
    async GetITITradeNameDDl() {
      this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.subjectCodeDDLRequest.SemesterID = this.request.SemesterID;


      try {
        this.loaderService.requestStarted();
        await this.commonMasterService.GetITITradeNameDDl(this.subjectCodeDDLRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log("data of TradeMasterList", data)
            this.TradeMasterList = data['Data'];

            console.log("TradeMasterList", this.TradeMasterList)
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
            console.log("PaperList", this.PaperList)

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
        await this.commonMasterService.SemesterMaster()
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.SemesterList = data.Data.filter((item: any) => item.SemesterID == 1 || item.SemesterID == 2 || item.SemesterID == 3 || item.SemesterID == 4);
          
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



    async GetITISubjectCodeDDl() {
      try {
        this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
        this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
        this.subjectCodeDDLRequest.SemesterID = this.request.SemesterID;
        this.subjectCodeDDLRequest.StreamID = this.request.TradeID;

        console.log(this.subjectCodeDDLRequest, "this.subjectCodeDDLRequest")
        await this.commonMasterService.GetITISubjectCodeDDl(this.subjectCodeDDLRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.SubjectCodeMasterDDLList = data['Data'];
            console.log("SubjectCodeMasterDDLList", this.SubjectCodeMasterDDLList)
          }, error => console.error(error));
      }





      catch (Ex) {
        console.log(Ex);
      }
    }



    async ddlSemester_Change() {

      this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.subjectCodeDDLRequest.SemesterID = this.request.SemesterID;
      this.subjectCodeDDLRequest.StreamID = this.request.TradeID;
      try {
        this.loaderService.requestStarted();
        await this.commonMasterService.GetITISubjectNameDDl(this.subjectCodeDDLRequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.SubjectMasterDDLList = data.Data;
            console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)

            console.log("this.request.BranchSubjectDataModel", this.request.TradeSubjectDataModel)
            //if (this.request.TradeSubjectDataModel.length > 0) {

            //  this.SubjectMasterDDLList = this.SubjectMasterDDLList.filter(subject =>
            //    !this.request.TradeSubjectDataModel.some(branch => branch.SubjectID === subject.ID)
            //  );
            //  console.log("Updated SubjectMasterDDLList", this.SubjectMasterDDLList);
            //}
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

    async GetSubjectList() {
      try {
        this.subjectSearchReq.DepartmentID = this.sSOLoginDataModel.DepartmentID
        this.subjectSearchReq.EndTermID = this.sSOLoginDataModel.EndTermID
        this.subjectSearchReq.SemesterID = this.request.SemesterID
        this.subjectCodeDDLRequest.StreamID = this.request.TradeID;
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
        await this.ITITimeTableService.GetByID(id)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data, "data in getbyid")
            this.request = data.Data
          
            this.request.SubjectName = data.Data.SubjectName.trim();
            this.request.TradeName = data.Data.TradeName.trim();

            const ExamDate = new Date(data['Data']['ExamDate']);
            const year = ExamDate.getFullYear();
            const month = String(ExamDate.getMonth() + 1).padStart(2, '0');
            const day = String(ExamDate.getDate()).padStart(2, '0');
            this.request.ExamDate = `${year}-${month}-${day}`;
      
            const btnSave = document.getElementById('btnSave');
            if (btnSave) btnSave.innerHTML = "Update";

            const btnReset = document.getElementById('btnReset');
            if (btnReset) btnReset.innerHTML = "Cancel";

            this.cdr.detectChanges();
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
      if (this.ITITimeTableForm.invalid) {
        this.toastr.error('Please enter required fields')
        return;
      }

      this.loaderService.requestStarted();

      try {
        this.request.UserID = this.sSOLoginDataModel.UserID;
        this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
        this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
        console.log("request at saveData", this.request)
        await this.ITITimeTableService.SaveData(this.request)
          .then((data: any) => {
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message)
              this.ResetControl();
              this.router.navigate(['/ItiTimeTable']);

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

    async ResetControl() {
      this.isSubmitted = false;

      if (this.isEditMode) {
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
        this.request.DepartmentID = 0
        this.request.InvigilatorID = 0
        this.request.TradeSubjectDataModel = []
      } else {
        this.request = new ITITimeTableDataModels()
      }
      this.isTradeSubSubmitted = false;
      this.tradeSubjectReq = new TradeSubjectDataModel()
    }

    onCancel(): void {
      this.router.navigate(['/timetable']);
    }
    async AddTradeSubject() {
      if (this.request.SemesterID == 0) {
        this.toastr.error('Please Select Semester First For Adding Subject');
        return false;
      }

      this.isTradeSubSubmitted = true;

      if (this.TradeSubjectFormGroup.invalid) {
        return console.log("error");
      }
      else {
        const tradeId = this.request.TradeID;
        const subjectID = this.request.SubjectID;
        console.log(this.TradeMasterList);

        const TradeName = this.TradeMasterList.filter((i: any) => i.ID == tradeId).map((i: any) => i.Name).toString();
        const SubjectName = this.SubjectMasterDDLList.filter((i:any) => i.ID == subjectID).map((i:any) => i.Name).toString();

        const duplicate = this.request.TradeSubjectDataModel.some((item: any) => item.SubjectID === subjectID && item.TradeID === tradeId);

        if (duplicate) {
          this.toastr.error('This subject is already added for the selected trade.');
          return;
        }


        this.request.TradeSubjectDataModel.push({
          SubjectID: this.request.SubjectID,
          SubjectName: SubjectName,
          TradeName: TradeName,
          TradeID: this.request.TradeID
        })

        this.request.TradeID = 0;
        this.request.SubjectID=0;
      }



      //this.SelectedSubjectList.filter((item: any) => {
      //  this.request.TradeSubjectDataModel.map((x: any) => {
      //    if (x.SubjectID == item.ID) {
      //      this.request.TradeSubjectDataModel.splice(this.request.TradeSubjectDataModel.indexOf(x), 1);
      //    }
      //  })
      //})

      //this.SelectedSubjectList.map((item: any) => {

      

      

      //  //const branchNameList = this.TradeMasterList.filter((branch: any) => branch.Code === branchCode)
      //  //branchNameList.map((x: any) => {
      //  //  this.tradeSubjectReq.TradeName = x.Name
      //  //  this.tradeSubjectReq.TradeID = x.StreamID
      //  //})


      //  this.request.TradeSubjectDataModel.push({
      //    SubjectID: item.ID,
      //    SubjectName: item.Name,
      //    TradeName: this.tradeSubjectReq.TradeName,
      //    TradeID: this.tradeSubjectReq.TradeID
      //  })
      //})

      //console.log("request at AddTradeSubject", this.request)
      //this.request.SubjectCode = ''
      //this.SelectedSubjectList = []
    }

    async ResetRow() {
      this.isTradeSubSubmitted = false
      this.request.TradeID = 0;
      this.request.SubjectID = 0;

      //this.tradeSubjectReq.SubjectID = 0;
      //this.tradeSubjectReq.SubjectName = '';
      //this.request.SubjectCode = ''

    }

    async DeleteRow(item: TradeSubjectDataModel) {
      const index: number = this.request.TradeSubjectDataModel.indexOf(item);
      console.log("index", index)
      if (index != -1) {
        this.request.TradeSubjectDataModel.splice(index, 1)
        this.ddlSemester_Change();
      }
    }

    onItemSelect(item: any, centerID: number) {

      if (!this.SelectedTradeMasterList.includes(item)) {
        this.SelectedTradeMasterList.push(item);
      }

    }

    onDeSelect(item: any, centerID: number) {

      this.SelectedTradeMasterList = this.SelectedTradeMasterList.filter((i: any) => i.StreamID !== item.StreamID);

    }

    onSelectAll(items: any[], centerID: number) {

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

    async SampleexportExcelDataYearly() {
    
      try {
        this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
        this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
        this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
        this.searchRequest.Action = 'GetdataYearly'
        this.loaderService.requestStarted();
        await this.ITITimeTableService.GetSampleTimeTableITI(this.searchRequest)
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

    generateFileNameYearly(extension: string): string {
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
      return `ITISampleYearlyTimeTableList_${timestamp}.${extension}`;
    }

    onFileChange(event: any): void {
    
      // Get the file from the input element
      const file: File = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.ImportExcelFile(file);
      }
      this.selectedFile = null;

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
      let mesg = '';
      this.ITITimeTableService.SampleImportExcelFile(file)
        .then((data: any) => {
        
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
          
            this.ImportExcelList = data['Data'];
            console.log(this.ImportExcelList, "data in excel")

            if (this.ImportExcelList.length > 0) {
              this.GetImportExcelDataPopup(this.MyModel_ViewDetails);
            
            }
            this.transactionData$ = [];
            this.transactionData$ = of(this.request);
          
            if (this.IsNull == true) {
              //this.DataExcel = [];
            }
          }
        });
    }

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

    CloseModalPopup() {
      this.modalService.dismissAll();
      //this.ImportExcelList = [];
    }

    async SaveImportExcelData() {
    
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.isLoading = true;
      this.ImportExcelList.forEach((e: any) => {
        e.FinancialYearID = this.sSOLoginDataModel.FinancialYearID,
        e.EndTermID = this.sSOLoginDataModel.EndTermID,
        e.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
        e.UserID = this.sSOLoginDataModel.UserID
      })
      try {
        await this.ITITimeTableService.SaveImportExcelData(this.ImportExcelList)
          .then((data: any) => {
            if (data.State == EnumStatus.Success) {
              this.toastr.success(data.Message)
              //this.ResetControl();
              this.CloseModalPopup();
              this.router.navigate(['/ItiTimeTable']);

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
}
