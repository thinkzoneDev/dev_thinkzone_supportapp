import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblpasscodewiseteacherPage } from './hblpasscodewiseteacher.page';

describe('HblpasscodewiseteacherPage', () => {
  let component: HblpasscodewiseteacherPage;
  let fixture: ComponentFixture<HblpasscodewiseteacherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblpasscodewiseteacherPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblpasscodewiseteacherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
