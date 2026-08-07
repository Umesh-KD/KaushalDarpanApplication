import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumGrievanceStaus, EnumRole, EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { SeatSearchModel, SeatMetrixModel } from '../../Models/SeatMatrixDataModel';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SeatMatrixService } from '../../Services/ITISeatMatrix/seat-matrix.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { GrievanceDataModel, GrivienceResponseDataModel, GrivienceSearchModel } from '../../Models/GrievanceData/GrievanceDataModel';
import { GrievanceService} from '../../Services/Grievance/grievance.service';
import { AppsettingService } from '../../Common/appsetting.service';


@Component({
  selector: 'app-GrievanceList',
  standalone: false,
  templateUrl: './GrievanceList.component.html',
  styleUrl: './GrievanceList.component.css'
})


export class GrievanceListComponent implements OnInit {

  public Table_SearchText: string = "";
  GrievanceFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  public request = new GrievanceDataModel();
  public Responserequest = new GrivienceResponseDataModel();
  //public ShowSeatMetrixList: SeatMetrixModel[] = [];
  public FinancialYear: any = [];
  public AllotmentTypeList: any = [];
  public DepartmentList: any = [];
  public CategoryList: any = [];
  public SubMasterList: any = [];
  public ShowGrievanceList: any = [];
  selectedOption: any = 0;
  public sSOLoginDataModel = new SSOLoginDataModel();

  public GrivienceList: any[] = [];

  public StatusList: any = [];
  public ResponseList: any = [];

  public ReplyBox: boolean = false;
  public isDepartmentDisabled: boolean = false;
  public Remark: string = '';
  _EnumGrievanceStaus = EnumGrievanceStaus;

  public SearchRequest = new GrivienceSearchModel();
  @ViewChild('modal_Grivience') modal_Grivience: any;
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private seatMatrixService: SeatMatrixService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private _GrievanceService: GrievanceService,
    private appsettingConfig: AppsettingService

  ) {

  }

  async ngOnInit() {
    
    this.GrievanceFormGroup = this.formBuilder.group({
        ddlCategoryID: ['', []],
        ddlDepartmentID: ['', []],
        ddlModuleID: ['', []],
        SubjectRelated: ['', []],
        ddlFinancialYearID: ['', []],
        ddlAllotmentId: ['', []],
        ddlStatusID: ['', []]
      })
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.loadDropdownData('FinancialYears');
    this.loadDropdownData('AllotmentType');

    //this.ShowSeatMetrix();
    this.GetDDl_StatusForGrivience();

    this.loadDropdownData('QueryFor');
    this.loadDropdownData('Grievance Category');
    await this.setDepartmentId();
    await this.GetMaterData();
    await this.GetStatusForGrivience();
    
    //await this.ShowAllData();
  }

  async IsReplyBox() {
    this.ReplyBox = true;
  }
  async closeReply() {
    this.ReplyBox = false;
  }


  get form() { return this.GrievanceFormGroup.controls; }
  // Load data for dropdown based on MasterCode

  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'QueryFor':
          this.DepartmentList = data['Data'];
          break;
        case 'Grievance Category':
          this.CategoryList = data['Data'];
          console.log(this.CategoryList, "CategoryList")
          break;
        default:
          break;
      }
    });
  }

  async setDepartmentId() {
    this.GrievanceFormGroup.get('ddlDepartmentID')?.disable();
    if (this.sSOLoginDataModel.DepartmentID === 1) {
      this.request.DepartmentID = 89;
      this.GetMasterSubDDL();
    }
    else {
      if(this.sSOLoginDataModel.RoleID === EnumRole.DTETraing) {
        this.request.DepartmentID = 88;
      }
      this.request.DepartmentID = 88;
      this.GetMasterSubDDL();
    }
  }

  async GetMasterSubDDL() {
    try {
      this.selectedOption = this.request.DepartmentID
      await this.commonMasterService.GetSubjectForCitizenSugg(this.selectedOption)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubMasterList = data['Data'];
          console.log("QueryFor", this.SubMasterList);
        }, (error: any) => console.error(error)
        );
    }
    catch (ex) {
      console.log(ex);
    }
  }


  async GetStatusForGrivience() {
    this.commonMasterService.GetDDl_StatusForGrivience().then((data: any) => {
      this.StatusList = data['Data'];
    });
  }

  async GetMaterData() {
    try {
      this.loaderService.requestStarted();
      this.SearchRequest.DepartmentID = this.request.DepartmentID;
      this.SearchRequest.CategoryID = this.request.CategoryID;
      this.SearchRequest.ModuleID = this.request.ModuleID;
      this.SearchRequest.StatusID = this.request.StatusID;
      this.SearchRequest.CreatedBy = 0;
      await this._GrievanceService.GetAllData(this.SearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GrivienceList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }


  async DataSearch() {
    
    await this.GetMaterData()

  }

  async openGriviencePopup(content: any, item: any) {
    
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

    debugger
    this.Responserequest = item;

    if (item.StatusID == EnumGrievanceStaus.Resolved) {
      this.Responserequest.StatusID = EnumGrievanceStaus.Re_Open;
    }
    else {
      this.Responserequest.StatusID = 0;
    }
    this.Responserequest.Remark = '';

    console.log(this.Responserequest,'Responserequest')
    await this.GetResponseData();
  }
 
  private getDismissReason(reason: any): string {
    
    return `with: ${reason}`;
    
  }

  CloseModal() {
    this.modalService.dismissAll();
    this.isSubmitted = false;
  }

  async GetDDl_StatusForGrivience() {
    try {
      
      await this.commonMasterService.GetDDl_StatusForGrivience()
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          this.StatusList = data['Data'];
          console.log("QueryFor", this.StatusList);
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

  async CloseViewMenuDetails() {


    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();

      this.loaderService.requestEnded();
     
    }, 200);
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.Responserequest.ResponseFileAttachment = data['Data'][0]["FileName"];
                this.Responserequest.DisResponseFileName = data['Data'][0]["Dis_FileName"];

              }
              event.target.value = null;
            }
            if (data.State == EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage)
            }
            else if (data.State == EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

  async SaveData() {
    
    this.loaderService.requestStarted();
    this.isLoading = true;

    if (this.sSOLoginDataModel.StudentID > 0) {
      this.Responserequest.CreatedBy = this.sSOLoginDataModel.StudentID;
      this.Responserequest.ModifyBy = this.sSOLoginDataModel.StudentID;
    }
    else {
      this.Responserequest.CreatedBy = this.sSOLoginDataModel.UserID;
      this.Responserequest.ModifyBy = this.sSOLoginDataModel.UserID;
    }

    try {
      await this._GrievanceService.GrivienceResponseSaveData(this.Responserequest)
        .then(async (data: any) => {
          if (data.State = EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.CloseModal();
            this.GrivienceList;
            await this.GetMaterData();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new GrievanceDataModel();
    this.GrievanceFormGroup.reset();
    this.setDepartmentId();
    // Reset form values if necessary
    //this.CitizenSuggestionFormGroup.patchValue({});
  }


  async GetResponseData() {
    try {
      this.loaderService.requestStarted();
      this.SearchRequest.GrivienceID = this.Responserequest.GrivienceID;
      await this._GrievanceService.GetResponseData(this.SearchRequest)
        .then((data: any) => {
          this.ResponseList = data['Data'];
          if (data.State = EnumStatus.Success) {
            this.ResetControl();
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }
  }
}
