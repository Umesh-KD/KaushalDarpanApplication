import { Component } from '@angular/core';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DTEDashboardServiceService } from '../../Services/DTE_Dashboard/dte-dashboard-service.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppsettingService } from '../../Common/appsetting.service';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { EnumStatus, GlobalConstants, EnumDepartment} from '../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DTEApplicationDashboardDataModel, DTEDashboardModel } from '../../Models/DTEApplicationDashboardDataModel';
import { VerifierService } from '../../Services/DTE_Verifier/verifier.service';

@Component({
  selector: 'app-verifier-dashboard',
  standalone: false,
  
  templateUrl: './verifier-dashboard.component.html',
  styleUrl: './verifier-dashboard.component.css'
})
export class VerifierDashboardComponent {

  public _GlobalConstants: any = GlobalConstants;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DTEApplicationDashboardDataModel();
  public DTEApplicationDashboardList: DTEDashboardModel[] = [];
  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  constructor(private commonMasterService: CommonFunctionService,
    private dteDashboardService: VerifierService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: ActivatedRoute, private modalService: NgbModal, public appsettingConfig: AppsettingService, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDTEDashboard();
  }

  async GetDTEDashboard() {
    
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.DTEApplicationDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.dteDashboardService.GetVerifierDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DTEApplicationDashboardList = data['Data'];
            console.log(this.DTEApplicationDashboardList)
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
