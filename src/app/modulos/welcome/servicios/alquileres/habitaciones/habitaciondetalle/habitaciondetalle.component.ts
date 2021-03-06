import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiRequest2Service } from '../../../../../../servicios/api-request2.service';
import { FileItem } from '../../../../../../entidades/file-item';
import { Servicios } from '../../../../../../entidades/entidad.servicios';
import { Foto } from '../../../../../../entidades/entidad.foto';
import { Persona } from '../../../../../../entidades/entidad.persona';
import { UbigeoGuardar } from '../../../../../../entidades/entidad.ubigeoguardar';
import { Ubigeo } from '../../../../../../entidades/entidad.ubigeo';
import { Habitacion } from '../../../../../../entidades/entidad.habitacion';
import { Habitacionservicio } from '../../../../../../entidades/entidad.habitacionservicio';
import { HabitacionMensaje } from '../../../../../../entidades/entidad.habitacionmensaje';

@Component({
  selector: 'app-habitaciondetalle',
  templateUrl: './habitaciondetalle.component.html',
  styleUrls: ['./habitaciondetalle.component.css']
})
export class HabitacionDetalleComponent implements OnInit {
  @Input() id;
  public habitacion: Habitacion;
  public mensaje: HabitacionMensaje;
  public cargando: Boolean = false;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public habitacionservicios: Habitacionservicio[];
  public fotos: Foto[];
  public persona: Persona;
  public ubigeo: UbigeoGuardar;
  public listaLP: any = []; // lista de persona-roles
  errors: Array<Object> = [];

  constructor(
    private _activedRoute: ActivatedRoute,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
  ) {
    this.habitacion = new Habitacion();
    this.mensaje = new HabitacionMensaje();
    this.fotos = [];
    this.servicios = [];
    this.persona = new Persona();
    this.ubigeo = new UbigeoGuardar();
    this.ubigeo.departamento = new Ubigeo();
    this.ubigeo.provincia = new Ubigeo();
    this.ubigeo.ubigeo = new Ubigeo();
    this.archivos = [];
    this.listaLP = [];
  }

  ngOnInit() {
    if (this.id) {
      this.listarHabitacion(this.id);
    }
    // this._activedRoute.params.subscribe(params => {
    //   this.listarHabitacion(params['id']);
    // });
  }

  listarHabitacion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get('habitaciones/' + id).then(
      (res) => {
        // console.log(res);
        this.habitacion = res;
        this.listaLP = res.habitacionpersonaList;
        this.persona = this.listaLP[0];
        this.ubigeo = res.ubigeo;
        this.servicios = res.serviciosList;
        this.habitacionservicios = res.habitacionservicioList;

        for (const item of res.fotosList) {
          console.log('foto: ');
          console.log(item);
          this.fotos.push(item);
        }
        console.log('fotoss : ');
        console.log(this.fotos);
        // this.fotos = res.fotosList;
        console.log('traido para edicion');
        console.log(this.habitacion);
        this.habitacion.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
        // traer archivos de firebase storage
        // this._cargaImagenes.getImagenes(res.path);

        // aqui metodo para mostrar todas las imagenes de esta habitacion ....
        // this.imagen = res.foto;
        // this.imagenAnterior = res.foto;
        this.cargando = false;
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          this.cargando = false;
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  enviarmensaje() {
    this.cargando = true;
    this.mensaje.habitacion_id = this.habitacion.id;
    this.api.post('habitacionmensaje', this.mensaje).then(
      (res) => {
        console.log('se ha enviado mensaje: ');
        console.log(res);
        this.toastr.success('Mensaje enviado');
        this.mensaje = new HabitacionMensaje();
        this.cargando = false;
      },
      (error) => {
        if (error.status === 422) {
          this.errors = [];
          const errors = error.json();
          console.log('Error');
          this.cargando = false;
          this.handleError(error);
          /*for (const key in errors) {
            this.errors.push(errors[key]);
          }*/
        }
      }
    ).catch(err => this.handleError(err));
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
