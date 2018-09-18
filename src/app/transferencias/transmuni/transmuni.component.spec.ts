import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransmuniComponent } from './transmuni.component';

describe('TransmuniComponent', () => {
  let component: TransmuniComponent;
  let fixture: ComponentFixture<TransmuniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransmuniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransmuniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
