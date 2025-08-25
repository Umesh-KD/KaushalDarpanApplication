import { Component, ViewChild } from '@angular/core';
import { ITISeatsDistributionsDataModels, ITISeatsDistributionsSearchModel } from '../../../Models/ITISeatsDistributions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ITISeatsDistributionsService } from '../../../Services/ITI-Seats-Distributions/iti-seats-distributions.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-iti-add-per-year-fees',
  templateUrl: './iti-add-per-year-fees.component.html',
  styleUrl: './iti-add-per-year-fees.component.css',
  standalone: false
})
export class ItiAddPerYearFeesComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  searchText: string = '';
  public id: number | null = null;
  public Collegeid: number | null = null;
  request: any=[]
  public searchRequest = new ITISeatsDistributionsSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public SeatsDistributionsList: any[] = [];
  public RemarkMasterList: any[] = [];
  public SeatsCount: number = 0;
  public IsImc: number = 0;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private SeatsDistributionsService: ITISeatsDistributionsService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));





    await this.GetRemarkMasterListDDL();

    this.id = Number(this.routers.snapshot.queryParamMap.get("TradeId") ?? 0);
    this.Collegeid = Number(this.routers.snapshot.queryParamMap.get("CollegeId") ?? 0);

    if (this.id>0) {
      await this.GetByID(this.id, this.Collegeid)
      this.isUpdate = true
    }

  }
/*  get _FormGroup() { return this.groupForm.controls; }*/
  //get totalSum(): number {
  //  return this.request.sc + this.request.sc_f +
  //    this.request.st + this.request.st_f +
  //    this.request.tsp + this.request.tsp_f +
  //    this.request.sahriya + this.request.sahriya_f +
  //    this.request.obc + this.request.obc_f +
  //    this.request.mbc + this.request.mbc_f +
  //    this.request.dny + this.request.dny_f +
  //    this.request.ews + this.request.ews_f +
  //    this.request.gen + this.request.gen_f;
  //}

  GenerateOTP_Save() {
    this.isSubmitted = true;
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.saveData()
    })
  }

  async saveData() {
    this.isSubmitted = true;

      try {

        await this.SeatsDistributionsService.SaveFeeITI(this.sSOLoginDataModel.UserID, this.request.Fee, this.request.Imcfee, this.request.CollegeTradeId)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            
            if (this.State == EnumStatus.Success) {
             

               window.location.href = '/iti-fees-peryear-list'
             

                this.toastr.success(this.Message)


            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
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


    

  async GetByID(id: number, Collegeid: number) {
    try {
      this.loaderService.requestStarted();
/*      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID*/
      await this.SeatsDistributionsService.GetByIDForFee(id, Collegeid, this.sSOLoginDataModel.FinancialYearID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'][0]
          
          console.log(this.request,'RequestDataaa')




          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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


  async GetRemarkMasterListDDL() {
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.GetCommonMasterData("ITIRemark").then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.RemarkMasterList = parsedData.Data;
        console.log(this.RemarkMasterList, "ITIRemarkList")
      }, error => console.error(error));


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
  async ResetControl() {
    this.isSubmitted = false;

    this.request.Fee = 0;
    this.request.Imcfee = 0;
    this.request.id = 0;
    //this.groupForm.reset();
    //this.groupForm.patchValue({

    //  code: '',

    //});
  }
}
