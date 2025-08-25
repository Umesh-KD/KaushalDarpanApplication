import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { MenuMasterDataModel, MenuMasterSerchModel } from '../../../Models/MenuMasterModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { MenuMasterService } from '../../../Services/MenuMaster/menu-master.service';
import { ExamMasterDataModel } from '../../../Models/ExamMasterDataModel';
import { StreamMasterService } from '../../../Services/BranchesMaster/branches-master.service';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { ExamMasterService } from '../../../Services/ExamMaster/exam-master.service';
import { EnumStatus } from '../../../Common/GlobalConstants';

@Component({
    selector: 'app-exam-master',
    templateUrl: './exam-master.component.html',
    styleUrls: ['./exam-master.component.css'],
    standalone: false
})
export class ExamMasterComponent {
  sSOLoginDataModel: any;
  ParentMenuDDLList: any;
  isParentMenuVisible: boolean = false;
  MenuMasterList: any;
  State: any;
  Message: any;
  ErrorMessage: any;
  public Table_SearchText: string = "";
  EditMenuDataFormGroup!: FormGroup;
  AddMenuDataFormGroup: any;
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
  public BranchList: any = []
  public StreamTypeList: any = []
  public ExamCategoryList: any = []
  public ExamMasterList: any = []
  public searchByBranch: string = ''
  public ExamMasterID: number | null = null;
  public ExamFormGroup!: FormGroup;
  constructor(private fb: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private examMasterService: ExamMasterService,
    private branchservice: StreamMasterService,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private routers: Router,
    private modalService: NgbModal,
    private Swal2: SweetAlert2) {

  }

  async ngOnInit() {
    this.ExamFormGroup = this.fb.group(
      {
        MonthID: [{ value: '', disabled: false }],
        ddlFinancialYearID: ['', [DropdownValidators]],
        StreamTypeID: ['', [DropdownValidators]],
        ExamID: ['', [DropdownValidators]],
        ddlSemesterID: ['', [DropdownValidators]],
        ExamTypeID: ['', [DropdownValidators]],
        ddlBranchID: ['', [DropdownValidators]],

      })
    this.loadDropdownData('FinancialYear');
    this.loadDropdownData('Semester');
    this.loadDropdownData('Month');
    this.loadDropdownData('ExamType');
    this.loadDropdownData('ProgramType');
    this.loadDropdownData('AdmissionCategory');
    //this.GetMasterDataList();

  }

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

  async GetMasterDataList() {
    try {
      this.loaderService.requestStarted();
      await this.examMasterService.GetAllData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State === EnumStatus.Success) {
            this.ExamMasterList = data['Data'];
          } else {
            this.toastr.error(data.ErrorMessage || 'Error fetching data.');
          }
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async ClearSearchData() {
    this.request.SessionYearID = 0;
    this.request.SessionMonthID = 0;
    this.request.ProgramTypeID = 0;
    this.ExamMasterList = '';
  }

  async AddExam() {
    await this.routers.navigate(['/addexam']);
  }

  onEditExam(ExamMasterID: number): void {
    this.routers.navigate(['/addexam', ExamMasterID]);
  }

}
