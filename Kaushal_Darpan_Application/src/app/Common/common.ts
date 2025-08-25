import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})

export class CommonFunctionService {
  [x: string]: any;
  StreamMasterwithcount(DepartmentID: number, Eng_NonEng: number, EndTermID: number) {
      throw new Error('Method not implemented.');
  }
  SemesterMaster() {
      throw new Error('Method not implemented.');
  }
  GetStaff_InstituteWise(obj: { InstituteID: number; DepartmentID: number; Eng_NonEng: number; RoleID: number; }) {
      throw new Error('Method not implemented.');
  }
  SubjectMaster_StreamIDWise(ID: any, DepartmentID: number, SemesterID: any) {
      throw new Error('Method not implemented.');
  }
  CheckSSOIDExists(SSOID: any, RoleID: number, InstituteID: number) {
      throw new Error('Method not implemented.');
  }
  
  constructor(private httpClient: HttpClient) {

  }
  
}
