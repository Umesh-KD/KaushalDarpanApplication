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
  scholarshipTypes:any = [
  { id: 1, name: 'Cash' },
  { id: 2, name: 'Scooty' },
  { id: 3, name: 'Laptop' }
];

schemeTypes:any = [
  { id: 1, name: 'Scheme 1' },
  { id: 2, name: 'Scheme 2' },
  { id: 3, name: 'Scheme 3' }
];

SelectedStudent:any = {};



  constructor(private commonMasterService: CommonFunctionService, private CounsellingMasterService: CounsellingMasterService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute,
    private modalService:NgbModal,
    private fb:FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private encryptionService: EncryptionService,
    
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



    AddToList() {
      debugger
      this.isSubmitted = true;
      if (this.EditDataFormGroup.invalid) return;
      const filtered = this.AddCollegeWiseScholarshipModelList.filter(s => 
        s.ScholarShipTypeID == this.EditDataFormGroup.get('ScholarshipType')?.value &&
        s.SchemeID == this.EditDataFormGroup.get('SchemeID')?.value &&
        new Date(s.ScholarShipDate).getFullYear() === new Date(this.EditDataFormGroup.get('ScholarshipDate')?.value).getFullYear()
      );
      if(filtered.length > 0){
        alert('Already got scholarship');
        return;
      }

      const formValue = this.EditDataFormGroup.value;
  
      const newItem = new AddCollegeWiseScholarshipModel();
      newItem.ID = 0;
      newItem.ScholarShipTypeID = this.EditDataFormGroup.get('ScholarshipType')?.value;
      newItem.SchemeID = this.EditDataFormGroup.get('SchemeID')?.value;
      newItem.ScholarShipAmount = this.EditDataFormGroup.get('Amount')?.value;
      newItem.ScholarShipDate = this.EditDataFormGroup.get('ScholarshipDate')?.value;
      newItem.CreatedBy = this.sSOLoginDataModel.UserID;
      newItem.ModifyBy = this.sSOLoginDataModel.UserID;
      newItem.StudentID = this.SelectedStudent.StudentID;

      const selectedScholarship = this.scholarshipTypes.find((x:any) => x.id === newItem.ScholarShipTypeID)?.name ?? '';
      const selectedScheme = this.schemeTypes.find((x:any) => x.id === newItem.SchemeID)?.name ?? '';
      // const selectedScheme = this.scholarshipTypes.find(x => x.id === newItem.ScholarShipTypeID)?.name ?? '';
      newItem.SchemeName=selectedScheme;
      newItem.ScholarShipTypeName=selectedScholarship;
     
      this.AddCollegeWiseScholarshipModelList.push(newItem);

      this.EditDataFormGroup.reset();
  
      this.isSubmitted = false;
  
  
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

}
