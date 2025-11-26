import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface Vehicle {
  id: string;
  plate: string;
  model?: string;
  brand?: string;
  year?: number;
  status?: string;
  mileage?: number;
  [key: string]: any; // mantém flexível caso o backend envie campos extras
}

export interface VehiclePayload {
  plate: string;
  model: string;
  brand: string;
  year: number;
  status?: string;
  mileage?: number;
}

@Injectable({ providedIn: 'root' })
export class VehiclesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/vehicles`;

  // Lista veiculos; params vazios sao limpos antes de enviar
  list(params?: { page?: number; pageSize?: number; status?: string; brand?: string }): Observable<{
    page: number;
    pageSize: number;
    count: number;
    items: Vehicle[];
  }> {
    const filteredParams: Record<string, any> = {};
    Object.entries(params || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      const str = typeof value === 'string' ? value.trim() : value;
      if (str === '' || str === 'undefined' || str === 'null') return;
      filteredParams[key] = value;
    });

    return this.http.get<{
      page: number;
      pageSize: number;
      count: number;
      items: Vehicle[];
    }>(this.baseUrl, { params: filteredParams as any });
  }

  // Busca por id
  get(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  // Cria novo veiculo
  create(payload: VehiclePayload): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, payload);
  }

  // Atualiza campos parciais
  update(id: string, payload: Partial<VehiclePayload>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, payload);
  }

  // Remove veiculo
  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
