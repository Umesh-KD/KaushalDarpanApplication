import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ReportService } from '../../../Services/Report/report.service';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import * as XLSX from 'xlsx';
import { ActivatedRoute } from '@angular/router';
import { CollegeWiseScholarshipService } from '../../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { AddCollegeWiseScholarshipModel, ScholarshipApiDataModel, ScholarshipApiSearchDataModel } from '../../../Models/CollegeWiseScholarshipModel';

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
  searchrequest = new ScholarshipApiSearchDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public tablerequest: any = [];
  public InstituteMasterList: any = [];


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

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.InstituteMaster();
    

  }
 
  async InstituteMaster() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
            this.InstituteMasterList = data['Data'];
          } else {
            this.InstituteMasterList = data['Data'];
          }

          console.log('Institute List ==>', this.InstituteMasterList)
        }, (error: any) => console.error(error));

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


  async GetPracticalExamMarksList() {

    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.ScholarshipAPIRequest.CollegeType = 'BTER'
    } else {
      this.ScholarshipAPIRequest.CollegeType = 'ITI'
    }
 
    //this.ScholarshipAPIRequest.CollegeType = String(this.sSOLoginDataModel.DepartmentID);
    //this.ScholarshipAPIRequest.RequestId = this.ScholarshipAPIRequest.RequestId;
    //this.ScholarshipAPIRequest.collegeCode = this.ScholarshipAPIRequest.collegeCode;
/*    this.ScholarshipAPIRequest.RequestType = 'Janaadhaar_Aadhaar';*/
    if (this.ScholarshipAPIRequest.RequestId == '') {
      this.ScholarshipAPIRequest.RequestId="0"
    }
    

    try {
      this.loaderService.requestStarted();

      await this.CollegeWiseScholarship.GetScholarship1(this.ScholarshipAPIRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data && Array.isArray(data.Data.data)) {
/*            this.scholarshipRequestList = data.Data.data;*/
            this.toastr.success("Fetch Succesfully")
           
          } else {
            /*      this.scholarshipRequestList = [];*/
            this.toastr.error("Error in Fetching Data")
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



  async GetDataAll() {

    this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID

    //this.ScholarshipAPIRequest.CollegeType = String(this.sSOLoginDataModel.DepartmentID);
    //this.ScholarshipAPIRequest.RequestId = this.ScholarshipAPIRequest.RequestId;
    //this.ScholarshipAPIRequest.collegeCode = this.ScholarshipAPIRequest.collegeCode;
    /*    this.ScholarshipAPIRequest.RequestType = 'Janaadhaar_Aadhaar';*/
   


    try {
      this.loaderService.requestStarted();

      await this.CollegeWiseScholarship.GetAllData(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data && data.Data ) {
            /*            this.scholarshipRequestList = data.Data.data;*/
            this.toastr.success("Fetch Succesfully")
            this.scholarshipRequestList=data.Data
          } else {
            /*      this.scholarshipRequestList = [];*/
            this.toastr.error("Error in Fetching Data")
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



  async Onchangecollege() {
    this.ScholarshipAPIRequest.RequestId="0"
    this.ScholarshipAPIRequest.RequestId = this.InstituteMasterList.find((e: any) => e.InstituteID == this.ScholarshipAPIRequest.InstituteID)?.InstituteCode
  }


  async Cancel() {
    this.searchrequest = new ScholarshipApiSearchDataModel()
    this.scholarshipRequestList=[]
  }
}
