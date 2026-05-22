import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Common/common';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { HostelManagmentService } from '../../../Services/HostelManagment/HostelManagment.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StudentRequestService } from '../../../Services/StudentRequest/student-request.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { HostelFeeModel } from '../../../Models/Hostel-Management/HostelManagmentDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';

@Component({
  selector: 'app-bter-hostel-fee',
  standalone: false,
  templateUrl: './bter-hostel-fee.component.html',
  styleUrl: './bter-hostel-fee.component.css'
})
export class BterHostelFeeComponent {
  public Table_SearchText: string = "";
  sSOLoginDataModel = new SSOLoginDataModel();
  public Searchrequest = new HostelFeeModel();
  public request = new HostelFeeModel()
  public requestFormGroup!: FormGroup;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  //public ErrorMessage: string = '';
  public ErrorMessage: any = [];
  public HostelFeeList: any = [];

  constructor(
    private commonMasterService: CommonFunctionService,
    private _HostelManagmentService: HostelManagmentService,
    private route: ActivatedRoute,
    private router: Router,
    private routers: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private Swal2: SweetAlert2,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private studentRequestService: StudentRequestService,

  ) { }



  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.requestFormGroup = this.formBuilder.group({
      Cautionfee: ['', Validators.required],
      HostelFee: ['', Validators.required]
    });
    this.GetHostelFee();
  }

  get _requestFormGroup() { return this.requestFormGroup.controls; }


  async GetHostelFee() {
    try {
      this.loaderService.requestStarted();
      this.Searchrequest.InstituteID = this.sSOLoginDataModel.InstituteID;
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

  saveData() {
    debugger
    this.isSubmitted = true;
    if (this.requestFormGroup.invalid) {
      return;
    }
    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CourseTypeID = 0
    this.request.HostelId = 0;
    this._HostelManagmentService.SaveHostelFee(this.request).then((res: any) => {
      if (res.StatusCode === 200) {
        this.toastr.success(res.Message);
        this.GetHostelFee();
        //this.router.navigate(['/bter-hostel-fee']);
      }
    }).catch((err: any) => {
      this.toastr.error(err.message, 'Error');
    });

  }


  async saveData1() {
    debugger;
    this.isSubmitted = true;
    if (this.requestFormGroup.invalid) {
      return;
    }

    this.request.InstituteID = this.sSOLoginDataModel.InstituteID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.CourseTypeID = 0
    this.request.HostelId = 0;
    const isUpdate = this.request.HostelFeeId && this.request.HostelFeeId > 0;
    try {
      const data: any = await this._HostelManagmentService.SaveHostelFee(this.request);

      this.State = data.State;
      this.Message = data.Message;
      this.ErrorMessage = data.ErrorMessage;

      if (this.State === EnumStatus.Success) {

        const successMsg = isUpdate
          ? 'Hostel Fee updated successfully'
          : 'Hostel Fee saved successfully';

        this.toastr.success(successMsg);
        this.router.navigate(['/bter-hostel-fee']);
      }
      else {
        this.toastr.error(this.ErrorMessage);
      }

    } catch (ex) {
      console.error(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


  async ResetControl() {
    debugger
    this.isSubmitted = false;
    this.request = new HostelFeeModel();
    this.requestFormGroup.reset();
    this.request.Cautionfee = 0;
    this.request.HostelFee = 0;
  }


  //public HostelFeeId: number = 0;
  
  async GetHostelFeeByID1(HostelFeeId: number) {
    debugger
    try {
      this.loaderService.requestStarted();

      await this._HostelManagmentService.GetHostelFeeByID(HostelFeeId)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
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



  async GetHostelFeeByID(HostelFeeId: number) {
    debugger;

    try {
      this.loaderService.requestStarted();

      const res: any = await this._HostelManagmentService.GetHostelFeeByID(HostelFeeId);
      const data = JSON.parse(JSON.stringify(res));

      if (data && data.Data) {
        const item = data.Data;

        this.request.HostelFeeId = item.HostelFeeId;

        this.requestFormGroup.patchValue({
          Cautionfee: item.Cautionfee,
          HostelFee: item.HostelFee
        });

      }

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

}
