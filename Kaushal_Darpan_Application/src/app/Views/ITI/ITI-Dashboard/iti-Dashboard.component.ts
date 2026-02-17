  import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITI_PlanningCollegesModel, ITI_PlanningCollegesSearchModel, ItiVerificationModel } from '../../../Models/ItiPlanningDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiPlanningComponent } from '../iti-planning/iti-planning.component';
import { ItiCollegesSearchModel } from '../../../Models/CommonMasterDataModel';
import { ActivatedRoute } from '@angular/router';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';


@Component({
  selector: 'app-iti-Dashboard',
  standalone: false,
  templateUrl: './iti-Dashboard.component.html',
  styleUrl: './iti-Dashboard.component.css'
})
export class itiDashboardComponent {

  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public request = new ITI_PlanningCollegesSearchModel()
  public DashboardCountList: any = []

  public TradeCountList: any = []
  public TradeCountListEng: any = []
  public TradeCountListNonEng: any = []


  public CollegeCountList: any = []
  public RunningCampList: any = []
  public SeatIntakeList: any = []

  constructor(private commonMasterService: CommonFunctionService, private campusPostService: ITIsService, private loaderService: LoaderService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private activeroute: ActivatedRoute,
    private itiTradeService: ItiTradeService


  ) {
  }

  async ngOnInit()
  {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetDTEDashboard();
  }


  async GetDTEDashboard()
  {
    var d =
    {
      FinancialYearID: this.sSOLoginDataModel.FinancialYearID
    }
    try
    {
      this.loaderService.requestStarted();
      await this.itiTradeService.GetDashboardData(d)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success)
          {
            this.DashboardCountList = data['Data'];

            this.TradeCountList = this.DashboardCountList.filter(
              (f: any) => f.TileType === 'TradeCount');

            this.TradeCountListEng = this.DashboardCountList.filter(
              (f: any) => f.TileType === 'TradeCount' && f.TradeName == "ENG");

            this.TradeCountListNonEng = this.DashboardCountList.filter(
              (f: any) => f.TileType === 'TradeCount' && f.TradeName == "Non Eng");



            console.log(this.TradeCountListEng);
            console.log(this.TradeCountListNonEng);

            
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

 

  // College Cards
  
  getCollegeTextClass(item: any) {
    if (item.TradeName === 'GOVT') return 'text-warning';
    if (item.TradeName === 'PVT') return 'text-danger';
    return 'text-primary';
  }

  

}
