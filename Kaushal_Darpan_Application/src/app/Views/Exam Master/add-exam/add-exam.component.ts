import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { MenuMasterDataModel, MenuMasterSerchModel } from '../../../Models/MenuMasterModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { MenuMasterService } from '../../../Services/MenuMaster/menu-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ExamMasterService } from '../../../Services/ExamMaster/exam-master.service';
import { ExamMasterDataModel } from '../../../Models/ExamMasterDataModel';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
    selector: 'app-add-exam',
    templateUrl: './add-exam.component.html',
    styleUrls: ['./add-exam.component.css'],
    standalone: false
})
export class AddExamComponent {
  sSOLoginDataModel: any;
  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public TodayDate = new Date()
  closeResult: string | undefined;
  isAddMenuModalVisible: boolean = false;
  isDropdownVisible: boolean = false; // Checkbox state
  ParentId: number | null = null;
  public request = new ExamMasterDataModel;
  public FinancialYear: any = []
  public SemesterMasterList: any = []
  public StreamMasterList: any = []
  public ExamTypeList: any = []
  public ProgramTypeList: any = []
  public MonthList: any = []
  public StreamTypeList: any = []
  public ExamCategoryList: any = []
  public ExamMasterID: number | null = null;
  public ExamFormGroup!: FormGroup;
  filteredSemesterList = [...this.SemesterMasterList];

  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private examMasterService: ExamMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }
  get _ExamFormGroup() { return this.ExamFormGroup.controls; }
  async ngOnInit() {
    this.ExamFormGroup = this.fb.group(
      {
        MonthID: ['', [DropdownValidators]],
        ddlFinancialYearID: ['', [DropdownValidators]],
        StreamTypeID: ['', [DropdownValidators]],
        ExamID: ['', [DropdownValidators]],
        ddlSemesterID: ['', [DropdownValidators]],
        ExamTypeID: ['', [DropdownValidators]]

      })
    this.loadDropdownData('FinancialYear');
    this.loadDropdownData('Semester');
    this.loadDropdownData('Month');
    this.loadDropdownData('ExamType');
    this.loadDropdownData('ProgramType');
    this.loadDropdownData('AdmissionCategory');
    this.filteredSemesterList = [...this.SemesterMasterList];
    ////this.GetMasterData();
    //this.SaveDataExam();
    console.log('Data');
    this.ExamMasterID = Number(this.activatedRoute.snapshot.queryParamMap.get('ExamMasterID')?.toString());
    if (this.ExamMasterID > 0) {
      await this.Get_ExamMasterData_ByID(this.ExamMasterID);
    }
  }

  //async GetMasterData() {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.commonMasterService.GetFinancialYear()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.FinancialYear = data['Data'];
  //        console.log(this.FinancialYear, "Year")
  //      }, error => console.error(error));
  //    await this.commonMasterService.SemesterMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.SemesterMasterList = data['Data'];
  //      }, error => console.error(error));
  //    await this.commonMasterService.StreamMaster()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.StreamMasterList = data['Data'];
  //      }, error => console.error(error));
  //    await this.commonMasterService.ExamCategory()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.ExamCategoryList = data['Data'];
  //      }, error => console.error(error));
  //    await this.commonMasterService.GetStreamType()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.StreamTypeList = data['Data'];
  //      }, error => console.error(error));
  //    await this.commonMasterService.GetMonths()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.MonthList = data['Data'];
  //      }, error => console.error(error));
  //    await this.commonMasterService.GetExamType()
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        this.ExamTypeList = data['Data'];
  //      }, error => console.error(error));
  //  }
  //  catch (ex) {
  //    console.log(ex);
  //  }
  //  finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  onExamTypeChange() {
    if (this.request.ExamTypeID == 50) {
      this.filteredSemesterList = this.SemesterMasterList.filter((item: any) => item.Type == 'Y')
    }
    else {
      this.filteredSemesterList = this.SemesterMasterList.filter((item: any) => item.Type == 'S')
    }
  }


  // Load data for dropdown based on MasterCode
  loadDropdownData(MasterCode: string): void {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'FinancialYear':
          this.FinancialYear = data['Data'];
          break;
        case 'Semester':
          this.SemesterMasterList = data['Data'];
          //this.filteredSemesterList = [...this.SemesterMasterList];
          break;
        case 'Month':
          this.MonthList = data['Data'];
          break;
        case 'ExamType':
          this.ExamTypeList = data['Data'];
          break;
        case 'ProgramType':
          this.ProgramTypeList = data['Data'];
          break;
        case 'AdmissionCategory':
          this.ExamCategoryList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async SaveDataExam() {
    this.isSubmitted = true;
    if (this.ExamFormGroup.invalid) {
      return console.log("error", this.ExamFormGroup);
    }

    this.loaderService.requestStarted();
    this.isLoading = true;

    try {
      if (this.ExamMasterID) {
        this.request.ExamMasterID = this.ExamMasterID;
      }

      // Call the service to save the data
      await this.examMasterService.SaveData(this.request)
        .then((data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];


          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.routers.navigate(['/exammaster']);
            this.ResetControls(); // Reset form after success
          } else {
            this.toastr.error(this.ErrorMessage); // Show error message if save fails

          }
        });
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;
      }, 200);
    }
  }

  async closeModal() {

  }

  ResetControls() {
    this.isSubmitted = false;
    this.request = new ExamMasterDataModel();
    this.request.ExamMasterID = 0
    this.ExamFormGroup.patchValue({
      code: '',
    });
    //this.multiSelect.toggleSelectAll();
  }

  async AddExam() {
    await this.routers.navigate(['/exammaster']);
  }

  async Get_ExamMasterData_ByID(ExamMasterID: number) {
    try {

      this.loaderService.requestStarted();

      await this.examMasterService.Get_ExamMasterData_ByID(ExamMasterID)
        .then(async (data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "data");
          this.request.ExamMasterID = data['Data']["ExamMasterID"];
          this.request.SessionYearID = data['Data']["SessionYearID"];
          this.request.SessionMonthID = data['Data']["SessionMonthID"];
          this.request.ProgramTypeID = data['Data']['ProgramTypeID']
          this.request.ExamTypeID = data['Data']['ExamTypeID']
          this.request.SemesterID = data['Data']['ShortCode']
          this.request.AdmissionCategoryID = data['Data']['AdmissionCategoryID']

          const btnSave = document.getElementById('btnSave');
          if (btnSave) btnSave.innerHTML = "Update";

          const AddExam = document.getElementById('AddExamSm');
          if (AddExam) AddExam.innerHTML = "Update Exam";

          const AddExamSm = document.getElementById('AddExam');
          if (AddExamSm) AddExamSm.innerHTML = "Update Exam";

          const AddExamIn = document.getElementById('AddExamIn');
          if (AddExamIn) AddExamIn.innerHTML = "Update Exam";

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

}
