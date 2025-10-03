import { Component, OnInit } from '@angular/core';
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

// declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
    selector: 'counselling-selectedoptionlist',
    templateUrl: './counselling-selectedoptionlist.component.html',
    styleUrls: ['./counselling-selectedoptionlist.component.css'],
    standalone: false
})
export class CounsellingSelectedOptionListComponent implements OnInit {
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
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // this.searchRequest.TradeID=
     if (this.activatedRoute.snapshot.queryParamMap.get('Id') != null) {
      if(this.searchRequest.TradeID==0){
        this.TradeID = Number(this.activatedRoute.snapshot.queryParamMap.get('Id')?.toString());
      }
      // await this.GetByID(this.PostID);
    }
   await this.getcandidateOptionList();
    await this.GetTradeDDL();
    await this.GetCandidateList(1);
  await this.GetCategoryMatserDDL()
      // Add dynamic validator
      this.EditDataFormGroup.get('ScholarshipType')?.valueChanges.subscribe(val => {
        const amountCtrl = this.EditDataFormGroup.get('Amount');
        if (val === 'Cash') {
          amountCtrl?.setValidators([Validators.required]);
        } else {
          amountCtrl?.clearValidators();
          amountCtrl?.setValue('');
        }
        amountCtrl?.updateValueAndValidity();
      });

  // await this.GetCandidateList(1);
       
  }


  exportToExcel(): void {
    debugger
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


    async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.TradeDDLList = data['Data'];  
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

  async GetCandidateList(i:any) {
    debugger
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
      await this.CounsellingMasterService.GetCandidateList(this.searchRequest).then((data: any) => {
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


  async Back() {
    this.routers.navigate(['/CounsellingAllotmentList'])
  }


    checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }

  // get all data
  async ClearSearchData() {
    debugger
    // this.searchRequest.Name = '';
    // this.searchRequest.Enrollment = '';
    // this.searchRequest.Category='';
    // this.searchRequest.Status = '';
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize;
    await this.GetCandidateList(1);
   
  }



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

  async getcandidateOptionList(){
    try {

          this.searchRequest.PageNumber=this.pageNo
          this.searchRequest.PageSize=this.pageSize
          this.searchRequest.SortColumn=this.sortColumn
          this.searchRequest.SortOrder=this.sortOrder 
          this.searchRequest.TradeID=this.searchRequest.TradeID>0?this.searchRequest.TradeID:this.TradeID;
          this.searchRequest.CandidateID=0

          
          this.searchRequest.action="_GetcandidateOptionList"
          // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
          //   this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
          //   this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
          //   console.log(this.searchRequest.Category);
          this.loaderService.requestStarted();
          await this.CounsellingMasterService.GetCandidateList(this.searchRequest).then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.StudentOptionListToExport = data.Data;

            // this.totalRecord=this.StudentOptionList[0]?.TotalRecords;
            // this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

            console.log(this.StudentOptionList)
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

     async EditData(content: any, rowData?: any) {
    this.isSubmitted = true;
    this.SelectedStudent = rowData;
    
    debugger
    // Open only once, store reference
    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });
    // await this.fetchById();

    // Handle result or dismissal
    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    if (rowData != null && rowData != undefined) {
      // if (rowData.StreamID != null) {
        // let obj = {
        //   Action: "GET_BY_ID",
        //   DepartmentID: this.sSOLoginDataModel.DepartmentID,
        //   EndTermID: this.sSOLoginDataModel.EndTermID,
        //   Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        //   StreamID: rowData.StreamID,
        //   SemesterID: rowData.SemesterID
        // }

        // await this.staffMasterService.GetBranchSectionData(obj)
        //   .then((data: any) => {
        //     data = JSON.parse(JSON.stringify(data));
        //     this.GetBranchStreamData=data.Data;
        //     // this.GetBranchSectionData=this.GetBranchSectionData.filter((item:any)=>item.createdby==this.sSOLoginDataModel.UserID)
        //     this.GetBranchStreamData = this.GetBranchStreamData.filter((item:any)=>item.CreatedBy==this.sSOLoginDataModel.UserID)
        //     // this.GetBranchStreamData = data.Data
        //     this.totalRecord1 = data['Data'].length;
        //     console.log(this.GetBranchStreamData)
        //     this.initTable1(this.GetBranchStreamData);
        //   }, (error: any) => console.error(error)
        //   );

        try {

          this.searchRequest.PageNumber=this.pageNo
          this.searchRequest.PageSize=this.pageSize
          this.searchRequest.SortColumn=this.sortColumn
          this.searchRequest.SortOrder=this.sortOrder 
          this.searchRequest.TradeID=this.searchRequest.TradeID>0?this.searchRequest.TradeID:this.TradeID;
          if(rowData.CandidateID>0)
          {
            this.searchRequest.CandidateID=rowData.CandidateID
          }
          else{
            this.searchRequest.CandidateID=0
          }
          
          this.searchRequest.action="_GetcandidateOptionList"
          // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
          //   this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
          //   this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
          //   console.log(this.searchRequest.Category);
          this.loaderService.requestStarted();
          await this.CounsellingMasterService.GetCandidateList(this.searchRequest).then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.StudentOptionList = data.Data;

            this.totalRecord=this.StudentOptionList[0]?.TotalRecords;
            this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

            console.log(this.StudentOptionList)
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
            
      // }
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
    debugger
    this.routers.navigate(['/candidate-details'],{
      queryParams: { AppID: this.encryptionService.encryptData(row.CandidateID) }
    });
  }

  async UnlockApplication_Counselling(item: any) {
    this.Swal2.Confirmation(`Are you sure you want to Unlock Application for Candidate!`,
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.unlockRequest.CandidateId = item.CandidateID;
            await this.counsellingApplicationFormService.UnlockApplication_Counselling(this.unlockRequest)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if(data.State === EnumStatus.Success){
                  this.toastr.success(data.Message);
                  await this.GetCandidateList(1);
                } else if(data.State === EnumStatus.Warning){
                  this.toastr.warning(data.Message);
                } else {
                  this.toastr.error(data.ErrorMessage);
                }
            })
          } catch (error) {
            console.error(error);
          }
        }
      });    
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
  selectInTableAllCheckbox() {
    this.StudentList.forEach((x: any) => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean, item: any) {
    const data = this.StudentList.filter((x: any) => x.StudentID == item.StudentID);
    data.forEach((x: any) => {
      x.Selected = isSelected;
    });
    //select all(toggle)
    this.AllInTableSelect = this.StudentList.every((r: any) => r.Selected);
  }
  // end table feature
}
