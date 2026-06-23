import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CompanyMasterSearchModel, EligibleStudentListMasterSearchModel, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import * as XLSX from 'xlsx';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumRole, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { ITIStudentEnrollmentService } from '../../Services/ITI/ITIstudentenrollment/itistudent-enrollment.service';
import { ItiDataMasterService } from '../../Services/ITI/ITIDataMaster/iti-datamaster.service';
import { ITIStudentCorrectionMasterSearchModel } from '../../Models/StudentMasterModels';
import { ApplyDuplicateDocument, DuplicateDoc_Action, DuplicateDocumentSearch } from '../../Models/BTER/ApplyDuplicateDocDataModel';
import { ApplyDuplicateDocService } from '../../Services/ApplyDuplicateDoc/ApplyDuplicateDoc.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { DownloadMarksheetSearchModel } from '../../Models/DownloadMarksheetDataModel';
import { ReportService } from '../../Services/Report/report.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'duplicate-document',
    templateUrl: './duplicate-document.component.html',
    styleUrls: ['./duplicate-document.component.css'],
    standalone: false
})
export class DuplicateDocumentComponent implements OnInit {
  public StudentList: any = [];
  public SessionYearList: any = [];
  public InstituteMasterDDLList: any = [];
  public Table_SearchText: string = "";
  // public searchRequest = new ITIStudentCorrectionMasterSearchModel();
  public searchRequest = new DuplicateDocumentSearch();
  public requestAction=new DuplicateDoc_Action();
  // public downloadReq = new DownloadMarksheetSearchModel();
  public searchRequestMarksheet = new DownloadMarksheetSearchModel();

  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  _EnumRole = EnumRole;

  // public isIssued:boolean=false;
  public isSubmitted:boolean=false;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  // pagination
   pageNo: any = 1;
   pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  sortColumn: string = "";
  sortOrder: string = "";
  closeResult: string | undefined;
  formAction!: FormGroup;

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ItiDataMasterService: ItiDataMasterService,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2, 
    private Router: Router, 
    private router: ActivatedRoute,
    private applyDuplicateDocService :  ApplyDuplicateDocService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private companyMasterService: CompanyMasterService,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', Validators.required],
        txtActionRemarks: ['', Validators.required],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
   
   // this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID
    await this.GetDuplicateDocInstituteWise(1);
  }
  get FormAction() { return this.formAction.controls; }

  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID',
      'Category','MotherName','HighestQualification','PersonwithDisability','PWDcategory','EconomicWeakerSection',
      'TraineeType','RecordStatus','CollegeName','StudentID', 'IsCollegeSubmitted'
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

  async GetDuplicateDocInstituteWise(i:any) {
   // debugger
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
        this.searchRequest.Eng_NonEng=this.sSOLoginDataModel.Eng_NonEng;
        //this.searchRequest.UIDNumber
        this.searchRequest.action="_GetDocInstituteWise";
      // }
      this.loaderService.requestStarted();
      await this.applyDuplicateDocService.GetDuplicateDocInstituteWise(this.searchRequest).then((data: any) => {
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

  async SaveData_Issuance() {
   // debugger;
    this.isSubmitted = true;

    if (this.formAction.invalid) {
      return
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestAction.ActionBy = this.sSOLoginDataModel.UserID;
    this.requestAction.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.requestAction.EndTermID=this.sSOLoginDataModel.EndTermID;
    this.requestAction.FianancialYearID=this.sSOLoginDataModel.FinancialYearID;
    this.requestAction.CourseTypeID=this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequestMarksheet.RequestEndTerm=this.requestAction.RequestEndTerm;
          
    //this.requestAction.ModifyBy=this.sSOLoginDataModel.UserID;
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.applyDuplicateDocService.Save_DuplicateDocumentAction(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.GetDuplicateDocInstituteWise(1);
          }
          else {
            this.toastr.error(this.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
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
    await this.GetDuplicateDocInstituteWise(1);
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
  //                 await this.GetDuplicateDocInstituteWise(1);
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

  async OnAction(content: any, item: any) {
    //debugger;
    this.requestAction.ID = item.ID;
    this.requestAction.DocumentID=item.Document_ID;
    this.requestAction.StudentID=item.Student_Id;
    this.requestAction.SemesterId=item.Semester_ID;
    this.requestAction.RequestEndTerm=item.RequestEndTerm;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
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

   totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetDuplicateDocInstituteWise(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.StudentList[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetDuplicateDocInstituteWise(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetDuplicateDocInstituteWise(3)
    }



  }


      // ---------------------------------------------------------------------------------------------------------

      async DownloadDuplicateMarksheet(element: any) {
       // debugger;
        try {
          this.searchRequestMarksheet.DepartmentID = this.sSOLoginDataModel.DepartmentID;
          this.searchRequestMarksheet.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
          this.searchRequestMarksheet.EndTermID = this.sSOLoginDataModel.EndTermID;
          this.searchRequestMarksheet.StudentID = element.Student_Id;
          this.searchRequestMarksheet.SemesterID = element.Semester_ID;
          this.searchRequestMarksheet.RequestEndTerm=element.RequestEndTerm;
          
          this.searchRequestMarksheet.ResultTypeID =1// element.ResultTypeID;
          this.searchRequestMarksheet.IsRevised = 0 //element.IsRevised;
          this.searchRequestMarksheet.IsReval = false //element.IsReval;
          this.searchRequestMarksheet.FianancialYearID=this.sSOLoginDataModel.FinancialYearID


          this.loaderService.requestStarted();
    
          await this.reportService.DownloadDuplicateMarksheet(this.searchRequestMarksheet)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              console.log(data, "Data");
              if (data.State == EnumStatus.Success) {
                this.DownloadFile(data.Data);
              }
              else {
                this.toastr.error(data.ErrorMessage)
                //    data.ErrorMessage
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
    
    
      DownloadFile(fileName: string): void {
        const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${fileName}`;
        this.http.get(fileUrl, { responseType: 'blob' }).subscribe(blob => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = this.generateFileName('pdf');
          link.click();
          window.URL.revokeObjectURL(url);
        });
      }
    
      generateFileName(extension: string): string {
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
        return `file_${timestamp}.${extension}`;
      }


  // sortData(sortColumn: string) {
  //   this.sortColumn = sortColumn;
  //   this.sortOrder = this.sortOrder == "" ? "ASC" : (this.sortOrder == "ASC" ? "DESC" : "ASC");
  //   // this.GetDuplicateDocInstituteWise(1);
  // }

}
