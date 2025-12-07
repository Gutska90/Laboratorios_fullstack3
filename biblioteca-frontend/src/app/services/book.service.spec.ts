import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookService } from './book.service';
import { Book } from '../models/book.model';

describe('BookService', () => {
  let service: BookService;
  let httpMock: HttpTestingController;
  const apiUrl = '/api/libros';

  const mockBooks: Book[] = [
    { id: 1, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', anioPublicacion: 1967, genero: 'Realismo mágico' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', anioPublicacion: 1605, genero: 'Novela' }
  ];

  const mockBook: Book = {
    id: 1,
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    anioPublicacion: 1967,
    genero: 'Realismo mágico'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookService]
    });
    service = TestBed.inject(BookService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllBooks', () => {
    it('should return an observable of books array', () => {
      service.getAllBooks().subscribe(books => {
        expect(books).toEqual(mockBooks);
        expect(books.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockBooks);
    });

    it('should handle empty array', () => {
      service.getAllBooks().subscribe(books => {
        expect(books).toEqual([]);
        expect(books.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });

  describe('getBookById', () => {
    it('should return a single book by id', () => {
      const bookId = 1;
      service.getBookById(bookId).subscribe(book => {
        expect(book).toEqual(mockBook);
        expect(book.id).toBe(bookId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockBook);
    });

    it('should handle error when book not found', () => {
      const bookId = 999;
      service.getBookById(bookId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('GET');
      req.flush('Book not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createBook', () => {
    it('should create a new book', () => {
      const newBook: Book = {
        titulo: 'El Principito',
        autor: 'Antoine de Saint-Exupéry',
        anioPublicacion: 1943,
        genero: 'Fábula'
      };

      const createdBook: Book = { ...newBook, id: 3 };

      service.createBook(newBook).subscribe(book => {
        expect(book).toEqual(createdBook);
        expect(book.id).toBe(3);
        expect(book.titulo).toBe(newBook.titulo);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newBook);
      req.flush(createdBook);
    });

    it('should handle error when creating book fails', () => {
      const newBook: Book = {
        titulo: '',
        autor: 'Test',
        anioPublicacion: 2020,
        genero: 'Test'
      };

      service.createBook(newBook).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush('Bad Request', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', () => {
      const bookId = 1;
      const updatedBook: Book = {
        id: bookId,
        titulo: 'Cien años de soledad (Edición Especial)',
        autor: 'Gabriel García Márquez',
        anioPublicacion: 1967,
        genero: 'Realismo mágico'
      };

      service.updateBook(bookId, updatedBook).subscribe(book => {
        expect(book).toEqual(updatedBook);
        expect(book.id).toBe(bookId);
        expect(book.titulo).toBe(updatedBook.titulo);
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedBook);
      req.flush(updatedBook);
    });

    it('should handle error when updating non-existent book', () => {
      const bookId = 999;
      const updatedBook: Book = {
        id: bookId,
        titulo: 'Test',
        autor: 'Test',
        anioPublicacion: 2020,
        genero: 'Test'
      };

      service.updateBook(bookId, updatedBook).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('PUT');
      req.flush('Book not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteBook', () => {
    it('should delete a book by id', () => {
      const bookId = 1;

      service.deleteBook(bookId).subscribe(response => {
        expect(response).toBeNull();
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle error when deleting non-existent book', () => {
      const bookId = 999;

      service.deleteBook(bookId).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/${bookId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush('Book not found', { status: 404, statusText: 'Not Found' });
    });
  });
});

