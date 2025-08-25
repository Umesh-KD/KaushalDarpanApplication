import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ItiStuAppSearchModelUpward, UpwardMoment } from '../../../Models/CommonMasterDataModel';
import { EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { StudentSearchModel } from '../../../Models/StudentSearchModel';
import { EmitraApplicationstatusModel } from '../../../Models/EmitraApplicationstatusDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { ApplicationStatusService } from '../../../Services/ApplicationStatus/EmitraApplicationStatus.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { CookieService } from 'ngx-cookie-service';
import { UpwardMovementService } from '../../../Services/UpwardMovement/upward-movement.service';
import { AllotmentStatusService } from '../../../Services/BTER/BTERAllotmentStatus/allotment-status.service';
import { AllotmentStatusSearchModel } from '../../../Models/BTER/BTERAllotmentStatusDataModel';
import { DateConfigurationModel } from '../../../Models/DateConfigurationDataModels';
import { DateConfigService } from '../../../Services/DateConfiguration/date-configuration.service';

@Component({
  selector: 'app-upward-moment',
  templateUrl: './upward-moment.component.html',
  styleUrl: './upward-moment.component.css',
  standalone: false
})
export class UpwardMomentComponent implements OnInit {
  @Input() CourseTypeId: number = 0;


  public sSoLoginDataModel = new SSOLoginDataModel();
  public request = new UpwardMoment();
  public searchRequest = new ItiStuAppSearchModelUpward();
  public searchRequest1 = new AllotmentStatusSearchModel();
  public isShowGrid: boolean = false;
  public StudentDetailsModelList: EmitraApplicationstatusModel[] = []
  closeResult: string | undefined;
   public ShowCommingSoon: boolean = false;
   dateConfiguration = new DateConfigurationModel();
  public DepartmentId: number = 1;

  public HelplineNumber: string = '';
  public ContactEmail: string = '';


  constructor(
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService, 
    private commonservice: CommonFunctionService, 
    public appsettingConfig: AppsettingService,
    private studentService: ApplicationStatusService, 
    private modalService: NgbModal,
    private sMSMailService: SMSMailService, 
    private cookieService: CookieService, 
    private cdRef: ChangeDetectorRef, 
    private upwardMovementService: UpwardMovementService,
    private allotmentStatusService: AllotmentStatusService,
    private dateMasterService: DateConfigService
  ) { }
  async ngOnInit() {
    this.sSoLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if (this.CourseTypeId == 1) {
      this.HelplineNumber = '+91-9461172833';
      this.ContactEmail = 'technicaladvisorceg@gmail.com';
    }
    else if (this.CourseTypeId == 2) {
      this.HelplineNumber = '+91-8619637821';
      this.ContactEmail = 'mahila.admission@gmail.com';
    }
    else if (this.CourseTypeId == 3) {
      this.HelplineNumber = ' +91-9461172833';
      this.ContactEmail = 'technicaladvisorceg@gmail.com';
    }
    else if (this.CourseTypeId == 4) {
      this.HelplineNumber = '+91-8619637821';
      this.ContactEmail = 'mahila.admission@gmail.com';
    }
    else if (this.CourseTypeId == 5) {
      this.HelplineNumber = ' +91-8619637821';
      this.ContactEmail = 'dte.Lateral@rajasthan.gov.in';
    }

    this.request.UserID = this.sSoLoginDataModel.UserID;  
    await this.GetDateDataList();
  }

  async GetDateDataList() {
    try {
      this.dateConfiguration.DepartmentID = this.DepartmentId;
      this.dateConfiguration.SSOID = this.sSoLoginDataModel != null ? this.sSoLoginDataModel.SSOID : "";
      //this.dateConfiguration.CourseTypeID= this.CourseTypeId;
      await this.dateMasterService.GetDateDataList(this.dateConfiguration)
        .then((data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          //this.AdmissionDateList = data['Data'];
          const today = new Date();        
          var activeCourseID: any = [];
          var th = this;
          if (data.Data.filter(function (dat: any) { return (dat.TypeID == 24 || dat.TypeID == 63)&&  dat.DepartmentID == th.DepartmentId && dat.IsDateOpen == 1 }).length > 0) {
            this.ShowCommingSoon = false;
          } else {
            this.ShowCommingSoon = true ;
          }        

        }, error => console.error(error));
    }
    catch (Ex) {
      console.log(Ex);
    }
  }

  async UpwardMomentUpdate() {
    
    try {
      this.loaderService.requestStarted();
      console.log("this.request", this.request);
      await this.upwardMovementService.UpwardMomentUpdate(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message);
          this.request = new UpwardMoment();
          this.CloseModal();
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
    
  }

  ResetControl() {
    this.searchRequest = new ItiStuAppSearchModelUpward()
  }

  async onSearchClick1() {
    this.isShowGrid = true;

    this.searchRequest.action = "_GetApplicationForUpward";
    this.searchRequest.DepartmentID = EnumDepartment.ITI
    this.StudentDetailsModelList = [];
    try {
      this.loaderService.requestStarted();

      console.log("this.searchRequest", this.searchRequest);
      await this.upwardMovementService.GetDataItiStudentApplication(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("data",data)
          if (data.State == EnumStatus.Success) {
            this.StudentDetailsModelList = data['Data'];
            console.log("StudentDetailsModelList",this.StudentDetailsModelList)
          } else if(data.State == EnumStatus.Warning){
            this.toastr.warning("You are not alloted any college");
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

  async onSearchClick() {
    
    this.isShowGrid = false;

    try {
      this.loaderService.requestStarted();
      //this.this.StudentDetailsModelList = [];
      //this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.searchRequest1.DepartmentId = 1;
      await this.allotmentStatusService.GetAllotmentUpwardList(this.searchRequest1)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {


            if (data.Data[0].Status == 1) {
              
              this.StudentDetailsModelList = data['Data'];

              if (this.StudentDetailsModelList.length>0) {
                this.isShowGrid = true;
              } else {
                this.isShowGrid = false;
              }

            } else {
              this.toastr.error(data.Data[0].MSG);
            }
          } else {
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async openModal(content: any, row: any) {
    
    console.log("row",row);
    this.request.ApplicationID = row.ApplicationID;
    this.request.IsUpward = row.Upward;
    this.request.AllotmentId = row.AllotmentId;
    if(row.Upward == true){
      this.toastr.error("You have alreay applied for upward movement")
    } else {
      this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }    
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  CloseModal() {
    this.modalService.dismissAll();
  }

}
