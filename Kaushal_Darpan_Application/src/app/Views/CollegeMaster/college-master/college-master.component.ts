import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
//import { CollegeMasteDataModels } from '../../../Models/CollegeMasterDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeMasterService } from '../../../Services/CollegeMaster/college-master.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CollegeMasterDataModels, CollegeMasterSearchModel } from '../../../Models/CollegeMasterDataModels';
import * as XLSX from 'xlsx';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { RequestBaseModel } from '../../../Models/RequestBaseModel';
import { AppsettingService } from '../../../Common/appsetting.service';
@Component({
    selector: 'app-college-master',
    templateUrl: './college-master.component.html',
    styleUrls: ['./college-master.component.css'],
    standalone: false
})
export class CollegeMasterComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  //Maximize and minimize toggle YASH WORK
  public isSearchVisible: boolean = true;
  public toggleSearchCriteria(): void {
    this.isSearchVisible = !this.isSearchVisible;
  }
  DistrictIds: number[] = [];

  //till here
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
  public MenuAllowedRoleList: any = []
  public searchRequest = new CollegeMasterSearchModel();
  public statusID: number = 0
  public _EnumRole = EnumRole
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

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  collegesemrequest = new CollegeMasterSearchModel();


  public SemesterDetails: any[] = [];//copy of main data

  constructor(private commonMasterService: CommonFunctionService, private Router: Router,
    private collegeService: CollegeMasterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router, private _fb: FormBuilder,
    private modalService: NgbModal, private Swal2: SweetAlert2, private appsettingConfig: AppsettingService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetMenuPermission();
    
    this.statusID = Number(this.router.snapshot.paramMap.get('id'));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;

    this.searchRequest.Status =2;
   
    await this.GetDistrictMasterList();
    await this.GetManagmentType()
    await this.GetDateConfig();

    if (this.statusID > 0) {
      this.searchRequest.Status = this.statusID
    }
    await this.GetCollegeMasterList(1);

    await this.GetPrintRollAdmitCardSetting();
  }

  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByInstituteCode = '';
    this.DistrictIds=[]
    this.searchByInstituteName = '';
    this.searchByInstituteEmail = '';
    this.searchByManagementType = '';
    this.searchByDistrict = '';
    this.searchBySSOID = '';
    this.searchRequest = new CollegeMasterSearchModel();
    this.GetCollegeMasterList(1);
  }

 /* ---------------OLD Comment 20261021---------*/
  //exportToExcel(): void {
  //  const unwantedColumns = [
  //    'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
  //    'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
  //  ];
  //  const filteredData = this.CollegeMasterList.map((item: any) => {
  //    const filteredItem: any = {};
  //    Object.keys(item).forEach(key => {
  //      if (!unwantedColumns.includes(key)) {
  //        filteredItem[key] = item[key];
  //      }
  //    });
  //    return filteredItem;
  //  });
  //  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
  //  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //  XLSX.writeFile(wb, 'CollegeMasterListData.xlsx');
  //}


  /* ---------------New Added UI Column Downloaded in Excel 20261021---------*/
  exportToExcel(): void {
    const ExcelColumns = [
      { key: 'SrNo', header: 'Sr. No.' },
      { key: 'InstituteCode', header: 'Institute Code' },
      { key: 'InstituteNameEnglish', header: 'Name' },
      { key: 'ManagementType', header: 'Management Type' },
      { key: 'Email', header: 'Email' },
      { key: 'SSOID', header: 'SSOID' },
      { key: 'CreatedByName', header: 'Created By' },
      { key: 'CreatedDate', header: 'Created Date' },
      { key: 'ModifyByName', header: 'Modify By' },
      { key: 'ModifyDate', header: 'Modify Date' },
      ...(this.statusID != 0  ? [{ key: 'IssuedCertificate', header: 'Issue Certificate' }]
        : []),
      { key: 'Status', header: 'Status' }
    ];

    const filteredData = this.CollegeMasterList.map(
      (item: any, index: number) => {
        const row: any = {};

        ExcelColumns.forEach(col => {
          if (col.key === 'SrNo') {
            row[col.header] =
              (this.pageSize * (this.pageNo - 1)) + index + 1;
          } else {
            row[col.header] = item[col.key] ?? '';
          }
        });

        return row;
      }
    );

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData, {
      header: ExcelColumns.map(col => col.header)
    });

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'CollegeMasterListData.xlsx');
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
          console.log(this.DistrictMasterList)
          // console.log(this.DivisionMasterList)
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
    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID;

    this.searchRequest.DistrictIds = (this.DistrictIds || []).join(',');   // e.g. "1,5,9"
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

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.CollegeMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CollegMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }

  //async btnDelete_OnClick(InstitudeID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      await this.collegeService.DeleteDataByID(InstitudeID, this.UserID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            this.GetCollegeMasterList()
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async btnDelete_OnClick(InstitudeID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.collegeService.DeleteDataByID(InstitudeID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetCollegeMasterList(1)
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  //  async btnActive_OnClick(InstitudeID: number) {

  //    this.isSubmitted = false;
  //    try {
  //      if (confirm("Are you sure you want to change status?")) {
  //        this.loaderService.requestStarted();
  //        await this.collegeService.ActiveStatusByID(InstitudeID, this.UserID)
  //          .then((data: any) => {
  //            this.State = data['State'];
  //            this.Message = data['Message'];
  //            this.ErrorMessage = data['ErrorMessage'];
  //            if (this.State == 0) {
  //              this.toastr.success(this.Message)
  //              this.GetCollegeMasterList()
  //            }
  //            else {
  //              this.toastr.error(this.ErrorMessage)
  //            }
  //          })
  //      }
  //    }
  //    catch (ex) { }
  //    finally {
  //      setTimeout(() => {
  //        this.loaderService.requestEnded();
  //      }, 200);
  //    }
  //  }

  //}

  async btnActive_OnClick(InstitudeID: number) {

    this.Swal2.Confirmation("Are you sure you want to change status?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.collegeService.ActiveStatusByID(InstitudeID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetCollegeMasterList(1)
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  async GetDateConfig() {
    
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.sSOLoginDataModel.Eng_NonEng,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Key: "CollegeMaster",
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonMasterService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
        
        console.log(data, 'Dataa');

      }, (error: any) => console.error(error)
      );
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


  async GetPrintRollAdmitCardSetting()
  {
    
    this.collegesemrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.collegesemrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.collegesemrequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.collegesemrequest.RoleID =this.sSOLoginDataModel.RoleID;

    if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon)
    {
      this.collegesemrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    }
    else
    {
      this.collegesemrequest.InstituteID = 0;
    }
   
    await this.commonMasterService.GetPrintRollAdmitCardSetting(this.collegesemrequest)
      .then((data: any) =>
      {

        data = JSON.parse(JSON.stringify(data));
        this.SemesterDetails = data.Data;
        console.log(this.SemesterDetails)
        if (this.sSOLoginDataModel.RoleID == EnumRole.Principal || this.sSOLoginDataModel.RoleID == EnumRole.PrincipalNon)
        {

          this.Type1List = this.SemesterDetails.filter(x => x.PDFType == 1)
          this.Type2List = this.SemesterDetails.filter(x => x.PDFType == 2)
        }

        console.log( this.SemesterDetails,"type")

      }, (error: any) => console.error(error)
      );
  }

  downloadFile(fileUrl: string, fileName: string) {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  }

  async GetMenuPermission() {

    const baseRoute = this.routers.url.split('?')[0].split('/').filter(Boolean)[0] ?? '';

    var request: any = {
      FilterBy: baseRoute,
      MasterCode: "GetAllowedRoleForMenu"
    }

    await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) => {
      data =  JSON.parse(JSON.stringify(data));
      if(data.State == EnumStatus.Success){
        this.MenuAllowedRoleList=data.Data

        if (!this.MenuAllowedRoleList.some(
          (item: any) => Number(item.RoleID) == Number(this.sSOLoginDataModel.RoleID)
        )) {
          // Navigate to dashboard if RoleID is not allowed
          this.routers.navigate(['/dashboard']);
        }
      }      
    })
  }


  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection === 'asc' ? '&uarr;' : '&darr;';
  }

  sortData(column: string): void {
    if (this.sortInTableColumn === column) {
      this.sortInTableDirection =
        this.sortInTableDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortInTableColumn = column;
      this.sortInTableDirection = 'asc';
    }

    const direction = this.sortInTableDirection === 'asc' ? 1 : -1;
    const dateColumns = ['CreatedDate', 'ModifyDate'];
    const parseDate = (value: any): number | null => {
      if (value == null || value === '') {
        return null;
      }

      if (value instanceof Date) {
        const timestamp = value.getTime();
        return Number.isFinite(timestamp) ? timestamp : null;
      }

      if (typeof value === 'number') {
        return Number.isFinite(value) ? value : null;
      }

      const str = String(value).trim();

      // DD-MM-YYYY or DD-MM-YYYY HH:mm:ss
      // Also supports DD/MM/YYYY and optional seconds
      const match = str.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);

      if (match) {
        const [, day, month, year, hours = '00', minutes = '00', seconds = '00'] = match;
        const d = Number(day);
        const m = Number(month);
        const y = Number(year);
        const h = Number(hours);
        const min = Number(minutes);
        const s = Number(seconds);

        // Validate date and time components
        if (m < 1 || m > 12 || d < 1 || d > 31 || h > 23 || min > 59 || s > 59) {
          return null;
        }

        const date = new Date(y, m - 1, d, h, min, s);

        // Reject invalid calendar dates such as 31-02-2025
        if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
          return null;
        }
        return date.getTime();
      }

      // Fallback for ISO formats, e.g. 2025-12-22T14:29:50
      const timestamp = Date.parse(str);
      return Number.isFinite(timestamp) ? timestamp : null;
    };

    this.CollegeMasterList.sort((a: any, b: any) => {
      const valueA = a?.[column];
      const valueB = b?.[column];
      const emptyA = valueA == null || valueA === '';
      const emptyB = valueB == null || valueB === '';

      // Keep empty values at the bottom in both directions
      if (emptyA && emptyB) return 0;
      if (emptyA) return 1;
      if (emptyB) return -1;

      let result = 0;

      if (dateColumns.includes(column)) {
        const dateA = parseDate(valueA);
        const dateB = parseDate(valueB);

        // Invalid dates go to the bottom
        if (dateA === null && dateB === null) return 0;
        if (dateA === null) return 1;
        if (dateB === null) return -1;

        result = dateA - dateB;
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        result = valueA - valueB;
      }
      else {
        result = String(valueA).localeCompare(String(valueB), undefined, {
          numeric: true,
          sensitivity: 'base'
        }
        );
      }

      return result * direction;
    });
  }

}
