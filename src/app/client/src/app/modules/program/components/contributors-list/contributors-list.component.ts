import { UserService } from './../../../core/services/user/user.service';
import { RegistryService, ProgramsService } from '@sunbird/core';
import { Component, Input, OnInit } from '@angular/core';
import { ResourceService, PaginationService, ConfigService } from '@sunbird/shared';
import * as _ from 'lodash-es';
import { IPagination } from '../../../sourcing/interfaces';
import { IInteractEventEdata } from '@sunbird/telemetry';
import { Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SourcingService } from './../../../sourcing/services';

@Component({
  selector: 'app-contributors-list',
  templateUrl: './contributors-list.component.html',
  styleUrls: ['./contributors-list.component.scss']
})
export class ContributorsListComponent implements OnInit {
  direction = '';
  sortColumn = 'name';
  orgList: any;
  contributorList: any = [];
  paginatedList: any = [];
  public listCnt = 0;
  pager: IPagination;
  pageNumber = 1;
  pageLimit: any;
  public showLoader = true;
  public isDisabledSaveBtn = true;
  searchInput: any;
  @Output() onContributorSave = new EventEmitter();
  @Input() preSelectedContributors: any;
  public selectedContributors = {
    Org: [],
    User: []
  };
  public telemetryPageId: string;
  public telemetryInteractCdata: any;
  public resourceService: ResourceService;
  public telemetryInteractObject: any;
  public telemetryInteractPdata: any;

  constructor(public resource: ResourceService, public registryService: RegistryService,
    public programsService: ProgramsService, public paginationService: PaginationService,
    public configService: ConfigService, public userService: UserService,
    private activatedRoute: ActivatedRoute, private sourcingService: SourcingService,) { }

  ngOnInit(): void {
    this.telemetryInteractCdata = [{ id: this.userService.channel, type: 'sourcing_organization' }];
    this.telemetryInteractPdata = {id: this.userService.appId, pid: this.configService.appConfig.TELEMETRY.PID};
    this.telemetryInteractObject = {};
    this.getOrgList();
    this.pageLimit = this.registryService.programUserPageLimit;
  }

  getOrgList() {
    this.registryService.getOrgList().subscribe(data => {
      this.orgList = _.filter(_.get(data, 'result.Org'), (org) => (org.orgId !== this.userService.rootOrgId));
      // Org creator user open saber ids
      const orgCreatorOsIds = _.map(this.orgList, (org) => org.createdBy);
      this.getOrgCreatorDikshaIds(orgCreatorOsIds);
    }, (error) => {
      console.log(error);
      const errInfo = {
        errorMsg: this.resourceService.messages.fmsg.contributorjoin.m0001,
        telemetryPageId: this.getPageId(),
        telemetryCdata: this.telemetryInteractCdata,
        env: this.activatedRoute.snapshot.data.telemetry.env,
        request: { "entityType": ["Org"] }
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  getPageId() {
    this.telemetryPageId = _.get(this.activatedRoute, 'snapshot.data.telemetry.pageid');
    return this.telemetryPageId;
  }

  getOrgCreatorDikshaIds(orgCreatorOsIds) {
    this.registryService.getUserdetailsByOsIds(orgCreatorOsIds).subscribe(data => {
      const orgCreatorDikshaIds = _.map(_.get(data, 'result.User'), (user) => user.userId) || [];
      this.orgList = _.compact(_.map(this.orgList,
        (org) => {
          org.User = _.find(_.get(data, 'result.User'), (user) => {
            if (user.osid == org.createdBy) {
              return user;
            }
          });

          if (!_.isUndefined(org.User) && _.get(org, 'name')) {
            return org;
          }
        }
      ));
      this.getOrgUsersDetails(orgCreatorDikshaIds);
    }, (error) => {
      const errInfo = {
        errorMsg: this.resourceService.messages.emsg.profile.m0002,
        telemetryPageId: this.getPageId(),
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: {'entityType': ['User'], 'filters': {osid: {or: []}}}
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  getOrgUsersDetails(orgCreatorDikshaIds) {
    const reqFilters = {
      'identifier': orgCreatorDikshaIds
    };
    const fields = ['identifier', 'maskedEmail', 'maskedPhone'];
    this.programsService.getOrgUsersDetails(reqFilters, undefined, undefined, fields).subscribe(data => {
      this.orgList = _.map(this.orgList,
        (org) => {
          let userInfo = _.find(_.get(data, 'result.response.content'), (user) => {
            if (user.identifier == _.get(org, 'User.userId')) {
              return user;
            }
          });
          org.User = {
            ...org.User,
            ...userInfo
          };
          if (!_.isEmpty(_.get(this.preSelectedContributors, 'Org'))) {
            let preSelectedOrg = _.find(_.get(this.preSelectedContributors, 'Org'), { 'osid': org.osid });
            if (preSelectedOrg) {
              org.isChecked = true;
              org.isDisabled = preSelectedOrg.isDisabled;
            }
          }
          return org;
        }
      );
      this.showFilteredResults()
    }, (error) => {
      console.log(error);
      const errInfo = {
        errorMsg: this.getPageId(),
        telemetryPageId: this.telemetryPageId,
        telemetryCdata : this.telemetryInteractCdata,
        env : this.activatedRoute.snapshot.data.telemetry.env,
        request: {'filters': {'identifier': orgCreatorDikshaIds}, fields: fields}
      };
      this.sourcingService.apiErrorHandling(error, errInfo);
    });
  }

  NavigateToPage(page: number): undefined | void {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    this.pageNumber = page;
    this.contributorList = this.paginatedList[this.pageNumber - 1];
    this.pager = this.paginationService.getPager(this.listCnt, this.pageNumber, this.pageLimit);
  }

  displayLoader() {
    this.showLoader = true;
    this.isDisabledSaveBtn = true;
  }

  hideLoader() {
    this.showLoader = false;
    this.isDisabledSaveBtn = false;
  }

  clearSearch() {
    this.searchInput = '';
    this.pageNumber = 1;
    this.showFilteredResults();
  }

  search() {
    this.pageNumber = 1;
    this.showFilteredResults();
  }

  showFilteredResults() {
    this.displayLoader();
    this.contributorList = this.applySearchFilter(this.orgList);
    this.contributorList = this.applySort(this.contributorList);
    this.contributorList = this.applyPagination(this.contributorList);
    this.hideLoader();
  }

  // Search the option and return match result
  applySearchFilter(list) {
    if (this.searchInput) {
      return list.filter(item => {
        if (_.get(item, 'name')) {
          if (_.get(item, 'name').toString().toLocaleLowerCase().includes(this.searchInput.toLocaleLowerCase())) {
            return item;
          }
        }
      });
    } else {
      return this.orgList;
    }
  }

  applySort(list) {
    this.direction = this.direction === 'asc' ? 'desc' : 'asc';
    return this.programsService.sortCollection(list, this.sortColumn, this.direction);
  }

  applyPagination(list) {
    this.listCnt = list.length;
    this.paginatedList = _.chunk(list, this.pageLimit);
    this.pager = this.paginationService.getPager(this.listCnt, this.searchInput ? 1 : this.pageNumber, this.pageLimit);
    return this.searchInput ? this.paginatedList[0] : this.paginatedList[this.pageNumber - 1];
  }

  getTelemetryInteractEdata(id: string, type: string, subtype: string, pageid: string, extra?: any): IInteractEventEdata {
    return _.omitBy({
      id,
      type,
      subtype,
      pageid,
      extra
    }, _.isUndefined);
  }
  save() {
    this.selectedContributors.Org = _.compact(_.map(this.orgList, org => {
      if (org.isChecked) {
        return org.osid;
      }
    }));
    this.onContributorSave.emit(this.selectedContributors);
  }
}
