import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

// Interface que tipa o formato do resumo de relatórios
export interface ReportSummary {
  total: number;           // quantidade total de veículos
  ativos: number;          // quantidade de veículos ativos
  mediaAno: number | string; // média dos anos de fabricação (pode vir como número ou string formatada)
  mediaKm: number | string;  // média de quilometragem (idem acima)
  maisNovo: number | null;   // ano do veículo mais novo (ou null se não houver)
  maisAntigo: number | null; // ano do veículo mais antigo (ou null se não houver)
}

@Injectable({ providedIn: 'root' })
export class ReportsService {
  // Injeta o HttpClient para fazer chamadas HTTP ao backend
  private http = inject(HttpClient);

  // URL base da API de relatórios, montada a partir do environment
  private baseUrl = `${environment.apiUrl}/reports`;

  // Busca o resumo de relatórios no endpoint /reports/summary
  summary(): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.baseUrl}/summary`);
  }
}
