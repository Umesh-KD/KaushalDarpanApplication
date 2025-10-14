import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../../Services/CompanyMaster/company-master.service.ts';
import { CollegeWiseScholarshipService } from '../../../Services/CollegeWiseScholarship/college-wise-scholarship.service';
import { CounsellingMasterService } from '../../../Services/CounsellingMaster/counselling-master.service';
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
import { GlobalConstants } from '../../../Common/GlobalConstants';


@Component({
    selector: 'counselling-allotment-list',
    templateUrl: './counselling-allotment-list.component.html',
    styleUrls: ['./counselling-allotment-list.component.css'],
    standalone: false
})
export class CounsellingAllotmentListComponent implements OnInit {
   designations = GlobalConstants.designationList; // Access the designations constant

  
  public StudentList: any = [];
  public Table_SearchText: string = "";
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
    private commonFunctionService: CommonFunctionService,
  ){
    
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  
      this.EditDataFormGroup = this.fb.group({
        SchemeID: ['', Validators.required],
        ScholarshipType: ['', Validators.required],
        Amount: [''] , // will validate only if Cash is selected
        ScholarshipDate: ['', Validators.required]   // 👈 new field
      });
 
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
  //  await this.GetTradeDDL();
    await this.GetCounsellingAllotmentList(1);
       
  }


    getTradeByDegree(designationId:number) {
                console.log(designationId)

    
    try {
      this.loaderService.requestStarted(); 
        this.commonFunctionService.ItiTradecouncelling(designationId).then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.TradeDDLList = data['Data'];  
          console.log('TradeDDLList',this.TradeDDLList);
          
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

  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)
      //await this.commonFunctionService.StreamMaster()
      await this.commonFunctionService.ItiTrade(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID, this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          //this.TradeDDLList = data['Data'];
          //console.log(this.TradeDDLList)
          // const selectOption = { ID: -1, Name: '--Select--' };
          // this.TradeDDLList = [selectOption, ...data['Data']];  
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



    AddToList() {
      
      this.isSubmitted = true;
      if (this.EditDataFormGroup.invalid) return;
      // if(this.availSectionData.length>0){
      //    let existAssignedTeacherData=this.availSectionData.map(x=>x.AssignTeacherSectionID=this.AddStaffSubjectSectionModel.StaffID && x.SemesterID==this.AddStaffSubjectSectionModel.SemesterID && x.StreamID==this.AddStaffSubjectSectionModel.StreamID);
      //    if(existAssignedTeacherData){
      //     this.toastr.warning("This Teacher Already Assigned For This Stream And Semester");
      //     return;
      //    }
      // }

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
      // const selectedScheme = this.schemeTypes.find(x => x.id === newItem.SchemeID);
  
      // Save as CSV
      // newItem.SectionIDs = (formValue.SectionID || []).join(',');
  
  
  
      // newItem.StreamName = this.StreamMasterDDL.find((x: any) => x.StreamID == newItem.StreamID)?.StreamName || "";
      // newItem.SemesterName = this.SemesterMasterDDL.find((x: any) => x.SemesterID == newItem.SemesterID)?.SemesterName || "";
      // newItem.SubjectName = this.SubjectMasterDDL.find((x: any) => x.ID == newItem.SubjectID)?.Name || "";
      // newItem.SatffName = this.ApprovedTeacherList.find((x: any) => x.StaffID == newItem.StaffID)?.Name || "";
      // newItem.SectionsName = this.GetSectionData.filter(x => (formValue.SectionID || []).includes(x.SectionID)).map(x => x.SectionName).join(', ');
  
  
  
      //newItem.SemesterName = "";
      //newItem.StreamName = "";
      //newItem.SubjectName = "";
      //newItem.SatffName = "";
      //newItem.SectionsName = "";
      // this.AddStaffSubjectSectionModel.RoleID = this.sSOLoginDataModel.RoleID;
      // this.AddStaffSubjectSectionModel.EndTermID = this.sSOLoginDataModel.EndTermID;
      // this.AddStaffSubjectSectionModel.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.AddCollegeWiseScholarshipModelList.push(newItem);
      // this.AddCollegeWiseScholarshipModelList2=this.AddCollegeWiseScholarshipModelList;
      // remove used sections from dropdown
      // this.refreshAvailableSections1(this.AddStaffSubjectSectionModel.SubjectID);
      // this.refreshAvailableSections();
      this.EditDataFormGroup.reset();
      // this.AddStaffSubjectSectionModel = new AddStaffSubjectSectionModel();
      // this.AddStaffSubjectSectionModel.SemesterID = this.oldSemesterID;
      // this.AddStaffSubjectSectionModel.StreamID = this.oldStreamID;
  
      // reset form
      //this.EditDataFormGroup.reset({
      //  SubjectID: 0,
      //  UserID: 0,
      //  SectionID: []
      //});
  
      this.isSubmitted = false;
  
  
    }

  async GetCounsellingAllotmentList(i:any) {
    
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
      this.searchRequest.TradeID=this.searchRequest.TradeID>0?this.searchRequest.TradeID:0
      // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      //   this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      //   this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      //   console.log(this.searchRequest.Category);
      this.loaderService.requestStarted();
      await this.CounsellingMasterService.GetCounsellingAllotmentList(this.searchRequest).then((data: any) => {
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



  // get all data
  async ClearSearchData() {
    
    // this.searchRequest.Name = '';
    // this.searchRequest.Enrollment = '';
    // this.searchRequest.Category='';
    // this.searchRequest.Status = '';
    this.searchRequest.TradeID=0;
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize;
    await this.GetCounsellingAllotmentList(1);
  }


  // pagination start

   totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetCounsellingAllotmentList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetCounsellingAllotmentList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetCounsellingAllotmentList(3)
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
  //   // this.GetCounsellingAllotmentList(1);
  // }


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


}
