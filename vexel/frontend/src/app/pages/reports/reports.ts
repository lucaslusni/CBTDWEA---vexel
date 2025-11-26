// Importa o decorador de componente do Angular
import { Component } from '@angular/core';
// Módulo básico com diretivas estruturais (*ngIf, *ngFor, etc.)
import { CommonModule } from '@angular/common';
// Serviço responsável por buscar o resumo de relatórios e tipo do retorno
import { ReportsService, ReportSummary } from '../../services/reports.service';
// Serviço responsável por listar veículos e tipo Vehicle
import { VehiclesService, Vehicle } from '../../services/vehicles.service';
// Operadores/Tipos do RxJS usados para lidar com Observables e erros
import { Observable, catchError, of, firstValueFrom } from 'rxjs';
// Ferramentas de formulário reativo fortemente tipadas
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',              // seletor utilizado no HTML para esse componente
  standalone: true,                    // componente standalone (não precisa ser declarado em módulo)
  imports: [CommonModule, ReactiveFormsModule], // módulos usados no template
  templateUrl: './reports.html',       // template HTML da tela
  styleUrls: ['./reports.scss'],       // estilos específicos deste componente
})
export class Reports {
  // Observable com o resumo de relatórios exibido nos cards superiores
  summary$: Observable<ReportSummary>;

  // Mensagem de erro geral para a área de resumo
  error: string | null = null;

  // Exposição explícita do Math para uso direto no template (ex.: Math.min)
  Math = Math;

  // Lista de veículos filtrados exibida na tabela inferior
  vehicles: Vehicle[] = [];

  // Flags e mensagens de estado da listagem de veículos
  loadingVehicles = false;
  vehiclesError: string | null = null;

  // Formulário reativo de filtros (status e brand)
  filtersForm: FormGroup<{
    status: FormControl<string>;
    brand: FormControl<string>;
  }>;

  constructor(
    private reportsService: ReportsService,     // injeta serviço de relatórios
    private vehiclesService: VehiclesService,   // injeta serviço de veículos
    fb: NonNullableFormBuilder                  // form builder com tipagem non-nullable
  ) {
    // Cria o stream do resumo chamando o service e tratando erros
    this.summary$ = this.reportsService.summary().pipe(
      // catchError intercepta qualquer erro do Observable
      catchError(err => {
        console.error('Erro ao carregar relatórios', err);
        // Seta mensagem que será exibida no template
        this.error = 'Não foi possível carregar os relatórios.';
        // Retorna um objeto “vazio” de resumo para o template continuar funcionando
        return of({
          total: 0,
          ativos: 0,
          mediaAno: 0,
          mediaKm: 0,
          maisNovo: null,
          maisAntigo: null,
        });
      })
    );

    // Cria o form reativo de filtros com valores iniciais vazios
    this.filtersForm = fb.group({
      status: [''],
      brand: [''],
    });

    // Já carrega a tabela de veículos assim que o componente é construído
    this.loadVehicles();
  }

  // Método responsável por buscar a lista de veículos aplicando filtros
  async loadVehicles() {
    this.loadingVehicles = true;   // ativa “estado de carregando”
    this.vehiclesError = null;     // limpa erros anteriores

    try {
      // Converte o Observable retornado pelo service para uma Promise
      // permitindo o uso de async/await
      const res = await firstValueFrom(
        this.vehiclesService.list({
          // Trim para evitar espaços extras e se vazio vira undefined (filtro não aplicado)
          status: this.filtersForm.value.status?.trim() || undefined,
          brand: this.filtersForm.value.brand?.trim() || undefined,
        })
      );

      // O backend pode retornar um array direto ou um objeto paginado (com items)
      const items = Array.isArray(res) ? res : res?.items;
      // Garante que vehicles seja sempre um array
      this.vehicles = items || [];
    } catch (err) {
      console.error('Erro ao carregar veículos no relatório', err);
      // Mensagem exibida na área de listagem de veículos
      this.vehiclesError = 'Não foi possível carregar os veículos.';
    } finally {
      // Desliga o estado de carregamento em qualquer cenário (sucesso ou erro)
      this.loadingVehicles = false;
    }
  }
}
