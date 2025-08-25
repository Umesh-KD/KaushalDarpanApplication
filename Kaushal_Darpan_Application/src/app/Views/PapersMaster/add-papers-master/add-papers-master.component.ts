import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { TimeTableDataModels } from '../../../Models/TimeTableModels';
import { PaperMasterService } from '../../../Services/PapersMaster/papers-master.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { CommonSubjectService } from '../../../Services/CommonSubjects/common-subjects.service';
import { PapersMasterDataModels } from '../../../Models/PaperMasterDataModels';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
    selector: 'app-add-papers-master',
    templateUrl: './add-papers-master.component.html',
    styleUrls: ['./add-papers-master.component.css'],
    standalone: false
})
export class AddPapersMasterComponent {
  PaperForm!: FormGroup;
  public isUpdate: boolean = false;
  public PaperID: number | null = null;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;

  public State: number = -1;

  public PaperTypeList: any = [];
  public SubjectList: any = [];

  public SemesterList: any = [];
  public BranchMasterList: any = []
  public FinancialYearList: any = []
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
  request = new PapersMasterDataModels()


  constructor(
    private fb: FormBuilder,
    private PaperMasterService: PaperMasterService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private streamService: StreamMasterService,
    private commonSubject: CommonSubjectService
  ) {

  }


  async ngOnInit() {

    this.PaperForm = this.fb.group({

      StreamID: ['', [DropdownValidators]],
      SemesterID: ['', [DropdownValidators]],

      FinancialYearID: ['', [DropdownValidators]],
      SubjectCat: ['', Validators.required],
      SubjectCode: ['', Validators.required],
      SubjectName: ['', Validators.required],
      Paper0L: ['', Validators.required],
      Paper0T: ['', Validators.required],
      Paper0P: ['', Validators.required],
      Paper0Th: ['', Validators.required],
      Paper0Pr: ['', Validators.required],
      Paper0Ct: ['', Validators.required],
      Paper0Tu: ['', Validators.required],
      Paper0Prs: ['', Validators.required],
      Paper0Credit: ['', Validators.required],
      Paper0CommonSubjectId: ['', [DropdownValidators]],
      Paper0PaperType: ['', [DropdownValidators]]







    });

    this.PaperID = Number(this.route.snapshot.paramMap.get('id')?.toString());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.UserID = this.sSOLoginDataModel.UserID;

    await this.GetStreamMasterList()
    await this.GetPaperType()
    await this.GetSubjectList()
    await this.GetSemesterList()
    await this.GetFinancialYear()
    if (this.PaperID) {
      await this.GetByID(this.PaperID)
    }

  }

  async GetPaperType() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetPaperType()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.PaperTypeList = data['Data'];

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

  async GetFinancialYear() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetFinancialYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.FinancialYearList = data['Data'];

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




  async GetStreamMasterList() {
    try {
      this.loaderService.requestStarted();
      await this.streamService.GetAllData()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.BranchMasterList = data['Data'];


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




  async GetSemesterList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.SemesterMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SemesterList = data['Data'];

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

  async GetSubjectList() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectMaster(this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.SubjectList = data['Data'];

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


  get form() { return this.PaperForm.controls; }

  async GetByID(id: number) {
    try {
      this.loaderService.requestStarted();
      await this.PaperMasterService.GetByID(id)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));

          // Map the data properties to the `PapersMasterDataModels` properties

          this.request.FinancialYearID = data['Data']['FinancialYearID'];

          this.request.SubjectCode = data['Data']['SubjectCode'];
          this.request.SemesterID = data['Data']['SemesterID'];
          this.request.StreamSubjectCode = data['Data']['StreamSubjectCode'];
          this.request.SubjectCat = data['Data']['SubjectCat'];
          this.request.SubjectID = data['Data']['SubjectID'];
          this.request.SubjectName = data['Data']['SubjectName'];
          this.request.L = data['Data']['L'];
          this.request.T = data['Data']['T'];
          this.request.P = data['Data']['P'];
          this.request.Th = data['Data']['Th'];
          this.request.Pr = data['Data']['Pr'];
          this.request.Ct = data['Data']['Ct'];
          this.request.Tu = data['Data']['Tu'];
          this.request.Prs = data['Data']['Prs'];
          this.request.Credit = data['Data']['Credit'];
          this.request.Paper_ID = data['Data']['Paper_id'];
          this.request.StreamID = data['Data']['StreamID'];
          console.log(data)

          // Update UI elements if necessary
          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const btnReset = document.getElementById('btnReset');
          if (btnReset) btnReset.innerHTML = "Cancel";

        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async saveData() {
    this.isSubmitted = true;
    if (this.PaperForm.invalid) {
      return console.log("error", this.PaperForm)
    }


    this.loaderService.requestStarted();
    this.isLoading = true;

    try {

      if (this.PaperID) {
        this.request.PaperID = this.PaperID
      }
      await this.PaperMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message)
            this.ResetControl();


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
    this.request = new PapersMasterDataModels
    this.PaperForm.reset();

    // Reset form values if necessary
    this.PaperForm.patchValue({
      SemesterID: 0,
      BranchID: 0,
      FinancialYearID: 0,
      SubjectID: '',
      SubjectCat: '',
      SubjectCode: '',
      SubjectName: '',
      Paper0L: '',
      Paper0T: '',

      Paper0P: '',
      Paper0Th: '',

      Paper0Pr: '',
      Paper0Ct: '',
      Paper0Tu: '',
      Paper0Prs: '',
      Paper0Credit: '',
      Paper0CommonSubjectId: 0,
      Paper0PaperType: 0,





    });
  }

  onCancel(): void {
    this.router.navigate(['/timetable']);
  }
}
