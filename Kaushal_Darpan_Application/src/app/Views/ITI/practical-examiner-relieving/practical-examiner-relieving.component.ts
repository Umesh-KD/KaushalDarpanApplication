import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { CenterAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { VerifyRollNumberList } from '../../../Models/GenerateRollDataModels';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { ITICenterAllocationtDataModels } from '../../../Models/ITI/ITICenterAllocationDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { ItiAssignExaminerService } from '../../../Services/ITIAssignExaminer/iti-assign-examiner.service';
import { ItiAssignExaminerSearchModel, ITIPracticalExaminerSearchFilters } from '../../../Models/ITI/AssignExaminerDataModel';
import { ReportService } from '../../../Services/Report/report.service';
import { ActivatedRoute } from '@angular/router';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
import { FontsService } from '../../../Services/FontService/fonts.service';
import pdfmake from 'pdfmake/build/pdfmake';
import { ITIRelievingExamService } from '../../../Services/ITI/ITIRelieveingExam/iti-relieveing-exam.service';


@Component({
  selector: 'app-practical-examiner-relieving',
  standalone: false,
  templateUrl: './practical-examiner-relieving.component.html',
  styleUrl: './practical-examiner-relieving.component.css'
})
export class PracticalExaminerRelievingComponent {

  commonMasterService = inject(CommonFunctionService);

  Swal2 = inject(SweetAlert2);
  assignexaminerservice = inject(ItiAssignExaminerService);
  ActivatedRoute = inject(ActivatedRoute);
  

  itiRelievingExamService = inject(ITIRelievingExamService);


  fontsSerive = inject(FontsService);


  public requestSSoApi = new CommonVerifierApiDataModel();
  pdfMakeVfs: any = pdfmake.vfs || {};
  toastr = inject(ToastrService);
  reportservice = inject(ReportService);
  loaderService = inject(LoaderService);
  modalService = inject(NgbModal);
  http = inject(HttpClient);
  appsettingConfig = inject(AppsettingService);
  @ViewChild('content') content: ElementRef | any;
  State: number = -1;
  Message: any = [];
  ErrorMessage: any = [];
  isLoading: boolean = false;
  isSubmitted: boolean = false;
  assignedInstitutes: any = [];
  assignedInstitutesReady: boolean = false;
  closeResult: string | undefined;
  Table_SearchText: string = '';
  AssignExaminerMasterList: any[] = [];
  BackupCenterMasterList: any[] = [];
  searchRequest = new ITIPracticalExaminerSearchFilters();
  public CourseType: number = 0
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  request = new ITIAssignPracticaLExaminer();
  sSOLoginDataModel = new SSOLoginDataModel();

  SelectCenterMaster: any;
  GetStatusCenterSuperintendentData: any; UserID: number = 0;
  Status: number = 0
  PublishFileName: string = ''
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(...args: unknown[]);
  constructor() { }
  _EnumRole = EnumRole;
  async ngOnInit() {

    this.CourseType = Number(this.ActivatedRoute.snapshot.queryParamMap.get('id')?.toString())

    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.request.CourseTypeID = this.CourseType;

    /*   this.GetStatusCenterSuperintendent();*/
    if (this.sSOLoginDataModel.RoleID == 98 || this.sSOLoginDataModel.RoleID == 92) {
      await this.GetPracticalExaminerRelivingByUserId();
    } else {
      await this.GetAssignexaminer();
    }

    this.pdfMakeVfs['NotoSansDevanagari-Regular.ttf'] = await this.fontsSerive.getHindiFontRegular();
    this.pdfMakeVfs['NotoSansDevanagari-Bold.ttf'] = await this.fontsSerive.getHindiFontBold();
    this.pdfMakeVfs['Roboto-Regular.ttf'] = await this.fontsSerive.getEnglishFontRegular();
    this.pdfMakeVfs['Roboto-Bold.ttf'] = await this.fontsSerive.getHindiFontBold();
    pdfmake.vfs = this.pdfMakeVfs;
  }

  async GetAssignexaminer() {
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.CenterCode = this.searchByCenterCode
    this.searchRequest.CenterName = this.searchByCenterName



    try {
      this.loaderService.requestStarted();
      await this.assignexaminerservice.GetCenterPracticalexaminerReliving(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssignExaminerMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.AssignExaminerMasterList];
          console.log(data['Data'])
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }



  async GetPracticalExaminerRelivingByUserId() {
    this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
    this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng
    this.searchRequest.InstituteID = this.sSOLoginDataModel.InstituteID
    this.searchRequest.CenterCode = this.searchByCenterCode
    this.searchRequest.CenterName = this.searchByCenterName
    this.searchRequest.UserID = this.sSOLoginDataModel.UserID

    try {
      this.loaderService.requestStarted();
      await this.assignexaminerservice.GetPracticalExaminerRelivingByUserId(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AssignExaminerMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.AssignExaminerMasterList];
          console.log(data['Data'])
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  
  onSearchByRoleidClick() {
    if (this.sSOLoginDataModel.RoleID == 98 || this.sSOLoginDataModel.RoleID == 92) {
      this.GetPracticalExaminerRelivingByUserId();
    } else {
      this.GetAssignexaminer();
    }
  }


  onSearchClick() {
    const searchCriteria: any = {
      CCCode: this.searchByCenterCode ? this.searchByCenterCode.trim().toLowerCase() : '',
      CenterName: this.searchByCenterName.trim().toLowerCase(),
    };
    this.AssignExaminerMasterList = this.BackupCenterMasterList.filter((center: any) => {
      return Object.keys(searchCriteria).every(key => {
        const searchValue: any = searchCriteria[key];
        if (!searchValue) {
          return true;
        }

        const centerValue = center[key];

        // Handle number comparison by converting to string
        if (typeof centerValue === 'number') {
          return centerValue.toString().toLowerCase().includes(searchValue);
        }

        if (typeof centerValue === 'string') {
          return centerValue.toLowerCase().includes(searchValue);
        }

        return centerValue === searchValue;
      });
    });
  }

  resetList() {

    this.searchByCenterCode = '';
    this.searchByCenterName = '';
    this.searchRequest.ExaminerName = ''
    this.searchRequest.ExaminerSSOID = ''
    this.GetAssignexaminer()
  }

  CloseModal() {
    this.modalService.dismissAll();
    // Reset dropdown ready flag
    this.assignedInstitutesReady = false;
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


  //downloadPDF(type: any = '') {

  //  //if (type != 'order') {

  //  //  this.DownloadFile(this.PublishFileName, 'file download')

  //  //  return
  //  //}
  // /* this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;*/
  //  this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //  this.searchRequest.Eng_NonEng = this.CourseType;
  //  try {
  //    this.assignexaminerservice.DownloadItiPracticalExaminer(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //          this.GetAssignexaminer();
  //          /*this.GenerateCenterSuperintendentOrder(FileName, DownloadfileName, type)*/
  //        }
  //        else {
  //          this.toastr.error(data.ErrorMessage)
  //          //    data.ErrorMessage
  //        }
  //      }, error => console.error(error));

  //  } catch (Ex) {
  //    console.log(Ex);
  //  }

  //}

  DownloadFile(FileName: string, DownloadfileName: string): void {
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ReportsFolder}/${FileName}`;
    this.http.get(fileUrl, { responseType: 'blob' }).subscribe((blob: any) => {
      const downloadLink = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = this.generateFileName(DownloadfileName); // Use DownloadfileName
      downloadLink.click();
      window.URL.revokeObjectURL(url);
    });
  }

  generateFileName(extension: string): string {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    return `file_${timestamp}.pdf`;
  }

  async generatePDF(id: number=0)
  {
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
            { label: 'परीक्षा व्यवसाय:', value: data['TradeName'], isBold: false },
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
            { label: 'क्या प्रायोगिक परीक्षक को उसके मानदेय रूपये रूपये का भुगतान कर दिया गया है/ उसका मानदेय बिल के भुगतान हेतु सत्यापित कर दिया गया है :', value: data['BillPacket'] == false?'Yes':'No', isBold: false },
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

}
