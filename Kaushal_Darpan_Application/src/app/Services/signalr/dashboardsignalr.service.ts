import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AppsettingService } from '../../Common/appsetting.service';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class DashboardSignalrService {
  readonly RootPathURL = this.appsettingConfig.RootPathURL + "api/api/";

  readonly headersOptions: any;
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient, private appsettingConfig: AppsettingService) {
    this.headersOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }
  extractData(res: Response) {
    return res;
  }
  handleErrorObservable(error: Response | any) {
    return throwError(error);
  }

  // signal-r start connection
  public async StartSignalRConnection() {
    if (this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.RootPathURL}SignalRHub`)
      .withAutomaticReconnect()
      .build();

    try {
      await this.hubConnection.start();
      console.log("SignalR Connected");
    } catch (err) {
      console.error(err);
    }
  }

  public RefreshDashboardCount(callback: any) {
    this.hubConnection.off("DashboardCountRefresh");
    this.hubConnection.on("DashboardCountRefresh", (data) => {
      callback(data);
    });
  }

}
