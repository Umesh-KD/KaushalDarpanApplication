import { ChangeDetectorRef, Component, ComponentFactoryResolver, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
/*import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';*/

import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';

import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';


//import { ItiGeneralInstructionsComponent } from './iti-general-Instructions/iti-general-Instructions.component';
import { EnumStatus } from '../../Common/GlobalConstants';
//import { AllotmentStatusITIComponent } from '../../allotment-status-iti/allotment-status-iti.component';
import { ItiGeneralInstructionsComponent } from '../itipublic-info-tabs/iti-general-Instructions/iti-general-Instructions.component';
//import { ItiAdmissionComponent } from '../itipublic-info-tabs/iti-admission/iti-admission.component';
import { ItiCollegeSearchComponent } from '../ITI/results/iti-college-search/iti-college-search.component';
import { RevealuationComponent } from '../ITI/Examination/revealuation/revealuation.component';
import { KnowRevealuationITIComponent } from '../ITI/Examination/know-revealuation-iti/know-revealuation-iti.component';
import { downloadITIResultComponent } from '../itipublic-info-tabs/download-ITI-Result/download-ITI-Result.component';
//import { ItiAdmissionComponent } from './iti-admission/iti-admission.component';
//import { KnowMeritITIComponent } from './know-merit-iti/know-merit-iti.component';
//import { UpwardMomentITIComponent } from './upward-moment-iti/upward-moment-iti.component';
//import { ItiCollegeSearchComponent } from './iti-college-search/iti-college-search.component';
//import { ItiVacantSeatDirectAdmissionComponent } from './iti-vacantseatfor-directadmission/iti-vacantseatfor-directadmission.component';
//import { DownloadApplicationFormComponent } from './download-application-form/download-application-form.component';


@Component({
  selector: 'app-iti-Examination-public-info-Tabs',
  templateUrl: './iti-Examination-public-info-Tabs.component.html',
  styleUrl: './iti-Examination-public-info-Tabs.component.css',
  standalone: false
})
export class ITIExaminationPublicInfoTabsComponent implements OnInit {
  public tabs: any[] = [];
  public DepartmentID: number = 2
  public sessionData = new AdmissionSessionDataModel();
  @Input() TypeId: number = 0;
  @Input() CourseId: number = 0;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  sSOLoginDataModel = new SSOLoginDataModel();
  //public RollNo = ''
//  public dob = ''


  @ViewChild(downloadITIResultComponent)
  downloadITIResultComponent!: downloadITIResultComponent;
  constructor(private resolver: ComponentFactoryResolver,
    private Swal2: SweetAlert2, private router: Router, private routers: ActivatedRoute,
    private cdr: ChangeDetectorRef, private route: ActivatedRoute,
    private commonservice: CommonFunctionService) {

  }
  @Input() RollNo!: string;
  @Input() dob!: string;

  async ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const roll = params['rollNo'];
      const Dob = params['dob'];

      if (roll) {
        this.RollNo = roll;
      }

      if (Dob) {
        this.dob = Dob;
      }

  
    });

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
   
    this.tabs.push({ TabName: 'Download ITI Result', TabNameHI: 'आईटीआई परिणाम डाउनलोड करें', TabIcon: 'ti ti-license', component: downloadITIResultComponent, DepartmentID: 2, CourseTypeId: 1, Enable: false, HasLink: false });


  }

  public ngAfterViewInit(): void {

    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;
    this.ChangeDepartment();
    this.loadComponent(this.selectedTabIndex, (this.CourseId > 0 ? this.CourseId : this.tabs[0]?.CourseTypeId), this.tabs[0]?.TabName, this.tabs[0]?.TabNameHi);
    this.cdr.detectChanges();




  }


  public async ChangeDepartment(DepartmentID: number = this.DepartmentID) {
    this.CourseId = Number(this.routers.snapshot.queryParamMap.get('courseid'));
    this.CourseId = isNaN(this.CourseId) ? 0 : this.CourseId;

    this.selectedTabIndex = 0;
    this.LoadTabs();

    this.tabs = this.tabs.filter((f: any) => f.DepartmentID == DepartmentID);

    if (!this.tabs.length) {
      console.error('No tabs found for DepartmentID:', DepartmentID);
      return;
    }

    await this.loadComponent(
      this.selectedTabIndex,
      (this.CourseId > 0 ? this.CourseId : this.tabs[0].CourseTypeId),
      this.tabs[0].TabName,
      this.tabs[0].TabNameHI
    );

    this.cdr.detectChanges();
    this.DepartmentID = DepartmentID;
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


  //public async loadComponent(index: number, CourseTypeId: number, CourseTypeName: string, CourseTypeNameHi: string) {
  //  const component = this.tabs[index]?.component;

  //  if (!component) {
  //    console.error('Component is undefined for tab index:', index, this.tabs);
  //    return;
  //  }

  //  const factory = this.resolver.resolveComponentFactory(component);
  //  this.tabContent.clear();
  //  const componentRef = this.tabContent.createComponent(factory);


  //  this.downloadITIResultComponent.itiResultRequest.RollNo = this.RollNo;
  //  this.downloadITIResultComponent.itiResultRequest.DOB = this.dob;
  //  this.downloadITIResultComponent.itiResultRequest.EndTermID = 37;
  //}
  childComponentRef: any;
  public async loadComponent(index: number, CourseTypeId: number, CourseTypeName: string, CourseTypeNameHi: string) {

    const component = this.tabs[index]?.component;

    if (!component) {
      console.error('Component is undefined for tab index:', index, this.tabs);
      return;
    }

    const factory = this.resolver.resolveComponentFactory(component);
    this.tabContent.clear();

    this.childComponentRef = this.tabContent.createComponent(factory);


    this.childComponentRef.instance.RollNo = this.RollNo;
    this.childComponentRef.instance.DOB = this.dob;
    this.childComponentRef.instance.EndTermID = 37;


    this.cdr.detectChanges();
  }


    

}
