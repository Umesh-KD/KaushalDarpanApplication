import { Component, OnInit } from '@angular/core';
import {IndustryInstitutePartnershipMasterDataModels } from '../../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { IndustryInstitutePartnershipMasterService } from '../../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { IDistrictMaster_StateIDWiseDataModel, IStateMasterDataModel } from '../../../../Models/CommonMasterDataModel';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';

@Component({
  selector: 'app-iti-add-industry-institute-partnership-master',
  standalone: false,
  templateUrl: './iti-add-industry-institute-partnership-master.component.html',
  styleUrl: './iti-add-industry-institute-partnership-master.component.css'
})
export class ITIAddIndustryInstitutePartnershipMasterComponent {
  public ID: number = 0;
  public request = new IndustryInstitutePartnershipMasterDataModels()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public IIPMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public DistrictMasterList: IDistrictMaster_StateIDWiseDataModel[] = []
  public StateMasterList: IStateMasterDataModel[] = []


  constructor(private commonMasterService: CommonFunctionService, private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private appsettingConfig: AppsettingService) {

  }


  async ngOnInit() {
    // form group
    this.IIPMasterFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
        Website: ['', Validators.required],
        Address: ['', Validators.required],

        ddlState: ['', [DropdownValidators]],
        ddlDistrict: ['', [DropdownValidators]],


      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('IndustryInstitutePartnershipID')?.toString());
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key
    await this.GetMaterData()
    //edit
    if (this.ID > 0) {
      await this.GetById();
    }
  }
  get _IIPMasterFormGroup() { return this.IIPMasterFormGroup.controls; }

  async GetMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Back() {
    if (this.key == 1) {
      this.routers.navigate(['/TIT-IndustryInstitutePartnershipList'])
    }
    else if (this.key == 2) {
      this.routers.navigate(['/ITI-IndustryInstitutePartnership-validation'])
    }
  }
  GotoCommonSubject(): void {
    this.routers.navigate(['/commonsubjects']);
  }

  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
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

      await this.industryInstitutePartnershipMasterService.GetById(this.ID)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.request = data['Data'];
          this.request.Dis_CompanyName = data['Data']['Dis_Name'];
          this.request.CompanyPhoto = data['Data']['Logo'];
          this.ddlState_Change();
          this.request.DistrictID = data['Data']["DistrictID"];
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
      if (this.IIPMasterFormGroup.invalid) {
        console.log("errro")
        return
      }
      this.isLoading = true;

      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;


      //save
      await this.industryInstitutePartnershipMasterService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/TIT-IndustryInstitutePartnershipList']);
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)

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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                this.request.CompanyPhoto = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.Dis_CompanyName = '';
            this.request.CompanyPhoto = '';
          }
          //else if (Type == "Sign") {
          //  this.requestStudent.Dis_StudentSign = '';
          //  this.requestStudent.StudentSign = '';
          //}
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  // reset
  ResetControls() {
    this.request = new IndustryInstitutePartnershipMasterDataModels();


    //this.multiSelect.toggleSelectAll();
  }

}
