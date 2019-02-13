import 'rxjs/add/operator/map';

import {
  OrderBy,
  TableColumn,
  TableComponent,
} from '@acpaas-ui/ngx-components/table';
import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  Component,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';

import { SMARTTABLE_DEFAULT_OPTIONS } from './smart-table.defaults';
import { SmartTableService } from './smart-table.service';
import {
  SmartTableColumnCustomType,
  SmartTableColumnType,
  SmartTableConfig,
  SmartTableDataQuery,
  SmartTableDataQueryFilter,
  SmartTableFilter,
  SmartTableFilterConfig,
  SmartTableFilterDisplay,
  SmartTableFilterOperator,
  SmartTableFilterType,
  SmartTableOptions,
  UpdateFilterArgs,
} from './smart-table.types';

@Component({
  selector: 'aui-smart-table',
  styleUrls: ['./smart-table.component.scss'],
  templateUrl: './smart-table.component.html'
})
export class SmartTableComponent implements OnChanges {
  @Input() public dossierTypeIds: string[]; // DEPRECATED - use BaseFilters in SmartTableConfig
  @Input() public rowDetailUrl: string;
  @Input() public apiUrl: string;
  @Input() public httpHeaders: HttpHeaders;
  @Input() public columnTypes: SmartTableColumnCustomType[] = [];
  @Input() public configuration: SmartTableConfig;
  @Output() public configurationChange = new EventEmitter<SmartTableConfig>();
  @ViewChild(TableComponent) public tableComponent: TableComponent;

  public options: SmartTableOptions = SMARTTABLE_DEFAULT_OPTIONS;
  public columns: TableColumn[] = [{ value: '', label: '' }];
  public rows: Array<any> = [];
  public orderBy: OrderBy;
  public currentPage: number;
  public pageSize: number;
  public totalResults = 0;
  public rowsLoading: boolean; // Used to trigger the AUI loading row when there's no data
  public pageChanging: boolean; // Used to trigger our custom overlay on top of old data
  public genericFilter: SmartTableFilter;
  public visibleFilters: SmartTableFilter[] = [];
  public optionalFilters: SmartTableFilter[] = [];
  public baseFilters: SmartTableDataQueryFilter[] = [];
  public dataQuery: SmartTableDataQuery = { filters: [], sort: { path: '', ascending: false } };

  constructor(private dataService: SmartTableService, private router: Router, private datePipe: DatePipe) {
    this.pageSize = this.options.pageSize;
    this.currentPage = this.options.currentPage;
    this.rowsLoading = true;
    this.pageChanging = false;
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.configuration) {
      this.configuration = changes.configuration.currentValue;
      if (Array.isArray(this.configuration.columns) && this.configuration.columns.length) {
        this.baseFilters = this.configuration.baseFilters || [];

        if (this.configuration.options) {
          this.options = this.configuration.options;
          this.pageSize = this.configuration.options.pageSize;
          this.currentPage = this.configuration.options.currentPage;
          this.orderBy = this.configuration.options.orderBy || this.configuration.options.defaultSortOrder;
        }

        this.initColumns();
        this.initFilters();

        if (this.columns.length) {
          this.getTableData(this.currentPage, this.pageSize);
        }
      }
    }
  }

  private initColumns() {
    this.columns = [];
    this.configuration.columns.forEach(column => {
      if (column.visible || column.visible == null) {
        const _column: TableColumn = {
          value: column.key,
          label: column.label,
          disableSorting: !column.sortPath
        };

        if (Array.isArray(column.classList) && column.classList.length) {
          _column.classList = column.classList;
        }

        const columnType = this.columnTypes.find(ct => ct.name === column.type);
        if (columnType) {
          _column.format = columnType.format;
          _column.component = columnType.component;
        } else {
          switch (column.type) {
            case SmartTableColumnType.DateTime: {
              _column.format = value => this.datePipe.transform(value, 'dd/MM/yyyy - hh:mm');
              break;
            }
            case SmartTableColumnType.Date: {
              _column.format = value => this.datePipe.transform(value, 'dd/MM/yyyy');
              break;
            }
          }
        }
        this.columns.push(_column);
      }
    });
  }

  private initFilters() {
    if (this.configuration && Array.isArray(this.configuration.filters) && this.configuration.filters.length) {
      this.visibleFilters = this.setupFilter(this.configuration.filters, SmartTableFilterDisplay.Visible);
      this.optionalFilters = this.setupFilter(this.configuration.filters, SmartTableFilterDisplay.Optional);
      this.initGenericFilter();
    }
    this.syncDataQuery();
  }

  private createFilter(filterConfig: SmartTableFilterConfig): SmartTableFilter {
    const filter = new SmartTableFilter();
    filter.id = filterConfig.id;
    filter.type = filterConfig.type;
    filter.fields = [filterConfig.field];
    filter.operator = filterConfig.operator;
    filter.label = filterConfig.label;
    filter.placeholder = filterConfig.placeholder;
    filter.options = filterConfig.options;
    filter.value = filterConfig.value;
    filter.visible = true;
    return filter;
  }

  private setupFilter(filters: SmartTableFilterConfig[], type: SmartTableFilterDisplay) {
    return filters.filter(filter => filter.display === type).map(this.createFilter);
  }

  private initGenericFilter() {
    const genericFilterConfig = this.configuration.filters.find(filter => filter.display === SmartTableFilterDisplay.Generic);
    if (genericFilterConfig) {
      this.genericFilter = new SmartTableFilter();
      this.genericFilter.id = genericFilterConfig.id || 'generic';
      this.genericFilter.value = genericFilterConfig.value;
      this.genericFilter.type = SmartTableFilterType.Input;
      this.genericFilter.fields = (genericFilterConfig.fields) ? [...genericFilterConfig.fields] : [genericFilterConfig.field];
      this.genericFilter.operator = SmartTableFilterOperator.ILike;
      this.genericFilter.label = genericFilterConfig.label || '';
      this.genericFilter.placeholder = this.options.genericFilterPlaceholder;
      this.genericFilter.visible = true;
    }
  }

  private getTableData(page = 1, pageSize?: number) {
    this.pageChanging = !this.rowsLoading;
    this.dataService
    .getData(this.apiUrl, this.httpHeaders, this.dataQuery, page, pageSize || this.pageSize)
    .subscribe(
      data => {
        this.rowsLoading = false;
        this.pageChanging = false;
        if (data._embedded) {
          this.rows = data._embedded.resourceList;
        }
        if (data._page) {
          this.currentPage = data._page.number;
          if (pageSize) {
            this.pageSize = pageSize;
          }
          this.totalResults = data._page.totalElements;
        }
      },
      err => {
        // TODO: hook into logging + alert service once we have one
        console.error('Error: could not get table data');
      }
      );
  }

  public get hasRows(): boolean {
    return !this.rowsLoading && this.totalResults > 0;
  }

  private resetOrderBy() {
    if (this.options.defaultSortOrder) {
      this.orderBy = this.options.defaultSortOrder;
    }
  }

  private syncDataQuery() {
    if (this.orderBy) {
      const sortColumn = this.configuration.columns.find(column => column.key === this.orderBy.key);
      if (sortColumn) {
        this.dataQuery.sort = { path: sortColumn.sortPath, ascending: this.orderBy.order === 'asc' };
      }
    }

    this.dataQuery.filters = [...this.baseFilters];

    // TO DEPRECATE - should use baseFilters instead
    if (Array.isArray(this.dossierTypeIds) && this.dossierTypeIds.length) {
      this.dataQuery.filters.push({
        fields: ['DossierTypeId'],
        value: this.dossierTypeIds
      });
    }

    this.dataQuery.filters = [
    ...this.dataQuery.filters,
    ...this.createDataQueryFilters(this.visibleFilters),
    ...this.createDataQueryFilters(this.optionalFilters)
    ];

    const createdFilter = this.createDataQueryFilter(this.genericFilter);
    if (createdFilter) {
      this.dataQuery.filters.push(createdFilter);
    }
  }

  private createDataQueryFilters(filters: SmartTableFilter[]) {
    return filters.filter(filter => filter && filter.visible && filter.value).map(this.createDataQueryFilter);
  }

  private createDataQueryFilter(filter: SmartTableFilter) {
    if (filter && filter.visible && filter.value) {
      return {
        fields: filter.fields,
        operator: filter.operator,
        value: filter.operator === SmartTableFilterOperator.ILike ? `%${filter.value.toString().trim()}%` : filter.value
      };
    }
  }

  public onPageChanged(page) {
    if (!isNaN(page)) {
      this.configurationChange.emit({
        ...this.configuration,
        options: {
          ...this.configuration.options,
          currentPage: page,
        }
      });
    }
  }

  public onPageSizeChanged(pageSize) {
    if (!isNaN(pageSize)) {
      this.configurationChange.emit({
        ...this.configuration,
        options: {
          ...this.configuration.options,
          pageSize: pageSize,
          currentPage: 1
        }
      });
    }
  }

  public onClickRow(row) {
    this.router.navigateByUrl(this.rowDetailUrl + '/' + row.id);
  }

  public onFilter(value: UpdateFilterArgs) {
    if (this.options.resetSortOrderOnFilter) {
      this.resetOrderBy();
    }

    this.configurationChange.emit({
      ...this.configuration,
      filters: this.configuration.filters.map((filter) => {
        return filter.id === value.filter.id ? {
          ...filter,
          value: value.value
        } : filter;
      }),
      options: {
        ...this.configuration.options,
        orderBy: this.orderBy,
        currentPage: 1
      }
    });
  }

  public onOrderBy(orderBy: OrderBy) {
    this.configurationChange.emit({
      ...this.configuration,
      options: {
        ...this.configuration.options,
        orderBy: orderBy,
        currentPage: 1,
      }
    });
  }
}
