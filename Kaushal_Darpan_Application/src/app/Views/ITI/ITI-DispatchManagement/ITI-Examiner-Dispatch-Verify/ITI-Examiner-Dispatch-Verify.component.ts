import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, EnumITIDispatchDDlValue } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ScholarshipSearchModel } from '../../../../Models/ScholarshipDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';
import { ITIDispatchGroupSearchModel } from '../../../../Models/ITIDispatchGroupDataModel';
import { ITI_Dispatch_ShowbundleSearchModel } from '../../../../Models/ITIDispatchFormDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { ITI_DispatchAdmin_ByExaminer_RptSearchModel } from '../../../../Models/TheoryMarksDataModels';
@Component({

  selector: 'app-ITI-Examiner-Dispatch-Verify',
  standalone: false,
  templateUrl: './ITI-Examiner-Dispatch-Verify.component.html',
  styleUrl: './ITI-Examiner-Dispatch-Verify.component.css'
})
export class ITIExaminerDispatchVerifyComponent {

    public SemesterMasterDDLList: any[] = [];
    public StreamMasterDDLList: any[] = [];
    public InstituteMasterDDLList: any[] = [];
    public GroupList: any[] = [];
    public ExamList: any[] = [];
    public GroupMasterDDLList: any[] = [];
    public StatusTypelist: any[] = [];
  public Table_SearchText: any = '';
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public AllSelect: boolean = false;

    public isSubmitted: boolean = false;
    public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITI_Dispatch_ShowbundleSearchModel();
    public UserID: number = 0;
    public StaffID: number = 0
    isInstituteDisabled: boolean = false; // Set true to disable

    public CommonSubjectYesNo: number = 1;
    public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  public _DispatchDDlValue = EnumITIDispatchDDlValue
  public searchRequestRDLC = new ITI_DispatchAdmin_ByExaminer_RptSearchModel();
  public SearchDDLValue: number = 0;
  public DashBoardStatuID: number = -1
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

    constructor(
      private commonMasterService: CommonFunctionService,
      private DispatchService: ITIDispatchService,
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
      
      this.GetStatusType()

      const statusParam = this.activatedRoute.snapshot.paramMap.get('Status');
      if (statusParam !== null && !isNaN(Number(statusParam)) && statusParam.trim() !== '') {
        this.DashBoardStatuID = Number(statusParam);
      }

      console.log(this.DashBoardStatuID);

      if (this.DashBoardStatuID !== -1) {
        this.searchRequest.StatusID = this.DashBoardStatuID;
       
        this.getgroupteacherData();
        

      } else {
        this.searchRequest.StatusID = 1;
      }

      /*this.getgroupteacherData()*/
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

    async getgroupteacherData() {

      this.SearchDDLValue= this.searchRequest.StatusID ;
      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;     
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID; 
      this.searchRequest.UserID = this.sSOLoginDataModel.UserID; 
   
     
      try {
        await this.DispatchService.GetITI_Dispatch_ShowbundleByExaminerToAdminData(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GroupList = data.Data;
          if (this.searchRequest.StatusID == 1) {
            this.searchRequest.StatusID = 1
          }
          console.log("this.ExaminersList", this.GroupList)
        })
      } catch (error) {
        console.error(error);
      }
    }



    //async btnDelete_OnClick(ID: number) {
    //  this.UserID = this.sSOLoginDataModel.UserID
    //  this.Swal2.Confirmation("Are you sure you want to Remove this ?",

    //    async (result: any) => {
    //      //confirmed
    //      if (result.isConfirmed) {
    //        try {
    //          this.loaderService.requestStarted();
    //          await this.DispatchService.DeleteGroupById(ID, this.UserID)
    //            .then(async (data: any) => {
    //              data = JSON.parse(JSON.stringify(data));

    //              if (data.State == EnumStatus.Success) {
    //                this.toastr.success(data.Message)
    //                //reload
    //                this.getgroupteacherData();
    //              }
    //              else {
    //                this.toastr.error(data.ErrorMessage)
    //              }

    //            }, (error: any) => console.error(error)
    //            );
    //        }
    //        catch (ex) {
    //          console.log(ex);
    //        }
    //        finally {
    //          setTimeout(() => {
    //            this.loaderService.requestEnded();
    //          }, 200);
    //        }
    //      }
    //    });
    //}

    async ResetControl() {
      this.isSubmitted = false;
      /*    this.SubjectMasterDDLList = [];*/
      //this.searchRequest.InstituteID = 0;
      this.searchRequest.StatusID = 0;
      this.getgroupteacherData()


    }


    async GetStatusType() {

      try {
        this.loaderService.requestStarted();
        const Type = "ITIDispatch";
        await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.StatusTypelist = data['Data'];
            this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == this._DispatchDDlValue.VerifyByExaminer || item.ID == this._DispatchDDlValue.HandOverToPrincipalByExaminer);


            const rawList = this.StatusTypelist || [];


            const updatedList = rawList.map((item: any) => {
              if (item.ID === this._DispatchDDlValue.VerifyByExaminer) {
                return { ...item, Name: 'Send Copy Bundle By Examiner' };
              }
              if (item.ID === this._DispatchDDlValue.HandOverToPrincipalByExaminer) {
                return { ...item, Name: 'Hand Over By Examiner' };
              }
              return item;
            });
            console.log(updatedList);
            this.StatusTypelist = updatedList.filter(
              (item: any) =>
                item.ID === this._DispatchDDlValue.VerifyByExaminer ||
                item.ID === this._DispatchDDlValue.HandOverToPrincipalByExaminer
            );



            console.log("this.StatusTypelist", this.StatusTypelist)

          }, error => console.error(error));
      } catch (Ex) {
        console.log(Ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
        }, 200);
      }
    }






  async DownloadDispatchGroupCertificate(ID: number, StaffID: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      this.searchRequestRDLC.ExaminerID = StaffID;
      this.searchRequestRDLC.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequestRDLC.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequestRDLC.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequestRDLC.UserID = this.sSOLoginDataModel.UserID;

      await this.reportService.GetITI_Dispatch_ShowbundleByExaminerToAdminData(this.searchRequestRDLC)
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
  DownloadFile(FileName: string, DownloadfileName?: any): void {

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

  async OnSTatusUpdateByExaminer() {
    
    const isAnySelected = this.GroupList.some(x => x.Selected)
    if (!isAnySelected) {
      this.toastr.warning('Please select at least one Item!');
      return;
    }
    this.openOTP();
    
  }






  async CheckOtpAfterSave() {

    const Selected = this.GroupList.filter(x => x.Selected == true)
    Selected.forEach((e: any) => { e.Status = this._DispatchDDlValue.VerifyByExaminer, e.ModifyBy = this.sSOLoginDataModel.UserID })
    this.loaderService.requestStarted();

    try {
      await this.DispatchService.OnSTatusUpdateByExaminer(Selected).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.getgroupteacherData()

            this.GroupList.forEach(item => item.Selected = false);
            this.AllSelect = false

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        },
        (error: any) => console.error(error)
      );


    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }




  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.GroupList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }


  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.CheckOtpAfterSave();
      console.log("otp verified on the page")
    })
  }


  async UpdateVerifiedAndSentToPrincipalByExaminer() {
    debugger
    const isAnySelected = this.GroupList.some(x => x.Selected)
    if (!isAnySelected) {
      this.toastr.warning('Please select at least one Item!');
      return;
    }
    this.openOTPVerifiedAndSentToPrincipalByExaminer();

  }



  openOTPVerifiedAndSentToPrincipalByExaminer() {
    
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.CheckOtpAfterUpdateVerifiedAndSentToPrincipalByExaminer();
      console.log("otp verified on the page")
    })
  }


  async CheckOtpAfterUpdateVerifiedAndSentToPrincipalByExaminer() {
      this.loaderService.requestStarted();
    const Selected = this.GroupList.filter(x => x.Selected == true)
    Selected.forEach((e: any) => { e.Status = this._DispatchDDlValue.HandOverToPrincipalByExaminer, e.ModifyBy = this.sSOLoginDataModel.UserID })
 

    try {
      await this.DispatchService.BundelNoSendToThePrincipalByTheExaminer(Selected).then(
        (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {

            this.toastr.success(this.Message)

            /*    this.CloseOTPModal()*/
            this.getgroupteacherData()

            this.GroupList.forEach(item => item.Selected = false);
            this.AllSelect = false

          } else {
            this.toastr.error(data.ErrorMessage)
          }
        },
        (error: any) => console.error(error)
      );


    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  }

