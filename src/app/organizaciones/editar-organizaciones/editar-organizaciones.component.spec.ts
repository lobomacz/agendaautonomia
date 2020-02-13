import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarOrganizacionesComponent } from './editar-organizaciones.component';

describe('EditarOrganizacionesComponent', () => {
  let component: EditarOrganizacionesComponent;
  let fixture: ComponentFixture<EditarOrganizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarOrganizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarOrganizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
