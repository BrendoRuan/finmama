import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface UpdateNote {
  date: string;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class UpdatesService {

  private readonly updatesUrl = 'updates.json';

  constructor(private http: HttpClient) {}

  getUpdates(): Observable<UpdateNote[]> {
    return this.http.get<UpdateNote[]>(this.updatesUrl);
  }
}
