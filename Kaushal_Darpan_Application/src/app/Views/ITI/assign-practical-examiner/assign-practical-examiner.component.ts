import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { CenterAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { VerifyRollNumberList } from '../../../Models/GenerateRollDataModels';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { ITICenterAllocationtDataModels } from '../../../Models/ITI/ITICenterAllocationDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ItiAssignExaminerService } from '../../../Services/ITIAssignExaminer/iti-assign-examiner.service';
import {  ItiAssignExaminerSearchModel, ITIExaminerDataModelSearchFilters } from '../../../Models/ITI/AssignExaminerDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';

@Component({
  selector: 'app-assign-practical-examiner',
  standalone: false,
  templateUrl: './assign-practical-examiner.component.html',
  styleUrl: './assign-practical-examiner.component.css'
})
export class AssignPracticalExaminerComponent {
  commonMasterService = inject(CommonFunctionService);

  Swal2 = inject(SweetAlert2);
  assignexaminerservice = inject(ItiAssignExaminerService);
  ActivatedRoute = inject(ActivatedRoute);
  public requestSSoApi = new CommonVerifierApiDataModel();
 public Isverifed :boolean=false
  toastr = inject(ToastrService);
  reportservice = inject(ReportService);
  loaderService = inject(LoaderService);
  modalService = inject(NgbModal);
  centerAllocationService = inject(ITICenterAllocationService);
  http = inject(HttpClient);
  appsettingConfig = inject(AppsettingService);
  @ViewChild('content') content: ElementRef | any;
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  assignedInstitutes: any = [];
  assignedInstitutesReady: boolean = false;
  closeResult: string | undefined;
  Table_SearchText: string = '';
  AssignExaminerMasterList: any[] = [];
  BackupCenterMasterList: any[] = [];
  searchRequest = new ItiAssignExaminerSearchModel();
  searchRequestExam = new ITIExaminerDataModelSearchFilters();
  public CourseType:number=0
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  request = new ITIAssignPracticaLExaminer();
  sSOLoginDataModel = new SSOLoginDataModel();

  SelectCenterMaster: any;
  GetStatusCenterSuperintendentData: any;UserID: number = 0;
  Status: number = 0
  PublishFileName: string = ''
  StudentExamReportList: any = [];
  totalRecord: any = 0;
  TotalPages: any = 0;
  pageSize: any = 50;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(...args: unknown[]);
  constructor() { }
  _EnumRole = EnumRole;
  async ngOnInit() {

    this.CourseType = Number(this.ActivatedRoute.snapshot.queryParamMap.get('id')?.toString())

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.CourseTypeID = this.CourseType;
   
    /*   this.GetStatusCenterSuperintendent();*/
    await this.GetAssignexaminer();

  }

  async GetAssignexaminer() {
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.CourseType
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID

    try {
      this.loaderService.requestStarted();
      await this.assignexaminerservice.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssignExaminerMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.AssignExaminerMasterList];
          console.log(data['Data'])
          this.Status = data['Data'][0]['Status']
          this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  onSearchClick() {
    const searchCriteria: any = {
      CCCode: this.searchByCenterCode ? this.searchByCenterCode.trim().toLowerCase() : '',
      CenterName: this.searchByCenterName.trim().toLowerCase(),
    };
    this.AssignExaminerMasterList = this.BackupCenterMasterList.filter((center: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }

        const centerValue = center[key];

        // Handle number comparison by converting to string
        if (typeof centerValue === 'number') {
          return centerValue.toString().toLowerCase().includes(searchValue);
        }

        if (typeof centerValue === 'string') {
          return centerValue.toLowerCase().includes(searchValue);
        }

        return centerValue === searchValue;
      });
    });
  }

  resetList() {
    this.AssignExaminerMasterList = [...this.BackupCenterMasterList];
    this.searchByCenterCode = '';
    this.searchByCenterName = '';
  }


  async openModal(content: any, row: any, indexNum: number) {
    console.log(row, 'RowData');
    try {
      this.SelectCenterMaster = row;
      this.UserID = 0;
      this.assignedInstitutesReady = false;
      this.assignedInstitutes = [];
      await this.GetStaffTypeDDL(this.SelectCenterMaster);
      this.assignedInstitutesReady = true;
      this.UserID = row && row.UserID > 0 ? row.UserID : 0;
      await this.modalService
        .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error('Error opening modal:', error);
      this.toastr.error('Failed to open modal. Please try again.');
    }
  }

  async GetStaffTypeDDL(row: any) {
    try {

      let obj = {
        InstituteID: row.CenterID ,
        DepartmentID: EnumDepartment.ITI,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        TimeTable: row.TimeTableID


      }
      this.assignexaminerservice.Getstaffpractical(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.assignedInstitutes = data.Data;
      })

    } catch (error) {
      console.error(error);
    }
  }

  CloseModal() {
    this.request.MobileNumber = ''
    this.request.Name = ''
    this.request.Email = ''
    this.request.SSOID=''
    this.modalService.dismissAll();
    // Reset dropdown ready flag
    this.assignedInstitutesReady = false;
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


  AssignPracticalExaminer() {
    if (this.Isverifed == false) {

      this.toastr.error("Please Enter Valid SSOID")
      return
    }
    if (this.request.SSOID == '') {
      this.toastr.error("Please Enter Valid SSOID")
      return
    }

      let obj = {
        CenterAssignedID: 0,
        CenterID: this.SelectCenterMaster.CenterID,
        InsituteID: this.SelectCenterMaster.InstituteID,
        UserID: this.UserID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        Eng_NonEng: this.CourseType,
        CreatedBy: this.sSOLoginDataModel.UserID,
        ModifyBy: this.sSOLoginDataModel.UserID,
        TimeTableID: this.SelectCenterMaster.TimeTableID,
        SSOID: this.request.SSOID,
        Name: this.request.Name,
        MobileNumber: this.request.MobileNumber,
        Email: this.request.Email
      

    }




      try {
        // //Call service to save data
        this.assignexaminerservice.AssignPracticalExaminer(obj)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State === EnumStatus.Success) {
              this.toastr.success(this.Message);
              this.CloseModal();
              this.GetAssignexaminer();
            } else {
              this.toastr.error(this.ErrorMessage);
            }
          })
          .catch((error: any) => {
            console.error(error);
            this.toastr.error("An error occurred while saving the data.");
          });

      } catch (ex) {
        console.log(ex);
        this.toastr.error("An unexpected error occurred.");
      }
    
  }

  async downloadPDF(type: any = '') {

    if (type != 'order' ) {

      this.DownloadFile(this.PublishFileName, 'file download')

      return
    }
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.CourseType;
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.loaderService.requestStarted();
    try {
      await this.assignexaminerservice.GeneratePracticalExamAssignData(this.searchRequest).then((data: any) => {

        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          debugger;
          const pdfUrl = data.PDFURL; // Assuming your API returns this
          this.DownloadPdf(pdfUrl); // Download using actual file path
          
    /*      this.toastr.success("PDF Genetrated Successfully");*/
          this.CloseModal()
          this.GetAssignexaminer();
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })

    } catch (Ex) {
      console.log(Ex);
    }
  }

  DownloadPdf(FileName: string): void {
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = "PracticalExamAssignData.pdf"; // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  //}//downloadPDF(type: any='') {

  //  //if (type != 'order') {

  //  //  this.DownloadFile(this.PublishFileName, 'file download')
      
  //  //  return
  //  //}
  //  this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //  this.searchRequest.Eng_NonEng = this.CourseType;
  //  try {
  //    this.assignexaminerservice.DownloadItiPracticalExaminer(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //          this.GetAssignexaminer();
  //          /*this.GenerateCenterSuperintendentOrder(FileName, DownloadfileName, type)*/
  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, error => console.error(error));

  //  } catch (Ex) {
  //    console.log(Ex);
  //  }

  //}

  DownloadFile(FileName: string, DownloadfileName: string): void {
    debugger;
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.pdf`;
  }

  //forwardStatus() {
  //
  //  let object: VerifyRollNumberList[] = [{
  //    DepartmentID: this.sSOLoginDataModel.DepartmentID,
  //    EndTermID: this.sSOLoginDataModel.EndTermID,
  //    Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
  //    PDFType: 4,
  //    Status: 12,
  //    RollListID: this.GetStatusCenterSuperintendentData?.RollListID,
  //    InstituteID: 0,
  //    StreamID: 0,
  //    SemesterID: 0,
  //    CenterName: '',
  //    InstituteNameEnglish: '',
  //    BranchCode: '',
  //    StudentType: '',
  //    EndTermName: '',
  //    FinancialYearName: '',
  //    Totalstudent: 0,
  //    StudentTypeID: 0,
  //    Selected: false,
  //    UserID: 0,
  //    RoleID: 0,
  //    ModuleID: 0,
  //    ActionCode: '',
  //    IsRegistrarVerified: false,
  //    IsExaminationVerified: false
  //  }]
  //  try {
  //    this.GetRollService.SaveWorkflow(object)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          //this.GetStatus(4)
  //          /* this.GetStatusCenterSuperintendent();*/
  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, error => console.error(error));
  //  } catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  //GetStatus(status: any) {
  //  try {
  //    this.centerAllocationService.GetStatusCenterSuperintendentOrder(status, this.sSOLoginDataModel.Eng_NonEng)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          console.log(data.Data)
  //
  //          this.GetStatusCenterSuperintendentData = data.Data[0]
  //          if (this.GetStatusCenterSuperintendentData && this.GetStatusCenterSuperintendentData?.FileName) {
  //            this.DownloadFile(this.GetStatusCenterSuperintendentData?.FileName, 'file download');
  //          }

  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, error => console.error(error));
  //  } catch (Ex) {
  //    console.log(Ex);
  //  }
  //}

  //GetStatusCenterSuperintendent() {
  //  this.centerAllocationService.GetStatusCenterSuperintendentOrder(4, this.sSOLoginDataModel.Eng_NonEng)
  //    .then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.State == EnumStatus.Success) {
  //        console.log(data.Data)
  //
  //        this.GetStatusCenterSuperintendentData = data.Data[0]
  //      }
  //      else {
  //        this.toastr.error(data.ErrorMessage)
  //        //    data.ErrorMessage
  //      }
  //    }, error => console.error(error));
  //}


  async DownloadPDF1() {

    this.Swal2.Confirmation("Are you sure you want to Publish Order List ?,You cannot Revert Process Once you final Publish it!",
      async (result: any) => {
        if (result.isConfirmed) {
          this.openOTP()

        }
      })

  }

  openOTP() {

    

    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      //this.PublishTimeTable();
      this.PublishOrder(EnumEnrollNoStatus.Published);
    })
  }


  async PublishOrder(Action: number) {
    try {

      if (this.sSOLoginDataModel.RoleID == 97){
        this.sSOLoginDataModel.Eng_NonEng=1
      }

      let obj = {
        PDFType: 5,

        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        CreatedBy: this.sSOLoginDataModel.UserID,
        ModifyBy: this.sSOLoginDataModel.UserID,
        Status: 14,
        InstituteID: this.sSOLoginDataModel.InstituteID
      }

      this.loaderService.requestStarted();
      //call
      await this.centerAllocationService.SaveWorkflow(obj).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            /*     this.DownloadPublishTimeTable();*/
            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.GetAssignexaminer()



            this.CloseModal()

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        },
        (error: any) => console.error(error)
      );
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //CloseModalPopup() {
  //  this.modalService.dismissAll();

  //}

  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {
    this.Isverifed = false
    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      this.request.SSOID = ''
      this.request.MobileNumber = ''
      this.request.Email = ''
      this.request.Name = ''
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            this.request.Name = parsedData.displayName;
            this.request.MobileNumber = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            this.request.Email = parsedData.mailPersonal;
            this.Isverifed = true

          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  async onGetStudentExamReportlist(model: any, CenterID: number , SemesterID: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      //this.searchRequest.ServiceRequestId = ServiceRequestId;
      this.searchRequestExam.CenterID = CenterID;
      this.searchRequestExam.SemesterID = SemesterID;
      this.searchRequestExam.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequestExam.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      if (this.sSOLoginDataModel.RoleID == 97) {
        this.searchRequestExam.Eng_NonEng=1
      }

      await this.assignexaminerservice.GetStudentExamReportGetStudentExamReportForITIAsync(this.searchRequestExam)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentExamReportList = data.Data;
          this.totalRecord = this.StudentExamReportList[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);

        }, (error: any) => console.error(error))

      //console.log(ServiceRequestId, "modal");
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

  CloseModalGetStudentExamReport() {
    this.request.MobileNumber = ''
    this.request.Name = ''
    this.request.Email = ''
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
    this.request.SSOID = ''

  }
  


}
