import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblSelectPasscodePage } from './hbl-select-passcode.page';

describe('HblSelectPasscodePage', () => {
  let component: HblSelectPasscodePage;
  let fixture: ComponentFixture<HblSelectPasscodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblSelectPasscodePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblSelectPasscodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
