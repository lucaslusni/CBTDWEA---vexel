import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { Vehicle, VehiclesService } from '../../services/vehicles.service';

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './vehicles.html',
  styleUrls: ['./vehicles.scss'],
})
export class Vehicles implements OnInit {
  vehicles: Vehicle[] = [];
  page = 1;
  pageSize = 10;
  total = 0;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  createLoading = false;
  editLoading = false;
  deletingId: string | null = null;

  createForm: FormGroup<{
    plate: FormControl<string>;
    model: FormControl<string>;
    brand: FormControl<string>;
    year: FormControl<number>;
    status: FormControl<string>;
    mileage: FormControl<number>;
  }>;
  editForm: FormGroup<{
    model: FormControl<string>;
    brand: FormControl<string>;
    year: FormControl<number>;
    status: FormControl<string>;
    mileage: FormControl<number>;
  }>;
  editingId: string | null = null;

  constructor(private vehiclesService: VehiclesService, private fb: NonNullableFormBuilder) {
    this.createForm = this.fb.group({
      plate: ['', [Validators.required]],
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required]],
      status: ['active'],
      mileage: [0],
    });

    this.editForm = this.fb.group({
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required]],
      status: ['active'],
      mileage: [0],
    });

  }

  ngOnInit(): void {
    this.loadVehicles();
  }

  async loadVehicles() {
    this.loading = true;
    this.error = null;
    this.success = null;
    try {
      const res = await firstValueFrom(
        this.vehiclesService.list({
          page: this.page,
          pageSize: this.pageSize
        })
      );
      // Suporta tanto resposta paginada ({ items }) quanto array simples
      const items = Array.isArray(res) ? res : res.items;
      const total = Array.isArray(res) ? res.length : res.count;
      this.vehicles = items || [];
      this.total = total || 0;
    } catch (err) {
      console.error('Erro ao carregar veículos', err);
      this.error = 'Não foi possível carregar os veículos.';
    } finally {
      this.loading = false;
    }
  }

  async changePage(delta: number) {
    const next = this.page + delta;
    if (next < 1) return;
    this.page = next;
    await this.loadVehicles();
  }

  async onCreate() {
    if (this.createForm.invalid) return;
    this.createLoading = true;
    this.error = null;
    this.success = null;
    try {
      const raw = this.createForm.getRawValue();
      const payload = {
        ...raw,
        year: Number(raw.year),
        mileage: Number(raw.mileage),
      };
      await firstValueFrom(this.vehiclesService.create(payload));
      this.createForm.reset({
        plate: '',
        model: '',
        brand: '',
        year: new Date().getFullYear(),
        status: 'active',
        mileage: 0,
      });
      this.success = 'Veículo criado.';
      await this.loadVehicles();
    } catch (err) {
      console.error('Erro ao criar veículo', err);
      this.error = 'Erro ao criar veículo.';
    } finally {
      this.createLoading = false;
    }
  }

  startEdit(vehicle: Vehicle) {
    this.editingId = vehicle.id;
    this.editForm.setValue({
      model: vehicle.model || '',
      brand: vehicle.brand || '',
      year: vehicle.year || new Date().getFullYear(),
      status: vehicle.status || 'active',
      mileage: vehicle.mileage ?? 0,
    });
  }

  cancelEdit() {
    this.editingId = null;
  }

  async saveEdit(id: string) {
    if (this.editForm.invalid) return;
    this.editLoading = true;
    this.error = null;
    this.success = null;
    try {
      const raw = this.editForm.getRawValue();
      const payload = {
        ...raw,
        year: Number(raw.year),
        mileage: Number(raw.mileage),
      };
      await firstValueFrom(this.vehiclesService.update(id, payload));
      this.editingId = null;
      this.success = 'Veículo atualizado.';
      await this.loadVehicles();
    } catch (err) {
      console.error('Erro ao atualizar veículo', err);
      this.error = 'Erro ao atualizar veículo.';
    } finally {
      this.editLoading = false;
    }
  }

  async delete(id: string) {
    const ok = confirm('Deseja excluir este veículo?');
    if (!ok) return;
    this.deletingId = id;
    this.error = null;
    this.success = null;
    try {
      await firstValueFrom(this.vehiclesService.remove(id));
      this.success = 'Veículo removido.';
      await this.loadVehicles();
    } catch (err) {
      console.error('Erro ao excluir veículo', err);
      this.error = 'Erro ao excluir veículo.';
    } finally {
      this.deletingId = null;
    }
  }
}
