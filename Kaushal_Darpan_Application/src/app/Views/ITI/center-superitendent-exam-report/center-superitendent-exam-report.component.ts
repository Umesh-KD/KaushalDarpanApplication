import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { CenterSuperitendentExamReportModel } from '../../../Models/ITI/CenterSuperitendentExamReportModel';
import { CenterSuperitendentExamReportService } from '../../../Services/ITI/CenterSuperitendentExamReport/CenterSuperitendentExamReport.Service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
// import pdfmake from 'pdfmake/build/pdfmake';
import { FontsService } from '../../../Services/FontService/fonts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';



@Component({
  selector: 'app-center-superitendent-exam-report',
  standalone: false,
  templateUrl: './center-superitendent-exam-report.component.html',
  styleUrl: './center-superitendent-exam-report.component.css'
})
export class CenterSuperitendentExamReportComponent {

  examReportForm!: FormGroup;
  public State: number = -1;
  public Message: any = [];
  public ErrorMessage: any = [];
  public isSubmitted: boolean = false;
  public ExamDate:string=''
  //  pdfMakeVfs:any=pdfmake.vfs||{};
  public sSOLoginDataModel = new SSOLoginDataModel()
  requestObj:CenterSuperitendentExamReportModel = new CenterSuperitendentExamReportModel();
  englishToHindiTranslation:any={
    satisfactory:'संतोषजनक',
    good:'अच्छा',
    unsatisfactory:'असंतोषजनक',
    no:'नहीं',
    yes:'हां',
    true:'हां',
    false:'नहीं'
  };

  Id: number = 0;

  constructor(private fb: FormBuilder,private CenterSuperitendentService: CenterSuperitendentExamReportService, private toastr: ToastrService,private loaderService: LoaderService, private commonFunctionService: CommonFunctionService,private fontsService : FontsService,private router: Router,private routers: ActivatedRoute,) {}

  async ngOnInit() {
    this.examReportForm = this.fb.group({
      confidentialityLevel: ['', Validators.required],
      examOnTime: ['', Validators.required],
      examOnTimeRemark: [''],

     examSchedule: this.fb.array([this.createExamScheduleGroup()]),

      markingGuidance: ['', Validators.required],
      markingGuidanceRemark: [''],
      markingGuidanceDocument: [null],

      changeSizeOfUnits: ['', Validators.required],
      changeSizeOfUnitsRemark: [''],
      changeSizeOfUnitsDocument: [null],

      lightFacilities: ['', Validators.required],
      waterFacilities: ['', Validators.required],
      discipline: ['', Validators.required],
      toiletFacilities: ['', Validators.required],

      incidentOnExam: ['', Validators.required],
      incidentOnExamRemark: [''],
      incidentOnExamDocument: [null],


      examConductComment:[''],
      examConductCommentRemark:[''],
      // CommentsOnlightFacilities:[''],
      // CommentsOnwaterFacilities:[''],
      // CommentsOndiscipline:[''],
      // CommentsOntoiletFacilities:[''],

      futureExamCenterComment: [''],
      otherFutureExamSuggestions: [''],

      flyingSquadDetails: this.fb.array([this.createFlyingSquadGroup()])
    });
    // this.pdfMakeVfs['NotoSansDevanagari-Regular.ttf'] = await this.fontsService.getHindiFontRegular();
    // this.pdfMakeVfs['NotoSansDevanagari-Bold.ttf'] = await this.fontsService.getHindiFontBold();
    // this.pdfMakeVfs['Roboto-Regular.ttf'] = await this.fontsService.getEnglishFontRegular();
    // this.pdfMakeVfs['Roboto-Bold.ttf'] = await this.fontsService.getHindiFontBold();
    // pdfmake.vfs = this.pdfMakeVfs;
    this.Id = Number(this.routers.snapshot.paramMap.get('id')?.toString());
   

    this.ExamDate = this.routers.snapshot.queryParamMap.get('ExamDate') || '';
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
     if(this.Id > 0){
      this.fillFormById(this.Id);
    }
    else{
      this.Id = 0;
    }
  }

  // ----------------------------
  // FormArray: Exam Schedule
  // ----------------------------
  get examScheduleArray(): FormArray {
    return this.examReportForm.get('examSchedule') as FormArray;
  }


  createExamScheduleGroup(): FormGroup {
    return this.fb.group({
      Id : [0],
      examDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  addExamSchedule(): void {
    this.examScheduleArray.push(this.createExamScheduleGroup());
  }

  removeExamSchedule(index: number): void {
    if (this.examScheduleArray.length > 1) {
      this.examScheduleArray.removeAt(index);
    }
  }



validateSchedule(index: number) {
  const group = this.examScheduleArray.at(index);
  const startTime = group.get('startTime')?.value;
  const endTime = group.get('endTime')?.value;

  if (startTime && endTime) {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    if (toMinutes(endTime) <= toMinutes(startTime)) {
      alert('समाप्त होने का समय प्रारंभ समय से बड़ा होना चाहिए।');
      // Optionally clear the invalid input
      group.get('endTime')?.setValue('');
    }
  }

  group.updateValueAndValidity(); 
  group.markAllAsTouched();       
}

  get form() { return this.examReportForm.controls; }

  // ----------------------------
  // FormArray: Flying Squad
  // ----------------------------
  get flyingSquadArray(): FormArray {
    return this.examReportForm.get('flyingSquadDetails') as FormArray;
  }

  createFlyingSquadGroup(): FormGroup {
    return this.fb.group({
      Id : [0],
      serialNumber: ['', Validators.required],
      visitDate: ['', Validators.required],
      duration: ['', Validators.required],
      inchargeName: ['', Validators.required],
      inchargePosition: ['', Validators.required],
      vehicleNumber: ['', Validators.required]
    });
  }

  addFlyingSquad(): void {
    this.flyingSquadArray.push(this.createFlyingSquadGroup());
  }

  removeFlyingSquad(index: number): void {
    if (this.flyingSquadArray.length > 1) {
      this.flyingSquadArray.removeAt(index);
    }
  }

  // ----------------------------
  // File Upload Handler
  // ----------------------------
  onFileUpload(event: Event, controlName: string): void {
    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.examReportForm.get(controlName)?.setValue(file);
    }
  }




  // ----------------------------
  // Error Handling
  // ----------------------------
  hasError(controlName: string, error: string): boolean {
    const control = this.examReportForm.get(controlName);
    return !!(control && control.touched && control.hasError(error));
  }

  getErrorMessage(controlName: string): string {
    const control = this.examReportForm.get(controlName);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    return '';
  }

  // ----------------------------
  // Submit & Cancel
  // ----------------------------
  onSubmit(): void {
    console.log(this.examReportForm.value);
    this.isSubmitted=true;
    debugger

    Object.keys(this.examReportForm.controls).forEach(key => {
      const control = this.examReportForm.get(key);

        if (control && control.invalid) {
          this.toastr.error(`Control ${key} is invalid`);
          Object.keys(control.errors!).forEach(errorKey => {
            this.toastr.error(`Error on control ${key}: ${errorKey} - ${control.errors![errorKey]}`);
          });
        }
      });

    if (this.examReportForm.invalid) {
      this.examReportForm.markAllAsTouched();
      return;
    }

    this.requestObj.id = this.Id;
    this.requestObj.confidentialityLevel = this.examReportForm.value.confidentialityLevel.toString();
    this.requestObj.examOnTime = this.examReportForm.value.examOnTime.toString().toLowerCase() === 'yes'? true : false;
    this.requestObj.examOnTimeRemark = this.examReportForm.value.examOnTimeRemark;
    this.requestObj.examSchedule = JSON.stringify(this.examReportForm.value.examSchedule);
    this.requestObj.markingGuidance = this.examReportForm.value.markingGuidance.toString().toLowerCase() === 'yes'? true : false;
    this.requestObj.markingGuidanceRemark = this.examReportForm.value.markingGuidanceRemark
    // this.requestObj.markingGuidanceDocument = this.examReportForm.value.markingGuidanceDocument;
    this.requestObj.changeSizeOfUnits = this.examReportForm.value.changeSizeOfUnits.toString().toLowerCase() === 'yes'? true : false;
    this.requestObj.changeSizeOfUnitsRemark = this.examReportForm.value.changeSizeOfUnitsRemark

    // this.requestObj.changeSizeOfUnitsDocument = this.examReportForm.value.changeSizeOfUnitsDocument;
    this.requestObj.lightFacilities = this.examReportForm.value.lightFacilities;
    this.requestObj.waterFacilities = this.examReportForm.value.waterFacilities;
    this.requestObj.discipline = this.examReportForm.value.discipline;
    this.requestObj.toiletFacilities = this.examReportForm.value.toiletFacilities;
    this.requestObj.incidentOnExam = this.examReportForm.value.incidentOnExam.toString().toLowerCase() === 'yes'? true : false;
    this.requestObj.incidentOnExamRemark = this.examReportForm.value.incidentOnExamRemark;
    // this.requestObj.incidentOnExamDocument = this.examReportForm.value.incidentOnExamDocument;
    //added
    this.requestObj.examConductComment = this.examReportForm.value.examConductComment.toString().toLowerCase() === 'yes'? true : false;
    this.requestObj.examConductCommentRemark = this.examReportForm.value.examConductCommentRemark;
    // this.requestObj.CommentsOnlightFacilities = this.examReportForm.value.CommentsOnlightFacilities
    // this.requestObj.CommentsOnwaterFacilities = this.examReportForm.value.CommentsOnwaterFacilities;
    // this.requestObj.CommentsOndiscipline = this.examReportForm.value.CommentsOndiscipline;
    // this.requestObj.CommentsOntoiletFacilities = this.examReportForm.value.CommentsOntoiletFacilities;
    
    this.requestObj.futureExamCenterComment = this.examReportForm.value.futureExamCenterComment.toString().toLowerCase() === 'yes'? true : false;
    this.requestObj.otherFutureExamSuggestions = this.examReportForm.value.otherFutureExamSuggestions;

    this.requestObj.flyingSquadDetails = JSON.stringify(this.examReportForm.value.flyingSquadDetails);
    this.requestObj.InstituteID = this.sSOLoginDataModel.InstituteID
    this.requestObj.EndTermID = this.sSOLoginDataModel.EndTermID
    this.requestObj.CourseType = this.sSOLoginDataModel.Eng_NonEng
    this.requestObj.UserID = this.sSOLoginDataModel.UserID
    this.requestObj.ExamDate = this.ExamDate

    
    this.CenterSuperitendentService.SaveData_CenterSuperitendentExamReport(this.requestObj).then(
      (response: any) => {
        
        if (response.State === EnumStatus.Success) {
          this.toastr.success(response.Message)
          console.log('Report submitted successfully');
          // Optionally reset the form or show a success message
          this.onCancel();
        } else {
          console.error('Error submitting report:', response.ErrorMessage);
          this.toastr.error(response.ErrorMessage);
        }
      },
      (error: any) => {
        console.error('Error submitting report:', error);
        // Handle error response
      }
    );

    // const formData = new FormData();

    // Object.keys(this.examReportForm.controls).forEach(key => {
    //   const control = this.examReportForm.get(key);
    //   if (control && control.value instanceof File) {
    //     formData.append(key, control.value);
    //   } else if (Array.isArray(control?.value)) {
    //     formData.append(key, JSON.stringify(control.value));
    //   } else {
    //     formData.append(key, control?.value);
    //   }
    // });

    console.log('Form Submitted:', this.examReportForm.value);
    console.log('Request Object:', this.requestObj);
    // You would send `formData` to your API here.
  }

  onCancel(): void {
    this.examReportForm.reset();
    while (this.examScheduleArray.length > 1) {
      this.examScheduleArray.removeAt(1);
    }
    while (this.flyingSquadArray.length > 1) {
      this.flyingSquadArray.removeAt(1);
    }
  }


  public file!: File;
  async onFilechange(event: any, Type: string) {
    try {
      this.file = event.target.files[0];
      if (this.file) {
        if (this.file.type == 'image/jpeg' || this.file.type == 'image/jpg' || this.file.type == 'image/png' || this.file.type == 'application/pdf') {
          //size validation
          if (this.file.size > 2000000) {
            this.toastr.error('Select less then 2MB File')
            return
          }
          //if (this.file.size < 100000) {
          //  this.toastr.error('Select more then 100kb File')
          //  return
          //}
        }
        else {// type validation
          this.toastr.error('Select Only jpeg/jpg/png file')
          return
        }
        // upload to server folder
        this.loaderService.requestStarted();

        await this.commonFunctionService.UploadDocument(this.file)
          .then((data: any) => {
            debugger;
            data = JSON.parse(JSON.stringify(data));

            this.State = data['State'];
            this.Message = data['Message'];
            this.ErrorMessage = data['ErrorMessage'];

            if (this.State == EnumStatus.Success) {
              if (Type == "markingGuidanceDocument") {
                this.requestObj.markingGuidanceDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "changeSizeOfUnitsDocument"){
                this.requestObj.changeSizeOfUnitsDocument = data['Data'][0]["FileName"];
              }
              else if (Type == "incidentOnExamDocument"){
                this.requestObj.incidentOnExamDocument = data['Data'][0]["FileName"]; 
              }
              else if (Type == "ExamCenterCommentDocument"){
                this.requestObj.ExamCenterCommentDocument = data['Data'][0]["FileName"];
              }
              // event.target.value = null;
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

  // generatePDF(id: number = 0) {
  //   debugger
  //     try {
  //       this.loaderService.requestStarted();
  //       this.CenterSuperitendentService.GetByID(this.Id)
  //       .then((data: any) => {
  //           //data=JSON.parse(JSON.stringify(data));
  //           debugger
  //           data = data['Data'] || [];;
  //           console.log(data);
  //           data = data[0];
  //           console.log(data);
  //          data.examSchedule = JSON.parse(data.examSchedule);
  //           data.flyingSquadDetails = JSON.parse(data.flyingSquadDetails);

  //           pdfmake.fonts = {
  //             NotoSansDevanagari: {
  //               normal: 'NotoSansDevanagari-Regular.ttf',
  //               bold: 'NotoSansDevanagari-Bold.ttf'
  //             },
  //             Roboto: {
  //               normal: 'Roboto-Regular.ttf',
  //               bold: 'Roboto-Bold.ttf'
  //             }
  //           }
  //          let dateBody = [];
  //           dateBody.push(['दिनांक', 'प्रारंभ होने का समय', 'समाप्त होने का समय']);
  //           data.examSchedule.forEach((schedule: any) => {
  //             if(schedule.examDate && schedule.startTime && schedule.endTime) {
  //             dateBody.push([schedule.examDate, schedule.startTime, schedule.endTime]);
  //             }
  //           });
  //           console.log(dateBody);
  //           let dateBody1 = [];
  //           dateBody1.push(['क्रम सख्या', 'फ्लाईंग के आने की दिनांक व ठहरनें की समयावधी', 'फ्लाईग टीम के प्रभारी का नाम ,पद व वाहन संख्या']);
  //           data.flyingSquadDetails.forEach((schedule: any) => {
  //             if(schedule.serialNumber && schedule.visitDate && schedule.duration && schedule.inchargeName && schedule.inchargePosition && schedule.vehicleNumber ) 
  //             {
  //               const visitInfo = `${schedule.visitDate || ''}, ${schedule.duration || ''}`;
  //               const inchargeInfo = `${schedule.inchargeName || ''}, ${schedule.inchargePosition || ''}, ${schedule.vehicleNumber || ''}`;
  //               dateBody1.push([schedule.serialNumber, {text :visitInfo, font: 'Roboto'}, {text :inchargeInfo, font: 'Roboto'}]);
  //             }
  //           });
  //           console.log(dateBody1);
  //           const docDefinition = {
  //             content: [
  //               {
  //                 text: 'प्रायोगिक परीक्षा केन्द्रों हेतु केन्द्र अधीक्षक द्वारा भेजी जाने वाली रिपोर्ट का प्रपत्र (राजकीय नोडल आई.टी.आई. को प्रेषित की जावे): - ',
  //                 bold: true,
  //                 fontSize: 14,
  //                 decoration: 'underline',
  //                 margin: [0, 0, 0, 5] // optional spacing below the text
  //               },
  //               {
  //                 ol: [
  //                   this.fontsService.checkStringHaveEnglish(data.confidentialityLevel) ? {
  //                     text:[
  //                       { text: 'गोपनीयता व निष्पक्षता का स्तर। ', font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
  //                       { text: data.confidentialityLevel, font: 'Roboto', fontSize: 12, margin: [0, 0, 0, 5] }
  //                     ]
  //                   }:{ text: 'गोपनीयता व निष्पक्षता का स्तर। '+ data.confidentialityLevel, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
  //                   { text: `परीक्षाऐं आयोजन का समय (क्या परीक्षाएँ सामान्य कार्य घण्टों से अधिक समय में आयोजित की गई है) । ${this.englishToHindiTranslation[data.examOnTime]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
                    
  //                     'परीक्षाऐं कितने दिनों तक आयोजित की गई (परीक्षाओं के आयोजन का समय का विवरण)।'
  //                     ]
  //                   },
  //                   dateBody.length > 1 ? {
  //                     style: 'tableExample',
  //                     table: {
  //                       widths: ['*', '*', '*'],
  //                       body: dateBody
  //                     }
  //                   }:{},
  //                   {
  //                     start: 4,
  //                     ol : [
  //                         {text:`कया मूल्यांकन के दौरान मार्किंग निर्देशों की पालना की गई है। ${this.englishToHindiTranslation[data.markingGuidance]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
  //                         {text: `क्या प्रत्यके ईकाई के लिये निर्देशानुसार जाब की साईज में परिवर्तन कर जॉब को भिन्न बताया गया है यदि हां तो विविरण संलग्न करें। ${this.englishToHindiTranslation[data.changeSizeOfUnits]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
  //                         {text: 'परीक्षा केन्द्र पर अन्य व्यवस्थाऐ ।', font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]}
  //                     ]
  //                   },
  //                   {text: `प्रकाश व्यवस्था: ${this.englishToHindiTranslation[data.lightFacilities]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
  //                   {text: `पानी की व्यवस्था: ${this.englishToHindiTranslation[data.waterFacilities]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
  //                   {text: `अनुशासन: ${this.englishToHindiTranslation[data.discipline]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
  //                   {text: `शौचालय की व्यवस्था: ${this.englishToHindiTranslation[data.toiletFacilities]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5] },
  //                   {
  //                     start : 7,
  //                     ol : [
  //                       {text: `परीक्षा के दौरान घटित घटना जिससे परीक्षा की निष्पक्षता व गोपनीयता प्रभावित हुई हो। ${this.englishToHindiTranslation[data.incidentOnExam]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
  //                       {text: `परीक्षा संचालन बाबत् समग्र टिप्पणी। ${this.englishToHindiTranslation[data.examConductComment]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
  //                       {text: `भविष्य में संबन्धित संस्थान को परीक्षा केन्द्र बनाये जाने बाबत् टिप्पणी। ${this.englishToHindiTranslation[data.examConductComment]}`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]},
  //                       {text: [
  //                         `अन्य कोई सुझाव जो भविष्य में परीक्षा आयोजन हेतु लाभप्रद हो। `,
  //                         {text: data.otherFutureExamSuggestions, font: 'Roboto', fontSize: 12, margin: [0, 0, 0, 5]}
  //                       ]},
  //                       {text: `आपके परीक्षा केंद्र को फ्लाईंग द्वारा कब कब चैक किया गया (नीचे दिये अनुसार विवरण देवें)`, font: 'NotoSansDevanagari', fontSize: 12, margin: [0, 0, 0, 5]}
  //                     ]
  //                   },
  //                   dateBody1.length > 1 ? {
  //                     style: 'tableExample',
  //                     table: {
  //                       widths: ['auto', 'auto', '*'],
  //                       body: dateBody1
  //                     }
  //                   }:{},

  //             ],
  //             defaultStyle: {
  //               font: 'NotoSansDevanagari',
  //               lineHeight: 1.5,
  //             },
  //             styles: {
  //               tableExample: {
  //               margin: [15, 2, 15, 2]
  //             },
  //             }
  //           };
  
  
  
  
  //           pdfmake.createPdf(docDefinition as any).open();
  //           // pdfmake.createPdf(docDefinition as any).open('ITICenterSuperitendentExamReport.pdf');
  
  //           //pdfmake.createPdf(docDefinition as any).download('RelievingForm.pdf');
  
  //         })
  //     }
  //     catch (ex) {
  //       console.log(ex);
  //     }
  //     finally {
  //       setTimeout(() => {
  //         this.loaderService.requestEnded();
  //       }, 200);
  //     }
  // }

  async fillFormById(id: number = 0){
      debugger
      try {
        this.loaderService.requestStarted();
        this.CenterSuperitendentService.GetByID(id)
        .then((data: any) => {
            //data=JSON.parse(JSON.stringify(data));
            if(data['Data'] === null){
             this.toastr.error('No data found for the given ID');
              this.router.navigate(['center-superitendent-exam-report']);
            }
            data = data['Data'] || [];;
            console.log(data);
            data = data[0];
            console.log(data);
           data.examSchedule = JSON.parse(data.examSchedule);
            data.flyingSquadDetails = JSON.parse(data.flyingSquadDetails);

            // Adjust examSchedule FormArray
            const examScheduleArray = this.examScheduleArray;
            while (examScheduleArray.length < data.examSchedule.length) {
              examScheduleArray.push(this.createExamScheduleGroup());
            }
            while (examScheduleArray.length > data.examSchedule.length) {
              examScheduleArray.removeAt(examScheduleArray.length - 1);
            }

            // Adjust flyingSquadDetails FormArray
            const flyingSquadArray = this.flyingSquadArray;
            while (flyingSquadArray.length < data.flyingSquadDetails.length) {
              flyingSquadArray.push(this.createFlyingSquadGroup());
            }
            while (flyingSquadArray.length > data.flyingSquadDetails.length) {
              flyingSquadArray.removeAt(flyingSquadArray.length - 1);
            }

            // Now patch the form
            this.examReportForm.patchValue(data);
            
          })
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


  handleRadioChange(controlName: string)
  {
 
  const control = this.examReportForm.get(controlName);
  if (control) {
    if (control.value === 'no') {
      control.setValidators([Validators.required]);
      if(controlName=='examOnTime'){
        this.examReportForm.get('examOnTimeRemark')?.setValidators([Validators.required]);
      }
      if(controlName=='markingGuidance'){
        this.examReportForm.get('markingGuidanceRemark')?.setValidators([Validators.required]);
      }
      if(controlName=='changeSizeOfUnits'){
        this.examReportForm.get('changeSizeOfUnitsRemark')?.setValidators([Validators.required]);
      }
      if(controlName=='incidentOnExam'){
        this.examReportForm.get('incidentOnExamRemark')?.setValidators([Validators.required]);
      }
      if(controlName=='examConductComment'){
        this.examReportForm.get('examConductCommentRemark')?.setValidators([Validators.required]);
      }
    } else {
      control.clearValidators();
      if(controlName=='examOnTime'){
        this.examReportForm.get('examOnTimeRemark')?.clearValidators();
      }
      if(controlName=='markingGuidance'){
        this.examReportForm.get('markingGuidanceRemark')?.clearValidators();
      }
      if(controlName=='changeSizeOfUnits'){
        this.examReportForm.get('changeSizeOfUnitsRemark')?.clearValidators();
      }
      if(controlName=='incidentOnExam'){
        this.examReportForm.get('incidentOnExamRemark')?.clearValidators();
      }
      if(controlName=='examConductComment'){
        this.examReportForm.get('examConductCommentRemark')?.clearValidators();
      }
    }
    control.updateValueAndValidity();
    this.examReportForm.get('examOnTimeRemark')?.updateValueAndValidity();
    this.examReportForm.get('markingGuidanceRemark')?.updateValueAndValidity();
    this.examReportForm.get('changeSizeOfUnitsRemark')?.updateValueAndValidity();
    this.examReportForm.get('incidentOnExamRemark')?.updateValueAndValidity();
    this.examReportForm.get('examConductCommentRemark')?.updateValueAndValidity();
  }
}

 

}
