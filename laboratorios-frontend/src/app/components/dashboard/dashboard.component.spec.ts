import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { LaboratorioService } from '../../services/laboratorio.service';
import { ResultadoService } from '../../services/resultado.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Usuario, Rol } from '../../models/usuario.model';
import { Laboratorio } from '../../models/laboratorio.model';
import { ResultadoAnalisis } from '../../models/resultado.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let laboratorioService: jasmine.SpyObj<LaboratorioService>;
  let resultadoService: jasmine.SpyObj<ResultadoService>;
  let router: Router;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
    rol: Rol.ADMINISTRADOR
  };

  const mockUsuarios: Usuario[] = [mockUsuario];
  const mockLaboratorios: Laboratorio[] = [
    { id: 1, nombre: 'Lab 1', direccion: 'Dir 1', telefono: '123', tipo: 'CLINICO' }
  ];
  const mockResultados: ResultadoAnalisis[] = [
    { id: 1, pacienteId: 1, laboratorioId: 1, tipoAnalisis: 'Test', resultado: 'OK', fechaAnalisis: '2024-01-01' }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['cargarUsuarios', 'getUsuariosLocal']);
    const laboratorioServiceSpy = jasmine.createSpyObj('LaboratorioService', ['cargarLaboratorios', 'getLaboratoriosLocal']);
    const resultadoServiceSpy = jasmine.createSpyObj('ResultadoService', ['cargarResultados', 'getResultadosLocal']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy },
        { provide: LaboratorioService, useValue: laboratorioServiceSpy },
        { provide: ResultadoService, useValue: resultadoServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    laboratorioService = TestBed.inject(LaboratorioService) as jasmine.SpyObj<LaboratorioService>;
    resultadoService = TestBed.inject(ResultadoService) as jasmine.SpyObj<ResultadoService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    authService.getCurrentUser.and.returnValue(mockUsuario);
    usuarioService.getUsuariosLocal.and.returnValue(mockUsuarios);
    usuarioService.cargarUsuarios.and.returnValue(of(mockUsuarios));
    laboratorioService.getLaboratoriosLocal.and.returnValue(mockLaboratorios);
    laboratorioService.cargarLaboratorios.and.returnValue(of(mockLaboratorios));
    resultadoService.getResultadosLocal.and.returnValue(mockResultados);
    resultadoService.cargarResultados.and.returnValue(of(mockResultados));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user on init', () => {
    fixture.detectChanges();
    expect(authService.getCurrentUser).toHaveBeenCalled();
    expect(component.usuario).toEqual(mockUsuario);
  });

  it('should load data on init', () => {
    fixture.detectChanges();
    expect(usuarioService.cargarUsuarios).toHaveBeenCalled();
    expect(laboratorioService.cargarLaboratorios).toHaveBeenCalled();
    expect(resultadoService.cargarResultados).toHaveBeenCalled();
  });

  it('should set loading to false after data load', () => {
    fixture.detectChanges();
    expect(component.loading).toBe(false);
  });

  it('should logout and navigate to login', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});

