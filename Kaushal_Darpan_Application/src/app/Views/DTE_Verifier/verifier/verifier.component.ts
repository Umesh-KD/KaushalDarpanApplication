import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { VerifierSearchModel } from '../../../Models/VerifierDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VerifierService } from '../../../Services/DTE_Verifier/verifier.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
    selector: 'app-verifier',
    templateUrl: './verifier.component.html',
    styleUrls: ['./verifier.component.css'],
    standalone: false
})
export class VerifierComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public SearchVerifierFormGroup!: FormGroup;
  public searchRequest = new VerifierSearchModel();
  public isSubmitted = false;
  public VerifierDataList: any = []
  public Table_SearchText: string = ''

  constructor(
    private verifierService: VerifierService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
  ) {}

  async ngOnInit() {
    this.SearchVerifierFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
        SSOID: ['', Validators.required],
        MobileNo: ['', Validators.required],
      });
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.DepartmentID = this.SSOLoginDataModel.DepartmentID
    console.log("SSOLoginDataModle", this.SSOLoginDataModel);
    await this.onSearch()
  }

  async onSearch() {
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      this.searchRequest.CourseType = this.SSOLoginDataModel.Eng_NonEng
      //this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID;
      this.searchRequest.Userid = this.SSOLoginDataModel.UserID;
      
      await this.verifierService.GetAllData(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.VerifierDataList = data.Data
            console.log("this.VerifierDataList ",this.VerifierDataList )
          } else {
            this.toastr.error(data.ErrorMessage)
          }
        }, (error: any) => console.error(error));
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

  async ResetControl() {
    this.searchRequest.Name = '';
    this.searchRequest.SSOID = '';
    this.searchRequest.MobileNo = '';
    this.onSearch()
  }

  
}
