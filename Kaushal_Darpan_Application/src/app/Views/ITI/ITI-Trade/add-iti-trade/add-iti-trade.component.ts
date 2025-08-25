import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../../Models/ITITradeDataModels';
import { ItiTradeService } from '../../../../Services/iti-trade/iti-trade.service';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
@Component({
    selector: 'app-add-iti-trade',
    templateUrl: './add-iti-trade.component.html',
    styleUrls: ['./add-iti-trade.component.css'],
    standalone: false
})
export class AddItiTradeComponent implements OnInit {
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  public TradeId: number | null = null;
  public TradeTypesList: any = [];
  public TradeLevelList: any = [];
  request = new ITITradeDataModels()
  sSOLoginDataModel = new SSOLoginDataModel();
  public State: number = -1;
  constructor(
    private fb: FormBuilder,

    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ItiTradeService: ItiTradeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute ,
    private modalService: NgbModal,
    private Swal2: SweetAlert2){}

  async ngOnInit() {

    //this.sSOLoginDataModel.RoleID;


    this.groupForm = this.fb.group({

      txtTradeName: ['', Validators.required],
      txtMinPercentageInMath: ['', Validators.required],
      txtMinPercentageInScience: ['', Validators.required],
      txtDurationYear: ['', Validators.required],
   /*   txtNoOfSemesters: ['', Validators.required],*/
      txtNoOfSanctionedSeats: ['', Validators.required],
      txtMinAgeLimit: ['', Validators.required],

      txtTradeCode: ['', Validators.required],
      txtQualificationDetails: ['', Validators.required],


      ddlTradeTypeId: ['', [DropdownValidators]],

      ddlTradeLevelId: ['', [DropdownValidators]]
    });


   //this.groupForm.get('ddlTradeTypeId')?.disable();

    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //this.request.TradeTypeId = this.sSOLoginDataModel.Eng_NonEng;

    this.TradeId = Number(this.routers.snapshot.queryParamMap.get("TradeId") ?? 0);

    if (this.TradeId) {
      this.request.TradeId = this.TradeId
      await this.GetByID(this.TradeId)
      this.isUpdate = true
    }

    this.GetTradeTypesList();
    this.GetTradeLevelList();

  }



  async GetTradeTypesList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeTypesList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeTypesList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async GetTradeLevelList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeLevelList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeLevelList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async saveData() {
    debugger;
    this.isSubmitted = true;

    if (this.request.IsMathsSciencecompulsory==true) {
      this.groupForm.get('txtMinPercentageInMath')?.setValidators(Validators.required);
      this.groupForm.get('txtMinPercentageInScience')?.setValidators(Validators.required);
      this.groupForm.get('txtMinPercentageInMath')?.updateValueAndValidity();
      this.groupForm.get('txtMinPercentageInScience')?.updateValueAndValidity();
   

      if (this.request.MinPercentageInMath == "" || this.request.MinPercentageInMath == "0") {
        this.toastr.error("Min percentage in math is required");
        this.request.MinPercentageInMath = "";
      }

      if (this.request.MinPercentageInScience == "" || this.request.MinPercentageInScience == "0") {
        this.toastr.error("Min percentage in science is required");
        this.request.MinPercentageInScience = "";
      }
      


    } else {
      this.groupForm.get('txtMinPercentageInMath')?.clearValidators();
      this.groupForm.get('txtMinPercentageInScience')?.clearValidators();
      this.groupForm.get('txtMinPercentageInMath')?.updateValueAndValidity();
      this.groupForm.get('txtMinPercentageInScience')?.updateValueAndValidity();

      this.request.MinPercentageInMath = "0";
      this.request.MinPercentageInScience = "0";



    }

    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.request.TradeId === 0 || this.request.TradeId === null  ) {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = EnumDepartment.ITI;
      //this.request.RoleId = this.sSOLoginDataModel.RoleID;
      //this.request.RoleId = this.sSOLoginDataModel.RoleID;

      if (this.sSOLoginDataModel.RoleID == 16) {
        this.request.IsAdmission = true;
      } else {
        this.request.IsAdmission = false;
      }

      await this.ItiTradeService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success)
          {
            if (data['Data'] > 0) {

              this.ResetControl();
              setTimeout(() => {
                this.toastr.success(this.Message)
                this.router.navigate(['/ititradelist'])
              }, 200);
            } else {
              this.toastr.warning(this.Message);
            }
          }
          else if (this.State == EnumStatus.Warning)
          {
            this.toastr.warning(this.Message)
          }
          else
          {
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

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new ITITradeDataModels
    this.groupForm.reset();
    // Reset form values if necessary
    this.groupForm.patchValue({

      code: '',

    });
  }


  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.ItiTradeService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.TradeName = data['Data']["TradeName"];
          this.request.TradeLevelId = data['Data']["TradeLevelId"];
          this.request.TradeTypeId = data['Data']["TradeTypeId"];
          this.request.TradeCode = data['Data']["TradeCode"];
          this.request.DurationYear = data['Data']["DurationYear"];
          this.request.IsMathsSciencecompulsory = data['Data']["IsMathsScienceCompulsory"];
          this.request.MinAgeLimit = data['Data']["MinAgeLimit"];
          this.request.MinPercentageInScience = data['Data']["MinPercentageInScience"];
          this.request.MinPercentageInMath = data['Data']["MinPercentageInMath"];
          this.request.NoOfSanctionedSeats = data['Data']["NoOfSanctionedSeats"];
          this.request.NoOfSemesters = data['Data']["NoOfSemesters"];
          this.request.QualificationDetails = data['Data']["QualificationDetails"];
          this.request.OnlyForWomen = data['Data']["OnlyForWomen"];
          this.request.NoOfSemesters = data['Data']["NoOfSemesters"];
         

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



}
