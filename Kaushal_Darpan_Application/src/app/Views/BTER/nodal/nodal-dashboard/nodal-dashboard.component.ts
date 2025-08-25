import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { GlobalConstants, EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { DTEApplicationDashboardDataModel, DTEDashboardModel } from '../../../../Models/DTEApplicationDashboardDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { VerifierService } from '../../../../Services/DTE_Verifier/verifier.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
@Component({
  selector: 'app-nodal-dashboard',
  standalone: false,
  templateUrl: './nodal-dashboard.component.html',
  styleUrl: './nodal-dashboard.component.css'
})
export class NodalDashboardComponent {
  public _GlobalConstants: any = GlobalConstants;

  public Message: string = '';
  public zippath: any;
  public ErrorMessage: string = '';
  public State: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public UserID: number = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DTEApplicationDashboardDataModel();
  public NodalVerifierDashboardList: DTEDashboardModel[] = [];
  public lstAcedmicYear: any;
  public ApplicationList: any = []
  public _EnumDepartment = EnumDepartment;
  public IsShowDashboard: boolean = false;
  //Profile View Variables Pawan
  public ProfileLists: any = {};
  //Profile View Variables Pawan

  //Modal Boostrap
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  private userDataSubscription!: Subscription;
  constructor(
    private verifierService: VerifierService,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService, 
    public appsettingConfig: AppsettingService) {
  }

  async ngOnInit() {
    this.userDataSubscription = this.commonFunctionService.sSOLoginDataModel$.subscribe(
      async (data) => {
        this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
        await this.GetDTEDashboard();
      }
    );
  }

  ngOnDestroy(): void {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  async GetDTEDashboard() {
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID;
    this.NodalVerifierDashboardList = [];
    try {
      this.loaderService.requestStarted();
      await this.verifierService.GetNodalVerifierDashboard(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.NodalVerifierDashboardList = data['Data'];
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
