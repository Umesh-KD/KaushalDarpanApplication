import { Component, OnInit } from '@angular/core';
import { CompanyMasterSearchModel, CompanyMaster_Action, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SSOIDDetailRequestModel } from '../../Models/CampusPostDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompanyMasterComponent } from '../CompanyMaster/company-master/company-master.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumMessageType, EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { ApplicationMessageDataModel, SmsDataModel } from '../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';

import { CampusPostService } from '../../Services/CampusPost/campus-post.service';

@Component({
    selector: 'app-company-validation',
    templateUrl: './company-validation.component.html',
    styleUrls: ['./company-validation.component.css'],
    standalone: false
})

export class CompanyValidationComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CompanyMasterList: ICompanyMasterDataModel[] = [];
  public CompanyTrailList:[]=[];
  public HrTrailList: [] = [];
  public CompanySMSData: any = [];
  public getSSOIDDetailData: any[] = [];
  public SmsDataModel = new SmsDataModel();
  public Table_SearchText: string = "";
  public searchRequest = new CompanyMasterSearchModel();
  public messageModel = new ApplicationMessageDataModel()
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public Name: string = "";
  requestAction = new CompanyMaster_Action();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
    _EnumRole = EnumRole
    
  formAction!: FormGroup;
  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private campusPostService: CampusPostService,
    private loaderService: LoaderService, private smsMailService: SMSMailService) {

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

  //async GetAllData() {
  //  try {
  //    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
  //    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
  //    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.loaderService.requestStarted();
  //    await this.companyMasterService.GetAllData(this.searchRequest).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.CompanyMasterList = data.Data;
  //      console.log(this.CompanyMasterList, "CompanyMasterList")
  //    }, (error: any) => console.error(error))
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

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
    this.searchRequest.Name = '';
    this.searchRequest.Status = '';
    this.requestAction.RoleID = 0;
    this.requestAction.ID = 0;
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
    this.ApprovedStatus = "0";
    await this.GetAllData();
  }

  async CompanyDeactivateAction(content: any, ID: number) {
    this.requestAction.ID = ID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
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
    await this.GetCompanySMSDataByID(ID);
  }

  async openModal(content: any, CompanyID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetCampusHr_Trail(CompanyID)
  }
  
  async GetCampusHr_Trail(CompanyID:number){
    debugger
    try {
      this.loaderService.requestStarted();
      await this.companyMasterService.GetCampusHr_Trail(CompanyID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CompanyTrailList = data.Data.Table;
        this.HrTrailList=data.Data.Table1;
        console.log(this.CompanyTrailList)
        console.log(this.HrTrailList)
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

  async ViewandUpdate(content: any, ID: number) {

    const initialState = {
      ID: ID,
      Type: "Admin",
    };
    this.modalReference = this.modalService.open(CompanyMasterComponent, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
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

  async GetCompanySMSDataByID(ID: number) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.SmsDataModel.CompanyID = ID;
      this.SmsDataModel.Flag = "_getCompanySMSDataByID";
      await this.campusPostService.GetCampusSMSDataByID(this.SmsDataModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CompanySMSData = data['Data'];
          console.log(this.CompanySMSData, "CampusSMSData");
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



  async SaveData_ApprovedCampus() {
    this.isSubmitted = true;
    if (this.formAction.invalid) {
      return
    }
    debugger
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestAction.ActionBy = this.sSOLoginDataModel.UserID;
    this.requestAction.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestAction.RoleID = this.sSOLoginDataModel.RoleID;
    //Show Loading
    debugger
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
            if (this.requestAction.Action == "Approved") {
              await this.SendApplicationMessage();
            }            
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



  async SendApplicationMessage() {
    debugger
    try {
      this.loaderService.requestStarted();
      let request = new SSOIDDetailRequestModel();
      request.SSOID = this.CompanySMSData[0].SSOID;
      request.Action = "GetTPODetailBySSOID";
      // let SSOID = this.sSOLoginDataModel.SSOID;
      // let action = "GetTPODetailBySSOID";
      await this.commonMasterService.GetSSOIDDetailData(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.getSSOIDDetailData = data['Data'];
          console.log(this.getSSOIDDetailData, "getSSOIDDetailData");
          if (data.State == EnumStatus.Success) {
            console.log('Data load successfully', data);
          } else {
            console.log('Something went wrong', data);
          }
        }, (error: any) => console.error(error));


      // const personalMail = this.getSSOIDDetailData[0].Mailpersonal;
      // this.messageModel.Email = (personalMail && personalMail.trim() !== '') 
      //   ? personalMail 
      //   : this.getSSOIDDetailData[0].Officialmail;

      this.messageModel.MobileNo = (this.getSSOIDDetailData[0].MobileNo && this.getSSOIDDetailData[0].MobileNo.trim() !== '')
      ?this.getSSOIDDetailData[0].MobileNo
      :this.getSSOIDDetailData[0].TelephoneNumber;

      // this.messageModel.MobileNo = this.getSSOIDDetailData[0].MobileNo;
      // department
      //if (this.DepartmentID == EnumDepartment.BTER) {
      //  this.messageModel.MessageType = EnumMessageType.Bter_FormFinalSubmit;
      //}
      //else if (this.DepartmentID == EnumDepartment.ITI) {
      //  this.messageModel.MessageType = EnumMessageType.FormFinalSubmitITI;
      //}
      /*this.messageModel.ApplicationNo = this.ApplicationNo.toString();*/
      this.messageModel.CampusID = this.CompanySMSData[0].CompanyID;
      this.messageModel.ApplicantName = this.getSSOIDDetailData[0].SSOID;
      this.messageModel.ReferenceID = this.CompanySMSData[0].ReferenceID;
      //this.messageModel.MobileNo = '8334874706';
      //this.messageModel.ApplicantName = 'Divya Sharma';
      this.messageModel.MessageType = EnumMessageType.Bter_ComapnyHRApprove;

      const now = new Date();

      this.messageModel.ActionDate =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
      await this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            console.log('Message sent successfully', data);
          } else {
            console.log('Something went wrong', data);
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



}
