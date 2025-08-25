import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, EnumRevalDispatchDDlValue } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ScholarshipSearchModel } from '../../../Models/ScholarshipDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../Services/Report/report.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SweetAlert2 } from '../../../Common/SweetAlert2'
import { DispatchRevalService } from '../../../Services/Dispatch-Reval/DispatchReval.service';
import { DispatchGroupSearchModel } from '../../../Models/DispatchGroupDataModel';
import { DispatchPrincipalGroupCodeSearchModel, DownloadDispatchReceivedSearchModel, UpdateStatusDispatchPrincipalGroupCodeModel } from '../../../Models/DispatchFormDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
@Component({
  selector: 'app-AdminRevalGroupCodeReceived-list',
  standalone: false,
  templateUrl: './AdminRevalGroupCodeReceived-list.component.html',
  styleUrl: './AdminRevalGroupCodeReceived-list.component.css'
})
export class AdminRevalGroupCodeReceivedlistComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public DispatchPrincipalGroupCodeList: any[] = [];
  public DispatchPrincipalGroupCodeList1: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public StatusTypelist: any[] = [];
  public Table_SearchText: any = '';

  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new DispatchPrincipalGroupCodeSearchModel();
  public DownloadSearchrequest = new DownloadDispatchReceivedSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  isAllSelected: boolean = false;
  public UpdateStatusDispatchlist: UpdateStatusDispatchPrincipalGroupCodeModel[] = [];
  public isLoading: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public _DispatchDDlValue = EnumRevalDispatchDDlValue
  public StatusID: number = 0;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  public IsPending: boolean = false;


  constructor(
    private commonMasterService: CommonFunctionService,
    private DispatchRevalService: DispatchRevalService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private Swal2: SweetAlert2,
    private reportService: ReportService,
    public appsettingConfig: AppsettingService,
    private http: HttpClient
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.UserID = this.sSOLoginDataModel.UserID;
    this.searchRequest.Status = 87

    this.getInstituteMasterList();
    this.GetStatusType();
    this.IsPending = false;
   /* this.getgroupData();*/

  }

  async getSemesterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDLList = data.Data;
        console.log("SemesterMasterDDLList", this.SemesterMasterDDLList);
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

 

  async getgroupData() {
    
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Status = this.searchRequest.Status;

    if (this.searchRequest.Status == 87) {
      this.IsPending = true;
    } else {
      this.IsPending = false;
    }


    try {
      await this.DispatchRevalService.GetRevalDispatchGroupcodeList(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DispatchPrincipalGroupCodeList1 = data.Data;
        console.log(this.StatusID, "status")
       
        


        /*this.DispatchPrincipalGroupCodeList1 = this.DispatchPrincipalGroupCodeList1.filter((item: any) => item.StatusID == sID)*/
       

        console.log("this.DispatchPrincipalGroupCodeList", this.DispatchPrincipalGroupCodeList1)
      })
    } catch (error) {
      console.error(error);
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

            let requestData: any = {
              ID: ID,
              ModifyBy: this.sSOLoginDataModel.UserID
            }
            await this.DispatchRevalService.RevalDeleteDispatchPrincipalGroupCode(requestData)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  //reload
                  this.getgroupData();
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

  async ResetControl() {
    this.isSubmitted = false;
    /*    this.SubjectMasterDDLList = [];*/
    this.searchRequest.InstituteID = 0;
    this.searchRequest.Status = 0;
    this.getgroupData()


  }


  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "RevalDispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == this._DispatchDDlValue.AdminToPrincipalDespoistReply);

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  async getInstituteMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InstituteMasterDDLList = data.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  //async DownloadDispatchGroupForm(DispatchID: number = 0) {

  //  console.log(DispatchID);

  //  try {
  //    this.DownloadSearchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //    this.DownloadSearchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
  //    this.DownloadSearchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //    this.DownloadSearchrequest.DispatchID = DispatchID;
  //    this.DownloadSearchrequest.Action = "DownloadDispatchReceived";
  //    this.loaderService.requestStarted();
  //    await this.DispatchRevalService.GetDownloadDispatchReceived(this.DownloadSearchrequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.DownloadFile(data.Data, 'file download');

  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }

  //}

  //DownloadFile(FileName: string, DownloadfileName: any): void {

  //  const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.ReportsFolder + "/" + FileName;

  //  this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
  //    const downloadLink = document.createElement('a');
  //    const url = window.URL.createObjectURL(blob);
  //    downloadLink.href = url;
  //    downloadLink.download = this.generateFileName('pdf');
  //    downloadLink.click();
  //    window.URL.revokeObjectURL(url);
  //  });
  //}
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }


  toggleAllSelection() {
    // Update all the rows based on the state of "Select All" checkbox (isAllSelected)
    this.DispatchPrincipalGroupCodeList1.forEach((item: any) => {
      item.selected = this.isAllSelected;
    });
  }

  // Check if all rows are selected to update the "Select All" checkbox
  checkIfAllSelected() {
    // Check if all rows are selected, and set the "Select All" checkbox accordingly
    const allSelected = this.DispatchPrincipalGroupCodeList1.every((item: any) => item.selected);
    this.isAllSelected = allSelected; // Update the "Select All" checkbox state
  }



  //isAnyRowSelected(): boolean {
  //  return this.DispatchPrincipalGroupCodeList?.some((item: any) => item.selected);
  //}

  async submitSelected() {
    
    const selectedItems = this.DispatchPrincipalGroupCodeList1.filter((item: any) => item.selected == true);
  
    if (selectedItems.length == 0) {
      this.toastr.warning('Please select at least one row to update status.');
      return; // Exit the function if no rows are selected
    }
    this.openOTP();

  }



  async CheckOtpAfterSave() {

    const selectedItems = this.DispatchPrincipalGroupCodeList1.filter((item: any) => item.selected == true);
    for (const item of selectedItems) {
      this.UpdateStatusDispatchlist.push({
        DPGCID: item.DPGCID,
        DepartmentID: this.sSOLoginDataModel.DepartmentID,
        CourseTypeID: this.sSOLoginDataModel.Eng_NonEng,
        EndTermID: this.sSOLoginDataModel.EndTermID,
        CreatedBy: this.sSOLoginDataModel.UserID,
        Status: this._DispatchDDlValue.AdminToPrincipalDespoistReply,
        Action: '',
        InstituteID: this.sSOLoginDataModel.InstituteID,

      } as UpdateStatusDispatchPrincipalGroupCodeModel);
    }


    this.isSubmitted = true;
    this.loaderService.requestStarted();
    this.isLoading = true;
    try {
      await this.DispatchRevalService.OnSTatusUpdateDispatchl(this.UpdateStatusDispatchlist)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)

            this.isAllSelected = false;
            this.UpdateStatusDispatchlist = [];
            await this.getgroupData();

          }
          else if (this.State == EnumStatus.Error) {
            this.toastr.error(this.ErrorMessage);
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

  // Optional: delete row
  deleteRow(index: number) {
    this.DispatchPrincipalGroupCodeList.splice(index, 1);
    this.checkIfAllSelected();
  }



  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.CheckOtpAfterSave();
      console.log("otp verified on the page")
    })
  }


  //async SearchFilter() {
  //  

  //  this.DispatchPrincipalGroupCodeList = [];

  //  if (this.searchRequest.Status == 1) {
  //    this.StatusID = 0;
  //  } else if (this.searchRequest.Status == 29) {
  //    this.StatusID = 29;
  //  } else {
  //    this.StatusID = 0;
  //  }
  //  this.getgroupData();


  //}


  async DownloadDispatchGroupForm(DispatchID: number = 0) {

    console.log(DispatchID);

    try {
      this.DownloadSearchrequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.DownloadSearchrequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.DownloadSearchrequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.DownloadSearchrequest.DispatchID = DispatchID;
      this.DownloadSearchrequest.Action = "DownloadDispatchReceived";
      this.loaderService.requestStarted();
      await this.DispatchRevalService.GetRevalDownloadDispatchReceived(this.DownloadSearchrequest)
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



}
