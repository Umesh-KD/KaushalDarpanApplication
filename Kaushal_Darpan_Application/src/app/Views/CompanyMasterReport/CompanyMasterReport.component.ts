import { Component, OnInit } from '@angular/core';
import { CompanyMasterSearchModel, CompanyMaster_Action, ICompanyMasterDataModel } from '../../Models/CompanyMasterDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { CompanyMasterService } from '../../Services/CompanyMaster/company-master.service.ts';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CompanyMasterComponent } from '../CompanyMaster/company-master/company-master.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumStatus } from '../../Common/GlobalConstants';

@Component({
  selector: 'app-CompanyMasterReport',
  templateUrl: './CompanyMasterReport.component.html',
  styleUrls: ['./CompanyMasterReport.component.css'],
    standalone: false
})

export class CompanyMasterReportComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public CompanyMasterList: ICompanyMasterDataModel[] = [];
  public Table_SearchText: string = "";
  public searchRequest = new CompanyMasterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ApprovedStatus: string = "0";
  public Name: string = "";
  requestAction = new CompanyMaster_Action();
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  pageNo: any = 1;
  pageSize: any = 50;
  isPre: boolean = false;
  isNext: boolean = false;
  totalRecord: any = 0;
  TotalPages: any = 0;
  public transactionData: any = [];

  formAction!: FormGroup;
  constructor(private commonMasterService: CommonFunctionService, private companyMasterService: CompanyMasterService,
    private modalService: NgbModal, private formBuilder: FormBuilder, private toastr: ToastrService, private loaderService: LoaderService) {

  }

  async ngOnInit() {
    this.formAction = this.formBuilder.group(
      {
        ddlAction: ['', Validators.required],
        txtActionRemarks: ['', Validators.required],
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetAllData(1);
  }
  get FormAction() { return this.formAction.controls; }

  //async GetAllData() {
  //  try {
  //    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
  //    this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
  //    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.loaderService.requestStarted();
  //    await this.companyMasterService.GetAllData(this.searchRequest).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.CompanyMasterList = data.Data;
  //      console.log(this.CompanyMasterList, "CompanyMasterList")
  //    }, (error: any) => console.error(error))
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async GetAllData(i: any) {
    ;
    if (i == 1) {
      this.pageNo = 1;
    } else if (i == 2) {
      this.pageNo++;
    } else if (i == 3) {
      if (this.pageNo > 1) {
        this.pageNo--;
      }
    } else {
      this.pageNo = i;
    }

    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;

      //this.searchRequest.FilterType = this.FilterType
      //this.searchRequest.SearchText = this.FilterType

      this.searchRequest.PageNumber = this.pageNo
      this.searchRequest.PageSize = this.pageSize

      this.loaderService.requestStarted();
      await this.companyMasterService.CompanyMasterReport(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State === EnumStatus.Success) {
          this.transactionData = data.Data;
          this.totalRecord = this.transactionData[0]?.TotalRecords;
          this.TotalPages = Math.ceil(this.totalRecord / this.pageSize);
          var d = Object.keys(this.transactionData);
        }
        this.CompanyMasterList = data.Data;
        console.log(this.CompanyMasterList)
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

  filteredItems() {
    this.transactionData.filter((college: any) => {
      return Object.keys(college).some(key => {
        const collegeValue = college[key];
        if (typeof collegeValue === 'string' && collegeValue.toLowerCase().includes(this.Table_SearchText.toLowerCase())) {
          return true;
        }
        return false;
      });
    });
  }

  changeListType() {
    this.transactionData = [];
  }

  // get all data
  async ClearSearchData() {
    this.searchRequest.Name = '';
    this.searchRequest.Status = '';
    this.requestAction.RoleID = 0;
    this.requestAction.ID = 0;
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
    this.ApprovedStatus = "0";
  }

  async CompanyOnAction(content: any, ID: number) {
    this.requestAction.ID = ID;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    this.requestAction.Action = "0";
    this.requestAction.ActionRemarks = "";
  }
  async ViewandUpdate(content: any, ID: number) {

    const initialState = {
      ID: ID,
      Type: "Admin",
    };
    this.modalReference = this.modalService.open(CompanyMasterComponent, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });
    this.modalReference.componentInstance.initialState = initialState;

    //this.modalReference.shown(CampusPostComponent, { initialState });
    //this.modalReference.show(CampusPostComponent, { initialState });
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
  async SaveData_ApprovedCampus() {
    this.isSubmitted = true;

    if (this.formAction.invalid) {
      return
    }
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestAction.ActionBy = this.sSOLoginDataModel.UserID;
    this.requestAction.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //Show Loading
    this.loaderService.requestStarted();
    try {
      await this.companyMasterService.Save_CompanyValidation_NodalAction(this.requestAction)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message);
            await this.CloseModalPopup();
            await this.GetAllData(1);
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

  totalShowData: any = 0
  pageSizeChange(event: any): void {
    ;
    this.pageNo = 1;
    this.pageSize = event.value;
    //this.pageNo = 1;
    this.GetAllData(1)
  }

  nextData() {
    if (this.totalShowData < Number(this.transactionData[0]?.TotalRecords)) {
      if (this.pageNo >= 1) {
        // this.pageNo = this.pageNo + 1
      }
      this.GetAllData(2)
    }

  }
  previousData() {
    if (this.pageNo > 1) {
      //this.pageNo = this.pageNo - 1;
      this.GetAllData(3)
    }
  }
}
