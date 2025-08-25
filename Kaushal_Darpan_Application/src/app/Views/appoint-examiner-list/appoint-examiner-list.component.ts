import { FormBuilder, FormGroup } from "@angular/forms";
import { ExaminerDataModel, TeacherForExaminerSearchModel } from "../../Models/ExaminerDataModel";
import { SSOLoginDataModel } from "../../Models/SSOLoginDataModel";
import { CommonFunctionService } from "../../Services/CommonFunction/common-function.service";
import { ExaminerService } from "../../Services/Examiner/examiner.service";
import { ToastrService } from "ngx-toastr";
import { LoaderService } from "../../Services/Loader/loader.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Component } from "@angular/core";

@Component({
    selector: 'app-appoint-examiner-list',
    templateUrl: './appoint-examiner-list.component.html',
    styleUrls: ['./appoint-examiner-list.component.css'],
    standalone: false
})
export class AppointExaminerListComponent {

  public HRManagerID: number = 0;
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public SubjectMasterDDLList: any[] = [];
  public StaffForExaminerList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public Table_SearchText: any = '';
  // public request = new HrMasterDataModel()
  public AppointExaminer = new ExaminerDataModel();
  public isSubmitted: boolean = false;
  public AppointExaminerFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new TeacherForExaminerSearchModel();


  constructor(
    private commonMasterService: CommonFunctionService,
    private examinerservice: ExaminerService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.getStaffForExaminerData()
    this.getInstituteMasterList()
  }
  get _AppointExaminerFormGroup() { return this.AppointExaminerFormGroup.controls; }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
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


  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SubjectMaster_StreamIDWise(this.searchRequest.StreamID, this.sSOLoginDataModel.DepartmentID, this.searchRequest.SemesterID,)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDLList = data.Data;
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

  async getStaffForExaminerData() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      //
      await this.examinerservice.GetTeacherForExaminer(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffForExaminerList = data.Data;
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new TeacherForExaminerSearchModel();
    this.AppointExaminer = new ExaminerDataModel();
    this.SubjectMasterDDLList = [];
    this.StaffForExaminerList = [];
    this.getStaffForExaminerData()
  }


}
