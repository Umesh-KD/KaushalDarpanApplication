import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlacementShortlistedStudentsService } from '../../../Services/PlacementShortlistedStudents/placement-shortlisted-students.service';
import { PlacementShortlistedStuSearch, PlacementShortListStudentResponseModel } from '../../../Models/PlacementShortListStudentResponseModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumMessageType, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';
import * as XLSX from 'xlsx';
import { CommonFunctionHelper } from '../../../Common/commonFunctionHelper';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';

declare function tableToExcel(table: any, name: any, fileName: any): any;

@Component({
  selector: 'app-placement-shortlisted-students',
  templateUrl: './placement-shortlisted-students.component.html',
  styleUrls: ['./placement-shortlisted-students.component.css'],
  standalone: false
})
export class PlacementShortlistedStudentsComponent implements OnInit {
  public PlacementShortListStudentForm!: FormGroup;
  public PlacementShortListStudentForm1!: FormGroup;

  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  public UserID: number = 0;
  public AllSelect: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public _GlobalConstants: any = GlobalConstants;

  public PlacedStudentsCountList: any[] = [];
  public CampusMasterList: any[] = [];
  public StreamMasterList: any[] = [];
  public HiringRoleMasterList: any[] = []
  public IsDisable: boolean = false
  public CampusPostID: number = 0;
  public BranchID: number = 0;
  public HiringRoleID: number = 0;
  public StudentList: any[] = [];
  public searchRequest = new PlacementShortlistedStuSearch();

  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private placementShortListStudentService: PlacementShortlistedStudentsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private commonFunctionHelper: CommonFunctionHelper,
    private smsMailService: SMSMailService
  ) {
  }


  async ngOnInit() {

    this.PlacementShortListStudentForm = this.formBuilder.group({
      CampusPostID: ['', [DropdownValidators]],
      BranchID: [''],
      //HiringRoleID: [''],
    });
    this.PlacementShortListStudentForm1 = this.formBuilder.group({
      HiringRoleID: ['', [DropdownValidators]],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCampusPostMasterDDL();
    await this.GetPlacedStudentsCountList();
    //await this.GetAllData();

  }

  //
  get form() { return this.PlacementShortListStudentForm.controls; }
  //
  async GetCampusPostMasterDDL() {
    //debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCampusPostMasterDDL(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.UserID)
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
      await this.commonMasterService.StreamMasterByCampus(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
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

      await this.commonMasterService.GetCampusWiseHiringRoleDDL(this.CampusPostID, this.sSOLoginDataModel.DepartmentID)
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
    //debugger
    this.isSubmitted = true;
    //
    this.refreshBranchRefValidation(false);
    //
    if (this.PlacementShortListStudentForm.invalid) {
      return
    }
    //debugger
    this.StudentList = [];
    try {
      this.searchRequest.RoleId = this.sSOLoginDataModel.RoleID;
      this.searchRequest.UserId = this.sSOLoginDataModel.UserID
      this.searchRequest.BranchID = this.BranchID;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
      this.searchRequest.CampusPostID = this.CampusPostID
      this.searchRequest.InstituteId = this.sSOLoginDataModel.InstituteID
      this.searchRequest.HiringRoleID = this.HiringRoleID
      this.searchRequest.NotifyStatus = 'Shortlist';
      this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

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
  }

  async GetPlacedStudentsCountList() {
    this.PlacedStudentsCountList = [];
    try {
      //debugger;
      await this.placementShortListStudentService.GetPlacedStudentsCountList()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          if (data.State == EnumStatus.Success) {
            this.PlacedStudentsCountList = data['Data'];
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async ClearSearchData() {
    this.HiringRoleMasterList = [];
    this.StudentList = [];
    await this.GetAllData()
  }
  //save
  async SaveAllData() {
    //debugger
    this.isSubmitted = true;
    //
    this.refreshBranchRefValidation(true);
    //
    if (this.PlacementShortListStudentForm.invalid) {
      return
    }
    if (this.PlacementShortListStudentForm1.invalid) {
      return
    }
    try {

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
            this.toastr.error(this.Message)
            console.error(this.ErrorMessage);
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
  }

  async SaveReject() {
    //debugger
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

      await this.placementShortListStudentService.SaveReject(this.StudentList)
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





  //
  refreshBranchRefValidation(isValidate: boolean) {
    // clear
    this.PlacementShortListStudentForm1.get('HiringRoleID')?.clearValidators();
    // set
    if (isValidate) {
      this.PlacementShortListStudentForm1.get('HiringRoleID')?.setValidators([DropdownValidators]);
    }
    // update
    this.PlacementShortListStudentForm1.get('HiringRoleID')?.updateValueAndValidity();
  }
  //
  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }

  // export
  public async ExcelExport() {
    if (this.StudentList.length > 0) {
      tableToExcel("tbl_placementStudent", "Students", "PlacementStudent");
    }
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID', 'MobileNo', 'Email', 'Mobile', 'Email Address', 'Marked', 'UploadedResume', 'Selected', 'HiringRole', 'CampusPostID'
    ];
    const filteredData = this.StudentList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ShortlistStudentData.xlsx');
  }

  async downloadPDF() {
    const isAnySelected = this.StudentList.some(x => x.Marked);
    if (!isAnySelected) {
      this.toastr.error('Please select at least one checkbox!');
      return; // Exit the method if no checkbox is selected
    }

    // get the selected students
    const selectedStudents = this.StudentList.filter(student => student.Marked && student.UploadedResume != '') ?? [];
    if (selectedStudents.length == 0) {
      this.toastr.error('No valid resumes found!');
      return;
    }

    // add in model
    const studentWithFilesList = selectedStudents.map(student => ({
      StudentID: student.StudentID,
      CampusPostID: student.CampusPostID,
      PostNo: student.PostNo,
      UploadedResume: student.UploadedResume
    }));
    //debugger
    // call
    await this.placementShortListStudentService.DownloadPlacementShortListedStudents(studentWithFilesList)
      .then((data: any) => {
        if (data["State"] == EnumStatus.Success) {
          this.commonFunctionHelper.downloadBase64OfZip(data["Data"], "ShortlistedStudentsResumes.zip");
          this.toastr.success(data["Message"]);
        } else if (data["State"] == EnumStatus.Warning) {
          this.toastr.success(data["Message"]);
        } else {
          this.toastr.error(data["Message"]);
          console.error(data["ErrorMessage"]);
        }
      })
      .catch((error: any) => {
        console.error(error);
        this.toastr.error('Failed to download resumes!');
      });

  }

  async NotifyStudents() {
    const isAnySelected = this.StudentList.some(x => x.Marked);
    if (!isAnySelected) {
      this.toastr.error('Please select at least one checkbox!');
      return; // Exit the method if no checkbox is selected
    }
    //debugger
    // get the selected students
    const selectedStudents = this.StudentList.filter(student => student.Marked ) ?? [];
    // add in model
    const studentWithFilesList = selectedStudents.map(student => ({
      StudentID: student.StudentID,
      CampusPostID: student.CampusPostID,
      RoundNo: student.RoundNo,
      EnrollmentNo: student.EnrollmentNo,
      MobileNo: student.MobileNo,
      MessageType: EnumMessageType.Bter_StudentShortList,
      UserID: this.sSOLoginDataModel.UserID,
      StudentName: student.StudentName,
      NotifyFor: 'Shortlist',
      EndTermID: this.sSOLoginDataModel.EndTermID,
      FinancialYearID: this.sSOLoginDataModel.FinancialYearID,
      RegistrationNo: student.RegistrationNo
    }));
    //debugger
    // call
    await this.smsMailService.NorifyStudent_PlacementShortlist(studentWithFilesList)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          console.log('Message sent successfully', data);
        } else {
          console.log('Something went wrong', data);
        }
      }, (error: any) => console.error(error));

  }

}
