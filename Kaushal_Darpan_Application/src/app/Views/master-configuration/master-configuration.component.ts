import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { DateConfigurationComponent } from './date-configuration/date-configuration.component';
import { FeeConfigurationComponent } from './fee-configuration/fee-configuration.component';
import { SerialMasterComponent } from './serial-master/serial-master.component';
import { SessionConfigurationComponent } from './session-configuration/session-configuration.component';
import { AllotmentConfigurationComponent } from './allotment-configuration/allotment-configuration.component';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { EnumRole } from '../../Common/GlobalConstants';

@Component({
  selector: 'app-master-configuration',
  templateUrl: './master-configuration.component.html',
  styleUrl: './master-configuration.component.css',
  standalone:false
})
export class MasterConfigurationComponent {

  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  completedTabs = [false, true, false];
  public sSOLoginDataModel = new SSOLoginDataModel();
  tabs = [

    { TabName: 'Session Configuration', TabIcon: 'ti ti-calendar', component: SessionConfigurationComponent },
    //{ TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: DateConfigurationComponent },
    { TabName: 'Fee Configuration', TabIcon: 'fa fa-inr', component: FeeConfigurationComponent },
    { TabName: 'Serial Master', TabIcon: 'fa fa-list-ol', component: SerialMasterComponent },
   // { TabName: 'Admission Calendar ', TabIcon: 'ti ti-calendar', component: AllotmentConfigurationComponent }
  ] as { TabName: string; TabIcon: string; component: Type<any> }[];
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef)
  { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    if (
      this.sSOLoginDataModel.RoleID == EnumRole.DTE || 
      this.sSOLoginDataModel.RoleID == EnumRole.DTENON || 
      this.sSOLoginDataModel.RoleID == EnumRole.DTELateral || 
      this.sSOLoginDataModel.RoleID == EnumRole.DTETraing || 
      this.sSOLoginDataModel.RoleID == EnumRole.DTEDegreeCourse1stYear || 
      this.sSOLoginDataModel.RoleID == EnumRole.DTEDegreeCourse2ndYear ||
      this.sSOLoginDataModel.RoleID == EnumRole.DIRECTOR
    ) {
      this.tabs.push({ TabName: 'Admission Calendar ', TabIcon: 'ti ti-calendar', component: AllotmentConfigurationComponent });
    } else {
      this.tabs.push({ TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: DateConfigurationComponent });
    }
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
  public loadComponent(index: number): void {
    const component = this.tabs[index].component;
    const factory = this.resolver.resolveComponentFactory(component);
    this.tabContent.clear();

    const componentRef = this.tabContent.createComponent(factory);


    (componentRef.instance as any).tabChange?.subscribe((targetIndex: number) => {
      this.handleTabChange(targetIndex);
    });
  }
  public handleTabChange(index: number): void {
    this.completedTabs[index] = true
    this.selectTab(index); // Switch the tab
  }
}
