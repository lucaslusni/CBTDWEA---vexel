import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface ReportSummary {
  total: number;
  ativos: number;
  mediaAno: number | string;
  mediaKm: number | string;
  maisNovo: number | null;
  maisAntigo: number | null;
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/reports`;

  summary(): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.baseUrl}/summary`);
  }
}
