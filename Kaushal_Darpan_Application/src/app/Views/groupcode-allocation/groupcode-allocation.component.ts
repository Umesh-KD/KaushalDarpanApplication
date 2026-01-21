import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { GroupCodeAllocationAddEditModel, GroupCodeAllocationReportModel, GroupCodeAllocationSearchModel } from '../../Models/GroupCodeAllocationModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GroupcodeAllocationService } from '../../Services/groupcode-allocation/groupcode-allocation.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumConfigurationType, EnumStatus } from '../../Common/GlobalConstants';
import { RequestBaseModel } from '../../Models/RequestBaseModel';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../Models/CommonDDLSubjectMasterModel';
import { CommonSerialMasterRequestModel } from '../../Models/CommonSerialMasterRequestModel';
import { CommonSerialMasterResponseModel } from '../../Models/CommonSerialMasterResponseModel';
import { CommonDDLCommonSubjectModel } from '../../Models/CommonDDLCommonSubjectModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ReportService } from '../../Services/Report/report.service';


@Component({
  selector: 'app-groupcode-allocation',
  templateUrl: './groupcode-allocation.component.html',
  styleUrls: ['./groupcode-allocation.component.css'],
  standalone: false
})
export class GroupcodeAllocationComponent {
  public Message: any = [];
  public State: number = -1;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";

  public searchRequest = new GroupCodeAllocationSearchModel();
  public GroupCodeAllocationList: GroupCodeAllocationAddEditModel[] = []

  public GroupCodeAllocationSaveForm!: FormGroup;
  public StartValue: number = 0;
  public SemestarMasterDDLList: any[] = [];

  public requestSerialMaster = new CommonSerialMasterRequestModel();
  public SerialMasterDataList: CommonSerialMasterResponseModel[] = [];
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  public DataExcel: any = [];
  public GroupCodeMasterReportlist = new GroupCodeAllocationReportModel();
  constructor(private commonMasterService: CommonFunctionService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private groupcodeAllocationService: GroupcodeAllocationService,
    private Swal2: SweetAlert2,
    private ReportData: ReportService
  ) {
  }

  async ngOnInit() {
    //form
    this.GroupCodeAllocationSaveForm = this.formBuilder.group({
      StartValue: ['', [DropdownValidators]],
    });

    // login session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetSemestarMatserDDL();
    await this.GetAllData();
    await this.GetSerialMasterData();
    await this.GetDateConfig();
  }

  get formSave() { return this.GroupCodeAllocationSaveForm.controls; }

  async GetSemestarMatserDDL() {
    try {
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SemestarMasterDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async GetAllData() {
    debugger
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      //this.searchRequest.schemeId = this.searchRequest.schemeId;
      debugger
      await this.groupcodeAllocationService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.GroupCodeAllocationList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async SaveData() {
    try {
      this.isSubmitted = true;
      if (this.GroupCodeAllocationSaveForm.invalid) {
        return;
      }
      this.Swal2.Confirmation("Are you sure?,<br/>'GroupCode Generate' is the one time process, Please create all 'Group Partition' first then proceed.",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            //start value
            this.GroupCodeAllocationList.forEach(x => {
              x.ModifyBy = this.sSOLoginDataModel.UserID;
              x.EndTermID = this.sSOLoginDataModel.EndTermID;
              x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
            });
            //save
            await this.groupcodeAllocationService.SaveData(this.GroupCodeAllocationList, this.StartValue)
              .then(async (data: any) => {
                //
                this.State = data['State'];
                this.Message = data['Message'];
                console.log("data on save", data)
                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(this.Message);
                  console.log(data['ErrorMessage']);
                }
              })
              .catch((error: any) => {
                console.error(error);
                this.toastr.error('Failed to save!');
              });
          }
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async ClearSearchData() {
    this.searchRequest = new GroupCodeAllocationSearchModel();
    await this.GetAllData()
  }

  async GetSerialMasterData() {
    try {
      //set
      this.requestSerialMaster.TypeID = EnumConfigurationType.GroupCode;
      this.requestSerialMaster.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestSerialMaster.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.requestSerialMaster.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSerialMasterData(this.requestSerialMaster)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SerialMasterDataList = data['Data'];
          //partition size
          if (this.SerialMasterDataList.length > 0) {
            this.StartValue = parseInt(this.SerialMasterDataList[0].StartFrom);
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async GetDateConfig() {
    
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "GroupCodeAllocation"
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.GroupCodeAllocation;
      }, (error: any) => console.error(error)
      );
  }


  

  async exportExcelData() {
    debugger;
    try {
      // Prepare request
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      this.loaderService.requestStarted();

      const data: any = await this.groupcodeAllocationService.GetAllData(this.searchRequest);

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
        "SubjectName", "DepartmentID", "Eng_NonEng", "EndTermID",
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
        { header: 'Semester Name', key: 'SemesterName' },
        { header: 'Group Code', key: 'GroupCode' },
        { header: 'Total', key: 'Total' },
        { header: 'Common Subject Name', key: 'CommonSubjectName' },
        { header: 'Subject Code', key: 'SubjectCode' }
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
      const fileName = `GroupCodeAllocation_${now.getFullYear()}-${String(
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

  
  async downloadGroupCodeMasterReport() {

    debugger


    this.GroupCodeMasterReportlist.SemesterId = this.searchRequest.SemesterId
    this.GroupCodeMasterReportlist.EndTermID = this.sSOLoginDataModel.EndTermID
    this.GroupCodeMasterReportlist.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GroupCodeMasterReportlist.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.GroupCodeMasterReportlist.schemeid = this.searchRequest.schemeId
    this.GroupCodeMasterReportlist.action =  "_getAllData";

    this.ReportData.GroupCodeMasterReportDownload(this.GroupCodeMasterReportlist)
      .subscribe({
        next: (blob: Blob) => {

          const now = new Date();
          const dateTime =
            now.getFullYear().toString() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);

          const fileName = `Group_Code_Master_Report_${dateTime}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to download report');
        }
      });
  }

  async downloadGroupCodeMasterReportBranchwise() {

    debugger


    this.GroupCodeMasterReportlist.SemesterId = this.searchRequest.SemesterId
    this.GroupCodeMasterReportlist.EndTermID = this.sSOLoginDataModel.EndTermID
    this.GroupCodeMasterReportlist.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GroupCodeMasterReportlist.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.GroupCodeMasterReportlist.schemeid = this.searchRequest.schemeId
    this.GroupCodeMasterReportlist.action = "_getAllData";

    this.ReportData.GroupCodeMasterReportBranchwiseDownload(this.GroupCodeMasterReportlist)
      .subscribe({
        next: (blob: Blob) => {

          const now = new Date();
          const dateTime =
            now.getFullYear().toString() +
            ('0' + (now.getMonth() + 1)).slice(-2) +
            ('0' + now.getDate()).slice(-2) + '_' +
            ('0' + now.getHours()).slice(-2) +
            ('0' + now.getMinutes()).slice(-2);

          const fileName = `Group_Report_Branchwise${dateTime}.pdf`;

          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = fileName;
          a.click();

          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error(err);
          alert('Failed to download report');
        }
      });
  }



}
