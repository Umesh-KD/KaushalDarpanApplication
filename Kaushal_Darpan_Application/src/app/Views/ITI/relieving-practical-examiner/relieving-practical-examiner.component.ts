import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppsettingService } from '../../../Common/appsetting.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { ITIExaminerRelievingModel } from '../../../Models/ITI/ITIRelievingFormModel';
import { ITIRelievingExamService } from '../../../Services/ITI/ITIRelieveingExam/iti-relieveing-exam.service';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { ToastrService } from 'ngx-toastr';
import { EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { ActivatedRoute, Router } from '@angular/router';
import { ItiTradeSearchModel } from '../../../Models/CommonMasterDataModel';
import pdfmake from 'pdfmake/build/pdfmake';
import { FontsService } from '../../../Services/FontService/fonts.service';


@Component({
  selector: 'app-relieving-practical-examiner',
  standalone: false,
  templateUrl: './relieving-practical-examiner.component.html',
  styleUrl: './relieving-practical-examiner.component.css'
})
export class RelievingPracticalExaminerComponent implements OnInit {
  RelievingPracticalForm!: FormGroup;
  NCVTPracticalExamList: string[] = ['August 2025', 'December 2025', 'April 2026'];
  // NCVTPracticalExamList: any[] = [];

  //TradeList: any[] = [];
  PracticalExamCentreList: string[] = ['201 - Center Name', '202 - Another Center', '203 - Third Center'];
  request: ITIExaminerRelievingModel = new ITIExaminerRelievingModel();
  InstituteID: number = 2252;
  public Message: any = [];
  public ErrorMessage: any = [];
  public State: number = -1;
  public isLoading: boolean = false;
  public isSubmitted: boolean = false;
  public sSOLoginDataModel = new SSOLoginDataModel();
  public ExaminerID: number = 0
  public tradeSearchRequest = new ItiTradeSearchModel()



  public TradeList: any = [];
  constructor(
    private commonFunctionService: CommonFunctionService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    public appsettingConfig: AppsettingService,
    private loaderService: LoaderService,
    public itiRelievingExamService: ITIRelievingExamService,
    public fontsSerive: FontsService,

    private Activeroute: ActivatedRoute,

    private router: Router,
  ) { }

  async ngOnInit() {
    this.loaderService.requestStarted();
    this.RelievingPracticalForm = this.formBuilder.group({
      NCVTPracticalExam: ['', Validators.required],
      DateOfExamination: ['', Validators.required],
      Trade: ['0', Validators.required],
      PracticalExamCentre: ['', Validators.required],
      PracticalExaminerName: ['', Validators.required],
      PracticalExaminerDesignation: ['', Validators.required],
      PracticalExaminerNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.MobileNumberPattern)]],
      NoOfTotalTrainees: ['', [Validators.required, Validators.min(0)]],
      NoOfPrsentTrainees: ['', [Validators.required, Validators.min(0)]],
      NoOfAbsentTrainees: ['', [Validators.required, Validators.min(0)]],
      marckSheetPacket: ['', Validators.required],
      CopyPacket: ['', Validators.required],
      PracticalPacket: ['', Validators.required],
      PracticalTeacherPacket: ['', Validators.required],
      sealedPacket: ['', Validators.required],
      billPacket: ['', Validators.required],
      OtherInfo: ['', Validators.required],
      OtherInfoText: [''],
    });

    this.RelievingPracticalForm.get('OtherInfo')?.valueChanges.subscribe((isRequired: string) => {
      const remarksControl = this.RelievingPracticalForm.get('OtherInfoText');
      if (isRequired == 'Yes') {
        remarksControl?.setValidators([Validators.required]);
      } else {
        remarksControl?.clearValidators();
      }
      remarksControl?.updateValueAndValidity();
    });
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.ExaminerID = Number(this.Activeroute.snapshot.queryParamMap.get('id')?.toString())
    if (this.ExaminerID > 0) {
      await this.GetById();

    }
    this.loaderService.requestEnded();

    this.GetTradeListDDL();
    //await this.GetTradeDDL()
  }

  get _form() { return this.RelievingPracticalForm.controls; }
  async GetTradeDDL() {
    try {
      this.loaderService.requestStarted();
      //await this.ItiTradeService.GetAllData(this.searchTradeRequest)

      await this.commonFunctionService.StreamMaster(this.sSOLoginDataModel.DepartmentID, this.sSOLoginDataModel.Eng_NonEng, this.sSOLoginDataModel.EndTermID)
        .then((data: any) => {
          console.log(data)
          data = JSON.parse(JSON.stringify(data));
          this.TradeList = data['Data'];
          console.log(this.TradeList)
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


  get form() { return this.RelievingPracticalForm.controls; }

  async onSubmit() {
    console.log('Form submitted:', this.RelievingPracticalForm.value);
    this.isLoading = true;
    this.isSubmitted = true;
    //Show Loading
    this.loaderService.requestStarted();

    try {
      if (this.RelievingPracticalForm.valid) {
        // Handle form submission logic here

        debugger;
        console.log('Form submitted successfully:', this.RelievingPracticalForm.value);
        this.request.CopyPacket = this.RelievingPracticalForm.value.CopyPacket === 'Yes' ? true : false;
        this.request.DateOfExamination = this.RelievingPracticalForm.value.DateOfExamination;
        this.request.MarckSheetPacket = this.RelievingPracticalForm.value.marckSheetPacket == 'Yes' ? true : false;
        this.request.NCVTPracticalExam = this.RelievingPracticalForm.value.NCVTPracticalExam;
        this.request.NoOfAbsentTrainees = this.RelievingPracticalForm.value.NoOfAbsentTrainees;
        this.request.NoOfPrsentTrainees = this.RelievingPracticalForm.value.NoOfPrsentTrainees;
        this.request.NoOfTotalTrainees = this.RelievingPracticalForm.value.NoOfTotalTrainees;
        this.request.OtherInfo = this.RelievingPracticalForm.value.OtherInfo == 'Yes' ? true : false;
        this.request.OtherInfoText = this.RelievingPracticalForm.value.OtherInfoText;
        this.request.PracticalExamCentre = this.RelievingPracticalForm.value.PracticalExamCentre;
        this.request.PracticalExaminerDesignation = this.RelievingPracticalForm.value.PracticalExaminerDesignation;
        this.request.PracticalExaminerName = this.RelievingPracticalForm.value.PracticalExaminerName;
        this.request.PracticalExaminerNumber = this.RelievingPracticalForm.value.PracticalExaminerNumber;
        this.request.PracticalPacket = this.RelievingPracticalForm.value.PracticalPacket == 'Yes' ? true : false;
        this.request.PracticalTeacherPacket = this.RelievingPracticalForm.value.PracticalTeacherPacket == 'Yes' ? true : false;
        this.request.SealedPacket = this.RelievingPracticalForm.value.sealedPacket == 'Yes' ? true : false;
        this.request.BillPacket = this.RelievingPracticalForm.value.billPacket == 'Yes' ? true : false;
        this.request.Trade = this.RelievingPracticalForm.value.Trade;
        this.request.ModifyBy = this.sSOLoginDataModel.UserID.toString();
        this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID.toString();
        this.request.CenterAssignedID = this.ExaminerID;

        await this.itiRelievingExamService.SaveRelievingExaminerData(this.request)
          .then((response: any) => {
            this.State = response['State'];
            this.Message = response['Message'];
            this.ErrorMessage = response['ErrorMessage'];

            if (this.State == EnumStatus.Success && response['Data'][0]['msg'] === 'Success')
            {
              this.toastr.success(this.Message);
              setTimeout(() => {
                this.router.navigate(['/PracticalExaminerRelieving']);
              }, 300);
            }
            else {
              this.toastr.error(this.ErrorMessage)
            }
            console.log('Response from service:', response);
          });
        console.log('Request Data:', this.request);
      } else {
        console.log('Form is invalid');
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



  onTradeChange(event: any) {
    //const selectedTrade = event.target.value;
    //let index = this.TradeList.indexOf(selectedTrade);
    //this.RelievingPracticalForm.patchValue({PracticalExamCentre: this.PracticalExamCentreList[index] || ''});
    //console.log('Selected Trade:', selectedTrade);
    // You can add logic here to handle changes based on the selected trade
  }


  // get detail by id
  async GetById() {
    try {

      this.loaderService.requestStarted();
      await this.itiRelievingExamService.GetByID(this.ExaminerID)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          debugger
          this.request = data['Data'][0];
          this.request.NoOfPrsentTrainees = data['Data'][0]['NoOfPresentTrainees'];
     /*     this.request.PracticalExaminerName = data['Data'][0]['ExaminerName'];*/
          /*  console.log(data['Data'][0]['NoOfAbsentTrainees'])*/
          this.RelievingPracticalForm.patchValue({
            CopyPacket: this.request?.CopyPacket ? 'Yes' : 'No',
            DateOfExamination: this.request?.DateOfExamination ?? '',
            marckSheetPacket: this.request?.MarckSheetPacket ? 'Yes' : 'No',
            NCVTPracticalExam: this.request?.NCVTPracticalExam ?? '',
            NoOfAbsentTrainees: this.request?.NoOfAbsentTrainees ?? 0,
            NoOfPrsentTrainees: this.request?.NoOfPrsentTrainees ?? 0,  // spelling fixed
            NoOfTotalTrainees: this.request?.NoOfTotalTrainees ?? 0,
            OtherInfo: this.request?.OtherInfo ? 'Yes' : 'No',
            OtherInfoText: this.request?.OtherInfoText ?? '',
            PracticalExamCentre: this.request?.PracticalExamCentre ?? '',
            PracticalExaminerDesignation: this.request?.PracticalExaminerDesignation ?? '',
            PracticalExaminerName: this.request?.PracticalExaminerName ?? '',
            PracticalExaminerNumber: this.request?.PracticalExaminerNumber ?? '',
            PracticalPacket: this.request?.PracticalPacket ? 'Yes' : 'No',
            PracticalTeacherPacket: this.request?.PracticalTeacherPacket ? 'Yes' : 'No',
            sealedPacket: this.request?.SealedPacket ? 'Yes' : 'No',
            billPacket: this.request?.BillPacket ? 'Yes' : 'No',
            Trade: this.request?.Trade ?? ''
          });

          console.log(this.RelievingPracticalForm.value)
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

  validateNumber(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!/^[0-9]$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }


  numberOnly(event: KeyboardEvent): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {

      return false;

    }

    return true;

  }



  async GetTradeListDDL() {

    try {
      this.loaderService.requestStarted();
      this.tradeSearchRequest.action = "_getAllData"
      await this.commonFunctionService.TradeListGetAllData(this.tradeSearchRequest).then((data: any) => {
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

  async generatePDF(id: number = 0)
  {
    debugger
    try {
      this.loaderService.requestStarted();
      this.itiRelievingExamService.GetByID(1)
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
            { label: 'क्या मार्किंग शीट का लिफाफा सं. 01 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है:', value: data['MarckSheetPacket'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा कॉपियों का लिफाफा व प्रायोगिक जॉब सं. 02 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है :', value: data['CopyPacket'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा का पर्णप्रति पर्ण का लिफाफा सं. 03 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है :', value: data['PracticalPacket'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक द्वारा मानदेय का लिफाफा सं. 04 प्रायोगिक परीक्षक द्वारा जमा करा दिया गया है :', value: data['PracticalTeacherPacket'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक द्वारा प्रेक्टिकल के जॉब शील बन्द बौरे में जमा करा दिये गये है :', value: data['SealedPacket'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक को उसके मानदेय रूपये रूपये का भुगतान कर दिया गया है/ उसका मानदेय बिल के भुगतान हेतु सत्यापित कर दिया गया है :', value: data['BillPacket'], isBold: false },
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
              {
                text: 'प्रायोगिक परीक्षक को रिलीव करते समय नोडल अधिकारी / कोर्डिनेटर द्वारा तैयार की जाने वाली चेक पॉईन्ट की सूची (तीन प्रतियों में प्रत्येक प्रायोगिक परीक्षक हेतु अलग-अलग तैयार की जाए)',
                bold: true,
                fontSize: 14,
                decoration: 'underline',
                margin: [0, 0, 0, 5] // optional spacing below the text
              },
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1 }
                ],
                margin: [0, 0, 0, 10] // spacing after the line
              },
              {
                ol: dynamicContent
              }
            ],
            defaultStyle: {
              font: 'NotoSansDevanagari',
              lineHeight: 1.5,
            }
          };





          pdfmake.createPdf(docDefinition as any).download('RelievingForm.pdf');

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


}
