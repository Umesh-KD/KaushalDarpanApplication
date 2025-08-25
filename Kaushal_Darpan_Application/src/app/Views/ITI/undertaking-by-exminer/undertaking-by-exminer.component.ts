import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonFunctionService } from '../../../Common/common';
import { ToastrService } from 'ngx-toastr';
import { AppsettingService } from '../../../Common/appsetting.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITIRelievingExamService } from '../../../Services/ITI/ITIRelieveingExam/iti-relieveing-exam.service';
import { error } from 'highcharts';
import { UndertakingExaminerFormModel } from '../../../Models/ITI/UndertakingExminerFormModel';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-undertaking-by-exminer',
  standalone: false,
  templateUrl: './undertaking-by-exminer.component.html',
  styleUrl: './undertaking-by-exminer.component.css'
})
export class UndertakingByExminerComponent implements OnInit {
  
  UndertakingExminerForm!:FormGroup;
  public Messagae:any=[];
  public ErrorMessage:any=[];
  public State:number=0;
  public isLoading:boolean=false;
  public isSubmitted:boolean=false;
  public GetDetailsListBySSOId:any=[];
  public sSOLoginDataModel=new SSOLoginDataModel();
  request: UndertakingExaminerFormModel = new UndertakingExaminerFormModel();
  public ExaminerID: number = 0
  public ID: number = 0;
  ItiCollegeDataList: any[] = [];

  itiCollegeList = ['College 1', 'College 2'];
  subjectList = ['Subject 1', 'Subject 2'];

  ItiCollegeData: any[] = [{name: 'ITI College 1', completeAddress: 'Address 1'},
                           {name: 'ITI College 2', completeAddress: 'Address 2'}];
  

  constructor(
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    public itiRelievingExamService: ITIRelievingExamService,
    private Activeroute: ActivatedRoute,
    private router: Router,
  ){}


  async ngOnInit(){
    this.loaderService.requestStarted();
      this.UndertakingExminerForm=this.formBuilder.group({
        LetterNumber: ['', Validators.required],
        AppointingDate: ['', Validators.required],

       // SsoId: ['', Validators.required],
        SsoId: [{ value: '', disabled: true }, Validators.required],
        Name: [{ value: '' }, Validators.required],
        Designation: [{ value: '' }, ],
        Organization: [{ value: '' }, ],
        ContactNumber: [{ value: '' }, ],
        EmailId: [{ value: ''  },],     // [Validators.required, Validators.email]
        Address: [{ value: '' }, ],

        ItiCollege: [null, Validators.required],
        MisCode: ['', Validators.required],
        DateOfExamination: ['', Validators.required],
        SubjectAppointed: [null, Validators.required],
        ItiCompleteAddress: [{ value: '' },],
        Declaration1: [false, Validators.required],
        Declaration2: [false, Validators.required],
        DeficienciesDetails: [''],
      })
      console.log(this.UndertakingExminerForm.getRawValue());
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ExaminerID = Number(this.Activeroute.snapshot.queryParamMap.get('id')?.toString())

    if (this.ExaminerID > 0) {
      //await this.GetById();
      await this.GetUnderTakingExaminerDetailbyID(this.ExaminerID)
      this.GetAllCenterList();

    }

    this.loaderService.requestEnded();
  }

  

  // get form() { return this.UndertakingExminerForm.controls; }

  async onSubmit() {

    if (!this.UndertakingExminerForm.value.Declaration1 || !this.UndertakingExminerForm.value.Declaration2) {
      this.toastr.error('Please check all required declarations.', 'Error');
      return;
    }


    console.log('form submitted',this.UndertakingExminerForm.value);
    this.isLoading=true;
    this.isSubmitted=true;
    this.loaderService.requestStarted();
    if(this.UndertakingExminerForm.invalid){
      this.isLoading=false;
      this.loaderService.requestEnded();
      this.toastr.error('Please fill all required fields', 'Error');
      return;
    }
    try{
      this.request = this.UndertakingExminerForm.getRawValue();
      this.request.ModifyBy = this.sSOLoginDataModel.UserID.toString();
      this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
      this.request.CenterAssignedID = this.ExaminerID;

      console.log('Request Data:', this.request);
      
      await this.itiRelievingExamService.SaveUndertakingExaminerData(this.request)
        .then((data:any)=>{
          console.log(data);
          data = JSON.parse(JSON.stringify(data));
   
          if (this.State = EnumStatus.Success)
          {
            this.toastr.success('Form submitted successfully', 'Success');

            this.UndertakingExminerForm.reset();
            this.isSubmitted = false;
            setTimeout(() => {
              this.router.navigate(['/PracticalExaminerUndertaking']);
            }, 300);

          } else
          {
            this.toastr.error(data['Message'], 'Error');
          }
        },error=>{
          console.error(error);
          this.toastr.error('An error occurred while submitting the form', 'Error');
        });
    }
    catch(ex){
      console.error('Error during form submission:', ex);
      this.toastr.error('An error occurred while submitting the form', 'Error');
    }
    finally{
      this.isLoading=false;
      this.loaderService.requestEnded();
    }

  }

 async fetchExaminerDetails(){
   
    const ssoId=this.UndertakingExminerForm.get('SsoId')?.value?.trim();
    console.log(ssoId);
    if(!ssoId){
      alert('Please enter SSO ID');
      return;
    }

    try{
      this.loaderService.requestStarted();
      await this.itiRelievingExamService.GetDetailsBySSOId(ssoId)
      .then((data:any)=>{
        // debugger;
        console.log(data)
        data=JSON.parse(JSON.stringify(data));
        this.GetDetailsListBySSOId=data['Data'].length > 0 ? data['Data'][0] : null;
        console.log(this.GetDetailsListBySSOId);
      },error=>console.error(error));
      
     if (this.GetDetailsListBySSOId) {
        this.UndertakingExminerForm.patchValue({
          Name: this.GetDetailsListBySSOId.DisplayName,
          Designation: this.GetDetailsListBySSOId.Designation,
          Organization: this.GetDetailsListBySSOId.DepartmentName,
          ContactNumber: this.GetDetailsListBySSOId.MobileNo,
          EmailId: this.GetDetailsListBySSOId.MailOfficial?.trim()? this.GetDetailsListBySSOId.MailOfficial: this.GetDetailsListBySSOId.MailPersonal,
          Address: this.GetDetailsListBySSOId.PostalAddress
        });
      }
      else{
        this.toastr.error('No data found for the provided SSO ID', 'Error');
        this.UndertakingExminerForm.patchValue({
          Name: '',
          Designation: '',
          Organization: '',
          ContactNumber: '',
          EmailId: '',
          Address: ''
        });
      }
    }
    catch(Ex){
      console.log(Ex);
    }
    finally{
      setTimeout(()=>{
        this.loaderService.requestEnded();
      },200);
    }
  }

  async GetUnderTakingExaminerDetailbyID(ID : number)
  {
    try {
      this.loaderService.requestStarted();
      await this.itiRelievingExamService.GetDetailbyID(ID).then((data: any) => {
        
        data = JSON.parse(JSON.stringify(data));
        this.UndertakingExminerForm.patchValue({
          LetterNumber: data.Data[0]["LetterNumber"],
          AppointingDate: data.Data[0]["AppointingDate"],
          SsoId: data.Data[0]["SsoId"],
          Name: data.Data[0]["Name"],
          Designation: data.Data[0]["DesignationNameEnglish"],
          Organization: data.Data[0]["Organization"],
          ContactNumber: data.Data[0]["ContactNumber"],
          EmailId: data.Data[0]["Email"],
          Address: data.Data[0]["Address"],
          ItiCollege: data.Data[0]["CenterID"],
          MisCode: data.Data[0]["MISCode"],
          DateOfExamination: data.Data[0]["DateOfExamination"],
          SubjectAppointed: data.Data[0]["SubjectAppointed"],
          ItiCompleteAddress: data.Data[0]["ITICompleteAddress"],
          DeficienciesDetails: data.Data[0]["DeficienciesDetails"],
          Declaration1: data?.Data[0]["LetterNumber"] != '' ? true : false,
          Declaration2: data?.Data[0]["LetterNumber"] != '' ? true : false,
        });
        
        //const letterNumber = this.UndertakingExminerForm.get('LetterNumber')?.value;

   


        
      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetAllCenterList()
  {
    try {
      this.loaderService.requestStarted();
      await this.itiRelievingExamService.GetCenterList(0).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        
        this.ItiCollegeDataList = data.Data;

      })
    } catch (error) {
      console.error(error)
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  } 
  

  onItiCollegeChange(event: any) {
    const selectedCollege = event.target.value;
    const itiCollege = this.ItiCollegeData.find(college => college.name === selectedCollege);
    if (itiCollege) {
      this.UndertakingExminerForm.patchValue({
        ItiCompleteAddress: itiCollege.completeAddress
      });
    } else {
      this.UndertakingExminerForm.patchValue({
        ItiCompleteAddress: ''
      });
    }
  }


  // get detail by id
  async GetById() {
    try {
      this.loaderService.requestStarted();
      await this.itiRelievingExamService.GetUndertakingtExaminerById(this.ExaminerID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.request = data['Data'][0];
/*          this.request.NoOfPrsentTrainees = data['Data'][0]['NoOfPresentTrainees'];*/
          /*  console.log(data['Data'][0]['NoOfAbsentTrainees'])*/
          //this.RelievingPracticalForm.patchValue({
          //  CopyPacket: this.request.CopyPacket ? 'Yes' : 'No',
          //  DateOfExamination: this.request.DateOfExamination,
          //  marckSheetPacket: this.request.marckSheetPacket ? 'Yes' : 'No',
          //  NCVTPracticalExam: this.request.NCVTPracticalExam,
          //  NoOfAbsentTrainees: this.request.NoOfAbsentTrainees,
          //  NoOfPrsentTrainees: this.request.NoOfPrsentTrainees,  // note spelling fix
          //  NoOfTotalTrainees: this.request.NoOfTotalTrainees,
          //  OtherInfo: this.request.OtherInfo ? 'Yes' : 'No',
          //  OtherInfoText: this.request.OtherInfoText,
          //  PracticalExamCentre: this.request.PracticalExamCentre,
          //  PracticalExaminerDesignation: this.request.PracticalExaminerDesignation,
          //  PracticalExaminerName: this.request.PracticalExaminerName,
          //  PracticalExaminerNumber: this.request.PracticalExaminerNumber,
          //  PracticalPacket: this.request.PracticalPacket ? 'Yes' : 'No',
          //  PracticalTeacherPacket: this.request.PracticalTeacherPacket ? 'Yes' : 'No',
          //  sealedPacket: this.request.sealedPacket ? 'Yes' : 'No',
          //  billPacket: this.request.billPacket ? 'Yes' : 'No',
          //  Trade: this.request.Trade
          //});
         /* console.log(this.RelievingPracticalForm.value)*/
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


}
