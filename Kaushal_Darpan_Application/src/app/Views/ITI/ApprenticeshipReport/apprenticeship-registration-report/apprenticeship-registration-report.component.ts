import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ApprenticeshipEntry } from '../../../../Models/ITI/ApprenticeshipReportModel';
import { MatSelectChange } from '@angular/material/select';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { ITITimeTableSearchModel } from '../../../../Models/ITI/ITITimeTableModels';

@Component({
  selector: 'app-apprenticeship-registration-report',
  standalone: false,
  templateUrl: './apprenticeship-registration-report.component.html',
  styleUrl: './apprenticeship-registration-report.component.css'
})
export class ApprenticeshipRegistrationReport {
  ApprenticeshipRows: ApprenticeshipEntry[] = [];
  ApprenticeshipReportFormGroup!: FormGroup;
  public TradeList: any = [];
  public UpdateRowRecordList: any = [];
  isAllSelected = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public ssoLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITITimeTableSearchModel()
  public request: any = [];
  public selectedFile: File | null = null; 
  public State: number = -1;
  public IsUpdateCase: boolean = false;
  public UpdateEditID: number = 0;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CollegeList: any = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private routers: Router,
    private ApprenticeShipRPTService: ApprenticeReportServiceService,
    private CommonService: CommonFunctionService,
  ) { }

  
  async ngOnInit() {
    this.ApprenticeshipReportFormGroup = this.formBuilder.group({
      Nameofinstitute: [0, Validators.required],
      dateofregistration: ['', Validators.required],
      BusinessName: [[], this.atLeastOneSelectedValidator()],
      NumberofTrainees: ['', Validators.required],
      Numberofapprentices: ['', Validators.required],
      Remarks: ['', Validators.required],
      NumberOfRegistrationDoc: ['', Validators.required]
    });
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.GetTradeMatserDDL();
    this.GetITICollege();
    this.request.FileName = '';
    const Editid = sessionStorage.getItem('ApprenticeshipRegistrationReportPKID');
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetReportDatabyID(parseInt(Editid));
      this.ApprenticeshipReportFormGroup.disable(); // Disables all form controls
      console.log(Editid);
    }
    if (this.ssoLoginDataModel.RoleID != 97) {
      this.ApprenticeshipReportFormGroup.disable(); // Disables all form controls
    }
    else {
     // this.ApprenticeshipReportFormGroup.enable(); // Disa
    }

  }


  onSelectionChange(event: MatSelectChange): void {
    const selected = event.value;

    if (selected.includes('ALL')) {
      if (this.isAllSelected) {
        // Unselect All
        this.isAllSelected = false;
        this.ApprenticeshipReportFormGroup.get('BusinessName')?.setValue([]);
      } else {
        // Select All
        this.isAllSelected = true;
        const allIds = this.TradeList.map((item: { ID: any; }) => item.ID);
        this.ApprenticeshipReportFormGroup.get('BusinessName')?.setValue(allIds);
       
      }
    } else {
      // Manual change (only allowed if not "Select All")
      this.isAllSelected = false;
    }
  }
 
  async atLeastOneSelectedValidator(): Promise<ValidatorFn> {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0 ? null : { required: true };
    };
  }
  async GetTradeMatserDDL() {

    if (this.ApprenticeshipReportFormGroup.value.Nameofinstitute == 0) {
      this.toastr.error('Please Select Institute Name');
      this.TradeList = [];
      return;
    }
    var DepartmentID = this.ssoLoginDataModel.DepartmentID;
    var InstituteID = this.ApprenticeshipReportFormGroup.value.Nameofinstitute;
    try {
      this.loaderService.requestStarted();
      await this.CommonService.ItiTrade(DepartmentID, 0, this.ssoLoginDataModel.EndTermID, InstituteID)
        .then((data: any) => {
          debugger
          data = JSON.parse(JSON.stringify(data));
          this.TradeList = data['Data'];
          console.log(this.TradeList)
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

  async AddRow() {
    debugger;
    this.ApprenticeshipReportFormGroup.value.NumberOfRegistrationDoc = this.request.FileName;
    if (this.ApprenticeshipReportFormGroup.value.BusinessName.length == 0 || this.ApprenticeshipReportFormGroup.value.BusinessName.length  == null)
    {
      this.toastr.warning("Please Fill All Required Fileds !");
      return;
    }

    if (this.ApprenticeshipReportFormGroup.valid) {
      const newRow = { ...this.ApprenticeshipReportFormGroup.value };
      if (newRow.NumberOfRegistrationDoc && typeof newRow.NumberOfRegistrationDoc === 'string') {
        const fakePath = newRow.NumberOfRegistrationDoc;
        newRow.NumberOfRegistrationDoc = fakePath.split('\\').pop(); // just get the file name
      }

      this.ApprenticeshipRows.push(newRow);
      this.ApprenticeshipReportFormGroup.reset(); // Optionally reset after adding
      this.isAllSelected = false;
      this.request.Dis_FilePath = '';
      this.ApprenticeshipReportFormGroup.value.NumberOfRegistrationDoc = '';
    }
    else {
      this.ApprenticeshipReportFormGroup.markAllAsTouched(); // show errors if invalid
    }
  }
  removeRow(index: number) {
    this.ApprenticeshipRows.splice(index, 1);
  }
  getBusinessNamesFromIds(ids: string[]): string[] {
    return ids.map(id => {
      const match = this.TradeList.find((item: { ID: string; }) => item.ID === id);
      return match ? match.Name : id;
    });
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();

        await this.CommonService.UploadDocument(this.file)
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

  async onFinalSubmit() {
    debugger;

    const commonProps = {
      EndTermID: this.ssoLoginDataModel?.EndTermID || 0,
      DepartmentID: this.ssoLoginDataModel?.DepartmentID || 0,
      RoleID: this.ssoLoginDataModel?.RoleID || 0,
      Createdby: this.ssoLoginDataModel?.UserID || 0,
      PKID: 0
    };

    const payload = {
      apprenticeshipEntries: this.ApprenticeshipRows.map(entry => ({
        ...entry,
        ...commonProps // push outer properties into each entry
      })),
      ...commonProps // keep them outside too, if needed by API
    };

    //const payload = {
    //  apprenticeshipEntries: this.ApprenticeshipRows,
    //  EndTermID: this.ssoLoginDataModel?.EndTermID || 0,
    //  DepartmentID: this.ssoLoginDataModel?.DepartmentID || 0,
    //  RoleID: this.ssoLoginDataModel?.RoleID || 0,
    //  Createdby: this.ssoLoginDataModel?.UserID || 0
    //}
    try {
      this.loaderService.requestStarted();

      await this.ApprenticeShipRPTService.Submit_Apprenticeship_data(payload).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.toastr.success(data.Data['0'].msg);
          setTimeout(() => {
            this.routers.navigate(['/ApprenticeshipRegistrationReport-list']);
          }, 1300);
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


  async GetReportDatabyID(ReportID: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      let obj = {
        EndTermID: this.ssoLoginDataModel.EndTermID,
        DepartmentID: this.ssoLoginDataModel.DepartmentID,
        RoleID: this.ssoLoginDataModel.RoleID,
        Createdby: 0,
        PKID: ReportID,  //  get Record by ID for Edit
      };
      debugger;


      await this.ApprenticeShipRPTService.Get_ApprenticeshipRegistrationReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {

            debugger
            this.ApprenticeshipReportFormGroup.patchValue({
              Nameofinstitute: data.Data['0'].InId,
              dateofregistration: data.Data['0'].Dateofregistration,
              NumberofTrainees: data.Data['0'].NumberofTrainees,
              Numberofapprentices: data.Data['0'].Numberofapprentices,
              Remarks: data.Data['0'].Remarks,
              BusinessName: data.Data['0'].BusinessID.split(',').map(Number),
              
            })
            this.request.FileName = data.Data['0'].NumberOfRegistrationDoc;
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


  async UpdateRecordbyID(UpdateEditID: number) {
    debugger;
    this.ApprenticeshipReportFormGroup.value.NumberOfRegistrationDoc = this.request.FileName;
    if (this.ApprenticeshipReportFormGroup.invalid) {
      const newRow = { ...this.ApprenticeshipReportFormGroup.value };
      if (newRow.NumberOfRegistrationDoc && typeof newRow.NumberOfRegistrationDoc === 'string') {
        const fakePath = newRow.NumberOfRegistrationDoc;
        newRow.NumberOfRegistrationDoc = fakePath.split('\\').pop(); // just get the file name
      }
      this.ApprenticeshipRows.push(newRow);
      this.ApprenticeshipReportFormGroup.reset(); // Optionally reset after adding
      this.isAllSelected = false;
    }
    else {
      this.ApprenticeshipReportFormGroup.markAllAsTouched(); // show errors if invalid
    }

    if (!this.UpdateRowRecordList) {
      this.UpdateRowRecordList = [];
    }


    const commonProps = {
      EndTermID: this.ssoLoginDataModel?.EndTermID || 0,
      DepartmentID: this.ssoLoginDataModel?.DepartmentID || 0,
      RoleID: this.ssoLoginDataModel?.RoleID || 0,
      Createdby: this.ssoLoginDataModel?.UserID || 0,
      PKID: UpdateEditID
    };

    const payload = {
      apprenticeshipEntries: this.ApprenticeshipRows.map(entry => ({
        ...entry,
        ...commonProps // push outer properties into each entry
      })),
      ...commonProps // keep them outside too, if needed by API
    };
  
    try {
      this.loaderService.requestStarted();

      await this.ApprenticeShipRPTService.Submit_Apprenticeship_data(payload).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0) {
          this.toastr.success(data.Data['0'].msg);
          setTimeout(() => {
            this.routers.navigate(['/ApprenticeshipRegistrationReport-list']);
          }, 1300);
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

  async SampleexportExcelDataYearly() {

    try {
      this.searchRequest.FinancialYearID = this.ssoLoginDataModel.FinancialYearID
      this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID
      this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID
      this.searchRequest.Action = 'GetdataYearly'
      this.loaderService.requestStarted();
      await this.ApprenticeShipRPTService.MelaSampleImportExcelFile(this.searchRequest)
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
    return `ITIApprenticeship${timestamp}.${extension}`;
  }

  async GetITICollege() {
    debugger;

    const DepartmentID: number = this.ssoLoginDataModel.DepartmentID;
    const Eng_NonEng: number = 2;
    const EndTermId: number = this.ssoLoginDataModel.EndTermID;
    const InsutiteId: number = this.ssoLoginDataModel.InstituteID;

    try {
      const response: any = await this.CommonService.NodalInstituteList(InsutiteId);

      // Just in case the backend wraps it in a stringified object (unusual but okay)
      const data = typeof response === 'string' ? JSON.parse(response) : response;

      this.CollegeList = data['Data'];
      console.log('College List:', this.CollegeList);

    } catch (error) {
      console.error('Failed to fetch ITI Colleges:', error);
    }
  }
}
