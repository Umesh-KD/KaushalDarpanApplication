import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PaperMasterSearchModel, PapersMasterDataModels } from '../../../Models/PaperMasterDataModels';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { PaperMasterService } from '../../../Services/PapersMaster/papers-master.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import * as XLSX from 'xlsx';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
@Component({
    selector: 'app-papers-master',
    templateUrl: './papers-master.component.html',
    styleUrls: ['./papers-master.component.css'],
    standalone: false
})
export class PapersMasterComponent implements OnInit {

  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public PaperMasterList: any = [];
  public SemesterList: any = [];
  public BranchList: any = [];
  public UserID: number = 0;
  searchText: string = ''; // This is for search input
  tbl_txtSearch: string = ''; // Add this property
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public searchByPaper: string = ''
  public searchByBranch: string = ''
  public searchBySemester: string = ''
  public searchBySubjectCode: string = ''
  public searchBySubjectCategory: string = ''
  public searchBySubjectName: string = ''
  public Table_SearchText: string = '';
  request = new PapersMasterDataModels()
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new PaperMasterSearchModel()

  constructor(
    private commonMasterService: CommonFunctionService,
    private PaperMasterService: PaperMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private branchservice: StreamMasterService,
    private Router: Router,
    private Swal2: SweetAlert2

  ) { }

  async ngOnInit() {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    await this.GetPaperMasterList();
    await this.GetSemesterList()
    await this.GetBranchList();

  }





  async GetPaperMasterList() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.PaperMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PaperMasterList = data['Data'];

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async GetSemesterList() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SemesterList = data['Data'];

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetBranchList() {

    try {
      this.loaderService.requestStarted();
      await this.branchservice.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BranchList = data['Data'];

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  // Method to handle the cancel button click
  ResetControl() {
    // Reset all filter fields
    this.searchByPaper = '';
    this.searchByBranch = '';
    this.searchBySemester = '';
    this.searchBySubjectCode = '';
    this.searchBySubjectCategory = '';
    this.searchBySubjectName = '';





    //    this.searchByDistrict = 0;

    this.GetPaperMasterList()
  }


  onSearchClick() {

    const searchCriteria: any = {
      PaperSlug: this.searchByPaper.trim().toLowerCase(),
      SemesterName: this.searchBySemester.trim().toLowerCase(),
      SubjectCode: this.searchBySubjectCode.trim().toLowerCase(),
      SubjectCat: this.searchBySubjectCategory.trim().toLowerCase(),
      SubjectName: this.searchBySubjectName.trim().toLowerCase(),

      BranchName: this.searchByBranch.trim().toLowerCase(),

      //  DistrictID: Number(this.searchByDistrict),


    };

    this.PaperMasterList = this.PaperMasterList.filter((college: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }
        const paperValue = college[key];
        if (typeof paperValue === 'string') {
          return paperValue.toLowerCase().includes(searchValue);
        }
        return paperValue === searchValue;



      });
    });
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.PaperMasterList.length > 0) {
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
  //async btnDelete_OnClick(StreamID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      await this.PaperMasterService.DeleteDataByID(StreamID, this.UserID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            this.GetPaperMasterList()
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

  async btnDelete_OnClick(StreamID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.PaperMasterService.DeleteDataByID(StreamID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetPaperMasterList()
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
      }
    );
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
    this.Router.navigate(['/updatepapersmaster', id]);
    console.log(id)
  }

}


