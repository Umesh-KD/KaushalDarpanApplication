import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITISeatsDistributionsDataModels, ITISeatsDistributionsSearchModel } from '../../../../Models/ITISeatsDistributions';
import { ITISeatsDistributionsService } from '../../../../Services/ITI-Seats-Distributions/iti-seats-distributions.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { DropdownValidators, DropdownValidatorsString } from '../../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-add-seats-distributions',
  templateUrl: './add-seats-distributions.component.html',
  styleUrls: ['./add-seats-distributions.component.css'],
  standalone: false
})
export class AddSeatsDistributionsComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public isUpdate: boolean = false;
  searchText: string = '';
  public id: number | null = null;
  request: ITISeatsDistributionsDataModels = new ITISeatsDistributionsDataModels();
  public searchRequest = new ITISeatsDistributionsSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  public SeatsDistributionsList: any[] = [];
  public RemarkMasterList: any[] = [];
  public SeatsCount: number = 0;
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


    this.groupForm = this.fb.group({
      //ddlremark: new FormControl('', Validators.required),
      // new FormControl('', Validators.required),
      ddlremark: ['0', [DropdownValidators]],
     txttotal_seats: ['', Validators.required],
      sc: [''],
      sc_f: [''],
      st: [''],
      st_f: [''],
      tsp: [''],
      tsp_f: [''],
      sahriya: [''],
      sahriya_f: [''],
      obc: [''],
      obc_f: [''],
      mbc: [''],
      mbc_f: [''],
      dny: [''],
      dny_f: [''],
      ews: [''],
      ews_f: [''],
      gen: [''],
      gen_f: [''],
      min: [''],
      min_f: [''],
      imcsc: [''],
      imcst: [''],
      imcobc: [''],
      imcgen: [''],
      ph: [''],
      ex_m: [''],
      w_d: ['']
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

    //alert(this.request.EndTermID);
   //alert(this.request.FinancialYearID);
    await this.GetRemarkMasterListDDL();
    
    this.id = Number(this.routers.snapshot.queryParamMap.get("id") ?? 0);

    if (this.id) {
      await this.GetByID(this.id)
      this.isUpdate = true
    }

  }
  get _FormGroup() { return this.groupForm.controls; }
  get totalSum(): number {
    return this.request.sc + this.request.sc_f +
      this.request.st + this.request.st_f +
      this.request.tsp + this.request.tsp_f +
      this.request.sahriya + this.request.sahriya_f +
      this.request.obc + this.request.obc_f +
      this.request.mbc + this.request.mbc_f +
      this.request.dny + this.request.dny_f +
      this.request.ews + this.request.ews_f +
      this.request.gen + this.request.gen_f;
  }

  async saveData() {
    this.isSubmitted = true;
    console.warn(this.groupForm)


    if (this.groupForm.invalid) {
      return;
    }
    if (this.request.total_seats == null || this.request.total_seats < 16) {
      this.ErrorMessage = "Total seats must be at least 16.";
      this.toastr.error(this.ErrorMessage);
      return;
    }
    if (this.totalSum == this.request.total_seats)
    {
      
      this.loaderService.requestStarted();
      this.isLoading = true;
      this.request.max_strength = this.request.total_seats;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;

      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;

      //alert(this.request.EndTermID);
      //alert(this.request.FinancialYearID);
      
    

      //Show Loading
     

      try {

        if (this.id) {
          this.request.id = this.id
        } else {
          //this.request.CreatedBy = this.sSOLoginDataModel.UserID;
        }
        await this.SeatsDistributionsService.SaveData(this.request)
          .then(async (data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            if (this.State == EnumStatus.Success) {
              //this.ResetControl();
              setTimeout(() => {
                this.toastr.success(this.Message)
                window.location.href = '/SeatsDistributionsList'
              }, 200);
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


    else {
      this.ErrorMessage = "Total Seats Not Equal to Distribution column";
      this.toastr.error(this.ErrorMessage)
    }
  }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.SeatsDistributionsService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.total_seats = data['Data']["total_seats"];
          this.request.remark = data['Data']["remark"];
          this.request.sc = data['Data']["sc"];
          this.request.sc_f = data['Data']["sc_f"];
          this.request.st = data['Data']["st"];
          this.request.st_f = data['Data']["st_f"];
          this.request.obc = data['Data']["obc"];
          this.request.obc_f = data['Data']["obc_f"];
          this.request.mbc = data['Data']["mbc"];
          this.request.mbc_f = data['Data']["mbc_f"];
          this.request.ews = data['Data']["ews"];
          this.request.ews_f = data['Data']["ews_f"];
          this.request.gen = data['Data']["gen"];
          this.request.gen_f = data['Data']["gen_f"];
          this.request.min = data['Data']["min"];
          this.request.min_f = data['Data']["min_f"];
          this.request.tsp = data['Data']["tsp"];
          this.request.tsp_f = data['Data']["tsp_f"];
          this.request.dny = data['Data']["dny"];
          this.request.dny_f = data['Data']["dny_f"];
          this.request.sahriya = data['Data']["sahriya"];
          this.request.sahriya_f = data['Data']["sahriya_f"];
          this.request.ph = data['Data']["ph"];
          this.request.ex_m = data['Data']["ex_m"];
          this.request.w_d = data['Data']["w_d"];
          this.request.imcsc = data['Data']["imcsc"];
          this.request.imcst = data['Data']["imcst"];
          this.request.imcobc = data['Data']["imcobc"];
          this.request.imcgen = data['Data']["imcgen"];
          this.request.imctotal = data['Data']["imctotal"];






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
    this.request = new ITISeatsDistributionsDataModels
    this.request.remark = 0;
    this.request.id = 0;
    this.groupForm.reset();
    this.groupForm.patchValue({

      code: '',

    });
  }
}
