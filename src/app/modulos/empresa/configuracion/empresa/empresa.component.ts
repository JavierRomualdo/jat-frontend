import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalEmpresaComponent } from './modal-empresa/modal-empresa.component';
import { ModalPersonaComponent } from './modal-persona/modal-persona.component';
import { ModalRolComponent } from './modal-rol/modal-rol.component';
import { ModalServicioComponent } from './modal-servicio/modal-servicio.component';
import { ModalUsuarioComponent } from './modal-usuario/modal-usuario.component';
import { ApiRequest2Service } from '../../../../servicios/api-request2.service';
import { ToastrService } from 'ngx-toastr';
import { Users } from '../../../../entidades/entidad.users';
import { ConfirmacionComponent } from '../../../../util/confirmacion/confirmacion.component';
import { AuthService } from '../../../../servicios/auth.service';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaConfiguracionComponent implements OnInit {

  public cargando: Boolean = false;
  public confirmarcambioestado: Boolean = false;
  public  usuarios: any = []; // lista proyecto
  public parametros: Users;
  errors: Array<Object> = [];
  constructor(
    public modalService: NgbModal,
    public api: ApiRequest2Service,
    public toastr: ToastrService,
    public auth: AuthService,
  ) {
    this.parametros = new Users();
  }

  ngOnInit() {
    this.listarUsuarios();
  }
  // Metodos para abrir los modales
  abrirDatos(): void {
    const modalRef = this.modalService.open(ModalEmpresaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirPersonas(): void {
    const modalRef = this.modalService.open(ModalPersonaComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirRoles() {
    const modalRef = this.modalService.open(ModalRolComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirServicios() {
    const modalRef = this.modalService.open(ModalServicioComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  abrirUsuario() {
    const modalRef = this.modalService.open(ModalUsuarioComponent, {size: 'lg', keyboard: false});
    modalRef.result.then((result) => {
      this.listarUsuarios();
    }, (reason) => {
    });
  }

  editarUsuario(id) {
    const modalRef = this.modalService.open(ModalUsuarioComponent, {size: 'lg', keyboard: true});
    // asi... le pasamos el parametro id del usuario en el modal-usuario :p
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
      this.listarUsuarios();
    }, (reason) => {
    });
  }

  listarUsuarios() {
    this.cargando = true;
    this.api.get('usuarios').then(
      (res) => {
        this.usuarios = res;
        this.cargando = false;
        console.log('resultado: ');
        console.log(this.usuarios);
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

  confirmarcambiodeestado(usuario): void {
    const modalRef = this.modalService.open(ConfirmacionComponent, {windowClass: 'nuevo-modal', size: 'sm', keyboard: false});
    modalRef.result.then((result) => {
      this.confirmarcambioestado = true;
      this.cambiarestadoservicio(usuario);
      this.auth.agregarmodalopenclass();
    }, (reason) => {
      usuario.estado = !usuario.estado;
      this.auth.agregarmodalopenclass();
    });
  }

  cambiarestadoservicio(usuario) {
    this.cargando = true;
    this.api.delete('usuarios/' + usuario.id).then(
      (res) => {
        console.log(res);
        this.toastr.success(res.operacionMensaje, 'Exito');
        this.listarUsuarios();
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

  limpiar() {
    this.parametros = new Users();
    this.usuarios = [];
    this.listarUsuarios();
  }

  busqueda() {
    let nohayvacios: Boolean = false;
    if (this.parametros.name !== undefined && this.parametros.name !== '') {
      // this.toastr.info('Hay servicio datos: ' + this.parametros.servicio);
      nohayvacios = true;
    }
    if (this.parametros.email !== undefined && this.parametros.email !== '') {
      // this.toastr.info('Hay detalle datos: ' + this.parametros.detalle);
      nohayvacios = true;
    }
    if (nohayvacios) {
      console.log(this.parametros);
      this.api.post('buscarusuario', this.parametros).then(
        (res) => {
          console.log(res);
          this.usuarios = res;
          this.toastr.success(res.operacionMensaje, 'Exito');
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
    } else {
      this.toastr.info('Ingrese datos');
    }
  }

  private handleError(error: any): void {
    this.cargando = false;
    this.toastr.error('Error Interno: ' + error, 'Error');
  }
}
