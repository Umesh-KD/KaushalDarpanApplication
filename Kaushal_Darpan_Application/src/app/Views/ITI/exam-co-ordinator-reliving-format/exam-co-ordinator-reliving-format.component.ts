import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { AppsettingService } from '../../../Common/appsetting.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { ITIRelievingExamService } from '../../../Services/ITI/ITIRelieveingExam/iti-relieveing-exam.service';
import { ITICoordinatorRelievingForm } from '../../../Models/ITI/ITIRelievingFormModel';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import { CommonFunctionHelper } from '../../../Common/commonFunctionHelper';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import pdfmake from 'pdfmake/build/pdfmake';
import { FontsService } from '../../../Services/FontService/fonts.service';

@Component({
  selector: 'app-exam-co-ordinator-reliving-format',
  standalone: false,
  templateUrl: './exam-co-ordinator-reliving-format.component.html',
  styleUrl: './exam-co-ordinator-reliving-format.component.css'
})
export class ExamCoOrdinatorRelivingFormatComponent {
  ExamCoOrdinatorRelivingForm!: FormGroup;
  NCVTPracticalExamList: string[] = ['August 2025', 'December 2025', 'April 2026'];
  //TradeList: string[] = ['Trade 1', 'Trade 2', 'Trade 3'];
  PracticalExamCentreList: string[] = ['201 - Center Name', '202 - Another Center', '203 - Third Center'];
  public Message: any = [];
  public ErrorMessage: any = [];
  public TradeList: any = [];
  public State: number = -1;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  request: ITICoordinatorRelievingForm = new ITICoordinatorRelievingForm();
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ExaminerCoordinatorID: number = 0
  public tradeSearchRequest = new ItiTradeSearchModel()

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    public appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    public itiRelievingExamService: ITIRelievingExamService,
    private Activeroute: ActivatedRoute,
    private commonMasterService: CommonFunctionService,
    private fontsSerive: FontsService,
    private router: Router,

  ) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    this.ExamCoOrdinatorRelivingForm = this.formBuilder.group({
      NCVTPracticalExam: ['', Validators.required],
      DateOfExamination: ['', Validators.required],
      Trade: ['', Validators.required],
      PracticalExamCentre: ['', Validators.required],
      PracticalSuperintendentName: ['', Validators.required],
      PracticalSuperintendentNumber: ['', Validators.required],
      PracticalCoOrdinatorName: ['', Validators.required],
      PracticalCoOrdinatorDesignation: ['', Validators.required],
      PracticalCoOrdinatorNumber: ['', Validators.required],
      NoOfRegisteredInstitutes: ['', [Validators.required, Validators.min(0)]],
      DetailsOfPresentExaminers: ['', [Validators.required, Validators.min(0)]],
      isMarkingSheetEnvelopeSubmitted: ['', [Validators.required, Validators.min(0)]],
      isCopyEnvelopeJob2Submitted: ['', Validators.required],
      isPracticalCopyEnvelopeSubmitted: ['', Validators.required],
      isHonorariumEnvelopeSubmitted: ['', Validators.required],
      isSealedPracticalJobsSubmitted: ['', Validators.required],
      isCenterReportAttached: ['', Validators.required],
      isHonorariumPaidOrVerified: ['', Validators.required],
      honorariumAmount: ['', Validators.required],
      OtherInfo: ['', Validators.required],
      AdditionalExaminerRemarksSubmitted: [''],
      OtherInfoText: ['', Validators.required]

    });

    this.GetTradeListDDL();

    this.ExamCoOrdinatorRelivingForm.get('OtherInfo')?.valueChanges.subscribe((isRequired: string) => {
      const remarksControl = this.ExamCoOrdinatorRelivingForm.get('OtherInfoText');
      if (isRequired == 'Yes') {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ExaminerCoordinatorID = Number(this.Activeroute.snapshot.queryParamMap.get('id')?.toString());
    if (this.ExaminerCoordinatorID > 0) {
      await this.GetByExamCoordinatorId();
    }
    this.loaderService.requestEnded();



  }


  get form() { return this.ExamCoOrdinatorRelivingForm.controls; }
  async onSubmit() {
    console.log(this.ExamCoOrdinatorRelivingForm.value);
    console.log(this.sSOLoginDataModel.UserID);
    this.isLoading = true;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();
    try
    {
      if (this.ExamCoOrdinatorRelivingForm.valid)
      {
        this.loaderService.requestStarted();
        this.request = this.ExamCoOrdinatorRelivingForm.value;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID.toString();
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID.toString();
        this.request.NCVTPracticalExam = this.ExamCoOrdinatorRelivingForm.value.NCVTPracticalExam;
        this.request.DateOfExamination = this.ExamCoOrdinatorRelivingForm.value.DateOfExamination;
        this.request.Trade = this.ExamCoOrdinatorRelivingForm.value.Trade;
        this.request.PracticalExamCentre = this.ExamCoOrdinatorRelivingForm.value.PracticalExamCentre;
        this.request.PracticalSuperintendentName = this.ExamCoOrdinatorRelivingForm.value.PracticalSuperintendentName;
        this.request.PracticalSuperintendentNumber = this.ExamCoOrdinatorRelivingForm.value.PracticalSuperintendentNumber;
        this.request.PracticalCoOrdinatorName = this.ExamCoOrdinatorRelivingForm.value.PracticalCoOrdinatorName;
        this.request.PracticalCoOrdinatorDesignation = this.ExamCoOrdinatorRelivingForm.value.PracticalCoOrdinatorDesignation;
        this.request.PracticalCoOrdinatorNumber = this.ExamCoOrdinatorRelivingForm.value.PracticalCoOrdinatorNumber;
        this.request.NoOfRegisteredInstitutes = this.ExamCoOrdinatorRelivingForm.value.NoOfRegisteredInstitutes;
        this.request.DetailsOfPresentExaminers = this.ExamCoOrdinatorRelivingForm.value.DetailsOfPresentExaminers;
        this.request.isMarkingSheetEnvelopeSubmitted = this.ExamCoOrdinatorRelivingForm.value.isMarkingSheetEnvelopeSubmitted === 'Yes' ? true : false;
        this.request.isCopyEnvelopeJob2Submitted = this.ExamCoOrdinatorRelivingForm.value.isCopyEnvelopeJob2Submitted === 'Yes' ? true : false;
        this.request.isPracticalCopyEnvelopeSubmitted = this.ExamCoOrdinatorRelivingForm.value.isPracticalCopyEnvelopeSubmitted === 'Yes' ? true : false;
        this.request.isHonorariumEnvelopeSubmitted = this.ExamCoOrdinatorRelivingForm.value.isHonorariumEnvelopeSubmitted === 'Yes' ? true : false;
        this.request.isSealedPracticalJobsSubmitted = this.ExamCoOrdinatorRelivingForm.value.isSealedPracticalJobsSubmitted === 'Yes' ? true : false;
        this.request.isCenterReportAttached = this.ExamCoOrdinatorRelivingForm.value.isCenterReportAttached === 'Yes' ? true : false;
        this.request.isHonorariumPaidOrVerified = this.ExamCoOrdinatorRelivingForm.value.isHonorariumPaidOrVerified === 'Yes' ? true : false;
        this.request.HonorariumAmount = this.ExamCoOrdinatorRelivingForm.value.honorariumAmount;

        this.request.Remarks = this.ExamCoOrdinatorRelivingForm.value.OtherInfoText;
        this.request.OtherInfo = this.ExamCoOrdinatorRelivingForm.value.OtherInfoText != '' ? 'Yes' : 'NO';
     

        this.request.AdditionalExaminerRemarksSubmitted = this.ExamCoOrdinatorRelivingForm.value.AdditionalExaminerRemarksSubmitted;
        this.request.ExamCoordinatorID = this.ExaminerCoordinatorID;
        console.log('Request:', this.request);
        // try {
        await this.itiRelievingExamService.SaveRelievingCoOrdinatorData(this.request)
          .then((response: any) => {
            this.State = response['State'];
            this.Message = response['Message'];
            this.ErrorMessage = response['ErrorMessage'];
            if (this.State = EnumStatus.Success)
            {
              this.toastr.success(this.Message);

              setTimeout(() => {
                this.router.navigate(['/CenterExamCoordinator']);
              }, 1000); // redirects after 3 seconds
              
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
            console.log('Response from service:', response);
          });
        console.log('Request Data:', this.request);
        // Handle success response
        // } catch (error) {
        //   console.error('Error:', error);
        //   // Handle error response
        // } finally {
        //   this.loaderService.requestEnded();
        // }
        //   } else {
        //     console.log('Form is invalid');
        //   }
      }
    }

    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
        this.isLoading = false;

      }, 200);
    }

  }

  // Get detail by ExamCoordinator ID
  async GetByExamCoordinatorId() {
    if (!this.ExaminerCoordinatorID || this.ExaminerCoordinatorID === 0) {
      console.warn("ExaminerCoordinatorID is missing or invalid.");
      return;
    }

    this.loaderService.requestStarted();

    try {
      const response: any = await this.itiRelievingExamService.GetByExamCoordinatorId(this.ExaminerCoordinatorID);
      debugger
      if (response && response.Data && response.Data.length > 0) {
        this.request = response.Data[0];
        this.request.PracticalCoOrdinatorName = response.Data[0]['ExamCoordinatorName'];
        this.request.PracticalCoOrdinatorDesignation = response.Data[0]['PracticalCoOrdinatorDesignation1'];


        this.ExamCoOrdinatorRelivingForm.patchValue({
          NCVTPracticalExam: this.request.NCVTPracticalExam,
          DateOfExamination: this.request.DateOfExamination,
          Trade: this.request.Trade,
          PracticalExamCentre: this.request.PracticalExamCentre,
          PracticalSuperintendentName: this.request.PracticalSuperintendentName,
          PracticalSuperintendentNumber: this.request.PracticalSuperintendentNumber,
          PracticalCoOrdinatorName: this.request.PracticalCoOrdinatorName,
          PracticalCoOrdinatorDesignation: this.request.PracticalCoOrdinatorDesignation,
          PracticalCoOrdinatorNumber: this.request.PracticalCoOrdinatorNumber,
          NoOfRegisteredInstitutes: this.request.NoOfRegisteredInstitutes,
          DetailsOfPresentExaminers: this.request.DetailsOfPresentExaminers,
          isMarkingSheetEnvelopeSubmitted: this.request.isMarkingSheetEnvelopeSubmitted ? 'Yes' : 'No',
          isCopyEnvelopeJob2Submitted: this.request.isCopyEnvelopeJob2Submitted ? 'Yes' : 'No',
          isPracticalCopyEnvelopeSubmitted: this.request.isPracticalCopyEnvelopeSubmitted ? 'Yes' : 'No',
          isHonorariumEnvelopeSubmitted: this.request.isHonorariumEnvelopeSubmitted ? 'Yes' : 'No',
          isSealedPracticalJobsSubmitted: this.request.isSealedPracticalJobsSubmitted ? 'Yes' : 'No',
          isCenterReportAttached: this.request.isCenterReportAttached ? 'Yes' : 'No',
          isHonorariumPaidOrVerified: this.request.isHonorariumPaidOrVerified ? 'Yes' : 'No',
          honorariumAmount: this.request.HonorariumAmount,
          OtherInfo: this.request.OtherInfo,
          AdditionalExaminerRemarksSubmitted: this.request.AdditionalExaminerRemarksSubmitted,
          OtherInfoText: this.request.Remarks
        });

        console.log("Form after patch:", this.ExamCoOrdinatorRelivingForm.value);
      } else {
        console.warn("No data found for the given ExaminerCoordinatorID.");
      }
    } catch (error) {
      console.error("Error fetching relieving coordinator data:", error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }





  onTradeChange(event: any) {
    const selectedTrade = event.target.value;
    let index = this.TradeList.indexOf(selectedTrade);
    this.ExamCoOrdinatorRelivingForm.patchValue({ PracticalExamCentre: this.PracticalExamCentreList[index] || '' });
    console.log('Selected Trade:', selectedTrade);
    // You can add logic here to handle changes based on the selected trade
  }



  async GetTradeListDDL() {
    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"

      await this.commonMasterService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
        const parsedData = JSON.parse(JSON.stringify(data));
        this.TradeList = parsedData.Data;
      })
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  numberOnly(event: KeyboardEvent): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  async generatePDF(id: number = 0) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.itiRelievingExamService.GetByID(id)
        .then((data: any) => {
          //data=JSON.parse(JSON.stringify(data));
          data = data['Data'] || [];;
          console.log(data);
          data = data[0];
          console.log(data);
          pdfmake.fonts = {
            NotoSansDevanagari: {
              normal: 'NotoSansDevanagari-Regular.ttf',
              bold: 'NotoSansDevanagari-Bold.ttf'
            },
            Roboto: {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Bold.ttf'
            }
          }
          const fieldMappings = [
            { label: 'एनसीवीटी प्रायोगिक परीक्षा:', value: data.NCVTPracticalExam, isBold: false },
            { label: 'परीक्षा की दिनांक:', value: data.DateOfExamination, isBold: false },
            { label: 'परीक्षा व्यवसाय:', value: data['Trade'], isBold: false },
            { label: 'प्रायोगिक परीक्षा केन्द्र की कोड संख्या व नाम:', value: data.PracticalExamCentre, isBold: false },
            { label: 'प्रायोगिक परीक्षक का नाम:', value: data.PracticalExaminerName, isBold: false },
            { label: 'प्रायोगिक परीक्षक का पद:', value: data['PracticalExaminerDesignation'], isBold: false },
            { label: 'प्रायोगिक परीक्षक का सर्पक नम्बर:', value: data['PracticalExaminerNumber'], isBold: false },
            { label: 'कुल पंजीकृत परीक्षार्थियों की संख्या:', value: data['NoOfTotalTrainees'], isBold: false },
            { label: 'उपस्थिति परीक्षार्थियों की संख्या:', value: data['NoOfPresentTrainees'], isBold: false },
            { label: 'अनुपस्थिति परीक्षार्थियों की संख्या:', value: data['NoOfAbsentTrainees'], isBold: false },
            { label: 'क्या मार्किंग शीट का लिफाफा सं. 01 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है:', value: data['MarckSheetPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा कॉपियों का लिफाफा व प्रायोगिक जॉब सं. 02 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है :', value: data['CopyPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा का पर्णप्रति पर्ण का लिफाफा सं. 03 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है :', value: data['PracticalPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक द्वारा मानदेय का लिफाफा सं. 04 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है :', value: data['PracticalTeacherPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक द्वारा प्रेक्टिकल के जॉब शील बन्द बौरे में जमा करा दिये गये है :', value: data['SealedPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक को उसके मानदेय रूपये रूपये का भुगतान कर दिया गया है/ उसका मानदेय बिल के भुगतान हेतु सत्यापित कर दिया गया है :', value: data['BillPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'प्रायोगिक परीक्षक बाबत् अन्य कोई टिप्पणी :', value: data['OtherInfo'], isBold: false },
            { label: 'अलग से शील्ड बन्द लिफाफे में प्रस्तुत करें :', value: data['OtherInfoText'], isBold: false }
          ];
          let dynamicContent = fieldMappings.map(field => {
            debugger
            const value1 = field.value ?? '';
            if (this.fontsSerive.checkStringHaveEnglish(value1)) {
              return {
                text: [
                  { text: `${field.label} `, font: 'NotoSansDevanagari', fontSize: 12, bold: field.isBold, margin: [0, 0, 0, 0] },
                  { text: value1, font: 'Roboto', fontSize: 12, bold: field.isBold, margin: [0, 0, 0, 0] }
                ]
              };
            }
            return { text: `${field.label} ${value1}`, font: 'NotoSansDevanagari', fontSize: 12, bold: field.isBold, margin: [0, 0, 0, 0] };
          });
          const docDefinition = {
            content: [
              { text: 'प्रायोगिक परीक्षक को रिलीव करते समय नोडल अधिकारी / कोर्डिनेटर द्वारा तैयार की जाने वाली चेक पॉईन्ट की सूची (तीन प्रतियों में प्रत्येक प्रायोगिक परीक्षक हेतु अलग-अलग तैयार की जाए)', bold: true, fontSize: 14 },
              { ol: dynamicContent }
            ],
            defaultStyle: {
              font: 'NotoSansDevanagari',
              lineHeight: 1.5,
            }
          };

          const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
          const fileName = `RelievingForm_${timestamp}.pdf`;
          pdfmake.createPdf(docDefinition as any).download(fileName);


          //pdfmake.createPdf(docDefinition as any).download('RelievingForm.pdf');

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

  onOtherInfoChange()
  {
    const selectedValue = this.ExamCoOrdinatorRelivingForm.value.OtherInfo;
    console.log('Selected Radio Value:', selectedValue);
    this.ExamCoOrdinatorRelivingForm.patchValue({
      OtherInfoText: ''
    });
        
  }

}
