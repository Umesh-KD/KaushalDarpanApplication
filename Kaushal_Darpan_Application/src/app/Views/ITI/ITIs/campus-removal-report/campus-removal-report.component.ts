import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampusRemovalReport } from '../../../../Models/ITI/ItiReportDataModel';
import { ITIsService } from '../../../../Services/ITIs/itis.service';


@Component({
  selector: 'app-campus-removal-report',
  standalone: false,
 
  templateUrl: './campus-removal-report.component.html',
  styleUrl: './campus-removal-report.component.css'
})
export class CampusRemovalReportComponent {

  campusRemovalReport = new CampusRemovalReport();
  campusRemovalReportList: CampusRemovalReport[] = [];

  constructor(private itiService: ITIsService) { }
  async ngOnInit() {
    this.GetCampusRemovalReport();
  }
  async GetCampusRemovalReport() {

    try {

      const data: any = await this.itiService.ITICollegeCampusRemovalReport(this.campusRemovalReport);

      if (data && data.Data) {
        this.campusRemovalReportList = data.Data;
      }
      else {
        this.campusRemovalReportList = [];
      }

    } catch (error) {
      console.error(error);
      this.campusRemovalReportList = [];
    }

  }

}
