import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService, ReportSummary } from '../../services/reports.service';
import { VehiclesService, Vehicle } from '../../services/vehicles.service';
import { Observable, catchError, of, firstValueFrom } from 'rxjs';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.scss'],
})
export class Reports {
  summary$: Observable<ReportSummary>;
  error: string | null = null;
  Math = Math;
  vehicles: Vehicle[] = [];
  loadingVehicles = false;
  vehiclesError: string | null = null;
  filtersForm: FormGroup<{
    status: FormControl<string>;
    brand: FormControl<string>;
  }>;

  constructor(
    private reportsService: ReportsService,
    private vehiclesService: VehiclesService,
    fb: NonNullableFormBuilder
  ) {
    this.summary$ = this.reportsService.summary().pipe(
      catchError(err => {
        console.error('Erro ao carregar relatórios', err);
        this.error = 'Não foi possível carregar os relatórios.';
        return of({
          total: 0,
          ativos: 0,
          mediaAno: 0,
          mediaKm: 0,
          maisNovo: null,
          maisAntigo: null
        });
      })
    );

    this.filtersForm = fb.group({
      status: [''],
      brand: [''],
    });

    this.loadVehicles();
  }

  async loadVehicles() {
    this.loadingVehicles = true;
    this.vehiclesError = null;
    try {
      const res = await firstValueFrom(
        this.vehiclesService.list({
          status: this.filtersForm.value.status?.trim() || undefined,
          brand: this.filtersForm.value.brand?.trim() || undefined
        })
      );
      // Suporta resposta paginada ou array
      const items = Array.isArray(res) ? res : res?.items;
      this.vehicles = items || [];
    } catch (err) {
      console.error('Erro ao carregar veículos no relatório', err);
      this.vehiclesError = 'Não foi possível carregar os veículos.';
    } finally {
      this.loadingVehicles = false;
    }
  }
}
