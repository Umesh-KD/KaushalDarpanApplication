import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { TPOWebsiteSearchModel } from '../../../Models/CreateTPOModel';
import { CreateTpoService } from '../../../Services/TPOMaster/create-tpo.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
    selector: 'app-tpo-home',
    templateUrl: './tpo-home.component.html',
    styleUrls: ['./tpo-home.component.css'],
    standalone: false
})
export class TPOHomeComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  searchText: string = '';
  public DistrictMasterList: any = [];
  public InstituteMasterList: any = [];
  public TPOList: any[] = [];
  public searchRequest = new TPOWebsiteSearchModel();
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';
  sSOLoginDataModel = new SSOLoginDataModel();
  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private TPOService: CreateTpoService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }

  async ngOnInit() {
    await this.ddlStateChange();
    await this.getTPOList();
    /*this.getTSPAreatblList();*/
  }


  async ddlStateChange() {
    this.searchRequest.StateID = 6;
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_StateIDWise(this.searchRequest.StateID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
          console.log(this.DistrictMasterList, 'District List')
          if (this.searchRequest.DistrictID != 0) {
            this.ddlDistrictChange();
          }

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

  async ddlDistrictChange() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetInstituteMaster_ByDistrictWise(this.searchRequest.DistrictID,this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.InstituteMasterList = data['Data'];
          console.log(this.InstituteMasterList,'Institute List')
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

  async getTPOList() {
    try {
      this.loaderService.requestStarted();
      await this.TPOService.GetTPOHomeData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.TPOList = data['Data'];
          console.log(this.TPOList, "TPOList")
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

  async SearchTPO() {
    this.getTPOList();
  }

  async SearchReset() {
    this.searchRequest.DistrictID = 0;
    this.searchRequest.InstituteID = 0;
    this.getTPOList();
  }

}
