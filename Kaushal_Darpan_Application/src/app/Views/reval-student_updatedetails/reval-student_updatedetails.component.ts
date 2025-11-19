import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Counselling_AllotmentDataModel, CounsellingAllotmentListModel } from '../../Models/CounsellingMasterModel';
import { CounsellingMasterService } from '../../Services/CounsellingMaster/counselling-master.service';
import { EncryptionService } from '../../Services/EncryptionService/encryption-service.service';
import { CounsellingApplicationFormService } from '../../Services/CounsellingApplicationForm/counselling-application-form.service';
import { CounsellingApplicationSearchModel } from '../../Models/CounsellingApplicationFormDataModel';
import { EnumStatus } from '../../Common/GlobalConstants';
import { OTPModalComponent } from '../otpmodal/otpmodal.component';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { ITIRevalRequestStudentDetailsModel } from '../../Models/RevaluationModel';
// import { ITIStudentRevaluationService } from '../../Services/ITIStudentRevaluation/iti-student-revaluation.service';
 import { ITIStudentRevaluationService } from '../../Services/ITI/Examination/iti-student-revaluation.service';
import { DocumentDetailsService } from '../../Common/document-details';
import { UploadBTERFileModel, UploadFileModel } from '../../Models/UploadFileModel';
import { AppsettingService } from '../../Common/appsetting.service';
import { DeleteDocumentDetailsModel } from '../../Models/DeleteDocumentDetailsModel';

// declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
    selector: 'reval-student_updatedetails',
    templateUrl: './reval-student_updatedetails.component.html',
    styleUrls: ['./reval-student_updatedetails.component.css'],
    standalone: false
})
export class RevalStudentUpdateDetailsComponent implements OnInit {
     designations = GlobalConstants.designationList; // Access the designations constant
  
  public searchRequest = new ITIRevalRequestStudentDetailsModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public unlockRequest = new CounsellingApplicationSearchModel();
  public allotmentSaveRequest = new Counselling_AllotmentDataModel();
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  public StudentList: any = [];
  public StudentOptionList: any = [];
  public StudentOptionListToExport: any = [];
  public Table_SearchText: string = "";
  public AllSelect: boolean = false;
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
  public Designation: string = '';

  public TradeDDLList: any = [];

  

  modalRef1: NgbModalRef | null=null;
  isSubmitted:boolean =false;
  closeResult:string | undefined;

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


  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';

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
    private commonFunctionService: CommonFunctionService,
    private ITIStudentRevaluationService:ITIStudentRevaluationService,
    private documentDetailsService: DocumentDetailsService, 
    public appsettingConfig: AppsettingService,
  ){}

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    // this.searchRequest.TradeID=
    // if (this.activatedRoute.snapshot.queryParamMap.get('Id') != null) {
    //   if(this.searchRequest.TradeID==0){
    //     this.TradeID = Number(this.activatedRoute.snapshot.queryParamMap.get('Id')?.toString());
    //   }
     
    // }

    // await this.getcandidateOptionList();
    // await this.GetTradeDDL();
    await this.GetCandidateList(1);
    // await this.GetCategoryMatserDDL()
       
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
      //this.searchRequest.TradeID=this.searchRequest.TradeID>0?this.searchRequest.TradeID:this.TradeID;
      this.searchRequest.action="_getAllRevalStudentDetails"
      this.loaderService.requestStarted();
      await this.ITIStudentRevaluationService.GetAllRevalRequestDetails(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StudentList = data.Data;

        this.totalRecord=this.StudentList[0]?.TotalRecords;
        this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
        this.loadInTable();
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
    this.routers.navigate(['/RevalStudentDetails'])
  }


    checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.StudentList) {
      item.Marked = this.AllSelect;
    }
  }

  // get all data
  async ClearSearchData() {
    // this.searchRequest.Name = '';
    // this.searchRequest.Enrollment = '';
    // this.searchRequest.Category='';
    // this.searchRequest.Status = '';
    this.searchRequest.Name='';
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



  async EditData(content: any, rowData?: any) {
    this.isSubmitted = true;
    this.SelectedStudent = rowData;
    
    this.modalRef1 = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef1.result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    debugger
    if (rowData != null && rowData != undefined) {
      try {

        this.searchRequest.PageNumber=this.pageNo
        this.searchRequest.PageSize=this.pageSize
        this.searchRequest.SortColumn=this.sortColumn
        this.searchRequest.SortOrder=this.sortOrder 
        this.searchRequest.RevalReqID=rowData.RevalRequestID
        // if(rowData.StudentID>0)
        // {
        //   this.searchRequest.StudentID=rowData.CandidateID
        // }
        // else{
        //   this.searchRequest.StudentID=0
        // }
        
        this.searchRequest.action="_getRevalDetailsbyRevalReqID"
        // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
        //   this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
        //   this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
        //   this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
        //   console.log(this.searchRequest.Category);
        this.loaderService.requestStarted();
        await this.ITIStudentRevaluationService.GetAllRevalRequestDetails(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentOptionList = data.Data;
          console.log(this.StudentList,"studetn")
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



  async UploadDocument(event: any, item: any) {
    try {
      //upload model
       let uploadModel = new UploadFileModel();
      //uploadModel.FileExtention = item.FileExtention ?? "";
      //uploadModel.MinFileSize = item.MinFileSize ?? "";
     // uploadModel.MaxFileSize = item.MaxFileSize ?? "";
      uploadModel.FolderName = "ITI/RevalDocument/";

     
      //call
      debugger
      await this.documentDetailsService.UploadDocument(event, uploadModel)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //
          if (this.State == EnumStatus.Success) {
            //add/update document in js list
           // const index = this.StudentOptionList.findIndex((x: any) => x.RequestSubjectID == item.RequestSubjectID && x.StudentExamPaperMarksID == item.StudentExamPaperMarksID);
            //if (index !== -1) {

            item.UploadedCopy=data.Data[0].FileName;
              //this.StudentOptionList[index].UploadedCopy = data.Data[0].FileName;
              // this.DocumentList[index].Dis_FileName = data.Data[0].Dis_FileName;
              // this.DocumentList[index].OldFileName = data.Data[0].OldFileName;
           // }
            console.log(this.StudentOptionList)
            //reset file type
            event.target.value = null;
          }
          if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage)
          }
          else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)
          }
        });
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async AddRemark(event:any,item:any){
    debugger;
      item.Remarks=event.target.value;
  }

// Optional: delete the uploaded file
// DeleteDocument(item: any) {
  
//    this.StudentOptionList = this.StudentOptionList.map((row:any) => {
//     if (row.RequestSubjectID === item.RequestSubjectID && row.StudentExamPaperMarksID === item.StudentExamPaperMarksID) {
//       return {
//         ...row,
//         UploadedCopy: null
//       };
//     }
//     return row;
//   });

//    console.log('Updated StudentOptionList:', this.StudentOptionList);

// }

async SaveUpload_Details (){
debugger
    try{
         this.loaderService.requestStarted();
          
          let obj=new ITIRevalRequestStudentDetailsModel();
          obj.StudentOptionList=this.StudentOptionList;
          obj.ActionBy=this.sSOLoginDataModel.UserID;
          obj.RevalReqID=this.StudentOptionList[0].RevalRequestID;
          await this.ITIStudentRevaluationService.UploadDocument(obj).then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State = EnumStatus.Success) {
              this.toastr.success(this.Message)
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
            this.CloseModal1();
            console.log(this.StudentOptionList)
        }, (error: any) => console.error(error))
    }
    catch (Ex) {
      console.log(Ex);
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



  async redirectToEdit(row: any) {
    this.routers.navigate(['edit-counselling-candidate-form'],{
      queryParams: { AppID: this.encryptionService.encryptData(row.CandidateID) }
    });
  }
  async redirectToPreview(row: any) {
    this.routers.navigate(['/candidate-details'],{
      queryParams: { AppID: this.encryptionService.encryptData(row.CandidateID) }
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

  // end table feature




     //async DeleteDocument(item: any) {
     //  try {
     //    // delete from server folder
     //    let deleteModel = new DeleteDocumentDetailsModel()
     //    deleteModel.FolderName = item.FolderName ?? "";
     //    deleteModel.FileName = item.FileName;
     //    //call
     //    await this.documentDetailsService.DeleteDocument(deleteModel)
     //      .then((data: any) => {
     //        this.State = data['State'];
     //        this.Message = data['Message'];
     //        this.ErrorMessage = data['ErrorMessage'];
     //        if (data.State != EnumStatus.Error) {
     //          //add/update document in js list
     //          const index = this.DocumentList.findIndex((x: any) => x.DocumentMasterID == item.DocumentMasterID && x.DocumentDetailsID == item.DocumentDetailsID);
     //          if (index !== -1) {
     //            this.DocumentList[index].FileName = '';
     //            this.DocumentList[index].Dis_FileName = '';
     //          }
     //          console.log(this.DocumentList)
     //        }
     //        if (this.State == EnumStatus.Error) {
     //          this.toastrService.error(this.ErrorMessage)
     //        }
     //      });
     //  }
     //  catch (Ex) {
     //    console.log(Ex);
     //  }
     //}

}
