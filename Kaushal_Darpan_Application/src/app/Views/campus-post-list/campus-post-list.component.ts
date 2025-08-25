import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { CampusPostMasterModel, CampusPostMaster_Action, CampusPostMaster_EligibilityCriteriaModel, CampusPostQRDetail } from '../../Models/CampusPostDataModel';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CampusPostService } from '../../Services/CampusPost/campus-post.service';
import { async } from 'rxjs';
import { EnumStatus, EnumCampusType, EnumRole, GlobalConstants } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { StudentConsentSearchModel } from '../../Models/PlacementStudentSearchModel';
import { PlacementStudentService } from '../../Services/PlacementStudent/placement-student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationMessageDataModel } from '../../Models/ApplicationMessageDataModel';
import { SMSMailService } from '../../Services/SMSMail/smsmail.service';
import { ReportService } from '../../Services/Report/report.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-campus-post-list',
    templateUrl: './campus-post-list.component.html',
    styleUrls: ['./campus-post-list.component.css'],
    standalone: false
})
export class CampusPostListComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public studentconsentlist: any = [];
  public InstituteMasterList: any = [];
  public CompanyMasterList: any = [];
  public CompanyID: number = 0;
  public InstituteID: number = 0;
  public ApprovedStatus: string = "0";
  public searchrequest = new StudentConsentSearchModel()
  request = new CampusPostMasterModel();
  QR = new CampusPostQRDetail();
  requestAction = new CampusPostMaster_Action();
  requestEligibilityCriteria = new CampusPostMaster_EligibilityCriteriaModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()
  public _EnumCampusType = EnumCampusType
  public _EnumRole = EnumRole
  public GetRoleID: number = 0

  qrModalVisible: boolean = false;
  qrCodeData: string = '';

  constructor(private commonMasterService: CommonFunctionService, private campusPostService: CampusPostService, private loaderService: LoaderService, private http: HttpClient,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private Swal2: SweetAlert2, private placemenrservice: PlacementStudentService,
    private Router: Router, private router: ActivatedRoute, private reportService: ReportService, private appsettingConfig: AppsettingService
  ) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.GetRoleID = this.sSOLoginDataModel.RoleID;
    await this.GetMasterData();
    await this.btn_SearchClick();
  }


  exportToExcel(): void {
    const unwantedColumns = [
      'TransctionStatusBtn', 'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'TotalRecords', 'DepartmentID', 'CourseType', 'AcademicYearID', 'EndTermID'
    ];
    const filteredData = this.CampusValidationListData.map((item: any) => {
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
    XLSX.writeFile(wb, 'CampusPostListData.xlsx');
  }

  async showQRCode(row: any) {
    debugger;
    this.isSubmitted = true;
    try {

      this.QR = {
        Address: row.Address,
        CampusAddress: row.CampusAddress,
        CampusFromDate: row.CampusFromDate,
        CampusToDate: row.CampusToDate,
        CampusTypeClass: row.CampusTypeClass,
        CampusVenue: row.CampusVenue,
        CompanyAddress: row.CompanyAddress,
        CompanyID: row.CompanyID,
        CompanyName: row.CompanyName,
        DistrictID: row.DistrictID,
        HR_Email: row.HR_Email,
        HR_MobileNo: row.HR_MobileNo,
        HR_Name: row.HR_Name,
        InstituteCode: row.InstituteCode ?? null,
        PostCollegeID: row.PostCollegeID,
        PostID: row.PostID,
        PostNo: row.PostNo,
        RoleDetails: row.RoleDetails,
        StateID: row.StateID,
        Status: row.Status,
        TPOCollegeName: row.TPOCollegeName ?? null,
        TPOSSOID: row.TPOSSOID,
        Website: row.Website
      };

      this.loaderService.requestStarted();

      await this.reportService.showQRCode(this.QR)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          } else if (data.State == 3) {
            this.toastr.warning("Data Not found");
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => {
          console.error(error);
        });
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('png'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }


  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
        }, error => console.error(error));
      await this.commonMasterService.PlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CompanyMasterList = data['Data'];
          console.log(this.CompanyMasterList,"tCompanyMasterList")
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
  async btn_SearchClick() {
    try {
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.loaderService.requestStarted();
      await this.campusPostService.CampusValidationList(this.CompanyID, this.InstituteID, this.ApprovedStatus, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusValidationListData = data['Data'];
          console.log(this.CampusValidationListData, "CampusValidationListData");
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
  async btn_Clear() {
    this.requestAction.PostID = 0;
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
    this.CompanyID = 0;
    this.InstituteID = 0;
    this.ApprovedStatus = "0";
    //this.CampusValidationListData = [];
  }
  async CampusOnPostAction(content: any, PostID: number) {
    this.requestAction.PostID = PostID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
  }
  async ViewandUpdate(content: any, PostID: number) { 

    //this.modalReference = this.modalService.open(CampusPostComponent, { backdrop: 'static', size: 'lg', keyboard: true, centered: true });


    //this.requestAction.PostID = PostID;
    //this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
    //  this.closeResult = `Closed with: ${result}`;
    //}, (reason) => {
    //  this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //});
    //this.requestAction.Action = "0";
    //this.requestAction.ActionRemarks = "";
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

  //async btnDelete_OnClick(RoleID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  //      await this.campusPostService.DeleteDataByID(RoleID, this.sSOLoginDataModel.UserID)
  //        .then(async (data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            await this.btn_SearchClick();
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async btnDelete_OnClick(RoleID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();
            this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
            await this.campusPostService.DeleteDataByID(RoleID, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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
      });
  }

  async GetAllstudent(PostID: number) {
    try {
      this.searchrequest.PostID = PostID
      this.searchrequest.action = "GetConsentStudentList"
      this.searchrequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
      this.searchrequest.Status = this.ApprovedStatus
      this.loaderService.requestStarted();
      await this.placemenrservice.GetPlacementconsent(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.studentconsentlist = data['Data'];
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

  async openModal(content: any, PostID: number) {

    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.GetAllstudent(PostID)
  }

  onUploadSignedCopyOfResult(id: number): void {
    
    // Navigate to the edit page with the institute ID
    this.Router.navigate(['/SignedCopyOfResult', id]);
    console.log(id)
  }

  }
