import { Component, ViewChild } from '@angular/core';
import {
  ITIDispatchFormDataModel, ITIBundelDataModel, ITIDispatchSearchModel, ITIDispatchReceivedModel, ITIDownloadDispatchReceivedSearchModel, ITIDispatchPrincipalGroupCodeDataModel, ITIDispatchPrincipalGroupCodeSearchModel, ITIDispatchMasterStatusUpdate, ITICheckDateDispatchSearchModel,
  ITIUpdateFileHandovertoExaminerByPrincipalModel, ITICompanyDispatchMasterSearchModel
} from '../../../../Models/ITIDispatchFormDataModel';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumDispatchDDlValue, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-iti-received-dispatch-group',
  standalone: false,
  templateUrl: './iti-received-dispatch-group.component.html',
  styleUrl: './iti-received-dispatch-group.component.css'
})
export class ITIReceivedDispatchGroupComponent {
  public DispatchForm!: FormGroup
  public BundelForm!: FormGroup
  public SearchForm!: FormGroup

  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new ITIDispatchFormDataModel();
  public Searchrequest = new ITIDispatchSearchModel();
  public DownloadSearchrequest = new ITIDownloadDispatchReceivedSearchModel();
  public SearchBundelrequest = new ITIBundelDataModel();

  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public HrMasterFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public stateMasterDDL: any = []
  public PassingYearList: any = []
  public marktypelist: any = []
  public isSupplement: boolean = false
  calculatedPercentage: number = 0;
  public settingsMultiselect: object = {};
  public DispatchMasterSendToITIFromCenterList: any[] = [];
  public DispatchMasterListReceivedAtBterFromCenter: any = [];

  isAllSelected: boolean = false;
  //public BundelDataModellist: DispatchReceivedModel[] = [];

  public ApplicationID: number = 0;

  public _DispatchDDlValue = EnumDispatchDDlValue

  public action: string = ''
  public SubjectMasterDDLList: any = []

  public errormessage: string = ''

  StatusTypelist: any[] = [];
  public btnText: string = '';
  public IsBtn: boolean = false;
  public statusCh: number = 0;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private ITIdispatchService: ITIDispatchService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
    private reportService: ReportService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
  ) { }

  async ngOnInit() {
    this.settingsMultiselect = {
      singleSelection: false,
      idField: 'ID',
      textField: 'Name',
      enableCheckAll: true,
      selectAllText: 'Select All',
      unSelectAllText: 'Unselect All',
      allowSearchFilter: true,
      limitSelection: -1,
      clearSearchFilter: true,
      maxHeight: 197,
      itemsShowLimit: 10,
      searchPlaceholderText: 'Search...',
      noDataAvailablePlaceholderText: 'Not Found',
      closeDropDownOnSelection: false,
      showSelectedItemsAtTop: false,
      defaultOpen: false,
      IsVerified: false,
    };

    this.DispatchForm = this.formBuilder.group({
      txtDispatchDate: [''],
      txtCompanyName: [''],
      txtChallanNo: [''],
      txtSupplierName: [''],
      txtSupplierVehicleNo: [''],
      txtSupplierMobileNo: [''],
      txtSupplierDate: [''],
      txtRecipientName: [''],
      txtRecipientPost: [''],
      txtRecipientMobileNo: [''],
      txtRecipientDate: ['']
    });



    this.SearchForm = this.formBuilder.group(
      {
        txtSearchDate: [''],
      });

    this.BundelForm = this.formBuilder.group(
      {
        txtBundelNo: [''],
      });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.GetStatusType()
    this.Searchrequest.Status = 29;
  }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }

  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "ITIDispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == 51 || item.ID == 52);

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  toggleAllSelection() {
    this.DispatchMasterSendToITIFromCenterList.forEach((item: any) => {
      item.selected = this.isAllSelected;
    });
  }


  checkIfAllSelected() {
    this.isAllSelected = this.DispatchMasterSendToITIFromCenterList.length > 0 &&
      this.DispatchMasterSendToITIFromCenterList.every((item: any) => item.selected);
  }

  isAnyRowSelected(): boolean {
    return this.DispatchMasterSendToITIFromCenterList?.some((item: any) => item.selected);
  }

  async getgroupData() {

    //if (this.Searchrequest.Status == 0) {
    //  this.toastr.warning('Please select dispatch Status Type');
    //  return; 
    //}

    if (this.Searchrequest.Status == 29) {
      this.statusCh = 29;
    } else {
      this.statusCh = 0;
    }

    this.Searchrequest.Status;
    await this.GetAllData();

  }

  async ResetControl() {
    this.isSubmitted = false;
    this.Searchrequest.Status = 0;
    this.request = new ITIDispatchFormDataModel();
  }

  async GetAllData() {

    try {
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.Status = this.request.Status;

      const StatusID = this.Searchrequest.Status;
      if (StatusID == 29) {

        this.IsBtn = true;
        this.btnText = "Received Mark";
        this.Searchrequest.Action = "ViewDataSendtoITIFromCenter";

        this.loaderService.requestStarted();
        await this.ITIdispatchService.GetAllReceivedData(this.Searchrequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.DispatchMasterSendToITIFromCenterList = data['Data'];

            console.log(this.DispatchMasterSendToITIFromCenterList)
          }, error => console.error(error));

      }
      if (StatusID == 30) {
        this.IsBtn = false;
        /* this.btnText = "ReceivedAtBterFromCenter";*/
        this.Searchrequest.Action = "ViewDataReceivedAtBterFromCenter";


        this.loaderService.requestStarted();
        await this.ITIdispatchService.GetAllReceivedData(this.Searchrequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.DispatchMasterListReceivedAtBterFromCenter = data['Data'];

            console.log(this.DispatchMasterListReceivedAtBterFromCenter)
          }, error => console.error(error));
      }
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


  async CancelData() {

  }

  async submitSelected() {
    try {
      const isAnySelected = this.DispatchMasterSendToITIFromCenterList.some(x => x.selected)
      if (!isAnySelected) {
        this.toastr.warning('Please select at least one record !');
        return;
      }
      this.openOTP();

    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async CheckOtpAfterSave() {
    const Selected = this.DispatchMasterSendToITIFromCenterList.filter(x => x.selected == true)
    Selected.forEach((e: any) => { e.Status = 30, e.ModifyBy = this.sSOLoginDataModel.UserID })

    this.loaderService.requestStarted();
    //call
    await this.ITIdispatchService.OnSTatusUpdateByITI(Selected).then(
      (data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {

          this.toastr.success(this.Message)

          /*    this.CloseOTPModal()*/
          this.GetAllData()

          this.DispatchMasterSendToITIFromCenterList.forEach((item: any) => item.selected = false);
          this.isAllSelected = false

        } else {
          this.toastr.error(data.ErrorMessage)
        }
      },
      (error: any) => console.error(error)
    );
  }

  // Optional: delete row
  deleteRow(index: number) {
    this.DispatchMasterSendToITIFromCenterList.splice(index, 1);
    this.checkIfAllSelected();
  }

  async DownloadDispatchGroupForm(DispatchID: number = 0) {

    console.log(DispatchID);

    try {
      this.DownloadSearchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.DownloadSearchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.DownloadSearchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.DownloadSearchrequest.DispatchID = DispatchID;
      this.DownloadSearchrequest.Action = "DownloadDispatchReceived";
      this.loaderService.requestStarted();
      await this.ITIdispatchService.GetDownloadDispatchReceived(this.DownloadSearchrequest)
        // await this.reportService.GetDispatchPrincipalGroupCodeDetails(this.DownloadSearchrequest.DispatchID, this.DownloadSearchrequest.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DownloadFile(data.Data, 'file download');

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

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }

  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.CheckOtpAfterSave();
      console.log("otp verified on the page")
    })
  }
}


