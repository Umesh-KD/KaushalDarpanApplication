import { Component, ViewChild } from '@angular/core';
import { EnumDepartment, EnumEMProfileStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DTEApplicationDashboardDataModel, DTEDashboardModel } from '../../../Models/DTEApplicationDashboardDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ActivatedRoute } from '@angular/router';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { StaffMasterSearchModel } from '../../../Models/StaffMasterDataModel';
import { StaffMasterService } from '../../../Services/StaffMaster/staff-master.service';

@Component({
  selector: 'app-hostel-dashboard',
  standalone: false,
  
  templateUrl: './hostel-dashboard.component.html',
  styleUrl: './hostel-dashboard.component.css'
})
export class HostelDashboardComponent {
  //@ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  public _GlobalConstants: any = GlobalConstants;
  public Hostel_WardenFormGroup!: FormGroup;
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DTEApplicationDashboardDataModel();
  public HostelDashboardList: DTEDashboardModel[] = [];
  public MultiHostelWardenRoleList: any = [];
  public StaffMasterList: any = [];
  public _EnumEMProfileStatus = EnumEMProfileStatus;
  public staffSearchRequest = new StaffMasterSearchModel();
  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  //Profile View Variables Pawan
  public ProfileLists: any = {};

  public rquestfrom: any = [];
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  @ViewChild('modal_GenrateOTP') modal_GenrateOTP: any;
  constructor(
    private commonMasterService: CommonFunctionService,
    private studentRequestService: StudentRequestService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute, private modalService: NgbModal, public appsettingConfig: AppsettingService, private Swal2: SweetAlert2,
    private staffMasterService: StaffMasterService, private sweetAlert2: SweetAlert2) {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
     this.GetMultiHostel_WardenRole();
  }




  async ngOnInit() {

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetHostelDashboard();

    if(this.sSOLoginDataModel.RoleID == EnumRole.HostelWarden) {
      await this.CheckProfileStatus();
      if (this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Pending || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Revert || this.sSOLoginDataModel.ProfileID == this._EnumEMProfileStatus.Completed) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          if (this.sSOLoginDataModel.DepartmentID == 1) {
            if (this.sSOLoginDataModel.EmTypeId == 1) {
                window.open("/bter-em-add-staff-details", "_Self")
            }
          }
          else if (this.sSOLoginDataModel.DepartmentID == 2) {
              window.open("/ITIGOVTEMPersonalDetailsApplicationTab", "_Self")
          }
        }, 'OK', false);
      }
    }
  }

  async GetHostelDashboard() {
    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.HostelID = this.sSOLoginDataModel.HostelID;
    this.HostelDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.studentRequestService.GetHostelDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.HostelDashboardList = data['Data'];
            console.log(this.HostelDashboardList,'DTAAAA')
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

  async GetMultiHostel_WardenRole() {

    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.HostelID = this.sSOLoginDataModel.HostelID;
   

   
    try {
      this.loaderService.requestStarted();
     

      await this.commonMasterService.GetMultiHostel_WardenDetails(this.sSOLoginDataModel.SSOID, this.searchRequest.RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MultiHostelWardenRoleList = data['Data'];
          console.log('GetMultiHostel_WardenDetailList', this.MultiHostelWardenRoleList)
          if (this.MultiHostelWardenRoleList.length > 1) {
            if (this.sSOLoginDataModel.IsMutiHostelWarden === true) {
              this.GetManageHostelWardenPopup(this.modal_GenrateOTP);
            }
           
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


  async GetManageHostelWardenPopup(content: any) {
   
/*    this.IsShowViewStudent = true;*/
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    //if (MenuId > 0) {
    //  await this.GetMenuMaster(MenuId)
    //}
  }

  private getDismissReason(reason: any): string {
    //if (reason === ModalDismissReasons.ESC) {
    //  return 'by pressing ESC';
    //} else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    //  return 'by clicking on a backdrop';
    //} else {
      return `with: ${reason}`;
    //}
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }

  async CloseViewMenuDetails() {
    

    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
     
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }


  async ChangeHostelWarden(SSoId: string, HostelID: number=0)
  {
    
    this.sSOLoginDataModel.HostelID = HostelID;

    this.sSOLoginDataModel.IsMutiHostelWarden = false;
    
    this.commonMasterService.setsSOLoginDataModel(this.sSOLoginDataModel);

    await this.CloseViewMenuDetails();

    window.location.reload(); 



   
  }

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      this.staffSearchRequest.Action = '_checkProfileStatus'
      this.staffSearchRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.staffSearchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.staffSearchRequest.CourseTypeId = this.sSOLoginDataModel.Eng_NonEng;

      await this.staffMasterService.GetAllData(this.staffSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.StaffMasterList = data['Data'];
          console.log("CheckProfileStatus", this.StaffMasterList)
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

}
