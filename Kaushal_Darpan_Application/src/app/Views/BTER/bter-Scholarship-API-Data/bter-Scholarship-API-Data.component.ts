import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Common/common';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { CollegeWiseScholarshipService } from '../../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { ScholarshipApiDataModel } from '../../../Models/CollegeWiseScholarshipModel';

@Component({
  selector: 'app-bter-Scholarship-API-Data',
  standalone: false,
  templateUrl: './bter-Scholarship-API-Data.component.html',
  styleUrl: './bter-Scholarship-API-Data.component.css'
})
export class bterScholarshipAPIDataComponent {



  public State: number = 0;
  public Message: any = [];
  showDownloadOptions = false;
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Status: number = 0
  public ScholarshipAPIDataList: any = [];
  public scholarshipRequestList: ScholarshipApiDataModel[] = [];
  public UserID: number = 0;
  searchText: string = '';
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = '';
  public SearchTimeTableList: any = []
  ScholarshipAPIRequest = new ScholarshipApiDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public tablerequest: any = [];

  constructor(
    private streamService: StreamMasterService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private centerAllocationService: ITICenterAllocationService,
    private apiService: ItiTradeService,
    private CollegeWiseScholarship: CollegeWiseScholarshipService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {




    await this.GetPracticalExamMarksList();

  }
  //async GetPracticalExamMarksList() {

  //  this.ScholarshipAPIRequest.CollegeType = 'ITI'
  //  this.ScholarshipAPIRequest.RequestId = '60787706086'
  //  this.ScholarshipAPIRequest.RequestType = 'Janaadhaar_Aadhaar'

  //  try {
  //    this.loaderService.requestStarted();
  //    await this.CollegeWiseScholarship.GetScholarship1(this.ScholarshipAPIRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.scholarshipRequestList = data['Data'];
  //        console.log("Paper Upload Reports List ===>", this.scholarshipRequestList)
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

  async GetPracticalExamMarksList() {
    debugger
    this.ScholarshipAPIRequest.CollegeType = 'ITI';
    //this.ScholarshipAPIRequest.RequestId = '60787706086';
    this.ScholarshipAPIRequest.RequestId = this.ScholarshipAPIRequest.RequestId;
    this.ScholarshipAPIRequest.RequestType = 'Janaadhaar_Aadhaar';

    try {
      this.loaderService.requestStarted();

      await this.CollegeWiseScholarship.GetScholarship1(this.ScholarshipAPIRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data && Array.isArray(data.Data.data)) {
            this.scholarshipRequestList = data.Data.data;
          } else {
            this.scholarshipRequestList = [];
          }
          console.log('API Response ===>', data);

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
