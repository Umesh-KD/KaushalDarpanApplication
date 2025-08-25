import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SSOLoginDataModel } from '../../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../../Common/appsetting.service';
import { ITI_IIPManageDataModel, IIPManageMemberDetailsDataModel } from '../../../../Models/ITI/ITI_IIPManageDataModel';
import { LoaderService } from '../../../../Services/Loader/loader.service';
import { ItiCollegesSearchModel, ItiTradeSearchModel } from '../../../../Models/CommonMasterDataModel';
import { ITI_InspectionDropdownModel } from '../../../../Models/ITI/ITI_InspectionDataModel';
import { ITIIIPManageService } from '../../../../Services/ITI/ITI-IIPModule/iti-iipmodule.service';
import { EnumDepartment, EnumStatus, GlobalConstants } from '../../../../Common/GlobalConstants';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'add-imc-registration',
  standalone: false,
  templateUrl: './add-imc-registration.component.html',
  styleUrl: './add-imc-registration.component.css'
})


export class AddItiIMCRegistrationComponent {
  public formData = new ITI_IIPManageDataModel()
  isFormSubmitted: boolean = false
  sSOLoginDataModel = new SSOLoginDataModel();
  RegistrationID: number = 0
  isFormReadOnly = false;


  selectedFileUrl: string | null = null;

  // default members
  defaultMemberTypes: string[] = [
    'Chairman',
    'Principal',
    'Zonal Officer',
    'District Employment Officer',
    'Instructor',
    'Local Expert',
    'Trainee',
    'Industry Representative'
  ];

  constructor(private toastr: ToastrService, private loaderService: LoaderService, private IIPManageService: ITIIIPManageService, private router: Router, private activatedRoute: ActivatedRoute) {
    // initialize 7 fixed rows + 1 representative
    let i = 1;
    this.formData.IMCMemberDetails = this.defaultMemberTypes.map(type => {
      
      const member = new IIPManageMemberDetailsDataModel();
      member.MemberTypeName = type;
      member.MemberTypeID = i++;
      return member;

    });
  }

  async ngOnInit() {
   
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //this.CenterObserverTeamID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    //console.log("this.CenterObserverTeamID", this.CenterObserverTeamID);
    //if (this.CenterObserverTeamID) {
    //  await this.GetByID()
    //}
    this.activatedRoute.queryParams.subscribe((params) => {
      this.RegistrationID = params['id'];
      console.log("this.InspectionTeamID:", this.RegistrationID);
    });
    if (this.RegistrationID != undefined && this.RegistrationID != null && this.RegistrationID != 0) {
      debugger
      this.GetById_Team(this.RegistrationID);
    }
    
    // this.getFlyingSquad();
  }

  addRepresentive() {
    const member = new IIPManageMemberDetailsDataModel();
    member.MemberTypeName = 'Industry Representative';
    member.MemberTypeID = 8;
    this.formData.IMCMemberDetails.push(member);
  }

  removeRepresentive(index: number) {
    this.formData.IMCMemberDetails.splice(index, 1);
  }

  //addRepresentive() {
  //  this.formData.IMCMemberDetails.push(new IIPManageMemberDetailsDataModel());
  //}

  //removeRepresentive(index: number) {
  //  this.formData.IMCMemberDetails.splice(index, 1);
  //}

  async onSubmit(form: any)
  {
    if (!form.valid)
    {
      return
    }

    if (form.valid) {
      console.log('Form Submitted', this.formData);
    }
    debugger;
    this.isFormSubmitted = true
    this.formData.FinancialYearID = this.sSOLoginDataModel.FinancialYearID;
    this.formData.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.formData.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
    this.formData.UserID = this.sSOLoginDataModel.UserID;
    this.formData.InstituteId = this.sSOLoginDataModel.InstituteID;

    try {
      this.loaderService.requestStarted();
      debugger;
      await this.IIPManageService.SaveIMCReg(this.formData).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        if (data.State === EnumStatus.Success) {
          this.toastr.success("Saved Successfully");
          this.router.navigate(['/iti-iip-manage']);
        } else if (data.State === EnumStatus.Warning) {
          this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestStarted();
      }, 200)
    }
  }


  //formatDateToInput(dateStr: string): string {
  //  if (!dateStr) return '';

  //  const [datePart] = dateStr.split(' '); // get "20-06-2025"
  //  const [day, month, year] = datePart.split('-');

  //  return `${year}-${month}-${day}`; // returns "2025-06-20"
  //}


  async GetById_Team(id: number) {

    try {
      this.loaderService.requestStarted();
      await this.IIPManageService.GetById_IMC(id).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        console.log("data", data)
        debugger;
        if (data.State === EnumStatus.Success) {
          this.formData = data.Data
          this.selectedFileUrl = this.formData.RegLink; // Set the selected file URL for preview
          // In ngOnInit or wherever request is populated
          //this.formData.RegDate =  this.formatDateToInput(this.formData.RegDate);
          this.isFormReadOnly = true;
          //this.InspectionFormGroup.get('TeamTypeID')?.disable();
          //this.InspectionFormGroup.get('DeploymentDateFrom')?.disable();
          //this.InspectionFormGroup.get('DeploymentDateTo')?.disable();


        } else if (data.State === EnumStatus.Warning) {
          // this.toastr.warning(data.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      })
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200)
    }
  }

 

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileUrl = URL.createObjectURL(file); // create temporary URL
    }
  }

  previewFile() {
    if (this.selectedFileUrl) {
      window.open(this.selectedFileUrl, '_blank'); // open file in new tab
    }
  }



}






//export class AddItiIMCRegistrationComponent {
  
//  IMCRegistrationForm!: FormGroup;
//  defaultMemberTypes: string[] = ['Chairman', 'Principal', 'Zonal Officer', 'District Employment Officer', 'Instructor', 'Local Expert','Trainee','Indusrty Representative' ];
 
//  members: Member[] = [];
//  formData = new ITI_IIPManageDataModel();
  
//  filterData: any[] = [];
//  dataSource = new MatTableDataSource<any>([]);
//  sSOLoginDataModel = new SSOLoginDataModel();
//  isSubmitted: boolean = false;
 
//  isFormSubmitted: boolean = false
 


//  constructor(
//    private fb: FormBuilder,
//    private toastr: ToastrService,
//    public appsettingConfig: AppsettingService,
   

//  ) {
//    this.members = this.defaultMemberTypes.map(type => ({
//      type,
//      name: '',
//      company: '',
//      email: '',
//      contact: '',
//      isNew: false
//    }));
//  }

//  //  async ngOnInit() {
//  //  debugger;
//  //  this.IMCRegistrationForm = this.fb.group({
//  //    // StreamID: ['', [DropdownValidators]],
//  //    regOfficeName: ['', Validators.required],
//  //    //ShiftID: ['', [DropdownValidators]],
      
//  //  });
  
//  //  this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));

 
//  //  // this.getFlyingSquad();
//  //}

//  // Add new Representative row
//  addRepresentative() {
//    this.members.push({
//      type: 'Indusrty Representative',
//      name: '',
//      company: '',
//      email: '',
//      contact: '',
//      isNew: true
//    });
//  }
//  // Remove dynamically added Representative
//  removeRepresentative(index: number) {
//    if (this.members[index].type === 'Indusrty Representative' && this.members[index].isNew) {
//      this.members.splice(index, 1);
//    }
//  }



//  get formIMCRegistration() { return this.IMCRegistrationForm.controls; }


//  onSubmit(form: any) {
//    alert('data')
//    if (form.valid) {
//      console.log('Form Submitted', this.formData);
//      // TODO: call API here
//    }
//  }
//}
