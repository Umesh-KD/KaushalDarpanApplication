import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ItiExaminerService } from '../../../../../Services/ItiExaminer/iti-examiner.service';
import { ITI_AppointExaminerDetailsModel } from '../../../../../Models/ITI/ITI_ExaminerDashboard';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-iti-appointed-examiner-details',
  templateUrl: './iti-appointed-examiner-details.component.html',
  styleUrl: './iti-appointed-examiner-details.component.css',
  standalone: false
})
export class ItiAppointedExaminerDetailsComponent {
  public ExaminerID: number = 0
  public Code: string = ''
  public ExamTypeID: number = 0
  public VerifyCode: string = ''
  public RevertRemark: string = ''
  public AppointExaminerID: number = 0
  public selectedrow:any
  public searchRequest = new ITI_AppointExaminerDetailsModel()
  public ssoLoginDataModel = new SSOLoginDataModel()
  public AppointedExaminerList: any = []
  @ViewChild('MyModel_ExaminerCodeLogin') MyModel_ExaminerCodeLogin: ElementRef | any;
  public closeResult: string | undefined;
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private itiExaminerService: ItiExaminerService,
    private modalService: NgbModal,
    private routers: Router,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.GoToReportEntryPage()
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
    try {
      this.loaderService.requestStarted();
      this.searchRequest.ExaminerID = this.ExaminerID
      this.searchRequest.Status = this.ExamTypeID
      await this.itiExaminerService.GetItiAppointExaminerDetails(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AppointedExaminerList = data.Data
          debugger
          this.RevertRemark = data['Data'][0]['RevertRemark']
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

  OpenModalPopup(content: any, AppointExaminerID: number, ExaminerCode: string,row:any) {
    debugger
    this.Code = ''
    this.AppointExaminerID = 0
    this.VerifyCode = ''
    this.selectedrow = row

    this.modalService.open(content, { size: 'sm', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.AppointExaminerID = AppointExaminerID
    this.VerifyCode = ExaminerCode

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
      debugger
  
      sessionStorage.setItem('SemesterID', this.selectedrow.SemesterID.toString());
      sessionStorage.setItem('SubjectName', this.selectedrow.SubjectName);

      sessionStorage.setItem('ExaminerID', this.selectedrow.ExaminerID);
      sessionStorage.setItem('StreamID', this.selectedrow.streamID.toString());

      this.routers.navigate(['Ititheorymarks'])
    

    }

   

  }

  GoToReportEntryPage() {
    sessionStorage.setItem('CenterID', "0");
    sessionStorage.setItem('SemesterID', "0");
    sessionStorage.setItem('SubjectName', "0");

    sessionStorage.setItem('ExaminerID', "0");
    sessionStorage.setItem('StreamID', "0");

  }

}
