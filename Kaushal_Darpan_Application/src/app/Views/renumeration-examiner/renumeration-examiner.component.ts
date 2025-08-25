import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AppsettingService } from '../../Common/appsetting.service';
import { EnumRenumerationExaminer, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { RenumerationExaminerRequestModel, RenumerationExaminerModel, RenumerationExaminerPDFModel, TrackStatusDataModel } from '../../Models/RenumerationExaminerModel';
import { RenumerationExaminerService } from '../../Services/renumeration-examiner/renumeration-examiner.service';
import { ReportService } from '../../Services/Report/report.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LoaderService } from '../../Services/Loader/loader.service';

@Component({
  selector: 'app-renumeration-examiner',
  standalone: false,
  templateUrl: './renumeration-examiner.component.html',
  styleUrl: './renumeration-examiner.component.css'
})
export class RenumerationExaminerComponent implements OnInit {
  public Message: any = [];
  public State: number = -1;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";

  public RenumerationExaminerRequest = new RenumerationExaminerRequestModel();
  public RenumerationExaminerList: RenumerationExaminerModel[] = [];
  public TrackstatusList: TrackStatusDataModel[] = [];
  public RenumerationExaminerPDF = new RenumerationExaminerPDFModel();

  public pdfUrl: SafeResourceUrl | null = null;
  public showPdfModal = false;

  public _GlobalConstants = GlobalConstants;
  public _EnumRenumerationExaminer = EnumRenumerationExaminer;
  closeResult: string | undefined;

  constructor(private commonMasterService: CommonFunctionService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRouter: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private renumerationExaminerService: RenumerationExaminerService,
    private reportService: ReportService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer,
    private loaderService: LoaderService,
  ) {
  }

  async ngOnInit() {

    // login session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetAllData();
  }

  async TrackExaminerData(content: any) {
    //
    ////this.IsShowViewStudent = true;
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetTrackStatusData();
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

  async CloseViewAccountsDetails() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.isSubmitted = false;
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }


  async GetTrackStatusData() {
    //
    try {
      this.RenumerationExaminerRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.RenumerationExaminerRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.RenumerationExaminerRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RenumerationExaminerRequest.RoleID = this.sSOLoginDataModel.RoleID;
      this.RenumerationExaminerRequest.SSOID = this.sSOLoginDataModel.SSOID;
      //call
      await this.renumerationExaminerService.GetTrackStatusData(this.RenumerationExaminerRequest)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            this.TrackstatusList = data.Data;
            console.log(this.TrackstatusList,"Trackdata")
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async GetAllData() {
    try {
      this.isSubmitted = true;
      this.RenumerationExaminerRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.RenumerationExaminerRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.RenumerationExaminerRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.RenumerationExaminerRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RenumerationExaminerRequest.RoleID = this.sSOLoginDataModel.RoleID;
      //call
      await this.renumerationExaminerService.GetAllData(this.RenumerationExaminerRequest)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            this.RenumerationExaminerList = data.Data;
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async GenerateAndViewPdf(ExaminerID: number) {
    try {
      this.isSubmitted = true;
      const selected = this.RenumerationExaminerList.find(x => x.ExaminerID = ExaminerID);
      this.RenumerationExaminerRequest.ExaminerID = selected?.ExaminerID ?? 0;
      this.RenumerationExaminerRequest.GroupCodeID = selected?.GroupCodeID ?? 0;
      //call
      await this.reportService.GenerateAndViewPdf(this.RenumerationExaminerRequest)
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
    this.RenumerationExaminerRequest.ExaminerID = 0;
    this.RenumerationExaminerRequest.GroupCodeID = 0;
    if (this.pdfUrl) {
      window.URL.revokeObjectURL(this.pdfUrl as string);
      this.pdfUrl = null;
    }
  }

  async SavePDFSubmitAndForwardToJD() {
    try {
      this.isSubmitted = true;
      this.RenumerationExaminerRequest.RoleID = this.sSOLoginDataModel.RoleID;
      await this.reportService.SavePDFSubmitAndForwardToJD(this.RenumerationExaminerRequest)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            this.ClosePopupAndGenerateAndViewPdf();
            await this.GetAllData();
            this.toastr.success("Save successfully.");
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) { 
      console.log(ex);  
    }
  }
}
