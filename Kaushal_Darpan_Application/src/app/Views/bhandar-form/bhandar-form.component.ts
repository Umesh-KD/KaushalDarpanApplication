import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../Services/Loader/loader.service';
import { ToastrService } from 'ngx-toastr';
import { BterApplicationForm } from '../../Services/BterApplicationForm/bterApplication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EncryptionService } from '../../Services/EncryptionService/encryption-service.service';
import { DropdownValidators } from '../../Services/CustomValidators/custom-validators.service';
import { AddBhandarFormDataModel } from '../../Models/BhandarFormDataModel';
import { EnumStatus } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { BhandarFormService } from '../../Services/BhandarForm/bhandar-form.service.ts';
import { SSOLoginDataModel } from '../../Models/SSOLoginDataModel';

@Component({
  selector: 'app-bhandar-form',
  standalone: false,
  templateUrl: './bhandar-form.component.html',
  styleUrl: './bhandar-form.component.css'
})
export class BhandarFormComponent {
  public BhandarForm!: FormGroup;
  public isSubmitted: boolean = false
  public request = new AddBhandarFormDataModel()
  public ExamDate: string = ''
  public ExamDate1: string = ''
  public ShiftID: number = 0
  public CenterID: number = 0
  public SemesterID: number = 0
  hour: number = 1;        // 1–12
  minute: number = 0;     // 0–59
  ampm: string = 'AM';    // AM / PM
  RollNo1: string = '';    // AM / PM
  RollNo2: string = '';    // AM / PM
  RollNo3: string = '';    // AM / PM
  Time1: string = '';    // AM / PM
  Time2: string = '';    // AM / PM
  Time3: string = '';    // AM / PM
  ItemList1:any=[]
  ItemList2:any=[]
  ItemList3: any = []
  ExamShiftDDL: any = []
  public State: number = 0;
  public key: number = 0;
  public Message: string = '';
  public ErrorMessage: string = '';
  sSOLoginDataModel = new SSOLoginDataModel()
  constructor(
    private formBuilder: FormBuilder,
    private commonMasterService: CommonFunctionService,
    private loaderService: LoaderService,
    private toastr: ToastrService,
    private ApplicationService: BhandarFormService,
    private activatedRoute: ActivatedRoute,
    private encryptionService: EncryptionService,
    public appsettingConfig: AppsettingService,
    private router: Router
  ) { }

  async ngOnInit() {
    this.BhandarForm = this.formBuilder.group({
       /* MoharID: ['', [DropdownValidators]],*/
        Name: ['', Validators.required],
        ExamNo: ['', Validators.required],
        StudentNo: ['', Validators.required],
        // FromDutyTime: ['', Validators.required],
        Size: ['', ],
        // ToDutyTime: ['', Validators.required],
        ShiftID_choosen: ['', [DropdownValidators]],

      });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.SemesterID = Number(sessionStorage.getItem('SemesterID'));
    /*    this.searchRequest.CenterID = Number(sessionStorage.getItem('CenterID'));*/
   debugger
    this.ExamDate = sessionStorage.getItem('ExamDate') ?? '';
    const datePart = this.ExamDate.split('T')[0]; // 2025-12-16
    const [year, month, day] = datePart.split('-');

    this.ExamDate1 = `${day}-${month}-${year}`;

    this.CenterID = Number(sessionStorage.getItem('CenterID'));
    this.ShiftID = Number(sessionStorage.getItem('ShiftID'));
    await this.getMasterData();
    await this.GetTheoryMarksDetailList()

  }
  convertToAmPm(time: string): string {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }


  get _BhandarForm() { return this.BhandarForm.controls; }

  async getMasterData() {
    try {
      this.loaderService.requestStarted();
      await this.commonMasterService.GetExamShift().then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        this.ExamShiftDDL = data.Data;
      })
    } catch (error) {
      console.error(error);
    } 
  }

  //
  async GetTheoryMarksDetailList() {
    try {
 
      //session

      debugger
      //call
      this.request.CenterID = this.CenterID
      this.request.ExamDate = this.ExamDate
      this.request.ShiftID = this.ShiftID
      this.request.SemesterID = this.SemesterID

      this.loaderService.requestStarted();
      await this.ApplicationService.GetByID(this.request)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.request = data['Data'];
     
          if (this.request.BhandarStudentModel != null && this.request.BhandarStudentModel != undefined) {
            this.ItemList1 = this.request.BhandarStudentModel.filter((e:any)=>e.Type==1)
            this.ItemList2 = this.request.BhandarStudentModel.filter((e:any)=>e.Type==2)
       /*     this.ItemList3 = this.request.BhandarStudentModel.filter((e:any)=>e.Type==3)*/
          }
         
          Object.keys(this.request).forEach((key) => {
            const value = this.request[key as keyof AddBhandarFormDataModel];

            if (value === null || value === undefined) {
              // Default to '' if string, 0 if number
              if (typeof this.request[key as keyof AddBhandarFormDataModel] === 'number') {
                (this.request as any)[key] = 0;
              } else {
                (this.request as any)[key] = '';
              }
            }
          })
      

          //table feature load
         
          //end table feature load
        }, (error: any) => console.error(error));
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
  async Addnew() {
    this.isSubmitted = true
    if (this.BhandarForm.invalid) {
      return
    }
    // 3️⃣ Convert AM/PM to minutes for comparison
    // const fromMinutes = this.convertToMinutes(this.request.FromDutyTime);
    // const toMinutes = this.convertToMinutes(this.request.ToDutyTime);

    // if (toMinutes < fromMinutes) {
    //   alert("To Duty Time cannot be earlier than From Duty Time!");
    //   return;
    // }
    if (!this.request.BhandarDetailsModel) {
      this.request.BhandarDetailsModel=[]
    }
    this.request.BhandarDetailsModel.push({
      Name: this.request.Name,
      ExamNo: this.request.ExamNo,
      StudentNo: this.request.StudentNo,
      // FromDutyTime: this.request.FromDutyTime,
      // ToDutyTime: this.request.ToDutyTime,
      Size: this.request.Size,
      ShiftID: this.request.ShiftID_choosen
    })
    this.request.Name = '';
    this.request.ExamNo = '';
    this.request.StudentNo = '';
    this.request.FromDutyTime = '';
    this.request.ToDutyTime = '';
    this.request.Size = '';
    this.request.ShiftID_choosen = 0;

    this.isSubmitted=false
  }


  deleteRow(index: number): void {
    this.request.BhandarDetailsModel.splice(index, 1);
  }
 
  convertToMinutes(time12: string): number {
    // time12 example: "10:30 AM" or "02:15 PM"
    const [time, modifier] = time12.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes; // total minutes since 00:00
  }
  async Addnew1() {
    if (this.RollNo1 == '') {
      this.toastr.error("Please fill Roll No")
      return
    }
    if (this.Time1 == '') {
      this.toastr.error("Please fill Time")
      return
    }
    if (!this.ItemList1) {
      this.ItemList1=[]
    }

    this.ItemList1.push({
      RollNo: this.RollNo1,
      Type: 1,
      Time: this.Time1
    })
    this.Time1 = '',
      this.RollNo1=''

  }

  deleteRow1(index: number): void {
    this.ItemList1.splice(index, 1);
  }

  deleteRow2(index: number): void {
    this.ItemList2.splice(index, 1);
  }

  async Addnew2() {
    if (this.RollNo2 == '') {
      this.toastr.error("Please fill Roll No")
      return
    }
    if (this.Time2 == '') {
      this.toastr.error("Please fill Time")
      return
    }
    if (!this.ItemList2) {
      this.ItemList1 = []
    }

    this.ItemList2.push({
      RollNo: this.RollNo2,
      Type: 2,
      Time: this.Time2
    })
    this.Time2 = '',
      this.RollNo2 = ''

  }


  async Addnew3() {
    if (this.RollNo3 == '') {
      this.toastr.error("Please fill Roll No")
      return
    }
    if (this.Time3 == '') {
      this.toastr.error("Please fill Time")
      return
    }
    if (!this.ItemList3) {
      this.ItemList1 = []
    }

    this.ItemList3.push({
      RollNo: this.RollNo3,
      Type: 3,
      Time: this.Time3
    })
    this.Time3 = '',
      this.RollNo3 = ''

  }
  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      debugger;
      this.file = event.target.files[0];
      if (this.file) {

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
                this.request.DisFileName = data['Data'][0]["Dis_FileName"];
                this.request.FileName = data['Data'][0]["FileName"];

              }
              //else if (Type == "Sign") {
              //  this.request.Dis_CompanyName = data['Data'][0]["Dis_FileName"];
              //  this.request.CompanyPhoto = data['Data'][0]["FileName"];
              //}
              /*              item.FilePath = data['Data'][0]["FilePath"];*/
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
  async SaveData() {

    if (this.request.MoharID == '') {
      this.toastr.warning("Please Select Valid Mohar")
      return
    }

    if (this.request.FileName == '') {
      this.toastr.warning("Please Upload signature of Centre Superintendent")
      return
    }

    if (this.request.BhandarDetailsModel.length == 0) {
      this.toastr.warning("Please Add On Duty Officer List")
      return
    }

    this.request.BhandarStudentModel = []
    this.request.BhandarStudentModel = [
      ...this.ItemList1,
      ...this.ItemList2,
      ...this.ItemList3
    ];
    this.request.CenterID = this.CenterID
    this.request.ExamDate = this.ExamDate
    this.request.ShiftID = this.ShiftID
    this.request.SemesterID = this.SemesterID
    this.request.UserID = this.sSOLoginDataModel.UserID
    this.request.EndtermID = this.sSOLoginDataModel.EndTermID

    try {
      await this.ApplicationService.SaveData(this.request)
        .then(async (data: any) => {
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];
          if (this.State == EnumStatus.Success) {
            this.toastr.success(this.Message);
        
            this.Back()
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
      }, 200);
    }

  }
  async ResetControls() {

    //this.reques
  }

  async Back() {

    sessionStorage.setItem('SemesterID', '0');
    sessionStorage.setItem('CenterID', '0');
    sessionStorage.setItem('ExamDate', '');
    sessionStorage.setItem('ShiftID', '0');

    // Navigate
    this.router.navigate(['daily-report-bhandar-form1']);
  }



  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }
}
