import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LaboratorioService } from './laboratorio.service';
import { Laboratorio, LaboratorioRequest } from '../models/laboratorio.model';

describe('LaboratorioService', () => {
  let service: LaboratorioService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8082/api/laboratorios';

  const mockLaboratorios: Laboratorio[] = [
    {
      id: 1,
      nombre: 'Laboratorio Clínico Central',
      direccion: 'Av. Principal 123',
      telefono: '+56912345678',
      tipo: 'CLINICO',
      activo: true
    },
    {
      id: 2,
      nombre: 'Laboratorio de Análisis Especializados',
      direccion: 'Calle Secundaria 456',
      telefono: '+56987654321',
      tipo: 'ESPECIALIZADO',
      activo: true
    }
  ];

  const mockLaboratorio: Laboratorio = {
    id: 1,
    nombre: 'Laboratorio Clínico Central',
    direccion: 'Av. Principal 123',
    telefono: '+56912345678',
    tipo: 'CLINICO',
    activo: true
  };

  const mockLaboratorioRequest: LaboratorioRequest = {
    nombre: 'Nuevo Laboratorio',
    direccion: 'Nueva Dirección 789',
    telefono: '+56911111111',
    tipo: 'CLINICO'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LaboratorioService]
    });
    service = TestBed.inject(LaboratorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllLaboratorios', () => {
    it('should return an observable of laboratorios array', () => {
      service.getAllLaboratorios().subscribe(laboratorios => {
        expect(laboratorios).toEqual(mockLaboratorios);
        expect(laboratorios.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockLaboratorios);
    });
  });

  describe('getLaboratoriosActivos', () => {
    it('should return active laboratorios', () => {
      const activeLaboratorios = mockLaboratorios.filter(l => l.activo);
      
      service.getLaboratoriosActivos().subscribe(laboratorios => {
        expect(laboratorios).toEqual(activeLaboratorios);
      });

      const req = httpMock.expectOne(`${apiUrl}/activos`);
      expect(req.request.method).toBe('GET');
      req.flush(activeLaboratorios);
    });
  });

  describe('getLaboratorioById', () => {
    it('should return a laboratorio by id', () => {
      service.getLaboratorioById(1).subscribe(laboratorio => {
        expect(laboratorio).toEqual(mockLaboratorio);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockLaboratorio);
    });
  });

  describe('createLaboratorio', () => {
    it('should create a new laboratorio', () => {
      const newLaboratorio: Laboratorio = { ...mockLaboratorioRequest, id: 3 };

      service.createLaboratorio(mockLaboratorioRequest).subscribe(laboratorio => {
        expect(laboratorio).toEqual(newLaboratorio);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLaboratorioRequest);
      req.flush(newLaboratorio);
    });
  });

  describe('updateLaboratorio', () => {
    it('should update an existing laboratorio', () => {
      const updatedLaboratorio: Laboratorio = { ...mockLaboratorio, nombre: 'Updated Name' };

      service.updateLaboratorio(1, mockLaboratorioRequest).subscribe(laboratorio => {
        expect(laboratorio).toEqual(updatedLaboratorio);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockLaboratorioRequest);
      req.flush(updatedLaboratorio);
    });
  });

  describe('deleteLaboratorio', () => {
    it('should delete a laboratorio by id', () => {
      service.deleteLaboratorio(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const reqs = httpMock.match((r) => r.url === `${apiUrl}/1` && r.method === 'DELETE');
      expect(reqs.length).toBe(1);
      reqs[0].flush(null);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockLaboratorios));
    });
  });

  describe('cargarLaboratorios', () => {
    it('should load laboratorios and store them locally', () => {
      service.cargarLaboratorios().subscribe(laboratorios => {
        expect(laboratorios).toEqual(mockLaboratorios);
        expect(service.getLaboratoriosLocal()).toEqual(mockLaboratorios);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockLaboratorios);
    });
  });

  describe('getLaboratoriosLocal', () => {
    it('should return local laboratorios array', () => {
      service.cargarLaboratorios().subscribe(() => {
        const local = service.getLaboratoriosLocal();
        expect(local).toEqual(mockLaboratorios);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockLaboratorios);
    });
  });
});

