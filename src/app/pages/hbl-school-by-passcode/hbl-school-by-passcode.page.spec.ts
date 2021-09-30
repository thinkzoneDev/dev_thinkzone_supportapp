import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblSchoolByPasscodePage } from './hbl-school-by-passcode.page';

describe('HblSchoolByPasscodePage', () => {
  let component: HblSchoolByPasscodePage;
  let fixture: ComponentFixture<HblSchoolByPasscodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblSchoolByPasscodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblSchoolByPasscodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
