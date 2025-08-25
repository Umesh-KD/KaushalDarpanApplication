import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants,  EnumITIDispatchDDlValue } from '../../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { SweetAlert2 } from '../../../../Common/SweetAlert2'
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';

import { ITIDispatchSearchModel } from '../../../../Models/ITIDispatchFormDataModel';
import { ITIDispatchService } from '../../../../Services/ITIDispatch/ITIDispatch.service';

@Component({
  selector: 'app-iti-dispatch-group-list',
  standalone: false,
  templateUrl: './iti-dispatch-group-list.component.html',
  styleUrl: './iti-dispatch-group-list.component.css'
})
export class ITIDispatchGroupListComponent {
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public ExaminersList: any[] = [];
  public StatusTypelist: any[] = [];
  public Table_SearchText: any = '';
  public AllSelect: boolean = false;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new ITIDispatchSearchModel();
  public UserID: number = 0;
  public StaffID: number = 0
  isInstituteDisabled: boolean = false; // Set true to disable

  public CommonSubjectYesNo: number = 1;
  public CommonSubjectDDLList: any[] = [];
  public _enumrole = EnumRole
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public collegeId: number = 0;
  public EndTermID: number = 0;
  public CourseTypeID: number = 0;

  public _DispatchDDlValue = EnumITIDispatchDDlValue
  public CheckStatuID: number = 0;
  @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private commonMasterService: CommonFunctionService,
    private ITIDispatchService: ITIDispatchService,
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



    this.getInstituteMasterList();
    this.GetStatusType()
    this.collegeId = 0;
    this.searchRequest.Status = 0;
  }

  async getgroupData() {


    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;

    if (this.searchRequest.Status == 0) {
      this.searchRequest.Status = 0;
      this.collegeId = 1;
    } else {
      this.collegeId = 0;

    }

    //searchRequest.InstituteID
    try {
      await this.ITIDispatchService.GetAllGroupData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExaminersList = data.Data;


        this.ExaminersList = this.ExaminersList.filter((item: any) => item.StatusID == this.searchRequest.Status)

        if (this.ExaminersList.length > 0) {
          this.CheckStatuID = this.ExaminersList[0]["StatusID"];
        }



        console.log("this.ExaminersList", this.ExaminersList)



      })
    } catch (error) {
      console.error(error);
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

  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "ITIDispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == 53);

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ResetControl()
  {
    this.isSubmitted = false;
    this.searchRequest.InstituteID = 0;
    this.searchRequest.Status = 0;
    this.getgroupData()
  }

  async OnSTatusUpdate() {
    try {

      const isAnySelected = this.ExaminersList.some(x => x.Selected)
      if (!isAnySelected) {
        this.toastr.warning('Please select at least one College!');
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

  openOTP() {
    this.childComponent.MobileNo = this.sSOLoginDataModel.Mobileno;
    this.childComponent.OpenOTPPopup();

    this.childComponent.onVerified.subscribe(() => {
      this.CheckOtpAfterSave();
      console.log("otp verified on the page")
    })
  }

  async CheckOtpAfterSave() {
    const Selected = this.ExaminersList.filter(x => x.Selected == true)
    Selected.forEach((e: any) => { e.Status = 19, e.ModifyBy = this.sSOLoginDataModel.UserID })
    this.loaderService.requestStarted();

    await this.ITIDispatchService.OnSTatusUpdate(Selected).then(
      (data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {

          this.toastr.success(this.Message)
          this.getgroupData()
          this.ExaminersList.forEach(item => item.Selected = false);
          this.AllSelect = false
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      },
      (error: any) => console.error(error)
    );
  }

  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.ExaminersList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }

  async DownloadDispatchGroupForm(ID: number) {
    try {
      this.loaderService.requestStarted();
      this.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.CourseTypeID = this.sSOLoginDataModel.Eng_NonEng
      await this.reportService.GetDispatchGroupDetails(ID, this.EndTermID, this.CourseTypeID)
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

  async btnDelete_OnClick(ID: number) {
    this.UserID = this.sSOLoginDataModel.UserID
    this.Swal2.Confirmation("Are you sure you want to transfer this dispatch group code from BTER to the college ?",

      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ITIDispatchService.DeleteGroupById(ID, this.UserID)
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




}
