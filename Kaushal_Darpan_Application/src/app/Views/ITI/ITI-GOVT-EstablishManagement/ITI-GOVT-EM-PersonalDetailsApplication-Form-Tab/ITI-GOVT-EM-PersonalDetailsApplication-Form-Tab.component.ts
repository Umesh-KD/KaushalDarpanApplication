import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PersonalDetailsTabComponent } from '../../personal-details-tab/personal-details-tab.component'
import { QualificationTabComponent } from '../../qualification-tab/qualification-tab.component';
import { AddressDetailsFormTabComponent } from '../../address-details-form-tab/address-details-form-tab.component'
import { DocumentDetailsFormTabComponent } from '../../document-details-form-tab/document-details-form-tab.component'
import { OptionFormTabComponent } from '../../option-form-tab/option-form-tab.component'
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentDetailsFormTabModule } from '../../document-details-form-tab/document-details-form-tab.module';
import { Type } from '@angular/core';
import { PreviewFormTabComponent } from '../../preview-form-tab/preview-form-tab.component';
import { ChangeDetectorRef } from '@angular/core';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { EnumConfigurationType, EnumDepartment, EnumRole } from '../../../../Common/GlobalConstants';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { ITIGovtEMEducationalQualificationComponent } from '../ITI-Govt-EM-EducationalQualification/ITI-Govt-EM-EducationalQualification.component';
import { ITIGovtEMServiceDetailsOfPersonalComponent } from '../ITI-Govt-EM-ServiceDetailsOfPersonal/ITI-Govt-EM-ServiceDetailsOfPersonal.component';
import { ITIGovtEMStaffProfileComponent } from '../ITI-Govt-EM-StaffProfile/ITI-Govt-EM-StaffProfile.component';

@Component({
  selector: 'ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab',
  templateUrl: './ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component.html',
  styleUrls: ['./ITI-GOVT-EM-PersonalDetailsApplication-Form-Tab.component.css'],
    standalone: false
})
export class ITIGOVTEMPersonalDetailsApplicationFormTabComponent implements OnInit {
  TabEnableDisable:any[] = [] ;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  ApplicationID: number = 0;
  public searchRequest = new ItiApplicationSearchmodel()
  public PersonalDetailsData: any = []
  dateConfiguration = new DateConfigurationModel();
  public AdmissionDateList: any = []
  public CheckUserID: number = 0
  completedTabs = [true, false, false]; // Keep track of completed tabs
  tabs =
    [
      { TabName: 'StaffProfile Detail', TabNameHI: 'व्यक्तिगत विवरण फॉर्म', component: ITIGovtEMStaffProfileComponent, TabIcon: 'ti ti-school' },
      { TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', component: ITIGovtEMEducationalQualificationComponent, TabIcon: 'ti ti-school' },
      { TabName: 'Service Details Of Personnel', TabNameHI: 'कार्मिक का सेवा विवरण', component: ITIGovtEMServiceDetailsOfPersonalComponent, TabIcon: 'ti ti-map-pin' }
      //{ TabName: 'Option Form', TabNameHI: 'विकल्प प्रपत्र', component: OptionFormTabComponent, TabIcon: 'ti ti-license' },
      //{ TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', component: QualificationTabComponent, TabIcon: 'ti ti-school' },
      //{ TabName: 'Address Details', TabNameHI: 'पते का विवरण', component: AddressDetailsFormTabComponent, TabIcon: 'ti ti-map-pin' },
      //{ TabName: 'Documents', TabNameHI: 'दस्तावेज़', component: DocumentDetailsFormTabComponent, TabIcon: 'ti ti-file' },
      //{ TabName: 'Preview', TabNameHI: 'समीक्षा', component: PreviewFormTabComponent, TabIcon: 'ti ti-checkbox' }
    ] as { TabName: string; TabNameHI: string; component: Type<any>, TabIcon: string }[];

    public SSOLoginDataModel = new SSOLoginDataModel();
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private encryptionService: EncryptionService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private dateMasterService: DateConfigService,
    private toastr: ToastrService

  ) { }
  async ngOnInit()
  {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("SSOLoginDataModel", this.SSOLoginDataModel)

    //this.ApplicationID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    //console.log(this.ApplicationID)
    //alert()
    //if (this.ApplicationID > 0) {
    //  this.selectTab(0); // Automatically activate first tab
    //  this.loadComponent(this.ApplicationID);
    //}

    

   /* await this.GetITIDateDataList();*/
   
    //this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('id') ?? "0")) 
    //if (!this.ApplicationID)
    //{
    //  window.open(`/StudentJanAadharDetail`, "_self");
    //}


    //await this.GetPersonalDetailsById()
    //await this.GetActiveTabList();
    this.CheckUserID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    console.log(this.CheckUserID)
    if (this.CheckUserID != 0) {
      this.completedTabs = [true, true, true]; 

    }


  }

  ngAfterViewInit(): void {
    this.loadComponent(this.selectedTabIndex); 
    this.cdr.detectChanges();
  }


  public selectTab(index: number): void {
    this.selectedTabIndex = index;
    this.loadComponent(index);
  }

  public loadComponent(index: number): void {
    const component = this.tabs[index].component;
    const factory = this.resolver.resolveComponentFactory(component);
    this.tabContent.clear();
    const componentRef = this.tabContent.createComponent(factory);

    (componentRef.instance as any).formSubmitSuccess?.subscribe(() => {
      this.completedTabs[index] = true;
      if (this.selectedTabIndex < this.tabs.length - 2) {
        this.selectedTabIndex++;
        this.loadComponent(this.selectedTabIndex); 
      }
    });

   
    (componentRef.instance as any).tabChange?.subscribe((targetIndex: number) => {
      this.handleTabChange(targetIndex);
    });
  }

  public handleTabChange(index: number): void {
    this.completedTabs[index] = true
    console.log('Received tab change request from child:', index);
    this.selectTab(index);
  }

  async GetActiveTabList() {
    try {
      this.loaderService.requestStarted();
      const RoleID = this.SSOLoginDataModel.RoleID
      await this.commonFunctionService.GetActiveTabList(2, this.ApplicationID, RoleID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TabEnableDisable = data['Data'];
          console.log("TabEnableDisable",this.TabEnableDisable)
          this.completedTabs = this.TabEnableDisable
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

  async GetPersonalDetailsById() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.ApplicationID = this.ApplicationID
      await this.ItiApplicationFormService.GetApplicationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data['Data'] != null) {
            
            this.PersonalDetailsData = data['Data']
            console.log("PersonalDetailsData",this.PersonalDetailsData);
            if (data['Data']['IsFinalSubmit'] == 2) {
              this.router.navigate(['/Itipreviewform'], {
                queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
              });
            }
            if( this.PersonalDetailsData.DirectAdmissionType !== 0) {
              this.tabs.splice(4, 1)      
            }

          }
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetITIDateDataList()
  {
    try {
      
      this.dateConfiguration.DepartmentID = EnumDepartment.ITI;
      this.dateConfiguration.SSOID = this.SSOLoginDataModel.SSOID;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) =>
        {
          data = JSON.parse(JSON.stringify(data));
          this.AdmissionDateList = data['Data'];
          const today = new Date();
          const deptID = EnumDepartment.ITI;
          var activeCourseID: any = [];
          var lnth = this.AdmissionDateList.filter(function (x: any) { return new Date(x.To_Date) > today && new Date(x.From_Date) < today && x.TypeID == EnumConfigurationType.Admission && x.DepartmentID == deptID }).length
          if (lnth <= 0)
          {
            this.toastr.warning("Addmission Date is not Open")
            this.router.navigate(['/dashboard'])
          }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
    
}
