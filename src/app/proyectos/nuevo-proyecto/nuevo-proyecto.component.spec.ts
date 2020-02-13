import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoProyectoComponent } from './nuevo-proyecto.component';

describe('NuevoProyectoComponent', () => {
  let component: NuevoProyectoComponent;
  let fixture: ComponentFixture<NuevoProyectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoProyectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
