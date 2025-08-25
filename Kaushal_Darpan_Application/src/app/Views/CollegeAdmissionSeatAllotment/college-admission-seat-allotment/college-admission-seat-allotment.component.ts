import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SMSMailService } from '../../../Services/SMSMail/smsmail.service';
import { CollegeAdmissionSeatAllotmentService } from '../../../Services/CollegeAdmissionSeatAllotment/college-admission-seat-allotment.service';
import { ApplicationSearchDataModel, SeatAllocationDataModel, SeatMatrixSearchModel } from '../../../Models/CollegeAdmissionSeatAllotmentModel';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { EnumCourseType, EnumDepartment, EnumStatus } from '../../../Common/GlobalConstants';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-college-admission-seat-allotment',
  templateUrl: './college-admission-seat-allotment.component.html',
  styleUrl: './college-admission-seat-allotment.component.css',
  standalone: false
})
export class CollegeAdmissionSeatAllotmentComponent {
  public DetailsBox: boolean = false;
  public searchrequest = new ApplicationSearchDataModel();
  public ApplicationID: number = 0;
  public StudentDetailsList: any = [];
  public TradeBox: boolean = false;
  public seatSearchRequest = new SeatMatrixSearchModel();
  public TradeList: any = [];
  public SSOLoginDataModel = new SSOLoginDataModel();
  public BranchList: any = [];
  _EnumDepartment = EnumDepartment;
  public ShiftUnitList: any = [];
  closeResult: string | undefined;
  public request = new SeatAllocationDataModel()
  constructor(
    private commonMasterService: CommonFunctionService,
    private sMSMailService: SMSMailService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private activatedRoute: ActivatedRoute, 
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private collegeAdmissionSeatAllotmentService: CollegeAdmissionSeatAllotmentService,
    private encryptionService: EncryptionService,
  ) {}

  async ngOnInit() {
    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.seatSearchRequest.AcadmicYearID = this.SSOLoginDataModel.FinancialYearID
    this.request.UserID = this.SSOLoginDataModel.UserID
    this.checkRouteParam();
    this.GetById()
  }

  async checkRouteParam() {
    let AppID = this.activatedRoute.snapshot.queryParamMap.get('AppID');
    this.ApplicationID = Number(this.encryptionService.decryptData(AppID??"0"));
    console.log("ApplicationID",this.ApplicationID);
    this.searchrequest.ApplicationID = this.ApplicationID;
  }
  async GetById() {
    try {
      this.loaderService.requestStarted();
      if (this.SSOLoginDataModel.DepartmentID === EnumDepartment.ITI) {
        this.searchrequest.Action = "GetApplicationData_ITI"
      } else {
        this.searchrequest.Action = "GetApplicationData_BTER"
      }
      await this.collegeAdmissionSeatAllotmentService.GetApplicationDatabyID(this.searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if(data.State === EnumStatus.Success) {
            this.StudentDetailsList = data.Data[0];
            this.request.ApplicationID = this.StudentDetailsList.ApplicationID
            console.log("Application Dataaaaaaaaaaaaaaaaaaaaaaaaaa",this.StudentDetailsList);
            
            if (this.StudentDetailsList.DirectAdmissionTypeID !== 0 && this.StudentDetailsList.DepartmentID === EnumDepartment.ITI) {
              this.GetTradeListByCollege();
            } else if (this.StudentDetailsList.DirectAdmissionTypeID !== 0 && this.StudentDetailsList.DepartmentID === EnumDepartment.BTER) {
              this.GetBranchListByCollege();
            }
          }
          
        }, (error: any) => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetTradeListByCollege() {
    
    try {
      this.loaderService.requestStarted();
      this.seatSearchRequest.InstituteID = this.SSOLoginDataModel.InstituteID
      await this.collegeAdmissionSeatAllotmentService.GetTradeListByCollege(this.seatSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.TradeList = data['Data'];
          
          console.log(this.TradeList, "StudentOptinalTradeList")
        }, error => console.error(error));
        
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

  async GetBranchListByCollege() {
    try {
      this.loaderService.requestStarted();
      this.seatSearchRequest.InstituteID = this.SSOLoginDataModel.InstituteID
      await this.collegeAdmissionSeatAllotmentService.GetBranchListByCollege(this.seatSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.BranchList = data['Data'];

          console.log(this.BranchList, "BranchList")
        }, error => console.error(error));
        
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

  async TradeWithAllot(content: any, CollegeTradeID: number, SeatMetrixId: number, AllotedCategory: string, SeatMetrixColumn:string) {
    this.request.CollegeTradeID = CollegeTradeID;
    this.request.SeatMetrixId = SeatMetrixId;
    
    this.request.AllotedCategory = AllotedCategory;
    this.request.SeatMetrixColumn = SeatMetrixColumn;

    if(this.StudentDetailsList.DepartmentID === EnumDepartment.ITI) {
      this.seatSearchRequest.action = "ShiftUnitList";
      this.seatSearchRequest.CollegeTradeID = CollegeTradeID;
    } else if (this.StudentDetailsList.DepartmentID === EnumDepartment.BTER) {
      this.seatSearchRequest.action = "BTER_ShiftUnitList";
      this.seatSearchRequest.CollegeTradeID = CollegeTradeID;
    }
    
    try {
      this.loaderService.requestStarted();
      await this.collegeAdmissionSeatAllotmentService.ShiftUnitList(this.seatSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ShiftUnitList = data['Data'];
          console.log(this.ShiftUnitList, "ShiftUnitList")
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

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  async BranchWithAllot(CollegeTradeID: number, SeatMetrixId: number, AllotedCategory: string, SeatMetrixColumn:string) {

    this.request.CollegeTradeID = CollegeTradeID;
    this.request.SeatMetrixId = SeatMetrixId;
    
    this.request.AllotedCategory = AllotedCategory;
    this.request.SeatMetrixColumn = SeatMetrixColumn;

    if(this.StudentDetailsList.DepartmentID === EnumDepartment.ITI) {
      this.seatSearchRequest.action = "ShiftUnitList";
      this.seatSearchRequest.CollegeTradeID = CollegeTradeID;
    } else if (this.StudentDetailsList.DepartmentID === EnumDepartment.BTER) {
      this.seatSearchRequest.action = "BTER_ShiftUnitList";
      this.seatSearchRequest.CollegeTradeID = CollegeTradeID;
    }
    
    try {
      this.loaderService.requestStarted();
      await this.collegeAdmissionSeatAllotmentService.ShiftUnitList(this.seatSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.ShiftUnitList = data['Data'];
          console.log(this.ShiftUnitList, "ShiftUnitList")
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

    this.Swal2.Confirmation("Are you sure you want to Allot "+ AllotedCategory+" Seat",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            this.request.action = "SaveUpdateAllotments_BTER";
            this.request.InstituteID = this.SSOLoginDataModel.InstituteID
            console.log("this.request", this.request)
            await this.collegeAdmissionSeatAllotmentService.UpdateAllotments(this.request)
              .then((data: any) => {
                data = JSON.parse(JSON.stringify(data));
                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message);
                  // this.getAllDataList();
                  this.toastr.success('Student Allotment Successfully');
                  // this.resetOTPControls();
                  this.CloseModal();
                  if(this.SSOLoginDataModel.Eng_NonEng === EnumCourseType.Engineering) {
                    this.router.navigate(['/DirectAdmissionENG/1']);
                  } else if (this.SSOLoginDataModel.Eng_NonEng === EnumCourseType.Non_Engineering) {
                    this.router.navigate(['/DirectAdmissionNonENG/2']);
                  } else {
                    this.router.navigate(['/DirectAdmissionLateral/3']);
                  }
                  
                }
                else {
                  this.toastr.success(data.Message);
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

  async SaveTradeWithAllot() {
    console.log("this.request", this.request)
    try {
      this.loaderService.requestStarted();
      this.request.InstituteID = this.SSOLoginDataModel.InstituteID
      this.request.action = "SaveUpdateAllotments";
      console.log("SaveTradeWithAllot this.request", this.request)
      await this.collegeAdmissionSeatAllotmentService.UpdateAllotments(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            // this.getAllDataList();
            this.toastr.success('Student Allotment Successfully');
            // this.resetOTPControls();
            this.CloseModal();
            this.router.navigate(['/ApplicationList']);
          }
          else {
            this.toastr.success(data.Message);
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

  async SaveBranchWithAllot() {
    try {
      this.loaderService.requestStarted();
      this.request.action = "SaveUpdateAllotments_BTER";
      this.request.InstituteID = this.SSOLoginDataModel.InstituteID
      console.log("this.request", this.request)
      await this.collegeAdmissionSeatAllotmentService.UpdateAllotments(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message);
            // this.getAllDataList();
            this.toastr.success('Student Allotment Successfully');
            // this.resetOTPControls();
            this.CloseModal();
            if(this.SSOLoginDataModel.Eng_NonEng === EnumCourseType.Engineering) {
              this.router.navigate(['/DirectAdmissionENG/1']);
            } else if (this.SSOLoginDataModel.Eng_NonEng === EnumCourseType.Non_Engineering) {
              this.router.navigate(['/DirectAdmissionNonENG/2']);
            } else {
              this.router.navigate(['/DirectAdmissionLateral/3']);
            }
          }
          else {
            this.toastr.success(data.Message);
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
}
