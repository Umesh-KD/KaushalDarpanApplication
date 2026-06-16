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
import { Location } from '@angular/common';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-add-iip-events',
  standalone: false,
  templateUrl: './add-iip-events.component.html',
  styleUrl: './add-iip-events.component.css'
})
export class AddIIPEventsComponent {
  public EventFormGroup!: FormGroup
  public requestSSoApi = new CommonVerifierApiDataModel();
  public Isverifed: boolean = false
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
  isFacultySelected: boolean = false;
  public DivisionMasterList: any = [];
  isInstituteLevel: boolean = false;
isDivisionLevel: boolean = false;
public PageMode: string = '';
public IsViewMode: boolean = false;
public ReturnUrl: string = '';
  constructor(
    private commonMasterService: CommonFunctionService, 
    private industryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, 
    private routers: Router, 
    private modalService: NgbModal, 
    private appsettingConfig: AppsettingService,
    private location: Location,
  ) { }


  async ngOnInit() {
    this.ReturnUrl =
  this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || '';
    this.EventFormGroup = this.formBuilder.group({
        EventName: ['', Validators.required],
        EventTypeID: ['', [DropdownValidators]],
        Event: ['', [DropdownValidators]],
        EventURL:[''],
        EventStartDate: ['', Validators.required],
        EventEndDate: ['', Validators.required],
        EventForID: ['', Validators.required],
        // Semesterlist: ['',],
        // Branchlist: ['', ],
        Semesterlist: [[], Validators.required],
        Branchlist: [[], Validators.required],
        EventLevelID: ['', [DropdownValidators]],
        Remark: [''],
        SSOID: [''],
        MobileNo: [''],
        Email: [''],
        Designation: [''],
        TrainingDuration: [''],
        AreaOfDomain: [''],
        DivisionID: ['0'],
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

     this.PageMode = String(this.activatedRoute.snapshot.queryParamMap.get('mode'));

if (this.PageMode == 'view') {
  this.IsViewMode = true;
}

    if(this.CompanyID > 0 && this.EventID > 0) {
      this.searchRequest.CompanyID = this.CompanyID;
      this.searchRequest.EventID = this.EventID;
      await this.GetEvent_ById();

      if (this.IsViewMode) {
  this.EventFormGroup.disable();
}
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

  async GetStreamDataList() {
    try {
      //debugger
      this.loaderService.requestStarted();      
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, 1, this.sSOLoginDataModel.EndTermID)
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
    debugger
    console.log("branch", this.SelectedBranchList)
    console.log("semester", this.SelectedSemesterList)
    this.isSubmitted = true;
    if(this.EventFormGroup.invalid) {
      this.toastr.error("Please fill form properly");
      return
    }
    try {
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.request.InstituteID = this.sSOLoginDataModel.InstituteID
      this.request.UserID = this.sSOLoginDataModel.UserID;
      debugger
      await this.industryInstitutePartnershipMasterService.SaveData_IIP_Events(this.request)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.routers.navigate(['/iip-events']);
          } else {
            this.toastr.error(data.ErrorMessage)
          }
      })
    } catch (error) {
      console.error(error)
    }
  }

  // async GetEvent_ById() {
  //   try {
  //     await this.industryInstitutePartnershipMasterService.GetEvent_ById(this.searchRequest)
  //       .then(async (data: any) => {
  //         data = JSON.parse(JSON.stringify(data));
  //         if (data.State == EnumStatus.Success) {
  //           this.request = data.Data;
  //           this.SelectedBranchList = this.request.Branchlist;
  //           this.SelectedSemesterList = this.request.Semesterlist;
  //           if (this.request.EventLevelID == 1) {
  //             this.isInstituteLevel = true;
  //              }

  //                  if (this.request.EventLevelID == 3) {
  //                this.isDivisionLevel = true;
  //                 await this.GetDivisionMasterList();
  //                }
  //         } else {
  //           this.toastr.error(data.ErrorMessage)
  //         }
  //     })
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }

  async GetEvent_ById() {
    try {
   // debugger
    await this.industryInstitutePartnershipMasterService.GetEvent_ById(this.searchRequest)
      .then(async (data: any) => {

        data = JSON.parse(JSON.stringify(data));

        if (data.State == EnumStatus.Success) {

          this.request = data.Data;
          this.isFacultySelected = Number(this.request.EventForID) == 2;

          const semesterControl = this.EventFormGroup.get('Semesterlist');

          if (this.isFacultySelected) {

            semesterControl?.clearValidators();

          } else {

            semesterControl?.setValidators([Validators.required]);
          }

          semesterControl?.updateValueAndValidity();


          this.SelectedBranchList = this.request.Branchlist;
          this.SelectedSemesterList = this.request.Semesterlist;

          // =========================
          // OJT BLOCK SHOW
          // =========================
          this.isOJTSelected = Number(this.request.EventTypeID) == 3;

          // =========================
          // EVENT LEVEL
          // =========================
          if (this.request.EventLevelID == 1) {

            this.isInstituteLevel = true;
          }

          else if (this.request.EventLevelID == 3) {

            this.isDivisionLevel = true;

            await this.GetDivisionMasterList();
            await this.GetStreamDataList();
          }
          else {
            await this.GetStreamDataList();
          }

          // =========================
          // VIEW MODE
          // =========================
          if (this.IsViewMode) {

            this.EventFormGroup.disable();
          }

        } else {

          this.toastr.error(data.ErrorMessage);
        }
      });

  } catch (error) {

    console.error(error);
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
      //debugger
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


  public file1!: File;
  async onFilechangeEvent(event: any, Type: string) {
    try {
      //debugger
      this.file1 = event.target.files[0];
      if (this.file1) {
        if (this.file1.type == 'image/jpeg' || this.file1.type == 'image/jpg' || this.file1.type == 'image/png' || this.file1.type == 'application/pdf') {
          //size validation
          if (this.file1.size > 2000000) {
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

        await this.commonMasterService.UploadDocument(this.file1)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                  this.request.UploadEventPosterFile = data['Data'][0]["FileName"];
                  this.request.Dis_UploadEventPosterFile = data['Data'][0]["Dis_FileName"];
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

  if (this.request.EventTypeID == 1) {
    this.EventFormGroup.get('EventURL')?.setValidators([Validators.required, Validators.pattern('https?://.+')]);
  }
  else {
    this.EventFormGroup.get('EventURL')?.clearValidators();
  }
  this.EventFormGroup.get('EventURL')?.updateValueAndValidity();
  // ⚠️ IMPORTANT: check using CODE or NAME
  this.isOJTSelected = selectedValue == 3; // if Code = 3 for OJT
}

async GetDivisionMasterList() {
    debugger;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
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

  async onEventLevelChange(event: any) {

   // debugger
  const selectedValue = Number(event.target.value);
  this.isInstituteLevel = false;
  this.isDivisionLevel = false;

  // Institute Level
  if (selectedValue == 1) {

    this.isInstituteLevel = true;

    // pass institute id in save
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;

    // clear division
    this.request.DivisionID = 0;
    await this.GetMasterData();
  }

  // Division Level
  else if (selectedValue == 3) {

    this.isDivisionLevel = true;

    // clear institute
    this.request.InstituteID = 0;

    // load division list
    await this.GetDivisionMasterList();
    await this.GetStreamDataList();
  }
  else {
    this.request.InstituteID = 0;
    this.request.DivisionID = 0;
    await this.GetStreamDataList();
  }
}

// GoBack() {
//   this.routers.navigate(['/IndustryInstitutePartnershipList']);
// // debugger
// //   // if browser history exists
// //   if (window.history.length > 1) {

// //     this.location.back();
// //   }
// //   else {

// //     // fallback
// //     this.routers.navigate(['/IndustryInstitutePartnershipList']);
// //   }
// }

GoBack() {

  //this.routers.navigate(['/IIPCompanyMaster']);

  if (this.ReturnUrl) {

   this.routers.navigateByUrl(this.ReturnUrl);

  } else {

   this.routers.navigate(['/IIPCompanyMaster']);
  }
}

onEventForChange(event: any) {

  const selectedValue = Number(event.target.value);
  // FACULTY => ID = 10 , CODE = 2
  this.isFacultySelected = selectedValue == 2;

  const semesterControl = this.EventFormGroup.get('Semesterlist');

  if (this.isFacultySelected) {

    // Semester optional
    semesterControl?.clearValidators();

    // clear selected semester
    this.request.Semesterlist = [];

    semesterControl?.setValue([]);

  } else {

    // Semester mandatory
    semesterControl?.setValidators([Validators.required]);
  }

  semesterControl?.updateValueAndValidity();
  }



  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    this.Isverifed = false
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      this.request.SSOID = ''
      this.request.MobileNo = ''
      this.request.Email = ''
/*      this.request.Name = ''*/
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
/*            this.request.Name = parsedData.displayName;*/
            this.request.MobileNo = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            this.request.Email = parsedData.mailPersonal;
            this.request.Designation = parsedData.designation;
            this.Isverifed = true

          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  onlyNumber(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;

    // Allow only numbers
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }

    return true;
  }

}
