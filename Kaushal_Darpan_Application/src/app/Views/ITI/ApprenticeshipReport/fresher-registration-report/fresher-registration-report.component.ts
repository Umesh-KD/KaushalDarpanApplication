
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
import { ITIApprenticeshipRegPassOutModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-fresher-registration-report',
  standalone: false,
  templateUrl: './fresher-registration-report.component.html',
  styleUrl: './fresher-registration-report.component.css'
})
export class fresherRegistrationReportComponent {

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
  request = new ITIApprenticeshipRegPassOutModel()
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
  public SubjectName: string = '';
  public searchRequest = new ITITimeTableSearchModel()
  public importFile: any;
  public selectedFile: File | null = null;  // Store the selected file
  public ImportExcelList: any[] = [];
  @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails: any;
  public transactionData$: any;
  public IsNull: boolean = false;
  public UpdateEditID: number = 0;
  public IsUpdateCase: boolean = false;
  public isdisable:boolean=false
  constructor(
    private fb: FormBuilder,
    private ITITimeTableService: ApprenticeReportServiceService,
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
    private appsettingConfig: AppsettingService,
    private ApprenticeShipRPTService: ApprenticeReportServiceService
  ) { }

  async ngOnInit() {
    debugger;
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    this.ITITimeTableForm = this.fb.group({
      InstituteID: ['', [DropdownValidators]],
      RegDate: ['', Validators.required],
      FileNameDoc: ['', Validators.required],
      RegCount: ['', Validators.required],
      Remarks: ['', Validators.required],
    });
    const Editid = sessionStorage.getItem('fresherRegistrationReportPKID');
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetReportDatabyID(parseInt(Editid));
      this.ITITimeTableForm.disable()
      this.isdisable=true
      console.log(Editid);
    }

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.sSOLoginDataModel.RoleID != 97) {
      this.ITITimeTableForm.disable()
    } else {
/*      this.ITITimeTableForm.enable()*/
    }
    await this.GetExamShift();

    
  }

  get _TimeTableForm() { return this.ITITimeTableForm.controls; }
  get _TradeSubjectFormGroup() { return this.TradeSubjectFormGroup.controls; }


  async GetExamShift() {
    try {
      this.loaderService.requestStarted();
      var DepartmentID = EnumDepartment.ITI
      await this.commonMasterService.NodalInstituteList(this.sSOLoginDataModel.InstituteID)
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

 

  async GetReportDatabyID(ReportID: number) {
    debugger;
    try {
      this.loaderService.requestStarted();

      let obj = {
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        RoleID: this.sSOLoginDataModel.RoleID,
        Createdby: this.sSOLoginDataModel.UserID,
        PKID: ReportID,  //  get Record by ID for Edit
      };
      debugger;


      await this.ApprenticeShipRPTService.Get_FresherRegistrationReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.ITITimeTableForm.patchValue({
              InstituteID: data.Data['0'].InstituteId,
              RegDate: data.Data['0'].RegDate,
              RegCount: data.Data['0'].RegCount,           
              Remarks: data.Data['0'].Remarks, 
            })
            this.request.FileName = data.Data['0'].FileName,
              this.request.Dis_FilePath = data.Data['0'].Dis_FilePath
            this.IsUpdateCase = true;
            this.UpdateEditID = ReportID;
          }
          else {
            // this.DataList = [];
          }

          //console.log(this.DataList)
        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
 


  async saveData() {
    debugger
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
      await this.ITITimeTableService.SaveFresherReport(this.request)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            setTimeout(() => {
              this.router.navigate(['/fresherRegistrationReportlist']);
            }, 1300);
          

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

    //if (this.isEditMode) {
    //  this.request.TimeTableID = 0
    //  this.request.SubjectID = 0
    //  this.request.ExamDate = ''
    //  this.request.StartTime = ''
    //  this.request.SubjectCode = ''
    //  this.request.EndTime = ''
    //  this.request.ShiftID = 0
    //  this.request.EndTermID = 0
    //  this.request.FinancialYearID = 0
    //  this.request.ActiveStatus = true
    //  this.request.DeleteStatus = false
    //  this.request.UserID = 0
    //  this.request.DepartmentID = 0
    //  this.request.InvigilatorID = 0
    //  this.request.TradeSubjectDataModel = []
    //} else {
    //  this.request = new ITITimeTableDataModels()
    //}
    //this.isTradeSubSubmitted = false;
    //this.tradeSubjectReq = new TradeSubjectDataModel()
  }

  onCancel(): void {
    this.router.navigate(['/timetable']);
  }

  async ResetRow() {
    this.isTradeSubSubmitted = false


    //this.tradeSubjectReq.SubjectID = 0;
    //this.tradeSubjectReq.SubjectName = '';
    //this.request.SubjectCode = ''

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
      this.searchRequest.Action = 'GetdataYearly'
      this.loaderService.requestStarted();
      await this.ITITimeTableService.SampleImportExcelFileFresher(this.searchRequest)
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
          console.log("ExportExcelData data", data);
          if (data.State === EnumStatus.Success) {
            let dataExcel = data.Data;

            const unwantedColumns = [
""
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
    return `ITIFresherApprenticeship${timestamp}.${extension}`;
  }


  onFileChange(event: any): void {

    // Get the file from the input element
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
 /*     this.ImportExcelFile(file);*/
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

  //ImportExcelFile(file: File): void {
  //  let mesg = '';
  //  this.ITITimeTableService.SampleImportExcelFilePassout(file)
  //    .then((data: any) => {

  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.State === EnumStatus.Success) {

  //        this.ImportExcelList = data['Data'];
  //        console.log(this.ImportExcelList, "data in excel")

  //        if (this.ImportExcelList.length > 0) {
  //          this.GetImportExcelDataPopup(this.MyModel_ViewDetails);

  //        }
  //        this.transactionData$ = [];
  //        this.transactionData$ = of(this.request);

  //        if (this.IsNull == true) {
  //          //this.DataExcel = [];
  //        }
  //      }
  //    });
  //}

  exportToExcel(): void {

    const unwantedColumns = ['AID', 'TimeTableID', 'StartTime', 'EndTime', 'EndTermID', 'FinancialYearID', 'InvigilatorID', 'StreamId',
      'SubjectID', 'RTS', 'DepartmentID', 'BranchSubjectDataModel',
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

    //this.isSubmitted = true;
    //this.loaderService.requestStarted();
    //this.isLoading = true;
    //this.ImportExcelList.forEach((e: any) => {
    //  e.FinancialYearID = this.sSOLoginDataModel.FinancialYearID,
    //    e.EndTermID = this.sSOLoginDataModel.EndTermID,
    //    e.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    //  e.UserID = this.sSOLoginDataModel.UserID
    //})
    //try {
    //  await this.ITITimeTableService.SaveImportExcelData(this.ImportExcelList)
    //    .then((data: any) => {
    //      if (data.State == EnumStatus.Success) {
    //        this.toastr.success(data.Message)
    //        //this.ResetControl();
    //        this.CloseModalPopup();
    //        this.router.navigate(['/ItiTimeTable']);

    //      } else {
    //        this.toastr.error(data.ErrorMessage)
    //      }
    //    })
    //}
    //catch (ex) { console.log(ex) }
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //    this.isLoading = false;
    //  }, 200);
    //}
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            debugger
            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {

                this.request.Dis_FilePath = data['Data'][0]["Dis_FileName"];
                this.request.FileName = data['Data'][0]["FileName"];

           
              } 
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }
  GoToReportEntryPage() {
    sessionStorage.setItem('fresherRegistrationReportlistPKID', '0');
    this.router.navigate(['/fresherRegistrationReportlist']);
  }

  async UpdateRecordbyID(UpdateEditID: number) {
    debugger;
    this.isSubmitted = true;
    if (this.ITITimeTableForm.invalid) {
      this.toastr.error('Please enter required fields')
      return;
    }

    try {
      this.request.UserID = this.sSOLoginDataModel.UserID;
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.PKID = UpdateEditID;
      this.request.ID = UpdateEditID;
      this.loaderService.requestStarted();
      await this.ITITimeTableService.SaveFresherReport(this.request)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            setTimeout(() => {
              this.router.navigate(['/fresherRegistrationReportlist']);
            }, 1300);


          } else {
            this.toastr.error(data.ErrorMessage)
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
}
