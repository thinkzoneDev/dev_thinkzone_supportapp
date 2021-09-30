import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HblschoolWisedataPage } from './hblschool-wisedata.page';

describe('HblschoolWisedataPage', () => {
  let component: HblschoolWisedataPage;
  let fixture: ComponentFixture<HblschoolWisedataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HblschoolWisedataPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HblschoolWisedataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
