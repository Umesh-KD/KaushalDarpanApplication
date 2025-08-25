import { Component } from '@angular/core';
import { AdmissionSessionDataModel } from '../../Models/AdmissionSessionDataModel';
import { CommonFunctionService } from '../../Services/CommonFunction/common-function.service';
import { EnumDepartment, EnumStatus } from '../../Common/GlobalConstants';

@Component({
  selector: 'app-iti-public-info',
  templateUrl: './iti-public-info.component.html',
  styleUrl: './iti-public-info.component.css',
  standalone: false
})
export class ITIPublicInfoComponent {
  public sessionData = new AdmissionSessionDataModel();
  _EnumDepartment = EnumDepartment;
  

  constructor(
    private commonservice: CommonFunctionService,
  ) {
    this.GetCurrentAdmissionSession();
   }

  async GetCurrentAdmissionSession() {
    try {
      await this.commonservice.GetCurrentAdmissionSession(EnumDepartment.ITI)
        .then(async (data: any) => {
          
          data = JSON.parse(JSON.stringify(data));
          if (data.State == EnumStatus.Success) {
            this.sessionData = data.Data[0];        
          }
          else {

          }
        })
    }
    catch (ex) { console.log(ex) }
    finally {
      setTimeout(() => {

      }, 200);
    }
  }
}
