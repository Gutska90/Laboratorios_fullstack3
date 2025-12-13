import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { PerfilComponent } from './perfil.component';
import { AuthService } from '../../services/auth.service';
import { UsuarioService } from '../../services/usuario.service';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Usuario, Rol } from '../../models/usuario.model';

describe('PerfilComponent', () => {
  let component: PerfilComponent;
  let fixture: ComponentFixture<PerfilComponent>;
  let authService: jasmine.SpyObj<AuthService>;
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
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const usuarioServiceSpy = jasmine.createSpyObj('UsuarioService', ['updateUsuario']);

    await TestBed.configureTestingModule({
      imports: [PerfilComponent, ReactiveFormsModule, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UsuarioService, useValue: usuarioServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    usuarioService = TestBed.inject(UsuarioService) as jasmine.SpyObj<UsuarioService>;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');

    authService.getCurrentUser.and.returnValue(mockUsuario);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to login if user is not logged in', () => {
    authService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should load user data on init', () => {
    fixture.detectChanges();
    expect(component.usuario).toEqual(mockUsuario);
    expect(component.perfilForm.get('email')?.value).toBe('test@example.com');
    expect(component.perfilForm.get('nombre')?.value).toBe('Test');
    expect(component.perfilForm.get('apellido')?.value).toBe('User');
  });

  it('should toggle password fields', () => {
    expect(component.showPasswordFields).toBe(false);
    component.togglePasswordFields();
    expect(component.showPasswordFields).toBe(true);
    expect(component.perfilForm.get('password')?.hasError('required')).toBeFalsy();
    
    component.togglePasswordFields();
    expect(component.showPasswordFields).toBe(false);
    expect(component.perfilForm.get('password')?.value).toBe('');
  });

  it('should update profile without password', (done) => {
    usuarioService.updateUsuario.and.returnValue(of(mockUsuario));
    fixture.detectChanges();

    component.perfilForm.patchValue({
      email: 'newemail@example.com',
      nombre: 'New Name',
      apellido: 'New Last'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(usuarioService.updateUsuario).toHaveBeenCalled();
      expect(component.loading).toBe(false);
      done();
    }, 100);
  });

  it('should update profile with password', (done) => {
    usuarioService.updateUsuario.and.returnValue(of(mockUsuario));
    fixture.detectChanges();
    component.showPasswordFields = true;
    component.togglePasswordFields();

    component.perfilForm.patchValue({
      email: 'newemail@example.com',
      nombre: 'New Name',
      apellido: 'New Last',
      password: 'NewPass123!@#',
      confirmPassword: 'NewPass123!@#'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(usuarioService.updateUsuario).toHaveBeenCalled();
      done();
    }, 100);
  });

  it('should show error if passwords do not match', () => {
    fixture.detectChanges();
    // Ensure usuario is set
    expect(component.usuario).toBeTruthy();
    
    // Enable password fields - togglePasswordFields alternates the value
    // Initially showPasswordFields is false, so calling togglePasswordFields makes it true
    component.togglePasswordFields();
    
    // Verify showPasswordFields is true
    expect(component.showPasswordFields).toBe(true);

    // Set valid password that passes all validations
    const validPassword = 'Password123!@#';
    const differentPassword = 'DifferentPassword123!@#';
    
    // Set values directly on form controls to ensure they're set
    component.perfilForm.get('email')?.setValue('test@example.com');
    component.perfilForm.get('nombre')?.setValue('Test');
    component.perfilForm.get('apellido')?.setValue('User');
    component.perfilForm.get('password')?.setValue(validPassword);
    component.perfilForm.get('confirmPassword')?.setValue(differentPassword);
    
    // Verify values are set correctly
    expect(component.perfilForm.get('password')?.value).toBe(validPassword);
    expect(component.perfilForm.get('confirmPassword')?.value).toBe(differentPassword);
    expect(component.perfilForm.get('password')?.value).not.toBe(component.perfilForm.get('confirmPassword')?.value);
    
    // Clear errors to make form valid
    ['email', 'nombre', 'apellido', 'password', 'confirmPassword'].forEach(key => {
      const control = component.perfilForm.get(key);
      if (control) {
        control.setErrors(null);
        control.markAsDirty();
        control.markAsTouched();
      }
    });
    
    // Update form validity
    component.perfilForm.updateValueAndValidity();
    
    // Verify form is valid and showPasswordFields is true
    expect(component.perfilForm.valid).toBe(true);
    expect(component.showPasswordFields).toBe(true);
    expect(component.usuario).toBeTruthy();

    // Mock updateUsuario (should not be called because passwords don't match)
    usuarioService.updateUsuario.and.returnValue(of(mockUsuario));

    // Call onSubmit - should detect password mismatch and return early
    component.onSubmit();

    // Verify error message is set and updateUsuario was not called
    expect(component.error).toBe('Las contraseñas no coinciden');
    expect(component.loading).toBe(false);
    expect(usuarioService.updateUsuario).not.toHaveBeenCalled();
  });

  it('should handle error when updating profile fails', (done) => {
    const error = { error: { mensaje: 'Error al actualizar' } };
    usuarioService.updateUsuario.and.returnValue(throwError(() => error));
    fixture.detectChanges();

    component.perfilForm.patchValue({
      email: 'newemail@example.com',
      nombre: 'New Name',
      apellido: 'New Last'
    });

    component.onSubmit();

    setTimeout(() => {
      expect(component.error).toBe('Error al actualizar');
      expect(component.loading).toBe(false);
      done();
    }, 100);
  });

  it('should logout and navigate after successful update', fakeAsync(() => {
    usuarioService.updateUsuario.and.returnValue(of(mockUsuario));
    fixture.detectChanges();

    component.perfilForm.patchValue({
      email: 'newemail@example.com',
      nombre: 'New Name',
      apellido: 'New Last'
    });

    component.onSubmit();
    tick(100); // Wait for async operation
    expect(component.loading).toBe(false);
    expect(component.success).toBe('Perfil actualizado exitosamente');
    
    tick(2100); // Wait for setTimeout
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  it('should not submit if form is invalid', () => {
    fixture.detectChanges();
    component.perfilForm.patchValue({
      email: '',
      nombre: '',
      apellido: ''
    });

    component.onSubmit();

    expect(usuarioService.updateUsuario).not.toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    fixture.detectChanges();
    component.togglePasswordFields();
    const subscription = component['passwordSubscription'];
    
    component.ngOnDestroy();
    
    expect(subscription?.closed).toBeTruthy();
  });

  it('should validate form fields', () => {
    fixture.detectChanges();
    // Reset form to test validators
    component.perfilForm.patchValue({
      email: '',
      nombre: '',
      apellido: ''
    });
    component.perfilForm.markAllAsTouched();
    
    expect(component.perfilForm.get('email')?.hasError('required')).toBe(true);
    expect(component.perfilForm.get('nombre')?.hasError('required')).toBe(true);
    expect(component.perfilForm.get('apellido')?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    fixture.detectChanges();
    const emailControl = component.perfilForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should handle password change subscription', () => {
    fixture.detectChanges();
    component.togglePasswordFields();
    const passwordControl = component.perfilForm.get('password');
    passwordControl?.setValue('Test123!@#');
    
    expect(component['passwordSubscription']).toBeTruthy();
  });
});

