import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import * as XLSX from 'xlsx';
import { PaymentServiceSearchModel } from '../../../Models/PaymentServiceDataModel';
import { PaymentServiceService } from '../../../Services/PaymentService/payment-service.service';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-payment-service',
  templateUrl: './payment-service.component.html',
  styleUrl: './payment-service.component.css',
  standalone: false
})
export class PaymentServiceComponent {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public DistrictList: any = [];
  public ItiTradeListAll: any = []
  public ItiCollegesListAll: any = []
  public ManagmentTypeList: any = [];
  public InstituteCategoryList: any = [];
  public ITITradeSchemeList: any = [];
  public ITIRemarkList: any = [];
  public SanctionedList: any = [];
  public SeatIntakeDataList: any = [];
  public Table_SearchText: string = '';
  public CollegesListAll: any = [];
  public BranchList: any = [];
  public SeatIntakeDataExcel: any = [];
  public searchRequest = new PaymentServiceSearchModel()
  public PaymentServicesList: any = []
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  BranchMapKeyEng: string = "COLLEGE BRANCH MAPPING";
  BranchMapKeyNonEng: string = "";
  BranchMapKeyLatEng: string = "";


  public DateConfigSetting: any = [];



  public CollegeBranchesList: any = []

  
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private commonMasterService: CommonFunctionService,
    private paymentService: PaymentServiceService,
  ) { }

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // if (this.SSOLoginDataModel.Eng_NonEng == EnumCourseType.Lateral) {
    //   this.request.StreamTypeId = EnumCourseType.Engineering
    // } else {
    //   this.request.StreamTypeId = this.SSOLoginDataModel.Eng_NonEng
    // }
    
    // this.GetDateConfigSetting();
    // this.GetColleges();
    // this.GetBranches()
    this.onSearch();
  }

  async onSearch() {
    try {
      this.loaderService.requestStarted();
      await this.paymentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.PaymentServicesList = data.Data
            console.log("this.PaymentServicesList", this.PaymentServicesList)
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
    // this.request = new BTERCollegeBranchModel()
    // this.onSearch(1)
  }

  async DeleteById(BranchID: number) {
    // this.Swal2.Confirmation("Do you want to delete?",
    //   async (result: any) => {
    //     if (result.isConfirmed) {
    //       try {
    //         this.loaderService.requestStarted();
    //         await this.SeatsDistributionsService.DeleteCollegeBrancheByID(BranchID, this.SSOLoginDataModel.UserID)
    //           .then(async (data: any) => {
    //             data = JSON.parse(JSON.stringify(data));
    //             console.log(data);
    //             if (data.State = EnumStatus.Success) {
    //               this.toastr.success(data.Message)
    //               await this.onSearch(1);
    //             } else {
    //               this.toastr.error(data.ErrorMessage)
    //             }
    //           }, (error: any) => console.error(error)
    //           );
    //       }
    //       catch (ex) {
    //         console.log(ex);
    //       }
    //       finally {
    //         setTimeout(() => {
    //           this.loaderService.requestEnded();
    //         }, 200);
    //       }
    //     }
    //   });
  }

  onToggleChange(BranchID: number, Status: boolean) {
    // this.Swal2.Confirmation("Are you sure you want to change status?", async (result: any) => {
    //   if (result.isConfirmed) {
    //     try {
    //       var ActiveStatus: number = 0
    //       Status = !Status
    //       if (Status == true) {
    //         ActiveStatus = 1
    //       } else {
    //         ActiveStatus = 0
    //       }
    //       this.loaderService.requestStarted();
    //       await this.SeatsDistributionsService.StatusChangeByID(BranchID, ActiveStatus, this.SSOLoginDataModel.UserID)
    //         .then(async (data: any) => {
    //           data = JSON.parse(JSON.stringify(data));

    //           if (data.State = EnumStatus.Success) {
    //             this.toastr.success(data.Message);
    //             this.onSearch(1);
    //           } else {
    //             this.toastr.error(data.ErrorMessage);
    //           }

    //         }, (error: any) => console.error(error));
    //     } catch (ex) {
    //       console.log(ex);
    //     } finally {
    //       setTimeout(() => {
    //         this.loaderService.requestEnded();
    //       }, 200);
    //     }
    //   }
    // });
  }
}
