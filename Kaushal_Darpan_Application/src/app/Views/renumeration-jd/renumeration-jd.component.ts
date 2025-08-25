import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { AppsettingService } from '../../Common/appsetting.service';
import { EnumRenumerationExaminer, EnumStatus, GlobalConstants } from '../../Common/GlobalConstants';
import { ReportService } from '../../Services/Report/report.service';
import { RenumerationJdService } from '../../Services/renumeration-jd/renumeration-jd.service';
import { RenumerationJDModel, RenumerationJDRequestModel, RenumerationJDSaveModel } from '../../Models/RenumerationJDModel';

@Component({
  selector: 'app-renumeration-jd',
  standalone: false,
  templateUrl: './renumeration-jd.component.html',
  styleUrl: './renumeration-jd.component.css'
})
export class RenumerationJdComponent implements OnInit {
  public Message: any = [];
  public State: number = -1;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public Table_SearchText: string = "";

  public AllInTableSelect: boolean = false;

  public RenumerationJDRequest = new RenumerationJDRequestModel();
  public RenumerationJDList: RenumerationJDModel[] = [];
  public RenumerationJDSave: RenumerationJDSaveModel[] = [];

  public _GlobalConstants = GlobalConstants;
  public _EnumRenumerationExaminer = EnumRenumerationExaminer;


  constructor(private commonMasterService: CommonFunctionService,
    private router: Router,
    private toastr: ToastrService,
    private activatedRouter: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private renumerationJdService: RenumerationJdService
  ) {
  }

  async ngOnInit() {

    // login session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    // load
    await this.GetAllData();
  }

  async GetAllData() {
    try {
      this.isSubmitted = true;
      if (this.RenumerationJDRequest.RenumerationExaminerStatusID == 0) {
        this.RenumerationJDRequest.RenumerationExaminerStatusID = this._EnumRenumerationExaminer.SubmittedAndForwardedtoJD;
      }
      //
      this.RenumerationJDRequest.SSOID = this.sSOLoginDataModel.SSOID;
      this.RenumerationJDRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.RenumerationJDRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.RenumerationJDRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RenumerationJDRequest.RoleID = this.sSOLoginDataModel.RoleID;
      //call
      await this.renumerationJdService.GetAllData(this.RenumerationJDRequest)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            this.AllInTableSelect = false;
            this.RenumerationJDList = data.Data;
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async SaveDataApprovedAndSendToAccounts() {
    try {
      const isAnySelected = this.RenumerationJDList.some(x => x.Selected);
      if (!isAnySelected) {
        this.toastr.error('Please select any record(s)!');
        return;
      }
      this.isSubmitted = true;
      let selected = this.RenumerationJDList.filter(x => x.Selected);
      this.RenumerationJDSave = selected.map(x => ({
        RenumerationExaminerID: x.RenumerationExaminerID,
        ModifyBy: this.sSOLoginDataModel.UserID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        RoleID: this.sSOLoginDataModel.RoleID
      })) as RenumerationJDSaveModel[];
      //call
      await this.renumerationJdService.SaveDataApprovedAndSendToAccounts(this.RenumerationJDSave)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Error) {
            this.toastr.error(data.Message);
            console.log(data.ErrorMessage);
          }
          else {
            await this.GetAllData();
            this.toastr.success("Save successfully.");
          }
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }

  //start table feature
  selectInTableAllCheckbox() {
    this.RenumerationJDList.forEach(x => {
      x.Selected = this.AllInTableSelect;
    });
  }
  //checked single (replace org. list here)
  selectInTableSingleCheckbox(isSelected: boolean) {
    //select all(toggle)
    this.AllInTableSelect = this.RenumerationJDList.every(r => r.Selected);
  }
  get totalInTableSelected(): number {
    return this.RenumerationJDList.filter(x => x.Selected)?.length;
  }
  // end table feature
}
