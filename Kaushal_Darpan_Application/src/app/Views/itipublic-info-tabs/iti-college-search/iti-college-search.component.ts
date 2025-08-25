import { Component } from '@angular/core';
import { StudentMeritInfoModel } from '../../../Models/StudentMeritInfoDataModel';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraRequestDetails } from '../../../Models/PaymentDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StudentDetailsModel } from '../../../Models/StudentDetailsModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { enumExamStudentStatus, EnumRole, EnumStatus, EnumVerificationAction } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from '../../../Services/Student/student.service';
import { DocumentDetailsService } from '../../../Common/document-details';
import { EmitraPaymentService } from '../../../Services/EmitraPayment/emitra-payment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { UploadFileModel } from '../../../Models/UploadFileModel';
import { DeleteDocumentDetailsModel } from '../../../Models/DeleteDocumentDetailsModel';
import { ITICollegeSearchModel } from '../../../Models/ITI/ITIStudentMeritInfoDataModel';
import { ITIsService } from '../../../Services/ITIs/itis.service';
import { ITI_PlanningCollegesModel, ItiAffiliationList } from '../../../Models/ItiPlanningDataModel';




@Component({
  selector: 'app-iti-college-search',
  templateUrl: './iti-college-search.component.html',
  styleUrl: './iti-college-search.component.css',
  standalone: false
})
export class ItiCollegeSearchComponent {
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: any = false;
  public StreamMasterList: [] = [];
  public SemesterList: [] = [];
  public collegeMerit8: [] = [];
  public collegeMerit10: [] = [];
  public collegeMerit12: [] = [];
  public StreamID: number = 0;
  public SemesterID: number = 0;
  public ApplicationNo: string = '';
  public request = new ITICollegeSearchModel();
  public requestPlaning = new ITI_PlanningCollegesModel();
  public addmore = new ItiAffiliationList();
  public DistrictMasterList1: any = [];
  public DistrictMasterList3: any = [];
  public VillageList: any = [];
  public InstituteCategoryList: any = [];
  public DivisionMasterList: any = [];
  public SubDivisionMasterList: any = []
  public DistrictMasterList: any = []
  public TehsilMasterList: any = []
  public AssemblyMasterList: any = []
  public CityMasterDDLList: any = []
  public PanchayatSamitiList: any = []
  public ParliamentMasterList: any = []
  public ResidenceList: any = []
  public filteredTehsils: any[] = [];
  public VillageMasterList: any[] = [];
  public GramPanchayatList: any[] = [];
  public ITICollegeSearchList: any[] = [];
  public categoryList: any[] = [];
  public StateMasterList: any[] = [];
  public requestData: any;
  public Table_SearchText: string = "";
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
  public searchRequest = new StudentSearchModel();
  public isShowGrid: boolean = false;
  emitraRequest = new EmitraRequestDetails();
  public OTP: string = '';
  public MobileNo: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public StudenetTranList: [] = [];
  studentDetailsModel = new StudentDetailsModel();
  //Modal Boostrap.
  public searchItiCollegeForm!: FormGroup
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public totalAmount: number = 0;
  public enumExamStudentStatus = enumExamStudentStatus;
  public SemesterName: String = ''
  public StudentSubjectList: any[] = [];
  public isSubmitted: boolean = false
  public isShowSelected: boolean = false;
  public IsdocumentShow: boolean = false
  public ValidationMessage: string = '';
  public _enumrole = EnumRole;
  public Type: number = 0;
  public isVisibleSection: boolean = false;
  public isVisibleList: boolean = false;
  public DISCOM: any = [];
  public oldDistrictID: number = 0;
  public oldeditDistrictID: number = 0;

  constructor(private loaderService: LoaderService, private commonservice: CommonFunctionService,
    private studentService: StudentService, private modalService: NgbModal, private toastrService: ToastrService, private documentDetailsService: DocumentDetailsService,
    private emitraPaymentService: EmitraPaymentService,
    private sweetAlert2: SweetAlert2, private formBuilder: FormBuilder,
    private appsettingConfig: AppsettingService,
    private commonMasterService: CommonFunctionService,
    private ApplicationService: ITIsService

  ) { }

  async ngOnInit() {
    
    this.ValidationMessage = "";
    this.searchItiCollegeForm = this.formBuilder.group({
      //txtApplicationNo: ['', Validators.required],
      //DOB: ['', Validators.required],
     /* DivisionId:['']*/

    })

    

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

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

  get _searchItiCollegeForm() { return this.searchItiCollegeForm.controls; }



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
    debugger
    try {
      this.request.DistrictId = 0;
      this.loaderService.requestStarted();
      if (this.request.DivisionId == 0) {
        await this.commonMasterService.GetDistrictMaster()
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictMasterList = data['Data'];
          }, error => console.error(error));
      }
      else {
        await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionId)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.DistrictMasterList = data['Data'];
          }, error => console.error(error));

      }
     
      
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
      this.oldDistrictID = this.request.DistrictId;
      this.loaderService.requestStarted();
      await this.commonMasterService.TehsilMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TehsilMasterList = data['Data'];

        }, error => console.error(error));
      await this.commonMasterService.SubDivisionMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubDivisionMasterList = data['Data'];
          console.log(this.SubDivisionMasterList, "SubDivisionMasterList")
        }, error => console.error(error));

      await this.commonMasterService.AssemblyMaster_DistrictIDWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssemblyMasterList = data['Data'];
          console.log(this.AssemblyMasterList, "AssemblyMasterList")
        }, error => console.error(error));

      await this.commonMasterService.CityMasterDistrictWise(this.request.DistrictId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CityMasterDDLList = data['Data'];
          console.log(this.CityMasterDDLList, "CityMasterDDLList")
        }, error => console.error(error));

      await this.commonMasterService.PanchayatSamiti(this.request.DistrictId)
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
    const selectedDistrictID = this.request.DistrictId;
    this.filteredTehsils = this.TehsilMasterList.filter((tehsil: any) => tehsil.ID == selectedDistrictID);
  }
  BackSide() {

    this.isVisibleSection = false;
    this.isVisibleList = true;

  }

  onResetClick() {
    this.request.DistrictId = 0;
    this.request.DivisionId = 0;
    this.request.SearchText = "";
    this.isVisibleSection = false;
    this.isVisibleList = false;
    this.ValidationMessage = "";
    this.ddlDistrict();
 
  }

  async GetById(ID: number) {
    try {
      
      this.isVisibleSection = true;
      this.isVisibleList = false;
      this.requestPlaning.ItiAffiliationList = []
      this.requestPlaning.ItiMembersModel = []
      this.loaderService.requestStarted();
      const data: any = await this.ApplicationService.Get_ITIsPlanningData_ByID(ID);
      const parsedData = JSON.parse(JSON.stringify(data));
      


      if (parsedData['Data'] != null) {
        this.requestPlaning = parsedData['Data'];
        await this.ddlState_Change2()
        this.requestPlaning.InstituteDivisionID = parsedData['Data']["InstituteDivisionID"]
        this.oldeditDistrictID = this.oldDistrictID;
        await this.ddlDivision_Change()
        this.requestPlaning.PropDistrictID = parsedData['Data']["PropDistrictID"]       
        await this.ddlDistrict_Change()

        this.requestPlaning.InstituteSubDivisionID = parsedData['Data']["InstituteSubDivisionID"]
        this.requestPlaning.PropTehsilID = parsedData['Data']["PropTehsilID"]
        this.requestPlaning.CityID = parsedData['Data']["CityID"]
        await this.ddlState_Change()
        if (this.requestPlaning.PropUrbanRural == 76) {
          await this.GetGramPanchayatSamiti();
        }
        this.request.DistrictId = this.oldeditDistrictID;
       
      }
      //// Assign default values for null or undefined fields
      Object.keys(this.requestPlaning).forEach((key) => {
        const value = this.requestPlaning[key as keyof ITI_PlanningCollegesModel];

        if (value === null || value === undefined) {
          // Default to '' if string, 0 if number
          if (typeof this.requestPlaning[key as keyof ITI_PlanningCollegesModel] === 'number') {
            (this.request as any)[key] = 0;
          } else {
            (this.request as any)[key] = '';
          }
        }
      })
      if (this.requestPlaning.ItiAffiliationList == null || this.requestPlaning.ItiAffiliationList == undefined) {
        this.requestPlaning.ItiAffiliationList = []
      }

      if (this.requestPlaning.ItiMembersModel == null || this.requestPlaning.ItiMembersModel == undefined) {
        this.requestPlaning.ItiMembersModel = [];
      }
     
      if (this.requestPlaning.PropUrbanRural == 76) {


        
        this.villageMaster()
      }

      
      const dateFields: (keyof ITI_PlanningCollegesModel)[] = [
        
        'AgreementLeaseDate', 'LastElectionDate', 'ValidUpToLeaseDate',
        'RegDate', 'LastElectionValidUpTo'
      ];

      dateFields.forEach((field) => {
        
        const value = this.requestPlaning[field];
        if (value) {
          const rawDate = new Date(value as string);
          const year = rawDate.getFullYear();
          const month = String(rawDate.getMonth() + 1).padStart(2, '0');
          const day = String(rawDate.getDate()).padStart(2, '0');
          (this.request as any)[field] = `${year}-${month}-${day}`;
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

  async villageMaster() {
    try {
      if (this.requestPlaning.PropUrbanRural == 75) {
        this.requestPlaning.VillageID = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.villageMaster(this.requestPlaning.GramPanchayatSamiti)
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
      await this.commonMasterService.DistrictMaster_StateIDWise(this.requestPlaning.InstituteStateID)
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
      //await this.commonMasterService.DistrictMaster_StateIDWise(this.requestPlaning.RegOfficeStateID)
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
      if (this.requestPlaning.PropUrbanRural == 75) {
        this.requestPlaning.GramPanchayatSamiti = 0
        return
      }

      this.loaderService.requestStarted();
      await this.commonMasterService.GramPanchayat(this.requestPlaning.PropTehsilID)
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
      this.request.SearchText == "" &&
      this.request.DivisionId == 0 &&
      this.request.DistrictId == 0
    ) {
      
      this.ValidationMessage = "Please enter Search Text or select Division or District.";
      this.ITICollegeSearchList = [];
      this.paginatedInTableData = [];
      return;
      
    }
    this.ValidationMessage = "";
    await this.GetList();
    this.isVisibleSection = false;
    this.isVisibleList = true;
  }




  async ResetControl() {
    this.SemesterID = 0;
    this.StreamID = 0;
    this.ApplicationNo = '';
    this.isShowGrid = false;
    this.request = new ITICollegeSearchModel();
    this.studentDetailsModel = new StudentDetailsModel();
  }

  

 
  

  





  async GetList() {
    try {
      
      this.loaderService.requestStarted();
      await this.ApplicationService.ItiSearchCollege(this.request)
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

  async GetAllDataActionWise() {
    this.collegeMerit8 = [];
    this.collegeMerit10 = [];
    this.collegeMerit12 = [];
    this.isSubmitted = true
    if (this.searchItiCollegeForm.invalid) {
      return
    }

    this.isShowGrid = true;
    this.searchRequest.action = "_getstudentmeritdata";
    this.searchRequest.DepartmentID = 2;
    this.request = new ITICollegeSearchModel()

    try {
      this.loaderService.requestStarted();
      await this.studentService.GetITIStudentMeritinfo(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {

          

            this.request = data['Data'].Table;
            this.requestData = data['Data'].Table[0];

            this.collegeMerit8 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 8);
            this.collegeMerit10 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 10);
            this.collegeMerit12 = data['Data'].Table1.filter((x: any) => x.Tradelevel === 12);




            this.isShowGrid = this.requestData.ApplicationID > 0;
            
           

            if (this.requestData) {
              this.isShowSelected = true;
            }
          } else {
            this.isShowGrid = false;
            this.toastrService.error("Data not found");
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

  async OnShow(Key: number) {
    if (Key == 1) {
      this.IsdocumentShow = true
    } else {
      this.IsdocumentShow = false
    }
  }

  async UploadDocument(event: any, item: any) {
    try {
      //upload model
      let uploadModel = new UploadFileModel();
      uploadModel.FileExtention = item.FileExtention ?? "";
      uploadModel.MinFileSize = item.MinFileSize ?? "";
      uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      uploadModel.FolderName = item.FolderName ?? "";
      //call
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastrService.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastrService.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }
  async DeleteDocument(item: any) {
    try {
      // delete from server folder
      let deleteModel = new DeleteDocumentDetailsModel()
      deleteModel.FolderName = item.FolderName ?? "";
      deleteModel.FileName = item.FileName;
      //call
      await this.documentDetailsService.DeleteDocument(deleteModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (data.State != EnumStatus.Error) {
            //add/update document in js list
            //const index = this.request.RecheckDocumentModel.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
            //if (index !== -1) {
            //  this.request.RecheckDocumentModel[index].FileName = '';
            //  this.request.RecheckDocumentModel[index].Dis_FileName = '';
            //}
          /*  console.log(this.request.RecheckDocumentModel)*/
          }
          if (this.State == EnumStatus.Error) {
            this.toastrService.error(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async OnImageUpload(Key: number, dOC: any) {

    if (Key == 1) {
      dOC.ShowRemark = true;
      dOC.Isselect = true
    } else {
      dOC.ShowRemark = false;
      dOC.Remark = '';
      dOC.Isselect = false

    }

  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }

  async DocumentSave() {
  

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


}
