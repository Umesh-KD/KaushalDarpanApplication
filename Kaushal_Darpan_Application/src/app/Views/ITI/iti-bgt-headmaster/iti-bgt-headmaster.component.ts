import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Renderer2, signal, ViewChild } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { AppsettingService } from "../../../Common/appsetting.service";
import { EnumDepartment, EnumStatus, GlobalConstants } from "../../../Common/GlobalConstants";

import { DocumentDetailsModel } from "../../../Models/DocumentDetailsModel";
import { PreviewApplicationModel } from "../../../Models/PreviewApplicationformModel";
import { ItiApplicationFormService } from "../../../Services/ItiApplicationForm/iti-application-form.service";
import { LoaderService } from "../../../Services/Loader/loader.service";
import { ReportService } from "../../../Services/Report/report.service";
import { CommonFunctionService } from "../../../Services/CommonFunction/common-function.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { of } from "rxjs";
import { jsPDF } from 'jspdf';
import { ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ItiApplicationSearchmodel } from "../../../Models/ItiApplicationPreviewDataModel";
import { DropdownValidators } from "../../../Services/CustomValidators/custom-validators.service";
import { ITIStateTradeCertificateSearchModel } from "../../../Models/TheoryMarksDataModels";
import { ITICollegeStudentMarksheetSearchModel } from "../../../Models/ITI/ITICollegeStudentMarksheetSearchModel";
import { StudentMarksheetSearchModel } from "../../../Models/OnlineMarkingReportDataModel";

import { FontsService } from "../../../Services/FontService/fonts.service";
import { ITI_InstructorService } from "../../../Services/ITI/ITI_Instructor/ITI_Instructor.Service";
import { ITI_InstructorDataModel, ITI_InstructorDataSearchModel } from "../../../Models/ITI/ItiInstructorDataModel";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ITI_BGT_HeadMasterDataModel } from "../../../Models/ITI/ItiBGTHeadMasterDataModel";
import { ITI_BGTHeadmasterService } from "../../../Services/ITI/ITI_BGT_Headmaster/ITI_BGTHeadmaster.Service";
@Component({
  selector: 'app-marksheet',
  standalone: false,
  templateUrl: './iti-bgt-headmaster.component.html',
  styleUrl: './iti-bgt-headmaster.component.css'
})
export class ItiBGTHeadmasterComponent{
  

  public searchrequest = new ItiApplicationSearchmodel();
  public searchRequestConsolidated = new ITIStateTradeCertificateSearchModel();

  sSOLoginDataModel: any;
  searchForm!: FormGroup;
  public InstructorSearch = new ITI_InstructorDataSearchModel();

  tooltipText = signal(''); 
  StudentExamsPapersList: any = [];
  // STUFFPapersList : any = [];
  // public StudentDetails: any[] = [];
  @ViewChild('pdfTable', { static: false }) pdfTable!: ElementRef;
  
  // public MarksheetSearch1 = new StudentMarksheetSearchModel();
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public GetInstructorDataList: any[] = [];
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
  public Table_SearchText: string = "";
  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;

  public BGTHeadForm!: FormGroup;
  public isSubmitted:boolean=false;
  public isLoading:boolean=false;
  public request = new ITI_BGT_HeadMasterDataModel()


  collegeDropDown: any = [];
  districtDropDown: any = [];

  modalReference: NgbModalRef | undefined;


  constructor(
    private formBuilder:FormBuilder,
    private loaderService: LoaderService,
    private ApplicationService: ItiApplicationFormService,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private fb: FormBuilder,
    private reportService: ReportService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    private fontsService : FontsService,
    private ItiBGTHeadmasterServices: ITI_BGTHeadmasterService,
    private modalService: NgbModal,
  ) 
  {
    this.sSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log(this.sSOLoginDataModel);
  }
  // ngAfterViewInit() {
  //   this.cdr.detectChanges(); // Make sure the DOM is ready
  // }


  async ngOnInit() {
    this.BGTHeadForm=this.formBuilder.group({
      HeadId: ['0'],
      HeadName: ['', Validators.required],
      HeadCode: ['', Validators.required],
      HeadDescription: [''],
    })
      // console.log("im in")
    this.searchForm = this.fb.group({
      Name: [''],
      Uid: [''],
    });
    this.InstructorSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.InstructorSearch.Uid = '';
    this.InstructorSearch.Name = '';
  
  //  await this.GetItiInstructorData();
  await this.getBGTHeadmasterData();

  } 


  async getBGTHeadmasterData() {
    this.loaderService.requestStarted();
    this.ItiBGTHeadmasterServices.GetBGTHeadmasterData()
      .then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        data = JSON.parse(JSON.stringify(data));
        if (data && data.Data) {
          if(Object.keys(data).includes('Data')){
            this.GetInstructorDataList = data['Data'];
          }
          else{
            this.GetInstructorDataList = [data];
          }
          this.loadInTable();
          console.log(data);
        } else {
          this.toastr.error(this.Message)
        }
      }, (error: any) => {
        console.error(error);
        this.toastr.error(this.ErrorMessage)
      });
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
    
  }



  get _BGTHeadForm() { return this.BGTHeadForm.controls; }



  async onSubmit() {
    
    this.isSubmitted = true;
    if (this.searchForm.invalid) {
      console.log(this.searchForm.value)
      return
    }
  }


  async saveData() {
    this.isLoading = true;
  }
  

  // async GetItiInstructorData() {
  //   // debugger
  //   try {

  //     this.loaderService.requestStarted();
  //     debugger
  //     // if(this.sSOLoginDataModel.RoleID === 16){  // Admin Role
  //       this.InstructorSearch.roleID = this.sSOLoginDataModel.RoleID;
  //       // this.InstructorSearch.roleID =17;
  //     // }
  //     // else{
  //     //   this.InstructorSearch.roleID = 0;
  //     // }
     
  //     this.InstructorSearch.InstituteID=this.sSOLoginDataModel.InstituteID;
  //     await this.ItiInstructorService.GetInstructorData(this.InstructorSearch)
  //       .then((data: any) => {
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         data = JSON.parse(JSON.stringify(data));
  //         if (data && data.Data) {
  //             if(Object.keys(data).includes('Data')){
  //               this.GetInstructorDataList = data['Data'];
  //             }
  //             else{
  //               this.GetInstructorDataList = [data];
  //             }
          
  //           console.log(data);
            
  //         } else {
  //           this.toastr.error(this.Message)
  //         }
  //       }, (error: any) => {
  //         console.error(error);
  //         this.toastr.error(this.ErrorMessage)
  //       });

  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  //  async deleteInstructorDataByID( id:number) {
  //   // debugger
  //   try {

  //     this.loaderService.requestStarted();
      
     
  //     await this.ItiInstructorService.deleteInstructorDataByID(id)
  //       .then((data: any) => {
  //         this.State = data['State'];
  //         this.Message = data['Message'];
  //         this.ErrorMessage = data['ErrorMessage'];
  //         data = JSON.parse(JSON.stringify(data));

  //         if (data && data.Data) {
  //             this.ngOnInit();
  //             if(Object.keys(data).includes('Data')){
  //               this.GetInstructorDataList = data['Data'];
  //             }
  //             else{
  //               this.GetInstructorDataList = [data];
  //             }
          
  //           console.log(data);
            
  //         } else {
  //           this.toastr.error(this.Message)
  //         }
  //       }, (error: any) => {
  //         console.error(error);
  //         this.toastr.error(this.ErrorMessage)
  //       });

  //   } catch (Ex) {
  //     console.log(Ex);
  //   } finally {
  //     setTimeout(() => {
  //       this.loaderService.requestEnded();
  //     }, 200);
  //   }
  // }

  // async addBGTHeadmaster1() {
  //   if (!this.AppointExaminer.ExaminerCode) {
  //     this.toastr.error("Please Fill Examiner code");
  //     return;
  //   }

  //   // Set common values
  //   this.AppointExaminer.IsAppointed = true;
  //   this.AppointExaminer.ActiveStatus = true;
  //   this.AppointExaminer.DeleteStatus = false;
  //   this.AppointExaminer.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //   this.AppointExaminer.ModifyBy = this.sSOLoginDataModel.UserID;
  //   this.AppointExaminer.CourseType = this.sSOLoginDataModel.Eng_NonEng;
  //   this.AppointExaminer.EndTermID = this.sSOLoginDataModel.EndTermID;

  //   const saveExaminer = async () => {
  //     try {
  //       this.loaderService.requestStarted();
  //       const data: any = await this.examinerservice.SaveExaminerData(this.AppointExaminer);
  //       this.State = data.State;
  //       this.Message = data.Message;
  //       this.ErrorMessage = data.ErrorMessage;

  //       if (this.State === EnumStatus.Success) {
  //         this.toastr.success(this.Message);
  //         this.AppointExaminer = new ExaminerDataModel();
  //         this.getStaffForExaminerData();
  //         this.CloseModalPopup();
  //       } else {
  //         this.toastr.error(this.ErrorMessage);
  //       }
  //     } catch (error) {
  //       console.error("Error saving examiner data:", error);
  //     } finally {
  //       setTimeout(() => {
  //         this.loaderService.requestEnded();
  //       }, 200);
  //     }
  //   };

  //   if (!this.AppointExaminer.AssignGroupCode || this.AppointExaminer.AssignGroupCode=='()') {
  //     await saveExaminer();
  //   } else {
  //     this.Swal2.Confirmation(`This teacher is already assigned this Group Code ${this.AppointExaminer.AssignGroupCode},Select Yes If You want to Assign more Group Code!`, async (result: any) => {
  //       if (result.isConfirmed) {
  //         await saveExaminer();
  //       }
  //     });
  //   }
  // }


  async addBGTHeadmaster() {


    console.log('Form submitted:addBGTHeadmaster', this.BGTHeadForm.value);
    this.isLoading = true;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.BGTHeadForm.valid) {
        // Handle form submission logic here

        // debugger;
        console.log('Form submitted successfully:', this.BGTHeadForm.value);
        // this.request.CopyPacket = this.RelievingPracticalForm.value.CopyPacket === 'Yes' ? true : false;
        // this.request.Uid = this.InstructorForm.value.Uid;

        this.request = this.BGTHeadForm.value as ITI_BGT_HeadMasterDataModel;
        
        console.log('Form Submitted:request', this.request);
        this.request.CreatedBy = this.sSOLoginDataModel.UserID.toString();

        await this.ItiBGTHeadmasterServices.SaveBGTHeadmasterData(this.request)
          .then((response: any) => {
            this.State = response['State'];
            this.Message = response['Message'];
            this.ErrorMessage = response['ErrorMessage'];

            if (this.State == EnumStatus.Success)
            {
              this.toastr.success(this.Message);
              this.CloseModalPopup();
              this.ngOnInit();
              // setTimeout(() => {
                // this.router.navigate(['/PracticalExaminerRelieving']);
              // }, 300);
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
            console.log('Response from service:', response);
          });
        console.log('Request Data:', this.request);
      } else {
        console.log('Form is invalid');
        this.BGTHeadForm.markAllAsTouched();
      }
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

  }



    async ViewandUpdate(content: any, id : number = 0) {

    //const initialState = {
    //  UserID: UserID,
    //  Type: "Admin",
    //};

    // await this.GetByID(UserID, StaffSubjectId)

    /*  alert(  this.AppointExaminer.InstituteID)*/
    //try {
    //  await this.staffMasterService.GetByID(UserID)
    //    .then((data: any) => {
    //      data = JSON.parse(JSON.stringify(data));
    //      console.log(data);

    //      /*this.request.UserID = data['Data']["RoleID"];*/
    //      //this.request.UserID = data['Data']["UserID"];
    //      //this.request.SSOID = data['Data']["SSOID"];
    //    }, error => console.error(error));
    //}
    //catch (ex) { console.log(ex) }
    //finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}


    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    if(id > 0) {
      try {
        this.loaderService.requestStarted();
        const data: any = await this.ItiBGTHeadmasterServices.GetBGTHeadmasterDataByID(id);
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State === EnumStatus.Success) {
          this.BGTHeadForm.patchValue(data['Data'][0]);
          console.log('Data fetched successfully:', data['Data'][0]);
        } else {
          this.toastr.error(this.ErrorMessage);
        }
      } catch (error) {
        console.error("Error fetching BGT Headmaster data:", error);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }
    /*  this.modalReference.componentInstance.initialState = initialState;*/

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
  }

  CloseModalPopup() {
    this.modalService.dismissAll();
    // this.AppointExaminer = new ExaminerDataModel();
  }


  loadInTable() {
    this.resetInTableValiable();
    this.calculateInTableTotalPage();
    this.updateInTablePaginatedData();
  }


  //table feature 
  calculateInTableTotalPage() {
    this.totalInTablePage = Math.ceil(this.totalInTableRecord / parseInt(this.pageInTableSize));
  }
  // (replace org. list here)
  updateInTablePaginatedData() {
    this.loaderService.requestStarted();
    this.startInTableIndex = (this.currentInTablePage - 1) * parseInt(this.pageInTableSize);
    this.endInTableIndex = this.startInTableIndex + parseInt(this.pageInTableSize);
    this.endInTableIndex = this.endInTableIndex > this.totalInTableRecord ? this.totalInTableRecord : this.endInTableIndex;
    this.paginatedInTableData = [...this.GetInstructorDataList].slice(this.startInTableIndex, this.endInTableIndex);
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

  resetInTableValiable() {
    this.paginatedInTableData = [];//copy of main data
    this.currentInTablePage = 1;
    this.totalInTablePage = 0;
    this.sortInTableColumn = '';
    this.sortInTableDirection = 'asc';
    this.startInTableIndex = 0;
    this.endInTableIndex = 0;
    this.totalInTableRecord = this.GetInstructorDataList.length;
  }



  async searchbtn_click() {
    // debugger
    this.InstructorSearch.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.InstructorSearch.Uid = this.searchForm.value.Uid;
    this.InstructorSearch.Name = this.searchForm.value.Name;
  
    // await this.GetItiInstructorData();
  //  this.MarksheetSearch.CollegeCode = this.searchForm.value.collegeCode;
  //  this.MarksheetSearch.DistrictID = this.searchForm.value.districtID;
  //  this.MarksheetSearch.InstituteID = this.searchForm.value.collegeID;
  //  this.GetITICollegeStudent_Marksheet();
  }





}

