import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../../Common/appsetting.service';
import { EnumEMProfileStatus, EnumRole, EnumStatus, EnumTransferStatus, GlobalConstants } from '../../../../../Common/GlobalConstants';
import { RequestSearchModel } from '../../../../../Models/ITI/UserRequestModel';
import { JoiningLetterSearchModel, RelievingLetterSearchModel, RequestUpdateStatus } from '../../../../../Models/ITIGovtEMStaffMasterDataModel';
import { SSOLoginDataModel } from '../../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../../Services/CommonFunction/common-function.service';
import { ITIGovtEMStaffMaster } from '../../../../../Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';
import { LoaderService } from '../../../../../Services/Loader/loader.service';
import { UserRequestService } from '../../../../../Services/UserRequest/user-request.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-user-request-list-transfer',
  standalone: false,
  templateUrl: './user-request-list-transfer.component.html',
  styleUrl: './user-request-list-transfer.component.css'
})
export class UserRequestListTransferComponent {
  groupForm!: FormGroup;
  public searchRequest = new RequestSearchModel();
  public searchRequestJoining = new JoiningLetterSearchModel();
  public searchRequestRelieving = new RelievingLetterSearchModel();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public RequestUpdateStatus = new RequestUpdateStatus();

  public UserRequestList: any[] = [];
  public filteredStatusList: any[] = [];
  public StaffTypeList: any[] = []
  public Table_SearchText: string = "";
  modalReference: NgbModalRef | undefined;
  public OfficeList: any = [];
  public LevelList: any = [];
  public ExamOfLevelList: any = [];
  public ExamTypeList: any = [];
  public UserRequestHistoryList: any[] = [];
  public PostList: any = [];

  public DepartmentID: number = 0;
  public isSubmitted: boolean = false;
  public _EnumRole = EnumRole
  public type: string=''
  public RowlistData = new RequestUpdateStatus;
  public _EnumEMProfileStatus = EnumEMProfileStatus; 
  _EnumTransferStatus = EnumTransferStatus;
  @ViewChild('MyModel_ReplayQuery') MyModel_ReplayQuery: any;
  closeResult: string | undefined;

  constructor(
    private commonMasterService: CommonFunctionService, 
    private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster,
    private toastr: ToastrService, 
    private loaderService: LoaderService, 
    private modalService: NgbModal, 
    private userRequestService: UserRequestService, 
    private fb: FormBuilder, 
    public appsettingConfig: AppsettingService,
    public http: HttpClient,
  ) { }

  async ngOnInit() {

    this.groupForm = this.fb.group({
      txtRemark: ['', Validators.required],
      txtJoiningDate: ['', Validators.required],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    await this.GetStatusList();
    await this.GetLevelList();
    await this.GetStaffTypeData();
    await this.GetPostList();
    
    await this.UserRequest_GetData();
  }
  get _groupForm() { return this.groupForm.controls; }

  async GetStaffTypeData() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData('ITI_StaffType').then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.StaffTypeList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetStatusList() {

    try {
      this.loaderService.requestStarted();
      this.type = 'ITIvtARRStauts';
      await this.commonMasterService.AllDDlManageByTypeCommanMaster(this.type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.filteredStatusList = data['Data'];
          this.filteredStatusList = this.filteredStatusList.filter((item: any) => item.ID != this._EnumEMProfileStatus.Pending && item.ID != this._EnumEMProfileStatus.Completed && item.ID != this._EnumEMProfileStatus.LockAndSubmit && item.ID != this._EnumEMProfileStatus.Revert)
          console.log(this.filteredStatusList, "GetStatusList")
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
  async GetPostList() {
    try {
      await this.commonMasterService.GetCommonMasterData('PostMaster', -1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PostList = data['Data'];
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetLevelList() {
    try {
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelList = data['Data'];
          console.log(this.LevelList, "LevelList")
        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async GetOfficeList() {    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DDL_OfficeMaster(this.sSOLoginDataModel.DepartmentID, this.searchRequest.LevelID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.OfficeList = data['Data'];
          console.log(this.OfficeList, "OfficeList")
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

  CloseModal() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.RequestUpdateStatus.StatusIDs = 0;
    this.RequestUpdateStatus.Remark = '';
    this.isSubmitted = false;
  }

  async ResetControl() {
    this.isSubmitted = false;
    this.searchRequest.RequestType = 0;
    this.searchRequest.LevelID = 0;
    this.searchRequest.PostID = 0;
    this.searchRequest.OfficeID = 0;
    this.searchRequest.StaffTypeID = 0;
    this.searchRequest.OrderNo = "";
    await this.UserRequest_GetData();
  }

  async UserRequest_GetData() {
    try {
      this.searchRequest.PageNumber =0
      this.searchRequest.PageSize = 0
      this.searchRequest.Action = "LIST";
      this.searchRequest.UserId = this.sSOLoginDataModel.UserID;
      this.loaderService.requestStarted();
      await this.userRequestService.UserRequest_GetData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestList = data.Data;

        }, (error: any) => console.error(error))
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

  DownloadFile(FileName: string): void {
    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;;
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = FileName; // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }

  //async JoiningLetter(UserID: number) {
  //  try {
  //    this.searchRequestJoining.UserID = UserID;
  //    this.loaderService.requestStarted();

  //    await this.ITIGovtEMStaffMasterService.DownloadJoiningLetter_pdf(this.searchRequestJoining)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if(data.State == EnumStatus.Success){
  //          this.DownloadFile(data.Data);
  //        }
          
  //      }, (error: any) => {
  //        console.error(error);
  //      });
  //  } catch (Ex) {
  //    console.log(Ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  
  //async RelievingLetter(UserID: number) {
  //  try {
  //    this.searchRequestRelieving.UserID = UserID;
  //    this.loaderService.requestStarted();

  //    await this.ITIGovtEMStaffMasterService.DownloadRelievingLetter_pdf(this.searchRequestRelieving)
  //      .then((data: any) => {          
  //        data = JSON.parse(JSON.stringify(data));
  //        if(data.State == EnumStatus.Success){
  //          this.DownloadFile(data.Data);
  //        }
  //      }, (error: any) => {
  //        console.error(error);
  //      });

  //  } catch (Ex) {
  //    console.log(Ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async onUserRequestHistorylist(model: any, ServiceRequestId: number) {
    try {
      this.loaderService.requestStarted();
      this.searchRequest.ServiceRequestId = ServiceRequestId;
      await this.userRequestService.UserRequestHistoryList(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.UserRequestHistoryList = data.Data;

        }, (error: any) => console.error(error))

      console.log(ServiceRequestId, "modal");
      this.modalReference = this.modalService.open(model, { size: 'lg', backdrop: 'static' });
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

  CloseModalRequestHistorylist() {
    this.modalService.dismissAll();
    this.modalReference?.close();
    this.isSubmitted = false;
  }

  async onSubmitStaffRequest(model: any, userSubmitData: any) {
    try {
      this.RowlistData = { ...userSubmitData };
      console.log(this.RequestUpdateStatus, "modal");
      this.modalReference = this.modalService.open(model, { size: 'sm', backdrop: 'static' });

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  parseDDMMYYYY(dateStr: string): Date {
    const [dd, mm, yyyy] = dateStr.split('-');
    return new Date(+yyyy, +mm - 1, +dd);
  }
  async updateReqStatus() {
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }


    const joiningDate = new Date(this.RequestUpdateStatus.JoiningDate);
    const requestDate = this.parseDDMMYYYY(this.RowlistData.RequestDate);

    // remove time part (important for accurate comparison)
    joiningDate.setHours(0, 0, 0, 0);
    requestDate.setHours(0, 0, 0, 0);

    if (joiningDate < requestDate) {
      this.toastr.error("Joining Date should be greater than or equal to Relieving Date");
      return;
    }

    try {
      this.RequestUpdateStatus.CreatedBy = this.sSOLoginDataModel.UserID;
      this.RequestUpdateStatus.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.RequestUpdateStatus.ServiceRequestId = this.RowlistData.ServiceRequestId;
      this.RequestUpdateStatus.RequestType = this.RowlistData.RequestTypeID;
      this.RequestUpdateStatus.UserID = this.RowlistData.UserID;
      this.RequestUpdateStatus.StatusIDs = EnumTransferStatus.Request_for_Join;

      await this.userRequestService.UserRequestUpdateStatus(this.RequestUpdateStatus)
        .then(async (data: any) => {
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.CloseModal();
            await this.UserRequest_GetData();
            this.RequestUpdateStatus = new RequestUpdateStatus();
          }
          else if (data.State == EnumStatus.Warning) {
            this.toastr.warning(data.Message)
          }
          else {
            this.toastr.error(data.ErrorMessage)
          }
        })
    }
    catch (ex) { console.log(ex) }
  }


  async RelievingLetter(UserID: number) {
    try {
      this.searchRequestRelieving.UserID = UserID;
      this.loaderService.requestStarted();

      const blob: any = await this.ITIGovtEMStaffMasterService
        .DownloadRelievingLetter_pdf(this.searchRequestRelieving);

      const now = new Date();
      const timestamp =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

      const fileName = `ITI_Relieving_Letter_${timestamp}.pdf`;

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error: any) {
      console.error(error);

    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }





  async JoiningLetter(UserID: number) {
    try {
      this.searchRequestRelieving.UserID = UserID;
      this.loaderService.requestStarted();

      const blob: any = await this.ITIGovtEMStaffMasterService
        .DownloadJoiningLetter_pdf(this.searchRequestRelieving);

      const now = new Date();
      const timestamp =
        now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + '_' +
        String(now.getHours()).padStart(2, '0') + '-' +
        String(now.getMinutes()).padStart(2, '0') + '-' +
        String(now.getSeconds()).padStart(2, '0');

      const fileName = `ITI_Joining_Letter_${timestamp}.pdf`;

      // Create blob URL
      const blobUrl = window.URL.createObjectURL(blob);

      // Create anchor and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

    } catch (error: any) {
      console.error(error);

    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  exportToExcel(): void {

    const exportData = this.UserRequestList.map((row: any, index: number) => ({
      'S No': index + 1,
      'Request Type': row.RequestType || '',
      'User': row.UserName || '',
      'Transfer Level': row.LevelName || '',
      'Transfer Office': row.OfficeName || '',
      'Transfer Post': row.PostName || '',
      'Relieving Institute': row.RelievingInstitute || '',
      'Transfer Institute': row.InstituteName || '',
      'Staff Type': row.StaffType || '',
      'Order No': row.OrderNo || '',
      'Order Date': row.OrderDate || '',
      'Relieving Date': row.RequestDate || '',
      'Joining Date': row.JoiningDate || '',
      'Request Date': row.RequestDate || '',
      'Staff Request Status': row.RequestStatus || '',
      'Request Remarks': row.RequestRemarks || ''
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);

    ws['!cols'] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 25 },
      { wch: 20 },
      { wch: 25 },
      { wch: 25 },
      { wch: 35 },
      { wch: 35 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 40 }
    ];

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transfer Requests');

    XLSX.writeFile(wb, 'TransferRequests.xlsx');
  }



  exportToPDF(): void {

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // Heading
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(
      'User Request List',
      pageWidth / 2,
      10,
      { align: 'center' }
    );

    const body = this.UserRequestList.map((row: any, index: number) => [
      index + 1,
      row.RequestType || '',
      row.UserName || '',
      row.LevelName || '',
      row.OfficeName || '',
      row.PostName || '',
      row.RelievingInstitute || '',
      row.InstituteName || '',
      row.StaffType || '',
      row.OrderNo || '',
      row.OrderDate || '',
      row.RequestDate || '',
      row.JoiningDate || '',
      row.RequestDate || '',
      row.RequestStatus || '',
      row.RequestRemarks || ''
    ]);

    autoTable(doc, {
      startY: 18, // Space below heading

      head: [[
        'S No',
        'Request Type',
        'User',
        'Transfer Level',
        'Transfer Office',
        'Transfer Post',
        'Relieving Institute',
        'Transfer Institute',
        'Staff Type',
        'Order No',
        'Order Date',
        'Relieving Date',
        'Joining Date',
        'Request Date',
        'Request Status',
        'Remarks'
      ]],

      body,

      theme: 'grid',

      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        textColor: [0, 0, 0],
        fillColor: [255, 255, 255],
        lineColor: [0, 0, 0],
        lineWidth: 0.1,
        overflow: 'linebreak'
      },

      headStyles: {
        fillColor: [255, 255, 255],
        textColor: [0, 0, 0],
        fontStyle: 'bold'
      },

      columnStyles: {
        6: { cellWidth: 30 },
        7: { cellWidth: 30 },
        15: { cellWidth: 35 }
      }
    });

    doc.save('UserRequestList.pdf');
  }
}
