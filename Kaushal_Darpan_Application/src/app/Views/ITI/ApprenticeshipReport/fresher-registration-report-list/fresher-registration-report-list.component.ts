import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ITIApprenticeshipRegPassOutModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';

@Component({
  selector: 'app-fresher-registration-report-list',
  standalone: false,
  templateUrl: './fresher-registration-report-list.component.html',
  styleUrl: './fresher-registration-report-list.component.css'
})
export class fresherRegistrationReportListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  public DataList: any = [];

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIApprenticeshipRegPassOutModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public totalInTableRecord: number = 0;
  public currentInTablePage: number = 1;
  public paginatedInTableData: any[] = [];
  pageInTableSize: string = '50';
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public totals: any = [];
  public totalInTablePage: number = 0;
  includedKeys: string[] = [
    'RegCount',


  ];
  Object = Object;
  public SetfileName: string = '';

  constructor(
    private commonMasterService: CommonFunctionService,
    private ScholarshipService: ScholarshipService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private ApprenticeShipRPTService: ApprenticeReportServiceService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;


    console.log(this.sSOLoginDataModel);

/*    this.GetInstituteList();*/
    await this.getExamMasterList()
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
    await this.GetReportAllData();
    await this.calculateDynamicTotals(this.DataList);
  }
  GoToReportEntryPage() {
    sessionStorage.setItem('fresherRegistrationReportPKID', '0');
    this.routers.navigate(['/fresherRegistrationReport']);
  }

  async GetInstituteList() {
    if (this.sSOLoginDataModel.RoleID == 97) {
      await this.getExamMasterList()
    } else {
      await this.getExamMasterListALL()
    }
  }



  async getExamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.NodalInstituteList(this.sSOLoginDataModel.InstituteID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("ExamList", this.ExamList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async calculateDynamicTotals(data: any[]) {
    this.totals = {};

    // Initialize totals in SAME SEQUENCE
    this.includedKeys.forEach(key => {
      this.totals[key] = 0;
    });

    // Sum values
    data.forEach(row => {
      this.includedKeys.forEach(key => {
        const value = row[key];
        if (value !== null && value !== '' && !isNaN(value)) {
          this.totals[key] += Number(value);
        }
      });
    });
  }

  async getExamMasterListALL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.Iticollege(2, 1, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("ExamList", this.ExamList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetReportAllData() {
    debugger;
    try {
      // this.loaderService.requestStarted();
      var UserID: number = 0
      if (this.sSOLoginDataModel.RoleID != 97 && this.sSOLoginDataModel.RoleID!=100) {
        UserID = 0
      } else {
        UserID = this.sSOLoginDataModel.UserID
      }
      let obj = {
        EndTermID: this.sSOLoginDataModel.EndTermID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        RoleID: this.sSOLoginDataModel.RoleID,
        Createdby: this.sSOLoginDataModel.UserID,
        InstituteID: this.searchRequest.InstituteID,
        UserID: UserID
      };


      await this.ApprenticeShipRPTService.Get_FresherRegistrationReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data;
            //this.loadInTable();
             this.calculateDynamicTotals(this.DataList);
          }
          else {
            this.DataList = [];
            this.calculateDynamicTotals(this.DataList);
          }
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


  EditData(id: number,flag:number=0) {
    debugger;
    sessionStorage.setItem('fresherRegistrationReportPKID', id.toString());
    sessionStorage.setItem('flag', flag.toString());
    this.routers.navigate(['/fresherRegistrationReport']);
    console.log(sessionStorage);
  }


  async DeleteByID(id: number) {
    debugger;
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {

            this.loaderService.requestStarted();
            await this.ApprenticeShipRPTService.FresherRegistrationRPTDelete_byID(id)
              .then((data: any) => {
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.GetReportAllData();

                } else {
                  this.toastr.error(data.ErrorMessage)
                }
              })
          } catch (error) {
            console.error(error)
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }
  async ResetControl() {
    this.isSubmitted = false;
    /*    this.SubjectMasterDDLList = [];*/
    this.ExaminersList = [];

    //this.searchRequest.StreamID = 0;
    //this.searchRequest.SemesterID = 0
    if (this.sSOLoginDataModel.RoleID != EnumRole.Principal && this.sSOLoginDataModel.RoleID != EnumRole.PrincipalNon) {
      this.searchRequest.InstituteID = 0
    }
   
  }

  //async DownloadFresherApprenticeshipReport() {
  //  try {

  //    var UserID: number = 0
  //    if (this.sSOLoginDataModel.RoleID != 97 && this.sSOLoginDataModel.RoleID != 100) {
  //      UserID = 0
  //    } else {
  //      UserID = this.sSOLoginDataModel.UserID
  //    }
  //    let obj = {
  //      EndTermID: this.sSOLoginDataModel.EndTermID,
  //      DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //      RoleID: this.sSOLoginDataModel.RoleID,
  //      Createdby: this.sSOLoginDataModel.UserID,
  //      InstituteID: this.searchRequest.InstituteID,
  //      UserID: UserID
  //    };

  //    this.loaderService.requestStarted();

      

  //    //await this.reportService.GetFresherApprenticeship(obj)
  //    //  .then((data: any) => {
  //    //    data = JSON.parse(JSON.stringify(data));
  //    //    console.log("DownloadFresherApprenticeshipReport", data)
  //    //    if (data.State === EnumStatus.Success) {
  //    //      // this.toastr.success(data.Message);
  //    //      this.DownloadFile(data.Data)
  //    //    } else {
  //    //      this.toastr.error(data.ErrorMessage);
  //    //    }
  //    //  }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  DownloadFile(FileName: string): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
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
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.DataList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }

  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.DataList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }

  downloadBase64PDF(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }

  async DownloadFresherApprenticeshipReport() {
    try {
      debugger
      this.SetfileName ='ApprenticeshipRegistration_'
      var UserID: number = 0
          if (this.sSOLoginDataModel.RoleID != 97 && this.sSOLoginDataModel.RoleID != 100) {
            UserID = 0
          } else {
            UserID = this.sSOLoginDataModel.UserID
          }
      let obj = {
            EndTermID: this.sSOLoginDataModel.EndTermID,
            DepartmentID: this.sSOLoginDataModel.DepartmentID,
            RoleID: this.sSOLoginDataModel.RoleID,
            Createdby: this.sSOLoginDataModel.UserID,
            InstituteID: this.searchRequest.InstituteID,
            UserID: UserID
          };
      const data: any = await this.reportService.ApprenticeshipFresherReports(obj);
      const response = JSON.parse(JSON.stringify(data));
      if (response.State === EnumStatus.Success) {
        if (response.Data && response.Data.length > 0) {
          this.downloadBase64PDF(response.Data, this.SetfileName + '.pdf');
        } else {
          this.toastr.warning('No data available to generate PDF.');
        }

      } else {
        this.toastr.error(response.Message);
      }

    } catch (error) {
      console.error(error);
      this.toastr.error('Something went wrong.');
    }
  }
}
