import { Component, TemplateRef, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StudentConsentSearchModel } from '../../../../Models/PlacementStudentSearchModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ItiCampusPostMaster_Action, ItiCampusPostMaster_EligibilityCriteriaModel, ItiCampusPostMasterModel } from '../../../../Models/ITI/ITICampusPostDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ItiCampusPostService } from '../../../../Services/ITI/ITICampusPost/iticampus-post.service';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { LoaderService } from '../../../../Services/Loader/loader.service';

import { EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { ITIPlacementStudentService } from '../../../../Services/ITI/ITIPlacementStudent/iti-placement-student.service';
import { ActivatedRoute } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
    selector: 'app-iticampus-post-list',
    templateUrl: './iticampus-post-list.component.html',
    styleUrls: ['./iticampus-post-list.component.css'],
    standalone: false
})
export class ItiCampusPostListComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CampusValidationListData: any = [];
  public studentconsentlist: any = [];
  public InstituteMasterList: any = [];
  public CompanyMasterList: any = [];
  public CompanyID: number = 0;
  public InstituteID: number = 0;
   public RoleID: number = 0;
  public ApprovedStatus: string = "0";
  public searchrequest = new StudentConsentSearchModel()
  request = new ItiCampusPostMasterModel();
  requestAction = new ItiCampusPostMaster_Action();
  requestEligibilityCriteria = new ItiCampusPostMaster_EligibilityCriteriaModel();
  sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public flagName:string="TotalNoOfCampus";

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()

  _EnumRole = EnumRole

  constructor(private commonMasterService: CommonFunctionService, private campusPostService: ItiCampusPostService, private loaderService: LoaderService,
    private modalService: NgbModal,private route: ActivatedRoute, private formBuilder: FormBuilder, private toastr: ToastrService, private Swal2: SweetAlert2, private placemenrservice: ITIPlacementStudentService) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.flagName = this.route.snapshot.queryParamMap.get('flag') ?? 'TotalNoOfCampus';

    await this.GetMasterData();
    await this.btn_SearchClick();
  }

  exportToExcel(): void {
    const unwantedColumns = [
      'ActiveStatus', 'DeleteStatus', 'CreatedBy', 'ModifyBy', 'ModifyDate', 'IPAddress',
      'StudentID', 'StudentExamID', 'StudentExamPaperMarksID', 'GroupCode', 'InstituteID','PostID','PostCollegeID','CompanyID','StateID','DistrictID',
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

    const today=new Date();
    console.log(today.getFullYear);
    const formatedDate= String(today.getDate()).padStart(2,'0')+ String(today.getMonth()+1).padStart(2,'0')+today.getFullYear();
    const filename=`CampusData-${formatedDate}.xlsx`;
    XLSX.writeFile(wb, filename);
  }

  async GetMasterData() {
    debugger
    try {
      this.loaderService.requestStarted();
    
        debugger;
      await this.commonMasterService.ITIPlacementCompanyMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CompanyMasterList = data['Data'];
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
    debugger
    try {
      this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
      this.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.RoleID = this.sSOLoginDataModel.RoleID;
      this.loaderService.requestStarted();
      await this.campusPostService.GetAllData(this.CompanyID, this.InstituteID, this.ApprovedStatus, this.sSOLoginDataModel.DepartmentID,this.RoleID,this.flagName)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CampusValidationListData = data['Data'];
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
    this.CampusValidationListData = [];
    this.btn_SearchClick();
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


  }
