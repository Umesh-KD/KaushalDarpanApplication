import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { EnumRole, GlobalConstants, EnumStatus } from '../../../../Common/GlobalConstants';
import { StudentExamDetails } from '../../../../Models/DashboardCardModel';
import { DownloadMarksheetSearchModel } from '../../../../Models/DownloadMarksheetDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { MenuService } from '../../../../Services/Menu/menu.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { ResultService } from '../../../../Services/Results/result.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ITICollegeSearchModel } from '../../../../Models/ITI/ITIStudentMeritInfoDataModel';
import { ITI_PlanningCollegesModel, ItiAffiliationList } from '../../../../Models/ItiPlanningDataModel';
import { ITIsService } from '../../../../Services/ITIs/itis.service';






@Component({
  selector: 'app-iti-college-search',
  standalone: false,
  templateUrl: './iti-college-search.component.html',
  styleUrl: './iti-college-search.component.css'
})
export class ItiCollegeSearchComponent implements OnInit {
    
  public AddStaffBasicDetailFromGroup!: FormGroup;
  public searchRequest = new ITICollegeSearchModel();
  sSOLoginDataModel: any;
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';

  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  public filteredStatusList: any[] = [];
  public Table_SearchText: string = "";
  public isSubmitted: boolean = false;
  public isVisibleList: boolean = false;
  public isVisibleSection: boolean = false;
  public isVisibleDownload: boolean = false;
  public DistrictMasterList: any = [];
  public DivisionMasterList: any = [];
  public StateMasterList: [] = [];
  public InstituteCategoryList: any = [];
  public TehsilMasterList: any = [];
  public SubDivisionMasterList: any = [];
  public AssemblyMasterList: any = [];
  public CityMasterDDLList: any = [];
  public PanchayatSamitiList: any = [];
  public ParliamentMasterList: any = [];
  public ResidenceList: any = [];
  public filteredTehsils: any[] = [];
  public categoryList: any[] = [];
  public GramPanchayatList: any[] = [];
  public ITICollegeSearchList: any[] = [];
  public DISCOM: any = [];
  public VillageList: any = [];
  public DistrictMasterList3: any = [];
  public request = new ITI_PlanningCollegesModel();
  public addmore = new ItiAffiliationList();
  public _enumrole = EnumRole;
  constructor(
    private activatedRoute: ActivatedRoute,
    private resultService: ResultService,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private reportService: ReportService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private menuService: MenuService,
    public ReportServices: ReportService,
    private formBuilder: FormBuilder,
    private ApplicationService: ITIsService
  ) {
    // Get user data from localStorage
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }

  async ngOnInit() {

    this.AddStaffBasicDetailFromGroup = this.formBuilder.group({
      //ddlExamYearID: ['', [DropdownValidators]],
     /* txtRollNo: ['', Validators.required] */   
      
 

    })


    //
    await this.GetDivisionMasterList();
    await this.GetParliamentMasterList();
    await this.GetCategory();
    await this.GetLateralCourse();

    /*await this.GetById(261);*/
    await this.GetInstituteCategoryList();
    this.GetcOmmonData();
    this.GetStateMaterData();
    await this.ddlDistrict();

    /*await this.GetPanchayatSamiti('')*/


  }


  async GetDivisionMasterList() {

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

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data['Data']);
          this.StateMasterList = data['Data'];
          console.log(this.StateMasterList);
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
  async GetInstituteCategoryList() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory().then((data: any) => {
        this.InstituteCategoryList = data.Data;
        this.InstituteCategoryList = this.InstituteCategoryList.filter((e: any) => e.ID != 20)
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async ddlDistrict() {
    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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


  async ddlDivision_Change() {
    try {
      this.searchRequest.DistrictId = 0;
      this.loaderService.requestStarted();
      //await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionId)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.DistrictMasterList = data['Data'];
      //  }, error => console.error(error));
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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

  async ddlDistrict_Change() {


    /* this.request.PanchayatsamityId = 0*/
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.searchRequest.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];

        }, error => console.error(error));
      await this.commonMasterService.SubDivisionMaster_DistrictIDWise(this.searchRequest.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubDivisionMasterList = data['Data'];
          console.log(this.SubDivisionMasterList, "SubDivisionMasterList")
        }, error => console.error(error));

      await this.commonMasterService.AssemblyMaster_DistrictIDWise(this.searchRequest.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssemblyMasterList = data['Data'];
          console.log(this.AssemblyMasterList, "AssemblyMasterList")
        }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(this.searchRequest.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
        }, error => console.error(error));

      await this.commonMasterService.PanchayatSamiti(this.searchRequest.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PanchayatSamitiList = data['Data'];
          console.log(this.ParliamentMasterList)
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


  onDistrictChange() {
    const selectedDistrictID = this.searchRequest.DistrictId;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);
  }


  async villageMaster() {
    try {
      if (this.request.PropUrbanRural == 75) {
        this.request.VillageID = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.villageMaster(this.request.GramPanchayatSamiti)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.VillageList = data['Data'];
          /*     console.log(this.ParliamentMasterList)*/
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

  async ddlState_Change2() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.request.InstituteStateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList3 = data['Data'];
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

  async GetcOmmonData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('DISCOM')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DISCOM = data['Data'];
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

  async ddlState_Change() {
    try {
      this.loaderService.requestStarted();
      //await this.commonMasterService.DistrictMaster_StateIDWise(this.request.RegOfficeStateID)
      //  .then((data: any) => {
      //    data = JSON.parse(JSON.stringify(data));
      //    this.DistrictMasterList = data['Data'];
      //  }, error => console.error(error));
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
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


  async GetLateralCourse() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Residence')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'ggg');
          this.ResidenceList = data['Data'];

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

  async GetCategory() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCollegeCategory()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.categoryList = data['Data'];
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

  async GetParliamentMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetParliamentMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ParliamentMasterList = data['Data'];
          console.log(this.ParliamentMasterList)
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

  async changeUrbanRural() {
    this.GetGramPanchayatSamiti()
  }

  async GetGramPanchayatSamiti() {
    try {
      if (this.request.PropUrbanRural == 75) {
        this.request.GramPanchayatSamiti = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.GramPanchayat(this.request.PropTehsilID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.GramPanchayatList = data['Data'];

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


  //async GetGramPanchayatSamiti() {
  //  try {
  //    /*this.request.GrampanchayatId = 0*/
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GramPanchayat(this.request.TehsilId)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));

  //        this.GramPanchayatList = data['Data'];
  //        console.log(this.ParliamentMasterList)
  //        // console.log(this.DivisionMasterList)
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


  //async GetPanchayatSamiti(id: any) {
  //  try {

  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.PanchayatSamiti(this.request.DistrictId)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));

  //        this.PanchayatSamitiList = data['Data'];

  //        if (id) {
  //          this.request.PanchayatsamityId = id;
  //        }
  //        console.log(this.ParliamentMasterList)
  //        // console.log(this.DivisionMasterList)
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


  //async villageMaster() {
  //  try {
  //    this.request.VillageId = 0
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.villageMaster(this.request.GrampanchayatId)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));

  //        this.VillageMasterList = data['Data'];
  //        console.log(this.ParliamentMasterList)
  //        // console.log(this.DivisionMasterList)
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

  async onSearchClick() {

    if (
      this.searchRequest.SearchText == "" &&
      this.searchRequest.DivisionId == 0 &&
      this.searchRequest.DistrictId == 0
    ) {
      this.toastr.error("Please enter Search Text or select Division or District.");     
      this.ITICollegeSearchList = [];
      this.paginatedInTableData = [];
      return;

    }
    
    await this.GetList();
    this.isVisibleSection = false;
    this.isVisibleList = true;
  }

  async GetById(ID: number) {
    try {

      this.isVisibleSection = true;
      this.isVisibleList = false;
      this.request.ItiAffiliationList = []
      this.request.ItiMembersModel = []
      this.loaderService.requestStarted();
      const data: any = await this.ApplicationService.Get_ITIsPlanningData_ByID(ID);
      const parsedData = JSON.parse(JSON.stringify(data));



      if (parsedData['Data'] != null) {
        this.request = parsedData['Data'];
        await this.ddlState_Change2()
        this.request.InstituteDivisionID = parsedData['Data']["InstituteDivisionID"]
        await this.ddlDivision_Change()
        this.request.PropDistrictID = parsedData['Data']["PropDistrictID"]
        await this.ddlDistrict_Change()
        this.request.InstituteSubDivisionID = parsedData['Data']["InstituteSubDivisionID"]
        this.request.PropTehsilID = parsedData['Data']["PropTehsilID"]
        this.request.CityID = parsedData['Data']["CityID"]
        await this.ddlState_Change()
        if (this.request.PropUrbanRural == 76) {
          await this.GetGramPanchayatSamiti();
        }

      }
      //// Assign default values for null or undefined fields
      Object.keys(this.request).forEach((key) => {
        const value = this.request[key as keyof ITI_PlanningCollegesModel];

        if (value === null || value === undefined) {
          // Default to '' if string, 0 if number
          if (typeof this.request[key as keyof ITI_PlanningCollegesModel] === 'number') {
            (this.searchRequest as any)[key] = 0;
          } else {
            (this.searchRequest as any)[key] = '';
          }
        }
      })
      if (this.request.ItiAffiliationList == null || this.request.ItiAffiliationList == undefined) {
        this.request.ItiAffiliationList = []
      }

      if (this.request.ItiMembersModel == null || this.request.ItiMembersModel == undefined) {
        this.request.ItiMembersModel = [];
      }

      if (this.request.PropUrbanRural == 76) {



        this.villageMaster()
      }

      
      const dateFields: (keyof ITI_PlanningCollegesModel)[] = [

        'AgreementLeaseDate', 'LastElectionDate', 'ValidUpToLeaseDate',
        'RegDate', 'LastElectionValidUpTo'
      ];

      dateFields.forEach((field) => {

        const value = this.request[field];
        if (value) {
          const rawDate = new Date(value as string);
          const year = rawDate.getFullYear();
          const month = String(rawDate.getMonth() + 1).padStart(2, '0');
          const day = String(rawDate.getDate()).padStart(2, '0');
          (this.searchRequest as any)[field] = `${year}-${month}-${day}`;
        }
      });
      /*      this.request.InstituteManagementId=5*/

      console.log(parsedData, "dsw");
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 2000);
    }
  }
  

  get _AddStaffBasicDetailFromGroup() { return this.AddStaffBasicDetailFromGroup.controls; }


  async GetList() {
    try {

      this.loaderService.requestStarted();
      await this.ApplicationService.ItiSearchCollege(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ITICollegeSearchList = data['Data'];
          this.loadInTable();        
          console.log(this.ITICollegeSearchList, "ITICollegeSearchList")
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


  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ITICollegeSearchList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }
  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ITICollegeSearchList.length;
  }


  onResetClick() {
    this.searchRequest.DistrictId = 0;
    this.searchRequest.DivisionId = 0;
    this.searchRequest.SearchText = "";
    this.isVisibleSection = false;
    this.isVisibleList = false;

  }

  BackSide() {

    this.isVisibleSection = false;
    this.isVisibleList = true;

  }

}









