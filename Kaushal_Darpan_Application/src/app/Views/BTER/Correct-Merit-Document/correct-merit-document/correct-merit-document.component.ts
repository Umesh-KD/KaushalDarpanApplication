import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Type } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { BterApplicationForm } from '../../../../Services/BterApplicationForm/bterApplication.service';
import { BterSearchmodel } from '../../../../Models/ApplicationFormDataModel';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { EnumCourseType, EnumDepartment, EnumMessageType, EnumStatus, EnumVerificationAction, GlobalConstants } from '../../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CorrectPersonalDetailsComponent } from '../correct-personal-details/correct-personal-details.component';
import { CorrectQualificationDetailsComponent } from '../correct-qualification-details/correct-qualification-details.component';
import { CorrectDocumentFormDetailsComponent } from '../correct-document-form-details/correct-document-form-details.component';
import { CorrectMerit_ApplicationSearchModel, CorrectMeritApproveDataModel, RejectModel } from '../../../../Models/DocumentScrutinyDataModel';
import { CorrectMeritService } from '../../../../Services/BTER/CorrectMerit/correct-merit.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentStatusHistoryComponent } from '../../../Student/student-status-history/student-status-history.component';
import { ToastrService } from 'ngx-toastr';
import { MeritDocumentScrutinyDataModel } from '../../../../Models/BTER/CorrectMeritDataModel';
import { VerificationDocumentDetailList } from '../../../../Models/StudentVerificationDataModel';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { ApplicationMessageDataModel } from '../../../../Models/ApplicationMessageDataModel';


@Component({
  selector: 'app-correct-merit-document',
  standalone: false,
  templateUrl: './correct-merit-document.component.html',
  styleUrl: './correct-merit-document.component.css'
})
export class CorrectMeritDocumentComponent {
  @Output() formSubmitSuccess = new EventEmitter<boolean>();
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() ApplicationID: EventEmitter<number> = new EventEmitter<number>();
  public searchrequest = new BterSearchmodel()
  public requestApplication = new CorrectMerit_ApplicationSearchModel()
  public TypeId: number = 0;
  @ViewChild(StudentStatusHistoryComponent) childComponent!: StudentStatusHistoryComponent;
  // public ApplicationID: number = 0
  public PersonalDetails: any = []
  @ViewChild('tabContent', { read: ViewContainerRef }) tabContent!: ViewContainerRef;
  selectedTabIndex = 0;
  sSOLoginDataModel: any;
  CourseTypeName: string = '';
  closeResult: string | undefined;
  MeritID: number = 0
  public changeshow: boolean = false
  public reject = new RejectModel()
  public request = new MeritDocumentScrutinyDataModel()
  public filteredDocumentDetails: VerificationDocumentDetailList[] = []
  public approveRequest = new CorrectMeritApproveDataModel();
  public messageModel = new ApplicationMessageDataModel();
  _GlobalConstants = GlobalConstants;
  
  pdfUrl: string | null = null;
  safePdfUrl: SafeResourceUrl | null = null;
  showPdfModal: boolean = false;
  isPdf: boolean = false;
  isImage: boolean = false;
  isOtherDocument: boolean = false
  public isSupp: boolean = false
  imageSrc: string | null = null;
  isError: boolean = false;

  tabs = [
    { TabName: 'Applicant Details', TabNameHI: 'आवेदक विवरण', TabIcon: 'ti ti-school', component: CorrectPersonalDetailsComponent, Disabled: false },
    { TabName: 'Qualification Detail', TabNameHI: 'योग्यता विवरण', TabIcon: 'ti ti-school', component: CorrectQualificationDetailsComponent, Disabled: true },
    { TabName: 'Documents', TabNameHI: 'दस्तावेज़', TabIcon: 'ti ti-file', component: CorrectDocumentFormDetailsComponent, Disabled: true },
    
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
    private correctMeritService: CorrectMeritService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private smsMailService: SMSMailService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.MeritID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('ApplicationID') ?? "0"))

    this.MeritID = isNaN(this.MeritID) ? 0 : this.MeritID;
       
  }

  ngAfterViewInit(): void {
    // Use an asynchronous function inside ngAfterViewInit
    this.initializeView();
  }

  private async initializeView(): Promise<void> {
    if (this.MeritID > 0) {
      await this.GetApplicationIDByMeritID(); 
      await this.GetDocumentbyID();
    }

    this.loadComponent(this.selectedTabIndex); 
    this.cdr.detectChanges(); 
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
    instance.ApplicationID = this.ApplicationID;

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

  async GetApplicationIDByMeritID() {

    try {
      this.loaderService.requestStarted();
      this.requestApplication.MeritID = this.MeritID
      await this.correctMeritService.GetApplicationIDByMeritID(this.requestApplication)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          this.ApplicationID = data.Data[0]['ApplicationId']
        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveDataChange() {}

  async SaveData() {}

  async RejectPreview(content: any) {
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  async CloseModel() {
    this.loaderService.requestStarted();
    // this.request.Remark = ''

    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
    }, 200);
  }

  async ViewHistory(row: any, ID: number) {
    const AppID = Number(this.ApplicationID)

    this.childComponent.OpenRevertDocumentPopup(ID, AppID);
  }

  async RejectDocument() {

    if (this.reject.Remark == '') {
      this.toastr.error("Please Enter Remarks")
      return
    }
    this.reject.ModifyBy = this.sSOLoginDataModel.UserID;
    this.reject.DepartmentID = EnumDepartment.BTER
    this.reject.ApplicationID = Number(this.ApplicationID)
    this.reject.MeritId = this.MeritID
    this.reject.Action = EnumVerificationAction.RejectMerit
    this.CloseModel()
    this.Swal2.Confirmation("Are you sure you want to Reject?", async (result: any) => {

      if (result.isConfirmed) {

        this.loaderService.requestStarted();
        try {
          debugger
          await this.correctMeritService.Reject_Document(this.reject)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data);

              if (data.State == EnumStatus.Success) {
                this.toastr.success(data.Message)

                this.CloseModel()
                await this.NotifyCandidate(EnumMessageType.Bter_NotifyCandidateRejectMerit);
                
                if(this.sSOLoginDataModel.Eng_NonEng == 1){
                  this.router.navigate(['/CorrectMeritENG/1']);
                } else if(this.sSOLoginDataModel.Eng_NonEng == 2){
                  this.router.navigate(['/CorrectMeritNonENG/2']);
                } else if (this.sSOLoginDataModel.Eng_NonEng == 3) {
                  this.router.navigate(['/CorrectMeritLateral/3']);
                } else if (this.sSOLoginDataModel.Eng_NonEng == 4) {
                  this.router.navigate(['/CorrectMeritDegreeNonENG/4']);
                } else if (this.sSOLoginDataModel.Eng_NonEng == 5) {
                  this.router.navigate(['/CorrectMeritDegreeLateral/5']);
                }
            /*    this.router.navigate(['/StudentVerificationList'])*/
              }
              else {
                this.toastr.error(data.ErrorMessage)
              }



            }, (error: any) => console.error(error)
            );

        }

        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })

  }

  async GetDocumentbyID() {

    this.searchrequest.SSOID = this.sSOLoginDataModel.SSOID;
    this.searchrequest.DepartmentID = EnumDepartment.BTER;
    this.searchrequest.ApplicationID = this.MeritID;
    try {
      this.loaderService.requestStarted();
      await this.correctMeritService.MeritDocumentScrunityData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'data ');
          if(data['Data'] != null){
            this.request = data['Data']

            this.request.VerificationDocumentDetailList = data['Data']['VerificationDocumentDetailList']
          
            this.request.VerificationDocumentDetailList = this.request.VerificationDocumentDetailList.map(doc => ({
              ...doc,
              DisFileName: doc.DisFileName.replace(/^upload the scanned copy of /i, '') // Remove "upload the "
            }));       
          
          
            if (this.request.VerificationDocumentDetailList) {   
              this.filteredDocumentDetails = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo === 1);
              this.request.VerificationDocumentDetailList = this.request.VerificationDocumentDetailList.filter((x) => x.GroupNo != 1 && x.Status != 3);
            } else {
              this.filteredDocumentDetails = [];
            }
          }
          
          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ApproveMerit() {
    this.Swal2.Confirmation("Are you sure you want to Approve?", async (result: any) => {
      if (result.isConfirmed) {
        this.approveRequest.DepartmentID = EnumDepartment.BTER;
        this.approveRequest.MeritId = this.MeritID;
        this.approveRequest.ApplicationID = Number(this.ApplicationID);
        this.approveRequest.status = EnumVerificationAction.Verified
        this.approveRequest.ModifyBy = this.sSOLoginDataModel.UserID
        try {
          this.loaderService.requestStarted();
          await this.correctMeritService.ApproveMerit(this.approveRequest)
            .then(async (data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data, 'data ');

              if (data.State == EnumStatus.Success) {
                this.toastr.success(data.Message)
                await this.NotifyCandidate(EnumMessageType.Bter_NotifyCandidateApproveMerit);

                if(this.sSOLoginDataModel.Eng_NonEng == 1){
                  this.router.navigate(['/CorrectMeritENG/1']);
                } else if(this.sSOLoginDataModel.Eng_NonEng == 2){
                  this.router.navigate(['/CorrectMeritNonENG/2']);
                } else if (this.sSOLoginDataModel.Eng_NonEng == 3) {
                  this.router.navigate(['/CorrectMeritLateral/3']);
                } else if (this.sSOLoginDataModel.Eng_NonEng == 4) {
                  this.router.navigate(['/CorrectMeritDegreeNonENG/4']);
                } else if (this.sSOLoginDataModel.Eng_NonEng == 5) {
                  this.router.navigate(['/CorrectMeritDegreeLateral/5']);
                }
              }
              else {
                this.toastr.error(data.ErrorMessage)
              }

            }, error => console.error(error));
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  @ViewChild('appMenu', { static: false }) menuElementRef!: ElementRef;
  async openPdfModal(url: string): Promise<void> {

    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.add('DocShowers'); // or any class you want
    }


    const ext = url.split('.').pop()?.toLowerCase();
    this.isPdf = ext === 'pdf';
    this.isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext || '');

    this.safePdfUrl = null;
    this.imageSrc = '';
    this.pdfUrl = url;
    this.isError = false;

    try {
      const blob = await this.http.get(url, { responseType: 'blob' }).toPromise();
      if (blob) {
        const blobUrl = URL.createObjectURL(blob);
        this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.imageSrc = blobUrl;
      } else {
        throw new Error('Blob is undefined');
      }
    } catch (error) {
      console.error('File load failed, using dummy image.', error);
      this.isPdf = false;
      this.isImage = true;
      this.safePdfUrl = null;
      this.imageSrc = 'assets/images/dummyImg.jpg';
      this.isError = true;
    }

    this.showPdfModal = true;
  }

  ClosePopupAndGenerateAndViewPdf(): void {
    const el = document.getElementById('app-menu');
    if (el) {
      el.classList.remove('DocShowers'); // or any class you want
    }
    this.showPdfModal = false;
    this.safePdfUrl = null;
    this.pdfUrl = null;
    this.imageSrc = null;
    this.isPdf = false;
    this.isImage = false;
    this.isError = false;
  }
  onImageError(event: any) {
    event.target.src = 'assets/images/dummyImg.jpg';
  }

  async NotifyCandidate(action: any) {
    try {
      this.loaderService.requestStarted();

      this.messageModel.MessageType = action;
      this.messageModel.MeritId = this.MeritID;
      // this.messageModel.Scheme = selectedValue??"";

      this.smsMailService.SendApplicationMessage(this.messageModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success('Message sent successfully');
          } else {
            this.toastr.warning('Something went wrong');
          }
        }, error => console.error(error));
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  
  }

}
