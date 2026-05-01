import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PostMasterModel } from '../../Models/PostMasterModel'; 
import { AppsettingService } from '../../Common/appsetting.service';

@Injectable({
  providedIn: 'root'
})
export class PostMasterService {

  readonly APIUrl = this.appsettingConfig.apiURL + 'PostMaster';

  constructor(
    private http: HttpClient,
    private appsettingConfig: AppsettingService
  ) { }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('authtoken')
      })
    };
  }

  handleErrorObservable(error: any) {
    return throwError(error);
  }

  // ================= GET ALL POSTS =================
  async GetAllPosts(request: PostMasterModel) {
    return await this.http.post(
      `${this.APIUrl}/GetAllPosts`,
      JSON.stringify(request),
      this.getHeaders()
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  // ================= GET BY ID =================
  async GetByID(postID: number) {
    return await this.http.get(
      `${this.APIUrl}/GetByID/${postID}`,
      this.getHeaders()
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  // ================= SAVE (ADD / UPDATE) =================
  async SavePost(request: PostMasterModel) {
    return await this.http.post(
      `${this.APIUrl}/SavePost`,
      JSON.stringify(request),
      this.getHeaders()
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }

  // ================= DELETE =================
  async DeletePost(postID: number, modifyBy: number) {
    return await this.http.delete(
      `${this.APIUrl}/DeletePostByID/${postID}/${modifyBy}`,
      this.getHeaders()
    )
      .pipe(catchError(this.handleErrorObservable))
      .toPromise();
  }
}
