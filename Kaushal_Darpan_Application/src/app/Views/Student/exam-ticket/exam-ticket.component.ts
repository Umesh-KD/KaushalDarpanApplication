import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentService } from '../../../Services/Student/student.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ReportBasedModel } from '../../../Models/ReportBasedDataModel';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../Services/Report/report.service';
import { StudentMarksheetSearchModel } from "../../../Models/OnlineMarkingReportDataModel";
import { ITIStateTradeCertificateSearchModel } from "../../../Models/TheoryMarksDataModels";

@Component({
    selector: 'app-exam-ticket',
    templateUrl: './exam-ticket.component.html',
    styleUrls: ['./exam-ticket.component.css'],
    standalone: false
})


export class ExamTicketComponent implements OnInit
{
  public searchRequest = new StudentSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public StudentDetailsModelList: StudentDetailsModel[] = [];
  public StudentSubjectList: [] = [];
  public SemesterName: string = '';
  public _GlobalConstants: any = GlobalConstants;
  public ReportBasedModelSearch = new ReportBasedModel()
  public MarksheetSearch = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();
  
  //Modal Boostrap.
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;


  constructor(private loaderService: LoaderService,
    private studentService: StudentService, private modalService:
      NgbModal, private appsettingConfig: AppsettingService, private http: HttpClient,
    private toastr: ToastrService, private reportService: ReportService

  ) { }
  async ngOnInit()
  {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetAllData();
  }
  async GetAllData()
  {
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.studentId = this.sSOLoginDataModel.StudentID;
      this.searchRequest.ssoId = this.sSOLoginDataModel.SSOID;
      this.searchRequest.roleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.action = this.sSOLoginDataModel.DepartmentID == EnumDepartment.BTER ? '_GetStudentExamList' : "_GetStudentExamList_ITI";

      await this.studentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            this.MarksheetSearch.RollNo = this.StudentDetailsModelList[0].RollNo;
            console.log(this.StudentDetailsModelList, "aaa")

          }
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

  async openModal(content: any, item: StudentDetailsModel)
  {
    this.SemesterName = item.Semester;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.searchRequest.action = this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI ? '_GetStudentExamSubjectListITI' : '_GetStudentExamSubjectList';
    this.searchRequest.studentId = item.StudentID;
    this.searchRequest.SemesterID = item.SemesterID;
    this.searchRequest.StudentExamID = item.StudentExamID;
    await this.GetStudentDeatilsByAction();

  }

  async GetStudentDeatilsByAction() {
    this.StudentSubjectList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentService.GetStudentDeatilsByAction(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentSubjectList = data['Data'];
          }
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

  CloseModal() { this.modalService.dismissAll(); }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  async GetStudentEnrolled(item: any) {
    console.log(item, 'qqqqqq')
    try {
      this.ReportBasedModelSearch.StudentID = item.StudentID;
      this.ReportBasedModelSearch.EndTermID = item.EndTermID;
      this.ReportBasedModelSearch.StudentExamID = item.StudentExamID;
      this.loaderService.requestStarted();
      await this.reportService.GetExaminationForm(this.ReportBasedModelSearch)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
          }
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

  DownloadFile(FileName: string, DownloadfileName: any): void
  {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string
  {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }


  DownloadAdmitFile(FileName: string, DownloadfileName: any): void
  {
    
    var fileUrl = '';
    if (this.sSOLoginDataModel.DepartmentID == EnumDepartment.ITI)
    {
      fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ITIReportsFolder + GlobalConstants.ITIAdmitCardFolder + "/" + FileName;;
    }
    else
    {
      fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    }
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }


  async GetITIStudent_Marksheet() {
    try {
      this.loaderService.requestStarted();




      this.MarksheetSearch.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.reportService.GetITIStudent_Marksheet(this.MarksheetSearch)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));
          debugger
          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'StudentMarksheet.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ConsolidatedDownload(StudentID: number) {
    try {
      this.loaderService.requestStarted();
      this.searchRequestConsolidated.StudentID = StudentID;
      this.searchRequestConsolidated.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.reportService.ITIMarksheetConsolidated(this.searchRequestConsolidated)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          data = JSON.parse(JSON.stringify(data));

          if (data && data.Data) {
            const base64 = data.Data;

            const byteCharacters = atob(base64);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'ConsolidatedMarksheet.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            this.toastr.error(this.Message)
          }
        }, (error: any) => {
          console.error(error);
          this.toastr.error(this.ErrorMessage)
        });

    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
