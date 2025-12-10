import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuarioService } from './usuario.service';
import { Usuario, UsuarioRequest, Rol } from '../models/usuario.model';

describe('UsuarioService', () => {
  let service: UsuarioService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8081/api/usuarios';

  const mockUsuarios: Usuario[] = [
    {
      id: 1,
      email: 'test1@example.com',
      nombre: 'Test',
      apellido: 'User',
      rol: Rol.PACIENTE,
      activo: true
    },
    {
      id: 2,
      email: 'admin@example.com',
      nombre: 'Admin',
      apellido: 'User',
      rol: Rol.ADMINISTRADOR,
      activo: true
    }
  ];

  const mockUsuario: Usuario = {
    id: 1,
    email: 'test@example.com',
    nombre: 'Test',
    apellido: 'User',
    rol: Rol.PACIENTE,
    activo: true
  };

  const mockUsuarioRequest: UsuarioRequest = {
    email: 'newuser@example.com',
    password: 'Password123!@#',
    nombre: 'New',
    apellido: 'User',
    rol: Rol.PACIENTE
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuarioService]
    });
    service = TestBed.inject(UsuarioService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Handle the constructor call
    const constructorReq = httpMock.match(apiUrl);
    constructorReq.forEach(req => req.flush(mockUsuarios));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllUsuarios', () => {
    it('should return an observable of usuarios array', () => {
      service.getAllUsuarios().subscribe(usuarios => {
        expect(usuarios).toEqual(mockUsuarios);
        expect(usuarios.length).toBe(2);
      });

      const reqs = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      expect(reqs.length).toBeGreaterThan(0);
      reqs[0].flush(mockUsuarios);
    });
  });

  describe('getUsuarioById', () => {
    it('should return a usuario by id', () => {
      service.getUsuarioById(1).subscribe(usuario => {
        expect(usuario).toEqual(mockUsuario);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsuario);
      
      // Handle constructor call if any
      const constructorReqs = httpMock.match(apiUrl);
      constructorReqs.forEach(req => req.flush(mockUsuarios));
    });
  });

  describe('createUsuario', () => {
    it('should create a new usuario', () => {
      const newUsuario: Usuario = { ...mockUsuarioRequest, id: 3 };
      delete (newUsuario as any).password;

      service.createUsuario(mockUsuarioRequest).subscribe(usuario => {
        expect(usuario.email).toBe(mockUsuarioRequest.email);
        expect(usuario.nombre).toBe(mockUsuarioRequest.nombre);
      });

      const reqs = httpMock.match((r) => r.url === apiUrl && r.method === 'POST');
      expect(reqs.length).toBe(1);
      expect(reqs[0].request.body).toEqual(mockUsuarioRequest);
      reqs[0].flush(newUsuario);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockUsuarios));
    });
  });

  describe('updateUsuario', () => {
    it('should update an existing usuario', () => {
      const updatedUsuario: Usuario = { ...mockUsuario, nombre: 'Updated Name' };

      service.updateUsuario(1, mockUsuarioRequest).subscribe(usuario => {
        expect(usuario).toEqual(updatedUsuario);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUsuarioRequest);
      req.flush(updatedUsuario);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockUsuarios));
    });
  });

  describe('deleteUsuario', () => {
    it('should delete a usuario by id', () => {
      service.deleteUsuario(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const reqs = httpMock.match((r) => r.url === `${apiUrl}/1` && r.method === 'DELETE');
      expect(reqs.length).toBe(1);
      reqs[0].flush(null);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockUsuarios));
    });
  });

  describe('cargarUsuarios', () => {
    it('should load usuarios and store them locally', () => {
      service.cargarUsuarios().subscribe(usuarios => {
        expect(usuarios).toEqual(mockUsuarios);
        expect(service.getUsuariosLocal()).toEqual(mockUsuarios);
      });

      const reqs = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      expect(reqs.length).toBeGreaterThan(0);
      reqs[0].flush(mockUsuarios);
    });
  });

  describe('getUsuariosLocal', () => {
    it('should return local usuarios array', () => {
      service.cargarUsuarios().subscribe(() => {
        const local = service.getUsuariosLocal();
        expect(local).toEqual(mockUsuarios);
      });

      const reqs = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reqs[0].flush(mockUsuarios);
    });
  });
});

