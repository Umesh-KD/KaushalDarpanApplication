import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DispatchFormDataModel, BundelDataModel, DispatchSearchModel, DispatchReceivedModel, DownloadDispatchReceivedSearchModel, DispatchMasterStatusUpdate } from '../../../Models/DispatchFormDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DispatchService } from '../../../Services/Dispatch/Dispatch.service';
import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumDispatchDDlValue, GlobalConstants } from '../../../Common/GlobalConstants';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-DispatchSuperintendentDetailsList',
  templateUrl: './DispatchSuperintendentDetailsList.component.html',
  styleUrls: ['./DispatchSuperintendentDetailsList.component.css'],
  standalone: false
})
export class DispatchSuperintendentDetailsListComponent implements OnInit {
  public DispatchForm!: FormGroup
  public BundelForm!: FormGroup
  public SearchForm!: FormGroup

  public RadioForm!: FormGroup
  public CompanyMasterDDLList: any[] = [];
  public BoardList: any = []
  public request = new DispatchFormDataModel();
  public Searchrequest = new DispatchSearchModel();
  public DownloadSearchrequest = new DownloadDispatchReceivedSearchModel();
  public SearchBundelrequest = new BundelDataModel();

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
  public DispatchMasterSendToBterFromCenterList: any = [];
  public DispatchMasterListReceivedAtBterFromCenter: any = [];

  isAllSelected: boolean = false;
  public BundelDataModellist: DispatchReceivedModel[] = [];
  public DispatchMasterStatusUpdate: DispatchMasterStatusUpdate[] = [];
  public statusCh: number = 0;


  public ApplicationID: number = 0;

  public _DispatchDDlValue = EnumDispatchDDlValue

  public action: string = ''
  public SubjectMasterDDLList: any = []

  public errormessage: string = ''

  StatusTypelist: any[] = [];
  public btnText: string = '';
  public IsBtn: boolean = false;
  public UserID: number = 0;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonMasterService: CommonFunctionService,
    private dispatchService: DispatchService,
    private reportService: ReportService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
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

    await this.GetStatusType();
    this.statusCh = 0;

    this.Searchrequest.Status = 1;
    await this.GetAllData();

  }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }


  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "Dispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == this._DispatchDDlValue.SendToBterFromCenter || item.ID == this._DispatchDDlValue.ReceivedAtBterFromCenter);

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }


  async getgroupData() {
    
    //if (this.Searchrequest.Status == 0) {
    //  this.toastr.warning('Please select dispatch Status Type');
    //  return; 
    //}

    if (this.Searchrequest.Status == 1) {
      this.statusCh = this.Searchrequest.Status;
    } else {
      this.statusCh = 0;
    }
    
    this.Searchrequest.Status;
    await this.GetAllData();


   
  }
  async ResetControl() {
    this.Searchrequest.Status = 0;

  }


  async submitSelected() {
    try {
      const selectedItems = this.DispatchMasterSendToBterFromCenterList.filter((item: any) => item.selected == true);
      console.log('Selected items:', selectedItems);


      if (selectedItems.length == 0) {
        this.toastr.warning('Please select at least one record');
        return; 
      }
      this.openOTP(); 
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

  }

  async CheckOtpAfterSave() {

    const selectedItems = this.DispatchMasterSendToBterFromCenterList.filter((item: any) => item.selected == true);
    console.log('Selected items:', selectedItems);


    for (const item of selectedItems) {
      this.DispatchMasterStatusUpdate.push({
        DispatchID: item.DispatchID,

        Status: this._DispatchDDlValue.SendToBterFromCenter,

        ModifyBy: this.sSOLoginDataModel.UserID,

      } as DispatchMasterStatusUpdate);
    }
    console.log('checkbox_with', this.DispatchMasterStatusUpdate)

    this.isSubmitted = true;
    this.loaderService.requestStarted();
    this.isLoading = true;

    await this.dispatchService.OnSTatusUpdateDispatchMaster(this.DispatchMasterStatusUpdate)
      .then(async (data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          this.toastr.success(this.Message)
          /* this.ResetControl();*/
          this.DispatchMasterStatusUpdate = [];
          this.isAllSelected = false;
          await this.GetAllData();
        }
        else if (this.State == EnumStatus.Error) {
          this.toastr.error(this.ErrorMessage);
        }
      })
  }


  toggleAllSelection() {
    this.DispatchMasterSendToBterFromCenterList.forEach((item: any) => {
      item.selected = this.isAllSelected;
    });
  }


  checkIfAllSelected() {
    this.isAllSelected = this.DispatchMasterSendToBterFromCenterList.length > 0 &&
      this.DispatchMasterSendToBterFromCenterList.every((item: any) => item.selected);
  }


  async applyFilter(statusId: number) {
    
    this.DispatchMasterSendToBterFromCenterList = [];
    this.Searchrequest.Status = +statusId;
    this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.Searchrequest.Status = statusId;
    await this.GetAllData();
  }



  async GetAllData() {
    try {
      this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.request.Status = this.request.Status;
      this.loaderService.requestStarted();
      await this.dispatchService.GetAllDataDispatchMaster(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DispatchMasterSendToBterFromCenterList = data['Data'];

          this.DispatchMasterSendToBterFromCenterList = this.DispatchMasterSendToBterFromCenterList.filter((item: any) => item.StatusID == this.Searchrequest.Status)


          console.log(this.DispatchMasterSendToBterFromCenterList)
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

  async btnDelete_OnClick(ID: number) {
    this.UserID = this.sSOLoginDataModel.UserID
    this.Swal2.Confirmation("Are you sure you want to Remove this ?",

      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.dispatchService.DeleteDispatchMasterById(ID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //reload
                  this.GetAllData();
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
  async DownloadFileDispatch(DispatchID: number = 0) {

    console.log(DispatchID);

    try {
      this.DownloadSearchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.DownloadSearchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.DownloadSearchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.DownloadSearchrequest.DispatchID = DispatchID;

      this.loaderService.requestStarted();
      await this.reportService.GetDispatchSuperintendentRptReport(DispatchID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data,'daattaaaaa')
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

















