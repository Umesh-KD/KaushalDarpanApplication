import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InvigilatorAppointmentDataModel, InvigilatorSSOIDList, InvigilatorSearchModel } from '../../../Models/InvigilatorAppointmentDataModel';
import { DropdownValidators } from '../../../Services/CustomValidators/custom-validators.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ToastrService } from 'ngx-toastr';
import { InvigilatorAppointmentService } from '../../../Services/InvigilatorAppointment/invigilator-appointment.service';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { Router } from '@angular/router';
import { DDL_InvigilatorSSOID_DataModel } from '../../../Models/CommonMasterDataModel';


@Component({
    selector: 'app-invigilator-appointment',
    templateUrl: './invigilator-appointment.component.html',
    styleUrls: ['./invigilator-appointment.component.css'],
    standalone: false
})
export class InvigilatorAppointmentComponent implements OnInit {
  public InvigilatorFormGroup!: FormGroup;
  invigilatorFormData = new InvigilatorAppointmentDataModel();
  public SubjectMasterDDL: any = [];
  public SemesterMasterDDL: any = [];
  public CourseMasterDDL: any = [];
  public isFormSubmitted: boolean = false;
  public isLoading: boolean = false;
  public searchRequest = new InvigilatorSearchModel()
  public requestInvigilatorSSOID = new DDL_InvigilatorSSOID_DataModel()
  newSSOId: string = '';
  isPrimary: boolean = false;
  ssoList: { id: string, isPrimary: boolean }[] = [];
  public sSOLoginDataModel = new SSOLoginDataModel();
  public InvigilatorAppointmentList: any = [];
  public InvigilatorDDL: InvigilatorSSOIDList[] = []
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private invigilatorAppointmentService: InvigilatorAppointmentService,
    private Swal2: SweetAlert2, private routers: Router,
  ) { }

  async ngOnInit() {

    //Add this on top 
    this.InvigilatorFormGroup = this.formBuilder.group({
      ddlCourse: ['', [DropdownValidators]],
      ddlSemester: ['', [DropdownValidators]],
      ddlSubject: ['', [DropdownValidators]],
      txtRollNumberFrom: ['', [Validators.required]],
      txtRollNumberTo: ['', [Validators.required]],
      txtRoomNumber: ['', [Validators.required]],
      txtDate: ['', [Validators.required]],
      ddlssoid: [''],
      //MarkAsPrimary: [''],
      MarkAsPrimary: new FormControl('')

    });


    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.ModifyBy = this.sSOLoginDataModel.UserID
    this.searchRequest.action = '_getAllData'

    this.invigilatorFormData.InvigilatorSSOID = []
    this.getMasterData();
    this.getAllData();
    this.getSemesterMasterData()
    this.getStreamMasterData()




  }

  get _InvigilatorFormGroup() { return this.InvigilatorFormGroup.controls; }

  async getMasterData() {
    try {
      this.loaderService.requestStarted();
      //await this.commonFunctionService.GetSubjectMasterDDL().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.SubjectMasterDDL = data.Data;
      //  console.log("SubjectMasterList", this.SubjectMasterDDL);
      //}, error => console.error(error))

      //await this.commonFunctionService.SemesterMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));
      //  this.SemesterMasterDDL = data.Data;
      //  console.log("SemesterMasterDDL", this.SemesterMasterDDL);
      //}, error => console.error(error))

      //await this.commonFunctionService.StreamMaster().then((data: any) => {
      //  data = JSON.parse(JSON.stringify(data));  
      //  this.CourseMasterDDL = data.Data;
      //  console.log("CourseMasterDDL", this.CourseMasterDDL);
      //})
      this.requestInvigilatorSSOID.DepartmentID = this.sSOLoginDataModel.DepartmentID
      await this.commonFunctionService.Get_InvigilatorSSOID(this.requestInvigilatorSSOID).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InvigilatorDDL = data.Data;
        console.log("CourseMasterDDL", this.InvigilatorDDL);
      })

    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getSemesterMasterData() {
    try {
      this.loaderService.requestStarted()
      await this.commonFunctionService.SemesterMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.SemesterMasterDDL = data.Data;
      }, (error: any) => console.error(error));
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async getStreamMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.StreamMaster().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.CourseMasterDDL = data.Data;
        console.log("StreamMasterList", this.CourseMasterDDL)
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

  async ddlStream_Change() {
    try {
      this.loaderService.requestStarted();
      await this.commonFunctionService.SubjectMaster_StreamIDWise(this.invigilatorFormData.CourseID, this.sSOLoginDataModel.DepartmentID, this.invigilatorFormData.SemesterID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.SubjectMasterDDL = data.Data;
          console.log("SubjectMasterDDLList", this.SubjectMasterDDL)
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


  addSSOId() {
    if (this.newSSOId == '') {
      this.toastr.error("Please Select OIA Name")
      return
    }
    this.loaderService.requestStarted();
    console.log("newSSOId", this.newSSOId);

    if (this.newSSOId.trim().length > 0) {
      try {
        // Find the selected item based on StaffID
        const selectedItem = this.InvigilatorDDL.find(item => item.StaffID.toString() === this.newSSOId);

        if (selectedItem) {
          this.invigilatorFormData.InvigilatorSSOID.push({
            SSOID: selectedItem.SSOID,
            StaffID: selectedItem.StaffID,
            UserID: selectedItem.UserID,
            Name: selectedItem.Name,
            IsPrimary: false // Default to false
          });

          console.log(this.invigilatorFormData.InvigilatorSSOID);
          this.newSSOId = ''; // Clear the input field
        } else {
          alert('Invalid selection.');
        }
      } catch (ex) {
        console.log(ex);
      } finally {
        this.loaderService.requestEnded();
      }
    }
  }



  deleteSSO(index: number) {
    this.invigilatorFormData.InvigilatorSSOID.splice(index, 1);
  }

  markAsPrimary(index: number) {
    this.invigilatorFormData.InvigilatorSSOID.forEach((sso, i) => {
      sso.IsPrimary = i === index;
    });
  }

  async getAllData() {
    this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    try {
      this.loaderService.requestStarted();
      await this.invigilatorAppointmentService.GetAllData(this.searchRequest).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.InvigilatorAppointmentList = data.Data;
        console.log("ssoList", this.InvigilatorAppointmentList);
      }, error => console.error(error))
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  checkRolleNumber() {
    if (this.invigilatorFormData.RollNumberFrom > this.invigilatorFormData.RollNumberTo) {
      this.toastr.error('Roll Number To should be greater than Roll Number From');
      this.invigilatorFormData.RollNumberTo = '';
    }
  }

  SaveData()
  {
    console.log(this.InvigilatorFormGroup);
    this.isFormSubmitted = true;
    if (this.InvigilatorFormGroup.invalid) {
      this.toastr.error('Please fill in all the required fields.');
      return;
    }

    if (this.invigilatorFormData.InvigilatorSSOID.length < 1 )
    {
      this.toastr.error('Please Select Invigilator.');
      return;
    }

    if (this.invigilatorFormData.InvigilatorSSOID.some(f => f.IsPrimary == false)) {
      this.toastr.error('Please Mark Invigilator Primary.');
      return;
    }

    this.invigilatorFormData.InstituteID = this.sSOLoginDataModel.InstituteID
    this.invigilatorFormData.ModifyBy = this.sSOLoginDataModel.UserID
    this.invigilatorFormData.DepartmentID = this.sSOLoginDataModel.DepartmentID
    this.invigilatorFormData.EndTermID = this.sSOLoginDataModel.EndTermID;
    try {
      this.loaderService.requestStarted();
      this.invigilatorAppointmentService.SaveData(this.invigilatorFormData).then((data: any) => {
        ;
        this.State = data['State'];
        this.Message = data['Message'];
        this.ErrorMessage = data['ErrorMessage'];
        if (this.State == EnumStatus.Success) {
          this.isFormSubmitted = false;
          this.invigilatorFormData = new InvigilatorAppointmentDataModel();
          this.newSSOId = '';
          this.isPrimary = false;
          this.getAllData();
          this.toastr.success(this.Message);
        } else {
          this.toastr.error(data.ErrorMessage);
        }
      }, error => console.error(error))

    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async btnEdit_OnClick(ID: number) {
    ;
    try {
      this.loaderService.requestStarted();
      await this.invigilatorAppointmentService.GetById(ID, this.sSOLoginDataModel.DepartmentID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          console.log(data, "getbyid");
          this.invigilatorFormData = data['Data']
          this.invigilatorFormData.CourseID = data['Data']['CourseID']
          this.ddlStream_Change()
          this.invigilatorFormData.SubjectID = data['Data']['SubjectID']
          // this.invigilatorFormData.Date = new Date(data['Data']['Date']).toISOString().split('T').shift().toString();
          
          const dob = new Date(data['Data']['Date']);
          const year = dob.getFullYear();
          const month = String(dob.getMonth() + 1).padStart(2, '0'); 
          const day = String(dob.getDate()).padStart(2, '0');
          this.invigilatorFormData.Date = `${year}-${month}-${day}`; 

          this.invigilatorFormData.InvigilatorSSOID = data['InvigilatorSSOID'][0]

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

  async DeleteById(ID: number) {
    this.Swal2.Confirmation("Do you want to delete?",
      async (result: any) => {
        //confirmed
        if (result.isConfirmed) {
          try {
            //Show Loading
            this.loaderService.requestStarted();

            await this.invigilatorAppointmentService.DeleteById(ID, this.sSOLoginDataModel.UserID, this.sSOLoginDataModel.DepartmentID)
              .then(async (data: any) => {
                data = JSON.parse(JSON.stringify(data));
                console.log(data);

                if (data.State == EnumStatus.Success) {
                  this.toastr.success(data.Message)
                  await this.getAllData()
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
      });
  }



  async controlReset() {
    this.InvigilatorFormGroup.reset();
    this.isFormSubmitted = false;
    this.getMasterData();
    this.getAllData();
  }
}
