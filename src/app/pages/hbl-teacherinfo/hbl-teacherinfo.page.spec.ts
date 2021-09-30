import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblTeacherinfoPage } from './hbl-teacherinfo.page';

describe('HblTeacherinfoPage', () => {
  let component: HblTeacherinfoPage;
  let fixture: ComponentFixture<HblTeacherinfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblTeacherinfoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblTeacherinfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
