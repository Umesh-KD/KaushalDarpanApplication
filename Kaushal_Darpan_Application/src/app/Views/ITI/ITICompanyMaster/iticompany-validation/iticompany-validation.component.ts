import { Component, OnInit } from '@angular/core';
import { IItiCompanyMasterDataModel, ItiCompanyMaster_Action, ItiCompanyMasterSearchModel } from '../../../../Models/ITI/ItiCompanyMasterDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiCompanyMasterService } from '../../../../Services/ITI/ItiCompanyMaster/iticompany-master.service.ts';
import { ItiCompanyMasterComponent } from '../iticompany-master/iticompany-master.component';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
    selector: 'app-iticompany-validation',
    templateUrl: './iticompany-validation.component.html',
    styleUrls: ['./iticompany-validation.component.css'],
    standalone: false
})

export class ItiCompanyValidationComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CompanyMasterList: IItiCompanyMasterDataModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new ItiCompanyMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public Name: string = "";
  requestAction = new ItiCompanyMaster_Action();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  formAction!: FormGroup;
  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: ItiCompanyMasterService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private loaderService: LoaderService) {

  }

  async ngOnInit() {
    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', Validators.required],
        txtActionRemarks: ['', Validators.required],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData();
  }
  get FormAction() { return this.formAction.controls; }

  

  async GetAllData() {
    ;
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.loaderService.requestStarted();
      await this.companyMasterService.CompanyValidationList(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CompanyMasterList = data.Data;
        console.log(this.CompanyMasterList)
      }, (error: any) => console.error(error))
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

  // get all data
  async ClearSearchData() {
    // this.searchRequest.Name = '';
    // this.requestAction.RoleID = 0;
    // this.requestAction.ID = 0;
    // this.requestAction.Action = "0";
    // this.requestAction.ActionRemarks = "";
    // this.ApprovedStatus = "0";
    // this.CompanyMasterList = [];
    this.searchRequest=new ItiCompanyMasterSearchModel();
    await this.GetAllData()
  }

  async CompanyOnAction(content: any, ID: number) {
    this.requestAction.ID = ID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
  }
  async ViewandUpdate(content: any, ID: number) {

    const initialState = {
      ID: ID,
      Type: "Admin",
    };
    this.modalReference = this.modalService.open(ItiCompanyMasterComponent, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
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
      await this.companyMasterService.Save_CompanyValidation_NodalAction(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.GetAllData();
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
