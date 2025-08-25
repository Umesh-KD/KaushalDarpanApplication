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

import { DispatchGroupSearchModel } from '../../../Models/DispatchGroupDataModel';
import { DispatchSearchModel } from '../../../Models/DispatchFormDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { DispatchRevalService } from '../../../Services/Dispatch-Reval/DispatchReval.service';
@Component({

  selector: 'app-examiner-dispatch-reval-verify',
  standalone: false,
  templateUrl: './examiner-dispatch-reval-verify.component.html',
  styleUrl: './examiner-dispatch-reval-verify.component.css'
})
  export class ExaminerDispatchRevalVerifyComponent {

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
    public searchRequest = new DispatchSearchModel();
    public UserID: number = 0;
    public StaffID: number = 0
    isInstituteDisabled: boolean = false; // Set true to disable

    public CommonSubjectYesNo: number = 1;
    public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  public _DispatchDDlValue = EnumRevalDispatchDDlValue


  @ViewChild('otpModal') childComponent!: OTPModalComponent;

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
      this.GetStatusType()
      this.searchRequest.Status = 76;
      this.getgroupteacherData()
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


      this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.searchRequest.SSOID = this.sSOLoginDataModel.SSOID
      
     
      try {
        await this.DispatchRevalService.getRevalgroupExaminerData(this.searchRequest).then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.GroupList = data.Data;
          //if (this.searchRequest.Status == 1) {
          //  this.searchRequest.Status = 1
          //}
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
    //          await this.DispatchRevalService.DeleteGroupById(ID, this.UserID)
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
      this.searchRequest.InstituteID = 0;
      this.searchRequest.Status = 0;
      this.getgroupteacherData()


    }


    async GetStatusType() {

      try {
        this.loaderService.requestStarted();
        const Type = "RevalDispatch";
        await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));
            this.StatusTypelist = data['Data'];
            this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == this._DispatchDDlValue.ExaminerVerifiedByToPrincipal
              || item.ID == this._DispatchDDlValue.ExaminerSendBundle
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
      try {
        this.loaderService.requestStarted();

        await this.reportService.DownloadRevalDispatchGroupCertificate(ID, StaffID, this.sSOLoginDataModel.DepartmentID)
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
    Selected.forEach((e: any) => { e.Status = this._DispatchDDlValue.ExaminerVerifiedByToPrincipal, e.ModifyBy = this.sSOLoginDataModel.UserID })
    this.loaderService.requestStarted();

    try {
      await this.DispatchRevalService.OnRevalSTatusUpdateByExaminer(Selected).then(
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
    const Selected = this.GroupList.filter(x => x.Selected == true)
    Selected.forEach((e: any) => { e.Status = this._DispatchDDlValue.ExaminerSendBundle, e.ModifyBy = this.sSOLoginDataModel.UserID })
    this.loaderService.requestStarted();

    try {
      await this.DispatchRevalService.RevalBundelNoSendToThePrincipalByTheExaminer(Selected).then(
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

