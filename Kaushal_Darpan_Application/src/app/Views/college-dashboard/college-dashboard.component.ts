import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GlobalConstants, EnumStatus, EnumDepartment} from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AppsettingService } from '../../Common/appsetting.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CollegeApplicationDashboardDataModel } from '../../Models/DTEApplicationDashboardDataModel';
import { CollegeMasterService } from '../../Services/CollegeMaster/college-master.service';

@Component({
    selector: 'app-college-dashboard',
  templateUrl: './college-dashboard.component.html',
  styleUrls: ['./college-dashboard.component.css'],
    standalone: false
})
export class CollegeDashboardComponent {

  public _GlobalConstants: any = GlobalConstants;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CollegeApplicationDashboardDataModel();
  public CollegeApplicationDashboardList: any[] = [];
  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(private commonMasterService: CommonFunctionService,
    private collegeDashboardService: CollegeMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute, private modalService: NgbModal, public appsettingConfig: AppsettingService, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDTEDashboard();
  }

  async GetDTEDashboard()
  {
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.CollegeApplicationDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.collegeDashboardService.GetCollegeDashBoardData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.CollegeApplicationDashboardList = data['Data'];
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

}
