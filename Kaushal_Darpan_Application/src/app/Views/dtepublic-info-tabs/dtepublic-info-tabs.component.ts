import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { KnowMeritComponent } from '../Emitra/know-merit/know-merit.component';
import { AllotStatusComponent } from '../Emitra/allotment-status/allot-status.component';
import { StudentEmitraFeePaymentComponent } from '../Student/student-emitra-fee-payment/student-emitra-fee-payment.component';
import { StudentEmitraITIFeePaymentComponent } from '../Student/student-emitra-iti-fee-payment/student-emitra-iti-fee-payment.component';
import { UpwardMomentComponent } from '../Emitra/upward-moment/upward-moment.component';
import { Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
/*import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';*/
import { EnumEmitraService, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';
import { DTEApplicationComponent } from '../Emitra/dte-application/dte-application.component';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { DateConfigService } from '../../Services/DateConfiguration/date-configuration.service';
import { DateConfigurationModel } from '../../Models/DateConfigurationDataModels';
import { EditOptionFormComponent } from '../Emitra/edit-option-form/edit-option-form.component';
import { UploadDeficiencyComponent } from '../Emitra/upload-deficiency/upload-deficiency.component';
import { DifferenceFormComponent } from '../Emitra/difference-form/difference-form.component';
import { CorrectMeritComponent } from '../BTER/BterMerit/correct-merit/correct-merit.component';
import { CorrectionMeritComponent } from '../Emitra/merit-correction/merit-correction.component';
import { PublicInfoDataModel } from '../../Models/PublicInfoDataModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dtepublic-info-tabs',
  templateUrl: './dtepublic-info-tabs.component.html',
  styleUrl: './dtepublic-info-tabs.component.css',
  standalone: false
})
export class DTEPublicInfoTabsComponent implements OnInit {
  public tabs: any[] = [];
  public PublicInfoList: any[] = [];
  public PublicInfoDownloadsList: any[] = [];
  public PublicInfoHighlightsList: any[] = [];
  public PublicInfoNoteList: any[] = [];
  public DepartmentID: number = 1
  public sessionData = new AdmissionSessionDataModel();
  public requestPublic = new PublicInfoDataModel();

  @Input() TypeId: number = 0;
  @Input() CourseId: number = 0;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  //public departmentId = 1;
  //    
  sSOLoginDataModel = new SSOLoginDataModel();
 
  constructor(private resolver: ComponentFactoryResolver, private http: HttpClient,
    private Swal2: SweetAlert2, private router: Router, private routers: ActivatedRoute,
    private cdr: ChangeDetectorRef, private appsettingConfig: AppsettingService,
    private commonservice: CommonFunctionService) {
   
  }

  async ngOnInit() {
    await this.GetCurrentAdmissionSession();
    await this.LoadTabs();
    await this.GetPublicInfo();
  }

  async GetPublicInfo() {
    //alert(this.CourseId);
    try {

      //this.requestPublic.CourseTypeId = this.TypeId
      this.requestPublic.CourseTypeId = this.CourseId
      this.requestPublic.CreatedBy = 0
      this.requestPublic.DepartmentId = 1;
      this.requestPublic.Actoin = 'LIST';
      this.requestPublic.PageNumber = 1
      this.requestPublic.PageSize = 999999;
      await this.commonservice.PublicInfo(this.requestPublic)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PublicInfoList = data.Data;
          this.PublicInfoDownloadsList = this.PublicInfoList.filter(function (dat: any) { return dat.PublicInfoTypeId == 1 });
          this.PublicInfoHighlightsList = this.PublicInfoList.filter(function (dat: any) { return dat.PublicInfoTypeId == 2 });
          this.PublicInfoNoteList = this.PublicInfoList.filter(function (dat: any) { return dat.PublicInfoTypeId == 3 });

        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        //this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetCurrentAdmissionSession() {
    try {
      await this.commonservice.GetCurrentAdmissionSession(this.DepartmentID)
        .then(async (data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.sessionData = data.Data[0];        
          }
          else {

          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {

      }, 200);
    }
  }



  async LoadTabs() {
    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;
    
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.tabs = [] as { TabName: string; TabNameHI: string; TabIcon: string; component: Type<any>; DepartmentID: number; CourseTypeId: number, Enable: boolean, HasLink: boolean, Link: string }[];

    //this.tabs = [
    //  { TabName: 'Diploma 1st Year Eng', TabNameHI: 'प्रथम वर्ष इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 1, Enable: false },
    //  { TabName: 'Diploma Non-Engineering 1st Year', TabNameHI: 'प्रथम वर्ष नॉन-इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 2, Enable: false },
    //  { TabName: 'Diploma 2nd Year Eng Lateral Admission', TabNameHI: 'डिप्लोमा द्वितीय वर्ष इंजीनियरिंग लेटरल प्रवेश', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 3, Enable: false },

    //  { TabName: 'Degree Course 1st Year Non-Engg', TabNameHI: 'डिग्री कोर्स प्रथम वर्ष नॉन-इंजीनियरिंग', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 4, Enable: false },
    //  { TabName: 'Degree Course 2nd Year Lateral', TabNameHI: 'डिग्री कोर्स द्वितीय वर्ष लेटरल', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 5, Enable: false },

    //  { TabName: 'Know Your Merit', TabNameHI: 'मेरिट क्रमांक जानें', TabIcon: 'ti ti-license', component: KnowMeritComponent, DepartmentID: 1 },
    //  { TabName: 'Allotment Status', TabNameHI: 'आवंटन स्थिति', TabIcon: 'ti ti-exchange', component: AllotStatusComponent, DepartmentID: 1 },
    //  { TabName: 'Upward Moment', TabNameHI: 'अपवर्ड मोमेंट', TabIcon: 'ti ti-exchange', component: UpwardMomentComponent, DepartmentID: 1 },

    //  { TabName: 'Know Your Merit', TabNameHI: 'मेरिट क्रमांक जानें', TabIcon: 'ti ti-license', component: KnowMeritITIComponent, DepartmentID: 2 },
    //  { TabName: 'Upward Moment', TabNameHI: 'अपवर्ड मोमेंट', TabIcon: 'ti ti-exchange', component: UpwardMomentITIComponent, DepartmentID: 2 },
    //  { TabName: 'Allotment Status', TabNameHI: 'आवंटन स्थिति', TabIcon: 'ti ti-exchange', component: AllotmentStatusITIComponent, DepartmentID: 2 },
      
    //] as { TabName: string; TabNameHI: string; TabIcon: string; component: Type<any>; DepartmentID: number; CourseTypeId: number, Enable: boolean }[];
    
    var isshowAll = true;
    if (this.sSOLoginDataModel != null) {
      if (this.sSOLoginDataModel != null && this.sSOLoginDataModel.RoleID == 4 && EnumEmitraService.BTER_DeplomaENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID) {
        this.tabs.push({ TabName: 'Diploma 1st Year Eng', TabNameHI: 'प्रथम वर्ष इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 1, Enable: false, HasLink:false });
        isshowAll = false;
      } else if (this.sSOLoginDataModel != null && this.sSOLoginDataModel.RoleID == 4 && EnumEmitraService.BTER_DeplomaNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID) {
        this.tabs.push({ TabName: 'Diploma Non-Engineering 1st Year', TabNameHI: 'प्रथम वर्ष नॉन-इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 2, Enable: false, HasLink: false });
        isshowAll = false;
      } else if (this.sSOLoginDataModel != null && this.sSOLoginDataModel.RoleID == 4 && EnumEmitraService.BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID) {
        this.tabs.push({ TabName: 'Diploma 2nd Year Eng Lateral Admission', TabNameHI: 'डिप्लोमा द्वितीय वर्ष इंजीनियरिंग लेटरल प्रवेश', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 3, Enable: false, HasLink: false });
        isshowAll = false;
      } else if (this.sSOLoginDataModel != null && this.sSOLoginDataModel.RoleID == 4 && EnumEmitraService.BTER_DegreeNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID) {
        this.tabs.push({ TabName: 'Degree Course 1st Year Non-Engg', TabNameHI: 'डिग्री कोर्स प्रथम वर्ष नॉन-इंजीनियरिंग', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 4, Enable: false, HasLink: false });
        isshowAll = false;
      } else if (this.sSOLoginDataModel != null && this.sSOLoginDataModel.RoleID == 4 && EnumEmitraService.BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID) {
        this.tabs.push({ TabName: 'Degree Course 2nd Year Lateral', TabNameHI: 'डिग्री कोर्स द्वितीय वर्ष लेटरल', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 5, Enable: false, HasLink: false });
        isshowAll = false;
      }
    } else {
      isshowAll = true;
    }
    if (this.sSOLoginDataModel.SSOID == 'RJJP198919016890') {
      isshowAll = true;
    }
    if (isshowAll) {
      if (this.CourseId == 1) {
        this.selectedTabIndex = 0;
        this.tabs.push({ TabName: 'Diploma 1st Year Eng', TabNameHI: 'प्रथम वर्ष इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 1, Enable: false, HasLink: false });
         
      } else if (this.CourseId == 2) {
        this.selectedTabIndex = 0;
        this.tabs.push({ TabName: 'Diploma Non-Engineering 1st Year', TabNameHI: 'प्रथम वर्ष नॉन-इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 2, Enable: false, HasLink: false });
          


      } else if (this.CourseId == 3) {
        this.selectedTabIndex = 0;
       this.tabs.push({ TabName: 'Diploma 2nd Year Eng Lateral Admission', TabNameHI: 'डिप्लोमा द्वितीय वर्ष इंजीनियरिंग लेटरल प्रवेश', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 3, Enable: false, HasLink: false });
          

      } else if (this.CourseId == 4) {
        this.selectedTabIndex = 0;
        this.tabs.push({ TabName: 'Degree Course 1st Year Non-Engg', TabNameHI: 'डिग्री कोर्स प्रथम वर्ष नॉन-इंजीनियरिंग', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 4, Enable: false, HasLink: false });
         
      } else if (this.CourseId == 5) {
        this.selectedTabIndex = 0;
       this.tabs.push({ TabName: 'Degree Course 2nd Year Lateral', TabNameHI: 'डिग्री कोर्स द्वितीय वर्ष लेटरल', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 5, Enable: false, HasLink: false });
          
      }
      else {
        this.tabs.push({ TabName: 'Diploma 1st Year Eng', TabNameHI: 'प्रथम वर्ष इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 1, Enable: false, HasLink: false });
        this.tabs.push({ TabName: 'Diploma Non-Engineering 1st Year', TabNameHI: 'प्रथम वर्ष नॉन-इंजीनियरिंग प्रवेश ', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 2, Enable: false, HasLink: false });
        this.tabs.push({ TabName: 'Diploma 2nd Year Eng Lateral Admission', TabNameHI: 'डिप्लोमा द्वितीय वर्ष इंजीनियरिंग लेटरल प्रवेश', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 3, Enable: false, HasLink: false });
        this.tabs.push({ TabName: 'Degree Course 1st Year Non-Engg', TabNameHI: 'डिग्री कोर्स प्रथम वर्ष नॉन-इंजीनियरिंग', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 4, Enable: false, HasLink: false });
        this.tabs.push({ TabName: 'Degree Course 2nd Year Lateral Non-Engg', TabNameHI: 'डिग्री कोर्स द्वितीय वर्ष लेटरल नॉन-इंजीनियरिंग', TabIcon: 'ti ti-license', component: DTEApplicationComponent, DepartmentID: 1, CourseTypeId: 5, Enable: false, HasLink: false });
      }
    }

    this.tabs.push({ TabName: 'Know Your Merit', TabNameHI: 'मेरिट क्रमांक जानें', TabIcon: 'ti ti-license', component: KnowMeritComponent, DepartmentID: 1, CourseTypeId: 1, HasLink: false });
    this.tabs.push({ TabName: 'Correct Your Merit', TabNameHI: 'अपनी मेरिट सुधारें', TabIcon: 'ti ti-license', component: CorrectionMeritComponent, DepartmentID: 1, CourseTypeId: 1, HasLink: false });
    this.tabs.push({ TabName: 'Upward Moment', TabNameHI: 'अपवर्ड मोमेंट', TabIcon: 'ti ti-exchange', component: UpwardMomentComponent, DepartmentID: 1, CourseTypeId: 1, HasLink: false });
    this.tabs.push({ TabName: 'Allotment Status', TabNameHI: 'आवंटन स्थिति', TabIcon: 'ti ti-exchange', component: AllotStatusComponent, DepartmentID: 1, CourseTypeId: 1, HasLink: false });
    this.tabs.push({ TabName: 'Update Options', TabNameHI: 'विकल्पों में बदलाव करें', TabIcon: 'ti ti-exchange', component: EditOptionFormComponent, DepartmentID: 1, CourseTypeId: 1, HasLink: false});
    this.tabs.push({ TabName: 'Know Your Deficiency', TabNameHI: 'कमी पूर्ति करें', TabIcon: 'ti ti-exchange', component: DifferenceFormComponent, DepartmentID: 1, CourseTypeId: 1, HasLink: false});
    
    // this.tabs.push({ TabName: 'Upload Deficiency', TabNameHI: 'Deficiency अपलोड करें', TabIcon: 'ti ti-exchange', component: UploadDeficiencyComponent, DepartmentID: 1, HasLink: false});
    //this.tabs.push({ TabName: 'Placement', TabNameHI: 'प्लेसमेंट', TabIcon: 'ti ti-exchange', component: AllotmentStatusITIComponent, DepartmentID: 2, HasLink: true, Link:"index" });

    //EnumEmitraService.BTER_DeplomaENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
    //EnumEmitraService.BTER_DeplomaNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
    //EnumEmitraService.BTER_DeplomaLateral_2ENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
    //EnumEmitraService.BTER_DegreeNonENG_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID ||
    //EnumEmitraService.BTER_DegreeLateral_2Year_Emitra_AppplicationFeeService.toString() == this.sSOLoginDataModel.ServiceID 


  }
  public ngAfterViewInit(): void {
    
    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;
    this.ChangeDepartment();
    this.loadComponent(this.selectedTabIndex, (this.CourseId > 0 ?this.CourseId:this.tabs[0].CourseTypeId), this.tabs[0].TabName, this.tabs[0].TabNameHi);
    this.cdr.detectChanges();

  }

  DownloadFile(FileName: string): void {
    if (FileName != '') {
      const fileUrl = this.appsettingConfig.StaticFileRootPathURL + GlobalConstants.PublicInfoDocument + "/" + FileName;
      this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = this.generateFileName('pdf');
        downloadLink.click();
        window.URL.revokeObjectURL(url);
      });
    }
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  public async ChangeDepartment(DepartmentID: number = 1) {
    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;
    this.selectedTabIndex = 0
    this.LoadTabs();
    this.tabs = this.tabs.filter((f: any) => f.DepartmentID == DepartmentID);
    await this.loadComponent(this.selectedTabIndex, (this.CourseId > 0 ? this.CourseId : this.tabs[0].CourseTypeId), this.tabs[0].TabName, this.tabs[0].TabNameHi);
    this.cdr.detectChanges();
    this.DepartmentID = DepartmentID
  }

  //Handles tab selection
  public selectTab(index: number, CourseTypeId: number, CourseTypeName: string, CourseTypeNameHi: string): void {
    debugger
    if (index >= 0 && index < this.tabs.length) {
      this.selectedTabIndex = index;
      this.loadComponent(index, CourseTypeId, CourseTypeName, CourseTypeNameHi);
    } else {
      console.error('Invalid tab index:', index);
    }
  }


  //public selectTab(index: number, CourseTypeId: number, CourseTypeName: string): void {
    
  //  const selectedComponent = this.tabs[index].component;

  //  // Only show confirmation for DTEApplicationComponent
  //  if (selectedComponent == DTEApplicationComponent) {
  //    this.Swal2.Confirmation(
  //      "Are you sure you want to applying for the admission form ?<br>क्या आप वाकई प्रवेश फार्म के लिए आवेदन करना चाहते हैं ?",
  //      async (result: any) => {
  //        if (result.isConfirmed) {
  //          this.selectedTabIndex = index;
  //          this.loadComponent(index, CourseTypeId, CourseTypeName);
  //        }
  //      });
  //  } else {
  //    // For other tabs, load directly
  //    this.selectedTabIndex = index;
  //    this.loadComponent(index, CourseTypeId, CourseTypeName);
  //  }
  //}



  // Dynamically loads the selected component
  public async  loadComponent(index: number, CourseTypeId: number, CourseTypeName: string, CourseTypeNameHi: string) {
    
    const component = this.tabs[index].component;


    const factory = this.resolver.resolveComponentFactory(component);
    this.tabContent.clear();
       

    const componentRef = this.tabContent.createComponent(factory);
    const instance = componentRef.instance as any;

    //componentRef.instance.DepartmentId = CourseTypeId;

    (componentRef.instance as any).CourseTypeId = CourseTypeId;
    (componentRef.instance as any).CourseTypeName = CourseTypeName;
    (componentRef.instance as any).CourseTypeNameHi = CourseTypeNameHi;
    (componentRef.instance as any).FinancialYearName = this.sessionData.FinancialYearName.toString().substring(0, 4);
    instance.TypeId = this.TypeId; // 👈 Pass @Input TypeId here

    (componentRef.instance as any).tabChange?.subscribe((targetIndex: number) => {
      this.selectTab(targetIndex, CourseTypeId, CourseTypeName, CourseTypeNameHi);
      //this.departmentId
    });
  }

}
