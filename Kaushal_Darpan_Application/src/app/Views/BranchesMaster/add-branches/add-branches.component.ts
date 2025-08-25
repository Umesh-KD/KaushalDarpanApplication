import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { StreamMasterDataModelsTesting } from '../../../Models/StreamMasterDataModelsTesting';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';



@Component({
  selector: 'app-add-branches-master',
  templateUrl: './add-branches.component.html',
  styleUrls: ['./add-branches.component.css'],
  standalone: false
})
export class AddBranchesMasterComponent implements OnInit {
  branchForm!: FormGroup;
  public isUpdate: boolean = false;
  public StreamID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public State: number = -1;
  public DistrictMasterList: any = []
  public DivisionMasterList: any = []
  public TehsilMasterList: any = []
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
  request = new StreamMasterDataModelsTesting()
  public StreamTypeList: any = [];

  constructor(
    private fb: FormBuilder,
    private streamService: StreamMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) {

  }


  async ngOnInit() {

    this.branchForm = this.fb.group({
      txtbranchName: ['', Validators.required],
      txtduration: ['', Validators.required],
      ddlstreamType: ['', [DropdownValidators]],
      txtcode: ['', Validators.required],
      txtqualification: ['', Validators.required]
    });
    this.StreamID = Number(this.route.snapshot.paramMap.get('id')?.toString());

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    await this.GetStreamType()
    //if (this.StreamID) {
    //  await this.GetByID(this.StreamID)
    //}
    

  }

  async saveData() {
    this.isSubmitted = true;
    if (this.branchForm.invalid) {
      return
    }

    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.StreamID) {
        this.request.StreamID = this.StreamID
        this.request.ModifyBy = this.sSOLoginDataModel.UserID;

      } else {
        this.request.CreatedBy = this.sSOLoginDataModel.UserID;
      }
      this.request.EndTermID = this.sSOLoginDataModel.EndTermID
      await this.streamService.SaveData(this.request).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data = ['ErrorMessage'];
        if (this.State = EnumStatus.Success) {
          this.toastr.success(this.Message)
          this.ResetControl();
          this.router.navigate(['/branches'])
        } else {
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
    this.request = new StreamMasterDataModelsTesting()
    this.branchForm.reset();
    this.isUpdate = false;
    this.branchForm.patchValue({
      branchName: '',
      code: '',
      duration: '',
      entryQualificationDetails: '',
      streamType: 0
    });
    this.StreamID=0
  }



  get form() { return this.branchForm.controls; }

  async GetStreamType() {
    try {
      await this.commonMasterService.GetStreamType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.StreamTypeList = data['Data'];
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
