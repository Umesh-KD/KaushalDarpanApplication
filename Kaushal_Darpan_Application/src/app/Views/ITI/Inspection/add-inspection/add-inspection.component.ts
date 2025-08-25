import { ChangeDetectorRef, Component, ComponentFactoryResolver, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { InspectionDeploymentComponent } from '../inspection-deployment/inspection-deployment.component';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { InspectionTeamComponent } from '../inspection-team/inspection-team.component';

@Component({
  selector: 'app-add-inspection',
  standalone: false,
  templateUrl: './add-inspection.component.html',
  styleUrl: './add-inspection.component.css'
})
export class AddInspectionComponent {
  TabEnableDisable:any[] = [] ;
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  id: number = 0;
  public PersonalDetailsData: any = []
  public AdmissionDateList: any = []
  completedTabs = [true, false]; // Keep track of completed tabs
  tabs =
    [
      { TabName: 'Inspection Team', TabNameHI: 'निरीक्षण दल', component: InspectionTeamComponent, TabIcon: 'ti ti-user' },
      { TabName: 'Inspection Team Deployment', TabNameHI: 'निरीक्षण दल की तैनाती', component: InspectionDeploymentComponent, TabIcon: 'ti ti-license' },
      
    ] as { TabName: string; TabNameHI: string; component: Type<any>, TabIcon: string }[];

    public SSOLoginDataModel = new SSOLoginDataModel();
    InspectionTeamID: number = 0
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("SSOLoginDataModel",this.SSOLoginDataModel)
    this.activatedRoute.queryParams.subscribe((params) => {
      this.InspectionTeamID = params['id'];
      console.log("this.InspectionTeamID:", this.InspectionTeamID);

      if (this.InspectionTeamID != 0 && this.InspectionTeamID != null && this.InspectionTeamID != undefined) {
        this.completedTabs = [true, true];
      }
    });
    
  }

  ngAfterViewInit(): void
  {
    this.loadComponent(this.selectedTabIndex, this.id); 
    this.cdr.detectChanges();
  }

  public selectTab(index: number, id:number): void {
    this.selectedTabIndex = index;
    this.id = id
    this.loadComponent(index, id);
  }

  public loadComponent(index: number, id: number): void {
    const component = this.tabs[index].component;
    const factory = this.resolver.resolveComponentFactory(component);
    this.tabContent.clear();
    const componentRef = this.tabContent.createComponent(factory);

    (componentRef.instance as any).tabId = id;

    (componentRef.instance as any).formSubmitSuccess?.subscribe(() => {
      this.completedTabs[index] = true;
      if (this.selectedTabIndex < this.tabs.length - 2) {
        this.selectedTabIndex++;
        this.loadComponent(this.selectedTabIndex, this.id); 
      }
    });

   
    (componentRef.instance as any).tabChange?.subscribe((event: { index: number, id: any }) => {
      this.handleTabChange(event.index, event.id);
    });
  }

  public handleTabChange(index: number, id: number): void {
    this.completedTabs[index] = true
    console.log('Received tab change request from child:', index);
    this.selectTab(index, id);
  }
}
