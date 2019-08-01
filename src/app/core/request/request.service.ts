import 'rxjs/add/operator/catch';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

@Injectable()
export class RequestService {
  public headers: HttpHeaders = new HttpHeaders();
  private options: any;

  constructor(private http: HttpClient) {
  }

  // TODO Timeout
  public post<T>(url: string, request: any, contentType?: string): Observable<T> {
    this.buildOptions(contentType);
    return this.http.post(url, request, this.options)
      .map((data) => this.extractData<T>(data))
      .catch((error) => this.handleError(error));
  }

  // TODO Timeout
  public get<T>(url: string, params?: HttpParams): Observable<T> {
    this.buildOptions();
    if (params) {
      this.options.params = params;
    }
    return this.http.get(url, this.options)
      .map((data) => this.extractData<T>(data))
      .catch((error) => this.handleError(error));
  }

  private buildOptions(contentType?: string) {
    this.headers.set('Content-Type', contentType ? contentType : 'application/json');
    this.options = {headers: this.headers};
  }

  private extractData<T>(res: any): T {
    return res;
  }

  private handleError<T>(error: HttpResponse<T> | any) {
    let errMsg: string;
    if (error instanceof Response) {
      errMsg = `${error.status} - ${error.statusText}: ${error['_body']}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    return Observable.throw(errMsg);
  }
}
