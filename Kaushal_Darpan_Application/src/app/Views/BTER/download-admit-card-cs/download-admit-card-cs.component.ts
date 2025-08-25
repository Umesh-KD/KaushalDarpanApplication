import { Component } from '@angular/core';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { StudentAdmitCardDownloadModel } from '../../../Models/GenerateRollDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../Services/Report/report.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { GenerateAdmitCardSearchModel } from '../../../Models/GenerateAdmitCardDataModel';

@Component({
  selector: 'app-download-admit-card-cs',
  standalone: false,
  templateUrl: './download-admit-card-cs.component.html',
  styleUrl: './download-admit-card-cs.component.css'
})
export class DownloadAdmitCardCSComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterList: any = [];
  public InstituteMasterDDLList: any = [];
  public StudentList: any = [];

  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new StudentAdmitCardDownloadModel();
  public AdmitcardModel = new GenerateAdmitCardSearchModel();

  constructor(
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private reportService: ReportService, 
    private toastrService: ToastrService, 
    private appsettingConfig: AppsettingService, 
    private http: HttpClient, 
    private Swal2: SweetAlert2,
    
  ) { }

  async ngOnInit() {


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  
    
    await this.GetStudentList()
    this.getInstituteMasterList()
  }

  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })

      await this.commonMasterService.SemesterMaster(1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterDDLList = data['Data'];
        }, (error: any) => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetFilter() {
    this.searchRequest = new StudentAdmitCardDownloadModel();
  }

  async GetStudentList() {

    try {

      //session
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.loaderService.requestStarted();
      //call
      await this.commonMasterService.StudentListForAdmitCard_CS(this.searchRequest).then(
        (data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.StudentList = data.Data;
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  DownloadFile(FileName: string, DownloadfileName: any): void {

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

  async DownloadAdmitCard(row: any)
  {
    try {
      this.loaderService.requestStarted();
      this.AdmitcardModel.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.AdmitcardModel.StudentID = row.StudentID;
      this.AdmitcardModel.StudentExamID = row.StudentExamID;
      this.AdmitcardModel.EnrollmentNo = row.EnrollmentNo;
      await this.reportService.GetStudentAdmitCard(this.AdmitcardModel)
        .then(async (data: any) => {
          
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
            //await this.();
          }
          else {
            this.toastrService.error(data.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastrService.error('Failed to Action Short List!');
        });
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
