import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EmailValidator, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CitizenSuggestionService } from '../../../Services/CitizenSuggestionService/citizen-suggestion.service';
import { CitizenSuggestionFilterModel, CitizenSuggestionModel } from '../../../Models/CitizenSuggestionDataModel';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { AppsettingService } from '../../../Common/appsetting.service';

@Component({
  selector: 'app-citizen-suggestion',
  templateUrl: './citizen-suggestion.component.html',
  styleUrls: ['./citizen-suggestion.component.css'],
  standalone: false
})
export class CitizenSuggestionComponent implements OnInit {

  public ID: number = 0;
  public filterRequest = new CitizenSuggestionFilterModel()
  public request = new CitizenSuggestionModel()
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public State: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  public generatedSRNo: string = '';
  public CitizenSuggestionFormGroup!: FormGroup;
  public sSOLoginDataModel = new SSOLoginDataModel();
  //public QueryForMasterList: any = [];
  QueryForMasterList: any[] = [];
  SubMasterList: any[] = [];
  PolytechMasterList: any[] = [];
  DivisionMasterList: any[] = [];
  DistrictMasterList: any[] = [];
  TehsilMasterList: any[] = [];
  public filteredDistricts: any[] = [];
  public filteredTehsils: any[] = [];
  public InstituteMasterList: any = []
  public IsInstitute: boolean = false;
  public QueryList: CitizenSuggestionFilterModel[] = []
  selectedOption: any = 0;
  selectedTicket: any = 0;
  searchByDivisionName: string = '';
  searchByDistrictName: string = '';
  searchByTehsilName: string = '';
  public showModal: boolean = false;
  modalReference: NgbModalRef | undefined;
  public selectedCollege: any = {};  // Store selected College details
  @ViewChild('MyModel_SRQuery', { static: true })
  MyModel_SRQuery!: TemplateRef<any>;

  constructor(private commonMasterService: CommonFunctionService, private CitizenSuggestionService: CitizenSuggestionService,
    private toastr: ToastrService, private loaderService: LoaderService, private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute, private routers: Router, private modalService: NgbModal, private cdr: ChangeDetectorRef
    , private appsettingConfig: AppsettingService
  ) { }


  async ngOnInit() {

    // form group
    this.CitizenSuggestionFormGroup = this.formBuilder.group({
      Name: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],  // ✅ fixed
      MobileNo: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^[6-9][0-9]{9}$')]], // ✅ fixed
      Comment: ['', Validators.required],
      ddlSubject: ['', [DropdownValidators]],
      ddlCommnID: ['', [DropdownValidators]],
      InstituteID: ['0'],
      ddlDivisionID: ['0'],
      ddldistrictID: ['0']
    });

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ID = Number(this.activatedRoute.snapshot.queryParamMap.get('PK_ID')?.toString());
    this.GetMasterDDL();
    this.GetDivisionMasterddl();
  }



  get _CitizenSuggestionFormGroup() { return this.CitizenSuggestionFormGroup.controls; }

  async GetMasterDDL() {

    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetCommonMasterDDLByType('QueryFor')
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.QueryForMasterList = data['Data'];
          console.log("QueryFor", this.QueryForMasterList);
        }, (error: any) => console.error(error)
        );
      this.commonMasterService.InstituteMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          this.InstituteMasterList = data['Data'];
        });

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

  async GetDivisionMasterddl() {
    //alert(this.request.DivisionID);
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetDivisionMaster()
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          this.DivisionMasterList = data['Data'];
          console.log("DivisionMasterList", this.DivisionMasterList)
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

  async OnDivisionChange() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.DistrictMaster_DivisionIDWise(this.request.DivisionID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.DistrictMasterList = data['Data'];
          console.log("DistrictMasterList", this.DistrictMasterList)
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

  onDivisionChange() {
    const selectedDivisionID = this.filterRequest.DivisionID;
    this.filteredDistricts = this.DistrictMasterList.filter((district: any) => district.DivisionID == selectedDivisionID);
  }

  onDistrictChange() {
    this.commonMasterService.InsituteMaster_DistrictIDWise_Dept(this.request.DistrictID, 0, this.request.DepartmentID).then((data: any) => {
      data = JSON.parse(JSON.stringify(data));
      this.InstituteMasterList = data.Data;
    })
  }

  async GetMasterSubDDL() {
    if (this.selectedOption == 87) {
      this.IsInstitute = true;
      this.request.DepartmentID = 1;
    } else if (this.selectedOption == 274) {
      this.IsInstitute = true;
      this.request.DepartmentID = 2;
      this.request.DistrictID = 0;
      this.request.InstituteID = 0;
      this.request.DivisionID = 0;
      this.CitizenSuggestionFormGroup.patchValue({
        ddlDivisionID: "0",
        InstituteID: "0",
        ddldistrictID: "0"
      });
    } else {
      this.request.DepartmentID = 1;
      this.IsInstitute = false;
      this.request.DistrictID = 0;
      this.request.InstituteID = 0;
      this.request.DivisionID = 0;
      this.CitizenSuggestionFormGroup.patchValue({
        ddlDivisionID: "0",
        InstituteID: "0",
        ddldistrictID: "0"
      });
    }
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetSubjectForCitizenSugg(this.selectedOption)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubMasterList = data['Data'];
          console.log("QueryFor", this.SubMasterList);
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

  async ResetControl() {
    this.isSubmitted = false;
    this.IsInstitute = false;
    this.selectedOption = 0;
    this.request = new CitizenSuggestionModel();
    this.CitizenSuggestionFormGroup.reset();
    this.CitizenSuggestionFormGroup.patchValue({});
  }

  filterNumber(input: string): string {
    return input.replace(/[^0-9]/g, '');
  }

  async SaveData() {
    try {
      this.isSubmitted = true;
      //this.request.InstituteID = this.sSOLoginDataModel.InstituteID;


      if (this.selectedOption == 87) {
        if (this.CitizenSuggestionFormGroup.value.ddlDivisionID == null || this.CitizenSuggestionFormGroup.value.ddlDivisionID == 0
          || this.CitizenSuggestionFormGroup.value.InstituteID == null || this.CitizenSuggestionFormGroup.value.InstituteID == 0
          || this.CitizenSuggestionFormGroup.value.ddldistrictID == null || this.CitizenSuggestionFormGroup.value.ddldistrictID == 0) {
          this.ErrorMessage = "If Apply Suggestions/Query For Polytechnic or ITI Then Division, District and Institute are required";
          this.toastr.error(this.ErrorMessage);
          return
        }
      } else if (this.selectedOption == 274) {
        if (this.CitizenSuggestionFormGroup.value.ddlDivisionID == null || this.CitizenSuggestionFormGroup.value.ddlDivisionID == 0
          || this.CitizenSuggestionFormGroup.value.InstituteID == null || this.CitizenSuggestionFormGroup.value.InstituteID == 0
          || this.CitizenSuggestionFormGroup.value.ddldistrictID == null || this.CitizenSuggestionFormGroup.value.ddldistrictID == 0) {
          this.ErrorMessage = "If Apply Suggestions/Query For Polytechnic or ITI Then Division, District and Institute are required";
          this.toastr.error(this.ErrorMessage);
          return
        }
      } else if (this.selectedOption == 293) {
        this.request.DepartmentID = 2;
      }
      if (this.CitizenSuggestionFormGroup.invalid) {
        return
      }
      const mobileRegex = /^[0-9]{10}$/;

      if (!mobileRegex.test(this.request.MobileNo)) {
        this.ErrorMessage = "Please enter a valid 10-digit mobile number.";
        this.toastr.error(this.ErrorMessage);
        return;
      }
      if (!this.request.MobileNo || this.request.MobileNo.toString().length !== 10) {
        this.ErrorMessage = "Please enter a valid 10-digit mobile number.";
        this.toastr.error(this.ErrorMessage);
        return;
      }
      this.isLoading = true;
      this.loaderService.requestStarted();
      this.request.CommnID = this.selectedOption;

      debugger
      // Save the data
      await this.CitizenSuggestionService.SaveData(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));  // Flatten response if nested

          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          // Extract the GeneratedSRNo from the Data array
          if (data.Data && data.Data.length > 0) {
            this.generatedSRNo = data.Data[0].GeneratedSRNo; // Extract from the first item
          }

          // Manually trigger change detection to update the view
          this.cdr.detectChanges();

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);

            // Open the modal to show the SR number
            this.modalService.open(this.MyModel_SRQuery);  // Open the modal
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        }, (error: any) => console.error(error));
    } catch (ex) {
      console.log(ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  OnOkClick() {
    this.modalService.dismissAll();
    this.ResetControl();
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {

      this.file = event.target.files[0];
      if (this.file) {
        //if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png') {
        //  //size validation
        //  if (this.file.size > 2000000) {
        //    this.toastr.error('Select less then 2MB File')
        //    return
        //  }
        //}
        //else {// type validation
        //  this.toastr.error('Select Only jpeg/jpg/png file')
        //  return
        //}
        if (this.file.size > 2000000) {
          this.toastr.error('Select less then 2MB File')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonMasterService.UploadDocument(this.file)
          .then((data: any) => {
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "Photo") {
                this.request.AttchFilePath = data['Data'][0]["FileName"];
              }

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


  async DeleteImage(FileName: any, Type: string) {

    try {
      // delete from server folder
      this.loaderService.requestEnded();
      await this.commonMasterService.DeleteDocument(FileName).then((data: any) => {
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == 0) {
          if (Type == "Photo") {
            this.request.AttchFilePath = '';
          }
          this.toastr.success(this.Message)
        }
        if (this.State == 1) {
          this.toastr.error(this.ErrorMessage)
        }
        else if (this.State == 2) {
          this.toastr.warning(this.ErrorMessage)
        }
      });
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
