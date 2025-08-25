import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ItiExaminerService } from '../../../Services/ItiExaminer/iti-examiner.service';
import { ITI_AppointExaminerDetailsModel } from '../../../Models/ITI/ITI_ExaminerDashboard';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ReportService } from '../../../Services/Report/report.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ITIInvigilatorService } from '../../../Services/ITI/ITIInvigilator/itiinvigilator.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../Common/appsetting.service';
@Component({
  selector: 'app-iti-admin-remunerationInvigilator-details',
  templateUrl: './iti-admin-remunerationInvigilator-details.component.html',
  styleUrl: './iti-admin-remunerationInvigilator-details.component.css',
  standalone: false
})
export class ItiAdminremunerationInvigilatorDetailsComponent {
  public ExaminerID: number = 0
  public Code: string = ''
  public ExamTypeID: number = 0
  public VerifyCode: string = ''
  public AppointExaminerID:number=0
  public searchRequest = new ITI_AppointExaminerDetailsModel()
  public ssoLoginDataModel = new SSOLoginDataModel()
  public DataList: any = [];
  public InvigilatorDetails: any = [];
  @ViewChild('MyModel_ExaminerCodeLogin') MyModel_ExaminerCodeLogin: ElementRef | any;
  public closeResult: string | undefined;
  public isSubmitted: boolean = false;
  public RenumerationExaminerList: any = [];
  public pdfUrl: SafeResourceUrl | null = null;
  //public showPdfModal = false;
  public Remark: string = '';
  RemunerationID: number = 0;

  public RemarkbyAdmin: string = '';

  
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private itiExaminerService: ItiExaminerService,
    private ITIInvigilatorService: ITIInvigilatorService,
    private modalService: NgbModal,
    private routers: Router,
    private toastr: ToastrService,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
   private appsettingConfig: AppsettingService,
  ) {}

  async ngOnInit() {
    debugger;
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("this.ssoLoginDataModel",this.ssoLoginDataModel);
    this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID
    
    //this.route.paramMap.subscribe(params => {
    //  this.ExaminerID = Number(params.get('id'));
    //  this.ExamTypeID = Number(params.get('status'));
    //  console.log('URL Param:', this.ExaminerID);
    //  console.log('Status Param:', this.ExamTypeID);
    //});

    this.GetItiRemunerationInvigilatorAdminDetails();
  }

  async GetItiRemunerationInvigilatorAdminDetails() {
    debugger;
    try {
      this.loaderService.requestStarted();


      let obj = {
        SSOID: this.ssoLoginDataModel.SSOID,
        EndTermID: this.ssoLoginDataModel.EndTermID,
        Eng_NonEng: this.ssoLoginDataModel.Eng_NonEng,
        DepartmentID: this.ssoLoginDataModel.DepartmentID,
        RoleID: this.ssoLoginDataModel.RoleID,
        Userid: this.ssoLoginDataModel.UserID,
      };

      //this.searchRequest.ExaminerID = this.ExaminerID
      //this.searchRequest.Status = this.ExamTypeID
      //this.searchRequest.SSOID = this.ssoLoginDataModel.SSOID;
      //this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
      //this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
      //this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
      //this.searchRequest.RoleID = this.ssoLoginDataModel.RoleID;

      await this.ITIInvigilatorService.GetItiRemunerationInvigilatorAdminDetails(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          this.DataList = data.Data
          console.log(this.DataList)
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

  OpenModalPopup(content: any, RemunerationID: number, ExaminerCode: string) {
    debugger
    this.Code = ''
    this.RemunerationID = 0
    this.VerifyCode=''
    this.modalService.open(content, { size: 'sm', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.RemunerationID = RemunerationID
    //this.VerifyCode = ExaminerCode

  }

  OpenModalPopup2(content: any, RemunerationID: number, ExaminerCode: string) {
    debugger
    this.Code = ''
    this.RemunerationID = 0
    this.VerifyCode = ''
    this.modalService.open(content, { size: 'lg', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.RemunerationID = RemunerationID
    this.GetinvigilatorDetailbyRemunerationID();
    //this.VerifyCode = ExaminerCode

  }
  CloseModalPopup(isNavigate: boolean) {
    this.modalService.dismissAll();
    //if (isNavigate) {
    //  this.routers.navigate(['/dashboard']);
    //}
  }
 
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async openPageAfterExaminerLogin() {

    if (this.Code == '') {
      this.toastr.error("Please Enter Examiner Code")
      return
    }
    if (this.VerifyCode != this.Code) {
      this.toastr.error("Wrong Examiner Code")
      return
    }


    if (this.VerifyCode == this.Code) {
      this.CloseModalPopup(true)
      this.routers.navigate(['Ititheorymarks'], {
        queryParams: { id: this.AppointExaminerID }
      });
    }

  }

  //async GenerateAndViewPdf(ExaminerID: number) {
  //  try {
  //    debugger;
  //    this.isSubmitted = true;
  //    this.loaderService.requestStarted();
  //    this.searchRequest.ExaminerID = this.DataList[0].ExaminerID;
  //    this.searchRequest.Status = 0;
  //    this.searchRequest.SSOID = this.ssoLoginDataModel.SSOID;
  //    this.searchRequest.EndTermID = this.ssoLoginDataModel.EndTermID;
  //    this.searchRequest.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
  //    this.searchRequest.DepartmentID = this.ssoLoginDataModel.DepartmentID;
  //    this.searchRequest.RoleID = this.ssoLoginDataModel.RoleID;
  //    await this.itiExaminerService.Iti_RemunerationGenerateAndViewPdf(this.searchRequest)
  //      .then((response: any) => {

  //        const contentType = response?.headers.get('Content-Type');
  //        //
  //        if (contentType === 'application/pdf') {//1.
  //          // Extract filename from header
  //          const contentDisposition = response?.headers.get('Content-Disposition');
  //          let fileName = 'Remuneration.pdf';
  //          if (contentDisposition) {
  //            const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
  //            if (match && match[1]) {
  //              fileName = match[1].replace(/['"]/g, '');
  //            }
  //          }
  //          // Download PDF
  //          const blob = response?.body as Blob;
  //          const url = window.URL.createObjectURL(blob);

  //          // Bypass Angular sanitization safely
  //          this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  //          //show
  //          this.showPdfModal = true;
  //        } else if (contentType?.includes('text/plain')) {//2.
  //          // Handle plain text (like errors or "No data")
  //          const reader = new FileReader();
  //          reader.onload = () => {
  //            //load text
  //            const message = reader.result as string;
  //            this.toastr.error(message);
  //          };
  //          //read text
  //          reader.readAsText(response?.body as Blob);
  //        } else {
  //          //
  //          this.toastr.error('Unexpected content type received.');
  //        }
  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //}


  ClosePopupAndGenerateAndViewPdf() {
    this.showPdfModal = false;
    this.searchRequest.ExaminerID = 0;
    this.searchRequest.Status = 0;
    if (this.pdfUrl) {
      window.URL.revokeObjectURL(this.pdfUrl as string);
      this.pdfUrl = null;
    }
  }

  async UpdateToApprove(RemunerationID :number) {
    debugger;
    try {
      this.isSubmitted = true;


      let obj2 = {
        SSOID: this.ssoLoginDataModel.SSOID,
        EndTermID: this.ssoLoginDataModel.EndTermID,
        Eng_NonEng: this.ssoLoginDataModel.Eng_NonEng,
        DepartmentID: this.ssoLoginDataModel.DepartmentID,
        RoleID: this.ssoLoginDataModel.RoleID,
        Userid: this.ssoLoginDataModel.UserID,
        RemunerationPKID : RemunerationID ,
        Remarks: this.RemarkbyAdmin
      };

       
      console.log(this.searchRequest);
    
      await this.ITIInvigilatorService.UpdateToApprove(obj2)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {


            //wait this.GetItiAppointExaminerDetails();
            //this.forwardflag = true;
            this.toastr.success(data.Message);
            setTimeout(() => {
              //window.location.reload();
              this.routers.navigate(['/iti-remunerationInvigilatorApproved-list']);
              this.CloseModalPopup(true);
            }, 1200);

          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }



  async openPdfModal(url: string): Promise<void> {
    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }



  async GetinvigilatorDetailbyRemunerationID() {
    try {
      this.loaderService.requestStarted();

     

      await this.ITIInvigilatorService.GetinvigilatorDetailbyRemunerationID(this.RemunerationID)
        .then((data: any) => {
          if (data.State == EnumStatus.Success) {
            if (data.Data.length > 0) {
              this.InvigilatorDetails = data.Data;
            }

          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.error(data.Message)
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


}
