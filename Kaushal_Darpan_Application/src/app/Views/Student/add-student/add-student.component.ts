import { Component, OnInit } from '@angular/core';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VerifierDataModel } from '../../../Models/VerifierDataModel';
import { ToastrService } from 'ngx-toastr';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumDepartment, EnumRole, EnumStatus } from '../../../Common/GlobalConstants';
import { StudentService } from '../../../Services/Student/student.service';
@Component({
  selector: 'app-add-student',
  standalone: false,
  templateUrl: './add-student.component.html',
  styleUrl: './add-student.component.css'
})
export class AddStudentComponent {
  public SSOLoginDataModel = new SSOLoginDataModel();
  public AddStudentFormGroup!: FormGroup;
  public request = new VerifierDataModel();
  public isSubmitted = false;
  public VerifierID: number = 0

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router
  ) { }


  async ngOnInit() {
    
    this.AddStudentFormGroup = this.formBuilder.group(
      {
        Name: ['', Validators.required],
        SSOID: ['', Validators.required],
        Email: ['', Validators.required],
        MobileNumber: ['', Validators.required],
        chkActiveStatus: ['true']
      });
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
    this.request.CourseType = this.SSOLoginDataModel.Eng_NonEng
    console.log("SSOLoginDataModle", this.SSOLoginDataModel);

    //this.VerifierID = Number(this.route.snapshot.queryParamMap.get('id')?.toString());
    //if (this.VerifierID) {
    //  await this.GetDataById(this.VerifierID)
    //}
  }

  get _AddStudentFormGroup() { return this.AddStudentFormGroup.controls; }

  async SaveStudentData() {
    

    
    this.isSubmitted = true;
    if (this.AddStudentFormGroup.invalid) {
      this.toastr.error('Invalid form');
      Object.keys(this.AddStudentFormGroup.controls).forEach(key => {
        const control = this.AddStudentFormGroup.get(key);

        if (control && control.invalid) {
          this.toastr.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });
      return;

    }
    try {
      this.loaderService.requestStarted();
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      if (this.request.VerifierID == 0) {
        this.request.CreatedBy = this.SSOLoginDataModel.UserID;
        this.request.ModifyBy = this.SSOLoginDataModel.UserID;
      } else {
        this.request.ModifyBy = this.SSOLoginDataModel.UserID;
      }
      this.request.DepartmentID = this.SSOLoginDataModel.DepartmentID;
      

     

      await this.studentService.AddStudentData(this.request).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success) {
          this.toastr.success(data.Message)
          this.ResetControl()
         
        } else {
          this.toastr.error(data.ErrorMessage)
        }
      }, (error: any) => console.error(error));
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

  //async GetDataById(VerifierID: number) {
  //  try {
  //    this.loaderService.requestStarted();
  //    await this.verifierService.GetDataById(VerifierID).then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      this.request = data.Data;
  //      console.log(this.request, "request")
  //    });
  //  } catch (error) {
  //    console.error(error);
  //  } finally {
  //    setTimeout(() => {
  //      this.loaderService.requestEnded();
  //    }, 200);
  //  }
  //}

  async ResetControl() {
    this.isSubmitted = false;
    this.request = new VerifierDataModel();
  }


}
