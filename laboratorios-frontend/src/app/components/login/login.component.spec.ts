import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Usuario, Rol, LoginResponse } from '../../models/usuario.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
    rol: Rol.PACIENTE
  };

  const mockLoginResponse: LoginResponse = {
    token: 'mock-token',
    usuario: mockUsuario
  };

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should have required validators on email and password', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    expect(emailControl?.hasError('required')).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should call authService.login on valid form submit', () => {
    authService.login.and.returnValue(of(mockLoginResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123'
    });
  });

  it('should navigate to dashboard for ADMINISTRADOR role', () => {
    const adminResponse: LoginResponse = {
      token: 'token',
      usuario: { ...mockUsuario, rol: Rol.ADMINISTRADOR }
    };
    authService.login.and.returnValue(of(adminResponse));

    component.loginForm.patchValue({
      email: 'admin@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should navigate to resultados for PACIENTE role', () => {
    authService.login.and.returnValue(of(mockLoginResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/resultados']);
  });

  it('should set error message on login failure', () => {
    const error = { error: { mensaje: 'Credenciales inválidas' } };
    authService.login.and.returnValue(throwError(() => error));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    component.onSubmit();

    expect(component.error).toBe('Credenciales inválidas');
    expect(component.loading).toBe(false);
  });

  it('should set loading to true when submitting', () => {
    authService.login.and.returnValue(of(mockLoginResponse));

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    component.onSubmit();

    expect(component.loading).toBe(false); // Should be false after completion
  });

  it('should not submit if form is invalid', () => {
    component.loginForm.patchValue({
      email: '',
      password: ''
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });
});

