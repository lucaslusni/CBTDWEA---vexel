// Importa utilitários de teste do Angular
import { ComponentFixture, TestBed } from '@angular/core/testing';

// Importa o componente standalone que será testado
import { Reports } from './reports';

describe('Reports', () => {
  // Referência para a instância do componente
  let component: Reports;
  // Referência para o "fixture", que encapsula o componente + template
  let fixture: ComponentFixture<Reports>;

  // Antes de cada teste, configura o módulo de teste
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como o Reports é standalone, ele vai em "imports"
      imports: [Reports]
    })
    .compileComponents(); // Compila os componentes declarados/importados

    // Cria uma instância do componente dentro do ambiente de teste
    fixture = TestBed.createComponent(Reports);
    component = fixture.componentInstance;

    // Dispara o primeiro ciclo de detecção de mudanças (ngOnInit, etc.)
    fixture.detectChanges();
  });

  // Teste básico para verificar se o componente foi criado sem erros
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
