import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TourCompComponent } from './tour-comp.component';

describe('TourCompComponent', () => {
  let component: TourCompComponent;
  let fixture: ComponentFixture<TourCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TourCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TourCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
