import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { GroupCodeAllocationAddEditModel, GroupCodeAllocationSearchModel } from '../../Models/GroupCodeAllocationModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GroupcodeAllocationService } from '../../Services/groupcode-allocation/groupcode-allocation.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { EnumConfigurationType, EnumStatus } from '../../Common/GlobalConstants';
import { RequestBaseModel } from '../../Models/RequestBaseModel';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../Models/CommonDDLSubjectMasterModel';
import { CommonSerialMasterRequestModel } from '../../Models/CommonSerialMasterRequestModel';
import { CommonSerialMasterResponseModel } from '../../Models/CommonSerialMasterResponseModel';
import { CommonDDLCommonSubjectModel } from '../../Models/CommonDDLCommonSubjectModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';


@Component({
  selector: 'app-groupcode-allocation',
  templateUrl: './groupcode-allocation.component.html',
  styleUrls: ['./groupcode-allocation.component.css'],
  standalone: false
})
export class GroupcodeAllocationComponent {
  public Message: any = [];
  public State: number = -1;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";

  public searchRequest = new GroupCodeAllocationSearchModel();
  public GroupCodeAllocationList: GroupCodeAllocationAddEditModel[] = []

  public GroupCodeAllocationSaveForm!: FormGroup;
  public StartValue: number = 0;
  public SemestarMasterDDLList: any[] = [];

  public requestSerialMaster = new CommonSerialMasterRequestModel();
  public SerialMasterDataList: CommonSerialMasterResponseModel[] = [];
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  constructor(private commonMasterService: CommonFunctionService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private groupcodeAllocationService: GroupcodeAllocationService,
    private Swal2: SweetAlert2
  ) {
  }

  async ngOnInit() {
    //form
    this.GroupCodeAllocationSaveForm = this.formBuilder.group({
      StartValue: ['', [DropdownValidators]],
    });

    // login session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetSemestarMatserDDL();
    await this.GetAllData();
    await this.GetSerialMasterData();
    await this.GetDateConfig();
  }

  get formSave() { return this.GroupCodeAllocationSaveForm.controls; }

  async GetSemestarMatserDDL() {
    try {
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SemestarMasterDDLList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async GetAllData() {
    try {
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      await this.groupcodeAllocationService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.GroupCodeAllocationList = data['Data'];
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async SaveData() {
    try {
      this.isSubmitted = true;
      if (this.GroupCodeAllocationSaveForm.invalid) {
        return;
      }
      this.Swal2.Confirmation("Are you sure?,<br/>'GroupCode Generate' is the one time process, Please create all 'Group Partition' first then proceed.",
        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            //start value
            this.GroupCodeAllocationList.forEach(x => {
              x.ModifyBy = this.sSOLoginDataModel.UserID;
              x.EndTermID = this.sSOLoginDataModel.EndTermID;
              x.DepartmentID = this.sSOLoginDataModel.DepartmentID;
              x.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
            });
            //save
            await this.groupcodeAllocationService.SaveData(this.GroupCodeAllocationList, this.StartValue)
              .then(async (data: any) => {
                //
                this.State = data['State'];
                this.Message = data['Message'];
                console.log("data on save", data)
                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(this.Message);
                  console.log(data['ErrorMessage']);
                }
              })
              .catch((error: any) => {
                console.error(error);
                this.toastr.error('Failed to save!');
              });
          }
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async ClearSearchData() {
    this.searchRequest = new GroupCodeAllocationSearchModel();
    await this.GetAllData()
  }

  async GetSerialMasterData() {
    try {
      //set
      this.requestSerialMaster.TypeID = EnumConfigurationType.GroupCode;
      this.requestSerialMaster.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestSerialMaster.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.requestSerialMaster.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSerialMasterData(this.requestSerialMaster)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SerialMasterDataList = data['Data'];
          //partition size
          if (this.SerialMasterDataList.length > 0) {
            this.StartValue = parseInt(this.SerialMasterDataList[0].StartFrom);
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async GetDateConfig() {
    
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "GroupCodeAllocation"
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'][0];
        this.MapKeyEng = this.DateConfigSetting.GroupCodeAllocation;
      }, (error: any) => console.error(error)
      );
  }

}
