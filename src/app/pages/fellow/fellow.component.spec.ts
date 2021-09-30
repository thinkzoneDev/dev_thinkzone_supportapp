import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FellowComponent } from './fellow.component';

describe('FellowComponent', () => {
  let component: FellowComponent;
  let fixture: ComponentFixture<FellowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FellowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FellowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
