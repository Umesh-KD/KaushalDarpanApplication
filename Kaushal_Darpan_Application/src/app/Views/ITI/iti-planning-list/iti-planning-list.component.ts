  import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItiVerificationModel } from '../../../Models/ItiPlanningDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiPlanningComponent } from '../iti-planning/iti-planning.component';
import { ItiCollegesSearchModel } from '../../../Models/CommonMasterDataModel';
import { ActivatedRoute } from '@angular/router';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-iti-planning-list',
  standalone: false,
  templateUrl: './iti-planning-list.component.html',
  styleUrl: './iti-planning-list.component.css'
})
export class ItiPlanningListComponent {

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public InstituteMasterList: any = [];
  public StudentHistoryModelList: any = [];
  public _enumrole = EnumRole
  public CompanyMasterList: any = [];
  public CollegeID: number = 0;
  public InstituteID: number = 0;
  public Collegeid: number = 0;
  public ApprovedStatus: number = 0;

  requestAction = new ItiVerificationModel();

  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public searchrequest = new ItiCollegesSearchModel()

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  formAction!: FormGroup;

  public TodayDate = new Date()

  constructor(private commonMasterService: CommonFunctionService, private campusPostService: ITIsService, private loaderService: LoaderService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private activeroute: ActivatedRoute) {
  }

  async ngOnInit()
  {

    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', [DropdownValidators]],
        txtActionRemarks: ['', Validators.required],
      })


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    const idParam = this.activeroute.snapshot.queryParamMap.get('id');
    this.InstituteID = Number(idParam);
    if (!idParam || isNaN(this.InstituteID)) {
      this.InstituteID = 0;
    }
    if (this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || this.sSOLoginDataModel.RoleID == EnumRole.Principal_NCVT) {
      this.CollegeID = this.InstituteID

    } else {
      this.ApprovedStatus=0
    }



    await this.GetIti()
    await this.btn_SearchClick();
  }

  get FormAction() { return this.formAction.controls; }
 
  async btn_SearchClick() {
    try {
    
      this.loaderService.requestStarted();
      await this.campusPostService.GetPlanningList(this.CollegeID, this.ApprovedStatus)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusValidationListData = data['Data'];

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

  async ViewWorkflow(CollegeID:number=0) {
    try {
      this.loaderService.requestStarted();
      await this.campusPostService.ViewWorkflow(CollegeID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentHistoryModelList = data['Data'];

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



  async GetIti() {
    try {
/*      this.searchrequest.ManagementTypeID=0*/
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('PrivateITICollege')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CompanyMasterList = data['Data'];

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


  async btn_Clear() {
    this.requestAction.InstituteID = 0;
    this.requestAction.Status = 0;
    this.requestAction.Remarks = '';
    this.CollegeID = 0;
    this.ApprovedStatus = 0;

  }
  async ViewHistory(content: any, ID: number) {

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //this.requestAction.Action = "0";
    //this.requestAction.ActionRemarks = "";
    await this.ViewWorkflow(ID)
  }
  async ViewandUpdate(content: any, PostID: number) {
    this.requestAction.Status = 0
    this.requestAction.Remarks = ''
    this.requestAction.InstituteID = PostID
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
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
  CloseModalPopup() {
    this.modalService.dismissAll();
  }
  async SaveData_ApprovedCampus() {
    
    this.isSubmitted = true;
    this.nonApproveValidator();
    if (this.formAction.invalid) {
      return
    }
    this.requestAction.UserID = this.sSOLoginDataModel.UserID;

    //Show Loading
    this.loaderService.requestStarted();
    console.log("this.requestAction", this.requestAction)
    try {
      await this.campusPostService.SaveItiworkflow(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.btn_SearchClick();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  nonApproveValidator()
  {
    if (this.requestAction.Status != 4)//required when reject
    {
      this.formAction.controls['txtActionRemarks'].clearValidators();
    }
    else
    {
      this.formAction.controls['txtActionRemarks'].setValidators(Validators.required)
    }
    this.formAction.controls['txtActionRemarks'].updateValueAndValidity();

  }

}
