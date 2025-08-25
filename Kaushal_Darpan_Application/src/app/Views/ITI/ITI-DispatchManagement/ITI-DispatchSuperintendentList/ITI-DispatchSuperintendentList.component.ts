import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ITIDispatchFormDataModel, ITIBundelDataModel, ITIDispatchSearchModel, ITIDispatchReceivedModel, ITIDownloadDispatchReceivedSearchModel } from '../../../../Models/ITIDispatchFormDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';
import { EnumCourseType, EnumDepartment, EnumLateralCourse, EnumStatus, EnumITIDispatchDDlValue, GlobalConstants } from '../../../../Common/GlobalConstants';
import { ActivatedRoute } from '@angular/router';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { max } from 'rxjs';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { ReportService } from '../../../../Services/Report/report.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';

@Component({
  selector: 'app-ITI-DispatchSuperintendentList',
  templateUrl: './ITI-DispatchSuperintendentList.component.html',
  styleUrls: ['./ITI-DispatchSuperintendentList.component.css'],
  standalone: false
})
export class ITIDispatchSuperintendentListComponent implements OnInit {
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
  public DispatchMasterSendToBterFromCenterList: any = [];
  public DispatchMasterListReceivedAtBterFromCenter: any = [];

  isAllSelected: boolean = false;
  public BundelDataModellist: ITIDispatchReceivedModel[] = [];

  public ApplicationID: number = 0;

  public _DispatchDDlValue = EnumITIDispatchDDlValue

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
    private dispatchService: ITIDispatchService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private Swal2: SweetAlert2,
    private encryptionService: EncryptionService,
    private appsettingConfig: AppsettingService,
    private http: HttpClient,
    private reportService: ReportService
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
    this.statusCh = 0;
    this.Searchrequest.Status = 51;
  }

  get _DispatchForm() { return this.DispatchForm.controls; }
  get _SearchForm() { return this.SearchForm.controls; }



  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "ITIDispatch";
      await this.commonMasterService.GetITIddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];


          const rawList = this.StatusTypelist || [];


          const updatedList = rawList.map((item: any) => {
                if (item.ID === this._DispatchDDlValue.SendToBterFromCenter) {
                  return { ...item, Name: 'Receive from Center' };
                }
                if (item.ID === this._DispatchDDlValue.ReceivedAtBterFromCenter) {
                  return { ...item, Name: 'Received at ITI' };
                }
                return item;
          });
          console.log(updatedList);
          this.StatusTypelist = updatedList.filter(
                (item: any) =>
                  item.ID === this._DispatchDDlValue.SendToBterFromCenter ||
                  item.ID === this._DispatchDDlValue.ReceivedAtBterFromCenter
              );

         

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

  async submitSelected() {
    try {
      const selectedItems = this.DispatchMasterSendToBterFromCenterList.filter((item: any) => item.selected == true);

      if (selectedItems.length == 0) {
        this.toastr.warning('Please select at least one record.');
        return; // Exit the function if no rows are selected
      }
      this.openOTP();
      console.log('Selected items:', selectedItems);

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
      this.BundelDataModellist.push({
        DispatchID: item.DispatchID,
        DispatchDate: item.DispatchDate,
        Status: this._DispatchDDlValue.ReceivedAtBterFromCenter,
        DispatchReceivedID: 0,
        CreatedBy: this.sSOLoginDataModel.UserID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        IPAddress: '',
      } as ITIDispatchReceivedModel);
    }
    console.log('checkbox_with', this.BundelDataModellist)
    this.isSubmitted = true;
    this.loaderService.requestStarted();
    this.isLoading = true;

    await this.dispatchService.SaveDispatchReceived(this.BundelDataModellist)
      .then(async (data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];

        if (this.State == EnumStatus.Success) {
          this.toastr.success(this.Message)
          /* this.ResetControl();*/
          this.isAllSelected = false;
          this.BundelDataModellist = [];
          await this.GetAllData();
        }
        else if (this.State == EnumStatus.Error) {
          this.toastr.error(this.ErrorMessage);
        }
      })

  }


  // Optional: delete row
  deleteRow(index: number) {
    this.DispatchMasterSendToBterFromCenterList.splice(index, 1);
    this.checkIfAllSelected();
  }

  async getgroupData() {
    
    //if (this.Searchrequest.Status == 0) {
    //  this.toastr.warning('Please select dispatch Status Type');
    //  return;
    //}

    if (this.Searchrequest.Status == this._DispatchDDlValue.SendToBterFromCenter) {
      this.statusCh = this._DispatchDDlValue.SendToBterFromCenter;
    } else if (this.Searchrequest.Status == this._DispatchDDlValue.ReceivedAtBterFromCenter) {
      this.statusCh = this._DispatchDDlValue.ReceivedAtBterFromCenter;
    }
    else {
      this.statusCh = 0;
    }

    this.Searchrequest.Status;
    await this.GetAllData();



  }


  async ResetControl() {
    this.Searchrequest.Status = 0;
    this.isSubmitted = false;
    this.request = new ITIDispatchFormDataModel();
  }


  async applyFilter(statusId: number) {

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

      const StatusID = this.Searchrequest.Status;
      if (StatusID == this._DispatchDDlValue.SendToBterFromCenter) {

        this.IsBtn = true;
        this.btnText = "Received Mark";
        this.Searchrequest.Action = "ViewDataSendtoFromCenter";

        this.loaderService.requestStarted();
        await this.dispatchService.GetAllData(this.Searchrequest)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];
            this.DispatchMasterSendToBterFromCenterList = data['Data'];

            console.log(this.DispatchMasterSendToBterFromCenterList)
          }, error => console.error(error));

      }
      if (StatusID == this._DispatchDDlValue.ReceivedAtBterFromCenter) {
        this.IsBtn = false;
        /* this.btnText = "ReceivedAtBterFromCenter";*/
        this.Searchrequest.Action = "ViewDataReceivedAtFromCenter";


        this.loaderService.requestStarted();
        await this.dispatchService.GetAllData(this.Searchrequest)
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



  onDateChange(event: any): void {

    const selectedDate = event.target.value;
    console.log('Selected Date:', selectedDate);

    // Example: call API or filter data based on date
    this.searchBundelDataByDate(selectedDate);
  }
  async searchBundelDataByDate(date: string) {
    try {
      this.SearchBundelrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.SearchBundelrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.SearchBundelrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.SearchBundelrequest.ExamDate = date;
      

      this.loaderService.requestStarted();

      const data: any = await this.dispatchService.GetBundelDataAllData(this.SearchBundelrequest);
      const result = JSON.parse(JSON.stringify(data));

      this.request.BundelDataModel = [];

      if (Array.isArray(result.Data)) {
        this.request.BundelDataModel = result.Data.map((item: any) => ({
          ...item,
          ExamDate: this.SearchBundelrequest.ExamDate,
          CenterCode: this.SearchBundelrequest.CenterCode
        }));
      } else if (result.Data) {
        const item = {
          ...result.Data,
          ExamDate: this.SearchBundelrequest.ExamDate,
          CenterCode: this.SearchBundelrequest.CenterCode
        };
        this.request.BundelDataModel.push(item);
      }

      this.State = result.State;
      this.Message = result.Message;
      this.ErrorMessage = result.ErrorMessage;

      console.log(this.request.BundelDataModel);
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async CancelData() {

  }

  btnRowDelete_OnClick(row: ITIBundelDataModel) {
    const index = this.request.BundelDataModel.findIndex(x => x.BundelNo === row.BundelNo);
    if (index !== -1) {
      this.request.BundelDataModel.splice(index, 1);
    }
  }

  async DownloadFileReceived(DispatchID: number = 0) {

    console.log(DispatchID);

    try {
      this.DownloadSearchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.DownloadSearchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.DownloadSearchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.DownloadSearchrequest.DispatchID = DispatchID;

      this.loaderService.requestStarted();
      await this.reportService.GetITIDispatchSuperintendentRptReport1(DispatchID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, 'daattaaaaa')
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

















