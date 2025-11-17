import { Component, OnInit, ViewChild, viewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../../Services/CompanyMaster/company-master.service.ts';
import { CollegeWiseScholarshipService } from '../../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel } from '../../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCollegeWiseScholarshipModel, CollegeWiseScholarshipSearchModel } from '../../../Models/CollegeWiseScholarshipModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CounsellingAllotmentListModel } from '../../../Models/CounsellingMasterModel';
import { CounsellingMasterService } from '../../../Services/CounsellingMaster/counselling-master.service';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { CounsellingApplicationFormService } from '../../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { CounsellingApplicationSearchModel } from '../../../Models/CounsellingApplicationFormDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CounsellingImportCandidateListService } from '../../../Services/CounsellingImportCandidateList/CounsellingImportCandidateList.service';

// declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
    selector: 'counselling-import-candidate-list',
    templateUrl: './counselling-import-candidate-list.component.html',
    styleUrls: ['./counselling-import-candidate-list.component.css'],
    standalone: false
})
export class CounsellingImportCandidateListComponent implements OnInit {
  public StudentList: any = [];
  public StudentOptionList: any = [];
   public StudentOptionListToExport: any = [];
  public Table_SearchText: string = "";
  public AllSelect: boolean = false;
  public searchRequest = new CounsellingAllotmentListModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public unlockRequest = new CounsellingApplicationSearchModel();
  public ApprovedStatus: string = "0";
  public mode:string='manual';
  @ViewChild('MyModel_ViewDetails') MyModel_ViewDetails: any;

  // pagination
   pageNo: any = 1;
   pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";

  public TradeID: number = 0;

  public TradeDDLList: any = [];  

  modalRef1: NgbModalRef | null=null;
  isSubmitted:boolean =false;
  closeResult:string | undefined;
  EditDataFormGroup!: FormGroup;
  AddCollegeWiseScholarshipModelList: AddCollegeWiseScholarshipModel[]=[];
  AddCollegeWiseScholarshipModelList2: AddCollegeWiseScholarshipModel[]=[];
  AddCollegeWiseScholarshipModel =new AddCollegeWiseScholarshipModel();
  CategoryList:any=[];
  SelectedStudent:any = {};

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


    constructor(
    private commonMasterService: CommonFunctionService, 
    private CounsellingMasterService: CounsellingMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2, 
    private Router: Router, 
    private router: ActivatedRoute,
    private modalService:NgbModal,
    private fb:FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private encryptionService: EncryptionService,
    private counsellingApplicationFormService: CounsellingApplicationFormService,
    private counsellingImportCandidateListService: CounsellingImportCandidateListService
  ){}

  //  --------------------------
    public importFile: any;
    public ImportExcelList : any = [];
    public selectedFile: File | null = null;

    onFileChange(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
          this.selectedFile = file;
          this.ImportExcelFile(file);
        }
        this.selectedFile = null;
         // Reset file input so selecting the same file again triggers change
        event.target.value = null;
      }
    //ImportExcelFile(file: File): void {
    //    let mesg = '';
    //    this.counsellingImportCandidateListService.SampleImportExcelFile(file)
    //      .then((data: any) => {

    //        data = JSON.parse(JSON.stringify(data));
    //        if (data.State === EnumStatus.Success) {

    //          this.ImportExcelList = data['Data'];
    //          console.log(this.ImportExcelList, "data in excel")

    //          if (this.ImportExcelList.length > 0) {
    //            this.GetImportExcelDataPopup(this.MyModel_ViewDetails);

    //          }

    //        }
    //      });
  //}

  ImportExcelFile(file: File): void {
    let mesg = '';
    debugger;
    this.counsellingImportCandidateListService.SampleImportExcelFile(file)
      .then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
        if (data.State === EnumStatus.Success) {

          // Assign data to model
          this.ImportExcelList = data['Data'].map((item: any) => {
            const processedItem: any = {};

            Object.keys(item).forEach((key) => {
              let val = item[key];

              // ✅ Convert numeric strings to numbers (including decimals)
              if (typeof val === 'string' && !isNaN(Number(val))) {
                val = Number(val);
              }

              processedItem[key] = val;
            });

            return processedItem;
          });

          console.log(this.ImportExcelList, "data in excel");

          if (this.ImportExcelList.length > 0) {
            this.GetImportExcelDataPopup(this.MyModel_ViewDetails);
          }
        }
      });
  }


    SaveDataInDB(): void {
        console.log(this.ImportExcelList);
        debugger
        this.ImportExcelList.forEach((item: any) => {
          if (!item.ModifyBy || item.ModifyBy === null) {
            item.ModifyBy = this.sSOLoginDataModel.UserID;
          }
          if (!item.DepartmentID || item.DepartmentID === null) {
            item.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          }
        });
        this.counsellingImportCandidateListService.SaveImportExcelData(this.ImportExcelList).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.toastr.success(data.Message);
            this.ImportExcelList = [];
             this.GetCandidateList(1);
             this.CloseModalPopupimport();
          }
          else{
            this.toastr.error(data.ErrorMessage);
          }
        });
    }

     async GetImportExcelDataPopup(content: any) {

    /*    this.IsShowViewStudent = true;*/
    // this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });

     this.modalRef1 = this.modalService.open(content, {
    size: 'xl',
    ariaLabelledBy: 'modal-basic-title',
    backdrop: 'static'
  });

  this.modalRef1.result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;
      this.modalRef1 = null; // important
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.modalRef1 = null; // important
    }
  );
  }



  //--------------------


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // this.searchRequest.TradeID=
     if (this.activatedRoute.snapshot.queryParamMap.get('Id') != null) {
      if(this.searchRequest.TradeID==0){
        this.TradeID = Number(this.activatedRoute.snapshot.queryParamMap.get('Id')?.toString());
      }
      // await this.GetByID(this.PostID);
    }
  
    // await this.GetTradeDDL();
    await this.GetCandidateList(1);
  
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'Instituteid', 'CandidateID'
      
    ];
    const filteredData = this.StudentOptionListToExport.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentListData.xlsx');
  }


    //
  // public async ExcelExport() {
  //   if (this.StudentOptionList.length > 0) {
  //     tableToExcel("tbl_placementStudent", "Students", "PlacementStudent");
  //   }
  // }

   
   get formEditData(){return this.EditDataFormGroup.controls;}


  //   async GetTradeDDL() {
  //   try {
  //     this.loaderService.requestStarted();
  //     await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID)
  //       .then((data: any) => {
  //         console.log(data)
  //         data = JSON.parse(JSON.stringify(data));
  //         this.TradeDDLList = data['Data'];  
  //       }, error => console.error(error));
  //   }
  //   catch (Ex) {
  //     console.log(Ex);
  //   }
  //   finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  async GetCandidateList(i:any) {
    console.log(this.TradeID);
    console.log(i);
    if(i==1){
      this.pageNo=1;
    }
    else if(i==2){
      // if (this.totalRecord > (this.pageNo * this.pageSize)) {
        this.pageNo++;
      // }
    }
    else if(i==3){
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    }
    else{
      this.pageNo=i>0?i:1;
    }

    try {

      this.searchRequest.PageNumber=this.pageNo
      this.searchRequest.PageSize=this.pageSize
      this.searchRequest.SortColumn=this.sortColumn
      this.searchRequest.SortOrder=this.sortOrder 
      this.searchRequest.TradeID=this.searchRequest.TradeID>0?this.searchRequest.TradeID:this.TradeID;
      this.searchRequest.action="_GetcandidateList"
      this.loaderService.requestStarted();
      // counsellingImportCandidateListService
      await this.counsellingImportCandidateListService.GetCandidateList(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentList = data.Data;

        this.totalRecord=this.StudentList[0]?.TotalRecords;
        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        console.log(this.StudentList)
      }, (error: any) => console.error(error))
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


  // async Back() {
  //   this.routers.navigate(['/CounsellingAllotmentList'])
  // }


  //   checkboxthView_checkboxchange(isChecked: boolean) {
  //   this.AllSelect = isChecked;
  //   for (let item of this.StudentList) {
  //     item.Marked = this.AllSelect;
  //   }
  // }

  // get all data
  
  
  // async ClearSearchData() {
  //   debugger
  //   this.searchRequest.Name = '';
  //   this.searchRequest.Enrollment = '';
  //   this.searchRequest.Category='';
  //   this.searchRequest.Status = '';
  //   this.searchRequest.PageNumber = this.pageNo;
  //   this.searchRequest.PageSize = this.pageSize;
  //   await this.GetCandidateList(1);
   
  // }



  // pagination start

   totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetCandidateList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetCandidateList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetCandidateList(3)
    }
  }



  CloseModal1() {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
      this.modalRef1 = null;
      this.isSubmitted = false;
      this.SelectedStudent = {};
      // this.EditDataFormGroup.patchValue({
      //   SchemeID : '',
      //   Amount:'',
      //   ScholarshipType:'',
      //   ScholarshipDate:''
      // });
      this.StudentOptionList = [];
    }
  }
  

    CloseModalPopupimport() {
    // this.modalService.dismissAll();
    //this.ImportExcelList = [];

      if (this.modalRef1) {
        this.modalRef1.close();  // use close() or dismiss(), not dismissAll()
        this.modalRef1 = null;
      }
      this.ImportExcelList = []; 
      this.selectedFile = null;
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


    DeleteFromList(index:any){
      this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          this.AddCollegeWiseScholarshipModelList.splice(index, 1);
          console.log('test');
        }
        
      });
    }

  async GetCategoryMatserDDL() {
    try {
      this.AddCollegeWiseScholarshipModel.InstituteID = this.sSOLoginDataModel.DepartmentID

      this.loaderService.requestStarted();
      await this.commonMasterService.CasteCategoryA()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CategoryList = data['Data'];
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

  async redirectToPreview(row: any) {
    this.routers.navigate(['/candidate-details'],{
      queryParams: { AppID: this.encryptionService.encryptData(row.CandidateID) }
    });
  }

  // async UnlockApplication_Counselling(item: any) {
  //   this.Swal2.Confirmation(`Are you sure you want to Unlock Application for Candidate!`,
  //     async (result: any) => {
  //       //confirmed
  //       if (result.isConfirmed) {
  //         try {
  //           this.unlockRequest.CandidateId = item.CandidateID;
  //           await this.counsellingApplicationFormService.UnlockApplication_Counselling(this.unlockRequest)
  //             .then(async (data: any) => {
  //               data = JSON.parse(JSON.stringify(data));
  //               if(data.State === EnumStatus.Success){
  //                 this.toastr.success(data.Message);
  //                 await this.GetCandidateList(1);
  //               } else if(data.State === EnumStatus.Warning){
  //                 this.toastr.warning(data.Message);
  //               } else {
  //                 this.toastr.error(data.ErrorMessage);
  //               }
  //           })
  //         } catch (error) {
  //           console.error(error);
  //         }
  //       }
  //     });    
  // }

  


// Inside your component or service
//DownloadExcelSample(){
//    this.counsellingImportCandidateListService.GetSampleExcelFile().then((data: any) => {
//     data = JSON.parse(JSON.stringify(data));
//               console.log("ExportExcelData data", data);
//               if (data.State === EnumStatus.Success) {
//                 let dataExcel = data.Data;
//                  console.log('dataExcel check',dataExcel);

//                 const unwantedColumns = [
//                   "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
//                 ];

//                 // Filter out unwanted columns
//                 const filteredData = dataExcel.map((item: { [x: string]: any; }) => {
//                   const filteredItem: any = {};
//                   Object.keys(item).forEach(key => {
//                     if (!unwantedColumns.includes(key)) {
//                       filteredItem[key] = item[key];
//                     }
//                   });
//                   return filteredItem;
//                 });

//                 // Create Excel worksheet and workbook
//                 const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
//                 const wb: XLSX.WorkBook = XLSX.utils.book_new();
//                 XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

//                 // Auto-fit column widths
//                 const autoFitColumns = (ws: XLSX.WorkSheet, data: any[]) => {
//                   const colWidths = data.reduce((widths, row) => {
//                     Object.keys(row).forEach((key, colIndex) => {
//                       const value = row[key] ? row[key].toString() : "";
//                       const currentWidth = widths[colIndex] || key.length; // Use header length initially
//                       widths[colIndex] = Math.max(currentWidth, value.length);
//                     });
//                     return widths;
//                   }, [] as number[]);

//                   ws['!cols'] = colWidths.map((width: any) => ({
//                     wch: width + 2 // Add some padding for better appearance
//                   }));
//                 };

//                 autoFitColumns(ws, filteredData);

//                 // Export the Excel file
//                 XLSX.writeFile(wb, this.generateFileNameYearly('xlsx'));


//                 //this.searchRequest = new BTERMeritSearchModel()
//               } else {
//                 this.toastr.error(data.ErrorMessage);
//               }
//    });
  //  }

  //DownloadExcelSample() {
  //  this.counsellingImportCandidateListService.GetSampleExcelFile().then((data: any) => {
  //    data = JSON.parse(JSON.stringify(data));
  //    console.log("ExportExcelData data", data);

  //    if (data.State === EnumStatus.Success) {
  //      let dataExcel = data.Data;
  //      console.log('dataExcel check', dataExcel);

  //      const unwantedColumns = [
  //        "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
  //      ];

  //      // Step 1: Convert objects into only their values
  //      const filteredData = dataExcel.map((item: any) => {
  //        const values = Object.keys(item)
  //          .filter(key => !unwantedColumns.includes(key))
  //          .map(key => item[key]);
  //        return values;
  //      });

  //      // Step 2: Create worksheet from array of arrays (no header row)
  //      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filteredData);

  //      // Step 3: Auto-fit column widths
  //      const autoFitColumns = (ws: XLSX.WorkSheet, data: any[][]) => {
  //        const colWidths = data.reduce((widths, row) => {
  //          row.forEach((val: any, colIndex: number) => {
  //            const value = val ? val.toString() : "";
  //            const currentWidth = widths[colIndex] || 0;
  //            widths[colIndex] = Math.max(currentWidth, value.length);
  //          });
  //          return widths;
  //        }, [] as number[]);

  //        ws['!cols'] = colWidths.map(width => ({
  //          wch: width + 2 // Add padding
  //        }));
  //      };

  //      autoFitColumns(ws, filteredData);

  //      // Step 4: Create workbook and save file
  //      const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //      XLSX.writeFile(wb, this.generateFileNameYearly('xlsx'));

  //    } else {
  //      this.toastr.error(data.ErrorMessage);
  //    }
  //  });
  //}

  DownloadExcelSample() {
    this.counsellingImportCandidateListService.GetSampleExcelFile().then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      console.log("ExportExcelData data", data);

      if (data.State === EnumStatus.Success) {
        let dataExcel = data.Data;
        console.log('dataExcel check', dataExcel);

        const unwantedColumns = [
          "TradeSchemeId", "SeatNotAvailable", "TotalRecords", "CollegeTradeId", "TradeId"
        ];

        // Step 1: Convert objects into only their values
        const filteredData = dataExcel.map((item: any) => {
          const values = Object.keys(item)
            .filter(key => !unwantedColumns.includes(key))
            .map(key => {
              let val = item[key];

              // ✅ If value is a number with decimals, remove the decimal part
              if (typeof val === 'number') {
                val = Math.trunc(val); // removes decimal
              }

              // ✅ If value is a string containing a decimal number, strip the decimal part
              if (typeof val === 'string' && val.includes('.')) {
                val = val.split('.')[0];
                val = parseInt(val);
              }
             
              return val;
            });

          return values;
        });

        // Step 2: Create worksheet from array of arrays (no header row)
        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(filteredData);

        // Step 3: Auto-fit column widths
        const autoFitColumns = (ws: XLSX.WorkSheet, data: any[][]) => {
          const colWidths = data.reduce((widths, row) => {
            row.forEach((val: any, colIndex: number) => {
              const value = val ? val.toString() : "";
              const currentWidth = widths[colIndex] || 0;
              widths[colIndex] = Math.max(currentWidth, value.length);
            });
            return widths;
          }, [] as number[]);

          ws['!cols'] = colWidths.map(width => ({
            wch: width + 2 // Add padding
          }));
        };

        autoFitColumns(ws, filteredData);

        // Step 4: Create workbook and save file
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, this.generateFileNameYearly('xlsx'));

      } else {
        this.toastr.error(data.ErrorMessage);
      }
    });
  }  

  generateFileNameYearly(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `Import Candidate List Sample ${timestamp}.${extension}`;
  }

  //table feature 
  
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org.list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.StudentList].slice(this.startInTableIndex, this.endInTableIndex);
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
    this.paginatedInTableData = ([...this.StudentList] as any[]).sort((a, b) => {
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
    this.totalInTableRecord = this.StudentList.length;
  }
  // (replace org.list here)
  get totalInTableSelected(): number {
    return this.StudentList.filter((x: any) => x.Selected)?.length;
  }
  get sortInTableDirectionAero(): string {
    return this.sortInTableDirection == 'asc' ? '&uarr;' : '&darr;';
  }
  //checked all (replace org. list here)
  // selectInTableAllCheckbox() {
  //   this.StudentList.forEach((x: any) => {
  //     x.Selected = this.AllInTableSelect;
  //   });
  // }
  //checked single (replace org. list here)
  // selectInTableSingleCheckbox(isSelected: boolean, item: any) {
  //   const data = this.StudentList.filter((x: any) => x.StudentID == item.StudentID);
  //   data.forEach((x: any) => {
  //     x.Selected = isSelected;
  //   });
  //   //select all(toggle)
  //   this.AllInTableSelect = this.StudentList.every((r: any) => r.Selected);
  // }
  // end table feature
}

