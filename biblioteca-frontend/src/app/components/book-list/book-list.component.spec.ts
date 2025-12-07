import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BookListComponent } from './book-list.component';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { of, throwError } from 'rxjs';

describe('BookListComponent', () => {
  let component: BookListComponent;
  let fixture: ComponentFixture<BookListComponent>;
  let bookService: jasmine.SpyObj<BookService>;

  const mockBooks: Book[] = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anioPublicacion: 1967, genero: 'Realismo mágico' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', anioPublicacion: 1605, genero: 'Novela' }
  ];

  beforeEach(async () => {
    const bookServiceSpy = jasmine.createSpyObj('BookService', ['getAllBooks', 'deleteBook']);

    await TestBed.configureTestingModule({
      imports: [BookListComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: BookService, useValue: bookServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListComponent);
    component = fixture.componentInstance;
    bookService = TestBed.inject(BookService) as jasmine.SpyObj<BookService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadBooks on init', () => {
      bookService.getAllBooks.and.returnValue(of(mockBooks));
      spyOn(component, 'loadBooks');

      component.ngOnInit();

      expect(component.loadBooks).toHaveBeenCalled();
    });
  });

  describe('loadBooks', () => {
    it('should load books successfully', () => {
      bookService.getAllBooks.and.returnValue(of(mockBooks));

      component.loadBooks();

      expect(component.loading).toBe(false);
      expect(component.books).toEqual(mockBooks);
      expect(component.error).toBe('');
      expect(bookService.getAllBooks).toHaveBeenCalled();
    });

    it('should set loading state correctly during fetch', () => {
      bookService.getAllBooks.and.returnValue(of(mockBooks));
      component.loading = false;

      component.loadBooks();

      expect(component.loading).toBe(false); // After completion
      expect(bookService.getAllBooks).toHaveBeenCalled();
    });

    it('should handle error when loading books fails', () => {
      const errorMessage = 'Error al cargar los libros. Verifica que el microservicio esté ejecutándose.';
      bookService.getAllBooks.and.returnValue(throwError(() => new Error('Network error')));

      component.loadBooks();

      expect(component.loading).toBe(false);
      expect(component.error).toBe(errorMessage);
      expect(component.books).toEqual([]);
    });

    it('should set loading to false after error', () => {
      bookService.getAllBooks.and.returnValue(throwError(() => new Error('Network error')));

      component.loadBooks();

      expect(component.loading).toBe(false);
    });
  });

  describe('deleteBook', () => {
    it('should delete a book when confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookService.deleteBook.and.returnValue(of(undefined));
      spyOn(component, 'loadBooks');
      component.books = [...mockBooks];

      component.deleteBook(1);

      expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de que deseas eliminar este libro?');
      expect(bookService.deleteBook).toHaveBeenCalledWith(1);
      expect(component.loadBooks).toHaveBeenCalled();
    });

    it('should not delete a book when not confirmed', () => {
      spyOn(window, 'confirm').and.returnValue(false);
      component.books = [...mockBooks];

      component.deleteBook(1);

      expect(window.confirm).toHaveBeenCalled();
      expect(bookService.deleteBook).not.toHaveBeenCalled();
    });

    it('should handle error when deleting book fails', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookService.deleteBook.and.returnValue(throwError(() => new Error('Delete error')));
      component.books = [...mockBooks];

      component.deleteBook(1);

      expect(component.loading).toBe(false);
      expect(component.error).toBe('Error al eliminar el libro.');
    });

    it('should set loading to true when deleting', () => {
      spyOn(window, 'confirm').and.returnValue(true);
      bookService.deleteBook.and.returnValue(of(undefined));
      spyOn(component, 'loadBooks');

      component.deleteBook(1);

      expect(component.loading).toBe(true);
    });
  });
});

