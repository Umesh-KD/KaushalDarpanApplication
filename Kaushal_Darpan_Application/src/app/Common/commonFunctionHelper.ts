import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class CommonFunctionHelper {

  public truncateText(text: string, limit: number = 25): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

}
