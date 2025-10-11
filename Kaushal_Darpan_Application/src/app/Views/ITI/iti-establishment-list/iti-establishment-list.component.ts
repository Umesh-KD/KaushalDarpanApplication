import { Component } from '@angular/core';
import { ItiPlanningSearchModel, SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumRole } from '../../../Common/GlobalConstants';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-iti-establishment-list',
  standalone: false,
  templateUrl: './iti-establishment-list.component.html',
  styleUrl: './iti-establishment-list.component.css'
})
export class ItiEstablishmentListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ItiPlanningSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  constructor(
    private commonMasterService: CommonFunctionService,
    private ITIsService: ITIsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;


    console.log(this.sSOLoginDataModel);
    //this.getSemesterMasterList();
    //this.getStreamMasterList();
    //this.getExamMasterList();
    //if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
    //  this.isInstituteDisabled = true;
    //  this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    //}
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
    /*  this.getExaminerData()*/

    await this.GetGovtITI()
    await this.GetAllGovtITI()
  }



  async GetGovtITI() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("GovtIti")
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.InstituteMasterDDLList = data['Data'];

          // console.log(this.DivisionMasterList)
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




  async GetAllGovtITI() {
    try {


      this.loaderService.requestStarted();
      await this.ITIsService.GetAllEstablishmentIti(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ExaminersList = data['Data'];

          // console.log(this.DivisionMasterList)
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

  async ResetControl() {
    this.searchRequest.CollegeName = ''
    this.searchRequest.IsNewCollege = 2
    this.searchRequest.InstituteID = 0
  }



}
