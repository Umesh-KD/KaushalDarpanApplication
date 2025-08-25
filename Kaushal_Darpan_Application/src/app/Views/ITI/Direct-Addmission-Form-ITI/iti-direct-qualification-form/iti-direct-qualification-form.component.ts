import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { HighestQualificationDetailsDataModel, OptionsDetailsDataModel, Qualification10thDetailsDataModel, Qualification12thDetailsDataModel, Qualification8thDetailsDataModel, QualificationDetailsDataModel } from '../../../../Models/ITIFormDataModel';
import { DropdownValidators } from '../../../../Services/CustomValidators/custom-validators.service';
import { ItiApplicationFormService } from '../../../../Services/ItiApplicationForm/iti-application-form.service';
import { EnumDepartment, EnumStatus } from '../../../../Common/GlobalConstants';
import { ItiApplicationSearchmodel } from '../../../../Models/ItiApplicationPreviewDataModel';
import { JanAadharMemberDetails } from '../../../../Models/StudentJanAadharDetailModel';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EncryptionService } from '../../../../Services/EncryptionService/encryption-service.service';
import { QualificationDDLDataModel } from '../../../../Models/CommonMasterDataModel';
import { SweetAlert2 } from '../../../../Common/SweetAlert2';

@Component({
  selector: 'app-iti-direct-qualification-form',
  standalone: false,
  templateUrl: './iti-direct-qualification-form.component.html',
  styleUrl: './iti-direct-qualification-form.component.css'
})
export class ITIDirectQualificationFormComponent {
  public testid: string = ''
  public SSOLoginDataModel = new SSOLoginDataModel()
  public StateMasterList: any = []
  public HighQualificationForm!: FormGroup;
  public QualificationForm8th!: FormGroup;
  public QualificationForm10th!: FormGroup;
  public QualificationForm12th!: FormGroup;
  public formData = new HighestQualificationDetailsDataModel()
  public isSubmitted: boolean = false
  public box8Checked: boolean = false;
  public box10Checked: boolean = false;
  public box12Checked: boolean = false;
  public formData8th = new Qualification8thDetailsDataModel()
  public formData10th = new Qualification10thDetailsDataModel()
  public formData12th = new Qualification12thDetailsDataModel()
  // public request = new QualificationDetailsDataModel()
  public request: QualificationDetailsDataModel[] = []
  public disable10thCheckbox: boolean = false
  public disable8thCheckbox: boolean = false
  public BoardList: any = []
  public PassingYearList: any = []
  public QualificationDataList: any = []
  public MarksTypeList: any = []
  @Output() tabChange: EventEmitter<number> = new EventEmitter<number>();
  public searchRequest = new ItiApplicationSearchmodel()
  public janaadharMemberDetails = new JanAadharMemberDetails()
  public ApplicationID: number = 0
  showModal: boolean = false;
  @ViewChild('modal_Acknowledgement') modal_Acknowledgement: any;
  closeResult: string | undefined;
  public AddedChoices: OptionsDetailsDataModel[] = []
  public AddedChoices8: OptionsDetailsDataModel[] = []
  public AddedChoices12: OptionsDetailsDataModel[] = []
  public AddedChoices10: any[] = []
  public mathPercentage: string = ''
  public sciencePercentage: string = ''
  public unauthorizeTrade: string = ''
  qualificationSearchReq = new QualificationDDLDataModel()
  public QualificationList: any = []

  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private ItiApplicationFormService: ItiApplicationFormService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private encryptionService: EncryptionService,
    private Swal2: SweetAlert2,
  ) { }

  async ngOnInit() {
    console.log(this.formData, "FormData")
    console.log(this.AddedChoices, "addeddata")

    this.HighQualificationForm = this.formBuilder.group(
      {
        ddlState: ['', [DropdownValidators]],
        txtBoardUniversity: ['', Validators.required],
        txtSchoolCollege: ['', Validators.required],
        txtHighestQualification: ['', Validators.required],
        txtYearOfPassing: ['', Validators.required],
        txtRollNumber: ['', Validators.required],
        ddlMarksType: ['', [DropdownValidators]],
        txtMaxMarks: ['', Validators.required],
        txtMarksObatined: ['', Validators.required],
        txtPercentage: [{ value: '', disabled: true }],
      });

    this.QualificationForm8th = this.formBuilder.group({
      ddlState8: ['', [DropdownValidators]],
      txtSchoolCollege8: ['', Validators.required],
      txtYearOfPassing8: ['', Validators.required],
      txtRollNumber8: ['', Validators.required],
      ddlMarksType8: ['', [DropdownValidators]],
      txtMaxMarks8: ['', Validators.required],
      txtMarksObatined8: ['', Validators.required],
      txtPercentage8: [{ value: '', disabled: true }],
    })

    this.QualificationForm10th = this.formBuilder.group({
      ddlState10: ['', [DropdownValidators]],
      txtBoardUniversity10: ['', Validators.required],
      txtYearOfPassing10: ['', Validators.required],
      txtRollNumber10: ['', Validators.required],
      ddlMarksType10: ['', [DropdownValidators]],
      txtMaxMarks10: ['', Validators.required],
      txtMarksObatined10: ['', Validators.required],
      txtMathsMaxMarks10: ['', Validators.required],
      txtMathsMarksObtained10: ['', Validators.required],
      txtScienceMaxMarks10: ['', Validators.required],
      txtScienceMarksObtained10: ['', Validators.required],
      txtPercentage10: [{ value: '', disabled: true }],
    })

    this.QualificationForm12th = this.formBuilder.group({
      ddlState12: ['', [DropdownValidators]],
      txtSchoolCollege12: ['', Validators.required],
      txtYearOfPassing12: ['', Validators.required],
      txtRollNumber12: ['', Validators.required],
      ddlMarksType12: ['', [DropdownValidators]],
      txtMaxMarks12: ['', Validators.required],
      txtMarksObatined12: ['', Validators.required],
      txtPercentage12: [{ value: '', disabled: true }],
    })

    this.SSOLoginDataModel = JSON.parse(String(localStorage.getItem('SSOLoginUser')));

    this.searchRequest.SSOID = this.SSOLoginDataModel.SSOID
    this.searchRequest.DepartmentID = EnumDepartment.ITI;
    // this.searchRequest.JanAadharMemberID = this.janaadharMemberDetails.janmemid
    // this.searchRequest.JanAadharNo = this.janaadharMemberDetails.janaadhaarId

    this.GetStateMaterData()
    this.calculatePercentageHigh()
    this.calculatePercentage8th()
    this.calculatePercentage10th()
    await this.loadDropdownData('Board')
    await this.GetPassingYearDDL()
    this.GetQualificationDDL();

    this.ApplicationID = Number(this.encryptionService.decryptData(this.activatedRoute.snapshot.queryParamMap.get('AppID') ?? "0"))
    if (this.ApplicationID > 0) {
      this.searchRequest.ApplicationID = this.ApplicationID;
      this.GetById();
      this.GetByIdQualification();
    }
    await this.GetMasterDDL()
  }

  get _HighQualificationForm() { return this.HighQualificationForm.controls; }
  get _QualificationForm8th() { return this.QualificationForm8th.controls; }
  get _QualificationForm10th() { return this.QualificationForm10th.controls; }
  get _QualificationForm12th() { return this.QualificationForm12th.controls; }

  async GetStateMaterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetStateMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.StateMasterList = data['Data'];
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

  async loadDropdownData(MasterCode: string) {
    this.commonMasterService.GetCommonMasterData(MasterCode).then((data: any) => {
      switch (MasterCode) {
        case 'Board':
          this.BoardList = data['Data'];
          break;
        default:
          break;
      }
    });
  }

  async GetMasterDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('MarksType')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.MarksTypeList = data['Data'];
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

  async GetPassingYearDDL() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.AdmissionPassingYear()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.PassingYearList = data['Data'];

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

  onClick8thCheckbox() {
    this.box8Checked = !this.box8Checked;
    if (!this.box8Checked) {
      this.QualificationForm8th.reset();
      this.formData8th = new Qualification8thDetailsDataModel()
    } else {
      // alert("यदि आप आठवीं(8th option) का चयन करेंगे तो केवल आठवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है इसी प्रकार यदि दसवीं(10th option) का चयन करेंगे तो केवल दसवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है तथा यदि आप बाहरवी(12th option) का चयन करेंगे तो केवल बाहरवी प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है| यदि आप एक से ज्यादा योग्यता के व्यवसाय का चयन करते है तो आपको प्रत्येक व्यवसाय योग्यता के लिए विकल्प पत्र भरना आवश्यक होगा|")
      this.openModalAcknowledgement(this.modal_Acknowledgement);
    }
  }

  onClick10thCheckbox() {
    this.box10Checked = !this.box10Checked;
    if (!this.box10Checked) {
      this.QualificationForm10th.reset();
      this.formData10th = new Qualification10thDetailsDataModel()
    } else {
      // alert("यदि आप आठवीं(8th option) का चयन करेंगे तो केवल आठवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है इसी प्रकार यदि दसवीं(10th option) का चयन करेंगे तो केवल दसवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है तथा यदि आप बाहरवी(12th option) का चयन करेंगे तो केवल बाहरवी प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है| यदि आप एक से ज्यादा योग्यता के व्यवसाय का चयन करते है तो आपको प्रत्येक व्यवसाय योग्यता के लिए विकल्प पत्र भरना आवश्यक होगा|")
      this.openModalAcknowledgement(this.modal_Acknowledgement);
    }
  }

  onClick12thCheckbox() {
    this.box12Checked = !this.box12Checked;
    if (!this.box12Checked) {
      this.QualificationForm12th.reset();
      this.formData12th = new Qualification12thDetailsDataModel()
    } else {
      // alert("यदि आप आठवीं(12th option) का चयन करेंगे तो केवल आठवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है इसी प्रकार यदि दसवीं(12th option) का चयन करेंगे तो केवल दसवीं प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है तथा यदि आप बाहरवी(12th option) का चयन करेंगे तो केवल बाहरवी प्रवेश योग्यता के व्यवसायों का आवेदन कर सकते है| यदि आप एक से ज्यादा योग्यता के व्यवसाय का चयन करते है तो आपको प्रत्येक व्यवसाय योग्यता के लिए विकल्प पत्र भरना आवश्यक होगा|")
      this.openModalAcknowledgement(this.modal_Acknowledgement);
      this.box8Checked = true;
      this.box10Checked = true;
    }
  }

  async openModalAcknowledgement(content: any) {
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  CloseModal() {
    this.modalService.dismissAll();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  calculatePercentageHigh(): void {
    if (this.formData.MarksTypeIDHigh == 84) {
      this.formData.MaxMarksHigh = 10
      this.HighQualificationForm.get('txtMaxMarks')?.disable();
    } else if (this.formData.MarksTypeIDHigh == 83) {
      this.HighQualificationForm.get('txtMaxMarks')?.enable();
    }
    let maxMarks = this.formData.MaxMarksHigh;
    let marksObtained = this.formData.MarksObtainedHigh;

    if (this.formData.MarksTypeIDHigh == 84) {

      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        } else {
          this.formData.PercentageHigh = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        }
      }
    } else if (this.formData.MarksTypeIDHigh == 83 && marksObtained <= maxMarks) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        } else {
          this.formData.PercentageHigh = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData.PercentageHigh = '';
          this.formData.MarksObtainedHigh = 0;
        }
      }
    }
  }

  calculatePercentage12th(): void {

    if (this.formData12th.MarksTypeID12 == 84) {
      this.formData12th.MaxMarks12 = 10
      this.QualificationForm12th.get('txtMaxMarks12')?.disable();
    } else if (this.formData12th.MarksTypeID12 == 83) {
      this.QualificationForm12th.get('txtMaxMarks12')?.enable();
    }
    let maxMarks = this.formData12th.MaxMarks12;
    let marksObtained = this.formData12th.MarksObtained12;

    if (this.formData12th.MarksTypeID12 == 84) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData12th.Percentage12 = '';
          this.formData12th.MarksObtained12 = 0;
        } else {
          this.formData12th.Percentage12 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks > 0 && marksObtained > 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData12th.Percentage12 = '';
          this.formData12th.MarksObtained12 = 0;
        }

      }
    } else if (this.formData12th.MarksTypeID12 == 83) {
      if (maxMarks < 0 && marksObtained < 0) {
        this.toastr.warning('Maximum Marks and Marks Obtained cannot be Negative');
        this.formData12th.Percentage12 = '';
        this.formData12th.MarksObtained12 = 0;
      } else {
        if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
          const percentage = (marksObtained / maxMarks) * 100;
          if (percentage <= 33) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
            this.formData12th.Percentage12 = '';
            this.formData12th.MarksObtained12 = 0;
          } else {
            this.formData12th.Percentage12 = percentage.toFixed(2);
          }
        } else {
          if (maxMarks != 0 && marksObtained != 0) {
            this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
            this.formData12th.Percentage12 = '';
            this.formData12th.MarksObtained12 = 0;
          }
        }
      }

    }
  }

  calculatePercentage8th(): void {
    if (this.formData8th.MarksTypeID8 == 84) {
      this.formData8th.MaxMarks8 = 10
      this.QualificationForm8th.get('txtMaxMarks8')?.disable();
    } else if (this.formData8th.MarksTypeID8 == 83) {
      this.QualificationForm8th.get('txtMaxMarks8')?.enable();
    }
    let maxMarks = this.formData8th.MaxMarks8;
    let marksObtained = this.formData8th.MarksObtained8;

    if (this.formData8th.MarksTypeID8 == 84) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData8th.Percentage8 = '';
          this.formData8th.MarksObtained8 = 0;
        } else {
          this.formData8th.Percentage8 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks > 0 && marksObtained > 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData8th.Percentage8 = '';
          this.formData8th.MarksObtained8 = 0;
        }

      }
    } else if (this.formData8th.MarksTypeID8 == 83) {
      if (maxMarks < 0 && marksObtained < 0) {
        this.toastr.warning('Maximum Marks and Marks Obtained cannot be Negative');
        this.formData8th.Percentage8 = '';
        this.formData8th.MarksObtained8 = 0;
      } else {
        if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
          const percentage = (marksObtained / maxMarks) * 100;
          if (percentage <= 33) {
            this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
            this.formData8th.Percentage8 = '';
            this.formData8th.MarksObtained8 = 0;
          } else {
            this.formData8th.Percentage8 = percentage.toFixed(2);
          }
        } else {
          if (maxMarks != 0 && marksObtained != 0) {
            this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
            this.formData8th.Percentage8 = '';
            this.formData8th.MarksObtained8 = 0;
          }
        }
      }

    }
  }

  async calculatePercentages10thsubject() {

    const marktype = this.formData10th.MarksTypeID10 ? this.formData10th.MarksTypeID10.toString() : "0";
    const mathMax = this.formData10th.MathsMaxMarks10 || 0;
    const mathObtained = this.formData10th.MathsMarksObtained10 || 0;
    let scienceMax = this.formData10th.ScienceMaxMarks10 || 0;
    let scienceObtained = this.formData10th.ScienceMarksObtained10 || 0;

    if (marktype === "83") { // Calculation using Marks
      this.mathPercentage = (mathMax === 0)
        ? '0.00'
        : ((mathObtained / mathMax) * 100).toFixed(2);

      this.sciencePercentage = (scienceMax === 0)
        ? '0.00'
        : ((scienceObtained / scienceMax) * 100).toFixed(2);

    } else if (marktype === "84") { // Calculation using CGPA
      scienceMax = 10; // CGPA Max value
      scienceObtained = this.formData10th.ScienceMarksObtained10 || 0; // CGPA Value

      this.mathPercentage = (mathObtained === 0)
        ? '0.00'
        : (mathObtained * 9.5).toFixed(2);

      this.sciencePercentage = (scienceObtained === 0)
        ? '0.00'
        : (scienceObtained * 9.5).toFixed(2);
    } else {
      this.mathPercentage = '0.00';
      this.sciencePercentage = '0.00';
    }

    console.log(this.mathPercentage)
    console.log(this.sciencePercentage)

  }





  restrictInvalidCharacters(event: any) {
    const value = event.target.value;
    const invalidChars = /[+\-*/]/g;
    if (invalidChars.test(value)) {
      event.target.value = value.replace(invalidChars, '');
    }
  }

  calculatePercentage10th(): void {
    if (this.formData10th.MarksTypeID10 == 84) {
      this.formData10th.MaxMarks10 = 10
      this.formData10th.MathsMaxMarks10 = 10
      this.formData10th.ScienceMaxMarks10 = 10
      this.QualificationForm10th.get('txtMaxMarks10')?.disable();
      this.QualificationForm10th.get('txtMathsMaxMarks10')?.disable();
      this.QualificationForm10th.get('txtScienceMaxMarks10')?.disable();
    } else if (this.formData10th.MarksTypeID10 == 83) {
      this.QualificationForm10th.get('txtMaxMarks10')?.enable();
      this.QualificationForm10th.get('txtMathsMaxMarks10')?.enable();
      this.QualificationForm10th.get('txtScienceMaxMarks10')?.enable();
    }
    let maxMarks = this.formData10th.MaxMarks10;
    let marksObtained = this.formData10th.MarksObtained10;

    if (this.formData10th.MarksTypeID10 == 84) {

      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = marksObtained * 9.5;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
        } else {
          this.formData10th.Percentage10 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
          this.formData10th.MathsMarksObtained10 = 0;
          this.formData10th.ScienceMarksObtained10 = 0;
        }
      }
    } else if (this.formData10th.MarksTypeID10 == 83) {
      if (maxMarks > 0 && marksObtained > 0 && marksObtained <= maxMarks) {
        const percentage = (marksObtained / maxMarks) * 100;
        if (percentage <= 33) {
          this.toastr.warning('Aggregate Marks Obtained cannot be less than 33%');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
        } else {
          this.formData10th.Percentage10 = percentage.toFixed(2);
        }
      } else {
        if (maxMarks != 0 && marksObtained != 0) {
          this.toastr.warning('Aggregate Marks Obtained cannot be greater than Aggregate Maximum Marks');
          this.formData10th.Percentage10 = '';
          this.formData10th.MarksObtained10 = 0;
          this.formData10th.MathsMarksObtained10 = 0;
          this.formData10th.ScienceMarksObtained10 = 0;
        }
      }
    }
  }

  ScienceAndMathsMarksValidation() {
    if (this.formData10th.ScienceMarksObtained10 != 0 && this.formData10th.ScienceMaxMarks10 != 0 &&
      this.formData10th.ScienceMarksObtained10 > this.formData10th.ScienceMaxMarks10) {
      this.toastr.warning('Science Marks Obtained cannot be greater than Science Maximum Marks', 'Error');
      this.formData10th.ScienceMarksObtained10 = 0;
      return;
    }

    if (this.formData10th.MathsMarksObtained10 != 0 && this.formData10th.MathsMaxMarks10 != 0 &&
      this.formData10th.MathsMarksObtained10 > this.formData10th.MathsMaxMarks10) {
      this.toastr.warning('Maths Marks Obtained cannot be greater than Maths Maximum Marks', 'Error');
      this.formData10th.MathsMarksObtained10 = 0;
      return;
    }

    if (this.formData10th.MarksTypeID10 == 83) {
      if (
        this.formData10th.ScienceMarksObtained10 != 0 &&
        this.formData10th.MathsMarksObtained10 != 0 &&
        this.formData10th.ScienceMaxMarks10 != 0 &&
        this.formData10th.MathsMaxMarks10 != 0
      ) {
        if ((this.formData10th.ScienceMaxMarks10 + this.formData10th.MathsMaxMarks10) > this.formData10th.MaxMarks10) {
          this.toastr.warning(' Sum of Science and Maths Maximum Marks cannot be greater than Aggregate Maximum Marks', 'Error');
          this.formData10th.ScienceMaxMarks10 = 0;
          this.formData10th.MathsMaxMarks10 = 0;
          return;
        }

        if ((this.formData10th.ScienceMarksObtained10 + this.formData10th.MathsMarksObtained10) > this.formData10th.MarksObtained10) {
          this.toastr.warning('Sum of Science and Maths Marks Obtained cannot be greater than Aggregate Marks Obtained', 'Error');
          this.formData10th.ScienceMarksObtained10 = 0;
          this.formData10th.MathsMarksObtained10 = 0;
          return;
        }
      }
    }
  }

  RollNumberValidation(input: any) {
    return input.replace(/[^a-zA-Z0-9/]/g, '');
  }

  async SaveQualification() {
    this.isSubmitted = true;

    if (this.box8Checked && this.QualificationForm8th.invalid) {
      this.toastr.error('QualificationForm8th Form is invalid!');
      return;
    }

    if (this.box10Checked && this.QualificationForm10th.invalid) {
      this.toastr.error('QualificationForm10th Form is invalid! ');
      return;
    }

    if (this.box12Checked && this.QualificationForm12th.invalid) {
      this.toastr.error('QualificationForm12th Form is invalid! ');
      return;
    }

    if (this.box10Checked && this.box8Checked && Number(this.formData8th.YearofPassing8) > Number(this.formData10th.YearofPassing10)) {
      this.toastr.warning('Passing Year of 8th must be less than Passing Year of 10th', 'Invalid');
      return;
    }




    if (this.formData.YearofPassingHigh != '' && this.formData.YearofPassingHigh != '0') {
      if (Number(this.formData8th.YearofPassing8) >= Number(this.formData.YearofPassingHigh) ||
        Number(this.formData10th.YearofPassing10) >= Number(this.formData.YearofPassingHigh) ||
        Number(this.formData12th.YearofPassing12) >= Number(this.formData.YearofPassingHigh)) {
        this.toastr.warning('Passing Year of Highest Qualification must be greater than Passing Year of 8th and 10th and 12th', 'Invalid');
        return;
      }
    }

    if (this.box12Checked && this.formData12th.Percentage12 == '' || this.formData12th.Percentage12 == '0') {
      this.toastr.warning('Percentage of 12th is required', 'Invalid');
      return;
    }

    if (this.box10Checked && this.formData10th.Percentage10 == '' || this.formData10th.Percentage10 == '0') {
      this.toastr.warning('Percentage of 10th is required', 'Invalid');
      return;
    }

    if (this.box8Checked && this.formData8th.Percentage8 == '' || this.formData8th.Percentage8 == '0') {
      this.toastr.warning('Percentage of 8th is required', 'Invalid');
      return;
    }

    this.request = [];

    if (this.box10Checked) {
      await this.calculatePercentages10thsubject()
      const tradeLevel10Choices = this.AddedChoices.filter((choice: any) => choice.TradeLevel == 10);

      if (tradeLevel10Choices.filter((choice: any) => { return this.sciencePercentage < choice.MinPercentageInScience }).length > 0) {
        var dataScience = tradeLevel10Choices.filter((choice: any) => { return this.sciencePercentage < choice.MinPercentageInScience })[0];
        var msg = 'In the selected trade ' + dataScience.TradeName + ', the minimum required percentage in Science is ' + dataScience.MinPercentageInScience + '%, but your percentage is ' + this.sciencePercentage + '%. Please remove this trade or choose another one.'

        var msgHi = 'चयनित ट्रेड ' + dataScience.TradeName + ' में, विज्ञान में न्यूनतम आवश्यक प्रतिशत ' + dataScience.MinPercentageInScience + '% है, लेकिन आपका प्रतिशत ' + this.sciencePercentage + '% है। कृपया इस ट्रेड को हटा दें या कोई दूसरा ट्रेड चुनें।';


        //this.toastr.warning(msg);

        this.Swal2.Info(msg + '<br/>' + msgHi);

        return;
      }

      const count1 = this.AddedChoices.filter((x: any) => x.TradeLevel == 10).length;
      const count2 = this.AddedChoices.filter((x: any) => x.TradeTypeId === 2 && x.TradeLevel == 10).length;
      if (count2 > 0 && count2 == count1) {
        /*this is condition for if applicant choose only non eng trades. in this case skip validation for Science & Maths Marks (non) */
      } else {
        if (this.box10Checked) {
          if (this.formData10th.ScienceMarksObtained10 <= 0) {
            this.toastr.warning("Science Obtain Marks Should be greater than zero")
            return
          } else if (this.formData10th.ScienceMaxMarks10 <= 0) {
            this.toastr.warning("Science Max Marks Should be greater than zero")
            return
          } else if (this.formData10th.MathsMarksObtained10 <= 0) {
            this.toastr.warning("Maths Obtain Marks Should be greater than zero")
            return
          } else if (this.formData10th.MathsMaxMarks10 <= 0) {
            this.toastr.warning("Maths Max Marks Should be greater than zero")
            return
          }
        }
      }


      if (tradeLevel10Choices.filter((choice: any) => { return this.mathPercentage < choice.MinPercentageInMath }).length > 0) {
        var dataMaths = tradeLevel10Choices.filter((choice: any) => { return this.mathPercentage < choice.MinPercentageInMath })[0];
        var msgM = 'In the selected trade ' + dataMaths.TradeName + ', the minimum required percentage in Maths is ' + dataMaths.MinPercentageInScience + '%, but your percentage is ' + this.mathPercentage + '%. Please remove this trade or choose another one.'
        var msgMHi = 'चयनित ट्रेड ' + dataMaths.TradeName + ' में, गणित में न्यूनतम आवश्यक प्रतिशत ' + dataMaths.MinPercentageInScience + '% है, लेकिन आपका प्रतिशत ' + this.mathPercentage + '% है। कृपया इस ट्रेड को हटा दें या कोई दूसरा ट्रेड चुनें।';


        //this.toastr.warning(msg);

        this.Swal2.Info(msgM + '<br/>' + msgMHi);
        return;
      }


      // const filteredChoices = tradeLevel10Choices.filter((choice: any) => {
      //   return this.mathPercentage < choice.MinPercentageInScience || this.sciencePercentage < choice.MinPercentageInMath;
      // });

      // if (filteredChoices.length > 0) {
      //   const names = filteredChoices.map(user => user.TradeName).join(', ');       
      //   this.toastr.warning(`This trades that you selcted in option form has minimum percentage more than you science and math perecntage : ${names}`)
      //   return
      //}
    }




    if (this.box8Checked) {
      this.request.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.QualificationForm8th.value.ddlState8,
        BoardUniversity: '',
        SchoolCollege: this.QualificationForm8th.value.txtSchoolCollege8,
        Qualification: '8',
        YearofPassing: this.QualificationForm8th.value.txtYearOfPassing8,
        RollNumber: this.QualificationForm8th.value.txtRollNumber8,
        MarksTypeID: this.QualificationForm8th.value.ddlMarksType8,
        MaxMarks: this.formData8th.MaxMarks8,
        MarksObtained: this.QualificationForm8th.value.txtMarksObatined8,
        Percentage: Number(this.formData8th.Percentage8),
        MathsMaxMarks: 0,
        MathsMarksObtained: 0,
        ScienceMaxMarks: 0,
        ScienceMarksObtained: 0,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: ''
      });
    }

    if (this.box10Checked) {
      this.request.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.QualificationForm10th.value.ddlState10,
        BoardUniversity: this.QualificationForm10th.value.txtBoardUniversity10,
        SchoolCollege: '',
        Qualification: '10',
        YearofPassing: this.QualificationForm10th.value.txtYearOfPassing10,
        RollNumber: this.QualificationForm10th.value.txtRollNumber10,
        MarksTypeID: this.QualificationForm10th.value.ddlMarksType10,
        MaxMarks: this.formData10th.MaxMarks10,
        MarksObtained: this.QualificationForm10th.value.txtMarksObatined10,
        Percentage: Number(this.formData10th.Percentage10),
        MathsMaxMarks: this.formData10th.MathsMaxMarks10,
        MathsMarksObtained: this.QualificationForm10th.value.txtMathsMarksObtained10,
        ScienceMaxMarks: this.formData10th.ScienceMaxMarks10,
        ScienceMarksObtained: this.QualificationForm10th.value.txtScienceMarksObtained10,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: ''
      });
    }

    if (this.box12Checked) {
      this.request.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.QualificationForm12th.value.ddlState12,
        BoardUniversity: '',
        SchoolCollege: this.QualificationForm12th.value.txtSchoolCollege12,
        Qualification: '12',
        YearofPassing: this.QualificationForm12th.value.txtYearOfPassing12,
        RollNumber: this.QualificationForm12th.value.txtRollNumber12,
        MarksTypeID: this.QualificationForm12th.value.ddlMarksType12,
        MaxMarks: this.formData12th.MaxMarks12,
        MarksObtained: this.QualificationForm12th.value.txtMarksObatined12,
        Percentage: Number(this.formData12th.Percentage12),
        MathsMaxMarks: 0,
        MathsMarksObtained: 0,
        ScienceMaxMarks: 0,
        ScienceMarksObtained: 0,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: ''
      });
    }


    if (this.HighQualificationForm.value.txtHighestQualification == '12') {
      this.toastr.error("You cannot add 12 as Your Higher Qualification")
      return
    }
    if (this.HighQualificationForm.value.txtHighestQualification == '8') {
      this.toastr.error("You cannot add 8 as Your Higher Qualification")
      return
    }
    if (this.HighQualificationForm.value.txtHighestQualification == '10') {
      this.toastr.error("You cannot add 10 as Your Higher Qualification")
      return
    }
    if (this.HighQualificationForm.invalid) {
      console.log("this.QualificationForm10th.invalid");
    } else {
      this.request.push({
        ApplicationID: this.ApplicationID,
        SSOID: this.SSOLoginDataModel.SSOID,
        StateID: this.HighQualificationForm.value.ddlState,
        BoardUniversity: '0',
        SchoolCollege: this.HighQualificationForm.value.txtSchoolCollege,
        Qualification: this.HighQualificationForm.value.txtHighestQualification,
        YearofPassing: this.HighQualificationForm.value.txtYearOfPassing,
        RollNumber: this.HighQualificationForm.value.txtRollNumber,
        MarksTypeID: this.HighQualificationForm.value.ddlMarksType,
        MaxMarks: this.formData.MaxMarksHigh,
        MarksObtained: this.HighQualificationForm.value.txtMarksObatined,
        Percentage: Number(this.formData.PercentageHigh),
        MathsMaxMarks: 0,
        MathsMarksObtained: 0,
        ScienceMaxMarks: 0,
        ScienceMarksObtained: 0,
        ModifyBy: this.SSOLoginDataModel.UserID,
        DepartmentID: 2,
        CreatedBy: this.SSOLoginDataModel.UserID,
        ActiveStatus: 1,
        DeleteStatus: 0,
        UniversityBoard: this.HighQualificationForm.value.txtBoardUniversity,
      });
    }

    if (!this.box8Checked && !this.box10Checked && !this.box12Checked) {
      this.toastr.error("Please Fill Option Form first ")
      return
    }
    try {

      this.loaderService.requestStarted();
      console.log("form data", this.request)

      await this.ItiApplicationFormService.SaveQualificationDetailsData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.toastr.success(data.Message)
            this.tabChange.emit(3);
          } else {
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

  ResetQualification() {
    this.isSubmitted = false
    this.formData = new HighestQualificationDetailsDataModel()
    this.formData8th = new Qualification8thDetailsDataModel()
    this.formData10th = new Qualification10thDetailsDataModel()
    this.formData12th = new Qualification12thDetailsDataModel()
  }

  async GetById() {
    this.isSubmitted = false;

    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetQualificationDatabyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QualificationDataList = data.Data
          console.log(this.QualificationDataList)

          this.QualificationDataList.map((list: any) => {

            if (list.Qualification == "8") {
              this.box8Checked = true
              this.formData8th.StateID8 = list.StateID
              this.formData8th.SchoolCollege8 = list.SchoolCollege
              this.formData8th.YearofPassing8 = list.YearofPassing
              this.formData8th.RollNumber8 = list.RollNumber
              this.formData8th.MarksTypeID8 = list.MarksTypeID
              this.formData8th.MaxMarks8 = list.MaxMarks
              this.formData8th.MarksObtained8 = list.MarksObtained
              this.calculatePercentage8th()

            }
            else if (list.Qualification == "10") {
              this.box10Checked = true
              this.formData10th.StateID10 = list.StateID
              this.formData10th.BoardUniversity10 = list.BoardUniversity
              this.formData10th.YearofPassing10 = list.YearofPassing
              this.formData10th.RollNumber10 = list.RollNumber
              this.formData10th.MarksTypeID10 = list.MarksTypeID
              this.formData10th.MaxMarks10 = list.MaxMarks
              this.formData10th.MarksObtained10 = list.MarksObtained
              this.formData10th.MathsMaxMarks10 = list.MathsMaxMarks
              this.formData10th.MathsMarksObtained10 = list.MathsMarksObtained
              this.formData10th.ScienceMaxMarks10 = list.ScienceMaxMarks
              this.formData10th.ScienceMarksObtained10 = list.ScienceMarksObtained
              this.calculatePercentage10th()

            }
            else if (list.Qualification == "12") {
              this.box12Checked = true
              this.formData12th.StateID12 = list.StateID
              this.formData12th.SchoolCollege12 = list.SchoolCollege
              this.formData12th.YearofPassing12 = list.YearofPassing
              this.formData12th.RollNumber12 = list.RollNumber
              this.formData12th.MarksTypeID12 = list.MarksTypeID
              this.formData12th.MaxMarks12 = list.MaxMarks
              this.formData12th.MarksObtained12 = list.MarksObtained
              this.calculatePercentage12th()

            }
            else {
              this.formData.StateIDHigh = list.StateID
              this.formData.BoardUniversityHigh = list.UniversityBoard
              this.formData.SchoolCollegeHigh = list.SchoolCollege
              this.formData.HighestQualificationHigh = list.Qualification
              this.formData.YearofPassingHigh = list.YearofPassing
              this.formData.RollNumberHigh = list.RollNumber
              this.formData.MarksTypeIDHigh = list.MarksTypeID
              this.formData.MaxMarksHigh = list.MaxMarks
              this.formData.MarksObtainedHigh = list.MarksObtained
              this.calculatePercentageHigh()
            }
          })
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  filterString(input: string): string {
    return input.replace(/[^a-zA-Z0-9. ]/g, '');
  }


  async GetByIdQualification() {
    this.isSubmitted = false;
    this.AddedChoices = []
    this.AddedChoices8 = []
    this.AddedChoices10 = []
    this.AddedChoices12 = []
    try {
      this.loaderService.requestStarted();
      await this.ItiApplicationFormService.GetOptionDetailsbyID(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log("AddedChoices on getby id", data.Data)
          this.AddedChoices = data['Data']
          console.log(this.AddedChoices, "addeddata")
          //this.formData.ApplicationID = data['Data'][0].ApplicationID;

          this.box8Checked = false;
          this.box10Checked = false;


          //if (this.model.CategoryA == EnumCasteCategory.MBC) {
          //  this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.setValidators(DropdownValidators1);
          //  this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();

          //} else {
          //  this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.clearValidators();
          //  this.StudentJanDetailFormGroup.get('ddlIsMBCCertificate')?.updateValueAndValidity();
          //}


          //txtMathsMaxMarks10: ['', Validators.required],
          //  txtMathsMarksObtained10: ['', Validators.required],
          //    txtScienceMaxMarks10: ['', Validators.required],
          //      txtScienceMarksObtained10: ['', Validators.required],

          const count1 = this.AddedChoices.filter((x: any) => x.TradeLevel == 10).length;
          const count2 = this.AddedChoices.filter((x: any) => x.TradeTypeId === 2 && x.TradeLevel == 10).length;
          /*this is condition for if applicant choose only non eng trades. in this case skip validation for Science & Maths Marks (non) */
          if (count2 > 0 && count2 == count1) {

            this.QualificationForm10th.get('txtMathsMaxMarks10')?.clearValidators();
            this.QualificationForm10th.get('txtMathsMarksObtained10')?.clearValidators();
            this.QualificationForm10th.get('txtScienceMaxMarks10')?.clearValidators();
            this.QualificationForm10th.get('txtScienceMarksObtained10')?.clearValidators();
            this.QualificationForm10th.get('ddlIsMBCCertificate')?.updateValueAndValidity();

          } else {
            this.QualificationForm10th.get('txtMathsMaxMarks10')?.setValidators(Validators.required);
            this.QualificationForm10th.get('txtMathsMarksObtained10')?.setValidators(Validators.required);
            this.QualificationForm10th.get('txtScienceMaxMarks10')?.setValidators(Validators.required);
            this.QualificationForm10th.get('txtScienceMarksObtained10')?.setValidators(Validators.required);
            this.QualificationForm10th.get('ddlIsMBCCertificate')?.updateValueAndValidity();
          }



          this.AddedChoices.map((choice: any) => {
            if (choice.TradeLevel == 8) {
              this.box8Checked = true;
            }
            else if (choice.TradeLevel == 10) {
              this.box10Checked = true;
              //this.box8Checked = true;

            }
            else if (choice.TradeLevel == 12) {
              this.box12Checked = true;
              //this.box8Checked = true;
              //this.box10Checked = true;

            }
          })

          const btnSave = document.getElementById('btnSave')
          if (btnSave) btnSave.innerHTML = "Update";
          const btnReset = document.getElementById('btnReset')
          if (btnReset) btnReset.innerHTML = "Cancel";
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetQualificationDDL() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.QualificationDDL(this.qualificationSearchReq).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.QualificationList = data.Data;
        console.log("GetQualificationDDL", this.GetQualificationDDL);
      })


    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async Back() {
    this.tabChange.emit(1)
  }

  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }


}
