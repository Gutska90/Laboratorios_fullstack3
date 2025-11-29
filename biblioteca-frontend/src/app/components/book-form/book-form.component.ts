import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  bookForm: FormGroup;
  bookId: number | null = null;
  loading: boolean = false;
  error: string = '';
  isEditMode: boolean = false;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.bookForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
      autor: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      anioPublicacion: ['', [Validators.required, Validators.min(1000), Validators.max(2025)]],
      genero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.bookId = +params['id'];
        this.isEditMode = true;
        this.loadBook(this.bookId);
      }
    });
  }

  loadBook(id: number): void {
    this.loading = true;
    this.bookService.getBookById(id).subscribe({
      next: (book) => {
        this.bookForm.patchValue({
          titulo: book.titulo,
          autor: book.autor,
          anioPublicacion: book.anioPublicacion,
          genero: book.genero
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar el libro.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.bookForm.valid) {
      this.loading = true;
      this.error = '';
      
      const bookData: Book = this.bookForm.value;

      if (this.isEditMode && this.bookId) {
        // PUT: Actualizar libro
        this.bookService.updateBook(this.bookId, bookData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/libros']);
          },
          error: (err) => {
            this.error = 'Error al actualizar el libro.';
            this.loading = false;
            console.error('Error:', err);
          }
        });
      } else {
        // POST: Crear nuevo libro
        this.bookService.createBook(bookData).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/libros']);
          },
          error: (err) => {
            this.error = 'Error al crear el libro.';
            this.loading = false;
            console.error('Error:', err);
          }
        });
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.bookForm.controls).forEach(key => {
      const control = this.bookForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/libros']);
  }
}

