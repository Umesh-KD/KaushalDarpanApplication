import { Component } from '@angular/core';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { WebsiteSettingDataModel } from '../../../Models/BTER/WebsiteSettingsDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { WebsiteSettingsService } from '../../../Services/BTER/WebsiteSettings/website-settings.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';

@Component({
  selector: 'app-circular',
  standalone: false,
  templateUrl: './circular.component.html',
  styleUrl: './circular.component.css'
})
export class CircularComponent {
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
  ) { }

  async ngOnInit() {
    this.HighlightsFromGroup = this.formBuilder.group({
      Title: ['', Validators.required],
      Start_Date: ['', Validators.required],
      End_Date: ['', Validators.required],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.TypeID = 3
    this.todayDate = new Date().toISOString().substring(0, 16);
  }

  get _HighlightsFromGroup() { return this.HighlightsFromGroup.controls; }

  ResetControls() {
    this.request.Title = '';
    this.request.Start_Date = '';
    this.request.End_Date = '';
    this.isFormSubmitted = false
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

}
