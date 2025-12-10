import { FormControl } from '@angular/forms';
import { passwordValidator } from './password.validator';

describe('passwordValidator', () => {
  let control: FormControl;

  beforeEach(() => {
    control = new FormControl('', passwordValidator());
  });

  it('should return null for empty value (let required handle it)', () => {
    control.setValue('');
    expect(control.errors).toBeNull();
  });

  it('should return null for valid password', () => {
    control.setValue('Password123!@#');
    expect(control.errors).toBeNull();
  });

  it('should return error for password shorter than 8 characters', () => {
    control.setValue('Pass1!');
    expect(control.errors).toBeTruthy();
    expect(control.errors!['minLength']).toBeTruthy();
    expect(control.errors!['minLength'].message).toBe('La contraseña debe tener al menos 8 caracteres');
  });

  it('should return error for password longer than 50 characters', () => {
    const longPassword = 'A'.repeat(51) + '1!';
    control.setValue(longPassword);
    expect(control.errors).toBeTruthy();
    expect(control.errors!['maxLength']).toBeTruthy();
    expect(control.errors!['maxLength'].message).toBe('La contraseña no puede tener más de 50 caracteres');
  });

  it('should return error for password without uppercase letter', () => {
    control.setValue('password123!@#');
    expect(control.errors).toBeTruthy();
    expect(control.errors!['uppercase']).toBeTruthy();
    expect(control.errors!['uppercase'].message).toBe('La contraseña debe contener al menos una letra mayúscula');
  });

  it('should return error for password without lowercase letter', () => {
    control.setValue('PASSWORD123!@#');
    expect(control.errors).toBeTruthy();
    expect(control.errors!['lowercase']).toBeTruthy();
    expect(control.errors!['lowercase'].message).toBe('La contraseña debe contener al menos una letra minúscula');
  });

  it('should return error for password without digit', () => {
    control.setValue('Password!@#');
    expect(control.errors).toBeTruthy();
    expect(control.errors!['digit']).toBeTruthy();
    expect(control.errors!['digit'].message).toBe('La contraseña debe contener al menos un número');
  });

  it('should return error for password without special character', () => {
    control.setValue('Password123');
    expect(control.errors).toBeTruthy();
    expect(control.errors!['specialChar']).toBeTruthy();
    expect(control.errors!['specialChar'].message).toBe('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
  });

  it('should return multiple errors for password with multiple issues', () => {
    control.setValue('pass'); // Too short, no uppercase, no digit, no special char
    expect(control.errors).toBeTruthy();
    expect(control.errors!['minLength']).toBeTruthy();
    expect(control.errors!['uppercase']).toBeTruthy();
    expect(control.errors!['digit']).toBeTruthy();
    expect(control.errors!['specialChar']).toBeTruthy();
  });

  it('should accept password with exactly 8 characters', () => {
    control.setValue('Pass123!');
    expect(control.errors).toBeNull();
  });

  it('should accept password with exactly 50 characters', () => {
    const password = 'A'.repeat(48) + '1!';
    control.setValue(password);
    expect(control.errors).toBeNull();
  });

  it('should accept all special characters', () => {
    control.setValue('Password1!');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1@');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1#');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1$');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1%');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1^');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1&');
    expect(control.errors).toBeNull();
    
    control.setValue('Password1*');
    expect(control.errors).toBeNull();
  });
});

