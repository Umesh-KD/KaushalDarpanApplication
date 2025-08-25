import { Component, OnInit } from '@angular/core';

import { EnumDepartment, EnumVerificationAction } from '../../../Common/GlobalConstants';
import { EncryptionService } from '../../../Services/EncryptionService/encryption-service.service';
import { SSOLoginDataModel } from '../../../Models/SSOLoginDataModel';

@Component({
    selector: 'app-apply-now',
    templateUrl: './apply-now.component.html',
    styleUrls: ['./apply-now.component.css'],
    standalone: false
})
export class ApplyNowComponent implements OnInit
{
  public _EnumDepartment = EnumDepartment
  public DepartmentData: any = [];
  public SSOLoginDataModel = new SSOLoginDataModel()
  constructor(private encryptionService: EncryptionService)
  {
    
  }

  async ngOnInit()
  {

    this.DepartmentData.push(
      {
        DepartmentID: 1,
        DepartmentName: "DEPARTMENT OF TECHNICAL EDUCATION RAJASTHAN(DTE)",
        ServiceID: 123
      },
      {
        DepartmentID: 2,
        DepartmentName: "INDUSTRIAL TRAINING INSTITUTE(ITI)",
        ServiceID: 1234
      }
    )
    this.SSOLoginDataModel = await JSON.parse(String(localStorage.getItem('SSOLoginUser')));
    //bind Department
    this.GetAllDepartment();
  }
  GetAllDepartment()
  {
    if (this.SSOLoginDataModel.DepartmentID > 0)
    {
      this.DepartmentData = this.DepartmentData.filter((f: any) => f.DepartmentID == this.SSOLoginDataModel.DepartmentID)
    }
  }

  encryptParameter(param: any)
  {
    return this.encryptionService.encryptData(param);
  }
}
