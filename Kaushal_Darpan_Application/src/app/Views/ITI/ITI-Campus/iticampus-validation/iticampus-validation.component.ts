import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ItiCampusPostMaster_Action, ItiCampusPostMaster_EligibilityCriteriaModel, ItiCampusPostMasterModel } from '../../../../Models/ITI/ITICampusPostDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiCampusPostService } from '../../../../Services/ITI/ITICampusPost/iticampus-post.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCampusPostComponent } from '../iticampus-post/iticampus-post.component';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
    selector: 'app-iticampus-validation',
    templateUrl: './iticampus-validation.component.html',
    styleUrls: ['./iticampus-validation.component.css'],
    standalone: false
})
export class ItiCampusValidationComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public InstituteMasterList: any = [];
  public CompanyMasterList: any = [];
  public CompanyID: number = 0;
  public InstituteID: number = 0;
  public ApprovedStatus: string = "0";

  request = new ItiCampusPostMasterModel();
  requestAction = new ItiCampusPostMaster_Action();
  requestEligibilityCriteria = new ItiCampusPostMaster_EligibilityCriteriaModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  formAction!: FormGroup;

  public TodayDate = new Date()

  constructor(private commonMasterService: CommonFunctionService, private campusPostService: ItiCampusPostService, private loaderService: LoaderService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService) {
  }

  async ngOnInit() {
    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', Validators.required],
        txtActionRemarks: ['', Validators.required],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMasterData();
    await this.btn_SearchClick();
  }
  get FormAction() { return this.formAction.controls; }
  async GetMasterData() {
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.ITIPlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
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

  async btn_SearchClick() {
    
    try {
      this.loaderService.requestStarted();
      await this.campusPostService.CampusValidationList(this.CompanyID, this.InstituteID, this.ApprovedStatus, this.sSOLoginDataModel.DepartmentID)
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

  

  async btn_Clear() {
    this.requestAction.PostID = 0;
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
    this.CompanyID = 0;
    this.InstituteID = 0;
    this.ApprovedStatus = "0";
    this.CampusValidationListData = [];
    await this.btn_SearchClick();
  }
  async CampusOnPostAction(content: any, PostID: number) {
    this.requestAction.PostID = PostID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
  }
  async ViewandUpdate(content: any, PostID: number) {
    ;
    const initialState = {
      PostID: PostID,
      Type: "Admin",
    };
    this.modalReference = this.modalService.open(ItiCampusPostComponent, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    this.modalReference.componentInstance.initialState = initialState;

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

    if (this.formAction.invalid) {
      return
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestAction.ActionBy = this.sSOLoginDataModel.UserID;
    this.requestAction.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.campusPostService.Save_CampusValidation_NodalAction(this.requestAction)
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
}
