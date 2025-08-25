import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { NodalDataModel, VerifierSearchModel } from '../../../../Models/VerifierDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VerifierService } from '../../../../Services/DTE_Verifier/verifier.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';


@Component({
  selector: 'app-nodal-list',
  templateUrl: './nodal-list.component.html',
  styleUrls: ['./nodal-list.component.css'],
  standalone: false
})
export class NodalListComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public SearchVerifierFormGroup!: FormGroup;
  //public searchRequest = new NodalDataModel();
  public isSubmitted = false;
  public VerifierDataList: any = []
  public Table_SearchText: string = ''
  public request = new NodalDataModel();
  constructor(
    private verifierService: VerifierService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.SearchVerifierFormGroup = this.formBuilder.group(
      {
        Name: [''],
        CenterName: [''],
        CenterCode: [''],
        OfficerName: [''],
        OfficerSSOID: [''],
        MobileNo: ['',],
        Status: ['-1']
      });
    this.request.Status = -1
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.DepartmentId = this.SSOLoginDataModel.DepartmentID;
    this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng;

    console.log("SSOLoginDataModle", this.SSOLoginDataModel);
    await this.onSearch()
  }

  async onSearch() {
    this.isSubmitted = true;
    try {
      this.loaderService.requestStarted();
      this.request.CourseTypeId = this.SSOLoginDataModel.Eng_NonEng
      this.request.Action = "List"

      await this.commonMasterService.NodalCenterList(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State = EnumStatus.Success) {
          this.VerifierDataList = data.Data
          console.log("this.VerifierDataList ", this.VerifierDataList)
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

  async deleteCenter(NodalId: number) {
    this.isSubmitted = true;

    this.Swal2.Confirmation("Do you want to delete this center?",
      async (result: any) => {
        if (result.isConfirmed) {

          try {
            this.loaderService.requestStarted();

            this.request.NodalID = NodalId;
            this.request.Action = "Delete";

            await this.commonMasterService.NodalCenterCreate(this.request).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.onSearch();
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
      });

  }

  async ActiveInActiveCenter(NodalId: number, Status: number) {
    this.isSubmitted = true;
    this.Swal2.Confirmation("Do you want to " + (Status == 1 ? "In Active" : "Active") + " this center?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();

            this.request.NodalID = NodalId;
            this.request.Action = "Active";

            await this.commonMasterService.NodalCenterCreate(this.request).then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              if (data.State == EnumStatus.Success) {
                this.onSearch();
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
      });
  }


  async ResetControl() {
    this.request.CenterName = '';
    this.request.OfficerSSOID = '';
    this.request.MobileNo = '';
    this.request.OfficerName = '';
    this.request.Status = -1;
    this.onSearch()
  }


}
