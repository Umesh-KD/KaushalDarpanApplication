import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { WebsiteSettingDataModel } from '../../../Models/BTER/WebsiteSettingsDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { WebsiteSettingsService } from '../../../Services/BTER/WebsiteSettings/website-settings.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-downloads',
  standalone: false,
  templateUrl: './downloads.component.html',
  styleUrl: './downloads.component.css'
})
export class DownloadsComponent {
  HighlightsFromGroup!: FormGroup;
  sSOLoginDataModel = new SSOLoginDataModel();
  isFormSubmitted: boolean = false
  request = new WebsiteSettingDataModel();
  public todayDate: any;

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
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.TypeID = 2
    this.todayDate = new Date().toISOString().substring(0, 16);
  }

  get _HighlightsFromGroup() { return this.HighlightsFromGroup.controls; }

  ResetControls() {
    this.request.Title = '';
    this.request.Start_Date = '';
    this.request.End_Date = '';
    this.request.FileName = '';
    this.request.Dis_FileName = '';

    this.isFormSubmitted = false
  }

  async SaveData() {
    this.isFormSubmitted = true;
    if(this.HighlightsFromGroup.invalid){
      this.toastr.error("Please Fill Required Fields")
      return
    }

    if(this.request.FileName == '') {
      this.toastr.error("Please Upload Document")
      return
    }

    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID
    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.request.UserID = this.sSOLoginDataModel.UserID
    console.log("request",this.request)

    try {
      this.loaderService.requestStarted();
      await this.websiteSettingsService.SaveData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.ResetControls();
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
}
