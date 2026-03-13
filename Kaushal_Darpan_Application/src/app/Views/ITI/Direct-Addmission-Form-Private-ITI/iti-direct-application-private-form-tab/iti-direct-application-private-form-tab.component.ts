import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { EnumConfigurationType, EnumDepartment, EnumDirectAdmissionType, EnumRole, JailCollegeID } from '../../../../Common/GlobalConstants';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { ITIDirectPersonalPrivateDetailsComponent } from '../iti-direct-personal-private-details/iti-direct-personal-private-details.component';
import { ITIDirectOptionPrivateFormComponent } from '../iti-direct-option-private-form/iti-direct-option-private-form.component';
import { ITIDirectQualificationPrivateFormComponent } from '../iti-direct-qualification-private-form/iti-direct-qualification-private-form.component';
import { ITIDirectAddressPrivateFormComponent } from '../iti-direct-address-private-form/iti-direct-address-private-form.component';
import { ITIDirectDocumentPrivateFormComponent } from '../iti-direct-document-private-form/iti-direct-document-private-form.component';
import { ITIDirectPreviewPrivateFormComponent } from '../iti-direct-preview-private-form/iti-direct-preview-private-form.component';
import { ITIDirectExperienceComponent } from '../iti-direct-expereince/iti-direct-experience.component';


@Component({
  selector: 'app-iti-direct-application-private-form-tab',
  standalone: false,
  templateUrl: './iti-direct-application-private-form-tab.component.html',
  styleUrl: './iti-direct-application-private-form-tab.component.css'
})
export class ITIDirectApplicationPrivateFormTabComponent {
  TabEnableDisable:any[] = [] ;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  ApplicationID: number = 0;
  public searchRequest = new ItiApplicationSearchmodel()
  public PersonalDetailsData: any = []
  dateConfiguration = new DateConfigurationModel();
  public AdmissionDateList: any = []
  public IsJailCollege: boolean = false


  completedTabs = [true, false,  false, false, true]; // Keep track of completed tabs
  tabs =
    [
      { TabName: 'Personal Details', TabNameHI: 'व्यक्तिगत विवरण', component: ITIDirectPersonalPrivateDetailsComponent, TabIcon: 'ti ti-user' },
/*      { TabName: 'Option Form', TabNameHI: 'विकल्प प्रपत्र', component: ITIDirectOptionPrivateFormComponent, TabIcon: 'ti ti-license' },*/
      { TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', component: ITIDirectQualificationPrivateFormComponent, TabIcon: 'ti ti-school' },
      { TabName: 'Experience Detail', TabNameHI: 'अनुभव विवरण', component: ITIDirectExperienceComponent, TabIcon: 'ti ti-briefcase' },

      { TabName: 'Address Details', TabNameHI: 'पते का विवरण', component: ITIDirectAddressPrivateFormComponent, TabIcon: 'ti ti-map-pin' },
      { TabName: 'Documents', TabNameHI: 'दस्तावेज़', component: ITIDirectDocumentPrivateFormComponent, TabIcon: 'ti ti-file' },
      { TabName: 'Preview', TabNameHI: 'समीक्षा', component: ITIDirectPreviewPrivateFormComponent, TabIcon: 'ti ti-checkbox' }
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
    console.log("SSOLoginDataModel",this.SSOLoginDataModel)
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    debugger
    if (!this.ApplicationID)
    {
      window.open(`/StudentJanAadharDetail`, "_self");
    }

    await this.GetPersonalDetailsById()
    await this.GetITIJailDateList();
    await this.GetActiveTabList();
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
            debugger
            this.PersonalDetailsData = data['Data']
            console.log("PersonalDetailsData",this.PersonalDetailsData);
            if(this.PersonalDetailsData.DirectAdmissionType == 9) {
              if (data['Data']['IsFinalSubmit'] == 2) {
                this.router.navigate(['/directItipreviewform'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
                });
              }

              //if( this.PersonalDetailsData.DirectAdmissionType ==9) {
              //  this.tabs.splice(1, 1)      
              //}
            } else {
              if (data['Data']['IsFinalSubmit'] == 2) {
                this.router.navigate(['/directItipreviewform'], {
                  queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID)
              }
                });
              }
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

  async GetITIJailDateList()
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
          debugger
    
          var lnth =
            this.AdmissionDateList.filter(function (x: any) { return new Date(x.To_Date) > today && new Date(x.From_Date) < today && x.TypeID == EnumConfigurationType.DIRECT_ADDMISSSION_PRIVATE && x.DepartmentID == deptID }).length
            if (lnth <= 0)
            {
              this.toastr.warning("Addmission Date is not Open")
              this.router.navigate(['/dashboard'])
            
          }
          // var lnth =
          //   this.AdmissionDateList.filter(function (x: any) { return new Date(x.To_Date) > today && new Date(x.From_Date) < today && x.TypeID == EnumConfigurationType.JailAdmission && x.DepartmentID == deptID }).length
          // if (lnth <= 0)
          // {
          //   this.toastr.warning("Addmission Date is not Open")
          //   this.router.navigate(['/dashboard'])
          // }
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  checkJailCollege() {
    JailCollegeID.map((item: any) => {
      if (item === this.SSOLoginDataModel.InstituteID) {
        this.IsJailCollege = true
      }
    })
  }


}
