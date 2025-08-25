import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { NgbModalRef, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';
import { CommonFunctionService } from '../../../Services/CommonFunction/common-function.service';
import { LoaderService } from '../../../Services/Loader/loader.service';
import { CenterAllocationService } from '../../../Services/Center_Allocation/center-allocation.service';
import { CenterExamAllocationSearchModel, CenterAllocationtDataModels, InstituteList, ITIAssignPracticaLExaminer } from '../../../Models/CenterAllocationDataModels';
import { EnumDepartment, EnumEnrollNoStatus, EnumRole, EnumStatus, GlobalConstants } from '../../../Common/GlobalConstants';
import { CenterAllotmentService } from '../../../Services/CenterAllotment/CenterAllotment.service';
import { AppsettingService } from '../../../Common/appsetting.service';
import { HttpClient } from '@angular/common/http';
import { GetRollService } from '../../../Services/GenerateRoll/generate-roll.service';
import { VerifyRollNumberList } from '../../../Models/GenerateRollDataModels';
import { CenterExamCoordinatorService } from '../../../Services/CenterExamCoordinator/center-exam-coordinator.service';
import { ITICenterAllocationService } from '../../../Services/ITICenterAllocation/ItiCenterAllocation.service';
import { ITICenterAllocationtDataModels } from '../../../Models/ITI/ITICenterAllocationDataModel';
import { SweetAlert2 } from '../../../Common/SweetAlert2';
import { OTPModalComponent } from '../../otpmodal/otpmodal.component';
import { CommonVerifierApiDataModel } from '../../../Models/PublicInfoDataModel';
import { FontsService } from '../../../Services/FontService/fonts.service';
import pdfmake from 'pdfmake/build/pdfmake';
import { ITIRelievingExamService } from '../../../Services/ITI/ITIRelieveingExam/iti-relieveing-exam.service';

@Component({
  selector: 'app-center-exam-coordinator',
  standalone: false,
  templateUrl: './center-exam-coordinator.component.html',
  styleUrl: './center-exam-coordinator.component.css'
})
export class CenterExamCoordinatorComponent
{
  fontsSerive = inject(FontsService);
  commonMasterService = inject(CommonFunctionService);
  centerAllocationService = inject(ITICenterAllocationService);
  centerExamAllocationService = inject(CenterExamCoordinatorService);
  pdfMakeVfs: any = pdfmake.vfs || {};

  itiRelievingExamService = inject(ITIRelievingExamService);
  Swal2 = inject(SweetAlert2);
  public requestSSoApi = new CommonVerifierApiDataModel();
  GetRollService = inject(GetRollService);
  centerCreation = inject(CenterAllotmentService);
  toastr = inject(ToastrService);
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
  CenterMasterList: ITICenterAllocationtDataModels[] = [];
  searchRequest = new CenterExamAllocationSearchModel();
  FilteredInstituteList: any[] = [];
  modalReference: NgbModalRef | undefined;
  searchByCenterCode: string = '';
  searchByCenterName: string = '';
  request = new ITIAssignPracticaLExaminer();
  sSOLoginDataModel = new SSOLoginDataModel();
  BackupCenterMasterList: any[] = [];
  SelectCenterMaster: any;
  GetStatusCenterSuperintendentData: any;
  UserID: number = 0;
  Status: number = 0
  PublishFileName: string = ''
  @ViewChild('otpModal') childComponent!: OTPModalComponent;
  constructor(...args: unknown[]);
  constructor() { }
  _EnumRole = EnumRole;
  async ngOnInit() {
    this.sSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    this.request.ModifyBy = this.sSOLoginDataModel.UserID;
    this.request.DepartmentID = this.sSOLoginDataModel.DepartmentID;
    this.request.EndTermID = this.sSOLoginDataModel.EndTermID;
    /*   this.GetStatusCenterSuperintendent();*/
    if (this.sSOLoginDataModel.RoleID == 99) {
      await this.GetCenterMasterList2()
    } else {
      await this.GetCenterMasterList();
    }


    this.pdfMakeVfs['NotoSansDevanagari-Regular.ttf'] = await this.fontsSerive.getHindiFontRegular();
    this.pdfMakeVfs['NotoSansDevanagari-Bold.ttf'] = await this.fontsSerive.getHindiFontBold();
    this.pdfMakeVfs['Roboto-Regular.ttf'] = await this.fontsSerive.getEnglishFontRegular();
    this.pdfMakeVfs['Roboto-Bold.ttf'] = await this.fontsSerive.getHindiFontBold();
    pdfmake.vfs = this.pdfMakeVfs;


  }
  async GetCenterMasterList() {
    this.searchRequest = {
      DepartmentID: EnumDepartment.ITI,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CenterCode: '',
      CenterName: '',
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      InstituteID: this.sSOLoginDataModel.InstituteID,
      UserID: 0,
      DistrictID: this.sSOLoginDataModel.DistrictID

  }
    try {
      this.loaderService.requestStarted();
      await this.centerExamAllocationService.GetCenterExamCoordinatorData(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.CenterMasterList];
          console.log(data['Data'])
          //this.Status = data['Data'][0]['Status']
          //this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }

  async GetCenterMasterList2() {
    this.searchRequest = {
      DepartmentID: EnumDepartment.ITI,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      CenterCode: '',
      CenterName: '',
      Eng_NonEng: this.sSOLoginDataModel.Eng_NonEng,
      InstituteID: this.sSOLoginDataModel.InstituteID,
      UserID: this.sSOLoginDataModel.UserID,
      DistrictID:this.sSOLoginDataModel.DistrictID
    }
    try {
      this.loaderService.requestStarted();
      await this.centerExamAllocationService.GetExamCoordinatorDataByUserId(this.searchRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.CenterMasterList = data['Data'];
          this.BackupCenterMasterList = [...this.CenterMasterList];
          console.log(data['Data'])
          //this.Status = data['Data'][0]['Status']
          //this.PublishFileName = data['Data'][0]['FileName']
        }, error => console.error(error));
    } catch (Ex) {
      console.log(Ex);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }




  onSearchClick() {
    const searchCriteria: any = {
      CCCode: this.searchByCenterCode ? this.searchByCenterCode.trim().toLowerCase() : '',
      CenterName: this.searchByCenterName.trim().toLowerCase(),
    };
    this.CenterMasterList = this.BackupCenterMasterList.filter((center: any) => {
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
    this.CenterMasterList = [...this.BackupCenterMasterList];
    this.searchByCenterCode = '';
    this.searchByCenterName = '';
  }


  async openModal(content: any, row: any, indexNum: number) {
    console.log(row, 'RowData');
    try {
      this.SelectCenterMaster = row;
      this.UserID = 0;
      this.assignedInstitutesReady = false;
      this.assignedInstitutes = [];
      /*      await this.GetStaffTypeDDL(this.SelectCenterMaster);*/
      this.assignedInstitutesReady = true;
      this.UserID = row && row.UserID > 0 ? row.UserID : 0;
      await this.modalService
        .open(content, { size: 'md', ariaLabelledBy: 'modal-basic-title', backdrop: 'static' })
        .result.then(
          (result) => {
            this.closeResult = `Closed with: ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    } catch (error) {
      console.error('Error opening modal:', error);
      this.toastr.error('Failed to open modal. Please try again.');
    }
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


  //downloadPDF(type: any) {

  //  if (type != 'order') {

  //    this.DownloadFile(this.PublishFileName, 'file download')

  //    return
  //  }
  //  this.searchRequest.DepartmentID = this.sSOLoginDataModel.DepartmentID;
  //  this.searchRequest.EndTermID = this.sSOLoginDataModel.EndTermID;
  //  this.searchRequest.Eng_NonEng = this.sSOLoginDataModel.Eng_NonEng;
  //  try {
  //    this.centerAllocationService.DownloadCenterSuperintendent(this.searchRequest)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          this.DownloadFile(data.Data, 'file download');
  //          this.GetCenterMasterList();
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
    const fileUrl = `${this.appsettingConfig.StaticFileRootPathURL}/${GlobalConstants.ITIReportsFolder}/${GlobalConstants.CenterSuperintendent}/${FileName}`;
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



  //GetStatus(status: any) {
  //  try {
  //    this.centerAllocationService.GetStatusCenterSuperintendentOrder(status, this.sSOLoginDataModel.Eng_NonEng)
  //      .then((data: any) => {
  //        data = JSON.parse(JSON.stringify(data));
  //        if (data.State == EnumStatus.Success) {
  //          console.log(data.Data)
  //          
  //          this.GetStatusCenterSuperintendentData = data.Data[0]
  //          if (this.GetStatusCenterSuperintendentData && this.GetStatusCenterSuperintendentData?.FileName) {
  //            this.DownloadFile(this.GetStatusCenterSuperintendentData?.FileName, 'file download');
  //          }

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

  //GetStatusCenterSuperintendent() {
  //  this.centerAllocationService.GetStatusCenterSuperintendentOrder(4, this.sSOLoginDataModel.Eng_NonEng)
  //    .then((data: any) => {
  //      data = JSON.parse(JSON.stringify(data));
  //      if (data.State == EnumStatus.Success) {
  //        console.log(data.Data)

  //        this.GetStatusCenterSuperintendentData = data.Data[0]
  //      }
  //      else {
  //        this.toastr.error(data.ErrorMessage)
  //        //    data.ErrorMessage
  //      }
  //    }, error => console.error(error));
  //}







  CloseModalPopup() {
    this.modalService.dismissAll();

  }


  async SSOIDGetSomeDetails(SSOID: string): Promise<any> {

    if (SSOID == "") {
      this.toastr.error("Please Enter SSOID");
      return;
    }

    const username = SSOID; // or hardcoded 'SIDDHA.AZAD'
    const appName = 'madarsa.test';
    const password = 'Test@1234';

    /*const url = `https://ssotest.rajasthan.gov.in:4443/SSOREST/GetUserDetailJSON/${username}/${appName}/${password}`;*/

    this.requestSSoApi.SSOID = username;
    this.requestSSoApi.appName = appName;
    this.requestSSoApi.password = password;



    try {

      this.loaderService.requestStarted();
      await this.commonMasterService.CommonVerifierApiSSOIDGetSomeDetails(this.requestSSoApi).then((data: any) => {
        data = JSON.parse(JSON.stringify(data));
        let response = JSON.parse(JSON.stringify(data));
        if (response?.Data) {

          let parsedData = JSON.parse(response.Data); // parse string inside Data
          if (parsedData != null) {
            this.request.Name = parsedData.displayName;
            this.request.MobileNumber = parsedData.mobile;
            this.request.SSOID = parsedData.SSOID;
            this.request.Email = parsedData.mailPersonal;

          }
          else {
            this.toastr.error("Record Not Found");
            return;
          }

          //alert("SSOID: " + parsedData.SSOID); // show SSOID in alert
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }


  }

  AssignExamCoordinator() {

    if (this.request.SSOID == '') {
      this.toastr.error("Please Enter Valid SSOID")
      return
    }

    let obj = {
      CenterAssignedID: 0,
      CenterID: this.SelectCenterMaster.CenterID,
      InsituteID: this.SelectCenterMaster.InstituteID,
      UserID: this.UserID,
      DepartmentID: this.sSOLoginDataModel.DepartmentID,
      EndTermID: this.sSOLoginDataModel.EndTermID,
      Eng_NonEng: 0,
      CreatedBy: this.sSOLoginDataModel.UserID,
      ModifyBy: this.sSOLoginDataModel.UserID,
      TimeTableID: this.SelectCenterMaster.TimeTableID,
      SSOID: this.request.SSOID,
      Name: this.request.Name,
      MobileNumber: this.request.MobileNumber,
      Email: this.request.Email


    }




    try {
      // //Call service to save data
      this.centerAllocationService.AssignExamCoordinatorData(obj)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.State = data['State'];
          this.Message = data['Message'];
          this.ErrorMessage = data['ErrorMessage'];

          if (this.State === EnumStatus.Success) {
            this.toastr.success(this.Message);
            this.CloseModal();
            this.GetCenterMasterList();
          } else {
            this.toastr.error(this.ErrorMessage);
          }
        })
        .catch((error: any) => {
          console.error(error);
          this.toastr.error("An error occurred while saving the data.");
        });

    } catch (ex) {
      console.log(ex);
      this.toastr.error("An unexpected error occurred.");
    }

  }


  async generatePDF(id: number = 0) {
    debugger
    try {
      this.loaderService.requestStarted();
      this.itiRelievingExamService.GetByExamCoordinatorId(id)
        .then((data: any) => {
          //data=JSON.parse(JSON.stringify(data));
          data = data['Data'] || [];;
          console.log(data);
          data = data[0];
          console.log(data);
          pdfmake.fonts =
          {
            NotoSansDevanagari:
            {
              normal: 'NotoSansDevanagari-Regular.ttf',
              bold: 'NotoSansDevanagari-Bold.ttf'
            },
            Roboto:
            {
              normal: 'Roboto-Regular.ttf',
              bold: 'Roboto-Bold.ttf'
            }
          }

          const fieldMappings = [
            { label: 'एनसीवीटी प्रायोगिक परीक्षा:', value: data.NCVTPracticalExam, isBold: false },
            { label: 'परीक्षा की दिनांक:', value: data.DateOfExamination, isBold: false },
            { label: 'परीक्षा व्यवसाय:', value: data['TradeName'], isBold: false },
            { label: 'प्रायोगिक परीक्षा केन्द्र की कोड संख्या व नाम:', value: data.PracticalExamCentre, isBold: false },
            { label: 'केन्द्राधीक्ष का का नाम व सर्पक नम्बर:', value: data.PracticalExaminerName, isBold: false },
            { label: 'कोर्डिनेटर का नाम, पद व सर्पक नम्बर:', value: data['PracticalExaminerDesignation'], isBold: false },
            { label: 'कुल पंजीकृत संस्थानों की संख्या, जिनकी प्रायोगिक परीक्षा उक्त केन्द्र पर करवाई गई:', value: data['PracticalExaminerNumber'], isBold: false },
            { label: 'उपस्थित परीक्षकों का विवरण(अलग से संलग्न करें):', value: data['NoOfTotalTrainees'], isBold: false },
            { label: 'क्या मार्किंग शीट का लिफाफा सं. 01 प्रायोगिक परीक्षक से लेकर जमा करा दिया गया है:', value: data['NoOfPresentTrainees'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा की कॉपियों का लिफाफा व जॉब सं. 02 कोर्डिनेटर द्वारा नोडल केन्द्र पर शील्ड कर जमा करा दिया गया है:', value: data['NoOfAbsentTrainees'], isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा का पर्णप्रति पर्ण का लिफाफा सं. 03 प्रायोगिक परीक्षक से लेकर जमा करा दिया गया है:', value: data['MarckSheetPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा के प्रेक्टिकल के जॉब शील बन्द बौरे में नोडल केन्द्र पर जमा करा दिये गये है :', value: data['CopyPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षक का मानदेय का लिफाफा सं. 04 कोर्डिनेटर द्वारा जमा करा दिया गया है :', value: data['PracticalPacket'] == false ? 'Yes' : 'No', isBold: false },
            { label: 'क्या प्रायोगिक परीक्षा के प्रेक्टिकल के जॉब शील बन्द बौरे में नोडल केन्द्र पर जमा करा दिये गये है:', value: data['PracticalTeacherPacket'] == false ? 'Yes' : 'No', isBold: false },
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
          //const docDefinition = {
          //  content:
          //    [
          //    {
          //      text: 'कोर्डिनेटर को रिलीव करते समय नोडल अधिकारी द्वारा तैयार की जाने वाली चेक पॉईन्ट की सूची (तीन प्रतियों में प्रत्येक कोर्डिनेटर हेतु अलग-अलग तैयार की जाए)', bold: true, fontSize: 14
          //    },
          //    { ol: dynamicContent }
          //  ],
          //  defaultStyle:
          //  {
          //    font: 'NotoSansDevanagari',
          //    lineHeight: 1.5,
          //  }
          //};

          const docDefinition = {
            content: [
              {
                text: 'कोर्डिनेटर को रिलीव करते समय नोडल अधिकारी द्वारा तैयार की जाने वाली चेक पॉईन्ट की सूची (तीन प्रतियों में प्रत्येक कोर्डिनेटर हेतु अलग-अलग तैयार की जाए)',
                bold: true,
                fontSize: 14,
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
          const fileName = `ExaminerCordinator_${timestamp}.pdf`;
          pdfmake.createPdf(docDefinition as any).download(fileName);
        })
    }
    catch (ex)
    {
      console.log(ex);
    }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }
  }


}
