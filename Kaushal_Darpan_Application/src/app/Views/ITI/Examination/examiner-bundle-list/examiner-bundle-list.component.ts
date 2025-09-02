import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiExaminerService } from '../../../../Services/ItiExaminer/iti-examiner.service';
import { ITI_AppointExaminerDetailsModel } from '../../../../Models/ITI/ITI_ExaminerDashboard';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ITITheoryMarksDataModels, ITITheoryMarksSearchModel } from '../../../../Models/ITITheoryMarksDataModel';
import { ItiTheoryMarksService } from '../../../../Services/ITI/ItiTheoryMarks/Iti-theory-marks.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-examiner-bundle-list',
  standalone: false,
  templateUrl: './examiner-bundle-list.component.html',
  styleUrl: './examiner-bundle-list.component.css'
})
export class ExaminerBundleListComponent {
  public ExaminerID: number = 0
  public Code: string = ''
  public ExamTypeID: number = 0
  public VerifyCode: string = ''
  public AppointExaminerID: number = 0
  public searchRequest = new ITI_AppointExaminerDetailsModel()
  public searchRequest1 = new ITITheoryMarksSearchModel()
  public ssoLoginDataModel = new SSOLoginDataModel()
  public AppointedExaminerList: any = []
  @ViewChild('modal_ViewApplication') modal_ViewApplication: ElementRef | any;
  public closeResult: string | undefined;
  public TheoryMarksDetailList: ITITheoryMarksDataModels[] = []
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  constructor(
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private itiExaminerService: ItiExaminerService,
    private modalService: NgbModal,
    private routers: Router,
    private toastr: ToastrService,
    private TheoryMarksService: ItiTheoryMarksService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.ssoLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("this.ssoLoginDataModel", this.ssoLoginDataModel);
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
      await this.itiExaminerService.GetItiExaminerBundleDetails(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AppointedExaminerList = data.Data
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

  OpenModalPopup(content: any, AppointExaminerID: number, ExaminerCode: string) {
    debugger
    this.Code = ''
    this.AppointExaminerID = 0
    this.VerifyCode = ''
    this.modalService.open(content, { size: 'xl', backdrop: 'static', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    this.AppointExaminerID = AppointExaminerID
    this.VerifyCode = ExaminerCode
    this.GetTheoryMarksDetailList()
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

  //
  async GetTheoryMarksDetailList() {
    try {
      //session
      this.searchRequest1.EndTermID = this.ssoLoginDataModel.EndTermID;
      this.searchRequest1.Eng_NonEng = this.ssoLoginDataModel.Eng_NonEng;
      this.searchRequest1.DepartmentID = this.ssoLoginDataModel.DepartmentID;
      /*      this.searchRequest.IsConfirmed = this.IsConfirmed = true;*/
      this.searchRequest1.AppointExaminerID = this.AppointExaminerID

      this.loaderService.requestStarted();
      await this.TheoryMarksService.GetTheoryMarksDetailList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TheoryMarksDetailList = data['Data'];

          console.log(this.TheoryMarksDetailList)

         


          //table feature load

          //end table feature load
        }, (error: any) => console.error(error));
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


  async RevertBundle(AppointExaminerID: number) {

    this.Swal2.ConfirmationWithRemark("Are you sure want to Revert the Final Submission of this bundle?", async (result: any) => {
      //confirmed
      try {
        let obj = {
          AppointExaminerID: AppointExaminerID,
          Remark: result
        }
        // Call service to save student exam status
        await this.TheoryMarksService.RevertBundle(obj)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == EnumStatus.Success) {
              await this.GetItiAppointExaminerDetails();
              this.toastr.success(this.Message)
            }
      

          })
      } catch (ex) {
        console.log(ex);
        console.log(this.ErrorMessage);
      }
    });
  }


}
