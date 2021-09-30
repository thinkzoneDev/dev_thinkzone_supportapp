import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyIssuesPage } from './survey-issues.page';

describe('AboutPage', () => {
  let component: SurveyIssuesPage;
  let fixture: ComponentFixture<SurveyIssuesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyIssuesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyIssuesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
