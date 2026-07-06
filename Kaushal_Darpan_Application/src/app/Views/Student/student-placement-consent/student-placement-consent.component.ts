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
import { UploadFileModel } from '../../../Models/UploadFileModel';

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
  public TrainingName:string=''
  public getSSOIDDetailData: any[] = [];
  public FileFormatName: string = '';

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
   // await this.GetStudentConsentCount();
    //await this.GetStudentLatestResume();
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

  //public file!: File;
  //async onFilechange(event: any, Type: string) {
  //    try {
  //      debugger;
  //      this.file = event.target.files[0];
  //      if (this.file) {
  //        if (this.file.type == 'application/pdf') {
  //          //size validation
  //          if (this.file.size > 2000000) {
  //            this.toastr.error('Select less then 2MB File')
  //            return
  //          }
  //        }
  //        else {
  //          this.toastr.error('Select Only pdf file')
  //          return
  //        }
  //        // upload to server folder
  //        this.loaderService.requestStarted();
  //        // console.log(this.selectedSuspendedPost);
  
  //        await this.commonMasterService.UploadDocument(this.file)
  //          .then((data: any) => {
  //            data = JSON.parse(JSON.stringify(data));
  //            this.State = data['State'];
  //            this.Message = data['Message'];
  //            this.ErrorMessage = data['ErrorMessage'];
  
  //            if (this.State == EnumStatus.Success) {
  //              if (Type == "Photo") {
  //                // if(this.selectedSuspendedPost.Status = 'Suspend'){
  
  //                // }
  //                // else{
  //                  this.Request.Dis_UploadedResume = data['Data'][0]["Dis_FileName"];
  //                  this.Request.UploadedResume = data['Data'][0]["FileName"];
  //                // }
  
  //              }
  //              //else if (Type == "Sign") {
  //              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
  //              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
  //              //}
  //              /*              item.FilePath = data['Data'][0]["FilePath"];*/
  //              event.target.value = null;
  //            }
  //            if (this.State == EnumStatus.Error) {
  //              this.toastr.error(this.ErrorMessage)
  //            }
  //            else if (this.State == EnumStatus.Warning) {
  //              this.toastr.warning(this.ErrorMessage)
  //            }
  //          });
  //      }
  //    }
  //    catch (Ex) {
  //      console.log(Ex);
  //    }
  //    finally {
  //      /*setTimeout(() => {*/
  //      this.loaderService.requestEnded();
  //      /*  }, 200);*/
  //    }
  //  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    debugger;
    try {
      this.file = event.target.files[0];
      if (this.file) {
        // Type validation
        if (['application/pdf'].includes(this.file.type)) {
          // Size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less than 2MB File');
            return;
          }
        }
        else {
          this.toastr.error('Select Only pdf file');
         // this.Uploadfile = '';
          //this.BudgetModel.RequestFileName = '';
          event.target.value = null;
          return;
        }

        //upload model
        let uploadModel = new UploadFileModel();
        uploadModel.FileExtention = this.file.type ?? "";
        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = this._GlobalConstants.DepartmentBterFolder +this._GlobalConstants.StudentPlacementResumes;
        uploadModel.FileName = this.FileFormatName ?? '';
        uploadModel.Flag = 'IsForStudentconsent';

        //UploadDocument
        //Upload to server folder
        await this.commonMasterService.UploadBTERDocument(this.file, uploadModel)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State === EnumStatus.Success) {
              if (Type == "Photo") {
                const fileName = data['Data'][0]["Dis_FileName"];;
                const actualFile = data['Data'][0]["FileName"];
                this.Request.Dis_UploadedResume = fileName;
                this.Request.UploadedResume = actualFile;
              }
              //const fileName = data['Data'][0]["Dis_FileName"];
              //const actualFile = data['Data'][0]["FileName"];

              //this.Uploadfile = data['Data'][0]["FileName"];
              //this.BudgetModel.RequestFileName = this.Uploadfile;
              //this.BudgetModel.DocFileName = this.Uploadfile;
              event.target.value = null;
            }

            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);

            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
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
    this.Request.InterestedStatus = 0
    this.Request.Remarks = ''
    this.Request.UploadedResume = ''
    this.Request.Dis_UploadedResume = ''
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
  async GetAllPost(PostID: number, BranchID:number=0) {
    try {
      this.PostId = PostID
      this.loaderService.requestStarted();
      await this.homeService.GetAllPost(this.PostId, this.sSOLoginDataModel.DepartmentID, BranchID)
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


  async openModal(content: any, PostID: number, BranchID:number=0) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetAllPost(PostID, BranchID)
    this.GetAllPlacementCompany()
  }

  async GetStudentConsentCount(PostID:number) {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.placementservice.GetStudentConsentCount(this.sSOLoginDataModel.StudentID, PostID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
         // debugger;
          this.ConsentCount = data['Data'][0]['ConsentCount'];
          this.FileFormatName = data['Data'][0]['FileFormatName'];
          //if (data['Data'][0]['UploadedResume'] != '') {
          //  this.Request.Dis_UploadedResume = data['Data'][0]['Dis_UploadedResume'];
          //  this.Request.UploadedResume = data['Data'][0]['UploadedResume'];
          //}
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

  async GetStudentLatestResume() {
    //debugger
    try {
      this.loaderService.requestStarted();
      await this.placementservice.GetStudentLatestResume(this.sSOLoginDataModel.StudentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
         // this.ConsentCount = data['Data'][0]['ConsentCount'];
          if (data['Data'][0]['UploadedResume'] != '') {
            this.Request.Dis_UploadedResume = data['Data'][0]['Dis_UploadedResume'];
            this.Request.UploadedResume = data['Data'][0]['UploadedResume'];            
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

 
  async Savedata(PostID: number = 0) {

    try {

      debugger;

      if (!this.validateEmailAndMobile()) {
        return;
      }

      if (PostID == 0) {
        PostID = this.Request.PostID;
      }

      this.Request.PostID = PostID;

      // Get Consent Count
      await this.GetStudentConsentCount(PostID);

      if (this.ConsentCount >= 5) {
        this.Swal2.Warning("You have already given consent for 5 companies");
        return;
      }

      // Resume Validation
      if (!this.Request.UploadedResume && this.Request.InterestedStatus==1) {
        this.Swal2.Warning("Please upload resume before consent");
        return;
      }

      // Interest Validation
      if (this.Request.InterestedStatus == 0) {
        this.Swal2.Warning("Please select Consent Status");
        return;
      }

      // Confirmation
      this.Swal2.Confirmation(
        "Are you sure you want to proceed?",
        async (result: any) => {

          if (result.isConfirmed) {

            try {

              // Assign Request Values
              this.Request.SSOID = this.sSOLoginDataModel.SSOID;
              this.Request.StudentID = this.sSOLoginDataModel.StudentID;
              this.Request.ModifyBy = this.sSOLoginDataModel.StudentID;
              this.Request.CreatedBy = this.sSOLoginDataModel.StudentID;

              this.loaderService.requestStarted();

              const response = await this.placementservice.SaveData(this.Request);

              const data = JSON.parse(JSON.stringify(response));

              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];

              if (data.State == EnumStatus.Success) {

                // Send SMS/Notification
                await this.SendApplicationMessage(PostID);
                let message = `Your consent has been recorded.`
                if (this.Request.InterestedStatus == 1) {
                 message+= `<br/>Registration No. ${data.Data}`
                }
                this.Swal2.Success(
                  message
                );

                this.CloseModalPopup()
                await this.btn_SearchClick();

              }
              else if (data.State == EnumStatus.Warning) {

                this.toastr.warning(data.ErrorMessage);

              }
              else {

                this.toastr.error(data.Message);
                console.error(data.ErrorMessage);

              }

            }
            catch (error) {

              console.error(error);
              this.toastr.error("Something went wrong");

            }
            finally {

              this.loaderService.requestEnded();

            }

          }

        }
      );

    }
    catch (ex) {

      console.error(ex);

    }

  }


  async SendApplicationMessage(PostID: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      await this.GetCampusSMSDataByID(PostID);    
      this.messageModel.CampusID = this.StudentSMSData[0].CampusID;
      this.messageModel.MobileNo = this.StudentSMSData[0].MobileNo;
      this.messageModel.EnrollmentNo = this.StudentSMSData[0].EnrollmentNo;
      this.messageModel.RegNo = this.StudentSMSData[0].RegNo;
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

  async UploadCotent(
    content: any,
    ID: number,
    TrainingName: string = '',
    InterestedStatus: number = 0,
    Remarks: string = '',
    ConsentID: number = 0,
    UploadedResume: string = '',
    Dis_UploadedResume: string = ''
  ) {

    // Reset Model
    debugger;
    // Get Consent Count
    //await this.GetStudentConsentCount();

    if (this.ConsentCount >= 5) {
      this.Swal2.Warning("You have already given consent for 5 companies");
      return;
    }

    if (ConsentID == 0) {
      await this.GetStudentLatestResume();
    }

    if (UploadedResume != '') {
      this.Request.UploadedResume = UploadedResume;
      this.Request.Dis_UploadedResume = Dis_UploadedResume;
    }
  
    debugger
    // Assign Values
    this.Request.PostID = ID;

    if (this.Request.UploadedResume != '') {
      this.Request.InterestedStatus =
        Number(InterestedStatus || 1);
    }
    else {
      this.Request.InterestedStatus =
        Number(InterestedStatus || 0);

      this.Request.UploadedResume =
        UploadedResume || '';

      this.Request.Dis_UploadedResume =
        Dis_UploadedResume || '';
    }

    //this.Request.InterestedStatus =
    //  Number(InterestedStatus || 1);

    this.Request.Remarks =
      Remarks || '';

    this.Request.ConsentID =
      Number(ConsentID || 0);

    //this.Request.UploadedResume =
    //  UploadedResume || '';

    //this.Request.Dis_UploadedResume =
    //  Dis_UploadedResume || '';

    this.TrainingName =
      TrainingName || '';

    // Open Modal
    this.modalService.open(content, {
      centered: true,
      backdrop: 'static',
      keyboard: false,
      windowClass: 'training-modal'
    }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });

  }


  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  validateEmailAndMobile(): boolean {

    // Email Validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.Request.EmailId || !emailPattern.test(this.Request.EmailId.trim())) {
      this.toastr.warning('Please enter a valid Email Address');
      return false;
    }

    // Mobile Validation (10 digits, starts with 6-9 for Indian numbers)
    const mobilePattern = /^[6-9]\d{9}$/;

    if (!this.Request.MobileNo || !mobilePattern.test(this.Request.MobileNo.toString())) {
      this.toastr.warning('Please enter a valid Mobile Number');
      return false;
    }

    return true;
  }


}
