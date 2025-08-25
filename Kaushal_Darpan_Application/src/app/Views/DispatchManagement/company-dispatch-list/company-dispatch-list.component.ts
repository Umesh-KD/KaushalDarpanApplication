import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, EnumDispatchDDlValue } from '../../../Common/GlobalConstants';
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
import { CompanyDispatchService } from '../../../Services/CompanyDispatch/CompanyDispatch.service';
import { CompanyDispatchIUMasterSearchModel } from '../../../Models/DispatchFormDataModel';
import { DispatchSearchModel } from '../../../Models/DispatchFormDataModel';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
@Component({
  selector: 'app-company-dispatch-list',
  standalone: false,
  templateUrl: './company-dispatch-list.component.html',
  styleUrl: './company-dispatch-list.component.css'
})
export class CompanyDispatchListComponent {
  public SemesterMasterDDLList: any[] = [];
  public StreamMasterDDLList: any[] = [];
  public InstituteMasterDDLList: any[] = [];
  public CompanyDispatchList: any[] = [];
  public ExamList: any[] = [];
  public GroupMasterDDLList: any[] = [];
  public StatusTypelist: any[] = [];
  public Table_SearchText: any = '';
  public AllSelect: boolean = false;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CompanyDispatchIUMasterSearchModel();
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

  public _DispatchDDlValue = EnumDispatchDDlValue
  public CheckStatuID: number = 0;
    @ViewChild('otpModal') childComponent!: OTPModalComponent;

  constructor(
    private commonMasterService: CommonFunctionService,
    private CompanyDispatchService: CompanyDispatchService,
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
     this.getgroupData()
    this.collegeId = 0;
  
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
    

    this.searchRequest.departmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.courseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.endTermID = this.sSOLoginDataModel.EndTermID;

    

    //searchRequest.InstituteID
    try {
      await this.CompanyDispatchService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CompanyDispatchList = data.Data;


       
       
        

        console.log("this.CompanyDispatchList", this.CompanyDispatchList)



      })
    } catch (error) {
      console.error(error);
    }
  }

  onEdit(id: number): void {

    // Navigate to the edit page with the institute ID
    this.routers.navigate(['/updatecompanydispatch', id]);
    console.log(id)
  }

  async btnDelete_OnClick(ID: number) {
    this.UserID = this.sSOLoginDataModel.UserID
    this.Swal2.Confirmation("Are you sure you want to delete this ?",

      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.CompanyDispatchService.DeleteDataCompanyDispatchByID(ID, this.UserID)
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
   
    this.getgroupData()


  }


  async GetStatusType() {

    try {
      this.loaderService.requestStarted();
      const Type = "Dispatch";
      await this.commonMasterService.GetddlCenterDownloadOrReceived(Type)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StatusTypelist = data['Data'];
          this.StatusTypelist = this.StatusTypelist.filter((item: any) => item.ID == 19);

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


 
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.${extension}`;
  }


  checkboxthView_checkboxchange(isChecked: boolean) {
    this.AllSelect = isChecked;
    for (let item of this.CompanyDispatchList) {
      item.Selected = isChecked;  // Set all checkboxes based on the parent checkbox state
    }
  }


  async OnSTatusUpdate() {
    try {

      const isAnySelected = this.CompanyDispatchList.some(x => x.Selected)
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



  async CheckOtpAfterSave() {
    const Selected = this.CompanyDispatchList.filter(x => x.Selected == true)
    Selected.forEach((e: any) => { e.Status = 19, e.ModifyBy = this.sSOLoginDataModel.UserID })
    this.loaderService.requestStarted();
   
    await this.CompanyDispatchService.OnSTatusUpdate(Selected).then(
      (data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {

          this.toastr.success(this.Message)
          this.getgroupData()
          this.CompanyDispatchList.forEach(item => item.Selected = false);
          this.AllSelect = false
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      },
      (error: any) => console.error(error)
    );
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
