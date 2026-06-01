import { Component } from '@angular/core';
import { ScholarshipApiDataModel, ScholarshipApiSearchDataModel } from '../../Models/CollegeWiseScholarshipModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { StreamMasterService } from '../../Services/BranchesMaster/branches-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ReportService } from '../../Services/Report/report.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ITICenterAllocationService } from '../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { ItiTradeService } from '../../Services/iti-trade/iti-trade.service';
import { CollegeWiseScholarshipService } from '../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { ActivatedRoute } from '@angular/router';
import { EnumRole } from '../../Common/GlobalConstants';
@Component({
  selector: 'app-scholarship-get-data',
  standalone: false,
  templateUrl: './scholarship-get-data.component.html',
  styleUrl: './scholarship-get-data.component.css'
})
export class ScholarshipGetDataComponent {


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
  public CourseMasterList: any = [];


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
    await this.GetCourse();


  }

  async InstituteMaster() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ScholarshipInstitute')
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



  async GetCourse(ID:number=0) {
    debugger
    this.ScholarshipAPIRequest.COURSEID=''
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ScholarshipCourse',ID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));


          this.CourseMasterList = data['Data'];
        

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

   

    try {
      this.loaderService.requestStarted();

      await this.CollegeWiseScholarship.GetScholarship1InstituteData(this.ScholarshipAPIRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
        
            /*            this.scholarshipRequestList = data.Data.data;*/
            this.toastr.success("Fetch Succesfully")
          this.scholarshipRequestList=data['Data']
     
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
          if (data && data.Data) {
            /*            this.scholarshipRequestList = data.Data.data;*/
            this.toastr.success("Fetch Succesfully")
            this.scholarshipRequestList = data.Data
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
    this.ScholarshipAPIRequest.RequestId = "0"
    this.ScholarshipAPIRequest.RequestId = this.InstituteMasterList.find((e: any) => e.InstituteID == this.ScholarshipAPIRequest.InstituteID)?.InstituteCode
  }


  async Cancel() {
    this.searchrequest = new ScholarshipApiSearchDataModel()
    this.scholarshipRequestList = []
  }


  exportToExcel(): void {
    const wantedColumnsOrder = [
      'Inst_Code',
      'Trade_code',
      'UNIVERSITYNAME_EN',
      'InstituteID',
      'INSTITUTENAME',
      'COURSENAME',
      'COURSEID',
      'SEATS',
      'AFFILATION_DATE',
      'AFFILATIONVALIDDATE',
      'INSTITUTE_COURSE_DOCUMENTS',
      'InstituteAFFILATIONDoc',
      'INSTITUTETYPE',
      'NODALOFFICERNAME',
      'NODALOFFICEREMAIL',
      'NODALOFFICERMOBILE',
      'NODALOFFICERAADHAAR',
      'DATEOF_ESTABLISHED',
      'VILLAGE',
      'DISTRICT',
      'TEHSIL',
      'PINCODE',
      'RURALURBAN',
      'DESIGNATION1',
      'NAME1',
      'EMAILADDRESS1',
      'MOBILENUMBER1',
      'DESIGNATION2',
      'NAME2',
      'EMAILADDRESS2',
      'MOBILENUMBER2',
      'REGISTRATIONFOR',
      'IS_GOVT',
      'AISHECODE',
      'PRCODE',
      'ISACTIVE',
      'NODALOFFICERAADHAAR_REFNO'
    ];

    if (!this.scholarshipRequestList || this.scholarshipRequestList.length === 0) {
      this.toastr.warning('No data to export.');
      return;
    }

    const filteredData = this.scholarshipRequestList.map((item: any) => {
      const orderedItem: any = {};

      wantedColumnsOrder.forEach((key: string) => {
        orderedItem[key] = item[key];
      });

      return orderedItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    const columnWidths = wantedColumnsOrder.map((key: string) => {
      const maxLength = Math.max(
        key.length,
        ...filteredData.map((row: any) =>
          row[key] !== null && row[key] !== undefined ? row[key].toString().length : 0
        )
      );
      return { wch: maxLength + 2 };
    });

    ws['!cols'] = columnWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ScholarshipReport');
    XLSX.writeFile(wb, 'Scholarship-Report-Data.xlsx');
  }

}
