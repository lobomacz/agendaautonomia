import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerOrganizacionesComponent } from './ver-organizaciones.component';

describe('VerOrganizacionesComponent', () => {
  let component: VerOrganizacionesComponent;
  let fixture: ComponentFixture<VerOrganizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerOrganizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerOrganizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
