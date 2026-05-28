import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CampusPostService } from '../../../Services/CampusPost/campus-post.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { CampusPostMasterModel, CampusPostMaster_Action, CampusPostMaster_EligibilityCriteriaModel, SSOIDDetailRequestModel } from '../../../Models/CampusPostDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { EnumMessageType,EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { HomeService } from '../../../Services/Home/home.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { PlacementStudentService } from '../../../Services/PlacementStudent/placement-student.service';
import { CampusStudentConsentModel, StudentConsentSearchModel } from '../../../Models/PlacementStudentSearchModel';
import { ApplicationMessageDataModel } from '../../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { SmsDataModel } from '../../../Models/ApplicationMessageDataModel';

@Component({
  selector: 'app-student-placement-consent',
  templateUrl: './student-placement-consent.component.html',
  styleUrls: ['./student-placement-consent.component.css'],
  standalone: false
})
export class StudentPlacementConsentComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public StudentSMSData: any = [];
  public InstituteMasterList: any = [];
  public CompanyMasterList: any = [];
  public CompanyID: number = 0;
  public InstituteID: number = 0;
  public ApprovedStatus: string = "0";
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostDetail: any = null;
  public PlacementCompanyList: any[] = [];
  public searchRequest = new CampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchrequest = new StudentConsentSearchModel()
  public Request = new CampusStudentConsentModel()
  public SmsDataModel = new SmsDataModel();

  public getSSOIDDetailData: any[] = [];

  public messageModel = new ApplicationMessageDataModel();
  public ConsentCount: number = 0;

  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()

  constructor(private commonMasterService: CommonFunctionService, private smsMailService: SMSMailService, private campusPostService: CampusPostService, private loaderService: LoaderService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private Swal2: SweetAlert2,
    private placementservice: PlacementStudentService,
    private homeService: HomeService, private appsettingConfig: AppsettingService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.btn_SearchClick();
    await this.GetStudentConsentCount();
  }
  //async GetMasterData() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.InstituteMasterList = data['Data'];
  //      }, error => console.error(error));
  //    await this.commonMasterService.PlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.CompanyMasterList = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  async btn_SearchClick() {
    //debugger;
    try {
      this.searchrequest.StudentID = this.sSOLoginDataModel.StudentID
      this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchrequest.action = "GetStudentCampusList"
      this.searchrequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchrequest.Status = this.ApprovedStatus
      this.loaderService.requestStarted();
      await this.placementservice.GetPlacementconsent(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusValidationListData = data['Data'];

          console.log(this.CampusValidationListData);
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

  isConsentAllowed(row: any): boolean {
    //debugger
    if (!row.StudentConsentDate || !row.StudentConsentTime) return false;

    const date = row.StudentConsentDate;
    const time = row.StudentConsentTime || '23:59'; // fallback

    const consentDateTime = new Date(`${date}T${time}:00`);
    console.log(consentDateTime);
    // const consentDateTime = new Date(
    //   row.StudentConsentDate + 'T' + row.StudentConsentTime
    // );
    // console.log(consentDateTime);
    if (row.ConsentID == 0 && consentDateTime < this.TodayDate) {
      console.log("true");
    }

    return row.ConsentID == 0 && consentDateTime < this.TodayDate;
  }

  isConsentExpired(row: any): boolean {
    // debugger
    if (!row.StudentConsentDate || !row.StudentConsentTime) return false;

    const consentDateTime = new Date(
      row.StudentConsentDate + 'T' + row.StudentConsentTime
    );

    return row.ConsentID == 0 && consentDateTime >= this.TodayDate;
  }
  async btn_Clear() {

    this.CompanyID = 0;
    this.InstituteID = 0;
    this.ApprovedStatus = "0";
    this.CampusValidationListData = [];
  }

    public file!: File;
    async onFilechange(event: any, Type: string) {
      try {
        debugger;
        this.file = event.target.files[0];
        if (this.file) {
          if (this.file.type == 'application/pdf') {
            //size validation
            if (this.file.size > 2000000) {
              this.toastr.error('Select less then 2MB File')
              return
            }
          }
          else {
            this.toastr.error('Select Only pdf file')
            return
          }
          // upload to server folder
          this.loaderService.requestStarted();
          // console.log(this.selectedSuspendedPost);
  
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
                    this.Request.Dis_UploadedResume = data['Data'][0]["Dis_FileName"];
                    this.Request.UploadedResume = data['Data'][0]["FileName"];
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

  //async btnDelete_OnClick(RoleID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  //      await this.campusPostService.DeleteDataByID(RoleID, this.sSOLoginDataModel.UserID)
  //        .then(async (data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            await this.btn_SearchClick();
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}
  async GetAllPost(PostID: number) {
    try {
      this.PostId = PostID
      this.loaderService.requestStarted();
      await this.homeService.GetAllPost(this.PostId, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data['Data'].length > 0) {
            this.CampusPostDetail = data['Data'][0];
            console.log(this.CampusPostDetail)
          }
          console.log(this.CampusPostDetail);
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

  // get all data
  async GetAllPlacementCompany() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.homeService.GetAllPlacementCompany(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.PlacementCompanyList = data['Data'];
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


  async openModal(content: any, PostID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetAllPost(PostID)
    this.GetAllPlacementCompany()
  }

  async GetStudentConsentCount() {
    //debugger
    try {
      this.loaderService.requestStarted();
      await this.placementservice.GetStudentConsentCount(this.sSOLoginDataModel.StudentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ConsentCount = data['Data'][0]['ConsentCount'];
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

  async GetCampusSMSDataByID(PostID:number) {
    try {
      debugger
      this.loaderService.requestStarted();
      this.SmsDataModel.PostID = PostID;
      this.SmsDataModel.StudentID = this.sSOLoginDataModel.StudentID;
      this.SmsDataModel.Flag = "_getStudentSMSDataByID";
      await this.campusPostService.GetCampusSMSDataByID(this.SmsDataModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentSMSData = data['Data'];
          console.log(this.StudentSMSData, "StudentSMSData");
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

 
  async Savedata(PostID: number) {
    //debugger
    await this.GetStudentConsentCount();
    if (this.ConsentCount == 5) {
      this.Swal2.Warning("You have already given consent for 5 companies");
      return;
    }
    if (this.Request.UploadedResume == '' || this.Request.UploadedResume == undefined || this.Request.UploadedResume == null) {
      this.Swal2.Warning("Please Upload Resume before Consent");
      return;
    }
    this.Swal2.Confirmation("Are you sure you want to processed?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          this.Request.SSOID = this.sSOLoginDataModel.SSOID
          this.Request.StudentID = this.sSOLoginDataModel.StudentID
          this.Request.PostID = PostID
          this.Request.ModifyBy = this.sSOLoginDataModel.StudentID
          this.Request.CreatedBy = this.sSOLoginDataModel.StudentID
          this.loaderService.requestStarted();
          await this.placementservice.SaveData(this.Request).then(async (data: any) => {

            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (data.State == EnumStatus.Success) {
              // this.SmsDataModel.PostID = PostID;
              await this.SendApplicationMessage(PostID);
              /* this.toastr.success(data.Message);*/
              this.Swal2.Success(`Your Consent has been recorded.</br> Registration No.${data.Data}`)
              this.btn_SearchClick();

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
            else {
              this.toastr.error(data.Message);
              console.error(data.ErrorMessage);
            }
          });

        } catch (Ex) {
          console.log(Ex);
        }
      }
    }
    )
  }


  async SendApplicationMessage(PostID: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      await this.GetCampusSMSDataByID(PostID);
      //this.messageModel.MobileNo = '8334874706';      
      this.messageModel.CampusID = this.StudentSMSData[0].CampusID;
      //this.messageModel.MobileNo = this.sSOLoginDataModel.Mobileno;
      this.messageModel.EnrollmentNo = this.StudentSMSData[0].EnrollmentNo;
      this.messageModel.RegNo = this.StudentSMSData[0].RegNo;
      //this.messageModel.MobileNo = '8334874706';
      //this.messageModel.ApplicantName = 'Divya Sharma';
      this.messageModel.MessageType = EnumMessageType.Bter_StudentConsent;

      const now = new Date();

      this.messageModel.ActionDate =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');

      // department
      //if (this.DepartmentID == EnumDepartment.BTER) {
      //this.messageModel.MessageType = EnumMessageType.Bter_FormFinalSubmit;
      //}
      //else if (this.DepartmentID == EnumDepartment.ITI) {
      //  this.messageModel.MessageType = EnumMessageType.FormFinalSubmitITI;
      //}
      /*this.messageModel.ApplicationNo = this.ApplicationNo.toString();*/
      //this.messageModel.ApplicationNo = '21100634';
      // this.messageModel.MessageType='OTP';
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
