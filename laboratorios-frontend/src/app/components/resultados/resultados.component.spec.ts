import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ResultadosComponent } from './resultados.component';
import { ResultadoService } from '../../services/resultado.service';
import { LaboratorioService } from '../../services/laboratorio.service';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ResultadoAnalisis, ResultadoRequest } from '../../models/resultado.model';
import { Laboratorio } from '../../models/laboratorio.model';
import { Usuario, Rol } from '../../models/usuario.model';

describe('ResultadosComponent', () => {
  let component: ResultadosComponent;
  let fixture: ComponentFixture<ResultadosComponent>;
  let resultadoService: jasmine.SpyObj<ResultadoService>;
  let laboratorioService: jasmine.SpyObj<LaboratorioService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockResultados: ResultadoAnalisis[] = [
    { id: 1, pacienteId: 1, laboratorioId: 1, tipoAnalisis: 'Test 1', resultado: 'OK', fechaAnalisis: '2024-01-01' },
    { id: 2, pacienteId: 2, laboratorioId: 1, tipoAnalisis: 'Test 2', resultado: 'OK', fechaAnalisis: '2024-01-02' }
  ];

  const mockLaboratorios: Laboratorio[] = [
    { id: 1, nombre: 'Lab 1', direccion: 'Dir 1', telefono: '123', tipo: 'CLINICO' }
  ];

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
    rol: Rol.PACIENTE
  };

  beforeEach(async () => {
    const resultadoServiceSpy = jasmine.createSpyObj('ResultadoService', [
      'cargarResultados', 'getResultadosLocal', 'createResultado', 'updateResultado', 'deleteResultado'
    ]);
    const laboratorioServiceSpy = jasmine.createSpyObj('LaboratorioService', [
      'cargarLaboratorios', 'getLaboratoriosLocal'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'hasRole']);

    await TestBed.configureTestingModule({
      imports: [ResultadosComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: ResultadoService, useValue: resultadoServiceSpy },
        { provide: LaboratorioService, useValue: laboratorioServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadosComponent);
    component = fixture.componentInstance;
    resultadoService = TestBed.inject(ResultadoService) as jasmine.SpyObj<ResultadoService>;
    laboratorioService = TestBed.inject(LaboratorioService) as jasmine.SpyObj<LaboratorioService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    resultadoService.getResultadosLocal.and.returnValue(mockResultados);
    resultadoService.cargarResultados.and.returnValue(of(mockResultados));
    laboratorioService.getLaboratoriosLocal.and.returnValue(mockLaboratorios);
    laboratorioService.cargarLaboratorios.and.returnValue(of(mockLaboratorios));
    authService.getCurrentUser.and.returnValue(mockUsuario);
    authService.hasRole.and.returnValue(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load datos on init', () => {
    fixture.detectChanges();
    expect(resultadoService.cargarResultados).toHaveBeenCalled();
    expect(laboratorioService.cargarLaboratorios).toHaveBeenCalled();
  });

  it('should set pacienteId for PACIENTE role', () => {
    fixture.detectChanges();
    expect(component.resultadoForm.get('pacienteId')?.value).toBe(1);
  });

  it('should create resultado on submit', () => {
    resultadoService.createResultado.and.returnValue(of(mockResultados[0]));

    component.resultadoForm.patchValue({
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'New Test',
      resultado: 'Result',
      fechaAnalisis: '2024-01-03'
    });

    component.onSubmit();

    expect(resultadoService.createResultado).toHaveBeenCalled();
  });

  it('should filter resultados for PACIENTE', () => {
    fixture.detectChanges();
    const filtered = component.getResultadosFiltrados();
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(r => r.pacienteId === 1)).toBe(true);
  });
});

