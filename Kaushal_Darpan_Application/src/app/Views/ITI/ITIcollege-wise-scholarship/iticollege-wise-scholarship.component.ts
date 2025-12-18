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
import { AddITICollegeWiseScholarshipModel, ITICollegeWiseScholarshipSearchModel } from '../../../Models/ITICollegeWiseScholarshipModel';
import { ITICollegeWiseScholarshipService } from '../../../Services/ITICollegeWiseScholarship/iticollege-wise-scholarship.service';
import { EnumRole } from '../../../Common/GlobalConstants';
@Component({
    selector: 'iticollege-wise-scholarship',
    templateUrl: './iticollege-wise-scholarship.component.html',
    styleUrls: ['./iticollege-wise-scholarship.component.css'],
    standalone: false
})
export class ITICollegeWiseScholarshipComponent implements OnInit {
  public StudentList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new ITICollegeWiseScholarshipSearchModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public isShowdrop: boolean=false
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
  AddCollegeWiseScholarshipModelList: AddITICollegeWiseScholarshipModel[]=[];

  AddCollegeWiseScholarshipModel =new AddITICollegeWiseScholarshipModel();

  //AddCollegeWiseScholarshipModelList2: any =[];
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

  public StreamMasterList:any=[]
  public InstituteMasterList:any=[]

SelectedStudent:any = {};



  constructor(private commonMasterService: CommonFunctionService, private CollegeWiseScholarshipService: ITICollegeWiseScholarshipService,
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

    await this.GetMasterData()
    await this.StreamMaster()

    if (this.sSOLoginDataModel.RoleID == 20 || this.sSOLoginDataModel.RoleID == 43 ) {
      this.isShowdrop = true;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID

    } else {
      this.isShowdrop = false;

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


    AddToList() {
      debugger
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
        alert('Already got scholarship !');
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
      newItem.ScholarshipMode='Mannual';

      const selectedScholarship = this.scholarshipTypes.find((x:any) => x.id === newItem.ScholarShipTypeID)?.name ?? '';
      const selectedScheme = this.schemeTypes.find((x:any) => x.id === newItem.SchemeID)?.name ?? '';
      // const selectedScheme = this.scholarshipTypes.find(x => x.id === newItem.ScholarShipTypeID)?.name ?? '';
      newItem.SchemeName=selectedScheme;
      newItem.ScholarShipTypeName=selectedScholarship;
    
      this.AddCollegeWiseScholarshipModelList.push(newItem);
      //  this.AddCollegeWiseScholarshipModelList2.push(newItem);
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

      this.searchRequest.PageNumber=this.pageNo
      this.searchRequest.PageSize=this.pageSize
      this.searchRequest.SortColumn=this.sortColumn
      this.searchRequest.SortOrder=this.sortOrder 
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
        this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
        this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  /*      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;*/
        console.log(this.searchRequest.Category);
      this.loaderService.requestStarted();
      await this.CollegeWiseScholarshipService.GetCollegeWiseScholarshipList(this.searchRequest).then((data: any) => {
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


    DeleteFromList(index:any){
      debugger;
      this.Swal2.Confirmation("Do you want to delete?",

      async (result: any) => {
        //confirmed 
        if (result.isConfirmed) {
          this.AddCollegeWiseScholarshipModelList.splice(index, 1);
          //this.AddCollegeWiseScholarshipModelList2[index].ActiveStatus=false;
          //this.AddCollegeWiseScholarshipModelList2[index].DeleteStatus=true;
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

    SaveData_EditDetails(){
      console.log(this.AddCollegeWiseScholarshipModelList);
      console.log(this.SelectedStudent);

      this.CollegeWiseScholarshipService.SaveCollegeWiseScholarshipDetails(this.AddCollegeWiseScholarshipModelList).then((data:any)=>{
        console.log(data);
        this.CloseModal1();
      })
    }

    async fetchById(){
      try {
        this.loaderService.requestStarted();
        this.CollegeWiseScholarshipService.GetDetailsById(this.SelectedStudent.StudentID).then((data:any)=>{
          this.AddCollegeWiseScholarshipModelList = data.Data;
         // this.AddCollegeWiseScholarshipModelList2 =this.AddCollegeWiseScholarshipModelList ;
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


  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
     
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (this.sSOLoginDataModel.RoleID == EnumRole.Principal) {
            this.InstituteMasterList = data['Data'];
            this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
            this.InstituteMasterList = this.InstituteMasterList.filter((x: any) => { return x.InstituteID == this.searchRequest.InstituteID });
            //console.log(this.sSOLoginDataModel.InstituteID,'ss1')
            //console.log(this.InstituteMasterList,'ss2')
          } else {
            this.InstituteMasterList = data['Data'];
            this.searchRequest.InstituteID = 0
          }
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

  async StreamMaster() {
    const MasterCode = "Lateral_Trade";
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.StreamMasterList = parsedData.Data;
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}
