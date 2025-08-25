import { Component, ViewChild } from '@angular/core';
import { EnumRole, EnumStatus, GlobalConstants, EnumDispatchDDlValue } from '../../../../Common/GlobalConstants';
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
import {
  ITIDispatchFormDataModel, ITIBundelDataModel, ITIDispatchSearchModel, ITIDispatchReceivedModel, ITIDownloadDispatchReceivedSearchModel, ITIDispatchPrincipalGroupCodeDataModel, ITIDispatchPrincipalGroupCodeSearchModel, ITIDispatchMasterStatusUpdate, ITICheckDateDispatchSearchModel,
  ITIUpdateFileHandovertoExaminerByPrincipalModel, ITICompanyDispatchMasterSearchModel, ITICompanyDispatchIUMasterModel, ITICompanyDispatchIUMasterSearchModel
} from '../../../../Models/ITIDispatchFormDataModel';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';
import { StudentMarksheetSearchModel } from '../../../../Models/OnlineMarkingReportDataModel';

@Component({
  selector: 'app-iti-companydispatchlist',
  standalone: false,
  templateUrl: './iti-companydispatchlist.component.html',
  styleUrl: './iti-companydispatchlist.component.css'
})
export class ITICompanydispatchlistComponent { 
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
  public searchRequest = new ITICompanyDispatchIUMasterSearchModel();
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
  public MarksheetSearch = new StudentMarksheetSearchModel();

  constructor(
    private commonMasterService: CommonFunctionService,
    private ITICompanyDispatchService: ITIDispatchService,
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



   // this.getInstituteMasterList();
   // this.GetStatusType()
    this.getgroupData()
    this.collegeId = 0;

  }




  async getgroupData()
  {

    this.searchRequest.departmentID = this.sSOLoginDataModel.DepartmentID;
    this.searchRequest.courseTypeID = this.sSOLoginDataModel.Eng_NonEng;
    this.searchRequest.endTermID = this.sSOLoginDataModel.EndTermID;

    //searchRequest.InstituteID
    try {
      await this.ITICompanyDispatchService.GetAllData_CompanyDispatchList(this.searchRequest).then((data: any) => {
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
    this.routers.navigate(['/ITIupdatecompanydispatch', id]);
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
            await this.ITICompanyDispatchService.DeleteDataCompanyDispatchByID(ID, this.UserID)
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



  

}
