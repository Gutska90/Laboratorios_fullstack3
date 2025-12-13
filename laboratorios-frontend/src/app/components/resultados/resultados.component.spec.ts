import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  it('should return all resultados for non-PACIENTE users', () => {
    authService.getCurrentUser.and.returnValue({ ...mockUsuario, rol: 'ADMINISTRADOR' as any });
    fixture.detectChanges();
    const filtered = component.getResultadosFiltrados();
    expect(filtered.length).toBe(mockResultados.length);
  });

  it('should return all resultados when user is null', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    const filtered = component.getResultadosFiltrados();
    expect(filtered.length).toBe(mockResultados.length);
  });

  it('should handle error when loading datos fails', () => {
    const error = { error: { mensaje: 'Error de conexión' } };
    resultadoService.cargarResultados.and.returnValue(throwError(() => error));

    component.cargarDatos();

    expect(component.loading).toBe(false);
  });

  it('should handle error when creating resultado fails', fakeAsync(() => {
    const error = { error: { mensaje: 'Error al crear' } };
    resultadoService.createResultado.and.returnValue(throwError(() => error));

    component.resultadoForm.patchValue({
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'New Test',
      resultado: 'Result',
      fechaAnalisis: '2024-01-03'
    });

    component.onSubmit();
    tick(100);

    expect(resultadoService.createResultado).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    
    tick(5100); // Wait for error timeout
    expect(component.error).toBe('');
  }));

  it('should handle error when updating resultado fails', fakeAsync(() => {
    const error = { error: { mensaje: 'Error al actualizar' } };
    resultadoService.updateResultado.and.returnValue(throwError(() => error));
    component.editingId = 1;

    component.resultadoForm.patchValue({
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'Updated Test',
      resultado: 'Updated Result',
      fechaAnalisis: '2024-01-03'
    });

    component.onSubmit();
    tick(100);

    expect(resultadoService.updateResultado).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    
    tick(5100); // Wait for error timeout
    expect(component.error).toBe('');
  }));

  it('should handle error when deleting resultado fails', fakeAsync(() => {
    const error = { error: { mensaje: 'Error al eliminar' } };
    resultadoService.deleteResultado.and.returnValue(throwError(() => error));
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarResultado(1);
    tick(100);

    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    
    tick(5100); // Wait for error timeout
    expect(component.error).toBe('');
  }));

  it('should not delete if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.eliminarResultado(1);

    expect(resultadoService.deleteResultado).not.toHaveBeenCalled();
  });

  it('should reset form when toggling form off', () => {
    component.showForm = true;
    component.editingId = 1;
    component.resultadoForm.patchValue({ tipoAnalisis: 'Test' });

    component.toggleForm();

    expect(component.showForm).toBe(false);
    expect(component.editingId).toBeNull();
    expect(component.resultadoForm.get('tipoAnalisis')?.value).toBeNull();
  });

  it('should not submit if form is invalid', () => {
    component.resultadoForm.patchValue({
      pacienteId: '',
      laboratorioId: '',
      tipoAnalisis: '',
      resultado: ''
    });

    component.onSubmit();

    expect(resultadoService.createResultado).not.toHaveBeenCalled();
    expect(resultadoService.updateResultado).not.toHaveBeenCalled();
  });

  it('should check if user is admin', () => {
    component.isAdmin();
    expect(authService.hasRole).toHaveBeenCalledWith('ADMINISTRADOR');
  });

  it('should check if user is tecnico', () => {
    component.isTecnico();
    expect(authService.hasRole).toHaveBeenCalledWith('TECNICO_LABORATORIO');
  });

  it('should validate form fields', () => {
    const pacienteIdControl = component.resultadoForm.get('pacienteId');
    const laboratorioIdControl = component.resultadoForm.get('laboratorioId');
    const tipoAnalisisControl = component.resultadoForm.get('tipoAnalisis');
    const resultadoControl = component.resultadoForm.get('resultado');

    expect(pacienteIdControl?.hasError('required')).toBe(true);
    expect(laboratorioIdControl?.hasError('required')).toBe(true);
    expect(tipoAnalisisControl?.hasError('required')).toBe(true);
    expect(resultadoControl?.hasError('required')).toBe(true);
  });

  it('should validate tipoAnalisis minLength', () => {
    fixture.detectChanges();
    const tipoAnalisisControl = component.resultadoForm.get('tipoAnalisis');
    // Set value with less than 3 characters
    tipoAnalisisControl?.setValue('AB');
    tipoAnalisisControl?.markAsTouched();
    tipoAnalisisControl?.updateValueAndValidity();
    // Verify the control has minlength error (Angular uses lowercase 'minlength')
    expect(tipoAnalisisControl?.invalid).toBe(true);
    expect(tipoAnalisisControl?.hasError('minlength')).toBe(true);
  });

  it('should not set pacienteId if user is not PACIENTE', () => {
    authService.getCurrentUser.and.returnValue({ ...mockUsuario, rol: 'ADMINISTRADOR' as any });
    fixture.detectChanges();
    expect(component.resultadoForm.get('pacienteId')?.value).toBe('');
  });

  it('should not set pacienteId if user is null', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    expect(component.resultadoForm.get('pacienteId')?.value).toBe('');
  });

  it('should handle successful delete with timeout', fakeAsync(() => {
    resultadoService.deleteResultado.and.returnValue(of(undefined as any));
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarResultado(1);
    tick(100);
    expect(component.loading).toBe(false);
    expect(component.success).toBeTruthy();
    
    tick(5100);
    expect(component.success).toBe('');
  }));

  it('should handle successful create with timeout', fakeAsync(() => {
    resultadoService.createResultado.and.returnValue(of(mockResultados[0]));
    component.showForm = true; // Initialize showForm

    component.resultadoForm.patchValue({
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'New Test',
      resultado: 'Result',
      fechaAnalisis: '2024-01-03'
    });

    component.onSubmit();
    tick(100);
    expect(component.success).toBeTruthy();
    
    tick(1600);
    expect(component.showForm).toBe(false);
  }));

  it('should handle successful update with timeout', fakeAsync(() => {
    resultadoService.updateResultado.and.returnValue(of(mockResultados[0]));
    component.editingId = 1;
    component.showForm = true; // Initialize showForm

    component.resultadoForm.patchValue({
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'Updated Test',
      resultado: 'Updated Result',
      fechaAnalisis: '2024-01-03'
    });

    component.onSubmit();
    tick(100);
    expect(component.success).toBeTruthy();
    
    tick(1600);
    expect(component.showForm).toBe(false);
  }));

  it('should handle error timeout', fakeAsync(() => {
    const error = { error: { mensaje: 'Error' } };
    resultadoService.createResultado.and.returnValue(throwError(() => error));

    component.resultadoForm.patchValue({
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'New Test',
      resultado: 'Result',
      fechaAnalisis: '2024-01-03'
    });

    component.onSubmit();
    tick(100);
    expect(component.error).toBeTruthy();
    
    tick(5100);
    expect(component.error).toBe('');
  }));
});

