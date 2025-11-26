import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  // Lista de veículos exibida na tabela
  vehicles: Vehicle[] = [];

  // Controle de paginação
  page = 1;
  pageSize = 10;
  total = 0;

  // Estados de carregamento e mensagens de feedback
  loading = false;
  error: string | null = null;
  success: string | null = null;
  createLoading = false;
  editLoading = false;
  deletingId: string | null = null;

  // Formulário de criação de veículo (inclui todos os campos, inclusive placa)
  createForm: FormGroup<{
    plate: FormControl<string>;
    model: FormControl<string>;
    brand: FormControl<string>;
    year: FormControl<number>;
    status: FormControl<string>;
    mileage: FormControl<number>;
  }>;

  // Formulário de edição (não permite alterar a placa)
  editForm: FormGroup<{
    model: FormControl<string>;
    brand: FormControl<string>;
    year: FormControl<number>;
    status: FormControl<string>;
    mileage: FormControl<number>;
  }>;

  // ID do veículo que está em modo de edição (ou null se nenhum)
  editingId: string | null = null;

  constructor(
    // Service responsável pelas chamadas HTTP para o backend
    private vehiclesService: VehiclesService,
    // FormBuilder tipado (NonNullable) para evitar valores nulos
    private fb: NonNullableFormBuilder,
    // ChangeDetectorRef para forçar detecção de mudanças em alguns fluxos async
    private cdr: ChangeDetectorRef,
    // NgZone para garantir que o código rode dentro da zona do Angular
    private zone: NgZone
  ) {
    // Form padrão para cadastro de novo veículo
    this.createForm = this.fb.group({
      plate: ['', [Validators.required]],              // placa obrigatória
      model: ['', [Validators.required]],              // modelo obrigatório
      brand: ['', [Validators.required]],              // marca obrigatória
      year: [new Date().getFullYear(), [Validators.required]], // ano padrão: ano atual
      status: ['active'],                              // status padrão: ativo
      mileage: [0],                                    // km inicial: 0
    });

    // Form padrão usado quando o usuário entra em modo de edição
    this.editForm = this.fb.group({
      model: ['', [Validators.required]],
      brand: ['', [Validators.required]],
      year: [new Date().getFullYear(), [Validators.required]],
      status: ['active'],
      mileage: [0],
    });
  }

  // Lifecycle hook: roda quando o componente é inicializado
  ngOnInit(): void {
    // Carrega a primeira página de veículos ao montar o componente
    this.loadVehicles();
  }

  // Busca a lista de veículos no backend, respeitando a paginação atual
  async loadVehicles() {
    this.loading = true;
    this.error = null;
    this.success = null;

    try {
      // Converte o Observable do service em Promise com firstValueFrom
      const res = await firstValueFrom(
        this.vehiclesService.list({
          page: this.page,
          pageSize: this.pageSize,
        })
      );

      // Suporta tanto resposta paginada ({ items, count }) quanto array simples
      const items = Array.isArray(res) ? res : res.items;
      const total = Array.isArray(res) ? res.length : res.count;

      this.vehicles = items || [];
      this.total = total || 0;
    } catch (err) {
      console.error('Erro ao carregar veiculos', err);
      this.error = 'Nao foi possivel carregar os veiculos.';
    } finally {
      this.loading = false;
      // Garante que as mudanças sejam detectadas dentro da zona do Angular
      this.zone.run(() => this.cdr.detectChanges());
    }
  }

  // Paginação simples: altera a página atual e recarrega os dados
  async changePage(delta: number) {
    const next = this.page + delta;
    if (next < 1) return; // evita ir para página menor que 1
    this.page = next;
    await this.loadVehicles();
  }

  // Cria um novo veículo usando os dados do createForm
  async onCreate() {
    // se o formulário for inválido, não prossegue
    if (this.createForm.invalid) return;

    this.createLoading = true;
    this.error = null;
    this.success = null;

    try {
      const raw = this.createForm.getRawValue();

      // Garante que `year` e `mileage` sejam números antes de enviar
      const payload = {
        ...raw,
        year: Number(raw.year),
        mileage: Number(raw.mileage),
      };

      // Chama o service para criar o veículo
      await firstValueFrom(this.vehiclesService.create(payload));

      // Reseta o formulário para os valores padrão após criar
      this.createForm.reset({
        plate: '',
        model: '',
        brand: '',
        year: new Date().getFullYear(),
        status: 'active',
        mileage: 0,
      });

      this.success = 'Veiculo criado.';
      // Recarrega a lista para incluir o novo registro
      await this.loadVehicles();
    } catch (err) {
      console.error('Erro ao criar veiculo', err);
      this.error = 'Erro ao criar veiculo.';
    } finally {
      this.createLoading = false;
      this.zone.run(() => this.cdr.detectChanges());
    }
  }

  // Entra no modo edição para o veículo passado como parâmetro
  startEdit(vehicle: Vehicle) {
    // Marca qual ID está em edição
    this.editingId = vehicle.id;

    // Preenche o formulário de edição com os dados atuais do veículo
    this.editForm.setValue({
      model: vehicle.model || '',
      brand: vehicle.brand || '',
      year: vehicle.year || new Date().getFullYear(),
      status: vehicle.status || 'active',
      mileage: vehicle.mileage ?? 0,
    });
  }

  // Cancela o modo de edição (não salva alterações)
  cancelEdit() {
    this.editingId = null;
  }

  // Salva as alterações feitas no formulário de edição
  async saveEdit(id: string) {
    // Se o formulário de edição for inválido, não prossegue
    if (this.editForm.invalid) return;

    this.editLoading = true;
    this.error = null;
    this.success = null;

    try {
      const raw = this.editForm.getRawValue();

      // Normaliza ano e km como números
      const payload = {
        ...raw,
        year: Number(raw.year),
        mileage: Number(raw.mileage),
      };

      // Chama o service para atualizar o veículo
      await firstValueFrom(this.vehiclesService.update(id, payload));

      // Sai do modo edição
      this.editingId = null;
      this.success = 'Veiculo atualizado.';

      // Recarrega a listagem com os dados atualizados
      await this.loadVehicles();
    } catch (err) {
      console.error('Erro ao atualizar veiculo', err);
      this.error = 'Erro ao atualizar veiculo.';
    } finally {
      this.editLoading = false;
      this.zone.run(() => this.cdr.detectChanges());
    }
  }

  // Remove um veículo após pedir confirmação ao usuário
  async delete(id: string) {
    // Confirmação simples via window.confirm
    const ok = confirm('Deseja excluir este veiculo?');
    if (!ok) return; // se o usuário cancelar, interrompe o fluxo

    this.deletingId = id; // armazena o ID que está sendo removido (para desabilitar botão, etc)
    this.error = null;
    this.success = null;

    try {
      // Chama o service para remover o veículo
      await firstValueFrom(this.vehiclesService.remove(id));
      this.success = 'Veiculo removido.';

      // Atualiza a listagem depois da exclusão
      await this.loadVehicles();
    } catch (err) {
      console.error('Erro ao excluir veiculo', err);
      this.error = 'Erro ao excluir veiculo.';
    } finally {
      this.deletingId = null;
      this.zone.run(() => this.cdr.detectChanges());
    }
  }
}
