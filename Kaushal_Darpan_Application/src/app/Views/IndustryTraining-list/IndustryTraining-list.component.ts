import { Component } from '@angular/core';
import { ScholarshipSearchModel } from '../../Models/ScholarshipDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { IndustryInstitutePartnershipMasterService } from '../../Services/IndustryInstitutePartnershipMaster/industryInstitutePartnership-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../Services/Report/report.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { IndustryTrainingSearch } from '../../Models/IndustryInstitutePartnershipMasterDataModel';
import { ItiTradeSearchModel } from '../../Models/CommonMasterDataModel';


@Component({
  selector: 'app-IndustryTraining-list',
  standalone: false,
  templateUrl: './IndustryTraining-list.component.html',
  styleUrl: './IndustryTraining-list.component.css'
})
export class IndustryTrainingListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public IndustryTrainingList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new IndustryTrainingSearch();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  public ItiTradeList: any = [];
  public DDlTradesearchRequest = new ItiTradeSearchModel();

  constructor(
    private commonMasterService: CommonFunctionService,
    private IndustryInstitutePartnershipMasterService: IndustryInstitutePartnershipMasterService,
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
   /* this.searchRequest.IndustryID = Number(this.activatedRoute.snapshot.queryParamMap.get('IndustryID')?.toString());*/
    const industryId = Number(this.activatedRoute.snapshot.queryParamMap.get('IndustryID')?.toString());
    this.searchRequest.IndustryID = Number(isNaN(industryId) ? null : (industryId === 0 ? 0 : industryId));

    console.log(this.sSOLoginDataModel);
    this.getSemesterMasterList();
    this.getStreamMasterList();
    this.GetTradeListDDL();
    await this.getIndustryTrainingData();

    //this.getIndustryTrainingDataList();
    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon) {
      this.isInstituteDisabled = true;
     
    }
    //this.getExaminerData();
    //this.getExamMasterList();//grid data
   
  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        console.log("SemesterMasterDDLList", this.SemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeListDDL() {
    
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          //this.TradeDDLList = data['Data'];
          //console.log(this.TradeDDLList)
          const selectOption = { StreamID: 0, StreamName: '--Select--' };
          this.ItiTradeList = [selectOption, ...data['Data']];
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



  //async GetTradeListDDL() {
    
  //  try {

  //    this.DDlTradesearchRequest.CollegeID = 9,
  //      this.DDlTradesearchRequest.TradeLevel = 0,
  //      this.DDlTradesearchRequest.action = '_getDatabyCollege',
  //      this.DDlTradesearchRequest.IsPH = 0,
  //      this.DDlTradesearchRequest.CourseTypeID = 0
  //    this.loaderService.requestStarted();

  //    await this.commonMasterService.TradeListGetAllData(this.DDlTradesearchRequest).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.ItiTradeList = data.Data
  //    })
  //  } catch (error) {
  //    console.error(error)
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async getIndustryTrainingDataList() {
    try {
      this.loaderService.requestStarted();
      await this.IndustryInstitutePartnershipMasterService.GetAllIndustryTrainingData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
        console.log("ExamList", this.ExamList);
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
      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StreamMasterDDLList = data.Data;
        console.log("StreamMasterDDLList", this.StreamMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  

  async getIndustryTrainingData() {
    
    
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    

    try {
      await this.IndustryInstitutePartnershipMasterService.GetAllIndustryTrainingData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.IndustryTrainingList = data.Data;
        console.log("this.IndustryTrainingList", this.IndustryTrainingList)
      })
    } catch (error) {
      console.error(error);
    }
  }

 

  async ResetControl() {
    this.isSubmitted = false;

    this.IndustryTrainingList = [];

    this.searchRequest.SemesterID = 0;
    this.searchRequest.SemesterID = 0
    if (this.sSOLoginDataModel.RoleID != EnumRole.Principal && this.sSOLoginDataModel.RoleID != EnumRole.PrincipalNon) {
      
    }
    

  }


}
