import { Component, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { StudentDetailDataModel_Hostel } from '../../../Models/Hostel-Management/StudentRequestDataModal';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { DownloadMarksheetSearchModel } from '../../../Models/DownloadMarksheetDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { RoomAllotmentDataModel } from '../../../Models/Hostel-Management/RoomAllotmentDataModel';
import { HostelRoomSeatSearchModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { HostelRoomDetailsService } from '../../../Services/HostelRoomDetails/hostel-room-details.service';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-direct-hostel-allotment',
  standalone: false,
  templateUrl: './direct-hostel-allotment.component.html',
  styleUrl: './direct-hostel-allotment.component.css'
})
export class DirectHostelAllotmentComponent {
  public sSOLoginDataModel = new SSOLoginDataModel(); 
  public studentRequest = new StudentDetailDataModel_Hostel();
  searchrequest = new DownloadMarksheetSearchModel();
  public Allotmentrequest = new RoomAllotmentDataModel();
  public searchRequestHostelRoom = new HostelRoomSeatSearchModel();
  
  public request: any;
  public AllotRequestFormGroup!: FormGroup;

  public StudentDetailsList: any = [];
  public RoomTypeDDLList: any = [];
  public RoomNoDDLList: any = [];
  public RelationQueryDDL: any = [];

  public ApplicationNo: string = '';
  public showStudentDetails: boolean = false;
  public isSubmitted: boolean = false;
  modalReference: NgbModalRef | undefined;

  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private toastr: ToastrService,
    private studentRequestService: StudentRequestService,
    private commonFunctionService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private Swal2: SweetAlert2,
    private modalService: NgbModal,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient,
    private hostelRoomDetailsService: HostelRoomDetailsService,
  ) {}

  async ngOnInit() {
    this.AllotRequestFormGroup = this.formBuilder.group({
      roomTypeId: ['', [DropdownValidators]],
      roomNoId: ['', [DropdownValidators]],
      fessAmount: [{ value: '', disabled: true }, Validators.required],
      relation: ['', [DropdownValidators]],
      contactPersonName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      mobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern(/^[6-9]\d{9}$/)]],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    await this.GetRoomTypeDDL();
    await this.GetReletionDDL();
  }

  get _AllotRequestFormGroup() { return this.AllotRequestFormGroup.controls; }

  async GetStudentDetails() {
    if(this.studentRequest.ApplicationNo == '') {
      this.toastr.error('Please enter Application No / Enrollment No');
      this.showStudentDetails = false;
      return;
    }
    try {
      this.StudentDetailsList = [] 
      await this.studentRequestService.GetStudentDetailsByENRno(this.studentRequest).then(async (data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if(data.State == EnumStatus.Success) {
          this.StudentDetailsList = data.Data;
          if(this.StudentDetailsList.length > 0) {
            this.showStudentDetails = true;
          }
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.error(error);
    }
  }

  async DownloadHostelForm(id: any) {
    try {

      this.loaderService.requestStarted();
      this.searchrequest.StudentID = this.sSOLoginDataModel.StudentID;
      this.searchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchrequest.Eng_NonEngID = this.sSOLoginDataModel.Eng_NonEng;
      await this.reportService.DownloadHostelAffidavit(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
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

  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf');
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];

      if (this.file) {
        //  Check file size (max 2MB)
        if (this.file.size > 2 * 1024 * 1024) {
          this.toastr.error('Select a file less than 2MB');
          return;
        }
        //  Proceed with upload
        this.loaderService.requestStarted();
        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            if (data.State == EnumStatus.Success) {
              if (Type === "affidavit") {
                this.studentRequest.AffidavitPhoto = data['Data'][0]["FileName"];
                this.studentRequest.Dis_AffidavitPhoto = data['Data'][0]["Dis_FileName"];
              }
              else if(Type === "feesReceipt") {
                this.Allotmentrequest.HostelFeesReciept = data['Data'][0]["FileName"];
                this.Allotmentrequest.Dis_HostelFeesReciept = data['Data'][0]["Dis_FileName"];
              }

              event.target.value = null; // Clear file input
            } else if (data.State === EnumStatus.Error) {
              this.toastr.error(data.ErrorMessage);
            } else if (data.State === EnumStatus.Warning) {
              this.toastr.warning(data.ErrorMessage);
            }
          })
          .catch((error: any) => {
            console.error("Upload Error:", error);
            this.toastr.error("An error occurred while uploading the file.");
          });
      }
    } catch (Ex) {
      console.log("Exception in file upload:", Ex);
      this.toastr.error("Unexpected error occurred.");
    } finally {
      this.loaderService.requestEnded();
    }
  }

  async openAllotmentModal(model: any) {
    if(this.studentRequest.AffidavitPhoto == '') {
      this.toastr.error('Please upload affidavit photo');
      return;
    }
    const userSubmitData = this.StudentDetailsList[0];
    try {
      this.request = { ...userSubmitData };
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  CloseAllotmentModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
  }

  async GetRoomTypeDDL() {    
    let HostelID = this.sSOLoginDataModel.HostelID;
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetRoomTypeDDLByHostel('HostelRoomSeatType', HostelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomTypeDDLList = data['Data'];

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

  async GetRoomNoDDL() {
    try {
      this.searchRequestHostelRoom.HostelID = this.sSOLoginDataModel.HostelID;
      this.searchRequestHostelRoom.RoomType = this.Allotmentrequest.RoomTypeId;
      this.searchRequestHostelRoom.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.loaderService.requestStarted();
      await this.hostelRoomDetailsService.GetRoomDDLList(this.searchRequestHostelRoom.HostelID, this.searchRequestHostelRoom.RoomType, this.searchRequestHostelRoom.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RoomNoDDLList = data['Data'];
          this.Allotmentrequest.FessAmount = this.RoomNoDDLList[0].FeePerBad
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

  async saveData() {
    this.isSubmitted = true;
    if (this.AllotRequestFormGroup.invalid) {
      return console.log("Form is invalid, cannot submit")
    }
    this.Allotmentrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.Allotmentrequest.InstituteId = this.sSOLoginDataModel.InstituteID
    this.Allotmentrequest.EndTermId = this.sSOLoginDataModel.EndTermID;

    this.Allotmentrequest.AffidavitPhoto = this.studentRequest.AffidavitPhoto;
    this.Allotmentrequest.Dis_AffidavitPhoto = this.studentRequest.Dis_AffidavitPhoto;
    this.Allotmentrequest.StudentID = this.StudentDetailsList[0].StudentID;
    this.Allotmentrequest.ApplicationNo = this.StudentDetailsList[0].ApplicationNo;
    this.Allotmentrequest.ModifyBy = this.sSOLoginDataModel.UserID;
    this.Allotmentrequest.HostelID = this.sSOLoginDataModel.HostelID;
    
    this.loaderService.requestStarted();
    try {
      
      await this.studentRequestService.DirectHostelSeatAllotment(this.Allotmentrequest)
        .then(async (data: any) => {

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControl();
            window.location.reload();

          } else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message);
            this.CloseAllotmentModal();
          }
          else {
            this.toastr.error(data.Message);
          }
        })
    }
    catch (ex) { console.error(ex) }
    
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.Allotmentrequest = new RoomAllotmentDataModel();
    this.AllotRequestFormGroup.reset();
  }

  async openOTPModal() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno

    // await for open model
    await this.childComponent.OpenOTPPopup();

    // await OTP verification
    await this.childComponent.waitForVerification();

    // do work
    await this.saveData();
  }

  async GetReletionDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.GetReletionDDL('RelationType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.RelationQueryDDL = data['Data'];
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

  allowOnlyAlphabets(event: KeyboardEvent) {
    const charCode = event.key;
    const pattern = /^[a-zA-Z\s]*$/;
    if (!pattern.test(charCode)) {
      event.preventDefault();
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
}
