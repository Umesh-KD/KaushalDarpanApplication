import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DateConfigurationModel } from '../../../../Models/DateConfigurationDataModels';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { DateConfigService } from '../../../../Services/DateConfiguration/date-configuration.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { CandidatePersonalDetailsComponent } from '../candidate-personal-details/candidate-personal-details.component';
import { CandidateDocumentDetailsComponent } from '../candidate-document-details/candidate-document-details.component';
import { CandidateOptionDetailsComponent } from '../candidate-option-details/candidate-option-details.component';
import { CandidateFormPreviewComponent } from '../candidate-form-preview/candidate-form-preview.component';

@Component({
  selector: 'app-couselling-candidate-form-tab',
  standalone: false,
  templateUrl: './couselling-candidate-form-tab.component.html',
  styleUrl: './couselling-candidate-form-tab.component.css'
})
export class CousellingCandidateFormTabComponent {
  TabEnableDisable:any[] = [] ;
    @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
    selectedTabIndex = 0;
    ApplicationID: number = 0;
    CandidateID: number = 0;
    public searchRequest = new ItiApplicationSearchmodel()
    public PersonalDetailsData: any = []
    dateConfiguration = new DateConfigurationModel();
    public AdmissionDateList: any = []
    public IsJailCollege: boolean = false
  
  
    completedTabs = [true, false, false, false, false, true]; // Keep track of completed tabs
    tabs =
      [
        { TabName: 'Personal Details', TabNameHI: 'व्यक्तिगत विवरण', component: CandidatePersonalDetailsComponent, TabIcon: 'ti ti-user' },
        { TabName: 'Documents', TabNameHI: 'दस्तावेज़', component: CandidateDocumentDetailsComponent, TabIcon: 'ti ti-file' },
        { TabName: 'Option Form', TabNameHI: 'विकल्प प्रपत्र', component: CandidateOptionDetailsComponent, TabIcon: 'ti ti-license' },
        { TabName: 'Preview', TabNameHI: 'समीक्षा', component: CandidateFormPreviewComponent, TabIcon: 'ti ti-checkbox' }
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
      private dateMasterService: DateConfigService,
      private toastr: ToastrService
  
    ) { }
    async ngOnInit()
    {
      this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      console.log("SSOLoginDataModel",this.SSOLoginDataModel)
      this.CandidateID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0")) 
      // if (!this.ApplicationID)
      // {
      //   window.open(`/StudentJanAadharDetail`, "_self");
      // }
  
      // await this.GetPersonalDetailsById()
      // await this.GetITIJailDateList();
      // await this.GetActiveTabList();
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
  
    // async GetActiveTabList() {
    //   try {
    //     this.loaderService.requestStarted();
    //     const RoleID = this.SSOLoginDataModel.RoleID
    //     await this.commonFunctionService.GetActiveTabList(2, this.ApplicationID, RoleID)
    //       .then((data: any) => {
    //         data = JSON.parse(JSON.stringify(data));
    //         this.TabEnableDisable = data['Data'];
    //         console.log("TabEnableDisable",this.TabEnableDisable)
    //         this.completedTabs = this.TabEnableDisable
    //       }, error => console.error(error));
    //   }
    //   catch (Ex) {
    //     console.log(Ex);
    //   }
    //   finally {
    //     setTimeout(() => {
    //       this.loaderService.requestEnded();
    //     }, 200);
    //   }
    // }
  
    // async GetPersonalDetailsById() {
    //   try {
    //     this.loaderService.requestStarted();
    //     this.searchRequest.ApplicationID = this.ApplicationID
    //     await this.ItiApplicationFormService.GetApplicationDatabyID(this.searchRequest)
    //       .then((data: any) => {
    //         data = JSON.parse(JSON.stringify(data));
    //         if (data['Data'] != null) {
    //           debugger
    //           this.PersonalDetailsData = data['Data']
    //           console.log("PersonalDetailsData",this.PersonalDetailsData);
    //           if(this.PersonalDetailsData.DirectAdmissionType == 1) {
    //             if (data['Data']['IsFinalSubmit'] == 2) {
    //               this.router.navigate(['/Itipreviewform'], {
    //                 queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
    //               });
    //             }
  
    //             if( this.PersonalDetailsData.DirectAdmissionType == 1) {
    //               this.tabs.splice(1, 1)      
    //             }
    //           } else {
    //             if (data['Data']['IsFinalSubmit'] == 2) {
    //               this.router.navigate(['/Itipreviewform'], {
    //                 queryParams: { AppID: this.encryptionService.encryptData(this.ApplicationID) }
    //               });
    //             }
    //           }
    //         }
    //       }, error => console.error(error));
    //   }
    //   catch (ex) { console.log(ex) }
    //   finally {
    //     setTimeout(() => {
    //       this.loaderService.requestEnded();
    //     }, 200);
    //   }
    // }
  
    
}
