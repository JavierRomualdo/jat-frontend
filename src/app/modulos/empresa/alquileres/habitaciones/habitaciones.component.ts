import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ModalHabitacionComponent } from './modal-habitacion/modal-habitacion.component';
@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {

  constructor(
    public modalService: NgbModal
  ) { }

  ngOnInit() {
  }

  abrirHabitaciones(): void {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: true});
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  editarHabitacion(id): void {
    const modalRef = this.modalService.open(ModalHabitacionComponent, {size: 'lg', keyboard: true});
    modalRef.componentInstance.edit = id;
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }
}
