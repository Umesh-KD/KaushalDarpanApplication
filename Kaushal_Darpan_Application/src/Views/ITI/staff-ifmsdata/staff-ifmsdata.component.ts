import { Component, OnInit } from '@angular/core';
import { EnumStatus } from '../../../app/Common/GlobalConstants';
import { CommonFunctionService } from '../../../app/Services/CommonFunction/common-function.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-staff-ifmsdata',
  standalone: false,
  templateUrl: './staff-ifmsdata.component.html',
  styleUrl: './staff-ifmsdata.component.css'
})
export class StaffIFMSDataComponent implements OnInit {


  async ngOnInit() 
  {
     this.route.queryParams.subscribe(params => {

    const ssoid = params['ssoid'];

    if (ssoid) {
      this.GetIFMSDATA(ssoid);
    }

  });
  }
  constructor(private commonMasterService:CommonFunctionService,private route: ActivatedRoute)
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
}
