import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumApplicationFromStatus, EnumDepartment, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../Common/GlobalConstants';
import { ItiApplicationSearchmodel, PreviewApplicationModel } from '../../../Models/ItiApplicationPreviewDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiApplicationFormService } from '../../../Services/ItiApplicationForm/iti-application-form.service';

@Component({
    selector: 'app-verify-student-application',
    templateUrl: './verify-student-application.component.html',
    styleUrls: ['./verify-student-application.component.css'],
    standalone: false
})
export class VerifyStudentApplicationComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public ApplicationID: number = 0;
  public StudentData: any = [];

  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new PreviewApplicationModel()
  Eligible8thTradesID:number=0
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public _GlobalConstants: any = GlobalConstants;

  public PassingYearList: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public searchrequest = new ItiApplicationSearchmodel()
  public Status: number = 0
  public UserID: number = 0
  closeResult: string | undefined;
  public ShowPaymentButton: boolean = false;
  public IsTermAndCondition: boolean = false;
  public IsShowIncompleteData: boolean = false;
  public ShowfinalLButton: boolean = true; 

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private Swal2: SweetAlert2,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
  ) { }

  async ngOnInit() {
    this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('ApplicationID') ?? 0)
    if (this.ApplicationID > 0)
    {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.request.ApplicationID = this.ApplicationID;
      this.GetById()
    } 

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("SSOLoginDataModle", this.SSOLoginDataModel);
  }

  async GetById() {
    this.isSubmitted = false;
    // this.searchrequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchrequest.DepartmentID = 2
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetApplicationPreviewbyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.request.ApplicationID = data['Data']['ApplicationID']
          if (data['Data'] != null) {
            this.request = data['Data']
            this.request.OptionalViewDatas = data['Data']['OptionsViewData']
            
            this.request.QualificationViewDetails = data.Data.QualificationViewDetails
            console.log("this.request", this.request)
            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0'); 
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;

            if (this.request.PendingDataModel?.length > 0) { this.IsShowIncompleteData = true }
            else { this.IsShowIncompleteData = false }
          }

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SavePreview(content: any, ApplicationID: number) {
    ////this.IsShowViewStudent = true;
    this.request.ApplicationID = ApplicationID
    this.GetById();
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    /*await this.GetById();*/
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

  async CloseModel() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
    }, 200);
  }
}
