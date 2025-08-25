import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
/*import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';*/

import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';

import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';


import { ItiGeneralInstructionsComponent } from './iti-general-Instructions/iti-general-Instructions.component';
import { EnumStatus } from '../../Common/GlobalConstants';
import { AllotmentStatusITIComponent } from './allotment-status-iti/allotment-status-iti.component';
import { ItiAdmissionComponent } from './iti-admission/iti-admission.component';
import { KnowMeritITIComponent } from './know-merit-iti/know-merit-iti.component';
import { UpwardMomentITIComponent } from './upward-moment-iti/upward-moment-iti.component';
import { ItiCollegeSearchComponent } from './iti-college-search/iti-college-search.component';


@Component({
  selector: 'app-itipublic-info-tabs',
  templateUrl: './itipublic-info-tabs.component.html',
  styleUrl: './itipublic-info-tabs.component.css',
  standalone: false
})
export class ITIPublicInfoTabsComponent implements OnInit {
  public tabs: any[] = [];
  public DepartmentID: number = 2
  public sessionData = new AdmissionSessionDataModel();
  @Input() TypeId: number = 0;
  @Input() CourseId: number = 0;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  //public departmentId = 1;
  //    
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private resolver: ComponentFactoryResolver,
    private Swal2: SweetAlert2, private router: Router, private routers: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private commonservice: CommonFunctionService) {

  }

  async ngOnInit() {
    await this.GetCurrentAdmissionSession();
    await this.LoadTabs();
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
    this.tabs = [] as { TabName: string; TabNameHI: string; TabIcon: string; component: Type<any>; DepartmentID: number; CourseTypeId: number, Enable: boolean, HasLink: boolean, Link: string }[];
    this.tabs.push({ TabName: 'General Instructions', TabNameHI: 'सामान्य निर्देश', TabIcon: 'ti ti-license', component: ItiGeneralInstructionsComponent, DepartmentID: 2, CourseTypeId: 1, Enable: false, HasLink: false });
    this.tabs.push({ TabName: 'Apply for ITI Admission', TabNameHI: 'प्रवेश हेतु आवेदन करें', TabIcon: 'ti ti-license', component: ItiAdmissionComponent, DepartmentID: 1, CourseTypeId: 1, Enable: false, HasLink: false });
    this.tabs.push({ TabName: 'Know Your Merit', TabNameHI: 'मेरिट क्रमांक जानें', TabIcon: 'ti ti-license', component: KnowMeritITIComponent, DepartmentID: 2, HasLink: false });
    this.tabs.push({ TabName: 'Allotment Status', TabNameHI: 'आवंटन स्थिति', TabIcon: 'ti ti-exchange', component: AllotmentStatusITIComponent, DepartmentID: 2, HasLink: false });
    this.tabs.push({ TabName: 'Upward Movement', TabNameHI: 'अपवर्ड मोमेंट', TabIcon: 'ti ti-exchange', component: UpwardMomentITIComponent, DepartmentID: 2, HasLink: false });
    this.tabs.push({ TabName: 'ITI College Search', TabNameHI: 'आईटीआई कॉलेज खोज', TabIcon: 'ti ti-license', component: ItiCollegeSearchComponent, DepartmentID: 2, HasLink: false });

  }
  public ngAfterViewInit(): void {

    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;
    this.ChangeDepartment();
    this.loadComponent(this.selectedTabIndex, (this.CourseId > 0 ? this.CourseId : this.tabs[0].CourseTypeId), this.tabs[0].TabName, this.tabs[0].TabNameHi);
    this.cdr.detectChanges();

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
  public async loadComponent(index: number, CourseTypeId: number, CourseTypeName: string, CourseTypeNameHi: string) {
    debugger;
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
