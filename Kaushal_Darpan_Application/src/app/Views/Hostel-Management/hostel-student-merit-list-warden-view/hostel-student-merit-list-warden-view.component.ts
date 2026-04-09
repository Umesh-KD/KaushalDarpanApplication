import { Component, OnInit } from '@angular/core';
import { StudentRequestDataModal } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { EnumRole, EnumStatus, HostelStatus } from '../../../Common/GlobalConstants';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import * as XLSX from 'xlsx';
import * as CryptoJS from 'crypto-js';
import { EditHostelStudentSearchModel, HostelStudentSearchModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
const secretKey = 'your-secret-key';


@Component({
  selector: 'app-hostel-student-merit-list-warden-view',
  standalone: false,
  templateUrl: './hostel-student-merit-list-warden-view.component.html',
  styleUrl: './hostel-student-merit-list-warden-view.component.css'
})
export class HostelStudentMeritListWardenViewComponent {
  public Searchrequest = new StudentRequestDataModal()
  public ViewRequest: any = {};
  public Request: any;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public showColumn: boolean = false;
  public UserID: number = 0;
  public ReqId: number = 0;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public SearchRequestFormGroup!: FormGroup;
  public RequestFormGroup!: FormGroup;
  public CancelRequestFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  modalReference: NgbModalRef | undefined;
  public Table_SearchText: string = "";
  public StudentReqListList: any = [];
  public SemesterDDLList: any = [];
  public BrachDDLList: any = [];
  public MarksDetailsList: any = [];
  public EditHostelDetailsList: any = [];
  public GenderList: any = []
  public HostelStatusList: any = []
  public Allotmentrequest = new RoomAllotmentDataModel();
  public titleDDLBranchTrade: string = ''
  meritMultiSelected: boolean = false;

  HostelDetails = new HostelStudentSearchModel();
  EditHostelDetails = new EditHostelStudentSearchModel();
  _EnumRole = EnumRole;
  _HostelStatus = HostelStatus;
  public showRegenerateMerit: boolean = false;

  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    //private _HostelManagmentService: HostelManagmentService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private _HostelManagmentService: HostelManagmentService) { }


  async ngOnInit() {
    
    this.ReqId = Number(this.activatedRoute.snapshot.queryParamMap.get('id')?.toString());

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    
    if (this.sSOLoginDataModel.DepartmentID == 1) {
      this.titleDDLBranchTrade='Branch'
    }
    else if (this.sSOLoginDataModel.DepartmentID == 2) {
      this.titleDDLBranchTrade = 'Trade'
    }
    this.RequestFormGroup = this.formBuilder.group({
      StudentName: [''], 
      ClassPercentage: [''], 
      StreamName: [''] 
    });
    this.CancelRequestFormGroup = this.formBuilder.group({
      remark: ['', Validators.required],
    });

    await this.GetHostelStatusDDL();
    await this.GetBranchMaster();
    await this.GetSemesterMaster();
    await this.GetGenderList();
    await this.GetAllPrincipalstudentmeritlist();
    //await this.GetMarksDetails();
  }
  get _RequestFormGroup() { return this.RequestFormGroup.controls; }
  get _CancelRequestFormGroup() { return this.CancelRequestFormGroup.controls; }

  async GetHostelStatusDDL() {
    try {
      await this.commonFunctionService.GetHostelStatusDDL().then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.HostelStatusList = data['Data'];
        this.HostelStatusList = this.HostelStatusList.filter((x: any) => x.StatusID == 2 || x.StatusID == 11 || x.StatusID == 15)
      })
    } catch (error) {
      console.error(error);
    }
  }
  async GetAllPrincipalstudentmeritlist() {
     debugger
    try {
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.Searchrequest.HostelID = this.sSOLoginDataModel.HostelID;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.Action ="HostelStudentMeritlistWardenView";

      this.loaderService.requestStarted();
      await this.studentRequestService.HostelStudentMeritListWardenView(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.StudentReqListList = data['Data'];

            this.StudentReqListList.forEach((item: any) => {
              item.selected = false;
            });

            this.showRegenerateMerit = this.StudentReqListList.some((x: any) => x.MeritType === 2)

            console.log('Student List ==>', this.StudentReqListList)
          } else {
            this.toastr.error(data.ErrorMessage)
          }
          
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  exportToExcel(): void {
    const unwantedColumns = ['InstituteId', 'InstituteId', 'ApplicationId', 'StudentId', 'SemesterId', 'AllotmentStatus', 'BrachId', 'AllotmentStatus1', 'EndTermID'];
    const filteredData = this.StudentReqListList.map((item: any) => {
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
    XLSX.writeFile(wb, 'StudentApplyHostelReportData.xlsx');
  }


  async GetBranchMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BrachDDLList = data['Data'];
          console.log(this.BrachDDLList)
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

  async GetGenderList() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetCommonMasterData('Gender')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GenderList = data['Data'];
        }, (error: any) => console.error(error)
      );
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

  async GetSemesterMaster() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SemesterDDLList = data['Data'];
          console.log(this.SemesterDDLList)
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

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest = new StudentRequestDataModal();
    this.RequestFormGroup.reset();
  }


  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }

  selectAllItems() {
    for (let item of this.StudentReqListList) {
      item.selected = this.meritMultiSelected;
    }
  }

  getSelectedItems(): any[] {
    return this.StudentReqListList.filter((item: any) => item.selected);
  }

}
