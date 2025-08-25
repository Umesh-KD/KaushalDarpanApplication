import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { PlacementSelectedStudentResponseModel, PlacementStudentSelectedSearchModel } from '../../../Models/PlacementSelectedStudentResponseModel';
import { PlacementSelectedStudentsService } from '../../../Services/PlacementSelectedStudents/placement-selected-students.service';
import { async } from 'rxjs';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ITIPlacementSelectedStudentsService } from '../../../Services/ITIPlacementSelectedStudents/iti-placement-selected-students.service';



declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
    selector: 'app-placement-selected-students',
    templateUrl: './placement-selected-students.component.html',
    styleUrls: ['./placement-selected-students.component.css'],
    standalone: false
})
export class PlacementSelectedStudentsComponent implements OnInit {
  public PlacementSelectedListStudentForm!: FormGroup;
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();

  public InstituteMasterList: any[] = [];
  public StreamMasterList: any[] = [];
  public CampusMasterList: any[] = [];
  public CampusWiseHiringRoleList: any[] = [];
  public CampusPostID: number = 0;
  public BranchID: number = 0;
  public HiringRoleID: number = 0;
  public FinancialYearList: any[] = [];
  public HiringRoleMasterList: any[] = [];
  public NoRangeList: any[] = [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];
  public searchRequest = new PlacementStudentSelectedSearchModel();
  public StudentList: PlacementSelectedStudentResponseModel[] = [];

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private placementShortListStudentService: ITIPlacementSelectedStudentsService, private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private fb: FormBuilder, private modalService: NgbModal) {
  }

  async ngOnInit() {
    this.PlacementSelectedListStudentForm = this.formBuilder.group({
      CampusPostID: ['', [DropdownValidators]],
      BranchID: ['', [DropdownValidators]],
      HiringRoleID: [''],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetITICampusPostMasterDDL();

    this.isSubmitted = false;
    console.log(this.isSubmitted)
  }
  get _PlacementSelectedListStudentForm() { return this.PlacementSelectedListStudentForm.controls; }
  //
  async GetITICampusPostMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetITICampusPostMasterDDL(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusMasterList = data['Data'];
          console.log(this.CampusMasterList);
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
      this.BranchID = 0;
      this.HiringRoleID = 0;
      this.StreamMasterList = [];
      console.log(this.StreamMasterList)
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
      this.isSubmitted = false;
      await this.GetStreamMasterList(this.CampusPostID);

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
    if (this.PlacementSelectedListStudentForm.invalid) {
      return console.log("error")
    }
    this.StudentList = [];
    try {
      this.loaderService.requestStarted();

      this.searchRequest.BranchID = this.BranchID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.CampusPostID = this.CampusPostID
      this.searchRequest.AgeTo = this.searchRequest.AgeTo ?? 0;
      this.searchRequest.HiringRoleID = this.HiringRoleID;
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
        this.isSubmitted = false;
      }, 200);
    }
  }
  //clear search
  ClearSearchData() {
    this.isSubmitted = false;
    this.StudentList = [];
    this.HiringRoleMasterList = [];
    this.StreamMasterList = [];
  }
  //save
  async SaveAllData() {
    try {
      this.isSubmitted = true;
      this.loaderService.requestStarted();

      this.StudentList.forEach(x => {
        x.ModifyBy = this.sSOLoginDataModel.UserID;
      });
      console.log(this.StudentList);

      const isAnySelected = this.StudentList.some(x => x.Marked);
      if (!isAnySelected) {
        this.toastr.error('Please select at least one checkbox!');

        return; // Exit the method if no checkbox is selected
      }
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
          this.toastr.error('Failed to Action on Selection!');
        });
    }
    catch (ex) {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isSubmitted = false;
      }, 200);
    }
  }
  //
  public async ExcelExport() {
    if (this.StudentList.length > 0) {
      tableToExcel("tbl_placementStudent", "Students", "PlacementStudent");
    }
  }
  //
  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }
}
