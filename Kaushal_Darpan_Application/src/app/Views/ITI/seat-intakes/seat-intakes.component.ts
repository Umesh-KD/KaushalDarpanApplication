import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { SeatIntakesDataModel, SeatIntakesSearchModel } from '../../../Models/SeatIntakesDataModel';
import { ItiTradeService } from '../../../Services/iti-trade/iti-trade.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';

@Component({
    selector: 'app-seat-intakes',
    templateUrl: './seat-intakes.component.html',
    styleUrls: ['./seat-intakes.component.css'],
    standalone: false
})
export class SeatIntakesComponent {
  public State: number = -1;
  groupForm!: FormGroup;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public ITITradeList: any = [];
  searchText: string = '';
  public Table_SearchText: string = '';
  public tbl_txtSearch: string = '';

  constructor(
    private commonMasterService: CommonFunctionService,
    private Router: Router,
    private ItiTradeService: ItiTradeService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private router: Router,
    private routers: ActivatedRoute,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {
  }
}
