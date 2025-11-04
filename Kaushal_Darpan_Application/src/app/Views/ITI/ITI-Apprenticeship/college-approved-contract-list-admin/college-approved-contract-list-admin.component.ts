import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ITIApprenticeshipService } from '../../../../Services/ITI/ITI-Apprenticeship/iti-apprenticeship.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';

@Component({
  selector: 'app-college-approved-contract-list-admin',
  standalone: false,
  templateUrl: './college-approved-contract-list-admin.component.html',
  styleUrl: './college-approved-contract-list-admin.component.css'
})
export class CollegeApprovedContractListAdminComponent {
  public sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest: any = {};
  constructor(
    private commonMasterService: CommonFunctionService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private apprenticeshipService: ITIApprenticeshipService
  ) { }

  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
  }
}
