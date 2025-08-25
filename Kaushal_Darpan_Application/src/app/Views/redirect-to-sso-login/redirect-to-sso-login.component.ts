import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../Common/appsetting.service';
import { GlobalConstants, EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { CollegeMasterSearchModel, CollegeMasterDataModels } from '../../Models/CollegeMasterDataModels';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CollegeMasterService } from '../../Services/CollegeMaster/college-master.service';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { SSOLoginService } from '../../Services/SSOLogin/ssologin.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-redirect-to-sso-login',
  standalone: false,
  templateUrl: './redirect-to-sso-login.component.html',
  styleUrl: './redirect-to-sso-login.component.css'
})

export class RedirectToSsoLoginComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DistrictList: any = [];
  public CollegeMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  searchByInstituteCode: string = '';
  searchByInstituteName: string = '';
  searchByInstituteEmail: string = '';
  searchByManagementType: string = '';
  searchByDistrict: string = '';
  searchBySSOID: string = '';
  searchByStatus: number = 2;
  public DistrictMasterList: any = []
  public Table_SearchText: string = '';
  public _GlobalConstants = GlobalConstants
  public ManagmentTypeList: any = []
  public Type1List: any = []
  public Type2List: any = []
  public originalCollegeMasterList: any = []
  public searchRequest = new CollegeMasterSearchModel();
  public statusID: number = 0
  public UserName: string = '';
  public Password: string = '';
  //table feature default
  public paginatedInTableData: any[] = [];//copy of main data
  public currentInTablePage: number = 1;
  public pageInTableSize: string = "50";
  public totalInTablePage: number = 0;
  public sortInTableColumn: string = '';
  public sortInTableDirection: string = 'asc';
  public startInTableIndex: number = 0;
  public endInTableIndex: number = 0;
  public AllInTableSelect: boolean = false;
  public totalInTableRecord: number = 0;
  //end table feature default
  request = new CollegeMasterDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();
  MapKeyEng: number = 1;
  public DateConfigSetting: any = [];
  public _EnumRole = EnumRole
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  collegesemrequest = new CollegeMasterSearchModel();


  public SemesterDetails: any[] = [];//copy of main data

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private sSOLoginService: SSOLoginService,
    private cookieService: CookieService,  private collegeService: CollegeMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private modalService: NgbModal, private Swal2: SweetAlert2, private appsettingConfig: AppsettingService) {
  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.statusID = Number(this.router.snapshot.paramMap.get('id'));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;

    await this.GetManagmentType()

    if (this.statusID > 0) {
      this.searchRequest.Status = this.statusID
    }
    await this.GetCollegeMasterList(1);

  }

  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByInstituteCode = '';
    this.searchByInstituteName = '';
    this.searchByInstituteEmail = '';
    this.searchByManagementType = '';
    this.searchByDistrict = '';
    this.searchBySSOID = '';
    this.GetCollegeMasterList(1);
  }

  onSearchClick() {

    const searchCriteria: any = {
      InstituteCode: this.searchByInstituteCode.trim().toLowerCase(),
      InstituteNameEnglish: this.searchByInstituteName.trim().toLowerCase(),
      Email: this.searchByInstituteEmail.trim().toLowerCase(),
      ManagementType: this.searchByManagementType.trim().toLowerCase(),
      DistrictID: Number(this.searchByDistrict),
      SSOID: this.searchBySSOID.trim().toLowerCase()
    };



    this.CollegeMasterList = this.originalCollegeMasterList.filter((college: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }
        const collegeValue = college[key];
        if (typeof collegeValue === 'string') {
          return collegeValue.toLowerCase().includes(searchValue);
        }
        return collegeValue === searchValue;
      });
    });
    this.updateInTablePaginatedData();
  }

  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ManagmentTypeList = data['Data'];

          //console.log(this.DivisionMasterList)
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

  //table feature
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }

  loadInTable() {
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }

  filteredItems() {
    this.CollegeMasterList = this.originalCollegeMasterList.filter((college: any) => {
      return Object.keys(college).some(key => {
        const collegeValue = college[key];
        if (typeof collegeValue === 'string' && collegeValue.toLowerCase().includes(this.Table_SearchText.toLowerCase())) {
          return true;
        }
        return false;
      });
    });
    this.updateInTablePaginatedData();
  }

  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.CollegeMasterList].slice(this.startInTableIndex, this.endInTableIndex);
    this.loaderService.requestEnded();
  }

  previousInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage--;
      this.updateInTablePaginatedData();
    }
  }
  nextInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage++;
      this.updateInTablePaginatedData();
    }
  }
  firstInTablePage() {
    if (this.currentInTablePage > 1) {
      this.currentInTablePage = 1;
      this.updateInTablePaginatedData();
    }
  }
  lastInTablePage() {
    if (this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.currentInTablePage = this.totalInTablePage;
      this.updateInTablePaginatedData();
    }
  }
  randamInTablePage() {
    if (this.currentInTablePage <= 0 || this.currentInTablePage > this.totalInTablePage) {
      this.currentInTablePage = 1;
    }
    if (this.currentInTablePage > 0 && this.currentInTablePage < this.totalInTablePage && this.totalInTablePage > 0) {
      this.updateInTablePaginatedData();
    }
  }


  async Login() {
    

    this.isSubmitted = true;
    this.loaderService.requestStarted();
    try {


      await this.sSOLoginService.login(this.UserName, this.Password).subscribe({
        next: (data) => {
          data = JSON.parse(JSON.stringify(data.body));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.sSOLoginDataModel = data['Data'];
            

            if (this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWarden || this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWardenITINCVT || this.sSOLoginDataModel.RoleID == this._EnumRole.HostelWardenITISCVT) {
              this.sSOLoginDataModel.IsMutiHostelWarden = true;
              const getHostelSID = data['Data']['HostelIDs'];
              if (getHostelSID != null && getHostelSID != '') {
                const hostelIDArray = getHostelSID.split(",");
                //alert(hostelIDArray);
                this.sSOLoginDataModel.HostelID = hostelIDArray[0];
              }
              else {
                this.sSOLoginDataModel.HostelID = 0;
              }

            }



            //set user session 
            localStorage.setItem('SSOLoginUser', JSON.stringify(this.sSOLoginDataModel));
            //set cookie
            this.cookieService.set('LoginStatus', "OK");

            //redirect
            //window.open('/dashboard', "_self");
            this.routers.navigate(['/dashboard']);
          }
          else {
            this.toastr.error(this.Message);

          }
        },
        error: (error) => {
          //this.errorMessage = 'Invalid SSOID or Password';
        }
      });



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

  async GetCollegeMasterList(i: any) {
    
    console.log("i", i);
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

    this.searchRequest.InstituteCode = this.searchByInstituteCode;
    this.searchRequest.InstituteName = this.searchByInstituteName;
    this.searchRequest.Email = this.searchByInstituteEmail;

    this.searchRequest.SSOID = this.searchBySSOID;


    //this.searchRequest.Status = this.searchByStatus;
    this.searchRequest.PageNumber = this.pageNo
    this.searchRequest.PageSize = this.pageSize
    try {
      this.loaderService.requestStarted();
      await this.collegeService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CollegeMasterList = data['Data'];

          this.totalRecord = this.CollegeMasterList[0]?.TotalRecords;

          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

          this.originalCollegeMasterList = [...data['Data']]; // Keep a copy of original data
          this.totalInTableRecord = this.CollegeMasterList.length;
          this.loadInTable();
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

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetCollegeMasterList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.CollegeMasterList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetCollegeMasterList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetCollegeMasterList(3)
    }
  }


}
