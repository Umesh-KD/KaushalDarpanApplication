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
import {ApprenticeReportServiceService} from '../../../../Services/ITI/ApprenticeReport/apprentice-report-service.service'


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
    private ApprenticeShipRPTService: ApprenticeReportServiceService,


  ) { }

  public EstablishmentsRegisterNoBefore: string = '';
  public NumberofSeatBefore: string = '';
  public NumberofEmployedStudentBefore: string = '';
  public EstablishmentsRegisterNoAfter: string = '';
  public NumberofSeatAfter: string = '';
  public NumberofEmployedStudentAfter: string = '';
  public BeforeDate: string = '';
  public AfterDate: string = '';
  id: number = 0;

  IsDisable: boolean = false;
  buttonLabel: string = 'Submit'
  public SSOLoginDataModel = new SSOLoginDataModel()


  async ngOnInit()
  {
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    const Editid = sessionStorage.getItem('PMNAM_BeforeAfterRPTEditId');
    if (Editid != undefined && parseInt(Editid) > 0) {
      this.GetReportDatabyID(parseInt(Editid));
      console.log(Editid);
      this.buttonLabel = 'Update';
    }
    if (this.SSOLoginDataModel.RoleID != 97 || Number(Editid)>0) {
      this.IsDisable = true;
    }
    else {
      this.IsDisable =false
    }

  }


  async Submit() {
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
      AfterDate : this.AfterDate
    };

    try {
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
  }


  async GetReportDatabyID(ReportID : number)
  {

    try {
      this.loaderService.requestStarted();

      await this.ApprenticeShipRPTService.GetReportDatabyID(ReportID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger;
          if (data.Data.length > 0) {
            //this.DataList = data.Data
            this.EstablishmentsRegisterNoBefore = data.Data['0'].EstablishmentsRegisterNoBefore;
            this.NumberofSeatBefore = data.Data['0'].NumberofSeatBefore;
            this.NumberofEmployedStudentBefore = data.Data['0'].NumberofEmployedStudentBefore;

            this.EstablishmentsRegisterNoAfter = data.Data['0'].EstablishmentsRegisterNoAfter;
            this.NumberofSeatAfter = data.Data['0'].NumberofSeatAfter;
            this.NumberofEmployedStudentAfter = data.Data['0'].NumberofEmployedStudentAfter;
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

}


