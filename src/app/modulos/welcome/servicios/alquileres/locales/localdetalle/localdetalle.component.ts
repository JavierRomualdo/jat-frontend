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
import { Localservicio } from '../../../../../../entidades/entidad.localservicio';
import { Local } from '../../../../../../entidades/entidad.local';
import { LocalMensaje } from '../../../../../../entidades/entidad.localmensaje';

@Component({
  selector: 'app-localdetalle',
  templateUrl: './localdetalle.component.html',
  styleUrls: ['./localdetalle.component.css']
})
export class LocalDetalleComponent implements OnInit {
  @Input() id;
  public local: Local;
  public mensaje: LocalMensaje;
  public cargando: Boolean = false;
  public archivos: FileItem[] = [];
  public servicios: Servicios[];
  public localservicios: Localservicio[];
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
    this.local = new Local();
    this.mensaje = new LocalMensaje();
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
      this.listarLocal(this.id);
    }
    // this._activedRoute.params.subscribe(params => {
    //   this.listarLocal(params['id']);
    // });
  }

  listarLocal(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.cargando = true;
    this.api.get('locales/' + id).then(
      (res) => {
        // console.log(res);
        this.local = res;
        this.listaLP = res.localpersonaList;
        this.persona = this.listaLP[0];
        this.ubigeo = res.ubigeo;
        this.servicios = res.serviciosList;
        this.localservicios = res.localservicioList;

        for (const item of res.fotosList) {
          console.log('foto: ');
          console.log(item);
          this.fotos.push(item);
        }
        console.log('fotoss : ');
        console.log(this.fotos);
        // this.fotos = res.fotosList;
        console.log('traido para edicion');
        console.log(this.local);
        this.local.fotosList = {}; // tiene que ser vacio xq son la lista de imagenes nuevas pa agregarse
        // traer archivos de firebase storage
        // this._cargaImagenes.getImagenes(res.path);

        // aqui metodo para mostrar todas las imagenes de este local ....
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
    this.mensaje.local_id = this.local.id;
    this.api.post('localmensaje', this.mensaje).then(
      (res) => {
        console.log('se ha enviado mensaje: ');
        console.log(res);
        this.toastr.success('Mensaje enviado');
        this.mensaje = new LocalMensaje();
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
