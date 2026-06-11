import { Component, OnInit } from '@angular/core';
import { EnumStatus } from '../../../app/Common/GlobalConstants';
import { CommonFunctionService } from '../../../app/Services/CommonFunction/common-function.service';
import { ActivatedRoute } from '@angular/router';
import { ITI_Govt_EM_PersonalDetailByUserIDSearchModel, ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel } from '../../../app/Models/ITIGovtEMStaffMasterDataModel';
import { LoaderService } from '../../../app/Services/Loader/loader.service';
import { ITIGovtEMStaffMaster } from '../../../app/Services/ITIGovtEMStaffMaster/ITIGovtEMStaffMaster.service';

@Component({
  selector: 'app-staff-ifmsdata',
  standalone: false,
  templateUrl: './staff-ifmsdata.component.html',
  styleUrl: './staff-ifmsdata.component.css'
})
export class StaffIFMSDataComponent implements OnInit {
  AddedEducationList: ITIGovtEMStaff_EducationalQualificationAndTechnicalQualificationModel[] = [];
  public educationDetailsRequest = new ITI_Govt_EM_PersonalDetailByUserIDSearchModel();
  public ssoid: string = '';
  public StaffUserID: number = 0;
  public ServiceDetailsList: any[] = [];

  async ngOnInit() 
  {
    

     this.route.queryParams.subscribe(params => {

        this.ssoid = params['ssoid'];
        this.StaffUserID = params['StaffUserID']; 

       if (this.ssoid) {
         this.GetIFMSDATA(this.ssoid);
         this.GetEducationDetails();
    }

      if (this.StaffUserID > 0) {
    this.GetServiceDetails();
  }

  });
  }
  constructor(private commonMasterService: CommonFunctionService, private route: ActivatedRoute, private loaderService: LoaderService, private ITIGovtEMStaffMasterService: ITIGovtEMStaffMaster)
  {}
 public model: any = {};




async GetIFMSDATA(SSOID: any) {
    try {
   
      var request = {
        MasterCode: "GetDataFromIFMS",
        FilterBy: SSOID
      }

      await this.commonMasterService.CommonMasterDataByAction(request).then((data: any) =>
      {
        debugger;
        data = JSON.parse(JSON.stringify(data));
        if (data.State == EnumStatus.Success)
        {
        
            this.model=data.Data;
           this.formatAllDates(this.model);
        }
        else
        {
          this.model = [];
        }
    
      });
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
      
      }, 200);
    }
  }


  formatAllDates(data: any[]) {

    try {

      if (!Array.isArray(data)) return;

      data.forEach((item: any) => {

        Object.keys(item).forEach(key => {

          let value = item[key];

          if (!value || typeof value !== 'string') return;

          const formatted = this.formatDateForInput(value);

          // only replace if valid date
          if (formatted) {
            item[key] = formatted;
          }

        });

      });
    }
    catch { }
}

  formatDateForInput(date: any): string | null
  {
  if (!date) return null;

  try {

    // ISO format
    if (date.includes('T')) {
      return date.split('T')[0]; // yyyy-MM-dd
    }

    // dd-mm-yyyy OR dd-mm-yy
    if (date.match(/^\d{2}-\d{2}-\d{2,4}/)) {
      const parts = date.split(' ')[0].split('-');

      let day = parts[0].padStart(2, '0');
      let month = parts[1].padStart(2, '0');
      let year = parts[2];

      if (year.length === 2) {
        year = +year < 50 ? '20' + year : '19' + year;
      }

      return `${year}-${month}-${day}`;
    }

    return null;

  } catch {
    return null;
  }
  }

  async GetEducationDetails() {
    debugger
  
    try {
      this.AddedEducationList = []; 
      this.loaderService.requestStarted();
      this.educationDetailsRequest.SSOID = this.ssoid;
      this.educationDetailsRequest.Action = 'GetDataFromIFMS_EducationalQualification';
      await this.ITIGovtEMStaffMasterService.ITIGovtEM_ITI_Govt_Em_PersonalDetailByUserID(this.educationDetailsRequest)
        .then((data: any) => {
          data = JSON.parse(JSON.stringify(data));
          this.AddedEducationList = data['Data']['EducationalList'];
        }, error => console.error(error));
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {
        this.loaderService.requestEnded();
      }, 200);
    }

  }

  async GetServiceDetails() {
  try {
    this.loaderService.requestStarted();

    const request = {
      Action: 'ServiceDetailsOfPersonnel',
      StaffUserID: this.StaffUserID
    };

    await this.ITIGovtEMStaffMasterService.GetServiceDetailIFMS(request)
      .then((data: any) => {
        data = JSON.parse(JSON.stringify(data));

        if (data.State === EnumStatus.Success) {
          this.ServiceDetailsList = data.Data || [];
        } else {
          this.ServiceDetailsList = [];
        }
      }, error => console.error(error));

  } catch (ex) {
    console.log(ex);
  } finally {
    setTimeout(() => {
      this.loaderService.requestEnded();
    }, 200);
  }
}
}
