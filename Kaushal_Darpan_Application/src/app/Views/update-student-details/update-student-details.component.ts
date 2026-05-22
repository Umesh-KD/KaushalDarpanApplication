import { Component, OnInit, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { ITIStudentEnrollmentService } from '../../Services/ITI/ITIstudentenrollment/itistudent-enrollment.service';
import { ItiDataMasterService } from '../../Services/ITI/ITIDataMaster/iti-datamaster.service';
import { BTERStudentDetailsMasterSearchModel, BTERStudentProfileUpdateModel, ITIStudentCorrectionMasterSearchModel } from '../../Models/StudentMasterModels';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadFileModel } from '../../Models/UploadFileModel';
import { DocumentDetailsService } from '../../Common/document-details';
import { AppsettingService } from '../../Common/appsetting.service';
import {StudentdetailUpdateService} from '../../Services/StudentDetailUpdate/studentdetail-update.service'
import { OTPModalComponent } from '../otpmodal/otpmodal.component';

@Component({
    selector: 'update-student-details',
    templateUrl: './update-student-details.component.html',
    styleUrls: ['./update-student-details.component.css'],
    standalone: false
})
export class UpdateStudentDetailComponent implements OnInit {
  public StudentList: any = [];
  public SessionYearList: any = [];
  public InstituteMasterDDLList: any = [];
  public Table_SearchText: string = "";
  public searchRequest = new BTERStudentDetailsMasterSearchModel();
  public requestAction = new BTERStudentProfileUpdateModel();
  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  _EnumRole = EnumRole;
  closeResult: string | undefined;

  // pagination
   pageNo: any = 1;
   pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";
  formAction!: FormGroup;
  public SelectedStudent: any=[];
  public Message: string = '';
  public ErrorMessage: string = '';
  public State: number = 0;

   @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ItiDataMasterService: ItiDataMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2, 
    private Router: Router, 
    private router: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private documentDetailsService: DocumentDetailsService, 
    public appsettingConfig: AppsettingService, 
    private StudentdetailUpdateService:StudentdetailUpdateService,
  ) { }

  async ngOnInit() {
    // this.formAction = this.formBuilder.group(
    //       {
    //         ddlAction: ['', Validators.required],
    //         txtActionRemarks: ['', Validators.required],
    //       })
   this.formAction = this.formBuilder.group({
  nameEn: [{ value: '' }],
  nameHi: [''],
  fatherNameEn: [{ value: ''}],
  fatherNameHi: [''],
  motherNameEn: [{ value: ''}],
  motherNameHi: [''],
  enrollmentNo: [{ value: '', disabled: true }],
  dob: [{ value: ''}],
  mobileNo: [''],
  supportingDocument: [''],
  supportingRemark: [''],
 
});


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    
   
   // this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    await this.GetStudentDetailsList(1);
  
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID',
      'Category','MotherName','HighestQualification','PersonwithDisability','PWDcategory','EconomicWeakerSection',
      'TraineeType','RecordStatus','CollegeName','StudentID', 'IsCollegeSubmitted' ,'MobileNo','EmailID'
    ];

    const columnOrder = [
      'MISITICode','Trade','Shift','Shift','Name','FatherGuardianName','DateOfBirth','Gender','UIDNumber', 
      'MobileNumber','EmailID','StateRegNumber','ErrorDescription'
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
    
    // Create worksheet from filtered data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);

    // Calculate column widths based on max length of content in each column
    const columnWidths = columnOrder.map((column) => ({
      wch:
        Math.max(
          column.length, // Header length
          ...filteredData.map((item: any) =>
            item[column] ? item[column].toString().length : 0
          ) // Max content length
        ) + 2, // Add extra padding
    }));

    // Apply column widths
    ws['!cols'] = columnWidths;

    // Apply header styling (bold + background color)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    if (range.s && range.e) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        const cellAddress = XLSX.utils.encode_col(col) + '1'; // First row (headers)
        if (!ws[cellAddress]) continue;

        // Bold the header text and apply a background color
        ws[cellAddress].s = {
          font: { bold: true, color: { rgb: 'FFFFFF' } }, // Bold text, white color
          fill: { fgColor: { rgb: '#f3f3f3' } }, // Light background color
          alignment: { horizontal: 'center', vertical: 'center' }, // Center-align text
        };
      }
    }

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'StudentListData.xlsx');
  }

  async GetStudentDetailsList(i:any) {
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
      else{
        this.pageNo=i>0?i:1;
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

      // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      // this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      
      // if(this.sSOLoginDataModel.RoleID === EnumRole.Principal_SCVT) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
        this.searchRequest.EngNonEng=this.sSOLoginDataModel.Eng_NonEng

        //this.searchRequest.UIDNumber
        this.searchRequest.action="_GetBTERStudentDetailsList";
      // }
      this.loaderService.requestStarted();
      await this.ItiDataMasterService.GetBTERStudentDetailsList(this.searchRequest).then((data: any) => {
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

    async GetStudentDetailsByID() {
    debugger
    try {

      // this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      // this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      
      // if(this.sSOLoginDataModel.RoleID === EnumRole.Principal_SCVT) {
        this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
        this.searchRequest.EngNonEng=this.sSOLoginDataModel.Eng_NonEng

        //this.searchRequest.UIDNumber
        this.searchRequest.action="GetStudentDetailsBYID";
      // }
      this.loaderService.requestStarted();
      await this.ItiDataMasterService.GetStudentDetailsBYID(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SelectedStudent = data.Data;
        this.requestAction=data.Data[0];
        this.formAction.patchValue({
        nameEn:  this.SelectedStudent[0].StudentName,
        nameHi:  this.SelectedStudent[0].StudentNameHindi,
        fatherNameEn:  this.SelectedStudent[0].FatherName,
        fatherNameHi:  this.SelectedStudent[0].FatherNameHindi,
        motherNameEn:  this.SelectedStudent[0].MotherName,
        motherNameHi:  this.SelectedStudent[0].MotherNameHindi,
        enrollmentNo:  this.SelectedStudent[0].EnrollmentNo,
        dob:  this.SelectedStudent[0].DOB?.substring(0,10),
        mobileNo:  this.SelectedStudent[0].MobileNo,
      //  supportingDocument:  this.SelectedStudent[0].SupportingDoc,
       supportingRemark:  this.SelectedStudent[0].SupportingRemark
      });

      this.requestAction.SupportingDocument=this.SelectedStudent[0].SupportingDoc;
      console.log(this.formAction.value);

        // this.totalRecord=this.StudentList[0]?.TotalRecords;
        // this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        console.log(this.SelectedStudent)
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

    async UploadDocument(event: any) {
      try {
        //upload model
         let uploadModel = new UploadFileModel();
        //uploadModel.FileExtention = item.FileExtention ?? "";
        //uploadModel.MinFileSize = item.MinFileSize ?? "";
       // uploadModel.MaxFileSize = item.MaxFileSize ?? "";
        uploadModel.FolderName = "StudentDetails/";
  
       
        //call
        debugger
        await this.documentDetailsService.UploadDocument(event, uploadModel)
          .then((data: any) => {
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            //
            if (this.State == EnumStatus.Success) {
          
              this.requestAction.SupportingDocument=data.Data[0].FileName;       
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

  openOTP(StudentExamPaperMarksID: number = 0) {
    debugger
    // this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.MobileNo="8334874706"
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      console.log("otp verified on the page")

      this.SaveData()
    })
  }

    async SaveData() {
      debugger
      try {
        // this.isSubmitted = true;
      
        // this.isLoading = true;
  
        this.loaderService.requestStarted();

        console.log(this.requestAction);
  
        
        // this.req.StudentID=this.sSOLoginDataModel.StudentID;
        // this.req.OtherDoc=this.otherdoc;
        // this.req.QualificationList=this.qualificationList;
        // this.req.DepartmentID=this.sSOLoginDataModel.DepartmentID;
        // if(this.isTPO){
        //   this.req.Modifyby = this.sSOLoginDataModel.UserID;
        // }
        // else{
        //   this.req.Modifyby = this.sSOLoginDataModel.StudentID;
        // }
        // this.req.InstituteID=this.sSOLoginDataModel.InstituteID;

        this.requestAction.action="_UpdateStudentDetails";
        this.requestAction.InstituteID=this.sSOLoginDataModel.InstituteID;
        this.requestAction.DepartmentID=this.sSOLoginDataModel.DepartmentID;
        this.requestAction.EngNonEng=this.sSOLoginDataModel.Eng_NonEng;
        this.requestAction.ModifyBy=this.sSOLoginDataModel.UserID;
       
        //save
        // await this.ApplicationService.UpdateStudentQualificationDetails(this.req)
          await this.StudentdetailUpdateService.SaveStudentProfileData(this.requestAction)
          .then(async (data: any) => {
            data = JSON.parse(JSON.stringify(data));
            console.log(data);
  
            if (data.State = EnumStatus.Success) {
              this.toastr.success(data.Message)
              this.CloseModalPopup();
              await this.GetStudentDetailsList(1);
              // this.ResetControls();
              // this.routers.navigate(['/CompanyMaster']);
            }
            else {
              this.toastr.error(data.ErrorMessage)
            }
            //  this.Router.navigateByUrl('/student-additional-qualification');
  
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
  

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';
    // this.searchRequest.Status = '';
    this.searchRequest.InstituteID = 0;
    // this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
    this.searchRequest.PageNumber = this.pageNo;
    this.searchRequest.PageSize = this.pageSize;
    await this.GetStudentDetailsList(1);
  }


  async EditStudentDetails(content: any, ID: number) {
    this.searchRequest.StudentID = ID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    await this.GetStudentDetailsByID();
    // this.requestAction.Action = "0";
    // this.requestAction.ActionRemarks = "";
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

  CloseModalPopup() {
    this.modalService.dismissAll();
  }

  // async DeleteById(ID: number) {
  //   this.Swal2.Confirmation("Do you want to delete?",
  //     async (result: any) => {
  //       //confirmed
  //       if (result.isConfirmed) {
  //         try {
  //           //Show Loading
  //           this.loaderService.requestStarted();

  //           await this.ITIStudentEnrollmentService.DeleteById(ID, this.sSOLoginDataModel.UserID)
  //             .then(async (data: any) => {
  //               data = JSON.parse(JSON.stringify(data));
  //               console.log(data);

  //               if (!data.State) {
  //                 this.toastr.success(data.Message)
  //                 await this.GetStudentDetailsList(1);
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
    this.GetStudentDetailsList(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetStudentDetailsList(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetStudentDetailsList(3)
    }
  }




  // sortData(sortColumn: string) {
  //   this.sortColumn = sortColumn;
  //   this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
  //   // this.GetStudentDetailsList(1);
  // }

}
