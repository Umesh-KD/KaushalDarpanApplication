import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { EnumCasteCategory, EnumRole, EnumStatus } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { OptionsDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { ITIAllotmentService } from '../../../../Services/ITI/ITIAllotment/itiallotment.service';
import { InternalSlidingService } from '../../../../Services/ITIInternalSliding/internal-sliding.service';
import { SearchSlidingModel, StudentSlidingdataModel } from '../../../../Models/InternalSlidingDataModel';
import { ITISeatsDistributionsDataModels } from '../../../../Models/ITISeatsDistributions';
import { ITISeatsDistributionsService } from '../../../../Services/ITI-Seats-Distributions/iti-seats-distributions.service';
import { ITIAdminDashboardServiceService } from '../../../../Services/ITI-Admin-Dashboard-Service/iti-admin-dashboard-service.service';
import { OTPModalComponent } from '../../../otpmodal/otpmodal.component';

@Component({
  selector: 'app-internal-sliding',
  standalone: false,

  templateUrl: './internal-sliding.component.html',
  styleUrl: './internal-sliding.component.css'
})
export class InternalSlidingComponent implements OnInit {
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  @ViewChild('otpModal1') childComponent1!: OTPModalComponent;
  @ViewChild('otpModal2') childComponent2!: OTPModalComponent;
  @ViewChild('otpModal3') childComponent3!: OTPModalComponent;
  MenuMasterList: any;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Table_SearchText: string = "";
  searchText: string = '';
  ITIAllotmentFormGroup!: FormGroup;
  closeResult: string | undefined;
  public searchRequest = new SearchSlidingModel();
  public Request = new SearchSlidingModel();
  public ItiTradeList: any = [];
  public InternalSlidingList: any = [];
  public InternalSlidingUnitList: any = [];
  public ShowInternalSlidingList: StudentSlidingdataModel[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();;
  public requestSeats = new ITISeatsDistributionsDataModels();
  public IsPublishSeatMetrix: boolean = false;
  public DateConfigSetting: any = [];
  public isprofile: number = 0;
  //public _EnumCasteCategory: EnumCasteCategory;
  //public _EnumRole = EnumRole;
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private internalSlidingService: InternalSlidingService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private SeatsDistributionsService: ITISeatsDistributionsService,
    private Swal2: SweetAlert2,
    private ITIAdminDashboardService: ITIAdminDashboardServiceService,
    private sweetAlert2: SweetAlert2,
  ) {

  }

  async ngOnInit() {
    this.searchRequest.TradeLevel = parseInt(this.route.snapshot.paramMap.get('id'));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    if ((this.sSOLoginDataModel.RoleID == EnumRole.ITIPrincipal || EnumRole.Principal_NCVT)) {
      await this.CheckProfileStatus();
      if (this.isprofile == 0) {
        this.sweetAlert2.Confirmation("Your Profile Is not completed please create your profile?", async (result: any) => {
          window.open("/ITIUpdateCollegeProfile?id=" + this.sSOLoginDataModel.InstituteID, "_Self")
        }, 'OK', false);

      }
    }
    await this.GetdateConfigSetting();
    this.GetTradeListDDL();
    /*  this.GetInternalSliding();*/

    await this.GetSeatMetrixStatus();

    this.GetInternalSliding();
    //this.GetInternalSliding();
  }
  async GetdateConfigSetting() {
    this.loaderService.requestStarted();
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: 1,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: 'INTERNAL SLIDING',
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonFunctionService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];

        console.log(this.DateConfigSetting[0]['GENERATE MERIT']);

      }, (error: any) => console.error(error)
      );
  }
  async GetSeatMetrixStatus() {
    try {
      this.loaderService.requestStarted();
      //this.requestSeats.de = this.SSOLoginDataModel.DepartmentID;
      this.requestSeats.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.requestSeats.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestSeats.Action = "SEAT_MATRIX_STATUS";
      this.requestSeats.AllotmentMasterId = 6;
      await this.SeatsDistributionsService.GetSeatMetrixData(this.requestSeats).then((data: any) => {

        //data = JSON.parse(JSON.stringify(data));
        if (data.Data[0].SeatMatrixStatus == true) {
          this.IsPublishSeatMetrix = true;
        } else {
          this.IsPublishSeatMetrix = false;
        }
      });
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetTradeListDDL() {

    try {
      this.loaderService.requestStarted();
      //this.requestSeats.de = this.SSOLoginDataModel.DepartmentID;
      this.requestSeats.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
      this.requestSeats.EndTermID = this.sSOLoginDataModel.EndTermID;
      this.requestSeats.Action = "TRADE_LIST";
      this.requestSeats.AllotmentMasterId = 6;
      this.requestSeats.TradeLevelId = this.searchRequest.TradeLevel.toString();
      await this.SeatsDistributionsService.GetSeatMetrixData(this.requestSeats).then((data: any) => {

        this.ItiTradeList = data.Data;
      });
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }



    //try {
    //  this.searchRequest.action = '_getAllDataTrade'
    //  this.loaderService.requestStarted();
    //  await this.commonFunctionService.TradeListGetAllData(this.searchRequest).then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    this.ItiTradeList = data.Data
    //  })
    //} catch (error) {
    //  console.error(error)
    //} finally {
    //  setTimeout(() => {
    //    this.loaderService.requestEnded();
    //  }, 200);
    //}
  }

  async GetInternalSliding() {

    try {
      this.ShowInternalSlidingList = [];
      this.loaderService.requestStarted();
      this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID;
      this.searchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
      await this.internalSlidingService.GetInternalSliding(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.ShowInternalSlidingList = data['Data'];
            console.log(this.ShowInternalSlidingList, "slindinglist")
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
  public Gender: string = "";
  public CategoryId: number = 0;
  public IsDevnarayan: boolean = false;
  public IsMinority: boolean = false;
  public IsSahariya: boolean = false;
  public IsTSP: boolean = false;
  async GetDDLInternalSliding(ApplicationID: number = 0) {
    this.Gender = "";
    this.CategoryId = 0;
    this.IsDevnarayan = false;
    this.IsMinority = false;
    this.IsSahariya = false;
    this.IsTSP = false;
    try {
      this.searchRequest.CollegeID = this.Request.CollegeID;
      this.searchRequest.ApplicationID = ApplicationID
      await this.internalSlidingService.GetDDLInternalSliding(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.InternalSlidingList = data['Data'];

            if (this.InternalSlidingList.length > 0) {
              this.Gender = this.InternalSlidingList[0].Gender;
              this.CategoryId = this.InternalSlidingList[0].CategoryId;
              this.IsDevnarayan = this.InternalSlidingList[0].IsDevnarayan;
              this.IsMinority = this.InternalSlidingList[0].IsMinority;
              this.IsSahariya = this.InternalSlidingList[0].IsSahariya;
              this.IsTSP = this.InternalSlidingList[0].IsTSP;
            }

            console.log(this.InternalSlidingList, 'InternalSlidingList')
          } else {
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }
  async GetDDLInternalSlidingUnitList(ID: any = 0, AllotedCategory: string, SeatMetrixId: number) {
    this.Request.InsID = ID;
    try {
      this.Request.CollegeID = this.sSOLoginDataModel.InstituteID;
      this.Request.InsID = ID
      this.Request.AllotedCategory = AllotedCategory
      this.Request.SeatMetrixId = SeatMetrixId
      await this.internalSlidingService.GetDDLInternalSlidingUnitList(this.Request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.InternalSlidingUnitList = data['Data'];
            console.log(this.InternalSlidingUnitList, 'InternalSlidingList')
          } else {
            /*     this.toastr.error(data.ErrorMessage || 'Error fetching data.');*/
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }

  async OpenInternalsliding(action: any, content: any, item: any) {
    debugger;
    this.Request.MobileNo = item.MobileNo;
    if (action == 'REVERT') {
      this.RevertData(item);
    }
    else if (action == 'SWAP_REVERT') {
      this.RevertSwapData(item);
    }
    //else if (action == 'SWAP') {
    //  this.saveSawpData(item);
    //}
    else {
      ////this.IsShowViewStudent = true;
      this.Request.AllotmentId = item.AllotmentId;
      this.Request.CollegeID = item.CollegeId;
      this.Request.ApplicationID = item.ApplicationID;
      this.Request.ApplicationNo = item.ApplicationNo;
      this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    if (action == 'ALLOT') {
      await this.GetDDLInternalSliding(this.Request.ApplicationID);
      //await this.GetDDLInternalSlidingUnitList();
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

  private CloseModalPopup() {
    this.loaderService.requestStarted();
    //setTimeout(() => {
    this.modalService.dismissAll();
    this.loaderService.requestEnded();
    //window.location.reload();
    //}, 200);
  }

  openAllotOTP() {

    if (this.Request.InsID == 0) {
      this.toastr.error('Please Select Trade to allot seat')
      return
    }

    if (this.Request.UnitID == 0) {
      this.toastr.error('Please Select Shift/unit')
      return
    }


    const confirmationMessage = "Are you sure you want to Submit?";
    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        this.childComponent.MobileNo = this.Request.MobileNo;
        this.CloseModalPopup();
        this.childComponent.OpenOTPPopup();
        var th = this;
        this.toastr.success('OTP sent successfully to student mobile no');
        this.childComponent.onVerified.subscribe(() => {
          th.saveData('ALLOT');
          this.childComponent.onVerified.unsubscribe();
        });
        
      }
    });
  }

  async saveData(action: any) {



    this.Request.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.Request.action = action
    debugger

    try {
      await this.internalSlidingService.SaveData(this.Request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            if (data.Data[0].Status == 0) {
              this.toastr.error(data.Data[0].MSG)
            } else {
              this.toastr.success(data.Data[0].MSG)
              this.GetInternalSliding();
              this.CloseModalPopup();
            }
            //this.GetInternalSliding();
            //this.CloseModalPopup();
          }
          else {
            this.toastr.error(this.ErrorMessage)
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


  openRevertOTP(item: any) {
    const confirmationMessage = "Are you sure you want to revert this application?";
    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        this.childComponent1.MobileNo = item.MobileNo;
        this.CloseModalPopup();
        this.childComponent1.OpenOTPPopup();
        var th = this;
        this.toastr.success('OTP sent successfully to student mobile no');
        this.childComponent1.onVerified.subscribe(() => {
          th.RevertData(item);
          this.childComponent1.onVerified.unsubscribe();
        });
        
      }
    });
  }


  async RevertData(item: any) {
    ;
    this.Request.AllotmentId = item.AllotmentId;
    this.Request.CollegeID = item.CollegeId;
    this.Request.ApplicationID = item.ApplicationID;
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.Request.action = 'REVERT'

    const confirmationMessage =
      this.Request.action == 'REVERT'
        ? "Are you sure you want to revert this application?"
        : "Are you sure you want to Submit?";

    try {
      await this.internalSlidingService.SaveData(this.Request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            if (data.Data[0].Status == 0) {
              this.toastr.error(data.Data[0].MSG)
            } else {
              this.toastr.success(data.Data[0].MSG)
              this.GetInternalSliding();
              this.CloseModalPopup();
            }
            //this.GetInternalSliding()
            //this.CloseModalPopup();
          }
          else {
            this.toastr.error(this.ErrorMessage)
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


  async saveSawpData(action: any) {
    ;
    //this.Request.AllotmentId = item.AllotmentId;
    //this.Request.CollegeID = item.CollegeId;
    //this.Request.ApplicationID = item.ApplicationID;
    this.isSubmitted = true;
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.Request.action = action




    const confirmationMessage =
      this.Request.action == 'SWAP'
        ? "Are you sure you want to SWAP this application?"
        : "Are you sure you want to Submit?";


    try {
      await this.internalSlidingService.SaveSawpData(this.Request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            if (data.Data[0].Status == 0) {
              this.toastr.error(data.Data[0].MSG)
            } else {
              this.toastr.success(data.Data[0].MSG)
              this.GetInternalSliding();
              this.CloseModalPopup();
            }
            this.Request.SwapApplicationID = 0
           // this.GetInternalSliding()
            //this.CloseModalPopup();
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  openSawpOTP() {
    debugger;
    if (this.Request.SwapApplicationNo == "") {
      this.toastr.error('Please enter application no')
      return
    }

    if (this.Request.ApplicationNo == this.Request.SwapApplicationNo.toString()) {
      this.toastr.error('ApplicationID or SwapApplication No are the same. Please select a different Application No.')
      return
    }



    const confirmationMessage = "Are you sure you want to SWAP this application?";
    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        this.childComponent3.MobileNo = this.Request.MobileNo;
        this.CloseModalPopup();
        this.childComponent3.OpenOTPPopup();
        var th = this;
        this.toastr.success('OTP sent successfully to student mobile no');
        this.childComponent3.onVerified.subscribe(() => {
          th.saveSawpData('SWAP');
          this.childComponent3.onVerified.unsubscribe();
        });   
      }
    });
  }


  openRevertSwapOTP(item: any) {
    const confirmationMessage = "Are you sure you want to revert this application?";
    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        this.childComponent2.MobileNo = item.MobileNo;
        this.CloseModalPopup();
        this.childComponent2.OpenOTPPopup();
        var th = this;
        this.toastr.success('OTP sent successfully to student mobile no');
        this.childComponent2.onVerified.subscribe(() => {
          th.RevertSwapData(item);
          this.childComponent2.onVerified.unsubscribe();
        });

      }
    });
  }


  async RevertSwapData(item: any) {
    ;
    this.Request.AllotmentId = item.AllotmentId;
    this.Request.CollegeID = item.CollegeId;
    this.Request.ApplicationID = item.ApplicationID;
    //this.Request.SwapApplicationID = item.ApplicationID;
    this.isSubmitted = true;
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.Request.action = 'REVERT'

    const confirmationMessage =
      this.Request.action == 'REVERT'
        ? "Are you sure you want to REVERT  this application?"
        : "Are you sure you want to Submit?";
    ;
    try {
      await this.internalSlidingService.SaveSawpData(this.Request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            if (data.Data[0].Status == 0) {
              this.toastr.error(data.Data[0].MSG)
            } else {
              this.toastr.success(data.Data[0].MSG)
              this.GetInternalSliding();
              this.CloseModalPopup();
            } 
            
            //this.GetInternalSliding()
            //this.CloseModalPopup();
          }
          else {
            this.toastr.error(this.ErrorMessage)
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

  async CheckProfileStatus() {
    try {
      this.loaderService.requestStarted();
      await this.ITIAdminDashboardService.GetProfileStatus(this.sSOLoginDataModel.InstituteID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data);

          this.isprofile = data['Data'][0]['IsProfile'];


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
