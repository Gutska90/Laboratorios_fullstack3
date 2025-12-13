import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LaboratoriosComponent } from './laboratorios.component';
import { LaboratorioService } from '../../services/laboratorio.service';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Laboratorio, LaboratorioRequest } from '../../models/laboratorio.model';

describe('LaboratoriosComponent', () => {
  let component: LaboratoriosComponent;
  let fixture: ComponentFixture<LaboratoriosComponent>;
  let laboratorioService: jasmine.SpyObj<LaboratorioService>;
  let authService: jasmine.SpyObj<AuthService>;

  const mockLaboratorios: Laboratorio[] = [
    { id: 1, nombre: 'Lab 1', direccion: 'Dir 1', telefono: '123', tipo: 'CLINICO', activo: true },
    { id: 2, nombre: 'Lab 2', direccion: 'Dir 2', telefono: '456', tipo: 'ESPECIALIZADO', activo: true }
  ];

  beforeEach(async () => {
    const laboratorioServiceSpy = jasmine.createSpyObj('LaboratorioService', [
      'cargarLaboratorios', 'getLaboratoriosLocal', 'createLaboratorio', 'updateLaboratorio', 'deleteLaboratorio'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);

    await TestBed.configureTestingModule({
      imports: [LaboratoriosComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: LaboratorioService, useValue: laboratorioServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratoriosComponent);
    component = fixture.componentInstance;
    laboratorioService = TestBed.inject(LaboratorioService) as jasmine.SpyObj<LaboratorioService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    laboratorioService.getLaboratoriosLocal.and.returnValue(mockLaboratorios);
    laboratorioService.cargarLaboratorios.and.returnValue(of(mockLaboratorios));
    authService.hasRole.and.returnValue(true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load laboratorios on init', () => {
    fixture.detectChanges();
    expect(laboratorioService.cargarLaboratorios).toHaveBeenCalled();
  });

  it('should initialize form with validators', () => {
    expect(component.laboratorioForm.get('nombre')?.hasError('required')).toBe(true);
    expect(component.laboratorioForm.get('direccion')?.hasError('required')).toBe(true);
    expect(component.laboratorioForm.get('telefono')?.hasError('required')).toBe(true);
    expect(component.laboratorioForm.get('tipo')?.hasError('required')).toBe(true);
  });

  it('should toggle form visibility', () => {
    expect(component.showForm).toBe(false);
    component.toggleForm();
    expect(component.showForm).toBe(true);
    component.toggleForm();
    expect(component.showForm).toBe(false);
  });

  it('should edit laboratorio', () => {
    component.editarLaboratorio(mockLaboratorios[0]);
    expect(component.editingId).toBe(1);
    expect(component.showForm).toBe(true);
    expect(component.laboratorioForm.get('nombre')?.value).toBe('Lab 1');
  });

  it('should create laboratorio on submit', () => {
    laboratorioService.createLaboratorio.and.returnValue(of(mockLaboratorios[0]));

    component.laboratorioForm.patchValue({
      nombre: 'New Lab',
      direccion: 'New Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();

    expect(laboratorioService.createLaboratorio).toHaveBeenCalled();
  });

  it('should update laboratorio on submit when editing', () => {
    laboratorioService.updateLaboratorio.and.returnValue(of(mockLaboratorios[0]));
    component.editingId = 1;

    component.laboratorioForm.patchValue({
      nombre: 'Updated Lab',
      direccion: 'Updated Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();

    expect(laboratorioService.updateLaboratorio).toHaveBeenCalled();
  });

  it('should check if user is admin', () => {
    component.isAdmin();
    expect(authService.hasRole).toHaveBeenCalledWith('ADMINISTRADOR');
  });

  it('should handle error when loading laboratorios fails', () => {
    const error = { error: { mensaje: 'Error de conexión' } };
    laboratorioService.cargarLaboratorios.and.returnValue(throwError(() => error));

    component.cargarLaboratorios();

    expect(component.loading).toBe(false);
  });

  it('should handle error when creating laboratorio fails', fakeAsync(() => {
    const error = { error: { mensaje: 'Error al crear' } };
    laboratorioService.createLaboratorio.and.returnValue(throwError(() => error));

    component.laboratorioForm.patchValue({
      nombre: 'New Lab',
      direccion: 'New Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();
    tick(100);

    expect(laboratorioService.createLaboratorio).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    
    tick(5100); // Wait for error timeout
    expect(component.error).toBe('');
  }));

  it('should handle error when updating laboratorio fails', fakeAsync(() => {
    const error = { error: { mensaje: 'Error al actualizar' } };
    laboratorioService.updateLaboratorio.and.returnValue(throwError(() => error));
    component.editingId = 1;

    component.laboratorioForm.patchValue({
      nombre: 'Updated Lab',
      direccion: 'Updated Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();
    tick(100);

    expect(laboratorioService.updateLaboratorio).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
    
    tick(5100); // Wait for error timeout
    expect(component.error).toBe('');
  }));

  it('should handle error when deleting laboratorio fails', () => {
    const error = { error: { mensaje: 'Error al eliminar' } };
    laboratorioService.deleteLaboratorio.and.returnValue(throwError(() => error));
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarLaboratorio(1);

    expect(component.loading).toBe(false);
    expect(component.error).toBeTruthy();
  });

  it('should not delete if user cancels confirmation', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.eliminarLaboratorio(1);

    expect(laboratorioService.deleteLaboratorio).not.toHaveBeenCalled();
  });

  it('should reset form when toggling form off', () => {
    component.showForm = true;
    component.editingId = 1;
    component.laboratorioForm.patchValue({ nombre: 'Test' });

    component.toggleForm();

    expect(component.showForm).toBe(false);
    expect(component.editingId).toBeNull();
    expect(component.laboratorioForm.get('nombre')?.value).toBeNull();
  });

  it('should not submit if form is invalid', () => {
    component.laboratorioForm.patchValue({
      nombre: '', // Invalid
      direccion: '',
      telefono: '',
      tipo: ''
    });

    component.onSubmit();

    expect(laboratorioService.createLaboratorio).not.toHaveBeenCalled();
    expect(laboratorioService.updateLaboratorio).not.toHaveBeenCalled();
  });

  it('should validate form fields', () => {
    const nombreControl = component.laboratorioForm.get('nombre');
    const direccionControl = component.laboratorioForm.get('direccion');
    const telefonoControl = component.laboratorioForm.get('telefono');
    const tipoControl = component.laboratorioForm.get('tipo');

    expect(nombreControl?.hasError('required')).toBe(true);
    expect(direccionControl?.hasError('required')).toBe(true);
    expect(telefonoControl?.hasError('required')).toBe(true);
    expect(tipoControl?.hasError('required')).toBe(true);
  });

  it('should validate nombre minLength', () => {
    const nombreControl = component.laboratorioForm.get('nombre');
    nombreControl?.setValue('AB'); // Less than 3 characters
    nombreControl?.markAsTouched();
    nombreControl?.updateValueAndValidity();
    // Check if control is invalid and has minlength error
    expect(nombreControl?.invalid).toBe(true);
    expect(nombreControl?.hasError('minlength')).toBe(true);
  });

  it('should validate direccion minLength', () => {
    const direccionControl = component.laboratorioForm.get('direccion');
    direccionControl?.setValue('123'); // Less than 5 characters
    direccionControl?.markAsTouched();
    direccionControl?.updateValueAndValidity();
    // Check if control is invalid and has minlength error
    expect(direccionControl?.invalid).toBe(true);
    expect(direccionControl?.hasError('minlength')).toBe(true);
  });

  it('should validate telefono pattern', () => {
    const telefonoControl = component.laboratorioForm.get('telefono');
    telefonoControl?.setValue('invalid-phone');
    expect(telefonoControl?.hasError('pattern')).toBe(true);
  });

  it('should handle successful delete with timeout', fakeAsync(() => {
    laboratorioService.deleteLaboratorio.and.returnValue(of(undefined as any));
    spyOn(window, 'confirm').and.returnValue(true);

    component.eliminarLaboratorio(1);
    tick(100);
    expect(component.loading).toBe(false);
    expect(component.success).toBeTruthy();
    
    tick(5100);
    expect(component.success).toBe('');
  }));

  it('should handle successful create with timeout', fakeAsync(() => {
    laboratorioService.createLaboratorio.and.returnValue(of(mockLaboratorios[0]));
    component.showForm = true; // Initialize showForm

    component.laboratorioForm.patchValue({
      nombre: 'New Lab',
      direccion: 'New Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();
    tick(100);
    expect(component.success).toBeTruthy();
    
    tick(1600);
    expect(component.showForm).toBe(false);
  }));

  it('should handle successful update with timeout', fakeAsync(() => {
    laboratorioService.updateLaboratorio.and.returnValue(of(mockLaboratorios[0]));
    component.editingId = 1;
    component.showForm = true; // Initialize showForm

    component.laboratorioForm.patchValue({
      nombre: 'Updated Lab',
      direccion: 'Updated Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();
    tick(100);
    expect(component.success).toBeTruthy();
    
    tick(1600);
    expect(component.showForm).toBe(false);
  }));

  it('should handle error timeout', fakeAsync(() => {
    const error = { error: { mensaje: 'Error' } };
    laboratorioService.createLaboratorio.and.returnValue(throwError(() => error));

    component.laboratorioForm.patchValue({
      nombre: 'New Lab',
      direccion: 'New Dir',
      telefono: '789',
      tipo: 'CLINICO'
    });

    component.onSubmit();
    tick(100);
    expect(component.error).toBeTruthy();
    
    tick(5100);
    expect(component.error).toBe('');
  }));
});

