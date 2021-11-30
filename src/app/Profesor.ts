import { Estudiante } from './estudiante';

export class Profesor {
    id: number;
    nombre: string;
    cantidad: number;
    cantidadMax: number;
    estudianteId: number;
    cedulaEstudiante: string;
    nombresEstudiante: string;
    apellidosEstudiante: string;
    estudiantes: Estudiante;
    proyecto: string;
}
