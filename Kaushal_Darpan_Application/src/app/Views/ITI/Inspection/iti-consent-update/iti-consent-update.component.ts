import { Component, ViewChild, ElementRef } from '@angular/core';
import { EnumDeploymentStatus, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { InspectionMemberDetailsDataModel, InspectionDeploymentDataModel, ITI_InspectionDataModel, ITI_InspectionSearchModel, ConsentModel, CenterMasterDDLDataModel, UpdateConsentModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ITIInspectionService } from '../../../../Services/ITI/ITI-Inspection/iti-inspection.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SMSMailService } from '../../../../Services/SMSMail/smsmail.service';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SearchRequest } from '../../../../Models/CitizenSuggestionDataModel';
import { UploadFileModel } from '../../../../Models/UploadFileModel';

@Component({
  selector: 'app-iti-consent-update',
  standalone: false,
  templateUrl: './iti-consent-update.component.html',
  styleUrl: './iti-consent-update.component.css'
})
export class ITIConsentUpdateComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITI_InspectionSearchModel();
  public InspectionConsentID: number = 0
  public request = new ITI_InspectionDataModel();
  public modalReference: NgbModalRef | undefined;
  public consentForm!: FormGroup;
  public consentRequest = new ConsentModel();
  public ConsentData: any = [];
  public InstituteMasterDDL: any = [];
  public DistrictMasterDDL: any = [];
  public requestCenter = new CenterMasterDDLDataModel();
  public consentDeploy = new ConsentModel();
  public UpdateConsentRequest = new UpdateConsentModel()
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public isSubmitted: boolean = false;

  constructor(
    private fb: FormBuilder,
    private itiInspectionService: ITIInspectionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,

  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.GetAllData()
    //this.getMasterData()
    this.consentForm = this.fb.group({
      Remarks: ['', Validators.required],
      TentativeDate: ['', Validators.required]
    });
    this.consentDeploy = new ConsentModel();
  }

  async ResetControl() {
    this.UpdateConsentRequest = new UpdateConsentModel();
    this.GetAllData();
  }

  async GetAllData() {
    try {
      this.loaderService.requestStarted();
      this.consentRequest.UserID = this.sSOLoginDataModel.UserID
      this.consentRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      await this.itiInspectionService.GetAllConsentbyPrincipal(this.consentRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State === EnumStatus.Success){
          this.ConsentData = data.Data
          console.log("Consent Data ==>", this.ConsentData)
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  async GetById_Consent(InspectionConsentID: number) {
    try {
      this.loaderService.requestStarted();
      await this.itiInspectionService.GetById_Consent(InspectionConsentID).then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        var id = data.Data
        if (data.State === EnumStatus.Success) {
          this.request = data.Data

        } else if (data.State === EnumStatus.Warning) {
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  async ViewandUpdate(content: any, InspectionConsentID: number) {

    debugger
    try {
      this.InspectionConsentID = InspectionConsentID;

      const response: any = await this.GetById_Consent(InspectionConsentID);

      if (response && response.State === EnumStatus.Success && response.Data) {
        const row = response.Data;

        this.UpdateConsentRequest = {
          TentativeDate: row.TentativeDate ? row.TentativeDate.split('T')[0] : '', 
          Remark: row.Remark || '',
          DocConsent: null, 
          UserID: row.UserID || 0, 
          InspectionConsentID: row.InspectionConsentID || InspectionConsentID 
        };
      } else {
        console.warn('No data found for the given ID:', InspectionConsentID);
        this.UpdateConsentRequest = {
          TentativeDate: '',
          Remark: '',
          DocConsent: null,
          UserID: 0,
          InspectionConsentID: InspectionConsentID
        };
      }

      this.modalReference = this.modalService.open(content, {
        backdrop: 'static',
        size: 'xl',
        keyboard: true,
        centered: true
      });
    } catch (error) {
      console.error('Error fetching consent details:', error);
    }
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {

        if (this.file.size > 2000000) {
          this.toastr.error('Select less then 2MB File');
          return;
        }
        this.loaderService.requestStarted();

        let uploadModel = new UploadFileModel();

        uploadModel.MinFileSize = "";
        uploadModel.MaxFileSize = "2000000";
        uploadModel.FolderName = "ITI/Consent";
        await this.commonMasterService
        .UploadDocument(this.file, uploadModel)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            if (Type == 'Photo') {

              this.consentDeploy.DocConsent =
                data['Data'][0]['FileName'];

              this.UpdateConsentRequest.DocConsent = data['Data'][0]['FileName'];
            }
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage);
          }
        });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async onSubmitConsent() {
    
    this.isSubmitted = true;
    if (!this.UpdateConsentRequest.DocConsent || this.UpdateConsentRequest.DocConsent === '') {
      this.toastr.error('Please upload the required document.');
      return;
    }
    this.UpdateConsentRequest.UserID = this.sSOLoginDataModel.UserID;
    this.UpdateConsentRequest.Remark = this.consentForm.get('Remarks')?.value;
    this.UpdateConsentRequest.TentativeDate = this.consentForm.get('TentativeDate')?.value;
    this.UpdateConsentRequest.InspectionConsentID = this.InspectionConsentID;
    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();
      this.itiInspectionService.updateConsent(this.UpdateConsentRequest)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.CloseModalPopup();
            this.GetAllData();
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
}
