import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { SeatIntakeDataModel } from '../../../../Models/ITI/SeatIntakeDataModel';
import { ItiSeatIntakeService } from '../../../../Services/ITI/ItiSeatIntake/iti-seat-intake.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-add-seat-intakes-master',
  templateUrl: './add-seat-intakes-master.component.html',
    styleUrls: ['./add-seat-intakes-master.component.css'],
    standalone: false
})
export class AddSeatIntakesMasterComponent implements OnInit {
  public SSOLoginDataModel = new SSOLoginDataModel()
  public SeatIntakeFormGroup!: FormGroup;
  public request = new SeatIntakeDataModel()
  public isSubmitted = false;
  public tradeSearchRequest = new ItiTradeSearchModel()
  public collegeSearchRequest = new ItiCollegesSearchModel()
  public ItiTradeListAll: any = [];
  public ItiCollegesListAll: any = [];
  public ITITradeSchemeList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public FinancialYearList: any = [];
  public SeatIntakeID: number | null = null;
  public isCollege: boolean = false;
  public isTrade: boolean = false;
  public isTradename: boolean = false;

  public currentDate = new Date();

  isEditMode: boolean = false;

  constructor(
    private commonFunctionService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private ItiSeatIntakeService: ItiSeatIntakeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  async ngOnInit() {
    this.SeatIntakeFormGroup = this.formBuilder.group(
      {
        ddlCollege: ['', [DropdownValidators]],
        ddlTradeLevel: ['',[DropdownValidators]],
        ddlTrade: ['', [DropdownValidators]],
        txtShift: ['', Validators.required],
        ddlLastSession: [''],
        weDate: ['', Validators.required],
        ddlRemark: ['', [DropdownValidators]],
        ddlTradeScheme: ['', [DropdownValidators]],
        txtUnitNo: ['', Validators.required],
        ddlSanctioned: ['', [DropdownValidators]],
        OrderDate: ['', Validators.required],
        OrderNo: ['', Validators.required],
      });

    //const intakeId = this.route.snapshot.queryParamMap.get('id');
    //if (intakeId) {
    //  this.isEditMode = true;
    //  this.loadDataForEdit(intakeId); // your edit call
    //}

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("SSOLoginDataModel",this.SSOLoginDataModel)
    await this.GetTradeAndColleges()
    await this.GetMasterDataForDDL()
    await this.GetCollegesListAll()

    this.SeatIntakeID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    if (this.SeatIntakeID) {
      await this.GetByID(this.SeatIntakeID)
    }
  }

  get _SeatIntakeFormGroup() { return this.SeatIntakeFormGroup.controls; }

  async GetMasterDataForDDL() {
    const MasterCode = "IITTradeScheme";
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
        console.log(this.ITITradeSchemeList, "ITITradeSchemeList")
      });

      await this.commonFunctionService.GetCommonMasterDDLByType('Sanctioned').then((data: any) => {
        this.SanctionedList = data.Data;
        console.log(this.SanctionedList, "SanctionedList")
      });

      await this.commonFunctionService.GetFinancialYear().then((data: any) => {
        this.FinancialYearList = data.Data;
        console.log(this.FinancialYearList, "FinancialYearList")
      });

      await this.commonFunctionService.GetCommonMasterData("ITIRemark").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITIRemarkList = parsedData.Data;
        console.log(this.ITIRemarkList, "ITIRemarkList")
      }, error => console.error(error));

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeAndColleges() {
    
    this.tradeSearchRequest.action = '_getAllData'
    this.tradeSearchRequest.TradeLevel = this.request.TradeLevel
    this.tradeSearchRequest.CollegeID = this.request.CollegeID
    try {
      this.loaderService.requestStarted();
      //await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.ItiTradeListAll = data.Data
      //  console.log(this.ItiTradeListAll, "ItiTradeListAll")
      //})

      await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiTradeListAll = data.Data
       
        console.log(this.ItiTradeListAll, "ItiTradeListAll")
      })


      //this.collegeSearchRequest.action = '_getAllData'
      //await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.ItiCollegesListAll = data.Data
      //  console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      //})
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetCollegesListAll() {
    
    try {
      this.collegeSearchRequest.action = '_getAllData'
      await this.commonFunctionService.ItiCollegesGetAllData(this.collegeSearchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ItiCollegesListAll = data.Data
        console.log(this.ItiCollegesListAll, "ItiCollegesListAll")
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeDetails(value: number = 0) {
    debugger;
    this.request.TradeSchemeID = 0
    const Item = this.ItiTradeListAll.find((x: any) => x.Id == this.request.TradeID)
    this.request.TradeSchemeID = Item?.TradeSchemeID??0
    //this.SeatIntakeFormGroup.controls['ddlTradeScheme'].disable();


  }


  async onSubmit()
  {
    debugger
    
    this.isSubmitted = true;
    if(this.SeatIntakeFormGroup.invalid) {
      this.toastr.error("invalid Form Data")
      return
    }
    try {
      this.loaderService.requestStarted();

      this.request.ModifyBy = this.SSOLoginDataModel.UserID;
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      this.request.AcademicYearID = this.SSOLoginDataModel.FinancialYearID;
      this.request.CreatedBy = this.SSOLoginDataModel.UserID;

      this.request.ActiveStatus = true;
      await this.ItiSeatIntakeService.SaveSeatIntakeDataMaster(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.onReset()
            this.router.navigate(['/SeatIntakesMasterList'])
          }
          else {
            this.toastr.error(data.ErrorMessage)
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
  
  async onReset() {
    this.isSubmitted = false;
    this.request = new SeatIntakeDataModel()
  }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.ItiSeatIntakeService.GetByID(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.request = data.Data;

        
        this.SeatIntakeFormGroup.get('ddlCollege')?.disable();
        this.SeatIntakeFormGroup.get('ddlTradeLevel')?.disable();
        this.SeatIntakeFormGroup.get('ddlTrade')?.disable();
        console.log(this.request, "request")
        this.OnTradeSchemechange()
        this.request.TradeSchemeID = data['Data']['TradeSchemeID']
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async OnTradeSchemechange() {

    if (this.request.RemarkID == 9 || this.request.RemarkID == 8 || this.request.RemarkID == 7) {
      this.ITITradeSchemeList =  this.ITITradeSchemeList.filter((x: any) => x.ID == 3 || x.ID == 4)
    } else {
      await this.commonFunctionService.GetCommonMasterData('IITTradeScheme').then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.ITITradeSchemeList = parsedData.Data;
        console.log(this.ITITradeSchemeList, "ITITradeSchemeList")
      });
    }
  }

}
