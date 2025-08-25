import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, interval, Subscription } from 'rxjs';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ItiCollegesSearchModel } from '../../../Models/CommonMasterDataModel';
import { AllotmentdataModel, SearchModel, AllotmentCounterDataModel, SeatMetrixdataModel, StudentSeatAllotmentdataModel } from '../../../Models/ITIAllotmentDataModel';
import { OptionsDetailsDataModel } from '../../../Models/ITIFormDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ITIAllotmentService } from '../../../Services/ITI/ITIAllotment/itiallotment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SeatMetrixModel, SeatSearchModel } from '../../../Models/SeatMatrixDataModel';
import { SeatMatrixService } from '../../../Services/ITISeatMatrix/seat-matrix.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';

@Component({
  selector: 'app-itiseat-matrix',
  standalone: false,
  
  templateUrl: './itiseat-matrix.component.html',
  styleUrl: './itiseat-matrix.component.css'
})

export class ITISeatMatrixComponent implements OnInit {
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  ITISeatMatrixFormGroup!: FormGroup;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  closeResult: string | undefined;
  public searchRequest = new SeatSearchModel();
  public ShowSeatMetrixList: SeatMetrixModel[] = [];
  public FinancialYear: any = [];
  public AllotmentTypeList: any = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private seatMatrixService: SeatMatrixService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private commonFunctionService: CommonFunctionService,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ITISeatMatrixFormGroup = this.formBuilder.group(
      {
        ddlFinancialYearID: ['', [DropdownValidators]],
        ddlAllotmentId: ['', [DropdownValidators]]
      })
    this.loadDropdownData('FinancialYears');
    this.loadDropdownData('AllotmentType');
    //this.ShowSeatMetrix();
  }

  get form() { return this.ITISeatMatrixFormGroup.controls; }
  // Load data for dropdown based on MasterCode
  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'FinancialYears':
          this.FinancialYear = data['Data'];
          break;
        case 'AllotmentType':
          this.AllotmentTypeList = data['Data'];
          console.log(this.AllotmentTypeList, "datatatata")
          break;
        default:
          break;
      }
    });
  }

  async ShowSeatMetrix() {
    
    this.isSubmitted = true;
    if (this.ITISeatMatrixFormGroup.invalid) {
      return console.log("error")
    }
    try {
      this.loaderService.requestStarted();
      await this.seatMatrixService.ShowSeatMetrix(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ShowSeatMetrixList = data['Data'];
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async saveData() {
    
    this.searchRequest.UserId = this.sSOLoginDataModel.UserID;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
        
        try {
          await this.seatMatrixService.SaveData(this.searchRequest)
            .then((data: any) => {
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              if (this.State = EnumStatus.Success) {
                this.toastr.success(this.Message)
                this.CloseModalPopup();
                this.ShowSeatMetrix();
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

  async OpenInternalsliding(content: any) {
    
      this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  private CloseModalPopup() {
    this.loaderService.requestStarted();
    setTimeout(() => {
      this.modalService.dismissAll();
      this.loaderService.requestEnded();
      //window.location.reload();
    }, 200);
  }
}
