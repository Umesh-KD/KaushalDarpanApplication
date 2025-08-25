import { ChangeDetectorRef, Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirstYearAdmissionComponent } from '../first-year-admission/first-year-admission.component';
import { Type } from '@angular/core';
import { LateralEntryComponent } from '../lateral-entry/lateral-entry.component';
import { EmitraApplicationStatusComponent } from '../../Student/emitra-application-status/emitra-application-status.component';
import { ApplicationFormComponent } from '../../Polytechnic/application-form/application-form.component';
import { StudentEmitraFeePaymentComponent } from '../../Student/student-emitra-fee-payment/student-emitra-fee-payment.component';
import { KnowMeritComponent } from '../know-merit/know-merit.component';
import { AllotStatusComponent } from '../allotment-status/allot-status.component';
import { ApplyNowComponent } from '../apply-now/apply-now.component';
import { RevaluationTabComponent } from '../../Student/revaluation-tab/revaluation-tab.component';
import { RevaluationComponent } from '../../revaluation/revaluation.component';
import { UpwardMomentComponent } from '../upward-moment/upward-moment.component';
import { StudentEmitraITIFeePaymentComponent } from '../../Student/student-emitra-iti-fee-payment/student-emitra-iti-fee-payment.component';
import { FeePaidByChallanComponent } from '../fee-paid-by-challan/fee-paid-by-challan.component';
import { CookieService } from 'ngx-cookie-service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumEmitraService, EnumRole, EnumUserType } from '../../../Common/GlobalConstants';

//import { BTERAllotmentStatusComponent } from '../../BTER/bter-allotment-status/bter-allotment-status.component';


@Component({
    selector: 'app-emitra-dashboard',
    templateUrl: './emitra-dashboard.component.html',
    styleUrls: ['./emitra-dashboard.component.css'],
    standalone: false
})
export class EmitraDashboardComponent implements OnInit {
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  public CookiesValues:any=''
  selectedTabIndex = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public tabs: any[] = [];


  
  constructor(private resolver: ComponentFactoryResolver, private router: Router, private cdr: ChangeDetectorRef
    , private cookieService: CookieService,
    private commonFunctionService: CommonFunctionService
  )
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    try
    {
      console.log("Readcookies",this.cookieService.get("KDEmitraKiosk"));
    }
    catch
    {
    }
    
    
  
  }


  LoadTabs() {
    this.tabs = [
      { TabName: 'Apply Online', TabNameHI: '  ऑनलाइन आवेदन   करें ', TabIcon: 'ti ti-license', component: ApplyNowComponent, ServiceID: EnumEmitraService.ITIEmitraFormService, DepartmentID: 1 },
      { TabName: 'Apply Online', TabNameHI: '  ऑनलाइन आवेदन   करें ', TabIcon: 'ti ti-license', component: ApplyNowComponent, ServiceID: EnumEmitraService.BTER_DeplomaENG_Emitra_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'Apply Online', TabNameHI: '  ऑनलाइन आवेदन   करें ', TabIcon: 'ti ti-license', component: ApplyNowComponent, ServiceID: EnumEmitraService.BTER_DeplomaNonENG_Emitra_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'Apply Online', TabNameHI: '  ऑनलाइन आवेदन   करें ', TabIcon: 'ti ti-license', component: ApplyNowComponent, ServiceID: EnumEmitraService.BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'Apply Online', TabNameHI: '  ऑनलाइन आवेदन   करें ', TabIcon: 'ti ti-license', component: ApplyNowComponent, ServiceID: EnumEmitraService.BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'Apply Online', TabNameHI: '  ऑनलाइन आवेदन   करें ', TabIcon: 'ti ti-license', component: ApplyNowComponent, ServiceID: EnumEmitraService.BTER_DegreeNonENG_Emitra_AppplicationFeeService, DepartmentID: 1 },


      { TabName: 'Fill ITI Fees', TabNameHI: 'आईटीआई फीस भरें', TabIcon: 'ti ti-license', component: StudentEmitraITIFeePaymentComponent, DepartmentID: 2, ServiceID: EnumEmitraService.ITIExamFees },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.ITiApplicationFee, DepartmentID: 1 },

      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DeplomaENG_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DeplomaNonENG_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DeplomaLateral_2ENG_AppplicationFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DegreeLateral_2Year_AppplicationFeeService, DepartmentID: 1 },
     // { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DegreeNonENG_AppplicationFeeService, DepartmentID: 1 },



      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DeplomaENG_AllotmentFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DeplomaNonENG_AllotmentFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DeplomaLateral_2ENG_AllotmentFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DegreeNonENG_AllotmentFeeService, DepartmentID: 1 },
      { TabName: 'FILL Fee using challan', TabNameHI: 'चालान के माध्यम से शुल्क भरें', TabIcon: 'ti ti-exchange', component: FeePaidByChallanComponent, ServiceID: EnumEmitraService.BTER_DegreeLateral_2Year_AllotmentFeeService, DepartmentID: 1 },

    ] as { TabName: string; TabNameHI: string; TabIcon: string; component: Type<any>, ServiceID: number, DepartmentID: number }[];


    //BTER_DeplomaENG_AllotmentFeeService = 2526,
    //BTER_DeplomaENG_AppplicationFeeService = 3160,
    //BTER_DeplomaENG_Emitra_AppplicationFeeService = 3159,

    //BTER_DeplomaNonENG_AllotmentFeeService = 6850,
    //BTER_DeplomaNonENG_AppplicationFeeService = 3169,
    //BTER_DeplomaNonENG_Emitra_AppplicationFeeService = 3168,

    //BTER_DeplomaLateral_2ENG_AllotmentFeeService = 8111,
    //BTER_DeplomaLateral_2ENG_AppplicationFeeService = 3120,
    //BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService = 2494,



  }

  public ChangeDepartment(DepartmentID: number = 1)
  {
    this.selectedTabIndex = 0
    this.LoadTabs();
    
    if (Number( this.sSOLoginDataModel?.ServiceID) >0)
    {
      this.tabs = this.tabs.filter((f: any) => f.ServiceID == this.sSOLoginDataModel.ServiceID);
    }
    this.loadComponent(this.selectedTabIndex);
    this.cdr.detectChanges();
  }

  async ngOnInit()
  {
    
    if (this.cookieService.get("KDEmitraKiosk") != null && this.cookieService.get("KDEmitraKiosk") != '')
    {
      this.sSOLoginDataModel.RoleID = EnumRole.Emitra;
      this.CookiesValues = JSON.parse(this.cookieService.get("KDEmitraKiosk"));
      this.sSOLoginDataModel.DepartmentID = this.CookiesValues.DepartmentID;
      this.sSOLoginDataModel.ServiceID = this.CookiesValues.SERVICEID;
      this.sSOLoginDataModel.IsKiosk = true;
      this.sSOLoginDataModel.KIOSKCODE = this.CookiesValues.KIOSKCODE;
      this.sSOLoginDataModel.RoleID = EnumRole.Emitra;
      this.sSOLoginDataModel.UserType = EnumUserType.KIOSK;
      this.sSOLoginDataModel.SSoToken = this.CookiesValues.SSOTOKEN;
      this.sSOLoginDataModel.SSOID = this.CookiesValues.SSOID;
      // this.sSOLoginDataModel.SSOID = this.CookiesValues.SSOID;
      // this.sSOLoginDataModel.Dis = this.CookiesValues.SSOID;      //set Session
      this.commonFunctionService.setsSOLoginDataModel(this.sSOLoginDataModel);
      this.cookieService.delete("KDEmitraKiosk")
      this.LoadTabs();
      window.location.reload();
    }
    else {
      console.log('No Cookies Found KDEmitraKiosk')
      this.LoadTabs();
    }





    
    this.ChangeDepartment();
  }

  ngAfterViewInit(): void {
    this.loadComponent(this.selectedTabIndex);
    this.cdr.detectChanges();
  }

  // Handles tab selection
  public selectTab(index: number): void {
    if (index >= 0 && index < this.tabs.length) {
      this.selectedTabIndex = index;
      this.loadComponent(index);
    } else {
      console.error('Invalid tab index:', index);
    }
  }

  // Dynamically loads the selected component
  public loadComponent(index: number): void
  {
    const component = this.tabs[index].component;
    const factory = this.resolver.resolveComponentFactory(component);
    this.tabContent?.clear();

    const componentRef = this.tabContent.createComponent(factory);

    (componentRef.instance as any).tabChange?.subscribe((targetIndex: number) => {
      this.selectTab(targetIndex);
    });
  }
}
