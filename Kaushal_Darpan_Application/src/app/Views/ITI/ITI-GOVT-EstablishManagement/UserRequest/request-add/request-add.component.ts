import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus } from '../../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../../Common/SweetAlert2';
import { ITITradeDataModels } from '../../../../../Models/ITITradeDataModels';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { ItiTradeService } from '../../../../../Services/iti-trade/iti-trade.service';

import { ITISeatIntakesModel, ITIsDataModels, ITIsSearchModel } from '../../../../../Models/ITIsDataModels';
import { ItiSeatIntakeService } from '../../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITIsService } from '../../../../../Services/ITIs/itis.service';
import { ITICollegeTradeSearchModel, SeatIntakeDataModel } from '../../../../../Models/ITI/SeatIntakeDataModel';
import { ItiTradeSearchModel } from '../../../../../Models/CommonMasterDataModel';
import { ITI_EM_UnlockProfileDataModel, RequestSearchModel } from '../../../../../Models/ITI/UserRequestModel';
import { UserRequestService } from '../../../../../Services/UserRequest/user-request.service';
import { AppsettingService } from '../../../../../Common/appsetting.service';
@Component({
  selector: 'app-request-add',
  templateUrl: './request-add.component.html',
  styleUrls: ['./request-add.component.css'],
  standalone: false
})
export class RequestUserAddComponent implements OnInit {
  groupForm!: FormGroup;
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public InstituteCategoryList: any = [];
  public ListITICollegeByManagement: any = [];
  public ItiTradeList: any = [];
  public ITITradeSchemeList: any = [];
  public ManagmentTypeList: any = [];
  public ITIRemarkList: any = [];
  public rows: ITISeatIntakesModel[] = [];
  request = new RequestSearchModel();
  SeatIntakeForm!: FormGroup
  sSOLoginDataModel = new SSOLoginDataModel();
  SearchRequest = new ITIsSearchModel();
  public Id: number | null = null;
  public formdata = new ITISeatIntakesModel()
  public tradeSearchRequest = new ItiTradeSearchModel()

  public OfficeList: any = [];
  public LevelList: any = [];
  public PostList: any = [];
  public LevelID: number = 0
  public IsDisable: boolean = false
  public isSSOVisible: boolean = false;
  public StaffTypeList: any[] = [];
  public searchRequestITi = new ITICollegeTradeSearchModel();
  public getUserSerivecRequest=new ITI_EM_UnlockProfileDataModel();
  public GetStaffDetailsVRS: any[]=[];
  public searchRequest = new RequestSearchModel();
  public DistrictList: any = [];
  public DivisionMasterList: any[] = [];

  public OldDivisionID: number = 0
  public OldInstituteID: number = 0
  public OldNodalDistrictID: number = 0
  public OldOfficeID: number = 0
 
  public getstatuId:number=0;

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private addITIsService: ITIsService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private userRequestService: UserRequestService,
    private ITICollegeTradeService: ItiSeatIntakeService,
    public appsettingConfig: AppsettingService,

  ) { }

  async ngOnInit() {
    this.groupForm = this.fb.group({
      ddlRequestType: ['', [DropdownValidators]],
      /* ddlRoleID: ['', [DropdownValidators]],*/
      /* ddlStaffType: ['', [DropdownValidators]],*/
      ddlOffice: ['', [DropdownValidators]],
      ddlITICollegeTrade: [''],
      ddlLevelID: [{ value: '' }, [DropdownValidators]],
      ddlPost: ['', [DropdownValidators]],
      /* txtSSOID: ['', Validators.required],*/
      txtName: [''],
      txtMobile: [''],
      txtEmailID: [''],
      txtRequestRemarks: ['', Validators.required],
      txtOrderNo: ['', Validators.required],
      txtOrderDate: ['', Validators.required],
      /* txtJoiningDate: [''],*/
      txtRequestDate: ['', Validators.required],
      Upload: [''],
      ddlDistrictID: [''],
      divisionID: [''],
      ddlStaffType: ['', [DropdownValidators]],
      txtEmployeeName: [{ value: '', disabled: true }],
      txtEmployeeNumber: [{ value: '', disabled: true }],
      txtEmployeeDesignation:[{value:'',disabled:true}],

      /*chkIsHod: [false]*/
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.LevelID = 1;


    //
    //
    //
    //
    //
    //

    this.SeatIntakeForm = this.fb.group({
      ddlTradeName: ['', [DropdownValidators]],
      ddlTradeScheme: ['', [DropdownValidators]],
      ddlRemark: ['', [DropdownValidators]],

      txtshift: ['', Validators.required],
      txtUnit: ['', Validators.required],
      txtSession: ['', Validators.required],

    });

    await this.GetLevelList();
    //await this.getITICollege();
    //this.GetRoleMasterData();
    this.GetStaffTypeData();
    this.GetPostList();
    this.Id = Number(this.routers.snapshot.paramMap.get('id')?.toString());
    this.getstatuId=0;
    if (this.Id) {
      await this.Get_ITIsData_ByID(this.Id);
      this.getstatuId=this.request.RequestType;
      await this.FunctionRequestType();
    }








    this.request.CreatedBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID

    //this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
  }

  get _groupForm() { return this.groupForm.controls; }
  async GetLevelList() {
   
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelList = data['Data'];


          /*this.LevelID*/

          console.log(this.LevelList, "LevelList")

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

  async GetOfficeList() {
    this.request.OfficeID = 0;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.request.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList")
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
  async GetPostList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDesignationAndPostMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
          /*this.PostList = this.PostList.filter((itme: any) => itme.IsPostTypeID == 1)*/
          console.log(this.PostList, "PostList")
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

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStaffTypeDDL().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
        console.log("StaffTypeList", this.StaffTypeList);
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
      this.tradeSearchRequest.action = "_getAllData"
      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        console.log("ITITradeList", parsedData.Data);
        this.ItiTradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
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
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async getITICollege() {
    
    try {
      this.searchRequestITi.Action = "_ITICollegeByManagementType";
      this.searchRequestITi.FinancialYearID = 9;
      this.searchRequestITi.ManagementTypeId = 1;

      this.loaderService.requestStarted();
      await this.ITICollegeTradeService.getITICollegeByManagement(this.searchRequestITi)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ListITICollegeByManagement = data['Data'];
          this.ListITICollegeByManagement = this.ListITICollegeByManagement.filter((item: any) => item.DivisionId == this.request.DivisionID)
          console.log(this.ListITICollegeByManagement, "ListITICollegeByManagement")
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


  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType().then((data: any) => {
        this.ManagmentTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetRemark() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('Remark').then((data: any) => {
        this.ITIRemarkList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async GetTradeSchemeDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async SaveData() {
   debugger
    this.isSubmitted = true;
    // if (this.groupForm.invalid) {
    //   return;
    // }

    //this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    console.log()
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.UserId = this.sSOLoginDataModel.UserID;

    try {
      this.request.Action = this.request.ServiceRequestId > 0 ? "UpdateRequest" : "AddRequest";
     
      console.log( "request",this.request)
      await this.userRequestService.UserRequest(this.request).then((data: any) => {
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.router.navigate(['/UserRequestList'])
          setTimeout(() => {
            this.groupForm.reset();
            this.rows = [];
          }, 2000);
        }
        else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        }

        else {
          this.toastr.error(data.ErrorMessage);
        }
      });
    } catch (error) {
      console.error(error);
      this.toastr.error("An error occurred while saving the data.");
    } finally {
      this.loaderService.requestEnded();
      this.isLoading = false;
    }
  }



  async addRow() {
    // Check if the required fields are filled in
    //if (!this.formdata.TradeID || !this.formdata.TradeSchemeID || !this.formdata.RemarkID) {
    //  // Optionally, display a message or handle validation failure
    //  return;
    //}
    this.isSubmitted = true
    if (this.SeatIntakeForm.invalid) {
      return
    }

    // Get the selected values
    this.formdata.TradeName = this.ItiTradeList.filter((x: any) => x.Id == this.formdata.TradeID)[0]?.['TradeName'] || '';
    this.formdata.TradeScheme = this.ITITradeSchemeList.filter((x: any) => x.ID == this.formdata.TradeSchemeID)[0]?.['Name'] || '';
    this.formdata.Remark = this.ITIRemarkList.filter((x: any) => x.ID == this.formdata.RemarkID)[0]?.['Name'] || '';

    // Add the new row to the rows array



    // Reset formdata after adding the row
    this.resetFormData();
  }

  resetFormData() {
    this.formdata = {
      TradeID: 0,
      TradeSchemeID: 0,
      RemarkID: 0,
      TradeName: '',
      TradeScheme: '',
      Remark: '',
      Shift: '',
      Unit: '',
      LastSession: '',
      ModifyBy: 0,
      Id: 0
    };
  }


  async deleteRow(item: ITISeatIntakesModel) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {

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



  async goBack() {
    window.location.href = '/UserRequestList';
  }

  async Get_ITIsData_ByID(Id: number) {

    
    try {
      this.groupForm.get('ddlRequestType')?.disable();
      this.loaderService.requestStarted();

      this.searchRequest.PageNumber = 0
      this.searchRequest.PageSize = 0
      this.searchRequest.Action = "GetByID";
      this.searchRequest.ServiceRequestId = Id;
      this.loaderService.requestStarted();
      await this.userRequestService.UserRequest(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data.Data[0];

          this.OldDivisionID = data['Data'][0]['DivisionID'];
          this.OldInstituteID = data['Data'][0]['InstituteID']
          this.OldNodalDistrictID = data['Data'][0]['NodalDistrictID']
          this.OldOfficeID = data['Data'][0]['OfficeID']

          /*this.GetLevelList();*/
          this.request.LevelID = data['Data'][0]['LevelID']

          this.GetOfficeList();
          this.request.OfficeID = data['Data'][0]['OfficeID']
          this.OfficeITIWiseCollege();
         
          this.request.DivisionID = data['Data'][0]['DivisionID']
        
          this.ddlDivision_Change();
          this.getITICollege();
          this.ddl_DivisionID_Wise_District();
          this.request.InstituteID = data['Data'][0]['InstituteID']

          /*this.GetPostList();*/
          this.request.PostID = data['Data'][0]['PostID']

        
          this.request.StaffTypeID = data['Data'][0]['StaffTypeID']
         /* alert(this.request.StaffTypeID);*/
          this.request.RequestDate = this.dateSetter(data['Data'][0]['RequestDate'])
          this.request.OrderDate = this.dateSetter(data['Data'][0]['OrderDate'])
          this.request.JoiningDate = this.dateSetter(data['Data'][0]['JoiningDate'])
          this.request.RequestDate = this.dateSetter(data['Data'][0]['RequestDate'])


          this.request.DivisionID = this.OldDivisionID;
          this.request.InstituteID = this.OldInstituteID;
          this.request.NodalDistrictID = this.OldNodalDistrictID;
          this.request.OfficeID = this.OldOfficeID;
          



          //this.GetRoleMasterData();
         /* this.GetStaffTypeData();*/


        }, (error: any) => console.error(error))



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
  toggleCheck10(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;



  }
  toggleCheck(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;



  }
  toggleCheck12(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;


  }


  async ResetControl() {
    this.isSubmitted = false;
    //this.request = new ITIsDataModels()
  }

  get _SeatIntakeForm() { return this.SeatIntakeForm.controls; }


  async ddl_DivisionID_Wise_District() {
    
    try {
      this.loaderService.requestStarted();
      this.DistrictList = []
      await this.commonMasterService.DistrictMaster_DivisionIDWise(Number(this.request.DivisionID))
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data['Data'];
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


  async OfficeITIWiseCollege() {
    
    this.request.DivisionID = 0;
    this.request.InstituteID = 0;
    this.request.NodalDistrictID = 0;
    if (this.request.OfficeID == 11) {
      
      this.groupForm.controls['ddlDistrictID'].clearValidators();
      this.groupForm.controls['divisionID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlITICollegeTrade'].setValidators([DropdownValidators])
    }   

    else if (this.request.OfficeID == 15) {
      this.groupForm.controls['ddlITICollegeTrade'].clearValidators();
      this.groupForm.controls['divisionID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlDistrictID'].setValidators([DropdownValidators])
    }
    else {
      this.groupForm.controls['divisionID'].clearValidators();
      this.groupForm.controls['ddlITICollegeTrade'].clearValidators();
      this.groupForm.controls['ddlDistrictID'].clearValidators();
    }

    this.groupForm.controls['divisionID'].updateValueAndValidity();
    this.groupForm.controls['ddlITICollegeTrade'].updateValueAndValidity();
    this.groupForm.controls['ddlDistrictID'].updateValueAndValidity();
    await this.GetDivisionMasterList();
  }







  dateSetter(date: any) {
    const Dateformat = new Date(date);
    const year = Dateformat.getFullYear();
    const month = String(Dateformat.getMonth() + 1).padStart(2, '0');
    const day = String(Dateformat.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {

    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type === 'application/pdf' || this.file.type === 'image/jpeg' || this.file.type === 'image/png') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('error this file ?')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();
        await this.commonMasterService.UploadPublicInfoDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                
                this.request.AttachDocument_file = data['Data'][0]["Dis_FileName"];
                this.request.AttachDocument_fileName = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async DeleteImage(FileName: any, Type: string) {
    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.AttachDocument_file = '';
            this.request.AttachDocument_fileName = '';
          }
          //else if (Type == "Sign") {
          //  this.requestStudent.Dis_StudentSign = '';
          //  this.requestStudent.StudentSign = '';
          //}
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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

  async ddlDivision_Change() {
    
    this.request.InstituteID = 0;
    this.request.NodalDistrictID = 0;
    if (this.request.LevelID == 2 && this.request.OfficeID == 11) {
      await this.getITICollege();
      this.request.NodalDistrictID = 0;
      this.request.NodalStateID = 0;
      /*this.groupForm.controls['ddlITICollegeTrade'].setValidators([DropdownValidators]);*/
    } else if (this.request.LevelID == 2 && this.request.OfficeID == 15) {
      await this.ddl_DivisionID_Wise_District();
      this.request.InstituteID = 0;
      /*this.groupForm.controls['ddlDistrictID'].setValidators([DropdownValidators]);*/
    }


  }




    async FunctionRequestType(): Promise<void> {
    debugger
    await this.FunctionRequestTypeShowSomePropety();
  
    if (this.request.RequestType == 2) {
      this.getstatuId = Number(this.request.RequestType);
      try {
        this.isLoading = true;
        
        this.loaderService.requestStarted();

        this.getUserSerivecRequest.SSOID = this.sSOLoginDataModel.SSOID;

        debugger
        await this.userRequestService.GetITI_GetStaffDetailsVRS(this.getUserSerivecRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          let staffData = data?.Data?.[0]; // Assuming it's an array — update if it's an object
          if (staffData) {
            this.GetStaffDetailsVRS = data.Data;
            this.request.UserName = staffData.DisplayName;
            this.request.EmployeeNumber = staffData.EmployeeNumber;
            this.request.EmployeeDesignation = staffData.DesignationNameEnglish;
            this.request.OfficeID = staffData.OfficeID;
            this.request.ReqRoleID = staffData.RoleID;
            this.request.StaffTypeID = staffData.StaffTypeID;
            this.request.PostID = staffData.DesignationID;
          }
        }, error => console.error(error));

        // const data: any = await this.userRequestService.GetITI_GetStaffDetailsVRS(this.getUserSerivecRequest);

        // const staffData = data?.Data?.[0]; // Assuming it's an array — update if it's an object

        // if (staffData) {
        //   this.GetStaffDetailsVRS = data.Data;
        //   this.request.UserName = staffData.DisplayName;
        //   this.request.EmployeeNumber = staffData.EmployeeNumber;
        //   this.request.EmployeeDesignation = staffData.DesignationNameEnglish;
        //   this.request.OfficeID = staffData.OfficeID;
        //   this.request.ReqRoleID = staffData.RoleID;
        //   this.request.StaffTypeID = staffData.StaffTypeID;
        //   this.request.PostID = staffData.DesignationID;
        // }

      } catch (error) {
        console.error("Error fetching staff details:", error);
        this.toastr.error("An error occurred while getting the data.");
      } finally {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }
    } 
    else {
      this.getstatuId = Number(this.request.RequestType);
    }
   

    
  }


  
  async FunctionRequestTypeShowSomePropety() {
    if (this.request.RequestType == 2) {

      this.groupForm.controls['ddlOffice'].clearValidators();
      this.groupForm.controls['ddlLevelID'].clearValidators();
      this.groupForm.controls['ddlDistrictID'].clearValidators();
      this.groupForm.controls['ddlITICollegeTrade'].clearValidators();
      this.groupForm.controls['ddlStaffType'].clearValidators();
      this.groupForm.controls['ddlPost'].clearValidators();
      this.groupForm.controls['txtOrderNo'].clearValidators();
      this.groupForm.controls['txtOrderDate'].clearValidators();
      this.groupForm.controls['ddlLevelID'].clearValidators();
      this.groupForm.controls['txtOrderNo'].clearValidators();
      this.groupForm.controls['txtOrderDate'].clearValidators();
      
    } else {
      this.groupForm.controls['ddlOffice'].setValidators([DropdownValidators]);
      // this.groupForm.controls['DDlReqRoleID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlDistrictID'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlITICollegeTrade'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlStaffType'].setValidators([DropdownValidators]);
      this.groupForm.controls['ddlPost'].setValidators([DropdownValidators]);
    }
    this.groupForm.controls['ddlOffice'].updateValueAndValidity();
    // this.groupForm.controls['DDlReqRoleID'].updateValueAndValidity();
    this.groupForm.controls['ddlDistrictID'].updateValueAndValidity();
    this.groupForm.controls['ddlITICollegeTrade'].updateValueAndValidity();
    // this.groupForm.controls['ddlStaffType'].updateValueAndValidity();
    // this.groupForm.controls['ddlPost'].updateValueAndValidity();
  }
}
