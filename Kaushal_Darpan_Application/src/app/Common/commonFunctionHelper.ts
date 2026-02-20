import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root'
})

export class CommonFunctionHelper {

  public truncateText(text: string, limit: number = 25): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  public getRouterLinkURL(value: string) {
    let hasQS = value.includes('?');
    if (hasQS) {
      value = value.split('?')[0];
    }
    return value;
  }

  public getQueryParams(value: string) {
    let dynamicQSParams: any = {};
    let hasQS = value.includes('?');
    if (hasQS) {
      const queryString = value.split('?')[1];
      const params = new URLSearchParams(queryString);

      params.forEach((val, key) => {
        dynamicQSParams[key] = val;
      });
    }
    return dynamicQSParams;
  }

}
