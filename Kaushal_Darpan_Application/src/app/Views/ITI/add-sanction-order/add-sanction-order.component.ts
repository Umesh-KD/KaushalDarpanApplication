import { Component } from '@angular/core';
import { EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { ItiSanctionOrderList } from '../../../Models/ITI/ItiReportDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ScholarshipService } from '../../../Services/Scholarship/Scholarship.service';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppsettingService } from '../../../Common/appsetting.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { HiringRoleMasterService } from '../../../Services/HiringRoleMaster/hiring-role-master.service';

@Component({
  selector: 'app-add-sanction-order',
  standalone: false,
  templateUrl: './add-sanction-order.component.html',
  styleUrl: './add-sanction-order.component.css'
})
export class AddSanctionOrderComponent {

  public ScholarshipID: number = 0;
  public SemesterMasterList: any[] = [];
  public BranchList: any[] = [];
  public CategoryList: any[] = [];
  public OrderList: any[] = [];
  public _enumrole = EnumRole

  public request = new ItiSanctionOrderList()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public ScholarshipFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  
  public InstituteID: number = 0
  constructor(private commonMasterService: CommonFunctionService, private ScholarshipService: HiringRoleMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService, private formBuilder: FormBuilder, public appsettingConfig: AppsettingService,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal) {

  }

  async ngOnInit() {


    // form group
    this.ScholarshipFormGroup = this.formBuilder.group(
      {
        txtToatlstudent: ['', Validators.required],

        txtAmount: ['', Validators.required],
        StreamID: ['', [DropdownValidators]],
        SemesterID: ['', [DropdownValidators]],
        CategoryID: ['', [DropdownValidators]],

      });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ScholarshipID = Number(this.activatedRoute.snapshot.queryParamMap.get('SanctionID')?.toString());
    this.key = Number(this.activatedRoute.snapshot.queryParamMap.get('key')?.toString());//student list key

/*    await this.GetOrderList()*/


    if (this.ScholarshipID > 0) {
      await this.GetById();

    }
  }
  get _ScholarshipFormGroup() { return this.ScholarshipFormGroup.controls; }

  checkValue(event: any) {
    const value = event.target.value;
    if (value <= 0) {
      event.target.value = '';
    }
  }

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }

  async Back() {
    this.routers.navigate(['/SchlorshipList'])
  }



  async GetOrderList() {
    try {


      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterData("OrderList", this.request.ParentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.OrderList = data['Data'];

          // console.log(this.DivisionMasterList)
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
 


  // get detail by id
  async GetById() {
    try {

      this.loaderService.requestStarted();
      await this.ScholarshipService.GetByIDSanctionOrder(this.ScholarshipID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.request = data['Data'];
          this.GetOrderList()
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

  // get detail by id
  async SaveData() {

    try {



      if (this.request.OrderType == 0 && this.sSOLoginDataModel.RoleID != EnumRole.DTE_TrainingT2_establishment) {
        this.toastr.warning("Please Select Order Type")
        return
      }
      if (this.request.OrderDate == '') {
        this.toastr.warning("Please Add Order Date")
        return
      }
      if (this.request.OrderNo == '') {
        this.toastr.warning("Please Enter Order No")
        return
      }
      if (this.request.OrderCopy == '') {
        this.toastr.warning("Please Add Order Copy")
        return
      }

      if (this.request.ParentID ==0) {
        this.toastr.warning("Please Select Sanction Type")
        return
      }

      if(this.request.OrderType == 9999 && (this.request.OrderTypeName == '' || this.request.OrderTypeName == null || this.request.OrderTypeName == undefined)){
        this.toastr.warning("Please Enter Order Type Name")
        return
      }

    this.isSubmitted = true;
    //  if (this.ScholarshipFormGroup.invalid) {
    //    return
    //  }
    //  this.isLoading = true;
    //  this.loaderService.requestStarted();
     this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    //  //this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    //  //this.request.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    //  //this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    //this.request.InstituteID = this.sSOLoginDataModel.InstituteID;


    //  //save
      await this.ScholarshipService.SaveSanctionOrder(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.ResetControls();
            this.routers.navigate(['/SanctionOrderList']);
          }
          else if(data.State == EnumStatus.Warning){
            this.toastr.warning(data.Message)
          }
          else {
            this.toastr.error(data.ErrorMessage)
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

  // reset
  ResetControls() {

    this.request.OrderType = 0
    this.request.OrderCopy = ''
    this.request.OrderDate = ''
    this.request.OrderNo = ''
  /*  this.request.Category = 0*/
    //this.multiSelect.toggleSelectAll();
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }

  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "SanctionOrderCopy") {
        /*        this.request.Dis_DocName = data['Data'][0]["Dis_FileName"];*/
                this.request.OrderCopy = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
              event.target.value = null;
            }
            if (this.State == EnumStatus.Error) {
              this.toastr.error(this.ErrorMessage)
            }
            else if (this.State == EnumStatus.Warning) {
              this.toastr.warning(this.ErrorMessage)
            }
          });
      }
    }
    catch (Ex) {
      console.log(Ex);
    }
    finally {
      /*setTimeout(() => {*/
      this.loaderService.requestEnded();
      /*  }, 200);*/
    }
  }





}
