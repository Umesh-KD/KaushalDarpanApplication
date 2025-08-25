import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HighlightsComponent } from '../highlights/highlights.component';
import { DownloadsComponent } from '../downloads/downloads.component';
import { CircularComponent } from '../circular/circular.component';

@Component({
  selector: 'app-website-setting',
  standalone: false,
  templateUrl: './website-setting.component.html',
  styleUrl: './website-setting.component.css'
})
export class WebsiteSettingComponent {
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  completedTabs = [false, true, false];
  public sSOLoginDataModel = new SSOLoginDataModel();
  tabs = [

    { TabName: 'Highlights', TabIcon: 'ti ti-calendar', component: HighlightsComponent },
    // { TabName: 'Downloads', TabIcon: 'fa fa-inr', component: DownloadsComponent },
    // { TabName: 'Circular', TabIcon: 'fa fa-list-ol', component: CircularComponent },
  ] as { TabName: string; TabIcon: string; component: Type<any> }[];
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef)
  { }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
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
