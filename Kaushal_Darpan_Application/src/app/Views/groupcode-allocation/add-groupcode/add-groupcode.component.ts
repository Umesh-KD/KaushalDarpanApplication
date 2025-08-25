import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { GroupCodeAddEditModel, GroupCodeAllocationSearchModel, GroupCodeDetailAddEditModel } from '../../../Models/GroupCodeAllocationModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { GroupcodeAllocationService } from '../../../Services/groupcode-allocation/groupcode-allocation.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumConfigurationType, EnumStatus } from '../../../Common/GlobalConstants';
import { CommonSerialMasterRequestModel } from '../../../Models/CommonSerialMasterRequestModel';
import { CommonSerialMasterResponseModel } from '../../../Models/CommonSerialMasterResponseModel';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-add-groupcode',
  templateUrl: './add-groupcode.component.html',
  styleUrls: ['./add-groupcode.component.css'],
  standalone: false
})
export class GroupcodeAddComponent {
  public Message: any = [];
  public State: number = -1;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";

  public searchRequest = new GroupCodeAllocationSearchModel();
  public GroupCodeList: GroupCodeAddEditModel[] = []
  public GroupCodeDetailList: GroupCodeDetailAddEditModel[] = []

  public GroupCodeAllocationSearchForm!: FormGroup;
  public SemestarMasterDDLList: any[] = [];
  public requestSerialMaster = new CommonSerialMasterRequestModel();
  public SerialMasterDataList: CommonSerialMasterResponseModel[] = [];

  public closeResult: string | undefined;
  public RemaningShiftableGroupSubjects: any[] = [];
  public FromShiftableGroupSubjects: any = {};
  public toSelectedIndex: number | null = null;

  constructor(private commonMasterService: CommonFunctionService, private router: Router, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private groupcodeAllocationService: GroupcodeAllocationService, private modalService: NgbModal) {
  }

  async ngOnInit() {
    //form
    this.GroupCodeAllocationSearchForm = this.formBuilder.group({
      SemesterID: ['', [DropdownValidators]],
      PartitionSize: ['', [DropdownValidators]],
      CommonSubjectYesNo: ['', [DropdownValidators]]
    });

    // login session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetSemestarMatserDDL();
    await this.GetSerialMasterData();
  }

  get formSearch() { return this.GroupCodeAllocationSearchForm.controls; }

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

  async GetPartitionData() {
    try {
      this.isSubmitted = true;
      if (this.GroupCodeAllocationSearchForm.invalid) {
        return;
      }
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      await this.groupcodeAllocationService.GetPartitionData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.GroupCodeList = data["Data"];//GroupCode
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async SavePartitionData() {
    try {
      if (this.GroupCodeList.length == 0 && this.GroupCodeDetailList.length == 0) {
        this.toastr.error("Validation failed!");
        return;
      }
      //set session
      this.GroupCodeList.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
      });
      //save
      await this.groupcodeAllocationService.SavePartitionData(this.GroupCodeList)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          console.log("data on save", data)
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            await this.ClearSearchData();
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.Message)
          }
          else {
            this.toastr.error(this.Message)
            console.log(data['ErrorMessage']);//actual error
          }
        });
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async ClearSearchData() {
    this.searchRequest = new GroupCodeAllocationSearchModel();
    this.GroupCodeList = [];
    this.isSubmitted = false;
    await this.GetSerialMasterData();
  }

  async GetSerialMasterData() {
    try {
      //set
      this.requestSerialMaster.TypeID = EnumConfigurationType.GroupCode;
      this.requestSerialMaster.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.requestSerialMaster.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.requestSerialMaster.EndTermID = this.sSOLoginDataModel.EndTermID;
      await this.commonMasterService.GetSerialMasterData(this.requestSerialMaster)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.SerialMasterDataList = data['Data'];
          //partition size
          if (this.SerialMasterDataList.length > 0) {
            this.searchRequest.PartitionSize = this.SerialMasterDataList[0].PartitionSize;
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  OpenPopupAndMergeGroupSubject(content: any, item: GroupCodeAddEditModel) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    // get remaining shift records
    this.RemaningShiftableGroupSubjects = this.GroupCodeList.filter(x => x.SubjectCode == item.SubjectCode && x.PageNumber != item.PageNumber);
    this.RemaningShiftableGroupSubjects.forEach(x => {
      x.ToSelected = false;
    });

    // get selected shift records
    this.FromShiftableGroupSubjects = this.GroupCodeList.find(x => x.SubjectCode == item.SubjectCode && x.PageNumber == item.PageNumber);
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ClosePopupAndMergeGroupSubject() {
    this.RemaningShiftableGroupSubjects = [];
    this.FromShiftableGroupSubjects = {};
    this.toSelectedIndex = null;
    this.modalService.dismissAll();
  }

  ShiftAndMergeToSubject() {
    
    // get rows
    let mergeToShiftRow = this.RemaningShiftableGroupSubjects.filter(x => x.ToSelected == true);// source

    if (mergeToShiftRow == null || mergeToShiftRow.length == 0 || this.FromShiftableGroupSubjects == null) {
      this.toastr.warning("Invalid!");
      return;
    }

    // merge source row into destination row
    mergeToShiftRow.forEach(x => {
      x.Total += this.FromShiftableGroupSubjects.Total;
      x.StudentExamPaperMarksIDs += ',' + this.FromShiftableGroupSubjects.StudentExamPaperMarksIDs;
    });

    //delete the source shifted row
    let index = this.GroupCodeList.findIndex(x => x.SubjectCode == this.FromShiftableGroupSubjects.SubjectCode && x.PageNumber == this.FromShiftableGroupSubjects.PageNumber)
    if (index != -1) {
      this.GroupCodeList.splice(index, 1);
    }

    // reset pagenumber
    let currentSubject: number | null = null;
    let pageNo = 1;
    this.GroupCodeList.filter(x => x.SubjectCode == this.FromShiftableGroupSubjects.SubjectCode).forEach(item => {
      if (item.SubjectCode !== currentSubject) {
        currentSubject = item.SubjectCode;
        pageNo = 1;
      }
      //set 
      item.PageNumber = pageNo++;
      
      // if any subject group has more then 1 row
      const subjectGorupCount = this.GroupCodeList.filter(x => x.SubjectCode === currentSubject)?.length;
      if (subjectGorupCount > 1) {
        item.UpShiftPageNumber = item.PageNumber;
      }
      else {
        item.UpShiftPageNumber = 0;
      }

    });
    //
    console.log("after merge", this.GroupCodeList);
    //close
    this.ClosePopupAndMergeGroupSubject();
    this.toastr.success("Successfully Shift & Merge.");
  }

  updateSelectionInListOfToSelected(idx: number) {
    this.RemaningShiftableGroupSubjects.forEach((item, i) => {
      item.ToSelected = (i === idx);
    });
  }
}
