import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { EnumRole, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ReturnDteItemDataModel } from '../../../../Models/DTEInventory/DTEIssuedItemDataModel';
import { ApprenticeReportServiceService } from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service'
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-pmnam-mela-report-before-after',
  standalone: false,
  templateUrl: './pmnam-mela-report-before-after.component.html',
  styleUrl: './pmnam-mela-report-before-after.component.css'
})
export class PMNAMMelaReportBeforeAfterComponent {


  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private appsettingConfig: AppsettingService,
    private routers: Router,
    private commonMasterService: CommonFunctionService,
    private ApprenticeShipRPTService: ApprenticeReportServiceService,
    //private CommonFunctionService: CommonFunctionService,


  ) { }

  public EstablishmentsRegisterNoBefore: string = '';
  public NumberofSeatBefore: string = '';
  public NumberofEmployedStudentBefore: string = '';
  public EstablishmentsRegisterNoAfter: string = '';
  public NumberofSeatAfter: string = '';
  public NumberofEmployedStudentAfter: string = '';
  public BeforeDate: string = '';
  public AfterDate: string = '';
  public Remarks: string = '';
  //public FinancialYearID: number = 0;
  SelectedFinancialYearID: number = 0;
  FinancialYearName: string = '';
  MonthID: number = 0;
  BeforeMonth: string= '';
  id: number = 0;
  public FinYearList: any = [];

  IsDisable: boolean = false;
  buttonLabel: string = 'Submit'
  public SSOLoginDataModel = new SSOLoginDataModel()
  public PNMMelaDocument: string = '';
  public provisionLetterDocument: string = '';

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];


  async ngOnInit()
  {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const Editid = sessionStorage.getItem('PMNAM_BeforeAfterRPTEditId');
    const ISEDIT = Number(sessionStorage.getItem('ISEDIT'))??0

    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetReportDatabyID(parseInt(Editid));
      console.log(Editid);
      this.buttonLabel = 'Update';
    }
    if (this.SSOLoginDataModel.RoleID != 97 || Number(Editid) > 0 && ISEDIT==0) {
      this.IsDisable = true;
    }
    else {
      this.IsDisable =false
    }
    await this.YearDropdownData('FinancialYear_IIP');

  }


  async Submit() {
    debugger
    if (this.EstablishmentsRegisterNoBefore == '' || this.NumberofSeatBefore == '' || this.NumberofEmployedStudentBefore == '' || this.EstablishmentsRegisterNoAfter == '' || this.NumberofSeatAfter == '' || this.NumberofEmployedStudentAfter == '')
    {
      this.toastr.warning("Please Enter All Required Fields !")
      return;
    }
    let obj = {
      EstablishmentsRegisterNoBefore : this.EstablishmentsRegisterNoBefore,
      NumberofSeatBefore :this.NumberofSeatBefore,
      NumberofEmployedStudentBefore  : this.NumberofEmployedStudentBefore ,
      EstablishmentsRegisterNoAfter: this.EstablishmentsRegisterNoAfter ,
      NumberofSeatAfter: this.NumberofSeatAfter ,
      NumberofEmployedStudentAfter: this.NumberofEmployedStudentAfter ,
      EndTermID: this.SSOLoginDataModel.EndTermID,
      DepartmentID: this.SSOLoginDataModel.DepartmentID,
      RoleID: this.SSOLoginDataModel.RoleID,
      Createdby: this.SSOLoginDataModel.UserID,
      PKID: this.id,
      BeforeDate: this.BeforeDate,
      AfterDate : this.AfterDate,
      FinancialYearID: this.SelectedFinancialYearID,
      BeforeMonth: this.BeforeMonth,
      PNMMelaDocument: this.PNMMelaDocument,
      provisionLetterDocument: this.provisionLetterDocument,
      Remarks: this.Remarks
    };

    try {
      debugger
      this.loaderService.requestStarted();
      await this.ApprenticeShipRPTService.Save_PMNAM_melaReport_BeforeAfter(obj).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.Data.length > 0)
        {
          this.toastr.success(data.Data['0'].msg);
          setTimeout(() => {
            this.routers.navigate(['/PMNAM-MelaReportBeforeAfter-List']);
          }, 1300);
        }
        
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }


  async ClearAll() {
    this.EstablishmentsRegisterNoBefore = ""
    this.NumberofSeatBefore = ""
    this.NumberofEmployedStudentBefore = ""
    this.EstablishmentsRegisterNoAfter = ""
    this.NumberofSeatAfter = ""
    this.NumberofEmployedStudentAfter = '';
    this.PNMMelaDocument = '';
    this.provisionLetterDocument = '';
    this.Remarks = '';
    this.MonthID = 0;
  }


  async GetReportDatabyID(ReportID : number)
  {

    try {
      this.loaderService.requestStarted();

      await this.ApprenticeShipRPTService.GetReportDatabyID(ReportID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          console.log('data ==>',data)
          if (data.Data.length > 0) {
            //this.DataList = data.Data
            this.EstablishmentsRegisterNoBefore = data.Data['0'].EstablishmentsRegisterNoBefore;
            this.NumberofSeatBefore = data.Data['0'].NumberofSeatBefore;
            this.NumberofEmployedStudentBefore = data.Data['0'].NumberofEmployedStudentBefore;

            this.EstablishmentsRegisterNoAfter = data.Data['0'].EstablishmentsRegisterNoAfter;
            this.NumberofSeatAfter = data.Data['0'].NumberofSeatAfter;
            this.NumberofEmployedStudentAfter = data.Data['0'].NumberofEmployedStudentAfter;
            this.provisionLetterDocument = data.Data['0'].provisionLetterDocument;
            this.PNMMelaDocument = data.Data['0'].PNMMelaDocument;
            this.BeforeMonth = data.Data['0'].MonthID;
            this.SelectedFinancialYearID = data.Data['0'].FinancialYearID;
            this.Remarks = data.Data['0']?.Remarks??'';
            this.FinancialYearName = String(this.SelectedFinancialYearID);
            this.id = data.Data['0'].ID;

            const ExamDate = new Date(data['Data'][0]['AfterDate']);
            const year = ExamDate.getFullYear();
            const month = String(ExamDate.getMonth() + 1).padStart(2, '0');
            const day = String(ExamDate.getDate()).padStart(2, '0');
            this.AfterDate = `${year}-${month}-${day}`;


            const ExamDate1 = new Date(data['Data'][0]['BeforeDate']);
            const year1 = ExamDate1.getFullYear();
            const month1 = String(ExamDate1.getMonth() + 1).padStart(2, '0');
            const day1 = String(ExamDate1.getDate()).padStart(2, '0');
            this.BeforeDate = `${year1}-${month1}-${day1}`;

            //this.AfterDate = data.Data['0'].AfterDate1;
            //this.BeforeDate = data.Data['0'].BeforeDate1;
          }
          else {
           // this.DataList = [];
          }

          //console.log(this.DataList)
        }, (error: any) => console.error(error)
        );

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  YearDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      this.FinYearList = data['Data'] || [];
      console.log('Fin Year List:', this.FinYearList);
    });
  }




  public file!: File;
  async onFilechange(event: any, Type: string) {
    debugger
    try {

      this.file = event.target.files[0];
      if (this.file) {
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "MelaDocument") {
                this.PNMMelaDocument = data['Data'][0]["FileName"];
              }

              else if (Type == "provnLetterDocument") {
                this.provisionLetterDocument = data['Data'][0]["FileName"];
              }

              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }

}


