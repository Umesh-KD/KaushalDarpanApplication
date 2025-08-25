
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../Services/Loader/loader.service';

import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { NgbModal, NgbModalRef, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { LevelMasterDataModel } from '../../Models/LevelMasterDataModel';
import { LevelMasterService } from '../../Services/LevelMaster/level-master.service';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';
import { EnumStatus } from '../../Common/GlobalConstants';
import { SweetAlert2 } from '../../Common/SweetAlert2';

@Component({
    selector: 'app-level-master',
    templateUrl: './level-master.component.html',
    styleUrls: ['./level-master.component.css'],
    standalone: false
})
export class LevelMasterComponent implements OnInit {
  LevelMasterFormGroup!: FormGroup;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public LevelMasterList: any = [];
  public UserID: number = 0;
  public searchText: string = ''; // For search input
  public tbl_txtSearch: string = ''; // For table search
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;

  request = new LevelMasterDataModel();
  sSOLoginDataModel = new SSOLoginDataModel()

  constructor(
    private commonMasterService: CommonFunctionService,
    private levelMasterService: LevelMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2
  ) { }

  async ngOnInit() {
    this.LevelMasterFormGroup = this.formBuilder.group({
      txtLevelNameEnglish: ['', Validators.required],
      txtLevelNameHindi: ['', [Validators.required,]],
      txtLevelNameShort: ['', Validators.required],
      ActiveStatus: ['true'],
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;
    await this.GetLevelMasterList()
  }

  get form() {
    return this.LevelMasterFormGroup.controls;
  }

  async GetLevelMasterList() {

    try {
      this.loaderService.requestStarted();
      await this.levelMasterService.GetAllLevels()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.LevelMasterList = data['Data'];
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
    if (this.LevelMasterFormGroup.invalid) {
      return
    }
    console.log("request", this.LevelMasterFormGroup.value)
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;
    this.request.CreatedBy = this.UserID;
    try {
      await this.levelMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State = EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();
            this.GetLevelMasterList()
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



  async btnEdit_OnClick(UserID: number) {
    this.isSubmitted = false;
    try {
      this.loaderService.requestStarted();
      const data = await this.levelMasterService.GetByID(UserID);
      const userData = JSON.parse(JSON.stringify(data))['Data'];

      // Update form controls with the retrieved data
      this.LevelMasterFormGroup.patchValue({
        txtLevelNameEnglish: userData["LevelNameEnglish"],
        txtLevelNameHindi: userData["LevelNameHindi"],
        txtLevelNameShort: userData["LevelNameShort"],

        ActiveStatus: userData["ActiveStatus"]
      });

      // Update the request object
      this.request.LevelID = userData["LevelID"];
      this.request.LevelNameEnglish = userData["LevelNameEnglish"];
      this.request.LevelNameHindi = userData["LevelNameHindi"];
      this.request.LevelNameShort = userData["LevelNameShort"]
      this.request.ActiveStatus = userData["ActiveStatus"];
      this.request.ActiveDeactive = userData["ActiveDeactive"];
      this.request.ModifyBy = this.UserID;

      // Update button texts
      const btnSave = document.getElementById('btnSave');
      if (btnSave) btnSave.innerHTML = "Update";
      const btnReset = document.getElementById('btnReset');
      if (btnReset) btnReset.innerHTML = "Cancel";

    } catch (error) {
      console.error(error);
    } finally {
      this.loaderService.requestEnded();
    }
  }


  //async btnDelete_OnClick(UserID: number, ModifyBy: number) {
  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this?")) {
  //      this.loaderService.requestStarted();
  //      await this.levelMasterService.DeleteDataByID(UserID, ModifyBy).then((data: any) => {
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        if (this.State == 0) {
  //          this.toastr.success(this.Message);
  //          this.GetLevelMasterList()
  //        } else {
  //          this.toastr.error(this.ErrorMessage);
  //        }
  //      });
  //    }
  //  } catch (ex) {
  //    console.log(ex);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async btnDelete_OnClick(LevelID: number) {
    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.levelMasterService.DeleteDataByID(LevelID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (!this.State) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetLevelMasterList()
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

  async ResetControl() {
    const txtLevelName = document.getElementById('txtLevelName');
    if (txtLevelName) txtLevelName.focus();
    this.isSubmitted = false;
    this.request.LevelID = 0;

    this.request.LevelNameEnglish = '';
    this.request.LevelNameHindi = '';
    this.request.LevelNameShort = '';
    this.request.ActiveStatus = true;
    this.request.ActiveDeactive = '';
    this.request.DeleteStatus = false;

    this.isDisabledGrid = false;
    const btnSave = document.getElementById('btnSave')
    if (btnSave) btnSave.innerHTML = "Save";
    const btnReset = document.getElementById('')
    if (btnReset) btnReset.innerHTML = "Reset";
  }



  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.LevelMasterList.length > 0) {
      try {
        this.isLoadingExport = true;
        let element = document.getElementById('tabellist');
        const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        ws['!cols'] = [];
        ws['!cols'][3] = { hidden: true };
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, " LevelMaster.xlsx");
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

  open(content: any, UserID: string) {
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
}
