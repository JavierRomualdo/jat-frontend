import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-lote',
  templateUrl: './modal-lote.component.html',
  styleUrls: ['./modal-lote.component.css']
})
export class ModalLoteComponent implements OnInit {
  @Input() edit;
  public verNuevo = false;

  constructor(
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    if (this.edit) {
      this.traerParaEdicion(this.edit);
    }
  }

  guardarLote() {}

  traerParaEdicion(id) {
    // aqui traemos los datos del usuario con ese id para ponerlo en el formulario y editarlo
    this.verNuevo = true;
  }
}
