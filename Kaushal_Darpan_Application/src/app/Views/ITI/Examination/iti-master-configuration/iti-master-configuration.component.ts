import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AllotmentConfigurationComponent } from '../../../master-configuration/allotment-configuration/allotment-configuration.component';
import { DateConfigurationComponent } from '../../../master-configuration/date-configuration/date-configuration.component';
import { FeeConfigurationComponent } from '../../../master-configuration/fee-configuration/fee-configuration.component';
import { SerialMasterComponent } from '../../../master-configuration/serial-master/serial-master.component';
import { SessionConfigurationComponent } from '../../../master-configuration/session-configuration/session-configuration.component';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ITISessionConfigurationComponent } from './session-configuration/iti-session-configuration.component';
import { ITIFeeConfigurationComponent } from './fee-configuration/iti-fee-configuration.component';
import { ITISerialMasterComponent } from './serial-master/iti-serial-master.component';
import { ITIDateConfigurationComponent } from './date-configuration/iti-date-configuration.component';
import { ITISignatureMasterComponent } from './signature/iti-signature.component';


@Component({
  selector: 'app-iti-master-configuration',
  templateUrl: './iti-master-configuration.component.html',
  styleUrl: './iti-master-configuration.component.css',
  standalone:false
})
export class ITIMasterConfigurationComponent {

  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  completedTabs = [false, true, false];
  public sSOLoginDataModel = new SSOLoginDataModel();
  tabs = [

    { TabName: 'Session Configuration', TabIcon: 'ti ti-calendar', component: ITISessionConfigurationComponent },
    //{ TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: DateConfigurationComponent },
    { TabName: 'Fee Configuration', TabIcon: 'fa fa-inr', component: ITIFeeConfigurationComponent },
    { TabName: 'Serial Master', TabIcon: 'fa fa-list-ol', component: ITISerialMasterComponent },
   { TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: ITIDateConfigurationComponent },
    { TabName: 'Signature Configuration', TabIcon: 'ti ti-writing-sign', component: ITISignatureMasterComponent }
   // { TabName: 'Admission Calendar ', TabIcon: 'ti ti-calendar', component: AllotmentConfigurationComponent }
  ] as { TabName: string; TabIcon: string; component: Type<any> }[];
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef)
  { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //if (this.sSOLoginDataModel.RoleID == 17 || this.sSOLoginDataModel.RoleID == 18 || this.sSOLoginDataModel.RoleID == 33 || this.sSOLoginDataModel.RoleID == 16 || this.sSOLoginDataModel.RoleID == 80 || this.sSOLoginDataModel.RoleID == 81) {
    //  this.tabs.push({ TabName: 'Admission Calendar ', TabIcon: 'ti ti-calendar', component: AllotmentConfigurationComponent });
    //} else {
    //  this.tabs.push({ TabName: 'Date Configuration', TabIcon: 'ti ti-calendar', component: DateConfigurationComponent });
    //}
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
