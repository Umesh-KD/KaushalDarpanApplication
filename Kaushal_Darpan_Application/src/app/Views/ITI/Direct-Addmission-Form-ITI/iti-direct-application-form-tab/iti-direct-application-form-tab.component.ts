import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { EnumConfigurationType, EnumDepartment, EnumRole, JailCollegeID } from '../../../../Common/GlobalConstants';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { ToastrService } from 'ngx-toastr';
import { ITIDirectPersonalDetailsComponent } from '../iti-direct-personal-details/iti-direct-personal-details.component';
import { ITIDirectOptionFormComponent } from '../iti-direct-option-form/iti-direct-option-form.component';
import { ITIDirectQualificationFormComponent } from '../iti-direct-qualification-form/iti-direct-qualification-form.component';
import { ITIDirectAddressFormComponent } from '../iti-direct-address-form/iti-direct-address-form.component';
import { ITIDirectDocumentFormComponent } from '../iti-direct-document-form/iti-direct-document-form.component';
import { ITIDirectPreviewFormComponent } from '../iti-direct-preview-form/iti-direct-preview-form.component';


@Component({
  selector: 'app-iti-direct-application-form-tab',
  standalone: false,
  templateUrl: './iti-direct-application-form-tab.component.html',
  styleUrl: './iti-direct-application-form-tab.component.css'
})
export class ITIDirectApplicationFormTabComponent {
  TabEnableDisable:any[] = [] ;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  ApplicationID: number = 0;
  public searchRequest = new ItiApplicationSearchmodel()
  public PersonalDetailsData: any = []
  dateConfiguration = new DateConfigurationModel();
  public AdmissionDateList: any = []
  public IsJailCollege: boolean = false


  completedTabs = [true, false, false, false, false, true]; // Keep track of completed tabs
  tabs =
    [
      { TabName: 'Personal Details', TabNameHI: 'व्यक्तिगत विवरण', component: ITIDirectPersonalDetailsComponent, TabIcon: 'ti ti-user' },
      { TabName: 'Option Form', TabNameHI: 'विकल्प प्रपत्र', component: ITIDirectOptionFormComponent, TabIcon: 'ti ti-license' },
      { TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', component: ITIDirectQualificationFormComponent, TabIcon: 'ti ti-school' },
      { TabName: 'Address Details', TabNameHI: 'पते का विवरण', component: ITIDirectAddressFormComponent, TabIcon: 'ti ti-map-pin' },
      { TabName: 'Documents', TabNameHI: 'दस्तावेज़', component: ITIDirectDocumentFormComponent, TabIcon: 'ti ti-file' },
      { TabName: 'Preview', TabNameHI: 'समीक्षा', component: ITIDirectPreviewFormComponent, TabIcon: 'ti ti-checkbox' }
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
    await this.GetITIJailDateList();
    console.log("SSOLoginDataModel",this.SSOLoginDataModel)
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
    if (!this.ApplicationID)
    {
      window.open(`/StudentJanAadharDetail`, "_self");
    }


    await this.GetPersonalDetailsById()
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
            
            this.PersonalDetailsData = data['Data']
            console.log("PersonalDetailsData",this.PersonalDetailsData);
            if (data['Data']['IsFinalSubmit'] == 2) {
              this.router.navigate(['/Itipreviewform'], {
                queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
              });
            }
            // if( this.PersonalDetailsData.DirectAdmissionType !== 0) {
            //   this.tabs.splice(4, 1)      
            // }

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
            this.AdmissionDateList.filter(function (x: any) { return new Date(x.To_Date) > today && new Date(x.From_Date) < today && x.TypeID == EnumConfigurationType.JailAdmission && x.DepartmentID == deptID }).length
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

  checkJailCollege() {
    JailCollegeID.map((item: any) => {
      if (item === this.SSOLoginDataModel.InstituteID) {
        this.IsJailCollege = true
      }
    })
  }


}
