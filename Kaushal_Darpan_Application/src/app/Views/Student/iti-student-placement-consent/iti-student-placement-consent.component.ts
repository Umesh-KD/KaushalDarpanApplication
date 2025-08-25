import { Component } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CampusPostService } from '../../../Services/CampusPost/campus-post.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';
import { CampusPostMasterModel, CampusPostMaster_Action, CampusPostMaster_EligibilityCriteriaModel } from '../../../Models/CampusPostDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CampusDetailsWebSearchModel } from '../../../Models/CampusDetailsWebDataModel';
import { HomeService } from '../../../Services/Home/home.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { PlacementStudentService } from '../../../Services/PlacementStudent/placement-student.service';
import { CampusStudentConsentModel, StudentConsentSearchModel } from '../../../Models/PlacementStudentSearchModel';
import { ITIPlacementStudentService } from '../../../Services/ITI/ITIPlacementStudent/iti-placement-student.service';
import { ITICampusDetailsWebSearchModel } from '../../../Models/ITI/ITICampusDetailsWebDataModel';
import { ITICampusStudentConsentModel, ITIStudentConsentSearchModel } from '../../../Models/ITI/ITIPlacementStudentSearchModel';
import { ITIHomeService } from '../../../Services/ITI/ITIHome/itihome.service';

@Component({
    selector: 'app-student-placement-consent',
    templateUrl: './iti-student-placement-consent.component.html',
    styleUrls: ['./iti-student-placement-consent.component.css'],
    standalone: false
})
export class ITIStudentPlacementConsentComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public InstituteMasterList: any = [];
  public CompanyMasterList: any = [];
  public CompanyID: number = 0;
  public InstituteID: number = 0;
  public ApprovedStatus: string = "0";
  public _GlobalConstants: any = GlobalConstants;
  public PostId: number = 0;
  public CampusPostDetail: any = null;
  public PlacementCompanyList: any[] = [];
  public searchRequest = new ITICampusDetailsWebSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchrequest = new ITIStudentConsentSearchModel()
  public Request = new ITICampusStudentConsentModel()

  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()

  constructor(private commonMasterService: CommonFunctionService, private campusPostService: CampusPostService, private loaderService: LoaderService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private Swal2: SweetAlert2,
    private itiplacementservice: ITIPlacementStudentService,
    private homeService: ITIHomeService, private appsettingConfig: AppsettingService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.btn_SearchClick();
  }
 
  async btn_SearchClick() {
    try {
      this.searchrequest.StudentID = this.sSOLoginDataModel.StudentID
      this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID
      this.searchrequest.action ="GetStudentCampusList"
      this.searchrequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchrequest.Status = this.ApprovedStatus
      this.loaderService.requestStarted();
      await this.itiplacementservice.GetPlacementconsent(this.searchrequest)
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
  async btn_Clear() {

    this.CompanyID = 0;
    this.InstituteID = 0;
    this.ApprovedStatus = "0";
    this.CampusValidationListData = [];
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
  async GetAllPost(PostID:number) {
    try {
      this.PostId = PostID
      this.loaderService.requestStarted();
      await this.homeService.GetITIAllPost(this.PostId, this.sSOLoginDataModel.DepartmentID)
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
 
  async Savedata(PostID: number) {
    this.Swal2.Confirmation("Are you sure you want to processed?", async (result: any) => {
      if (result.isConfirmed) {
        try {
          this.Request.SSOID = this.sSOLoginDataModel.SSOID
          this.Request.StudentID = this.sSOLoginDataModel.StudentID
          this.Request.PostID = PostID
          this.Request.ModifyBy = this.sSOLoginDataModel.StudentID
          this.Request.CreatedBy = this.sSOLoginDataModel.StudentID
          this.loaderService.requestStarted();
          await this.itiplacementservice.SaveData(this.Request).then((data: any) => {

            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (data.State == EnumStatus.Success) {
           
              /* this.toastr.success(data.Message);*/
              this.Swal2.Success("Your Consent has been recorded")
              this.btn_SearchClick();
           


            }
            if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }


          });


        } catch (Ex) {
          console.log(Ex);
        } finally {
          this.loaderService.requestEnded();
        }
      }

    }
    )
  }
  
}
