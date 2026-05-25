import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { ITITradeDataModels, ITITradeSearchModel } from '../../../Models/ITITradeDataModels';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { HostelFeeModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';

@Component({
  selector: 'app-List-hostel-fee-management',
  templateUrl: './List-hostel-fee-management.component.html',
  styleUrls: ['./List-hostel-fee-management.component.css'],
  standalone: false
})
export class ListhostelfeemanagementComponent {
  public Searchrequest = new HostelFeeModel();
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ITITradeList: any = [];
  searchText: string = '';
  public CollegeTypeList: any[] = [];
 
  public TradeTypesList: any = [];
  public TradeData: ITITradeSearchModel[] = [];
  request = new ITITradeDataModels()

  public tbl_txtSearch: string = '';
  //table feature default
  //end table feature default

  public HostelFeeList: any = [];
  public requestFormGroup!: FormGroup;
  public Table_SearchText: string = "";
  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(
    private commonMasterService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private studentRequestService: StudentRequestService,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit()
  {

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.requestFormGroup = this.formBuilder.group({
      Cautionfee: ['', Validators.required],
      HostelFee: ['', Validators.required]
    });


   await this.GetHostelFee()

    

  }
  get _requestFormGroup() { return this.requestFormGroup.controls; }

  async GetTradeTypesList()
  {
    
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetTradeTypesList().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.TradeTypesList = data.Data; 
        //this.loadInTable();
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetHostelFee() {
    debugger
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID
      this.Searchrequest.EndTermID = this.sSOLoginDataModel.EndTermID
      await this._HostelManagmentService.getHostelFeeList(this.Searchrequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.HostelFeeList = data['Data'];
          console.log('Hostel Fee List ==>', this.HostelFeeList)
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


  


  async GetHostelFeeByID(HostelFeeId: number) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.router.navigate(['/Add-hostel-fee-management', HostelFeeId]);

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}
