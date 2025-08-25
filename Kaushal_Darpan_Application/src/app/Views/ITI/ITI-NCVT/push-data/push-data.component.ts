import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { ITITradeDataModels } from '../../../../Models/ITITradeDataModels';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';

import { ITISeatIntakesModel, ITIsDataModels, ITIsSearchModel } from '../../../../Models/ITIsDataModels';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ITIsService } from '../../../../Services/ITIs/itis.service';
import { SeatIntakeDataModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITI_NCVTService } from '../../../../Services/ITI-NVCT/iti-nvct.service';
@Component({
    selector: 'app-push-data',
  templateUrl: './add-push-data.component.html',
  styleUrls: ['./add-push-data.component.css'],
    standalone: false
})
export class PushDataComponent implements OnInit{
  groupForm!: FormGroup;
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;
  public isLoading: boolean = false;
  public InstituteCategoryList: any = [];
  public ItiTradeList: any = [];
  public ITITradeSchemeList: any = [];
  public ManagmentTypeList: any = [];
  public ITIRemarkList: any = [];
  public rows: ITISeatIntakesModel[] = [];
  request = new ITIsDataModels();
  SeatIntakeForm!: FormGroup
  sSOLoginDataModel = new SSOLoginDataModel();
  SearchRequest = new ITIsSearchModel();
  public Id: number | null = null;
  public formdata = new ITISeatIntakesModel()
  public tradeSearchRequest = new ItiTradeSearchModel()

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private addITIsService: ITIsService,
    private router: Router,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private routers: ActivatedRoute,
    private ncvtService: ITI_NCVTService
  ) { }
  
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.groupForm = this.fb.group({
      ddlInstituteCategoryId: ['', [DropdownValidators]],
      //txtSSOID: ['', Validators.required],
      txtName: ['', Validators.required],
      txtEmailAddress: ['', [Validators.email]],
      txtFaxNumber: [''],
      ddlManagementType: ['', [DropdownValidators]],
      txtCollegeCode: ['', Validators.required],
      txtDGETCode: ['', Validators.required],
      txtMobileNumber: ['', [ Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      txtPincode: [''],
      check8th: [false],
      check10th: [false],
      check12th: [false]
    });

    this.SeatIntakeForm = this.fb.group({
      ddlTradeName: ['', [DropdownValidators]],
      ddlTradeScheme: ['', [DropdownValidators]],
      ddlRemark: ['', [DropdownValidators]],

      txtshift: ['', Validators.required],
      txtUnit: ['', Validators.required],
      txtSession: ['', Validators.required],
    
    });
    
   
    this.GetInstituteCategoryList();
    this.GetManagmentType();
    this.GetTradeListDDL();
    this.GetTradeSchemeDDL();
    this.GetRemark();
    this.Id = Number(this.routers.snapshot.queryParamMap.get('id')?.toString());
   
    if (this.Id) {
      await this.Get_ITIsData_ByID(this.Id)
      this.request.Id=this.Id

    }
    
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID
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
    debugger;
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return;
    }


    console.log(this.request.SeatIntakes, "ssssss")
    this.request.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.request.IPAddress = '::01';
    console.log()
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      await this.addITIsService.SaveData(this.request).then((data: any) => {
        if (data.State === EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.router.navigate(['/ITICollegeMaster'])
          setTimeout(() => {
            this.groupForm.reset();
            this.rows = [];            
          }, 2000);  
        } else {
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
    this.request.SeatIntakes.push({
      TradeName: this.formdata.TradeName,
      TradeID: this.formdata.TradeID,
      TradeScheme: this.formdata.TradeScheme,
      TradeSchemeID: this.formdata.TradeSchemeID,
      Remark: this.formdata.Remark,
      RemarkID: this.formdata.RemarkID,
      Shift: this.formdata.Shift,
      Unit: this.formdata.Unit,
      LastSession: this.formdata.LastSession,
      ModifyBy: this.sSOLoginDataModel.UserID,
      Id:0
    });


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
      Id:0
    };
  }


  async deleteRow(item: ITISeatIntakesModel) {
    try {
      this.loaderService.requestStarted();
      if (confirm("Are you sure you want to delete this ?")) {
        const index: number = this.request.SeatIntakes.indexOf(item);
        if (index != -1) {
          this.request.SeatIntakes.splice(index, 1)
        }
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
    window.location.href = '/ITICollegeMaster';
  }

  async Get_ITIsData_ByID(Id: number) {
    try {

      this.loaderService.requestStarted();

      await this.addITIsService.Get_ITIsData_ByID(Id)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");
          this.request = data['Data']
          this.request.SeatIntakes = data['Data']['SeatIntakes']
          if (this.request.SeatIntakes == null) {
            this.request.SeatIntakes = []
            this.formdata = new ITISeatIntakesModel()
          }

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
  toggleCheck10(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.request.Has10th = 1;  
    } else {
      this.request.Has10th = 0;  
    }
    
  }
  toggleCheck(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.request.Has8th = 1;
    } else {
      this.request.Has8th = 0;
    }

  }
  toggleCheck12(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.request.Has12th = 1;
    } else {
      this.request.Has12th = 0;
    }

  }


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new ITIsDataModels()
  }

  get _SeatIntakeForm() { return this.SeatIntakeForm.controls; }





}
