import { Component } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { BTERInternalSlidingModel, BTERInternalSlidingSearchModel } from '../../../Models/BTERInternalSlidingDataModel';
import { FormBuilder } from '@angular/forms';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { StreamDDL_InstituteWiseModel } from '../../../Models/CommonMasterDataModel';
import { BterInternalSlidingService } from '../../../Services/BTERInternalSliding/bter-internal-sliding.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { BTERSeatsDistributionsService } from '../../../Services/BTER/Seats-Distributions/seats-distributions.service';
import { BTERSeatsDistributionsDataModels } from '../../../Models/BTER/BTERSeatsDistributions';

@Component({
  selector: 'app-bter-internal-sliding',
  templateUrl: './bter-internal-sliding.component.html',
  styleUrl: './bter-internal-sliding.component.css',
  standalone: false,
})
export class BterInternalSlidingComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new BTERInternalSlidingSearchModel();
  public StreamMasterDDLList: any[] = []
  public streamSearchRequest = new StreamDDL_InstituteWiseModel()
  public InstituteID: number = 0
  public ShowInternalSlidingList: any[] = [];
  public Request = new BTERInternalSlidingModel();
  public isSubmitted: boolean = false
  closeResult: string | undefined;
  public StreamTypeName: string = ''
  public InternalSlidingList: any[] = []

  public DateConfigSetting: any = [];
  public requestSeats = new BTERSeatsDistributionsDataModels();
  public IsPublishSeatMetrix : boolean = false;

  constructor(
    private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private Swal2: SweetAlert2,
    private bterInternalSlidingService: BterInternalSlidingService,
    private SeatsDistributionsService: BTERSeatsDistributionsService,
  ) { }

  async ngOnInit() {
    this.searchRequest.StreamTypeID = parseInt(this.route.snapshot.paramMap.get('id'));
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.CollegeID = this.sSOLoginDataModel.InstituteID;
    this.searchRequest.EndTermId = this.sSOLoginDataModel.EndTermID;
    this.Request.EndTermId = this.sSOLoginDataModel.EndTermID;
    await this.GetSeatMetrixStatus();
    await this.GetdateConfigSetting();
    this.GetStreamMasterInstituteWise();

   
    if (this.searchRequest.StreamTypeID == 1) {
      this.StreamTypeName = "Engineering"
    } else if (this.searchRequest.StreamTypeID == 2) {
      this.StreamTypeName = "Non-Engineering"
    } else if (this.searchRequest.StreamTypeID == 3) {
      this.StreamTypeName = "Lateral"
    }
    this.GetInternalSliding();
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
        
        data = JSON.parse(JSON.stringify(data));
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

  async GetdateConfigSetting() {
    this.loaderService.requestStarted();
    var data = {
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      CourseTypeId: this.searchRequest.StreamTypeID,
      AcademicYearID: this.sSOLoginDataModel.FinancialYearID,
      EndTermId: this.sSOLoginDataModel.EndTermID,
      Key: 'INTERNAL SLIDING',
      SSOID: this.sSOLoginDataModel.SSOID
    }

    await this.commonFunctionService.GetDateConfigSetting(data)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.DateConfigSetting = data['Data'];
      }, (error: any) => console.error(error)
      );
  }



  async GetStreamMasterInstituteWise() {
    try {
      this.loaderService.requestStarted();
      this.streamSearchRequest.InstituteID = this.InstituteID
      this.streamSearchRequest.StreamType = this.searchRequest.StreamTypeID;

      await this.commonFunctionService.StreamDDL_InstituteWise(this.streamSearchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StreamMasterDDLList = data['Data'];
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
  }

  async GetInternalSliding() {
    
    try {
      this.loaderService.requestStarted();
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.ShowInternalSlidingList = [];
      await this.bterInternalSlidingService.GetInternalSliding(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.ShowInternalSlidingList = data['Data'];
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

  async saveData(action: any) {
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.Request.action = action

    const confirmationMessage =
      this.Request.action == 'REVERT'
        ? "Are you sure you want to revert this application?"
        : "Are you sure you want to Submit?";

    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        try {
          await this.bterInternalSlidingService.SaveData(this.Request)
            .then((data: any) => {
              if (data.State = EnumStatus.Success) {
                if (data.Data[0].Status == 0) {
                  this.toastr.error(data.Data[0].MSG)
                } else {
                  this.toastr.success(data.Data[0].MSG)
                }

               // this.toastr.success(data.Message)
                this.GetInternalSliding();
                this.CloseModalPopup();
                this.Request.StreamID = 0;
              }
              else {
                this.toastr.error(data.ErrorMessage)
              }
            })
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  private CloseModalPopup() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }

  async OpenInternalsliding(action: any, content: any, item: any) {
    if (action == 'REVERT') {
      this.RevertData(item);
    } else if (action == 'SWAP_REVERT') {
      this.RevertSwapData(item);
    }
    else {
      ////this.IsShowViewStudent = true;
      this.Request.SwapApplicationNO = '';
      this.Request.AllotmentId = item.AllotmentId;
      this.Request.CollegeID = item.CollegeId;
      this.Request.ApplicationID = item.ApplicationID;
      this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    if (action == 'ALLOT') {
      await this.GetGenerateAllotment();
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

  async RevertData(item: any) {
    
    this.Request.AllotmentId = item.AllotmentId;
    this.Request.CollegeID = item.CollegeId;
    this.Request.ApplicationID = item.ApplicationID;
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    this.Request.StreamID = item.CollegeStreamId;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.Request.action = 'REVERT'

    const confirmationMessage =
      this.Request.action == 'REVERT'
        ? "Are you sure you want to revert this application?"
        : "Are you sure you want to Submit?";

    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        ;
        try {
          await this.bterInternalSlidingService.SaveData(this.Request)
            .then((data: any) => {
              if (data.State = EnumStatus.Success) {
                if (data.Data[0].Status == 0) {
                  this.toastr.error(data.Data[0].MSG)
                } else {
                  this.toastr.success(data.Data[0].MSG)
                }
                this.GetInternalSliding()
                this.CloseModalPopup();
              }
              else {
                this.toastr.error(data.ErrorMessage)
              }
            })
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  async saveSwapData(action: any) {
    
    this.isSubmitted = true;
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    //Show Loading
    this.loaderService.requestStarted();
    this.Request.action = action

    if (this.Request.ApplicationID == this.Request.SwapApplicationID) {
      this.toastr.error('ApplicationID or SwapApplicationID are the same. Please select a different ApplicationID.')

      return
    }
    const confirmationMessage =
      this.Request.action == 'SWAP'
        ? "Are you sure you want to SWAP this application?"
        : "Are you sure you want to Submit?";

    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        ;
        try {
          await this.bterInternalSlidingService.SaveSwapData(this.Request)
            .then((data: any) => {
              if (data.State == EnumStatus.Success) {
                if (data.Data[0].Status == 0) {
                  this.toastr.error(data.Data[0].MSG)
                } else {
                  this.toastr.success(data.Data[0].MSG)
                }
                this.Request.SwapApplicationID = 0
                this.GetInternalSliding()
                this.CloseModalPopup();
              }
              else {
                this.toastr.error(data.ErrorMessage)
              }
            })
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }


  async RevertSwapData(item: any) {
    
    this.Request.AllotmentId = item.AllotmentId;
    this.Request.CollegeID = item.CollegeId;
    this.Request.ApplicationID = item.ApplicationID;
    this.isSubmitted = true;
    this.Request.UserId = this.sSOLoginDataModel.UserID;
    this.Request.StreamID = item.CollegeStreamId;
    this.loaderService.requestStarted();
    this.Request.action = 'REVERT'

    const confirmationMessage =
      this.Request.action == 'REVERT'
        ? "Are you sure you want to REVERT  this application?"
        : "Are you sure you want to Submit?";

    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {
        ;
        try {
          await this.bterInternalSlidingService.SaveSwapData(this.Request)
            .then((data: any) => {
              if (data.State = EnumStatus.Success) {
                if (data.Data[0].Status == 0) {
                  this.toastr.error(data.Data[0].MSG)
                } else {
                  this.toastr.success(data.Data[0].MSG)
                }
                this.GetInternalSliding()
                this.CloseModalPopup();
              }
              else {
                this.toastr.error(data.ErrorMessage)
              }
            })
        }
        catch (ex) { console.log(ex) }
        finally {
          setTimeout(() => {
            this.loaderService.requestEnded();
          }, 200);
        }
      }
    })
  }

  async GetGenerateAllotment() {
    
    try {
      this.searchRequest.AcademicYearID = this.sSOLoginDataModel.FinancialYearID;
      this.InternalSlidingList=[]
      await this.bterInternalSlidingService.GetGenerateAllotment(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.InternalSlidingList = data['Data'];
          } else {
            this.toastr.error('Seat Matrix for Internal Sliding is not pulished. Before Internal Sliding Please generate and publish Seat Matrix for Internal Sliding');
            //this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, (error: any) => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    }
  }
}
