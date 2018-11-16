import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaOrganizacionComponent } from './nueva-organizacion.component';

describe('NuevaOrganizacionComponent', () => {
  let component: NuevaOrganizacionComponent;
  let fixture: ComponentFixture<NuevaOrganizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaOrganizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaOrganizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
