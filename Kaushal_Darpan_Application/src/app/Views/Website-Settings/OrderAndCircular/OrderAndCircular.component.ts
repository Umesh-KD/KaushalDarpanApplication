import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ToastrService } from 'ngx-toastr';
import { WebsiteSettingDataModel } from '../../../Models/BTER/WebsiteSettingsDataModel';
import { WebsiteSettingsService } from '../../../Services/BTER/WebsiteSettings/website-settings.service';
import { EnumDepartment, EnumRole, EnumStatus, EnumWS_DepartmentSub } from '../../../Common/GlobalConstants';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-OrderAndCircular',
  standalone: false,
  templateUrl: './OrderAndCircular.component.html',
  styleUrl: './OrderAndCircular.component.css'
})
export class OrderAndCircularComponent {
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
  IsPrivate: boolean=false
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
      IsPublic: ['',],
      DepartmentSubID: ['0', [DropdownValidators]],
      TypeID: ['0', [DropdownValidators]],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.todayDate = new Date().toISOString().substring(0, 16);
    this.GetDynamicUploadTypeDDL();
    this.GetAllSearchData();
    debugger
    if (this.sSOLoginDataModel.RoleID == EnumRole.Apprenticeship || this.sSOLoginDataModel.RoleID == EnumRole.Apprenticeship) {
      debugger

      this.request.TypeID = 6
      this.HighlightsFromGroup.get('TypeID')?.disable();
    } else {
      this.HighlightsFromGroup.get('TypeID')?.enable();
    }
  }

  get _HighlightsFromGroup() { return this.HighlightsFromGroup.controls; }

  ResetControls() {

    this.HighlightsFromGroup.reset({
      DepartmentSubID: 0,
      TypeID: 0,
      
    });

    this.DynamicContentData = [];
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

    this.request.DepartmentSubID = 0;
    this.request.TypeID = 0;
    
    this.GetAllSearchData();
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

  async GetAllSearchData() {
    debugger;

    try {

      this.DynamicContentData = [];

      this.loaderService.requestStarted();

      const departmentSubID = this.HighlightsFromGroup.get('DepartmentSubID')?.value;
      const typeID = this.HighlightsFromGroup.get('TypeID')?.value;
      const title = this.HighlightsFromGroup.get('Title')?.value;
      const startDate = this.HighlightsFromGroup.get('Start_Date')?.value;
      const endDate = this.HighlightsFromGroup.get('End_Date')?.value;

   
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;

      
      this.request.DepartmentSubID = departmentSubID;
      this.request.TypeID = typeID;
      this.request.Title = title;
      this.request.Start_Date = startDate;
      this.request.End_Date = endDate;

     
      if (this.sSOLoginDataModel.RoleID == 212) {
        this.request.DepartmentSubID = 6;
      }

      console.log("request", this.request);

      const data: any = await this.websiteSettingsService.GetAllSearchData(this.request);

      if (data.State == EnumStatus.Success) {
        this.DynamicContentData = data.Data;
      } else {
        this.toastr.error(data.ErrorMessage ?? data.Message);
      }

    } catch (error) {
      console.log(error);
    } finally {

      this.loaderService.requestEnded();

    }
  }


}
