import { Component, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../../Services/Center_Allocation/center-allocation.service';
import {  CenterAllocationtDataModels, CenterExamAllocationSearchModel, InstituteList, ITIAssignPracticaLExaminer } from '../../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { GetRollService } from '../../../../Services/GenerateRoll/generate-roll.service';
import { VerifyRollNumberList } from '../../../../Models/GenerateRollDataModels';
import { ITICenterAllocationService } from '../../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { ITICenterAllocationtDataModels } from '../../../../Models/ITI/ITICenterAllocationDataModel';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { CommonVerifierApiDataModel } from '../../../../Models/PublicInfoDataModel';
import { FontsService } from '../../../../Services/FontService/fonts.service';
import pdfmake from 'pdfmake/build/pdfmake';
import { FormsModule } from '@angular/forms';
import { ITIRelievingExamService } from '../../../../Services/ITI/ITIRelieveingExam/iti-relieveing-exam.service';
import * as XLSX from 'xlsx';
import { IIPCollegeReportService } from '../../../../Services/IIPCollageReport/IIPCollageReport.service';
import { CollegeMasterService } from '../../../../Services/CollegeMaster/college-master.service';


@Component({
  selector: 'app-iipcollage-report',
  standalone: false,
  templateUrl: './iipcollage-report.component.html',
  styleUrl: './iipcollage-report.component.css'
})
export class IIPCollageReportComponent {
  public DataList: any = [];
  loaderService = inject(LoaderService);
  IIPCollageReport = inject(IIPCollegeReportService);
  CenterMasterList: ITICenterAllocationtDataModels[] = [];

 // fontsSerive = inject(FontsService);
  //commonMasterService = inject(CommonFunctionService);
  //centerAllocationService = inject(ITICenterAllocationService);
  //centerExamAllocationService = inject(CenterExamCoordinatorService);
  pdfMakeVfs: any = pdfmake.vfs || {};
  totalRecord: any = 0;


  //itiRelievingExamService = inject(ITIRelievingExamService);
  //Swal2 = inject(SweetAlert2);
  //public requestSSoApi = new CommonVerifierApiDataModel();
  //GetRollService = inject(GetRollService);
  //centerCreation = inject(CenterAllotmentService);
  //toastr = inject(ToastrService);
  //loaderService = inject(LoaderService);
  //modalService = inject(NgbModal);
  //http = inject(HttpClient);
  //appsettingConfig = inject(AppsettingService);
  //@ViewChild('content') content: ElementRef | any;
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  assignedInstitutes: any = [];
  assignedInstitutesReady: boolean = false;
  closeResult: string | undefined;
  Table_SearchText: string = '';
 
  searchRequest = new CenterExamAllocationSearchModel();
  FilteredInstituteList: any[] = [];
  CollegeMasterList: any[] = [];
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  CollageName: string = '';
  request = new ITIAssignPracticaLExaminer();
  sSOLoginDataModel = new SSOLoginDataModel();
  BackupCenterMasterList: any[] = [];
  SelectCenterMaster: any;
  GetStatusCenterSuperintendentData: any;
  UserID: number = 0;
  Status: number = 0
  PublishFileName: string = ''
  //@ViewChild('otpModal') childComponent!: OTPModalComponent;
  IIPCollegeReportService = inject(IIPCollegeReportService)
  public originalCollegeMasterList: any = []
  public InstituteMasterList: any = [];
 
  constructor(
    private toastr: ToastrService,
    private collegeService: CollegeMasterService,
    private commonMasterService: CommonFunctionService,
  ) { }
  _EnumRole = EnumRole;
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    console.log(this.sSOLoginDataModel);
    this.GetReportAllData();
    this.GetMasterData();

  }


  async GetReportAllData() {

    debugger;

    try {

      // this.loaderService.requestStarted();

     var UserID: number = 0

      let obj = {

        EndTermID: this.sSOLoginDataModel.EndTermID,

        DepartmentID: this.sSOLoginDataModel.DepartmentID,

        RoleID: this.sSOLoginDataModel.RoleID,

        Createdby: this.sSOLoginDataModel.UserID,

        //InstituteID: this.searchRequest.InstituteID,

        UserID: UserID

      };

      debugger;

      await this.IIPCollegeReportService.GetCollageReport(this.searchRequest)
     
        .then((data: any) => {

          data = JSON.parse(JSON.stringify(data));
        
          debugger;

          if (data.Data.length > 0) {

            this.CenterMasterList = data.Data;

            //this.loadInTable();

          }

          else {

            this.CenterMasterList = [];

          }

        }, (error: any) => console.error(error)

        );

    } catch (error) {

      console.error(error);

    } finally {

      setTimeout(() => {

        this.loaderService.requestEnded();

      }, 200);

    }

  }


  exportExcelData() {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.CenterMasterList);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    const fileName = `CollageReport.xlsx`;
    XLSX.writeFile(wb, fileName);
  }

  async GetMasterData() {
    debugger
    try {
      this.loaderService.requestStarted();

      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          console.log('Institute Master List', this.InstituteMasterList)
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




}
