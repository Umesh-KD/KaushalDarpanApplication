import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ItiExaminerDataModel, ItiExaminerSearchModel, ITITeacherForExaminerSearchModels } from '../../../Models/ItiExaminerDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { ItiExaminerListService } from '../../../Services/ItiExaminerList/iti-examiner-list.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { ITITheorySearchModel } from '../../../Models/ITI/ItiInvigilatorDataModel';

@Component({
  selector: 'app-centers',
  templateUrl: './iti-examiner-list.component.html',
  styleUrls: ['./iti-examiner-list.component.css'],
  standalone: false
})
export class ItiExaminerListComponent implements OnInit {
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ItiExaminerMasterList: any = [];
  public UserID: number = 0;
  searchText: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  closeResult: string | undefined;
  modalReference: NgbModalRef | undefined;
  public tbl_txtSearch: string = '';
  public Table_SearchText: string = '';
  public DistrictList: any = [];
  //public GenderList: any = [];
  public ManagmentTypeList: any = []
  public StaffID: number | null = null;
  sSOLoginDataModel = new SSOLoginDataModel();
  request = new ItiExaminerDataModel()
  public searchRequest = new ItiExaminerSearchModel();
  public StudentList: any = [];
  private modalRef: any;
  public theorylist = new ITITeacherForExaminerSearchModels();





  constructor(private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ItiExaminerListService: ItiExaminerListService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private router: ActivatedRoute,
    private routers: Router,
    private _fb: FormBuilder,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    console.log("ssologin model", this.sSOLoginDataModel)
    //this.request.UserID = this.sSOLoginDataModel.UserID;
    //await this.GetCenterMasterList();
    this.UserID = this.sSOLoginDataModel.UserID;
    //await this.GetItiExaminerMasterList();
    this.GetItiExaminerMasterList();
    this.GetMasterData();

    //await this.commonMasterService.GetCommonMasterData('Gender')
    //  .then((data: any) => {
    //    data = JSON.parse(JSON.stringify(data));
    //    //this.GenderList = data['Data'];
    //    this.GenderList = data.Data;
    //    console.log("GenderList", this.GenderList)
    //  }, (error: any) => console.error(error)
    //  );


  }

  async GetMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDistrictMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictList = data.Data;
          console.log(this.DistrictList)
        }, (error: any) => console.error(error))

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

   //Method to handle the cancel button click
  ResetData() {
    // Reset all filter fields
    this.searchRequest.ExaminerCode = '';
    this.searchRequest.Name = '';
    this.searchRequest.Email = '';
    this.searchRequest.SSOID = '';
    this.searchRequest.DistrictID = 0;
    this.GetItiExaminerMasterList();
  }

  async GetItiExaminerMasterList() {
    //
    try {
      this.loaderService.requestStarted();
      console.log("searchrequest", this.searchRequest)
      await this.ItiExaminerListService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          //this.ItiExaminerMasterList = data['Data'];
          this.ItiExaminerMasterList = data.Data;
          //console.log("ItiExaminerMasterList", this.ItiExaminerMasterList)
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



  async btnDeleteOnClick(ExaminerID: number) {

    this.Swal2.Confirmation("Are you sure you want to delete this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ItiExaminerListService.DeleteDataByID(ExaminerID, this.request.ModifyBy)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetItiExaminerMasterList(); 
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
 
  exportToExcel(): void {
    const unwantedColumns = ['StaffID', 'DistrictID', 'ExaminerName', 'ExaminerSSOID', 'DistrictNameEnglish'];
    const filteredData = this.ItiExaminerMasterList.map((item: any) => {
      const filteredItem: any = {};
      Object.keys(item).forEach(key => {
        if (!unwantedColumns.includes(key)) {
          filteredItem[key] = item[key];
        }
      });
      return filteredItem;
    });
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();  
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ExaminerList.xlsx');
  }
  Onroute(ExaminerID: number, index: number) {
    this.routers.navigate(['/appointitiexaminer'], {
      queryParams: { ExaminerID: ExaminerID, SubjectType: index }
    });
  }

  async btnRevertOnClick(ExaminerID: number) {
    this.Swal2.Confirmation("Are you sure you want to Revert this ?",
      async (result: any) => {
        if (result.isConfirmed) {
          try {
            this.loaderService.requestStarted();
            await this.ItiExaminerListService.DeleteAssignedStudentsByExaminerID(ExaminerID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                this.State = data['State'];
                this.Message = data['Message'];
                this.ErrorMessage = data['ErrorMessage'];

                if (this.State = EnumStatus.Success) {
                  this.toastr.success(this.Message)
                  //reload
                  this.GetItiExaminerMasterList();
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


  async ClosePopup() {
    this.modalService.dismissAll()
  }


  CloseModalPopup() {
    this.modalService.dismissAll();
    //this.requestInv = new TimeTableInvigilatorModel()
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


  async GetAllTheoryStudents(content: any, ExaminerID: number) {
    this.modalRef = this.modalService.open(content, {
      size: 'xl',
      ariaLabelledBy: 'modal-basic-title',
      backdrop: 'static'
    });

    this.modalRef.result.then(
      (result: any) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
    this.theorylist.ExaminerID = ExaminerID
    this.theorylist.EndTermID = this.sSOLoginDataModel.EndTermID
    try {

      this.loaderService.requestStarted();
      await this.ItiExaminerListService.GetTeacherForExaminerById(this.theorylist)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StudentList = data['Data'];


          console.log("StudentList", this.StudentList)
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

}
