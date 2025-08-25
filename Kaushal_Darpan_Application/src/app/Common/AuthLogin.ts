import { Injectable, Input } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
 export class AuthLogin {
  _allowDay!: boolean;
    static _allowDay: boolean;
  public static get allowDay(): boolean {
    return this._allowDay;
  }
  @Input('allowDay') static set allowDay(value: boolean) {
    this._allowDay = value;
  }
}
