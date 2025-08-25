import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CenterMasterDataModels } from '../../../Models/CenterMasterDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CollegeMasterService } from '../../../Services/CollegeMaster/college-master.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { CenterService } from '../../../Services/Centers/centers.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';

@Component({
    selector: 'app-centers',
    templateUrl: './centers.component.html',
    styleUrls: ['./centers.component.css'],
    standalone: false
})
export class CentersComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public CenterMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  public Table_SearchText: string = '';

  public ManagmentTypeList: any = []

  request = new CenterMasterDataModels();
  sSOLoginDataModel = new SSOLoginDataModel();


  constructor(private commonMasterService: CommonFunctionService, private Router: Router,
    private ceneterService: CenterService, private toastr: ToastrService, private loaderService: LoaderService,
    private formBuilder: FormBuilder, private router: ActivatedRoute, private routers: Router,
    private _fb: FormBuilder, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    await this.GetCenterMasterList();
    this.UserID = this.sSOLoginDataModel.UserID;

  }

  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByCenterCode = '';
    this.searchByCenterName = '';

    this.GetCenterMasterList();
  }

  onSearchClick() {
    const searchCriteria: any = {
      CenterCode: this.searchByCenterCode.trim().toLowerCase(),
      CenterName: this.searchByCenterName.trim().toLowerCase(),
    }
    this.CenterMasterList = this.CenterMasterList.filter((center: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }
        const centerValue = center[key];
        if (typeof centerValue === 'string') {
          return centerValue.toLowerCase().includes(searchValue);
        }
        return centerValue === searchValue;
      });
    });
  }
  async GetCenterMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.ceneterService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.CenterMasterList = data['Data'];

          console.log(this.CenterMasterList)
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
  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.CenterMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        /* table id is passed over here */
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        //Hide Column
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, "CollegMaster.xlsx");
      }
      catch (Ex) {
        console.log(Ex);
      }
      finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    }
    else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }

  }
  //async btnDelete_OnClick(InstitudeID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      await this.ceneterService.DeleteDataByID(InstitudeID, this.UserID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            this.GetCenterMasterList()
  //          }
  //          else {
  //            this.toastr.error(this.ErrorMessage)
  //          }
  //        })
  //    }
  //  }
  //  catch (ex) { }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async btnDelete_OnClick(InstitudeID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.ceneterService.DeleteDataByID(InstitudeID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (!this.State) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetCenterMasterList()
                }
                else {
                  this.toastr.error(this.ErrorMessage)
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

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  onEdit(id: number): void {
    // Navigate to the edit page with the institute ID
    this.Router.navigate(['/updatecentermaster', id]);
    console.log(id)
  }
}
