import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSetsComponent } from './data-sets.component';

describe('DataSetsComponent', () => {
  let component: DataSetsComponent;
  let fixture: ComponentFixture<DataSetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataSetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
