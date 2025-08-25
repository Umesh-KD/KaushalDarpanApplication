import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CorrectMeritSearchModel } from '../../../../Models/BTER/CorrectMeritDataModel';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { EmitraRequestDetails } from '../../../../Models/PaymentDataModel';
import { AllotmentStatusService } from '../../../../Services/BTER/BTERAllotmentStatus/allotment-status.service';
import { EmitraPaymentService } from '../../../../Services/EmitraPayment/emitra-payment.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { CorrectMeritService } from '../../../../Services/BTER/CorrectMerit/correct-merit.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { EnumDepartment,EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';

@Component({
  selector: 'app-correct-merit',
  standalone: false,
  templateUrl: './correct-merit.component.html',
  styleUrl: './correct-merit.component.css'
})
export class CorrectMeritComponent {
  public State: number = 0;
  public Message: string = '';
  public UserID: number = 0
  public ErrorMessage: string = '';
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CorrectMeritSearchModel();
  //public MeritList: AllotmentStatusDataModel[] = [];
  public MeritList: any = [];
  public InstituteMasterList: any = [];
  public DistrictMasterList: any = [];
  public StreamMasterList: any = [];
  public CategoryBlist: any = [];
  public CategoryAlist: any = [];
  public CategoryDlist: any = [];
  public category_CList: any = [];
  public GenderList: any = ''
  public Table_SearchText: string = '';
  pageNo: any = 1;
  pageSize: any = 50;

  public isSubmitted: boolean = false
  closeResult: string | undefined;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private correctMeritService: CorrectMeritService,
    private commonMasterService: CommonFunctionService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonFunctionService: CommonFunctionService,
    private routers: Router,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.EndtermId = this.sSOLoginDataModel.EndTermID;
    this.GetDistrictMasterList();
    this.ddlDistrictChange();
    this.GetMaterData();
    this.GetMasterDDL();
    this.GetCorrectMeritList();

  }

  async ResetControl() {
    //this.searchRequest.ApplicationNo = '';
   // this.searchRequest.DOB = '';
    //this.AllotmentStatusList = [];
  }

  async Onrouting(ApplicationID: number) {

    this.routers.navigate(['/correct-merit-document'], {
      queryParams: { ApplicationID: this.encryptionService.encryptData(ApplicationID) }
    });
    // this.routers.navigate(['/EditMeritDocument'], {
    //   queryParams: { ApplicationID: ApplicationID }
    // });
  }


  async GetDistrictMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
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


  async ddlDistrictChange() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetInstituteMaster_ByDistrictWise(this.searchRequest.DistrictID, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          console.log(this.InstituteMasterList, 'Institute List')
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

  async GetMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.StreamMaster(this.searchRequest.EndtermId,0)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterList = data['Data'];
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

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      
      await this.commonMasterService.GetCommonMasterDDLByType('CategoryD')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryDlist = data['Data'];

        }, (error: any) => console.error(error)
        );

      await this.commonMasterService.CategoryBDDLData(EnumDepartment.BTER)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryBlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryAlist = data['Data'];

        }, (error: any) => console.error(error)
        );
      await this.commonMasterService.GetCommonMasterDDLByType('Category_C')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.category_CList = data['Data'];

        }, (error: any) => console.error(error)
        );
      
      await this.commonMasterService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
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


  async GetCorrectMeritList() {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest.DepartmentID = EnumDepartment.BTER;
      this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      await this.correctMeritService.CorrectMeritList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State = EnumStatus.Success) {
            this.MeritList = data.Data
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

}
