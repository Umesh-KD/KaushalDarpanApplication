import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiAssignExaminerService } from '../../../../Services/ITIAssignExaminer/iti-assign-examiner.service';
import { ITI_AppointExaminerDetailsModel } from '../../../../Models/ITI/ITI_ExaminerDashboard';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../../Services/Report/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnumStatus } from '../../../../Common/GlobalConstants';
@Component({
  selector: 'app-iti-admin-practical-remuneration-details',
  templateUrl: './iti-admin-practical-remuneration-details.component.html',
  styleUrl: './iti-admin-practical-remuneration-details.component.css',
  standalone: false
})
export class ItiAdminRemunerationDetailsComponent {
  public ExaminerID: number = 0
  public Code: string = ''
  public ExamTypeID: number = 0
  public VerifyCode: string = ''
  public AppointExaminerID:number=0
  public searchRequest = new ITI_AppointExaminerDetailsModel()
  public ssoLoginDataModel = new SSOLoginDataModel()
  public AppointedExaminerList: any = []
  public FilteredExaminerList: any[] = [];
  @ViewChild('MyModel_ExaminerCodeLogin') MyModel_ExaminerCodeLogin: ElementRef | any;
  public closeResult: string | undefined;
  public isSubmitted: boolean = false;
  public RenumerationExaminerList: any = [];
  public pdfUrl: SafeResourceUrl | null = null;
  public showPdfModal = false;
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private itiExaminerService: ItiAssignExaminerService,
    private modalService: NgbModal,
    private routers: Router,
    private toastr: ToastrService,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
  ) {}
  selectedStatus: number = 1;
  async ngOnInit() {
    debugger;
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("this.ssoLoginDataModel",this.ssoLoginDataModel);
    this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID
    
    this.route.paramMap.subscribe(params => {
      this.ExaminerID = Number(params.get('id'));
      this.ExamTypeID = Number(params.get('status'));
      console.log('URL Param:', this.ExaminerID);
      console.log('Status Param:', this.ExamTypeID);
    });

    this.GetItiAppointExaminerDetails();
  }

  async GetItiAppointExaminerDetails() {
    debugger;
    try {
      this.loaderService.requestStarted();  
      //this.searchRequest.ExaminerID = this.ExaminerID
      //this.searchRequest.Status = this.ExamTypeID
      this.searchRequest.SSOID = this.ssoLoginDataModel.SSOID;
      this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
      this.searchRequest.RoleID = this.ssoLoginDataModel.RoleID;
      this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;

      await this.itiExaminerService.GetItiRemunerationAdminDetails(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          this.AppointedExaminerList = data.Data;
          this.FilteredExaminerList = this.AppointedExaminerList.filter((x: any) => x.adminstatus === 1);; 
          console.log(this.AppointedExaminerList)
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

  async FilterDataByStatus() {
    debugger;
    const selectedStatus = Number((document.getElementById("Status") as HTMLSelectElement).value);

    //if (selectedStatus === 0) {
    //  this.FilteredExaminerList = [...this.AppointedExaminerList]; // all
    //} else {
      this.FilteredExaminerList = this.AppointedExaminerList.filter((x: any) => x.adminstatus === selectedStatus);
    //}
  }

  //OpenModalPopup(content: any, AppointExaminerID: number, ExaminerCode: string) {
  //  debugger
  //  this.Code = ''
  //  this.AppointExaminerID = 0
  //  this.VerifyCode=''
  //  this.modalService.open(content, { size: 'sm', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
  //    this.closeResult = `Closed with: ${result}`;
  //  }, (reason) => {
  //    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //  });

  //  this.AppointExaminerID = AppointExaminerID
  //  this.VerifyCode = ExaminerCode

  //}
  //CloseModalPopup(isNavigate: boolean) {
  //  this.modalService.dismissAll();
  //  //if (isNavigate) {
  //  //  this.routers.navigate(['/dashboard']);
  //  //}
  //}
  //private getDismissReason(reason: any): string {
  //  if (reason === ModalDismissReasons.ESC) {
  //    return 'by pressing ESC';
  //  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
  //    return 'by clicking on a backdrop';
  //  } else {
  //    return `with: ${reason}`;
  //  }
  //}

  //async openPageAfterExaminerLogin() {

  //  if (this.Code == '') {
  //    this.toastr.error("Please Enter Examiner Code")
  //    return
  //  }
  //  if (this.VerifyCode != this.Code) {
  //    this.toastr.error("Wrong Examiner Code")
  //    return
  //  }


  //  if (this.VerifyCode == this.Code) {
  //    this.CloseModalPopup(true)
  //    this.routers.navigate(['Ititheorymarks'], {
  //      queryParams: { id: this.AppointExaminerID }
  //    });
  //  }

  //}

  async GenerateAndViewPdf(ExaminerID: number) {
    try {
      debugger;
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.searchRequest.ExaminerID = this.AppointedExaminerList[0].ExaminerID;
      this.searchRequest.Status = 0;
      this.searchRequest.SSOID = this.ssoLoginDataModel.SSOID;
      this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
      this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
      this.searchRequest.RoleID = this.ssoLoginDataModel.RoleID;
      await this.itiExaminerService.Iti_RemunerationGenerateAndViewPdf(this.searchRequest)
        .then((response: any) => {

          const contentType = response?.headers.get('Content-Type');
          //
          if (contentType === 'application/pdf') {//1.
            // Extract filename from header
            const contentDisposition = response?.headers.get('Content-Disposition');
            let fileName = 'Remuneration.pdf';
            if (contentDisposition) {
              const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
              if (match && match[1]) {
                fileName = match[1].replace(/['"]/g, '');
              }
            }
            // Download PDF
            const blob = response?.body as Blob;
            const url = window.URL.createObjectURL(blob);

            // Bypass Angular sanitization safely
            this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
            //show
            this.showPdfModal = true;
          } else if (contentType?.includes('text/plain')) {//2.
            // Handle plain text (like errors or "No data")
            const reader = new FileReader();
            reader.onload = () => {
              //load text
              const message = reader.result as string;
              this.toastr.error(message);
            };
            //read text
            reader.readAsText(response?.body as Blob);
          } else {
            //
            this.toastr.error('Unexpected content type received.');
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }


  ClosePopupAndGenerateAndViewPdf() {
    this.showPdfModal = false;
    this.searchRequest.ExaminerID = 0;
    this.searchRequest.Status = 0;
    if (this.pdfUrl) {
      window.URL.revokeObjectURL(this.pdfUrl as string);
      this.pdfUrl = null;
    }
  }

  async UpdateToApprove(AppointExaminerID: number) {
    debugger;
    try {
      this.isSubmitted = true;
      /*this.RenumerationExaminerRequest.RoleID = this.sSOLoginDataModel.RoleID;*/
      this.searchRequest.RoleID = this.ssoLoginDataModel.RoleID;
      this.searchRequest.ExaminerID = AppointExaminerID;
      await this.itiExaminerService.UpdateToApprove(this.searchRequest)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            this.ClosePopupAndGenerateAndViewPdf();
            await this.GetItiAppointExaminerDetails();
            //this.forwardflag = true;
            this.toastr.success(data.Message);
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

}
