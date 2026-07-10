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
import{ ITIStudentRevaluationService } from '../../../Services/ITI/Examination/iti-student-revaluation.service'

// declare function tableToExcel(table: any, name: any, fileName: any): any;
@Component({
    selector: 'excel-operation',
    templateUrl: './excel-operation.component.html',
    styleUrls: ['./excel-operation.component.css'],
    standalone: false
})
export class ExcelOperationComponent implements OnInit {

  // public instituteId:int=0;
  public sSOLoginDataModel = new SSOLoginDataModel();


  public ChunkSize: number = 100;
  public ActionType: string = '0';

  public TradeDDLList: any = [];  
  public ActionList: any = [];  

  isSubmitted:boolean =false;
  closeResult:string | undefined;
  EditDataFormGroup!: FormGroup;


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

    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private Swal2: SweetAlert2, 
    private activatedRoute: ActivatedRoute,
    private ITIStudentRevaluationService:ITIStudentRevaluationService,
  ){}
  async ngOnInit() {
    //throw new Error('Method not implemented.');

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetCommondata();
  }

  //  --------------------------
    public importFile: any;
    public ImportExcelList : any = [];
    public selectedFile: File | null = null;

    onFileChange(event: any): void {
      debugger;
        const file: File = event.target.files[0];
        if (file) {
          this.selectedFile = file;
          // this.ImportExcelFile(file);
        }
        // this.selectedFile = null;
         // Reset file input so selecting the same file again triggers change
        // event.target.value = null;
      }


  // get semestar ddl
  async GetCommondata() {
    debugger
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.ExcelOperationCommon('_getExcelActionddlRoleWise', this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.RoleID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.ActionList = data['Data'];
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

  ImportExcelFile(file: File): void {
    debugger
    this.Swal2.Confirmation("Do you want to Update Status?",
       async (result: any) => {
        //confirmed
         if (result.isConfirmed) {
          try{
            this.loaderService.requestStarted();
            await this.ITIStudentRevaluationService.DynamicUpdateExcelData(file, this.ActionType, this.ChunkSize)
            .then((data: any) => {

              data = JSON.parse(JSON.stringify(data));
              if (data.State === EnumStatus.Success) {
                this.toastr.success(data.Message);               
              }
              else{
                this.toastr.error(data.ErrorMessage);
              }
            });
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
      });
         
  }


}

