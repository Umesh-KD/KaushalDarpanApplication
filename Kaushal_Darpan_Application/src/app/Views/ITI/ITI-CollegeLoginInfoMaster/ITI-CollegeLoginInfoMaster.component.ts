import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../Models/ITITradeDataModels';
import {  CollegeLoginInfoSearchModel } from '../../../Models/ITI/ITIFeesPerYearList';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ItiFeesPerYearserviceService } from '../../../Services/ITI/ITIFeesPerYearList/iti-fees-per-yearservice.service';
@Component({
  selector: 'app-ITI-CollegeLoginInfoMaster',
  templateUrl: './ITI-CollegeLoginInfoMaster.component.html',
  styleUrls: ['./ITI-CollegeLoginInfoMaster.component.css'],
    standalone: false
})
export class ITICollegeLoginInfoMasterComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ITITradeList: any = [];
  searchText: string = '';
  public CollegeTypeList: any[] = [];
  public ITI_CollegeLoginInfoList: any[] = [];
  public Districtlist: any[] = [];
  public ManagmentTypeList: any[] = [];
  public TradeTypesList: any = [];
  public TradeData: ITITradeSearchModel[] = [];

  request = new ITITradeDataModels()
  requestCollege = new CollegeLoginInfoSearchModel()
  public searchRequest = new ITITradeSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
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
  public sSOLoginDataModel = new SSOLoginDataModel();
 


  //end table feature default
  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ItiTradeService: ItiTradeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private ITIMasterService: ItiFeesPerYearserviceService,
  ) {
  }

  async ngOnInit()
  {
    await this.GetDistrictMaster();
    await this.GetManagmentType();
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GeITI_CollegeLoginInfo();
  }

  async GetDistrictMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster().then((data: any) => {
        this.Districtlist = data.Data;
      });
    } catch (error) {
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async GetManagmentType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetManagType().then((data: any) => {
        this.ManagmentTypeList = data.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  async GetCollegeLoginInfoByCode() {
    try {
      this.loaderService.requestStarted();
      await this.ITIMasterService.GetCollegeLoginInfoByCode(this.requestCollege)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.ITI_CollegeLoginInfoList = data.Data;

          this.loadInTable();
          console.log(this.ITI_CollegeLoginInfoList, "ListViewSeatDetails")
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


  async onSearchCancel()
  {
    this.ITI_CollegeLoginInfoList = [];
    this.requestCollege.SSOID = '';
    this.requestCollege.CollegeCode = '';
    this.requestCollege.ITItypeID = 0;
    this.requestCollege.DistrictID = 0;
    this.GeITI_CollegeLoginInfo();
  }


  async GeITI_CollegeLoginInfo() {
    
    try {
      this.requestCollege.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //this.requestCollege.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.loaderService.requestStarted();
      await this.ITIMasterService.GetITI_CollegeLoginInfoMaster(this.requestCollege).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ITI_CollegeLoginInfoList = data.Data;
        this.loadInTable();
        //this.paginatedInTableData = this.ITI_CollegeLoginInfoList;
        console.log('test', this.ITI_CollegeLoginInfoList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async btnRestIdWiseUpdateSSOID_Password(CollegeId: number=0) {

    try {

      this.Swal2.Confirmation("Are you sure you want to  Rest SSOID & Password ?",

        async (result: any) => {
          //confirmed
          if (result.isConfirmed) {
            this.requestCollege.CollegeId = CollegeId;
            this.requestCollege.DepartmentID = 2;
            this.loaderService.requestStarted();

            await this.ITIMasterService.Update_CollegeLoginInfo(this.requestCollege)
              .then((data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  this.GeITI_CollegeLoginInfo();
                }
                else if (this.State == EnumStatus.Error) {
                  this.toastr.error(this.ErrorMessage);
                }
              })
          }
        }   );
    



     
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  async btnAllRestSSOID_Password() {

    this.Swal2.Confirmation("Are you sure you want to All Rest SSOID & Password ?",

      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {

          if (this.ITI_CollegeLoginInfoList.length > 0) {
            const collegeIdsString: string = this.ITI_CollegeLoginInfoList
              .map((item: any) => item.CollegeId)
              .join(',');
            this.requestCollege.collegeIdsString = collegeIdsString;
            console.log(collegeIdsString);
            try {

              this.requestCollege.CollegeId = 0;
              this.requestCollege.DepartmentID = 2;
              this.loaderService.requestStarted();

              await this.ITIMasterService.Update_CollegeLoginInfo(this.requestCollege)
                .then((data: any) => {
                  this.State = data['State'];
                  this.Message = data['Message'];
                  this.ErrorMessage = data['ErrorMessage'];
                  if (this.State == EnumStatus.Success) {
                    this.toastr.success(this.Message)
                    this.GeITI_CollegeLoginInfo();
                  }
                  else if (this.State == EnumStatus.Error) {
                    this.toastr.error(this.ErrorMessage);
                  }
                })
            } catch (error) {
              console.error(error);
            } finally {
              setTimeout(() => {
                this.loaderService.requestEnded();
              }, 200);
            }




          }
          else {
            this.requestCollege.collegeIdsString = '';
            this.toastr.success('data not found!')
            return;


          }
        }
      } );


    
    }

   

   





  

  onCancel(): void {
    this.searchRequest.TradeName = '';
    this.searchRequest.TradeCode = '';
    this.searchRequest.TradeTypeId = 0;
    this.searchRequest.DurationYear = '';
  }

  onResetCancel(): void
  {
    this.onCancel();
   /* this.getITI_CollegeLoginInfoListList();*/
  }

  onEdit(Id: number): void {

    // Navigate to the edit page with the institute ID
    this.Router.navigate(['/ititradeUpdate', Id]);
  }

  //exportToExcel(): void {
  //  const unwantedColumns = [
  //    'CollegeId'
  //  ];

  //  const filteredData = this.ITI_CollegeLoginInfoList.map(item => {
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
  //  XLSX.writeFile(wb, 'ITI_CollegeLoginInfoList.xlsx');
  //}
  exportToExcel(): void {
    const desiredOrder = ['Ssoid', 'CollegeName', 'CollegeCode', 'Password'];

    const filteredData = this.ITI_CollegeLoginInfoList.map(item => {
      const filteredItem: any = {};
      desiredOrder.forEach(key => {
        filteredItem[key] = item[key];
      });
      return filteredItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData, { header: desiredOrder });
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ITI_CollegeLoginInfoList.xlsx');
  }

 

 


  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.ITI_CollegeLoginInfoList].slice(this.startInTableIndex, this.endInTableIndex);
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
  // (replace org.list here)
  sortInTableData(field: string) {
    this.loaderService.requestStarted();
    this.sortInTableDirection = this.sortInTableDirection == 'asc' ? 'desc' : 'asc';
    this.paginatedInTableData = ([...this.ITI_CollegeLoginInfoList] as any[]).sort((a, b) => {
      const comparison = a[field] < b[field] ? -1 : a[field] > b[field] ? 1 : 0;
      return this.sortInTableDirection == 'asc' ? comparison : -comparison;
    }).slice(this.startInTableIndex, this.endInTableIndex);
    this.sortInTableColumn = field;
    this.loaderService.requestEnded();
  }
  //main 
  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }
  // (replace org. list here)
  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.ITI_CollegeLoginInfoList.length;
  }


}
