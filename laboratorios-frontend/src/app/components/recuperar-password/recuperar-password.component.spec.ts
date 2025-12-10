import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RecuperarPasswordComponent } from './recuperar-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('RecuperarPasswordComponent', () => {
  let component: RecuperarPasswordComponent;
  let fixture: ComponentFixture<RecuperarPasswordComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecuperarPasswordComponent, ReactiveFormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RecuperarPasswordComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email', () => {
    expect(component.recuperarForm.get('email')?.value).toBe('');
  });

  it('should have required validator on email', () => {
    const emailControl = component.recuperarForm.get('email');
    expect(emailControl?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const emailControl = component.recuperarForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should submit form and show success message', () => {
    component.recuperarForm.patchValue({
      email: 'test@example.com'
    });

    component.onSubmit();

    expect(component.success).toBe(true);
    expect(component.message).toBe('Se ha enviado un enlace de recuperación a tu email.');
  });

  it('should not submit if form is invalid', () => {
    component.recuperarForm.patchValue({
      email: ''
    });

    component.onSubmit();

    expect(component.success).toBe(false);
  });

  it('should show form when not successful', () => {
    component.success = false;
    fixture.detectChanges();
    const form = fixture.nativeElement.querySelector('form');
    expect(form).toBeTruthy();
  });

  it('should show success message when successful', () => {
    component.success = true;
    component.message = 'Test message';
    fixture.detectChanges();
    const alert = fixture.nativeElement.querySelector('.alert-success');
    expect(alert).toBeTruthy();
    expect(alert.textContent).toContain('Test message');
  });
});

