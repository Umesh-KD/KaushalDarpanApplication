import { Component, ComponentFactoryResolver, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { DirectQualificationFormComponent } from '../direct-qualification-form/direct-qualification-form.component';
import { DirectAddressFormComponent } from '../direct-address-form/direct-address-form.component';
import { DirectDocumentFormComponent } from '../direct-document-form/direct-document-form.component';
import { DirectOptionalFormComponent } from '../direct-optional-form/direct-optional-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DirectPreviewFormComponent } from '../direct-preview-form/direct-preview-form.component';
import { Type } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { EnumDepartment } from '../../../../Common/GlobalConstants';
import { DirectDTEOtherDetailsFormComponent } from '../direct-other-details-form/direct-other-details-form.component';
import { DirectDTEStudentJanAadharDetailComponent } from '../direct-student-jan-aadhar-detail/direct-student-jan-aadhar-detail.component';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';


@Component({
  selector: 'app-direct-application-form',
  templateUrl: './direct-application-form.component.html',
  styleUrls: ['./direct-application-form.component.css'],
  standalone: false
})
export class DirectApplicationFormComponent {
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public searchrequest = new BterSearchmodel()
  public TypeId: number = 0;
  public ApplicationID: number = 0
  public PersonalDetails: any = []
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  sSOLoginDataModel: any;
  CourseTypeName: string = '';
  tabs = [
    { TabName: 'Applicant Details', TabNameHI: 'आवेदक विवरण', TabIcon: 'ti ti-school', component: DirectDTEStudentJanAadharDetailComponent, Disabled: false },
    /*  { TabName: 'Personal Details', TabNameHI: 'व्यक्तिगत विवरण', TabIcon: 'ti ti-user', component: DirectPersonalDetailsComponent, Disabled: false },*/
    { TabName: 'Address Details', TabNameHI: 'पते का विवरण', TabIcon: 'ti ti-map-pin', component: DirectAddressFormComponent, Disabled: true },
    { TabName: 'Other Details', TabNameHI: 'अन्य विवरण', TabIcon: 'ti ti-notes', component: DirectDTEOtherDetailsFormComponent, Disabled: true },
    { TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', TabIcon: 'ti ti-school', component: DirectQualificationFormComponent, Disabled: true },
    { TabName: 'Option Form', TabNameHI: 'विकल्प प्रपत्र', TabIcon: 'ti ti-license', component: DirectOptionalFormComponent, Disabled: true },
    { TabName: 'Documents', TabNameHI: 'दस्तावेज़', TabIcon: 'ti ti-file', component: DirectDocumentFormComponent, Disabled: true },
    { TabName: 'Preview', TabNameHI: 'समीक्षा', TabIcon: 'ti ti-checkbox', component: DirectPreviewFormComponent, Disabled: true }
  ] as { TabName: string; TabNameHI: string; TabIcon: string; component: Type<any>, Disabled: boolean }[];

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router, private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private ApplicationService: BterApplicationForm,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.TypeId = Number(this.activatedRoute.snapshot.queryParamMap.get('type')?.toString());
    this.TypeId = isNaN(this.TypeId) ? 0 : this.TypeId;
    if (this.sSOLoginDataModel.ApplicationID > 0) {
      await this.GetApplicationStepsId();
    }
    if (this.sSOLoginDataModel.ApplicationFinalSubmit == 2) {
      this.tabs = [{ TabName: '', TabNameHI: '', TabIcon: '', component: DirectPreviewFormComponent, Disabled: true }];
      this.selectedTabIndex = 0;

      // this.Swal2.Confirmation("Do you want to delete?",
      // async (result: any) => {
      //   //confirmed
      //   if (result.isConfirmed) {
          
      //   }
      // });

    }

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
    const instance = componentRef.instance as any;
    // Listen for events from child components if needed
    instance.TypeId = this.TypeId; // 👈 Pass @Input TypeId here

    (componentRef.instance as any).formSubmitSuccess?.subscribe(() => {
      if (this.selectedTabIndex < this.tabs.length - 1) {
        this.selectedTabIndex++;
        this.loadComponent(this.selectedTabIndex);
        this.ngOnInit();
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
          this.PersonalDetails = data.Data;
          if (this.PersonalDetails.DirectAdmissionType !== 0 && this.PersonalDetails.DepartmentID === EnumDepartment.BTER) {
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
          } else if (this.PersonalDetails.CourseType == 3) {
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

  async GetApplicationStepsId() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetApplicationSubmittedSteps(this.sSOLoginDataModel.ApplicationID)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.tabs[0].Disabled = false;
          this.tabs[1].Disabled = false;
          this.tabs[2].Disabled = false;
          this.tabs[3].Disabled = false;
          this.tabs[4].Disabled = false;
          this.tabs[5].Disabled = false;
          this.tabs[6].Disabled = false;


          this.tabs[1].Disabled = !(data.Data[0].SubmittedStep.indexOf(2) > -1)//filter(function (dat: any) { return dat.Item==1 }).lengt true;
          this.tabs[2].Disabled = !(data.Data[0].SubmittedStep.indexOf(3) > -1);
          this.tabs[3].Disabled = !(data.Data[0].SubmittedStep.indexOf(4) > -1);
          this.tabs[4].Disabled = !(data.Data[0].SubmittedStep.indexOf(5) > -1);
          this.tabs[5].Disabled = !(data.Data[0].SubmittedStep.indexOf(6) > -1);
          this.tabs[6].Disabled = !(data.Data[0].SubmittedStep.indexOf(7) > -1);

          var nextstep = 0;
          if (data.Data[0].SubmittedStep.indexOf(2) <= -1) {
            nextstep = 1;
          } else if (data.Data[0].SubmittedStep.indexOf(3) <= -1) {
            nextstep = 2;
          } else if (data.Data[0].SubmittedStep.indexOf(4) <= -1) {
            nextstep = 3;
          } else if (data.Data[0].SubmittedStep.indexOf(5) <= -1) {
            nextstep = 4;
          } else if (data.Data[0].SubmittedStep.indexOf(6) <= -1) {
            nextstep = 5;
          } else if (data.Data[0].SubmittedStep.indexOf(6) > -1) {
            nextstep = 6;
          }

          this.selectTab(nextstep);
          this.tabs[nextstep].Disabled = false;
          this.tabChange.emit(nextstep);

          this.PersonalDetails = data.Data;
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
