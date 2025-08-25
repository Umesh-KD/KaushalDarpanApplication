import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { JanAadharMemberDetails } from '../../Models/StudentJanAadharDetailModel';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService
{

  private jsonSource = new BehaviorSubject<any>(null);
  currentJsonData = this.jsonSource.asObservable();
  updateMemberDetails(data: any)
  {
    this.jsonSource.next(data);
  }
}
