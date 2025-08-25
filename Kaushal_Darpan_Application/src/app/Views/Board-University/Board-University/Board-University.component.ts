import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

import { ActivatedRoute, Router } from '@angular/router';

import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { Board_UniversityMasterModel,Board_UniversityMasterSearchModel} from '../../../Models/Board_UniversityMasterModel';
import { Board_UniversityMasterService} from '../../../Services/BoardUniversityMaster/Board_UniversityMaster.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-Board-University',
  templateUrl: './Board-University.component.html',
  styleUrls: ['./Board-University.component.css'],
    standalone: false
})
export class BoardUniversityComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];

  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public Board_UniversityMasterList: any = [];
  public ID: number = 0;
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public searchByBranchType: string = ''
  public searchByBranchName: string = ''
  public searchByBranchCode: string = ''
  public StreamTypeList: any = []
  public ExamList: any[] = [];
  public Table_SearchText: string = '';
  public searchByGroupCode: string = ''
  public searchByCenterCode: string = ''
  public searchBySubjectCode: string = ''
  public searchByExamName: string = ''

  public tbl_txtSearch: string = '';


  request = new Board_UniversityMasterModel()
  public searchRequest = new Board_UniversityMasterSearchModel();
  sSOLoginDataModel = new SSOLoginDataModel();

  constructor(private commonMasterService: CommonFunctionService, private Router: Router, private Board_UniversityMasterService: Board_UniversityMasterService, private toastr: ToastrService,
    private loaderService: LoaderService, private router: ActivatedRoute, private routers: Router, private modalService: NgbModal, private Swal2: SweetAlert2) {
  }


  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ID = this.sSOLoginDataModel.UserID;
    this.UserID = this.sSOLoginDataModel.UserID;

    await this.GetGroupList();
  }

 

  async GetGroupList() {
   
    try {
      this.loaderService.requestStarted();
      await this.Board_UniversityMasterService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.Board_UniversityMasterList = data['Data'];
         
          this.Board_UniversityMasterList 
          console.log(this.Board_UniversityMasterList, "GroupMaster")
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


  // Method to handle the cancel button click
  ResetControl() {
    this.isSubmitted = false;
    this.searchRequest = new Board_UniversityMasterSearchModel();
    this.Board_UniversityMasterList = [];
  }


  onSearchClick() {

    const searchCriteria: any = {
      Code: this.searchByGroupCode.trim().toLowerCase(),
      CenterCode: this.searchByCenterCode.trim().toLowerCase(),
      SubjectCode: this.searchBySubjectCode.trim().toLowerCase(),
    };


    this.Board_UniversityMasterList = this.Board_UniversityMasterList.filter((college: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }
        const groupValue = college[key];
        if (typeof groupValue === 'string') {
          return groupValue.toLowerCase().includes(searchValue);
        }
        return groupValue === searchValue;
      });
    });
  }

  btnExportTable_Click(): void {
    this.loaderService.requestStarted();
    if (this.Board_UniversityMasterList.length > 0) {
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
        XLSX.writeFile(wb, "GroupMaster.xlsx");
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
  //async btnDelete_OnClick(GroupID: number) {

  //  this.isSubmitted = false;
  //  try {
  //    if (confirm("Are you sure you want to delete this ?")) {
  //      this.loaderService.requestStarted();
  //      await this.GroupServices.DeleteDataByID(GroupID, this.UserID)
  //        .then((data: any) => {
  //          this.State = data['State'];
  //          this.Message = data['Message'];
  //          this.ErrorMessage = data['ErrorMessage'];
  //          if (this.State == 0) {
  //            this.toastr.success(this.Message)
  //            this.GetGroupList()
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

  async btnDelete_OnClick(ID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.Board_UniversityMasterService.DeleteDataByID(ID, this.UserID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetGroupList()
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
    this.Router.navigate(['/updateBoardUniversity', id]);
    console.log(id)
  }
}
