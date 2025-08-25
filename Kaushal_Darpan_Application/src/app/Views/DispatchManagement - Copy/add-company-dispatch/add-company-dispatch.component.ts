import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { CompanyDispatchService } from '../../../Services/CompanyDispatch/CompanyDispatch.service';
import { CompanyDispatchIUMasterModel } from '../../../Models/DispatchFormDataModel';

@Component({
  selector: 'app-add-company-dispatch',
  templateUrl: './add-company-dispatch.component.html',
  styleUrls: ['./add-company-dispatch.component.css'],
    standalone: false
})
export class addcompanydispatchComponent implements OnInit {
  groupForm!: FormGroup;
  public isUpdate: boolean = false;
  isEditing: boolean = false;
  public ID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public State: number = -1;
  public DistrictMasterList: any = []
  public DivisionMasterList: any = []
  public TehsilMasterList: any = []
  public SubjectMasterList: any = [];
  public ExamList: any[] = [];
  public UserID: number = 0;
  public searchText: string = '';
  public tbl_txtSearch: string = '';
  public isDisabledGrid: boolean = false;
  public isDisabledDOJ: boolean = false;
  public isSubmittedItemDetails: boolean = false;
  public isLoadingExport: boolean = false;
  public closeResult: string | undefined;
  public modalReference: NgbModalRef | undefined;
  sSOLoginDataModel = new SSOLoginDataModel();
  public searchRequest = new CompanyDispatchIUMasterModel();
  request = new CompanyDispatchIUMasterModel()



  constructor(
    private fb: FormBuilder,
    private CompanyDispatchService: CompanyDispatchService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) {

  }


  async ngOnInit() {

    this.groupForm = this.fb.group({

      txtcompanyName: ['', Validators.required],
      txtsupplierName: ['', Validators.required],
      txtsupplierMobileNo: ['', Validators.required],
      txtsupplierVechileNo: ['', Validators.required],
  /*    txtRemark: ['', Validators.required],*/
    
    });
    this.ID = Number(this.route.snapshot.paramMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    //await this.GetSubjectMasterList();
    //this.getExamMasterList()


    if (this.ID) {
      await this.GetByID(this.ID)
      this.isUpdate = true
      this.isEditing = true
    }
  }

  get form() { return this.groupForm.controls; }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();

      await this.CompanyDispatchService.GetByIdCompanyDispatch(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request.companyName = data['Data']["CompanyName"];
          this.request.supplierName = data['Data']["SupplierName"];
          this.request.supplierMobileNo = data['Data']["SupplierMobileNo"];
          this.request.supplierVehicleNo = data['Data']["SupplierVehicleNo"];
          this.request.remark = data['Data']["Remark"];
          this.request.companyID = data['Data']["CompanyID"];
          this.request.createdBy = data['Data']["CreatedBy"];
          this.request.modifyBy = data['Data']["ModifyBy"];
          console.log(data)
          // console.log(this.DivisionMasterList)

          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

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

  //async GetSubjectMasterList() {
  //  this.searchRequestSub.DepartmentID = this.sSOLoginDataModel.DepartmentID
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.SubjectMasterService.GetAllData(this.searchRequestSub)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.State = data['State'];
  //        this.Message = data['Message'];
  //        this.ErrorMessage = data['ErrorMessage'];
  //        this.SubjectMasterList = data['Data'];
  //        console.log(this.SubjectMasterList, "CodeSubject")
  //      }, error => console.error(error));
  //  }
  //  catch (Ex) {
  //    console.log(Ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  //async getExamMasterList() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetExamName().then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.ExamList = data.Data;
  //      console.log("ExamList", this.ExamList);
  //    })
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async saveData() {
    
    this.isSubmitted = true;
    if (this.groupForm.invalid) {
      return console.log("error")
    }
    //Show Loading
    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      this.request.departmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.courseTypeID = this.sSOLoginDataModel.Eng_NonEng;
      this.request.endTermID = this.sSOLoginDataModel.EndTermID;
      if (this.ID) {
        this.request.companyID = this.ID
        this.request.modifyBy = this.sSOLoginDataModel.UserID;
      } else {
        this.request.createdBy = this.sSOLoginDataModel.UserID;
      }
     
      await this.CompanyDispatchService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.ResetControl();
           /* this.router.navigate(['/groups']);*/
            this.toastr.success(this.Message)
            this.router.navigate(['/companydispatchlist']);
          } else if (this.State == EnumStatus.Warning) {
            this.toastr.warning(this.ErrorMessage)

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


  async ResetControl() {
    this.isSubmitted = false;
    this.request = new CompanyDispatchIUMasterModel()
    this.groupForm.reset();
    // Reset form values if necessary
    this.groupForm.patchValue({

      code: '',

    });
  }

  onCancel(): void {
    this.router.navigate(['/groups']);
  }

}
