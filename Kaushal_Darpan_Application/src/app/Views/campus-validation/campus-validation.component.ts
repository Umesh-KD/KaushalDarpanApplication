import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CampusPostMasterModel, CampusPostMaster_Action, CampusPostMaster_EligibilityCriteriaModel, SSOIDDetailRequestModel } from '../../Models/CampusPostDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CampusPostService } from '../../Services/CampusPost/campus-post.service';
import { CampusPostComponent } from '../campus-post/campus-post.component';
import { EnumStatus } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { ApplicationMessageDataModel } from '../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';

@Component({
    selector: 'app-campus-validation',
    templateUrl: './campus-validation.component.html',
    styleUrls: ['./campus-validation.component.css'],
    standalone: false
})
export class CampusValidationComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public InstituteMasterList: any = [];

  public CompanyMasterList: any = [];
  public CompanyID: number = 0;
  public InstituteID: number = 0;
  public ApprovedStatus: string = "0";
  public CheckStatus: string = "";
  public currentStatus: number = 0;

  public reactiveSuspened:boolean=false;

  public messageModel = new ApplicationMessageDataModel()
  

  request = new CampusPostMasterModel();
  requestAction = new CampusPostMaster_Action();
  requestEligibilityCriteria = new CampusPostMaster_EligibilityCriteriaModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;


  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public getSSOIDDetailData: any[]=[];
  formAction!: FormGroup;
  public flagName: string = "TotalNoOfCampus";
  public TodayDate = new Date();
  public selectedSuspendedPost : any = {};

  constructor(private commonMasterService: CommonFunctionService,private smsMailService: SMSMailService, private campusPostService: CampusPostService, private loaderService: LoaderService,
    private modalService: NgbModal, private route: ActivatedRoute, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService, private toastr: ToastrService) {
  }

  async ngOnInit() {
    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', Validators.required],
        txtActionRemarks: ['', Validators.required],
      })

    this.flagName = this.route.snapshot.queryParamMap.get('flag') ?? 'TotalNoOfCampus';

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.currentStatus = Number(this.route.snapshot.queryParamMap.get("Status") ?? 0);
    await this.GetMasterData();
    await this.btn_SearchClick();
  }


  async openModalCampus(content: any, Post: any) {
    this.selectedSuspendedPost = Post;
    this.requestAction.SuspendDocumnet
    this.request.PostID = Post.PostID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }


  CloseModalPopupCampus() {
    this.modalService.dismissAll();
    //this.request.CampusFromDate = '';
    //this.request.CampusFromTime = '';
    //this.request.CampusToDate = '';
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
        
      await this.commonMasterService.PlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
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

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.CampusValidationListData.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'CampusValidationListData.xlsx');
  }

  async btn_SearchClick() {
    try {
      this.loaderService.requestStarted();
      this.InstituteID = this.sSOLoginDataModel.InstituteID;
      if (this.sSOLoginDataModel.RoleID != 6) {
        this.InstituteID = 0;
      }

     
      await this.campusPostService.CampusValidationList(this.CompanyID, this.InstituteID, this.ApprovedStatus, this.sSOLoginDataModel.DepartmentID, this.flagName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusValidationListData = data['Data'];
          console.log(this.CampusValidationListData,"CampusValidationListData")

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
  }
  async CampusOnPostAction(content: any, row: any) {
    debugger;
    this.requestAction.PostID = row.PostID;
    this.requestAction.CompanyID = row.CompanyID;
    this.requestAction.PostCollegeID = row.PostCollegeID;
    this.CheckStatus = row.Status;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
  }
  async ViewandUpdate(content: any, PostID: number) {
    
    const initialState = {
      PostID: PostID,
      Type: "Admin",
    };
    this.modalReference = this.modalService.open(CampusPostComponent, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
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
    this.selectedSuspendedPost = {};
    this.modalService.dismissAll();
  }
  async SaveData_ApprovedCampus() {
    debugger
    this.isSubmitted = true;
    if (this.formAction.invalid) {
      return
    }

    if (this.requestAction.Action == 'Suspend') {
      if (!this.requestAction.SuspendDocumnet || this.requestAction.SuspendDocumnet.trim() === '') {
        this.toastr.error("Suspend Document is required.");
        return;
      }
    }

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
            this.SendApplicationMessage();
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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();
        console.log(this.selectedSuspendedPost);

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                // if(this.selectedSuspendedPost.Status = 'Suspend'){

                // }
                // else{
                  this.requestAction.Dis_SuspendDoc = data['Data'][0]["Dis_FileName"];
                  this.requestAction.SuspendDocumnet = data['Data'][0]["FileName"];
                // }

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }


    async SendApplicationMessage() {
    debugger
    try {
      this.loaderService.requestStarted();
      let request=new SSOIDDetailRequestModel();
      request.SSOID=this.sSOLoginDataModel.SSOID;
      request.Action="GetTPODetailBySSOID";
      // let SSOID = this.sSOLoginDataModel.SSOID;
      // let action = "GetTPODetailBySSOID";
      await this.commonMasterService.GetSSOIDDetailData(request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.getSSOIDDetailData = data['Data'];
          console.log(this.getSSOIDDetailData,"getSSOIDDetailData");

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

      //this.messageModel.MobileNo = '8955186821';
      // this.messageModel.MobileNo = this.getSSOIDDetailData[0].MobileNo;
      // department
      //if (this.DepartmentID == EnumDepartment.BTER) {
      //  this.messageModel.MessageType = EnumMessageType.Bter_FormFinalSubmit;
      //}
      //else if (this.DepartmentID == EnumDepartment.ITI) {
      //  this.messageModel.MessageType = EnumMessageType.FormFinalSubmitITI;
      //}
      /*this.messageModel.ApplicationNo = this.ApplicationNo.toString();*/
      this.messageModel.ApplicationNo = '21100634';
      this.messageModel.MessageType='OTP';
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

  async UpdateCampusData() {
    debugger
    if (!this.request.CampusFromDate || !this.request.CampusFromTime || !this.request.CampusToDate) {
      this.toastr.warning("Please fill all mandatory (*) fields");
      return;
    }

      
    // if (!this.request.OfficerDocumnet || this.request.OfficerDocumnet.trim() === '') {
    //   this.toastr.error("Officer Document is required.");
    //   return;
    // }
    

    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {

      this.sSOLoginDataModel = JSON.parse(localStorage.getItem('SSOLoginUser') || '{}');


      let request = {
        PostID: this.request.PostID,
        CreatedBy: this.sSOLoginDataModel.UserID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CampusFromDate: this.request.CampusFromDate,
        CampusFromTime: this.request.CampusFromTime,
        CampusToDate: this.request.CampusToDate,
        SuspendDocumnet:this.requestAction.SuspendDocumnet,
        Dis_SuspendDoc:this.requestAction.Dis_SuspendDoc,
        ActionRemarks:this.request.ActionRemarks
      };

      await this.campusPostService.CampusPost_UpdateStatus(request)
        .then((data: any) => {
          
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.CloseModalPopupCampus();
            this.request.CampusFromDate = '';
            this.request.CampusFromTime = '';
            this.request.CampusToDate = '';
            this.requestAction.SuspendDocumnet = '';
            this.requestAction.Dis_SuspendDoc = '';
            this.request.ActionRemarks = '';
            this.btn_SearchClick();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }
}


