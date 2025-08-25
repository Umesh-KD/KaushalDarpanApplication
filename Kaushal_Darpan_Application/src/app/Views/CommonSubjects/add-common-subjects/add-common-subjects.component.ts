import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonSubjectService } from '../../../Services/CommonSubjects/common-subjects.service';
import { CommonSubjectMasterModel } from '../../../Models/CommonSubjectMasterModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CommonDDLSubjectCodeMasterModel, CommonDDLSubjectMasterModel } from '../../../Models/CommonDDLSubjectMasterModel';
import { CommonSubjectDetailsMasterModel } from '../../../Models/CommonSubjectDetailsMasterModel';

@Component({
    selector: 'app-add-common-subjects',
    templateUrl: './add-common-subjects.component.html',
    styleUrls: ['./add-common-subjects.component.css'],
    standalone: false
})
export class AddCommonSubjectsComponent implements OnInit {
  //@ViewChild('multiSelect') multiSelect: any;

  public CommonSubjectId: number = 0;
  public SemestarMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public request = new CommonSubjectMasterModel();
  public commonSubjectDetails = new CommonSubjectDetailsMasterModel();
  public subjectCodeDDLRequest = new CommonDDLSubjectCodeMasterModel();
  public SubjectID: any[] = [];
  public StreamID: any[] = [];
  public BranchList: any[] = [];
  public IsAdd: boolean = false;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public SubjectCode: string = '';
  public ErrorMessage: string = '';
  public CommonSubjectFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public settingsMultiselect: object = {};
  public SubjectCodeMasterDDLList: any[] = [];
  public filteredSubjectCodes: any[] =[];

  constructor(private commonMasterService: CommonFunctionService,
    private commonSubjectService: CommonSubjectService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal) {
  }

  async ngOnInit() {
    // setting and support i18n
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
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
    };
    // form group
    this.CommonSubjectFormGroup = this.formBuilder.group(
      {
        CommonSubjectName: ['', Validators.required],
        SemesterID: ['', [DropdownValidators]],
        SubjectCode: ['', Validators.required],
        SubjectID: [this.StreamMasterDDLList, Validators.required]
      });
    this.request.commonSubjectDetails = [];

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.CommonSubjectId = Number(this.activatedRoute.snapshot.queryParamMap.get('commonSubjectId')?.toString());
    await this.GetSemestarMatserDDL();
    await this.getStreamMasterList();
    //await this.GetSubjectCodeMasterDDL();

    //edit
    if (this.CommonSubjectId > 0) {
      //await this.ddlStream_Change();
      await this.GetById();
    }
  }
  get _CommonSubjectFormGroup() { return this.CommonSubjectFormGroup.controls; }

  GotoCommonSubject(): void {
    this.routers.navigate(['/commonsubjects']);
  }


  onSemesterChange() {
    // Filter the SubjectCode list based on the selected SemesterID
    if (this.request.SemesterID !== 0) {
      this.filteredSubjectCodes = this.SubjectCodeMasterDDLList.filter(item => item.SemesterID === this.request.SemesterID);
    } else {
      this.filteredSubjectCodes = [];
    }
  }

  // get semestar ddl
  async GetSemestarMatserDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemestarMasterDDLList = data['Data'];
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

  //async ddlSemester_Change() {
  //  try {

  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.SubjectMaster_SubjectCode_SemesterIDWise(this.request.SemesterID, this.sSOLoginDataModel.DepartmentID, this.request.SubjectCode)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.SubjectMasterDDLList = data.Data;
  //        console.log("SubjectMasterDDLList in function", this.SubjectMasterDDLList)
  //      }, error => console.error(error));
      
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async ddlStream_Change() {
  //  try {
  //    ;
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.SubjectMaster_StreamIDWise(this.request.StreamID, this.sSOLoginDataModel.DepartmentID, this.request.SemesterID,)
  //      .then((data: any) => {
  //        
  //        data = JSON.parse(JSON.stringify(data));
  //        this.SubjectMasterDDLList = data.Data;
  //        console.log("SubjectMasterDDLList", this.SubjectMasterDDLList)
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}


  async GetSubjectCodeMasterDDL() {
    try {
      this.subjectCodeDDLRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.subjectCodeDDLRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.subjectCodeDDLRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.subjectCodeDDLRequest.SemesterID = this.request.SemesterID;
      await this.commonMasterService.GetSubjectCodeMasterDDL(this.subjectCodeDDLRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectCodeMasterDDLList = data['Data'];

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async getStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;

      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // get detail by id
  async GetById() {
    try {
      this.loaderService.requestStarted();
      await this.commonSubjectService.GetById(this.CommonSubjectId)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.request.CommonSubjectID = data.Data.CommonSubjectID;
          this.request.CommonSubjectName = data.Data.CommonSubjectName;
          this.request.SemesterID = data.Data.SemesterID;
          this.GetSubjectCodeMasterDDL();
          this.request.SubjectCode = data.Data.SubjectCode;
          this.request.commonSubjectDetails = data.Data.commonSubjectDetails;                    
          const selectedSubjectIDs = this.request.commonSubjectDetails.map((x: any) => x.StreamID);
          this.BranchList = this.request.commonSubjectDetails;
          this.BranchList = this.StreamMasterDDLList.filter((subject: any) =>
            selectedSubjectIDs.includes(subject.StreamID)
          );
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
      if (this.CommonSubjectFormGroup.invalid) {
        return
      }
      this.isLoading = true;
      //Show Loading
      this.loaderService.requestStarted();

      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;

      var stm = this.request.commonSubjectDetails.filter(x => this.commonSubjectDetails.SubjectID)
      //child data process....
      //edit child data
      var editChild = this.request.commonSubjectDetails.filter(x => this.SubjectID.some(x1 => x1.ID == x.SubjectID));
      this.request.commonSubjectDetails = editChild;
      //add child
      //for (var i = 0; i < this.SubjectID.length; i++) {
      //  if (this.request.commonSubjectDetails.filter(x => x.SubjectID == this.SubjectID[i].ID).length == 0) {

      //    this.request.commonSubjectDetails.push({
      //      SubjectID: this.SubjectID[i].ID,
      //      CommonSubjectDetailsID: 0,
      //      CommonSubjectID: 0,
      //      StreamID: 0
      //    });
      //  }
      //}
    
      this.BranchList.map((item: any) => {
        this.request.commonSubjectDetails.push({
          CommonSubjectDetailsID: 0,
          SubjectID: item.StreamID,
          StreamID: item.StreamID,
          CommonSubjectID: this.request.CommonSubjectID,
          SubjectCode: this.request.SubjectCode,

        })
      });

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //save
      await this.commonSubjectService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.routers.navigate(['/commonsubjects']);
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

  // save data by Stream

  //async SaveData() {
  //  console.log(this.StreamID)
  //  try {
  //    ;
  //    this.isSubmitted = true;
  //    if (this.CommonSubjectFormGroup.invalid) {
  //      return
  //    }
  //    this.isLoading = true;
  //    //Show Loading
  //    this.loaderService.requestStarted();

  //    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
  //    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
  //    //child data process....
  //    //edit child data
  //    var editChild = this.request.commonSubjectDetails.filter(x => this.StreamID.some(x1 => x1.ID == x.StreamID));
  //    this.request.commonSubjectDetails = editChild;
  //    //add child
  //    for (var i = 0; i < this.StreamID.length; i++) {
  //      if (this.request.commonSubjectDetails.filter(x => x.StreamID == this.StreamID[i].StreamID).length == 0) {
  //        this.request.commonSubjectDetails.push({
  //          StreamID: this.StreamID[i].StreamID,
  //          CommonSubjectDetailsID: 0,
  //          CommonSubjectID: 0,
  //          SubjectID: 0,
  //        });
  //      }
  //    }

  //    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    //save
  //    await this.commonSubjectService.SaveData(this.request)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        console.log(data);

  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];

  //        if (this.State = EnumStatus.Success) {
  //          this.toastr.success(this.Message)
  //          this.ResetControls();
  //          this.routers.navigate(['/commonsubjects']);
  //        }
  //        else {
  //          this.toastr.error(this.ErrorMessage)
  //        }

  //      }, (error: any) => console.error(error)
  //      );
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}




  // reset
  ResetControls() {
    this.request = new CommonSubjectMasterModel();
    this.request.commonSubjectDetails = [];
    this.SubjectID = [];
    this.SubjectMasterDDLList = [];
    //this.multiSelect.toggleSelectAll();
  }

  // multiselect events
  public onFilterChange(item: any) {
    console.log(item);
  }
  public onDropDownClose(item: any) {
    console.log(item);
  }

  public onItemSelect(item: any) {
    console.log(item);
  }
  public onDeSelect(item: any) {
    console.log(item);
  }

  public onSelectAll(items: any) {
    console.log(items);
  }
  public onDeSelectAll(items: any) {
    console.log(items);
  }
}
