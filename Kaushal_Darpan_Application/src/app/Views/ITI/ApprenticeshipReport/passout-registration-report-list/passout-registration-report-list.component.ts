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
import { EnumDepartment, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ITIApprenticeshipRegPassOutModel } from '../../../../Models/ITI/ITIApprenticeshipWorkshopDataModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-passout-registration-report-list',
  standalone: false,
  templateUrl: './passout-registration-report-list.component.html',
  styleUrl: './passout-registration-report-list.component.css'
})
export class PassoutRegistrationReportListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  public DataList: any = [];
  public ExamShiftList: any = [];

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIApprenticeshipRegPassOutModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
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

  
  
      this.isInstituteDisabled = true;

   
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
    this.GetReportAllData();
  await  this.GetInstituteList();
  }
  GoToReportEntryPage() {
    sessionStorage.setItem('PaasoutRegistrationReportPKID', '0');
    this.routers.navigate(['/PaasoutRegistrationReport']);
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

    try {
      // this.loaderService.requestStarted();
      var UserID: number = 0
      if (this.sSOLoginDataModel.RoleID != 97) {
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


      await this.ApprenticeShipRPTService.Get_PassingRegistrationReportAllData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            this.DataList = data.Data;
            //this.loadInTable();
          }
          else {
            this.DataList = [];
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


  EditData(id: number) {
    debugger;
    sessionStorage.setItem('PaasoutRegistrationReportPKID', id.toString());
    this.routers.navigate(['/PaasoutRegistrationReport']);
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
            await this.ApprenticeShipRPTService.PassOutRegistrationRPTDelete_byID(id)
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

  //exportToExcel(filename : string): void {
  //  // Create a new Excel workbook
  //  debugger;
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  // Export the Excel file
  //  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  //}

  //exportToExcel1(filename: string): void {
  //  // Create a new Excel workbook
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  //  // Export the Excel file
  //  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`);
  //}

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

  async DownloadPassoutApprenticeshipReport() {
    try {
      this.loaderService.requestStarted();
      await this.reportService.GetPassoutApprenticeship(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("DownloadPassoutApprenticeshipReport", data);
          if (data.State === EnumStatus.Success) {
            // this.toastr.success(data.Message);
            this.DownloadFile(data.Data);
          } else {
            this.toastr.error(data.ErrorMessage);
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



}
