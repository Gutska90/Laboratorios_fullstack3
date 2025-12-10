import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RegistroComponent } from './registro.component';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Usuario, Rol } from '../../models/usuario.model';

describe('RegistroComponent', () => {
  let component: RegistroComponent;
  let fixture: ComponentFixture<RegistroComponent>;
  let usuarioService: jasmine.SpyObj<UsuarioService>;
  let router: Router;

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
    rol: Rol.PACIENTE
  };

  beforeEach(async () => {
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['createUsuario']);

    await TestBed.configureTestingModule({
      imports: [RegistroComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegistroComponent);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.registroForm.get('email')?.value).toBe('');
    expect(component.registroForm.get('password')?.value).toBe('');
    expect(component.registroForm.get('rol')?.value).toBe(Rol.PACIENTE);
  });

  it('should have required validators on all fields', () => {
    expect(component.registroForm.get('email')?.hasError('required')).toBe(true);
    expect(component.registroForm.get('password')?.hasError('required')).toBe(true);
    expect(component.registroForm.get('confirmPassword')?.hasError('required')).toBe(true);
    expect(component.registroForm.get('nombre')?.hasError('required')).toBe(true);
    expect(component.registroForm.get('apellido')?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.registroForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should validate password match', () => {
    component.registroForm.patchValue({
      password: 'Password123!@#',
      confirmPassword: 'DifferentPassword123!@#'
    });
    expect(component.registroForm.hasError('passwordMismatch')).toBe(true);

    component.registroForm.patchValue({
      password: 'Password123!@#',
      confirmPassword: 'Password123!@#'
    });
    expect(component.registroForm.hasError('passwordMismatch')).toBe(false);
  });

  it('should call usuarioService.createUsuario on valid form submit', () => {
    usuarioService.createUsuario.and.returnValue(of(mockUsuario));

    component.registroForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!@#',
      confirmPassword: 'Password123!@#',
      nombre: 'Test',
      apellido: 'User',
      rol: Rol.PACIENTE
    });

    component.onSubmit();

    expect(usuarioService.createUsuario).toHaveBeenCalled();
  });

  it('should navigate to login after successful registration', (done) => {
    usuarioService.createUsuario.and.returnValue(of(mockUsuario));

    component.registroForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!@#',
      confirmPassword: 'Password123!@#',
      nombre: 'Test',
      apellido: 'User',
      rol: Rol.PACIENTE
    });

    component.onSubmit();

    setTimeout(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    }, 2100);
  });

  it('should set error message on registration failure', () => {
    const error = { error: { mensaje: 'Email ya existe' } };
    usuarioService.createUsuario.and.returnValue(throwError(() => error));

    component.registroForm.patchValue({
      email: 'test@example.com',
      password: 'Password123!@#',
      confirmPassword: 'Password123!@#',
      nombre: 'Test',
      apellido: 'User',
      rol: Rol.PACIENTE
    });

    component.onSubmit();

    expect(component.error).toBe('Email ya existe');
    expect(component.loading).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(usuarioService.createUsuario).not.toHaveBeenCalled();
  });
});

