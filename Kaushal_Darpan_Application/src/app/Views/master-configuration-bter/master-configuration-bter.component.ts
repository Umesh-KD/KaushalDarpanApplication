import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SessionConfigurationBTERComponent } from './session-configuration-bter/session-configuration-bter.component';
import { FeeConfigurationBTERComponent } from './fee-configuration-bter/fee-configuration-bter.component';
import { SerialMasterBTERComponent } from './serial-master-bter/serial-master-bter.component';
import { AllotmentConfigurationBTERComponent } from './allotment-configuration-bter/allotment-configuration-bter.component';
import { DateConfigurationBTERComponent } from './date-configuration-bter/date-configuration-bter.component';
import { BterSignatureMasterComponent } from './signature-bter/bter-signature.component';

@Component({
  selector: 'app-master-configuration-bter',
  templateUrl: './master-configuration-bter.component.html',
  styleUrl: './master-configuration-bter.component.css',
  standalone:false
})
export class MasterConfigurationBTERComponent {

  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  completedTabs = [false, true, false];
  public sSOLoginDataModel = new SSOLoginDataModel();
  tabs = [

    { TabName: 'Session Configuration', TabIcon: 'ti ti-calendar', component: SessionConfigurationBTERComponent },
    //{ TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: DateConfigurationComponent },
    { TabName: 'Fee Configuration', TabIcon: 'fa fa-inr', component: FeeConfigurationBTERComponent },
    { TabName: 'Serial Master', TabIcon: 'fa fa-list-ol', component: SerialMasterBTERComponent },
    { TabName: 'Signature Configuration', TabIcon: 'ti ti-writing-sign', component: BterSignatureMasterComponent },
    //{ TabName: 'Admission Calendar ', TabIcon: 'ti ti-calendar', component: AllotmentConfigurationComponent }
  ] as { TabName: string; TabIcon: string; component: Type<any> }[];
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef)
  { }


  async ngOnInit() {


    debugger;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    if (this.sSOLoginDataModel.RoleID == 17 || this.sSOLoginDataModel.RoleID == 18 || this.sSOLoginDataModel.RoleID == 33 || this.sSOLoginDataModel.RoleID == 16 || this.sSOLoginDataModel.RoleID == 80 || this.sSOLoginDataModel.RoleID == 81) {
      this.tabs.push({ TabName: 'Admission Calendar ', TabIcon: 'ti ti-calendar', component: AllotmentConfigurationBTERComponent });
    } else {
      this.tabs.push({ TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: DateConfigurationBTERComponent });
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
