import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ResultadoService } from './resultado.service';
import { ResultadoAnalisis, ResultadoRequest } from '../models/resultado.model';

describe('ResultadoService', () => {
  let service: ResultadoService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8083/api/resultados';

  const mockResultados: ResultadoAnalisis[] = [
    {
      id: 1,
      pacienteId: 1,
      laboratorioId: 1,
      tipoAnalisis: 'Hemograma Completo',
      resultado: 'Normal',
      observaciones: 'Todos los valores dentro del rango normal',
      fechaAnalisis: '2024-01-15'
    },
    {
      id: 2,
      pacienteId: 1,
      laboratorioId: 2,
      tipoAnalisis: 'Glicemia',
      resultado: '95 mg/dL',
      fechaAnalisis: '2024-01-20'
    }
  ];

  const mockResultado: ResultadoAnalisis = {
    id: 1,
    pacienteId: 1,
    laboratorioId: 1,
    tipoAnalisis: 'Hemograma Completo',
    resultado: 'Normal',
    observaciones: 'Todos los valores dentro del rango normal',
    fechaAnalisis: '2024-01-15'
  };

  const mockResultadoRequest: ResultadoRequest = {
    pacienteId: 1,
    laboratorioId: 1,
    tipoAnalisis: 'Nuevo Análisis',
    resultado: 'Resultado',
    observaciones: 'Observaciones',
    fechaAnalisis: '2024-01-25'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ResultadoService]
    });
    service = TestBed.inject(ResultadoService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Handle the constructor call
    const constructorReq = httpMock.match(apiUrl);
    constructorReq.forEach(req => req.flush(mockResultados));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllResultados', () => {
    it('should return an observable of resultados array', () => {
      service.getAllResultados().subscribe(resultados => {
        expect(resultados).toEqual(mockResultados);
        expect(resultados.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResultados);
    });
  });

  describe('getResultadoById', () => {
    it('should return a resultado by id', () => {
      service.getResultadoById(1).subscribe(resultado => {
        expect(resultado).toEqual(mockResultado);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResultado);
    });
  });

  describe('getResultadosPorPaciente', () => {
    it('should return resultados for a specific paciente', () => {
      const pacienteResultados = mockResultados.filter(r => r.pacienteId === 1);

      service.getResultadosPorPaciente(1).subscribe(resultados => {
        expect(resultados).toEqual(pacienteResultados);
      });

      const req = httpMock.expectOne(`${apiUrl}/paciente/1`);
      expect(req.request.method).toBe('GET');
      req.flush(pacienteResultados);
    });
  });

  describe('getResultadosPorLaboratorio', () => {
    it('should return resultados for a specific laboratorio', () => {
      const laboratorioResultados = mockResultados.filter(r => r.laboratorioId === 1);

      service.getResultadosPorLaboratorio(1).subscribe(resultados => {
        expect(resultados).toEqual(laboratorioResultados);
      });

      const req = httpMock.expectOne(`${apiUrl}/laboratorio/1`);
      expect(req.request.method).toBe('GET');
      req.flush(laboratorioResultados);
    });
  });

  describe('createResultado', () => {
    it('should create a new resultado', () => {
      const newResultado: ResultadoAnalisis = {
        ...mockResultadoRequest,
        id: 3,
        fechaAnalisis: mockResultadoRequest.fechaAnalisis || '2024-01-25'
      };

      service.createResultado(mockResultadoRequest).subscribe(resultado => {
        expect(resultado).toEqual(newResultado);
      });

      const reqs = httpMock.match((r) => r.url === apiUrl && r.method === 'POST');
      expect(reqs.length).toBe(1);
      expect(reqs[0].request.body).toEqual(mockResultadoRequest);
      reqs[0].flush(newResultado);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockResultados));
    });
  });

  describe('updateResultado', () => {
    it('should update an existing resultado', () => {
      const updatedResultado: ResultadoAnalisis = { ...mockResultado, resultado: 'Actualizado' };

      service.updateResultado(1, mockResultadoRequest).subscribe(resultado => {
        expect(resultado).toEqual(updatedResultado);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockResultadoRequest);
      req.flush(updatedResultado);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockResultados));
    });
  });

  describe('deleteResultado', () => {
    it('should delete a resultado by id', () => {
      service.deleteResultado(1).subscribe(response => {
        expect(response).toBeNull();
      });

      const reqs = httpMock.match((r) => r.url === `${apiUrl}/1` && r.method === 'DELETE');
      expect(reqs.length).toBe(1);
      reqs[0].flush(null);
      
      // Handle the reload call
      const reloadReq = httpMock.match((r) => r.url === apiUrl && r.method === 'GET');
      reloadReq.forEach(req => req.flush(mockResultados));
    });
  });

  describe('cargarResultados', () => {
    it('should load resultados and store them locally', () => {
      service.cargarResultados().subscribe(resultados => {
        expect(resultados).toEqual(mockResultados);
        expect(service.getResultadosLocal()).toEqual(mockResultados);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResultados);
    });
  });

  describe('getResultadosLocal', () => {
    it('should return local resultados array', () => {
      service.cargarResultados().subscribe(() => {
        const local = service.getResultadosLocal();
        expect(local).toEqual(mockResultados);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResultados);
    });
  });
});

