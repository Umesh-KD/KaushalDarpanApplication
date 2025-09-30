import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { CollegeWiseScholarshipService } from '../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { AddCollegeWiseScholarshipModel, CollegeWiseScholarshipSearchModel } from '../../Models/CollegeWiseScholarshipModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
    selector: 'college-wise-scholarship-report',
    templateUrl: './college-wise-scholarship-report.component.html',
    styleUrls: ['./college-wise-scholarship-report.component.css'],
    standalone: false
})
export class CollegeWiseScholarshipReportComponent implements OnInit {
  public StudentList: any = [];
  public SchemeCountList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new CollegeWiseScholarshipSearchModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";

  // pagination
   pageNo: any = 1;
   pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";

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



  constructor(private commonMasterService: CommonFunctionService, private CollegeWiseScholarshipService: CollegeWiseScholarshipService,
    private toastr: ToastrService, private loaderService: LoaderService, private Swal2: SweetAlert2, private Router: Router, private router: ActivatedRoute,
    private modalService:NgbModal,
    private fb:FormBuilder
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.schemeTypes = await this.getSchemeList();
    this.scholarshipTypes = await this.getScholershiptype();

      // this.EditDataFormGroup = this.fb.group({
      //     ID: [''],
      //     SchemeID: [0, Validators.required],
      //     //AssignToSSOID: ['', Validators.required],
      //     ScholarshipID: ['', Validators.required],
      //     // SectionID: [0, Validators.required],
      //     // AssignbyStaffID: [0, Validators.required],
      //     // SemesterID: [{value:0 , disabled:true}, Validators.required],
      //     //  StreamID: [0, Validators.required]
      //   });
      this.EditDataFormGroup = this.fb.group({
        SchemeID: ['', Validators.required],
        ScholarshipType: ['', Validators.required],
        Amount: [''] , // will validate only if Cash is selected
        ScholarshipDate: ['', Validators.required]   // 👈 new field
      });
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

    await this.GetEligibleStudentListData(1);
       
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.StudentList.map((item: any) => {
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
   
   get formEditData(){return this.EditDataFormGroup.controls;}

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
    await this.fetchById();

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
      if (rowData.StreamID != null) {
        let obj = {
          Action: "GET_BY_ID",
          DepartmentID: this.sSOLoginDataModel.DepartmentID,
          EndTermID: this.sSOLoginDataModel.EndTermID,
          Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
          StreamID: rowData.StreamID,
          SemesterID: rowData.SemesterID
        }

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
      }
    }
  }

  async GetEligibleStudentListData(i:any) {
    debugger
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
debugger;
      this.searchRequest.PageNumber=this.pageNo
      this.searchRequest.PageSize=this.pageSize
      this.searchRequest.SortColumn=this.sortColumn
      this.searchRequest.SortOrder=this.sortOrder 
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.CourseType=this.sSOLoginDataModel.Eng_NonEng;
        console.log(this.searchRequest.Category);
        
        console.log(this.searchRequest.SchemeName);
      this.loaderService.requestStarted();
      await this.CollegeWiseScholarshipService.GetCollegeWiseScholarshipListReport(this.searchRequest).then((data: any) => {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        console.log(data);
      this.StudentList = data.Data.Table || [];

        this.totalRecord=this.StudentList[0]?.TotalRecords;
        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          this.SchemeCountList= data.Data.Table1 || [];
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

  async getSchemeList(){
    this.loaderService.requestStarted();
    try {
      this.CollegeWiseScholarshipService.GetSchemeType().then((data:any)=>{
        console.log('Scheme',data);
      this.schemeTypes = data.Data;
    })
    } catch (error) {
      console.log(error)
    }
    finally{
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getScholershiptype(){
    this.loaderService.requestStarted();
    try {
      this.CollegeWiseScholarshipService.GetScholershipType().then((data:any)=>{
        console.log('Types ',data);
      this.scholarshipTypes = data.Data;
    })
    } catch (error) {
      console.log(error)
    }
    finally{
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  // get all data
  async ClearSearchData() {
    debugger
    this.searchRequest.Name = '';
    this.searchRequest.Enrollment = '';
    this.searchRequest.Category='';
    this.searchRequest.Status = '';
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize;
    await this.GetEligibleStudentListData(1);
  }




  // async DeleteById(ID: number) {
  //   this.Swal2.Confirmation("Do you want to delete?",
  //     async (result: any) => {
  //       //confirmed
  //       if (result.isConfirmed) {
  //         try {
  //           //Show Loading
  //           this.loaderService.requestStarted();

  //           await this.companyMasterService.DeleteById(ID, this.sSOLoginDataModel.UserID)
  //             .then(async (data: any) => {
  //               data = JSON.parse(JSON.stringify(data));
  //               console.log(data);

  //               if (!data.State) {
  //                 this.toastr.success(data.Message)
  //                 await this.GetEligibleStudentListData(1);
  //               }
  //               else {
  //                 this.toastr.error(data.ErrorMessage)
  //               }

  //             }, (error: any) => console.error(error)
  //             );
  //         }
  //         catch (ex) {
  //           console.log(ex);
  //         }
  //         finally {
  //           setTimeout(() => {
  //             this.loaderService.requestEnded();
  //           }, 200);
  //         }
  //       }
  //     });
  // }



  // pagination start

   totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetEligibleStudentListData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetEligibleStudentListData(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetEligibleStudentListData(3)
    }
  }


  CloseModal1() {
    if (this.modalRef1) {
      this.modalRef1.dismiss();
      this.modalRef1 = null;
      this.isSubmitted = false;
      this.SelectedStudent = {};
      this.EditDataFormGroup.patchValue({
        SchemeID : '',
        Amount:'',
        ScholarshipType:'',
        ScholarshipDate:''
      });
      this.AddCollegeWiseScholarshipModelList = [];
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

  // sortData(sortColumn: string) {
  //   this.sortColumn = sortColumn;
  //   this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
  //   // this.GetEligibleStudentListData(1);
  // }


    // DeleteFromList(index:any){
    //   this.Swal2.Confirmation("Do you want to delete?",
    //   async (result: any) => {
    //     //confirmed
    //     if (result.isConfirmed) {
    //       this.AddCollegeWiseScholarshipModelList.splice(index, 1);
    //       console.log('test');
    //     }
        
    //   });
    // }

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

    // SaveData_EditDetails(){
    //   console.log(this.AddCollegeWiseScholarshipModelList);
    //   console.log(this.SelectedStudent);

    //   this.CollegeWiseScholarshipService.SaveCollegeWiseScholarshipDetails(this.AddCollegeWiseScholarshipModelList).then((data:any)=>{
    //     console.log(data);
    //     this.CloseModal1();
    //   })
    // }

    async fetchById(){
      try {
        this.loaderService.requestStarted();
        this.CollegeWiseScholarshipService.GetDetailsById(this.SelectedStudent.StudentID).then((data:any)=>{
          this.AddCollegeWiseScholarshipModelList = data.Data;
          
        })
      } catch (error) {
        this.AddCollegeWiseScholarshipModelList = [];
        console.log(error);
      }
      finally{
        setTimeout(() => {
          this.loaderService.requestEnded()
        }, 200);
      }
    }

}
