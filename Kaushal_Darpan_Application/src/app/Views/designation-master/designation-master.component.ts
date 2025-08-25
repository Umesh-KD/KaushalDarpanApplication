import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';
import { DesignationMasterDataModel } from '../../Models/DesignationMasterDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DesignationMasterService } from '../../Services/DesignationMaster/Designation-master.service';
import { SweetAlert2 } from '../../Common/SweetAlert2';
import { EnumStatus } from '../../Common/GlobalConstants';

@Component({
    selector: 'app-designation-master',
    templateUrl: './designation-master.component.html',
    styleUrls: ['./designation-master.component.css'],
    standalone: false
})
export class DesignationMasterComponent implements OnInit {
  DesignationMasterFormGroup!: FormGroup;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public DesignationMasterList: any = [];
  public UserID: number = 0;
  searchText: string = ''; // This is for search input
  Table_SearchText: string = ''; // Add this property
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public LevelMasterList: any = [];

  request = new DesignationMasterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(
    private commonMasterService: CommonFunctionService,
    private designationMasterService: DesignationMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.DesignationMasterFormGroup = this.formBuilder.group({
      txtDesignationName: ['', Validators.required],
      txtDesignationNameHindi: ['', Validators.required],
      txtDesignationNameShort: ['', Validators.required],
      ActiveStatus: ['true'],
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    await this.GetMasterData();
    await this.GetDesignationMasterList();
  }

  get form() {
    return this.DesignationMasterFormGroup.controls;
  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetLevelMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.LevelMasterList = data['Data'];
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetDesignationMasterList() {

    try {
      this.loaderService.requestStarted();
      await this.designationMasterService.GetAllDesignations()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DesignationMasterList = data['Data'];
          console.log(data)
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }
  async SaveData() {
    this.isSubmitted = true;
    if (this.DesignationMasterFormGroup.invalid) {
      return
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.UserID = this.sSOLoginDataModel.UserID
    try {
      await this.designationMasterService.SaveData(this.request)
      
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetDesignationMasterList()
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

  async btnEdit_OnClick(DesignationID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      await this.designationMasterService.GetByID(DesignationID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];

          // Patch the form group with the fetched data
          this.DesignationMasterFormGroup.patchValue({
            txtDesignationName: this.request.DesignationNameEnglish,
            txtDesignationNameHindi: this.request.DesignationNameHindi,
            txtDesignationNameShort: this.request.DesignationNameShort,
            ActiveStatus: this.request.ActiveStatus,
          });

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async btnDelete_OnClick(DesignationID: number) {
    this.isSubmitted = false;
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.designationMasterService.DeleteDataByID(DesignationID, this.UserID)
              .then(async (data: any) => {
                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];
                if (this.State == EnumStatus.Success) {
                  this.toastr.success(this.Message);
                  await this.GetDesignationMasterList();
                } else {
                  this.toastr.error(this.ErrorMessage);
                }
              });
          } catch (ex) {
            console.log(ex);
          } finally {
            setTimeout(() => {
              this.loaderService.requestEnded();
            }, 200);
          }
        }
      });
  }

  async ResetControl() {
    this.isSubmitted = false;

    // Reset the request object
    this.request = new DesignationMasterDataModel();

    // Reset the form group
    this.DesignationMasterFormGroup.reset({
      txtDesignationName: '',
      txtDesignationNameHindi: '',
      txtDesignationNameShort: '',
      ActiveStatus: 'true', // Assuming true is the default active status
    });

    // Reset other UI elements
    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('btnReset');
    if (btnReset) btnReset.innerHTML = "Reset";
  }


  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.DesignationMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, "DesignationMaster.xlsx");
      } catch (Ex) {
        console.log(Ex);
      } finally {
        setTimeout(() => {
          this.loaderService.requestEnded();
          this.isLoadingExport = false;
        }, 200);
      }
    } else {
      this.toastr.warning("No Record Found.!");
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoadingExport = false;
      }, 200);
    }
  }

  @ViewChild('content') content: ElementRef | any;

  open(content: any, BookingId: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
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

  async SetUserRoleRights(DesignationID: number) {
    this.routers.navigate(['/userrolerights' + '/', DesignationID]);
  }
}
