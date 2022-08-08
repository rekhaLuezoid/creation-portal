import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionPreviewService {
  readonly url = '/api/question/v1/list'

  constructor(private _httpClient: HttpClient) { }

  getQuestionsData(identifierList: Array<string>): Observable<any> {
    const body = { 
      request: {
         search: { 
           identifier: identifierList
          } 
        } 
      }
    return this._httpClient.post(this.url, body);
  }
}
