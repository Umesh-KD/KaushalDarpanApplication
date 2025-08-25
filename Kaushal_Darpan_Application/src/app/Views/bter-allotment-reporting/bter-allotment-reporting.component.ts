import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AllotmentDocumentModel } from '../../Models/ITI/AllotmentreportDataModel';
import { BterAllotmentDocumentModel, BterAllotmentReportingModel } from '../../Models/BterAllotmentReportingDataModel';
import { BterStudentsJoinStatusMarksSearchModel } from '../../Models/BterStudentJoinStatusDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { SearchSlidingModel } from '../../Models/InternalSlidingDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentsJoiningStatusMarksService } from '../../Services/Students-Joining-Status-Marks/students-joining-status-marks.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { AppsettingService } from '../../Common/appsetting.service';
import { InternalSlidingService } from '../../Services/ITIInternalSliding/internal-sliding.service';
import { SweetAlert2 } from '../../Common/SweetAlert2'
import { BterStudentsJoinStatusMarksService } from '../../Services/BterStudentJoinStatus/Student-join-status-mark.service';
import { EnumStatus } from '../../Common/GlobalConstants';
@Component({
  selector: 'app-bter-allotment-reporting',
  standalone: false,
  
  templateUrl: './bter-allotment-reporting.component.html',
  styleUrl: './bter-allotment-reporting.component.css'
})
export class BterAllotmentReportingComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public filteredDocumentDetails: BterAllotmentDocumentModel[] = []
  request = new BterAllotmentReportingModel()
  public searchRequest = new BterStudentsJoinStatusMarksSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  /*  public AllotmentId: number | null = null;*/
  sSOLoginDataModel = new SSOLoginDataModel();
  public AllotmentDocument: any[] = [];
  public StudentsJoiningStatusMarksDetails: any[] = [];
  public slidingrequest = new SearchSlidingModel()
  public TradeList: any[] = [];
  public InternalSlidingUnitList: any[] = [];
  public IsStatusMark: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  public AllotmentId: number = 0
  public Isremarkshow: boolean = false
  public remarkheader: boolean = false
  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private StudentsJoiningStatusMarksService: BterStudentsJoinStatusMarksService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    public appsettingConfig: AppsettingService,
    private internalSlidingService: InternalSlidingService,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.CreatedBy = this.sSOLoginDataModel.UserID;
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.AllotmentId = Number(this.routers.snapshot.queryParamMap.get('AllotmentID') ?? 0)
    if (this.AllotmentId > 0) {
      this.searchRequest.AllotmentId = this.AllotmentId;

      this.GetById()
      /*      this.GetDDLInternalSlidingUnitList()*/
    }

  }

  async GetById() {
    // const DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.StudentsJoiningStatusMarksService.GetAllotmentdata(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("What I got from DB", data.Data)
          if (data['Data'] != null) {
            this.request = data['Data']

            const dob = new Date(data['Data']['DOB']);
            const year = dob.getFullYear();
            const month = String(dob.getMonth() + 1).padStart(2, '0');
            const day = String(dob.getDate()).padStart(2, '0');
            this.request.DOB = `${year}-${month}-${day}`;

            //this.GetDDLInternalSlidingUnitList()
            //this.request.Religion = data['Data']['Religion']



            if (this.request?.AllotmentDocumentModel) {

              this.filteredDocumentDetails = this.request.AllotmentDocumentModel.filter((x) => x.GroupNo === 1);

              this.request.AllotmentDocumentModel.forEach((dOC: any) => {
                dOC.ShowRemark = dOC.DocumentStatus == false;
              });

              // Recalculate Isremarkshow
              this.Isremarkshow = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false);
            } else {

              this.filteredDocumentDetails = [];
            }


          }




          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";


        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //filteredDocumentDetails(groupNo: number): AllotmentDocumentModel[] {
  //  if (groupNo == 1) {
  //    let filtered = this.request.AllotmentDocumentModel.filter((x) => x.GroupNo == groupNo);




  //    return filtered;
  //  } else {
  //    return this.request.AllotmentDocumentModel.filter((x) => x.GroupNo == groupNo);
  //  }
  //}


  //async GetDDLInternalSlidingUnitList() {
  //  this.slidingrequest.InsID = this.request.CollegeTradeId

  //  try {
  //    await this.internalSlidingService.GetDDLInternalSlidingUnitList(this.slidingrequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.InternalSlidingUnitList = data['Data'];
  //          console.log(this.InternalSlidingUnitList, 'InternalSlidingList')
  //        } else {
  //          /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
  //        }
  //      }, (error: any) => console.error(error));
  //  } catch (Ex) {
  //    console.log(Ex);
  //  }
  //}


  async OnRemarkChange(dOC: any, index: number) {

    if (index == 0) {
      dOC.ShowRemark = true;
      dOC.DocumentStatus = false

    } else {
      dOC.ShowRemark = false;
      dOC.DocumentStatus = true
      dOC.Remark = '';
    }
    //
    //console.log(this.request.AllotmentDocumentModel)
    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus === false);

    this.remarkheader = this.Isremarkshow;
  }




  async SaveData() {

    this.isSubmitted = true
    const IsRemarKvalid = this.request.AllotmentDocumentModel.some((x: any) => x.DocumentStatus == false && x.Remark == '');
    if (IsRemarKvalid == true) {
      /*      this.toastr.error("Please enter valisd Remark")*/
      return
    }

    this.request.CreatedBy = this.sSOLoginDataModel.UserID
    this.request.ModifyBy = this.sSOLoginDataModel.UserID

    if (this.request.ShiftUnitID == 0) {
      this.toastr.error("Please select shift unit")
      return
    }

    this.Isremarkshow = this.request.AllotmentDocumentModel.some((x) => x.DocumentStatus == false);
    if (this.Isremarkshow) {
      this.request.JoiningStatus = 'R'
    } else {
      this.request.JoiningStatus = 'J'
    }


    try {
      await this.StudentsJoiningStatusMarksService.SaveReporting(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

}
