import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookFormComponent } from './book-form.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { of, throwError, Observable } from 'rxjs';

describe('BookFormComponent', () => {
  let component: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;
  let bookService: jasmine.SpyObj<BookService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockBook: Book = {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    anioPublicacion: 1967,
    genero: 'Realismo mágico'
  };

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getBookById', 'createBook', 'updateBook']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    activatedRoute = {
      params: of({})
    };

    await TestBed.configureTestingModule({
      imports: [BookFormComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: BookService, useValue: bookServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should initialize form with empty values', () => {
      expect(component.bookForm).toBeDefined();
      expect(component.bookForm.get('titulo')?.value).toBe('');
      expect(component.bookForm.get('autor')?.value).toBe('');
      expect(component.bookForm.get('anioPublicacion')?.value).toBe('');
      expect(component.bookForm.get('genero')?.value).toBe('');
    });

    it('should have required validators on all fields', () => {
      const tituloControl = component.bookForm.get('titulo');
      const autorControl = component.bookForm.get('autor');
      const anioControl = component.bookForm.get('anioPublicacion');
      const generoControl = component.bookForm.get('genero');

      expect(tituloControl?.hasError('required')).toBeTruthy();
      expect(autorControl?.hasError('required')).toBeTruthy();
      expect(anioControl?.hasError('required')).toBeTruthy();
      expect(generoControl?.hasError('required')).toBeTruthy();
    });
  });

  describe('ngOnInit', () => {
    it('should not load book when no id in route params', () => {
      activatedRoute.params = of({});
      spyOn(component, 'loadBook');

      component.ngOnInit();

      expect(component.isEditMode).toBe(false);
      expect(component.loadBook).not.toHaveBeenCalled();
    });

    it('should load book when id is in route params', () => {
      activatedRoute.params = of({ id: '1' });
      spyOn(component, 'loadBook');

      component.ngOnInit();

      expect(component.bookId).toBe(1);
      expect(component.isEditMode).toBe(true);
      expect(component.loadBook).toHaveBeenCalledWith(1);
    });
  });

  describe('loadBook', () => {
    it('should load and populate form with book data', () => {
      bookService.getBookById.and.returnValue(of(mockBook));

      component.loadBook(1);

      expect(bookService.getBookById).toHaveBeenCalledWith(1);
      expect(component.loading).toBe(false);
      expect(component.bookForm.get('titulo')?.value).toBe(mockBook.titulo);
      expect(component.bookForm.get('autor')?.value).toBe(mockBook.autor);
      expect(component.bookForm.get('anioPublicacion')?.value).toBe(mockBook.anioPublicacion);
      expect(component.bookForm.get('genero')?.value).toBe(mockBook.genero);
    });

    it('should handle error when loading book fails', () => {
      bookService.getBookById.and.returnValue(throwError(() => new Error('Not found')));

      component.loadBook(1);

      expect(component.loading).toBe(false);
      expect(component.error).toBe('Error al cargar el libro.');
    });

    it('should set loading to true when starting to load', () => {
      bookService.getBookById.and.returnValue(of(mockBook));

      component.loadBook(1);

      expect(bookService.getBookById).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should not submit if form is invalid', () => {
      component.bookForm.markAllAsTouched();
      spyOn(component, 'markFormGroupTouched');

      component.onSubmit();

      expect(component.markFormGroupTouched).toHaveBeenCalled();
      expect(bookService.createBook).not.toHaveBeenCalled();
      expect(bookService.updateBook).not.toHaveBeenCalled();
    });

    it('should create a new book when form is valid and not in edit mode', () => {
      const newBook: Book = {
        titulo: 'El Principito',
        autor: 'Antoine de Saint-Exupéry',
        anioPublicacion: 1943,
        genero: 'Fábula'
      };

      component.bookForm.patchValue(newBook);
      component.isEditMode = false;
      bookService.createBook.and.returnValue(of({ ...newBook, id: 3 }));

      component.onSubmit();

      expect(bookService.createBook).toHaveBeenCalledWith(jasmine.objectContaining(newBook));
      expect(router.navigate).toHaveBeenCalledWith(['/libros']);
    });

    it('should update an existing book when form is valid and in edit mode', () => {
      const updatedBook: Book = {
        titulo: 'Cien años de soledad (Edición Especial)',
        autor: 'Gabriel García Márquez',
        anioPublicacion: 1967,
        genero: 'Realismo mágico'
      };

      component.bookForm.patchValue(updatedBook);
      component.isEditMode = true;
      component.bookId = 1;
      bookService.updateBook.and.returnValue(of({ ...updatedBook, id: 1 }));

      component.onSubmit();

      expect(bookService.updateBook).toHaveBeenCalledWith(1, jasmine.objectContaining(updatedBook));
      expect(router.navigate).toHaveBeenCalledWith(['/libros']);
    });

    it('should handle error when creating book fails', () => {
      const newBook: Book = {
        titulo: 'Test',
        autor: 'Test',
        anioPublicacion: 2020,
        genero: 'Test'
      };

      component.bookForm.patchValue(newBook);
      component.isEditMode = false;
      bookService.createBook.and.returnValue(throwError(() => ({ error: { mensaje: 'Error de validación' } })));

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(component.error).toBe('Error de validación');
    });

    it('should handle error when updating book fails', () => {
      const updatedBook: Book = {
        titulo: 'Test',
        autor: 'Test',
        anioPublicacion: 2020,
        genero: 'Test'
      };

      component.bookForm.patchValue(updatedBook);
      component.isEditMode = true;
      component.bookId = 1;
      bookService.updateBook.and.returnValue(throwError(() => ({ error: { mensaje: 'Error al actualizar' } })));

      component.onSubmit();

      expect(component.loading).toBe(false);
      expect(component.error).toBe('Error al actualizar el libro.');
    });

    it('should set loading to true when submitting', (done) => {
      const newBook: Book = {
        titulo: 'Test',
        autor: 'Test',
        anioPublicacion: 2020,
        genero: 'Test'
      };

      component.bookForm.patchValue(newBook);
      component.isEditMode = false;
      component.loading = false;
      
      // Usar un observable que se complete después de un pequeño delay
      bookService.createBook.and.returnValue(
        new Observable(observer => {
          setTimeout(() => {
            observer.next({ ...newBook, id: 1 });
            observer.complete();
          }, 10);
        })
      );

      component.onSubmit();

      // Verificar que loading se establece a true inmediatamente
      expect(component.loading).toBe(true);
      
      // Esperar a que se complete
      setTimeout(() => {
        expect(component.loading).toBe(false);
        done();
      }, 20);
    });
  });

  describe('markFormGroupTouched', () => {
    it('should mark all form controls as touched', () => {
      const controls = ['titulo', 'autor', 'anioPublicacion', 'genero'];
      
      controls.forEach(controlName => {
        const control = component.bookForm.get(controlName);
        expect(control?.touched).toBe(false);
      });

      component.markFormGroupTouched();

      controls.forEach(controlName => {
        const control = component.bookForm.get(controlName);
        expect(control?.touched).toBe(true);
      });
    });
  });

  describe('cancel', () => {
    it('should navigate to libros list', () => {
      component.cancel();

      expect(router.navigate).toHaveBeenCalledWith(['/libros']);
    });
  });

  describe('Form Validations', () => {
    it('should validate titulo minLength', () => {
      const tituloControl = component.bookForm.get('titulo');
      tituloControl?.setValue('');
      expect(tituloControl?.hasError('required')).toBeTruthy();
    });

    it('should validate titulo maxLength', () => {
      const tituloControl = component.bookForm.get('titulo');
      tituloControl?.setValue('a'.repeat(201));
      expect(tituloControl?.hasError('maxlength')).toBeTruthy();
    });

    it('should validate autor minLength', () => {
      const autorControl = component.bookForm.get('autor');
      autorControl?.setValue('');
      expect(autorControl?.hasError('required')).toBeTruthy();
    });

    it('should validate autor maxLength', () => {
      const autorControl = component.bookForm.get('autor');
      autorControl?.setValue('a'.repeat(101));
      expect(autorControl?.hasError('maxlength')).toBeTruthy();
    });

    it('should validate anioPublicacion min value', () => {
      const anioControl = component.bookForm.get('anioPublicacion');
      anioControl?.setValue(999);
      expect(anioControl?.hasError('min')).toBeTruthy();
    });

    it('should validate anioPublicacion max value', () => {
      const anioControl = component.bookForm.get('anioPublicacion');
      anioControl?.setValue(2026);
      expect(anioControl?.hasError('max')).toBeTruthy();
    });

    it('should validate genero minLength', () => {
      const generoControl = component.bookForm.get('genero');
      generoControl?.setValue('');
      expect(generoControl?.hasError('required')).toBeTruthy();
    });

    it('should validate genero maxLength', () => {
      const generoControl = component.bookForm.get('genero');
      generoControl?.setValue('a'.repeat(51));
      expect(generoControl?.hasError('maxlength')).toBeTruthy();
    });
  });
});

