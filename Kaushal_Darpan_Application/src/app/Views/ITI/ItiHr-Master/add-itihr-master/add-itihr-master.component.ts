import { Component } from '@angular/core';
import { ItiHrMasterDataModel } from '../../../../Models/ITI/ItiHrMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiHrMasterService } from '../../../../Services/ITI/ItiHrMaster/itihr-master.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
    selector: 'app-add-itihr-master',
    templateUrl: './add-itihr-master.component.html',
    styleUrls: ['./add-itihr-master.component.css'],
    standalone: false
})
export class AddItiHrMasterComponent {

  public HRManagerID: number = 0;
  public CompanyMasterDDLList: any[] = [];

  public request = new ItiHrMasterDataModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private commonMasterService: CommonFunctionService, private HrMasterService: ItiHrMasterService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {
    

    // form group
    this.HrMasterFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
        EmailId: ['', Validators.required],
        MobileNo: ['', Validators.required],
        PlacementCompanyID: ['', [DropdownValidators]],

      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.HRManagerID = Number(this.activatedRoute.snapshot.queryParamMap.get('HRManagerID')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetCompanyMatserDDL();


    //edit
    if (this.HRManagerID > 0) {
      await this.GetById();
    }
  }
  get _HrMasterFormGroup() { return this.HrMasterFormGroup.controls; }

  async Back() {
    if (this.key == 1) {
      this.routers.navigate(['/ItiHrmaster'])
    }
    else if (this.key == 2) {
      this.routers.navigate(['/ItiHrMasterValidation'])
    }
  }
  GotoCommonSubject(): void {
    this.routers.navigate(['/commonsubjects']);
  }

  // get semestar ddl
  async GetCompanyMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ITIPlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.CompanyMasterDDLList = data['Data'];

          console.log(this.CompanyMasterDDLList, "company")
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



  // get detail by id
  async GetById() {
    try {
      this.loaderService.requestStarted();

      await this.HrMasterService.GetById(this.HRManagerID)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.request = data['Data'];

          this.request.PlacementCompanyID = data['Data']['PlacementCompanyID'];

          this.HrMasterFormGroup.patchValue({
            PlacementCompanyID: this.request.PlacementCompanyID
          });
          console.log(this.request, "request");


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

  // get detail by id
  async SaveData() {

    try {
      this.isSubmitted = true;
      if (this.HrMasterFormGroup.invalid) {
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;


      //save
      await this.HrMasterService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/ItiHrmaster']);
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  // reset
  ResetControls() {
    this.request = new ItiHrMasterDataModel();
    this.request.PlacementCompanyID = 0

    //this.multiSelect.toggleSelectAll();
  }

}
