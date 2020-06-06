import { Injectable } from '@angular/core';
import { Feedback } from '../shared/feedback';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseURL } from '../shared/baseurl';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) {}

  getfeedback(submitionId: string): Observable<Feedback> {
    return this.http.get<Feedback>(baseURL + 'feedback/' + submitionId);
  }

  postFeedback(feedback: Feedback): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<Feedback>(
      baseURL + 'feedback/',
      feedback,
      httpOptions
    );
  }
}
