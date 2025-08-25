import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RoleMasterDataModel, UserRoleRightsDataModel } from '../../Models/RoleMasterDataModel';
import { GlobalConstants } from '../../Common/GlobalConstants';
import { AppsettingService } from '../../Common/appsetting.service';
import { SeatIntakesDataModel, SeatIntakesSearchModel } from '../../Models/SeatIntakesDataModel';

@Injectable({
  providedIn: 'root'
})
export class SeatIntakesService {

  constructor() { }
}
