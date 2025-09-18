import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IIP_EventDataModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { IndustryInstitutePartnershipMasterService } from '../../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-add-iip-events',
  standalone: false,
  templateUrl: './add-iip-events.component.html',
  styleUrl: './add-iip-events.component.css'
})
export class AddIIPEventsComponent {
  public EventFormGroup!: FormGroup

  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new IIP_EventDataModel();

  public SemesterMasterList: any = [];
  public CourseMasterDDL: any = [];
  public settingsMultiselect: object = {};
  public settingsMultiselectSem: object = {};
  public StreamMasterList: any = [];
  public SelectedBranchList: any = [];
  public SelectedSemesterList: any = [];

  public isSubmitted: boolean = false
  public todayDate: any;
  public CompanyID: number = 0;
  

  constructor(
    private commonMasterService: CommonFunctionService, 
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private appsettingConfig: AppsettingService
  ) { }


  async ngOnInit() {
    this.EventFormGroup = this.formBuilder.group({
        EventTypeID: ['', [DropdownValidators]],
        Event: ['', [DropdownValidators]],
        EventStartDate: ['', Validators.required],
        EventEndDate: ['', Validators.required],
        EventForID: ['', Validators.required],
        Semesterlist: ['',],
        Branchlist: ['', ],
      });
    
    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'StreamID',
      textField: 'StreamName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 300,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.settingsMultiselectSem = {
      singleSelection: false,
      idField: 'SemesterID',
      textField: 'SemesterName',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CompanyID = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());
    if(this.CompanyID > 0) {
      this.request.CompanyID = this.CompanyID
    }
    this.todayDate = new Date().toISOString().substring(0, 16);
    await this.GetMasterData();
  }

  get _EventFormGroup() { return this.EventFormGroup.controls; }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));
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

  async SaveEventData() {
    console.log("branch", this.SelectedBranchList)
    console.log("semester", this.SelectedSemesterList)
    this.isSubmitted = true;
    if(this.EventFormGroup.invalid) {
      this.toastr.error("Please fill form properly");
      return
    }
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      debugger
      await this.industryInstitutePartnershipMasterService.SaveData_IIP_Events(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.routers.navigate(['/IndustryInstitutePartnershipList']);
          } else {
            this.toastr.error(data.ErrorMessage)
          }
      })
    } catch (error) {
      console.error(error)
    }
  }

  onItemSelect(item: any) {
  }

  onDeSelect(item: any) {

  }

  onSelectAll(items: any[]) {
  }

  onDeSelectAll(centerID: number) {
  }

  onFilterChange(event: any) {
    // Handle filtering logic (if needed)
    console.log(event);
  }

  onDropDownClose(event: any) {
    // Handle dropdown close event
    console.log(event);
  }
}
