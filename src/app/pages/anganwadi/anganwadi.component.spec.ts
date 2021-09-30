import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnganwadiComponent } from './anganwadi.component';

describe('AnganwadiComponent', () => {
  let component: AnganwadiComponent;
  let fixture: ComponentFixture<AnganwadiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnganwadiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnganwadiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
