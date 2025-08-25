import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { MarksheetIssueDataModels, MarksheetIssueSearchModel } from '../../../../Models/MarksheetIssueSearchModel';
import { CompanyMasterService } from '../../../../Services/CompanyMaster/company-master.service.ts';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { MarksheetIssueDateService } from '../../../../Services/MarksheetIssueDate/marksheet-issue-date.service';
import { EnumStatus } from '../../../../Common/GlobalConstants';

@Component({
    selector: 'app-marksheet-issue-date',
    templateUrl: './marksheet-issue-date.component.html',
    styleUrls: ['./marksheet-issue-date.component.css'],
    standalone: false
})

export class MarksheetIssueDateComponent implements OnInit {
  //public CompanyMasterList: ICompanyMasterDataModel[] = [];
  public MarksheetIssueDataId: number = 0;
  public Table_SearchText: string = "";
  public searchRequest = new MarksheetIssueSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public request = new MarksheetIssueDataModels()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public IsView: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public MarksheetFormGroup!: FormGroup;
  public SemesterMasterList: any = [];
  public MarksheetIssueDateList: any = [];
  public ExamTypeList: any = [];
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;

  constructor(private commonMasterService: CommonFunctionService,
    private marksheetIssueDateService: MarksheetIssueDateService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router,
    private modalService: NgbModal, private toastr: ToastrService,
    private loaderService: LoaderService, private Swal2: SweetAlert2) {

  }

  async ngOnInit() {

    this.MarksheetFormGroup = this.formBuilder.group(
      {
        txtIssueDateform: ['', Validators.required],
        ddlResultTypeId: ['', [DropdownValidators]],
        ddlSemesterID: ['', [DropdownValidators]]
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID
    await this.GetAllData();
    await this.GetMaterData();
    this.loadDropdownData('ResultExamType');

    
  }
  get _MarksheetFormGroup() { return this.MarksheetFormGroup.controls; }


  async SaveData() {
    try {
      ;
      this.isSubmitted = true;
      if (this.MarksheetFormGroup.invalid) {
        console.log("errro")
        return
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.request.ModifyBy = this.sSOLoginDataModel.UserID;
      this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      //save
      await this.marksheetIssueDateService.SaveData(this.request)
        .then((data: any) => {
          ;
          data = JSON.parse(JSON.stringify(data));
          console.log(data);
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControls();
            this.CloseModalPopup();
            this.GetAllData();
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

  // reset
  async ResetControls() {
    this.request = new MarksheetIssueDataModels();
     this.isSubmitted = false;
    await this.GetAllData();
  }

  async GetAllData() {
    try {
      this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
      this.searchRequest.RoleID = this.sSOLoginDataModel.RoleID
      this.loaderService.requestStarted();
      await this.marksheetIssueDateService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.MarksheetIssueDateList = data.Data;
        console.log(this.MarksheetIssueDateList,"marksheetlist")
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

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'ResultExamType':
          this.ExamTypeList = data['Data'];
          console.log(this.ExamTypeList, "ExamTypeList")
          break;
        default:
          break;
      }
    });
  }


  // get all data
  async ClearSearchData() {
    this.searchRequest = new MarksheetIssueSearchModel();
    this.MarksheetIssueDateList = [];
    
  }
  async GetMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterMasterList = data['Data'];
          console.log(this.SemesterMasterList,"deve")
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

  async ViewandUpdate(content: any, MarksheetIssueDataId: number) {

    //const initialState = {
    //  MarksheetIssueDataId: MarksheetIssueDataId,
    //  Type: "Admin",
    //};
    this.MarksheetIssueDataId = MarksheetIssueDataId;

    await this.GetMaterData();
    this.loadDropdownData('ResultExamType');
    if (this.MarksheetIssueDataId > 0) {
      await this.GetById();
      this.IsView = true;
    }
    else {
      this.IsView = false;
    }
 
    this.modalReference = this.modalService.open(content, { backdrop: 'static', size: 'xl', keyboard: true, centered: true });

  }

  CloseModalPopup() {
    this.modalService.dismissAll();
     this.ResetControls();
  }

  async GetById() {
    try {
      ;
      this.loaderService.requestStarted();
      await this.marksheetIssueDateService.GetById(this.MarksheetIssueDataId)

        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data,"rrrrrrrr");
          ;
          this.request = data['Data'];
          const dob = new Date(data['Data']['IssuedDate']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0');
          const day = String(dob.getDate()).padStart(2, '0');
          this.request.IssuedDate = `${year}-${month}-${day}`;
          this.request.ResultTypeId = data['Data']['ResultTypeId'];
          this.request.SemesterID = data['Data']["SemesterID"];

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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

  async DeleteById(MarksheetIssueDataId: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.marksheetIssueDateService.DeleteById(MarksheetIssueDataId, this.sSOLoginDataModel.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (this.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.GetAllData();
                }
                else {
                  this.toastr.error(data.ErrorMessage)
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
}
