import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { DispatchFormDataModel, BundelDataModel, DispatchSearchModel, DispatchReceivedModel, DownloadDispatchReceivedSearchModel } from '../../../Models/DispatchFormDataModel';
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
  selector: 'app-received-dispatch-group',
  standalone: false,
  templateUrl: './received-dispatch-group.component.html',
  styleUrl: './received-dispatch-group.component.css'
})
export class ReceivedDispatchGroupComponent {
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
  public DispatchMasterSendToBterFromCenterList: any[] = [];
  public DispatchMasterListReceivedAtBterFromCenter: any = [];

  isAllSelected: boolean = false;
  public BundelDataModellist: DispatchReceivedModel[] = [];

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
    private dispatchService: DispatchService,
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
      const Type = "Dispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == 29 || item.ID == 30);

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

    //this.StatusTypelist = [
    //  { ID: 16, Name: 'Send to Bter From Center' },
    //  { ID: 18, Name: 'Recived at Bter From Center' },

    //];
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

  isAnyRowSelected(): boolean {
    return this.DispatchMasterSendToBterFromCenterList?.some((item: any) => item.selected);
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
    this.request = new DispatchFormDataModel();
  }


//  async submitSelected() {

//    const isAnySelected = this.DispatchMasterSendToBterFromCenterList.some((x: any) => x.Selected)

//    if (!isAnySelected) {
//      this.toastr.error('Please select at least one Item!');
//      return;
//    }


//    const selectedItems = this.DispatchMasterSendToBterFromCenterList.filter((item: any) => item.selected);

//    selectedItems.forEach((e: any) => { e.Status = 20, e.ModifyBy = this.sSOLoginDataModel.UserID })




//    await this.dispatchService.OnSTatusUpdateByBTER(selectedItems)
//      .then((data: any) => {
//        this.State = data['State'];
//        this.Message = data['Message'];
//        this.ErrorMessage = data['ErrorMessage'];

//        if (this.State == EnumStatus.Success) {
//          this.toastr.success(this.Message)
//          /* this.ResetControl();*/
//          this.GetAllData();
//        }
//        else if (this.State == EnumStatus.Error) {
//          this.toastr.error(this.ErrorMessage);
//        }
//      })
//  }
//  catch(ex) { console.log(ex) }
//    finally {
//  setTimeout(() => {
//    this.loaderService.requestEnded();
//    this.isLoading = false;

//  }, 200);
//}



//  }

  async submitSelected() {
  try {
    const isAnySelected = this.DispatchMasterSendToBterFromCenterList.some(x => x.selected)
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
    const Selected = this.DispatchMasterSendToBterFromCenterList.filter(x => x.selected == true)
    Selected.forEach((e: any) => { e.Status = 30, e.ModifyBy = this.sSOLoginDataModel.UserID })

    this.loaderService.requestStarted();
    //call
    await this.dispatchService.OnSTatusUpdateByBTER(Selected).then(
      (data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {

          this.toastr.success(this.Message)

          /*    this.CloseOTPModal()*/
          this.GetAllData()

          this.DispatchMasterSendToBterFromCenterList.forEach((item: any) => item.selected = false);
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
    this.DispatchMasterSendToBterFromCenterList.splice(index, 1);
    this.checkIfAllSelected();
  }




  //async applyFilter(statusId: number) {

  //  this.Searchrequest.Status = +statusId;
  //  this.Searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  this.Searchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
  //  this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //  this.Searchrequest.Status = statusId;
  //  await this.GetAllData();



  //}


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
        this.Searchrequest.Action = "ViewDataSendtoBterFromCenter";

        this.loaderService.requestStarted();
        await this.dispatchService.GetAllReceivedData(this.Searchrequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.DispatchMasterSendToBterFromCenterList = data['Data'];

            console.log(this.DispatchMasterSendToBterFromCenterList)
          }, error => console.error(error));

      }
      if (StatusID == 30) {
        this.IsBtn = false;
        /* this.btnText = "ReceivedAtBterFromCenter";*/
        this.Searchrequest.Action = "ViewDataReceivedAtBterFromCenter";


        this.loaderService.requestStarted();
        await this.dispatchService.GetAllReceivedData(this.Searchrequest)
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

  //async ResetControl() {
  //  this.isSubmitted = false;
  //  this.request = new DispatchFormDataModel();
  //}




  btnRowDelete_OnClick(row: BundelDataModel) {
    const index = this.request.BundelDataModel.findIndex(x => x.BundelNo === row.BundelNo);
    if (index !== -1) {
      this.request.BundelDataModel.splice(index, 1);
    }
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
      await this.dispatchService.GetDownloadDispatchReceived(this.DownloadSearchrequest)
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
