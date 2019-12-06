import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UserUploadComponent } from '../user-upload/user-upload.component';
import { UserService } from '../../../core/services/user/user.service';
import { ManageService } from '../../services/manage/manage.service';
import { SuiModule } from 'ng2-semantic-ui';
import { ActivatedRoute } from '@angular/router';
import { ResourceService, SharedModule, ToasterService, NavigationHelperService } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UserOrgManagementComponent } from './user-org-management.component';
import { throwError as observableThrowError, of as observableOf } from 'rxjs';
import { mockManageData } from './user-org-management.mock.spec';

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'admin-dashboard', pageid: 'admin-manage-page', type: 'view'
      }
    },
    routeConfig: {
      path: 'manage'
    }
  }
};

describe('UserOrgManagementComponent', () => {

  let component: UserOrgManagementComponent;
  let fixture: ComponentFixture<UserOrgManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        TelemetryModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
        SuiModule
      ],
      declarations: [
        UserOrgManagementComponent,
        UserUploadComponent
      ],
      providers: [
        UserService,
        ManageService,
        ResourceService,
        ToasterService,
        NavigationHelperService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOrgManagementComponent);
    component = fixture.componentInstance;
    component.slug = 'sunbird';
    fixture.detectChanges();
  });

  it('should create User-Org-Management component', () => {
    expect(component).toBeTruthy();
  });

  it('value of variable geoJSON should be geo-summary.json', () => {
    const geoJSON = component.geoJSON;
    expect(geoJSON).toEqual('geo-summary.json');
  });

  it('value of variable geoCSV should be geo-detail.csv', () => {
    const geoCSV = component.geoCSV;
    expect(geoCSV).toEqual('geo-detail.csv');
  });

  it('value of variable geoDetail should be geo-summary-district.json', () => {
    const geoDetail = component.geoDetail;
    expect(geoDetail).toEqual('geo-summary-district.json');
  });

  it('value of variable userJSON should be user-summary.json', () => {
    const userJSON = component.userJSON;
    expect(userJSON).toEqual('user-summary.json');
  });

  it('value of variable userCSV should be user-detail.csv', () => {
    const userCSV = component.userCSV;
    expect(userCSV).toEqual('user-detail.csv');
  });

  it('value of variable userSummary should be validated-user-summary.json', () => {
    const userSummary = component.userSummary;
    expect(userSummary).toEqual('validated-user-summary.json');
  });

  it('value of variable userDetail should be validated-user-summary-district.json', () => {
    const userDetail = component.userDetail;
    expect(userDetail).toEqual('validated-user-summary-district.json');
  });

  it('value of variable userZip should be validated-user-detail.zip', () => {
    const userZip = component.userZip;
    expect(userZip).toEqual('validated-user-detail.zip');
  });

  it('value of variable GeoTableId should be GeoDetailsTable', () => {
    const GeoTableId = component.GeoTableId;
    expect(GeoTableId).toEqual('GeoDetailsTable');
  });

  it('value of variable userTableId should be ValidatedUserDetailsTable', () => {
    const userTableId = component.userTableId;
    expect(userTableId).toEqual('ValidatedUserDetailsTable');
  });

//   it('should call the getData API for fetching geoJSON data', () => {
//     // const userService = TestBed.get(UserService);
//     const manageService = TestBed.get(ManageService);
//     // spyOn(userService, 'userData').and.returnValue(observableOf(mockManageData.user));
//     spyOn(component, 'getGeoJSON');
//     spyOn(manageService, 'getData').and.returnValue(observableOf(mockManageData.geoData));
//     component.getGeoJSON();
//     expect(component.getGeoJSON).toHaveBeenCalled();
//     expect(manageService.getData).toHaveBeenCalledWith(component.slug, 'geo-summary.json');
//     expect(component.geoData).toEqual(jasmine.objectContaining({
//         districts: 0
//     }));
//   });

});
