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

  list(params?: { page?: number; pageSize?: number; status?: string; brand?: string }): Observable<{
    page: number;
    pageSize: number;
    count: number;
    items: Vehicle[];
  }> {
    return this.http.get<{
      page: number;
      pageSize: number;
      count: number;
      items: Vehicle[];
    }>(this.baseUrl, { params: params as any });
  }

  get(id: string): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/${id}`);
  }

  create(payload: VehiclePayload): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.baseUrl, payload);
  }

  update(id: string, payload: Partial<VehiclePayload>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
