import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyEventSearchModel, IIP_EventDataModel } from '../../../Models/IndustryInstitutePartnershipMasterDataModel';
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
  public searchRequest = new CompanyEventSearchModel();

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
  public EventID: number = 0;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public EventTypeList: any = [];
  public EventList: any = [];
  public EventLevelList: any = [];
  public EventForList: any = [];
  isOJTSelected: boolean = false;

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
        EventLevelID: ['', [DropdownValidators]],
        Remark: [''],
        SSOID: [''],
        MobileNo: [''],
        Email: [''],
        Designation: [''],
        TrainingDuration: [''],
        AreaOfDomain: [''],
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
    this.EventID = Number(this.activatedRoute.snapshot.queryParamMap.get('event')?.toString());
    if(this.CompanyID > 0) {
      this.request.CompanyID = this.CompanyID
    }
    this.todayDate = new Date().toISOString().substring(0, 16);
    await this.GetMasterData();

    if(this.CompanyID > 0 && this.EventID > 0) {
      this.searchRequest.CompanyID = this.CompanyID;
      this.searchRequest.EventID = this.EventID;
      await this.GetEvent_ById();
    }
    this.GetEventMasterData()
  }

  get _EventFormGroup() { return this.EventFormGroup.controls; }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
          if(this.sSOLoginDataModel.DepartmentID == 2){
            const excludedIDs = [5,6,7,8,9]; 
            this.SemesterMasterList = this.SemesterMasterList.filter((item: any) => !excludedIDs.includes(item.SemesterID));
          }
        }, (error: any) => console.error(error));

      await this.commonMasterService.Stream_InstituteIdWise(this.sSOLoginDataModel.DepartmentID,1,this.sSOLoginDataModel.EndTermID,this.sSOLoginDataModel.InstituteID,this.sSOLoginDataModel.FinancialYearID)
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

  async GetEvent_ById() {
    try {
      await this.industryInstitutePartnershipMasterService.GetEvent_ById(this.searchRequest)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.request = data.Data;
            this.SelectedBranchList = this.request.Branchlist;
            this.SelectedSemesterList = this.request.Semesterlist;
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

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
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
                //this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
                this.request.FileUpload = data['Data'][0]["FileName"];
                this.request.Dis_FileUpload = data['Data'][0]["Dis_FileName"];

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

  async GetEventMasterData() {
  try {
    this.loaderService.requestStarted();

    // ✅ Event Type
    debugger
    const eventTypeRes: any = await this.commonMasterService.GetEventCommonMaster('EventType');
    debugger
    this.EventTypeList = eventTypeRes.Data;
    console.log(this.EventTypeList);

    // ✅ Event
    const eventRes: any = await this.commonMasterService.GetEventCommonMaster('Event');
    this.EventList = eventRes.Data;

    // ✅ Event Level
    const eventLevelRes: any = await this.commonMasterService.GetEventCommonMaster('EventLevel');
    this.EventLevelList = eventLevelRes.Data;

    // ✅ Event For
    const eventForRes: any = await this.commonMasterService.GetEventCommonMaster('EventFor');
    this.EventForList = eventForRes.Data;

  } catch (error) {
    console.error(error);
  } finally {
    this.loaderService.requestEnded();
  }
}

onEventTypeChange(event: any) {
  const selectedValue = event.target.value;

  // ⚠️ IMPORTANT: check using CODE or NAME
  this.isOJTSelected = selectedValue == 3; // if Code = 3 for OJT
}
}
