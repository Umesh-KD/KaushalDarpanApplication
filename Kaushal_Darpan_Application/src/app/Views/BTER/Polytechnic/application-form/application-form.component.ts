import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { QualificationFormComponent } from '../qualification-form/qualification-form.component';
import { AddressFormComponent } from '../address-form/address-form.component';
import { DocumentFormComponent } from '../document-form/document-form.component';
import { OptionalFormComponent } from '../optional-form/optional-form.component';
import { OtherDetailsFormComponent } from '../other-details-form/other-details-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PreviewFormComponent } from '../preview-form/preview-form.component';
import { Type } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { BterApplicationForm } from '../../../Services/BterApplicationForm/bterApplication.service';
import { BterSearchmodel } from '../../../Models/ApplicationFormDataModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { EnumDepartment } from '../../../Common/GlobalConstants';


@Component({
    selector: 'app-application-form',
    templateUrl: './application-form.component.html',
    styleUrls: ['./application-form.component.css'],
    standalone: false
})
export class ApplicationFormComponent {
  public searchrequest = new BterSearchmodel()
  public ApplicationID: number = 0
  public PersonalDetails: any = []
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  sSOLoginDataModel: any;
  CourseTypeName: string = '';
  tabs = [
    { TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', TabIcon: 'ti ti-school', component: QualificationFormComponent },
    { TabName: 'Personal Details', TabNameHI: 'व्यक्तिगत विवरण', TabIcon: 'ti ti-user', component: PersonalDetailsComponent },
    { TabName: 'Address Details', TabNameHI: 'पते का विवरण', TabIcon: 'ti ti-map-pin', component: AddressFormComponent },
    { TabName: 'Other Details Form', TabNameHI: 'अन्य विवरण प्रपत्र', TabIcon: 'ti ti-notes', component: OtherDetailsFormComponent },
    { TabName: 'Documents', TabNameHI: 'दस्तावेज़', TabIcon: 'ti ti-file', component: DocumentFormComponent },
    { TabName: 'Option Form', TabNameHI: 'विकल्प प्रपत्र', TabIcon: 'ti ti-license', component: OptionalFormComponent },
    { TabName: 'Preview', TabNameHI: 'समीक्षा', TabIcon: 'ti ti-checkbox', component: PreviewFormComponent }
  ] as { TabName: string; TabNameHI: string; TabIcon: string; component: Type<any> }[];

  constructor(
    private resolver: ComponentFactoryResolver, 
    private router: Router, private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private ApplicationService: BterApplicationForm,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {
    
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  

  }
  ngAfterViewInit(): void {
    this.loadComponent(this.selectedTabIndex);
    this.cdr.detectChanges();
    
    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"));
    if (this.ApplicationID > 0) {
      this.searchrequest.ApplicationID = this.ApplicationID;
      this.GetById()
    }
  }

  // Handles tab selection without any restrictions
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

    // Listen for events from child components if needed
    (componentRef.instance as any).formSubmitSuccess?.subscribe(() => {
      if (this.selectedTabIndex < this.tabs.length - 1) {
        this.selectedTabIndex++;
        this.loadComponent(this.selectedTabIndex);
      }
    });

    (componentRef.instance as any).tabChange?.subscribe((targetIndex: number) => {
      this.selectTab(targetIndex);
    });
  }

  async GetById() {
    
    try {
      this.loaderService.requestStarted();
      await this.ApplicationService.GetApplicationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("Application Dataaaaaaaaaaaaaaaaaaaaaaaaaa",data);
          this.PersonalDetails = data.Data;
          if(this.PersonalDetails.DirectAdmissionType !== 0 && this.PersonalDetails.DepartmentID === EnumDepartment.BTER) {
            this.tabs.splice(5, 1)      
          }
          if (this.PersonalDetails.CourseTypeName == "ENG") {
              this.PersonalDetails.CourseTypeName = "Engineering"
          } else if (this.PersonalDetails.CourseTypeName == "NONENG") {
              this.PersonalDetails.CourseTypeName = "Non Engineering"
          } else {
              this.PersonalDetails.CourseTypeName = "Lateral"
          }

          if (this.PersonalDetails.CourseType == 1) {
              this.CourseTypeName = "Engineering"
          } else if (this.PersonalDetails.CourseType == 2) {
              this.CourseTypeName = "Non-Engineering"
          } else if (this.PersonalDetails.CourseType == 3){
              this.CourseTypeName = "Lateral"
          }
            
        

        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
