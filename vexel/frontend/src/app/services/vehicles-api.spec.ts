import { TestBed } from '@angular/core/testing';

import { VehiclesApi } from './vehicles-api';

describe('VehiclesApi', () => {
  let service: VehiclesApi;

  // beforeEach roda antes de cada teste deste bloco `describe`
  beforeEach(() => {
    // Configura o módulo de teste do Angular
    // Aqui está vazio, mas é o suficiente para permitir injeção do serviço
    TestBed.configureTestingModule({});

    // Pega uma instância do serviço a partir do TestBed (injeção de dependência)
    service = TestBed.inject(VehiclesApi);
  });

  // Teste básico: garante que o serviço foi criado corretamente
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
