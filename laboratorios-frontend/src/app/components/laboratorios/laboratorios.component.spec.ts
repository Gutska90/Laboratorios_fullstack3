import { ComponentFixture, TestBed } from '@angular/core/testing';
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
});

