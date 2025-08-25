import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { WebsiteSettingDataModel } from '../../../Models/BTER/WebsiteSettingsDataModel';
import { WebsiteSettingsService } from '../../../Services/BTER/WebsiteSettings/website-settings.service';
import { EnumDepartment, EnumStatus, EnumWS_DepartmentSub } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-highlights',
  standalone: false,
  templateUrl: './highlights.component.html',
  styleUrl: './highlights.component.css'
})
export class HighlightsComponent {
  HighlightsFromGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  isFormSubmitted: boolean = false
  request = new WebsiteSettingDataModel();
  public todayDate: any;
  requestBaseModel = new RequestBaseModel();
  GetDynamicUploadTypeDDL_Data: any = []
  _EnumWS_DepartmentSub = EnumWS_DepartmentSub;
  _EnumDepartment = EnumDepartment;
  DynamicContentData: any = [];
  Table_SearchText: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2,
    private toastr: ToastrService,
    private websiteSettingsService: WebsiteSettingsService,
    public appsettingConfig: AppsettingService,
  ) { }

  async ngOnInit() {
    this.HighlightsFromGroup = this.formBuilder.group({
      Title: ['', Validators.required],
      Start_Date: ['',],
      End_Date: ['',],
      DepartmentSubID: ['', [DropdownValidators]],
      TypeID: ['', [DropdownValidators]],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.todayDate = new Date().toISOString().substring(0, 16);
    this.GetDynamicUploadTypeDDL();
    this.GetAllData();
  }

  get _HighlightsFromGroup() { return this.HighlightsFromGroup.controls; }

  ResetControls() {
    this.request = new WebsiteSettingDataModel();
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.isFormSubmitted = false
    this.HighlightsFromGroup.controls['DepartmentSubID'].enable();
    this.HighlightsFromGroup.controls['TypeID'].enable();
  }

  async SaveData() {
    this.isFormSubmitted = true;
    if(this.HighlightsFromGroup.invalid){
      this.toastr.error("Please Fill Required Fields")
      return
    }

    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.request.UserID = this.sSOLoginDataModel.UserID

    try {
      this.loaderService.requestStarted();
      await this.websiteSettingsService.SaveData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.ResetControls();
          this.GetAllData();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      })
    }
    console.log("request",this.request)
  }

  async GetDynamicUploadTypeDDL() {

    try {
      this.loaderService.requestStarted();
      await this.websiteSettingsService.GetDynamicUploadTypeDDL(this.requestBaseModel).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.GetDynamicUploadTypeDDL_Data = data.Data
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      })
    }
    console.log("request",this.request)
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (
          this.file.type == 'image/jpeg' ||
          this.file.type == 'image/jpg' ||
          this.file.type == 'image/png' ||
          this.file.type == 'application/pdf'
        ) {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File');
            return;
          }
        } else {
          this.toastr.error('Select Only jpeg/jpg/png/pdf file');
          return;
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService
          .UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == 'Photo') {
                this.request.FileName =data['Data'][0]['FileName'];
                this.request.Dis_FileName =data['Data'][0]['Dis_FileName'];
              }
              
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          });
      }
    } catch (Ex) {
      console.log(Ex);
    } finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async GetAllData() {

    try {
      this.loaderService.requestStarted();
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      await this.websiteSettingsService.GetAllData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success)
        {
          this.DynamicContentData = data.Data
        } else
        {
          this.toastr.error(data.ErrorMessage ?? data.Message);
        }

      })
      
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      })
    }
    console.log("request",this.request)
  }

  async onDelete(row: any) {  

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.request.WS_ID = row.WS_ID;
            this.request.UserID = this.sSOLoginDataModel.UserID
            this.request.DUTC_ID = row.DUTC_ID
            await this.websiteSettingsService.DeleteDataByID(this.request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.ResetControls();
                  this.GetAllData()
                }
                else {
                  this.toastr.error(data.ErrorMessage)
                }

              }, (error: any) => console.error(error)
              );
          }
          catch (ex) {
            console.log(ex);
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }

  async onEdit(row: any) {
    try {
      this.loaderService.requestStarted();
      this.request.DUTC_ID = row.DUTC_ID
      await this.websiteSettingsService.GetById(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          if (data.State = EnumStatus.Success) {
            this.request = data.Data
            this.HighlightsFromGroup.controls['DepartmentSubID'].disable();
            this.HighlightsFromGroup.controls['TypeID'].disable();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }

        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onToggleChange(row: any) {
    
    this.Swal2.Confirmation("Are you sure you want to Change Status ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            row.IsActive = !row.IsActive
            this.loaderService.requestStarted();
            this.request.WS_ID = row.WS_ID;
            this.request.UserID = this.sSOLoginDataModel.UserID
            this.request.DUTC_ID = row.DUTC_ID
            this.request.IsActive = row.IsActive
            await this.websiteSettingsService.ActiveStatusChange(this.request)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State = EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  this.ResetControls();
                  this.GetAllData()
                }
                else {
                  this.toastr.error(data.ErrorMessage)
                }

              }, (error: any) => console.error(error)
              );
          }
          catch (ex) {
            console.log(ex);
          }
          finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }
}
