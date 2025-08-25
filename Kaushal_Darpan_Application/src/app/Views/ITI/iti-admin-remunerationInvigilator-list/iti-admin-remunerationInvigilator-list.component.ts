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
import { AppsettingService } from '../../../Common/appsetting.service';
@Component({
  selector: 'app-iti-admin-remunerationInvigilator-list',
  templateUrl: './iti-admin-remunerationInvigilator-list.component.html',
  styleUrl: './iti-admin-remunerationInvigilator-list.component.css',
  standalone: false
})
export class ItiAdminremunerationInvigilatorlistComponent {
  public ExaminerID: number = 0
  public Code: string = ''
  public ExamTypeID: number = 0
  public VerifyCode: string = ''
  public AppointExaminerID:number=0
  public searchRequest = new ITI_AppointExaminerDetailsModel()
  public ssoLoginDataModel = new SSOLoginDataModel()
  public AppointedExaminerList: any = []
  public DataList: any = []
  @ViewChild('MyModel_ExaminerCodeLogin') MyModel_ExaminerCodeLogin: ElementRef | any;
  public closeResult: string | undefined;
  public isSubmitted: boolean = false;
  public RenumerationExaminerList: any = [];
  public InvigilatorDetails: any = [];
  public pdfUrl: SafeResourceUrl | null = null;
  public showPdfModal = false;
  public Remark: string = '';
  RemunerationID :number = 0
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private ITIInvigilatorService: ITIInvigilatorService,
    private modalService: NgbModal,
    private routers: Router,
    private toastr: ToastrService,
    private reportService: ReportService,
    private sanitizer: DomSanitizer,
    private appsettingConfig: AppsettingService,
  ) {}

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

    this.GetRemunerationApproveList();
  }



  OpenModalPopup(content: any, AppointExaminerID: number, ExaminerCode: string) {
    debugger
    this.Code = ''
    this.AppointExaminerID = 0
    this.VerifyCode=''
    this.modalService.open(content, { size: 'sm', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.AppointExaminerID = AppointExaminerID
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



  ClosePopupAndGenerateAndViewPdf() {
    this.showPdfModal = false;
    this.searchRequest.ExaminerID = 0;
    this.searchRequest.Status = 0;
    if (this.pdfUrl) {
      window.URL.revokeObjectURL(this.pdfUrl as string);
      this.pdfUrl = null;
    }
  }


  async GetRemunerationApproveList() {
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

      await this.ITIInvigilatorService.GetRemunerationApproveList(obj)
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
