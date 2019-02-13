import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { SmartTableDataQuery } from './smart-table.types';
import {
  HttpClient,
  HttpHeaders,
} from '@angular/common/http';

@Injectable()
export class SmartTableService {
  private requestOptions: {
    headers: HttpHeaders
  };

  constructor(private http: HttpClient) {
  }

  public getConfiguration(apiUrl: string, headers?: HttpHeaders) {
    if (headers) {
      this.requestOptions = {
        headers: headers
      };
      return this.http.get(`${apiUrl}/config`, this.requestOptions);
    }
    return this.http.get(`${apiUrl}/config`);
  }

  public getData(apiUrl: string, headers: HttpHeaders, dataQuery: SmartTableDataQuery, page: number, pageSize: number): Observable<any> {
    if (headers) {
      this.requestOptions = {
        headers: headers
      };
      return this.http.post(apiUrl + `?page=${page}&pageSize=${pageSize}`, JSON.stringify(dataQuery), this.requestOptions);
    }
    return this.http.post(apiUrl + `?page=${page}&pageSize=${pageSize}`, JSON.stringify(dataQuery));
  }
}
