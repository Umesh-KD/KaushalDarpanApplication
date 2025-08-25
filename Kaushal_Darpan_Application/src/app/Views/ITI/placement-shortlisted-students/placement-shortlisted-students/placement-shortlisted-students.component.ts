import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';

import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementShortlistedStudentsService } from '../../../../Services/PlacementShortlistedStudents/placement-shortlisted-students.service';
import { PlacementShortlistedStuSearch, PlacementShortListStudentResponseModel } from '../../../../Models/PlacementShortListStudentResponseModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
// import { ITIPlacementShortlistedStudentsService } from '../../../../Services/ITIPlacementShortlistedStudents/itiplacement-shortlisted-students.service';
import { ITIPlacementShortlistedStudentsService } from '../../../../Services/ITIPlacementShortlistedStudents/itiplacement-shortlisted-students.service';
declare function tableToExcel(table: any, name: any, fileName: any): any;

@Component({
    selector: 'app-placement-shortlisted-students',
    templateUrl: './placement-shortlisted-students.component.html',
    styleUrls: ['./placement-shortlisted-students.component.css'],
    standalone: false
})
export class PlacementShortlistedStudentsComponent implements OnInit {
  public PlacementShortListStudentForm!: FormGroup;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();

  public CampusMasterList: any[] = [];
  public StreamMasterList: any[] = [];
  public HiringRoleMasterList: any[] = []
  public IsDisable: boolean = false
  public CampusPostID: number = 0;
  public BranchID: number = 0;
  public HiringRoleID: number = 0;
  public StudentList: PlacementShortListStudentResponseModel[] = [];
  public searchRequest = new PlacementShortlistedStuSearch();

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private placementShortListStudentService: ITIPlacementShortlistedStudentsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {

    this.PlacementShortListStudentForm = this.formBuilder.group({
      CampusPostID: ['', [DropdownValidators]],
      BranchID: ['', [DropdownValidators]],
      HiringRoleID: ['', [DropdownValidators]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetITICampusPostMasterDDL();
    //await this.GetAllData();

  }

  //
  get form() { return this.PlacementShortListStudentForm.controls; }
  //
  async GetITICampusPostMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetITICampusPostMasterDDL(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusMasterList = data['Data'];
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
  //
  async GetStreamMasterList(CampusPostID: number) {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ITIStreamMasterByCampus(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
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
  //
  async GetCampusWiseHiringRoleDDL() {
    try {
      this.GetStreamMasterList(this.CampusPostID);
      this.HiringRoleMasterList = [];
      this.loaderService.requestStarted();

      await this.commonMasterService.GetITICampusWiseHiringRoleDDL(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.HiringRoleMasterList = data['Data'];
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
  //get all
  async GetAllData() {
    this.isSubmitted = true;
    //
    this.refreshBranchRefValidation(false);
    //
    if (this.PlacementShortListStudentForm.invalid) {
      return console.log("error")
    }
    this.StudentList = [];
    try {
      this.loaderService.requestStarted();
      this.searchRequest.RoleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.UserId = this.sSOLoginDataModel.UserID
      this.searchRequest.BranchID = this.BranchID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.CampusPostID = this.CampusPostID

      await this.placementShortListStudentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.StudentList = data['Data'];
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

  async ClearSearchData() {
    this.HiringRoleMasterList = [];
    this.StudentList = [];
    await this.GetAllData()
  }
  //save
  async SaveAllData() {
    this.isSubmitted = true;
    //
    this.refreshBranchRefValidation(true);
    //
    if (this.PlacementShortListStudentForm.invalid) {
      return console.log("error")
    }
    try {
      this.loaderService.requestStarted();

      const isAnySelected = this.StudentList.some(x => x.Marked);
      if (!isAnySelected) {
        this.toastr.error('Please select at least one checkbox!');
        return; // Exit the method if no checkbox is selected
      }

      //
      this.StudentList.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
        x.CampusPostID = this.CampusPostID;
        x.HiringRole = this.HiringRoleID;
      });
      console.log(this.StudentList);
      //save

      await this.placementShortListStudentService.SaveAllData(this.StudentList)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            await this.GetAllData();
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error('Failed to Action Short List!');
        });
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
  // export
  public async ExcelExport() {
    if (this.StudentList.length > 0) {
      tableToExcel("tbl_placementStudent", "Students", "PlacementStudent");
    }
  }
  //
  refreshBranchRefValidation(isValidate: boolean) {
    // clear
    this.PlacementShortListStudentForm.get('HiringRoleID')?.clearValidators();
    // set
    if (isValidate) {
      this.PlacementShortListStudentForm.get('HiringRoleID')?.setValidators([DropdownValidators]);
    }
    // update
    this.PlacementShortListStudentForm.get('HiringRoleID')?.updateValueAndValidity();
  }
  //
  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }
}
