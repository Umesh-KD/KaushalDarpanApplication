import { Component } from '@angular/core';
import { BundelDataModel, CheckDateDispatchSearchModel, DispatchFormDataModel, DispatchSearchModel, CompanyDispatchMasterSearchModel } from '../../../Models/DispatchFormDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DispatchGroupDataModel, DispatchGroupSearchModel, InstituteGroupDetail } from '../../../Models/DispatchGroupDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { EnumCourseType, EnumStatus } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DispatchService } from '../../../Services/Dispatch/Dispatch.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
@Component({
  selector: 'app-dispatch-to-institute',
  standalone: false,
  templateUrl: './dispatch-to-institute.component.html',
  styleUrl: './dispatch-to-institute.component.css'
})
export class DispatchToInstituteComponent {
  public DispatchForm!: FormGroup
  public BundelForm!: FormGroup
  public SearchForm!: FormGroup
  public InstituteMasterDDLList:any[]=[]
/*  public MasterDDLList:any[]=[]*/
  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public Principledetail = new InstituteGroupDetail()
  public request = new DispatchGroupDataModel();
  public Searchrequest = new DispatchGroupSearchModel();

  public SearchrequestDDl = new DispatchSearchModel();
  public SearchCheck = new CheckDateDispatchSearchModel();
/*  public Searchrequest = new BundelDataModel();*/
  public searchRequest = new DispatchSearchModel();
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public marktypelist: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public settingsMultiselect: object = {};
  public DispatchMasterList: any = [];
  public ExaminersList: any[] = [];
  public CheckDataList: any[] = [];


  public DispatchID: number = 0;

  public _EnumCourseType = EnumCourseType

  public action: string = ''
  public SubjectMasterDDLList: any = []

  public errormessage: string = ''
  public collegeId: number = 0;
  public CheckDate: string = '';
  isUpdateMode: boolean = false;
  public CompanyDispatchList: any[] = [];
  public CompanyWiseDispatchList: any[] = [];
  public SearchCompanyDispatch = new CompanyDispatchMasterSearchModel();
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private dispatchService: DispatchService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService
  ) { }

  async ngOnInit() {

    this.DispatchForm = this.formBuilder.group({
      txtDispatchDate: ['', Validators.required],
      DDlCompanyName: ['', [DropdownValidators]],
      txtChallanNo: ['', Validators.required],
      txtSupplierName: ['', Validators.required],
      txtSupplierVehicleNo: ['', Validators.required],
      txtSupplierMobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      
     /* txtSupplierDate: ['', Validators.required],*/
      txtRecipientName: ['', Validators.required],
      txtRecipientPost: ['', Validators.required],
      txtRecipientMobileNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
    /*  txtRecipientDate: ['']*/
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));


    
    this.request.CompanyName = "0";
    await this.GetCompanyNameDDL();
  
    this.DispatchID = Number(this.activatedRoute.snapshot.queryParamMap.get('DispatchGroupID')?.toString());
    if (this.DispatchID > 0) {
      this.GetById()

    }

    this.collegeId = 0;

    this.getInstituteMasterList()
  }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }

  async GetCompanyNameDDL() {
    
    try {
     
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDDLCompanyName(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CompanyDispatchList = data['Data'];
          console.log(this.CompanyDispatchList)
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


  async CompanyWiseGetData(): Promise<void> {
    try {
      
      this.SearchCompanyDispatch.CompanyID = Number(this.request.CompanyName);

      this.loaderService.requestStarted();

      const response = await this.dispatchService.GetByIdCompanyDispatch(this.SearchCompanyDispatch.CompanyID);

      const data = JSON.parse(JSON.stringify(response));
      this.State = data?.State;
      this.Message = data?.Message;
      this.ErrorMessage = data?.ErrorMessage;

      const dispatchData = data?.Data;

      if (dispatchData) {
        this.CompanyWiseDispatchList = dispatchData; // if you need to keep it for reference
        this.request.SupplierName = dispatchData.SupplierName || '';
        this.request.SupplierVehicleNo = dispatchData.SupplierVehicleNo || '';
        this.request.SupplierMobileNo = dispatchData.SupplierMobileNo || '';
      }

      console.log('Company wise data', dispatchData);
    } catch (ex) {
      console.error('Error fetching company-wise data:', ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  onInput(event: any): void {
    const inputValue = event.target.value;

    // Replace any character that's not a letter, space, apostrophe, or hyphen
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');

    // Update the value with the filtered input
    event.target.value = filteredValue;

    // Update the model value if necessary
    this.request.SupplierName = filteredValue;
  }


  onInputRecipientName(event: any): void {
    const inputValue = event.target.value;

    // Replace any character that's not a letter, space, apostrophe, or hyphen
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');

    // Update the value with the filtered input
    event.target.value = filteredValue;

    // Update the model value if necessary
    this.request.RecipientName = filteredValue;
  }

  onInputRecipientPost(event: any): void {
    const inputValue = event.target.value;

    // Replace any character that's not a letter, space, apostrophe, or hyphen
    const filteredValue = inputValue.replace(/[^A-Za-z\s'-]/g, '');

    // Update the value with the filtered input
    event.target.value = filteredValue;

    // Update the model value if necessary
    this.request.RecipientPost = filteredValue;
  }


 


  async onInstituteChange() {
    this.request = new DispatchGroupDataModel()
    await this.getgroupData();
    await this.searchBundelDataByDate();
   /* await this.getCheckDateDispatch();*/
   
  }
  async searchBundelDataByDate() {
    try {
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.GroupDataModel = [];
      this.Principledetail = new InstituteGroupDetail();

      if (this.Searchrequest.InstituteID == 0) {
        this.request.GroupDataModel = [];
        this.request.RecipientDate = ''
        this.request.RecipientMobileNo = ''
        this.request.RecipientName = ''
        this.request.RecipientPost = ''
        this.Principledetail.GroupDataModel=[]
        return
      }
      this.loaderService.requestStarted();

      const data: any = await this.dispatchService.GetGroupDataAllData(this.Searchrequest);
      const result = JSON.parse(JSON.stringify(data));
      console.log(result)
/*      this.request.GroupDataModel = [];*/
/*      this.Principledetail.GroupDataModel = []*/

      this.Principledetail = result.Data
      this.request.RecipientName = this.Principledetail.PrincipleName
      this.request.RecipientMobileNo = this.Principledetail.MobileNo
      this.request.RecipientPost = this.Principledetail.Post
      this.request.GroupDataModel = this.Principledetail.GroupDataModel
      this.request.InstituteID = this.Searchrequest.InstituteID
      /*      console.log(this.request.GroupDataModel)*/
      console.log(this.Principledetail)
      //this.State = result.State;
      //this.Message = result.Message;
      //this.ErrorMessage = result.ErrorMessage;

  /*    console.log(this.request.BundelDataModel);*/
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async getgroupData() {
    

    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.InstituteID = this.Searchrequest.InstituteID;

    

    try {
      await this.dispatchService.GetAllGroupData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminersList = data.Data;
        console.log("this.ExaminersList", this.ExaminersList)

        this.ExaminersList = this.ExaminersList.filter((item: any) => item.InstituteID == this.Searchrequest.InstituteID)

        if (this.ExaminersList.length > 0) {
          if (this.ExaminersList[0]["InstituteID"] != 0) {
            this.collegeId = this.ExaminersList[0]["InstituteID"];
          }
         
        } else {
          this.collegeId = 0;
        }

       


       
      })
    } catch (error) {
      console.error(error);
    }
  }

  async getCheckDateDispatch() {
    
    this.SearchCheck.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.SearchCheck.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.SearchCheck.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.SearchCheck.ID = this.Searchrequest.InstituteID;
    this.SearchCheck.SPName = "USP_CheckDateDispatchToInstitute";


    try {
      await this.dispatchService.CheckDateDispatchSearch(this.SearchCheck).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CheckDataList = data.Data;
        
        if (this.CheckDataList.length > 0) {
          if (this.CheckDataList.length>0) {
            const rawDate = this.CheckDataList[0]["RecipientDate"];
            const dateObj = new Date(rawDate);

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            this.CheckDate = `${year}-${month}-${day}`;
          }
        } else {
          this.CheckDate ='';
        }
      })
    } catch (error) {
      console.error(error);
    }

  }


  async SaveData() {
    console.log("request", this.request)
    
    this.isSubmitted = true;

    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.DispatchForm.invalid) {
        return;
      }

      this.request.CreatedBy = this.sSOLoginDataModel.UserID

      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;


      if (this.request.GroupDataModel != null) {
        this.request.GroupDataModel.forEach(e => e.InstituteID = this.request.InstituteID)
      }

     

      if (this.request.GroupDataModel == null) {
        this.toastr.warning("No Groups are available")
        return
      }
      if (this.request.InstituteID == 0) {
        this.toastr.warning("Please Select Institute")
        return
      }
      await this.dispatchService.SaveDispatchGroup(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();

            this.isSubmitted = false;
            //this.GetAllData();
          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async CancelData() {

  }

  async ResetControl() {
    this.isSubmitted = false;
    /*   this.request = new DispatchFormDataModel();*/
    this.request.ChallanNo = ''
    this.request.CompanyName = ''
    this.request.DispatchDate = ''
    this.request.GroupDataModel = []
    this.request.InstituteID = 0
    this.Searchrequest.InstituteID = 0
    this.request.RecipientDate = ''
    this.request.RecipientName = ''
    this.request.RecipientPost = ''
    this.request.RecipientMobileNo = ''
    this.request.SupplierVehicleNo = ''
    this.request.SupplierName = ''
    this.request.SupplierMobileNo = ''
    this.request.SupplierDate = ''
    this.Principledetail = new InstituteGroupDetail();
    this.Searchrequest.InstituteID = 0
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

  //btnRowDelete_OnClick(row: BundelDataModel) {
  //  const index = this.request.BundelDataModel.findIndex(x => x.BundelNo === row.BundelNo);
  //  if (index !== -1) {
  //    this.request.BundelDataModel.splice(index, 1);
  //  }
  //}


  async GetById() {
    try {

      this.loaderService.requestStarted();

      await this.dispatchService.GetGroupdetailsId(this.DispatchID)

        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");

          this.request = data['Data'];
          this.Principledetail.GroupDataModel = this.request.GroupDataModel
          const dateFields: (keyof DispatchGroupDataModel)[] = [
            'DispatchDate', 'RecipientDate', 'SupplierDate'
          ];

          dateFields.forEach((field) => {
            const value = this.request[field];
            if (value) {
              const rawDate = new Date(value as string);
              const year = rawDate.getFullYear();
              const month = String(rawDate.getMonth() + 1).padStart(2, '0');
              const day = String(rawDate.getDate()).padStart(2, '0');
              (this.request as any)[field] = `${year}-${month}-${day}`;
            }
          });

          this.Searchrequest.InstituteID = this.request.InstituteID

          this.isUpdateMode = true;
          /*    this.request.PlacementCompanyID = data['Data']['PlacementCompanyID'];*/

          //this.HrMasterFormGroup.patchValue({
          //  PlacementCompanyID: this.request.PlacementCompanyID
          //});
          console.log(this.request, "request");


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


  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }



}
