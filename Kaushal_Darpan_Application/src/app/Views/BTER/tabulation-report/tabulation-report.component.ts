import { Component } from '@angular/core';
import { EnumResultType, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { UserMasterService } from '../../../Services/UserMaster/user-master.service';
import { MenuService } from '../../../Services/Menu/menu.service';
import { TabulationReportSearchModel } from '../../../models/bter/TabulationReportModel';
import { ReportService } from '../../../Services/Report/report.service';
import { EndTermFinYearModel } from '../../../Models/CommonMasterDataModel';

@Component({
  selector: 'app-tabulation-report',
  templateUrl: './tabulation-report.component.html',
  styleUrl: './tabulation-report.component.css',
  standalone: false
})
export class TabulationReportComponent {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;

  public sSOLoginDataModel = new SSOLoginDataModel();

  public _GlobalConstants: any = GlobalConstants;
  public _EnumRole = EnumRole;

  public UserID: number = 0
  public RoleID: number = 0
  public InstituteMasterList: any = [];
  public StreamMasterList: any = [];
  public SemesterMasterList: any = [];
  public StudentTypeMasterList: any = [];

  public request = new TabulationReportSearchModel();//search


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
  MapKeyEng: number = 0;
  public DateConfigSetting: any = [];
  //end table feature default

  public ResultTypeList: any[] = [];
  public endTermFinYear: EndTermFinYearModel[] = [];
  public _EnumResultType = EnumResultType;

  constructor(private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private UserMasterService: UserMasterService,
    private Swal2: SweetAlert2,
    public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute,
    private menuService: MenuService,
    private reportService: ReportService
  ) {

  }

  async ngOnInit() {
    //session
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //load
    await this.GetMasterData();
  }

  async GetMasterData() {
    try {
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          this.InstituteMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          this.StreamMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          this.SemesterMasterList = data['Data'];
        }, (error: any) => console.error(error));

      await this.commonMasterService.GetExamResultType()
        .then((data: any) => {
          this.ResultTypeList = data['Data'] || [];
        }, (error: any) => console.error(error));

    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetBterTabulationReport() {
    try {
      // session
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.CourseType = this.sSOLoginDataModel.Eng_NonEng;
      this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
      this.request.RoleID = this.sSOLoginDataModel.RoleID;

      await this.reportService.GetBterTabulationReport(this.request)
        .then((res: any) => {
          if (res.State == EnumStatus.Success) {
            this.downloadBase64PDF(res.Data, 'tabulationresult.pdf');
          }
          else if (res.State == EnumStatus.Warning) {
            this.toastr.warning(res.Message);
          }
          else {
            this.toastr.error(res.Message);
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.error(ex);
    }
  }

  downloadBase64PDF(base64: string, filename: string) {
    const byteCharacters = atob(base64);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }


  async btn_SearchClick() {
    try {
      if ((this.request.InstituteId ?? 0) <= 0) {
        this.toastr.error("Please select Institute!");
        return;
      }
      else if (parseInt(this.request.SemesterID || "0") <= 0) {
        this.toastr.error("Please select Semester/Year!");
        return;
      }
      else if ((this.request.SchemeID ?? 0) <= 0) {
        this.toastr.error("Please select Scheme!");
        return;
      }
      else if ((this.request.ResultTypeId ?? 0) <= 0) {
        this.toastr.error("Please select Result Type!");
        return;
      }
      else if (this.request.ResultTypeId == this._EnumResultType.RwhResult || this.request.ResultTypeId == this._EnumResultType.RwhRevalEffected) {
        if ((this.request.EffectiveFromEndTermId ?? 0) <= 0) {
          this.toastr.error("Please select Result Type!");
          return;
        }
      }
      await this.GetBterTabulationReport();
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async btn_Clear() {
    this.request = new TabulationReportSearchModel();
    // clear the pdf view

  }

  async GetEffectiveFinYear() {
    this.request.EffectiveFromEndTermId = 0;
    this.endTermFinYear = [];
    if (this.request.ResultTypeId == this._EnumResultType.RwhResult || this.request.ResultTypeId == this._EnumResultType.RwhRevalEffected) {
      try {
        await this.commonMasterService.GetEffectiveFinYear()
          .then((data: any) => {
            this.endTermFinYear = data['Data'] || [];
          }, (error: any) => console.error(error));
      }
      catch (Ex) {
        console.log(Ex);
      }
    }
  }
}



