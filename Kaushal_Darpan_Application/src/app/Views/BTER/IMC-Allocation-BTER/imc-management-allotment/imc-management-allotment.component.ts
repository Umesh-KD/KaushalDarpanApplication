import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { IMCAllocationDataModel, IMCAllocationSearchModel } from '../../../../Models/ITIIMCAllocationDataModel';
import { IMCManagementAllotmentService } from '../../../../Services/BTER/IMC-Management-Allotment/imc-management-allotment.service';
import { EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { ReportService } from '../../../../Services/Report/report.service';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-imc-management-allotment',
  standalone: false,
  
  templateUrl: './imc-management-allotment.component.html',
  styleUrl: './imc-management-allotment.component.css'
})
export class IMCManagementAllotmentComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  request = new IMCAllocationDataModel()
  public searchRequest = new IMCAllocationSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  public IMCAllotedList: any[] = [];
  public IsAddNewAllotment: boolean = false;
  modalReference: NgbModalRef | undefined;
  closeResult: string | undefined;
  constructor(
    private commonMasterService: CommonFunctionService,
    private ReportService: ReportService,
    private Router: Router,
    private IMCManagementAllotmentService: IMCManagementAllotmentService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2,
    private appsettingConfig: AppsettingService,
    private route: ActivatedRoute,
    private http: HttpClient

  ) {
  }

  async ngOnInit() {
    //this.searchRequest.TradeLevel = parseInt(this.route.snapshot.paramMap.get('id'));
    //alert(this.searchRequest.TradeLevel);
    await this.getIMCAllotedList();
  }

  async getIMCAllotedList() {
    try {
      this.loaderService.requestStarted();
      await this.IMCManagementAllotmentService.GetAllData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.IMCAllotedList = data['Data'];
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

  onResetCancel(): void {
    this.searchRequest.ApplicationID = 0;
    this.getIMCAllotedList();
  }

  async AddNewAllotment(content: any) {
    //alert(ID)
    this.IsAddNewAllotment = true;
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
    });

  }


  CloseAddNewAllotment() {
    this.modalService.dismissAll();
  }

  async RevertAllotment(ApplicationID: number, CollegeTradeId: number, AllotedCategory: string) {
    //alert(ApplicationID);
    this.request.ApplicationID = ApplicationID;
    this.request.CollegeTradeID = CollegeTradeId;
    // this.request.AllotedCategory = AllotedCategory;
    //alert(this.request.ApplicationID);
    //alert(this.request.CollegeTradeID);

    if (AllotedCategory.includes(' ')) {
      this.request.SeatMetrixColumn = AllotedCategory.replace(/ /g, '_');
    }
    else {
      this.request.SeatMetrixColumn = AllotedCategory;
    }

    //alert(this.request.AllotedCategory);
    const confirmationMessage = 'Are you sure you want to revert this application ?'

    this.Swal2.Confirmation(confirmationMessage, async (result: any) => {
      if (result.isConfirmed) {

        try {
          this.loaderService.requestStarted();
          await this.IMCManagementAllotmentService.RevertAllotments(this.request)
            .then((data: any) => {
              data = JSON.parse(JSON.stringify(data));
              this.State = data['State'];
              this.Message = data['Message'];
              this.ErrorMessage = data['ErrorMessage'];
              // this.IMCAllotedList = data['Data'];
              this.getIMCAllotedList();
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

    })
  }



  async GetAllotmentReceipt(AllotmentId: any) {
    ;
    try {
      this.loaderService.requestStarted();
      await this.ReportService.GetAllotmentReceipt(AllotmentId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.DownloadFile(data.Data, 'file download');
          }
          else {
            this.toastr.error(data.ErrorMessage)
            //    data.ErrorMessage
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
  DownloadFile(FileName: string, DownloadfileName: any): void {

    const fileUrl = this.appsettingConfig.StaticFileRootPathURL + "/" + GlobalConstants.AllotmentReceipt + "/" + FileName; // Replace with your URL
    // Fetch the file as a blob
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName('pdf'); // Set the desired file name
      downloadLink.click();
      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    });
  }
  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Replace invalid characters
    return `file_${timestamp}.${extension}`;
  }
}


