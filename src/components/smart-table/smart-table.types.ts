import { Filter } from '@acpaas-ui/ngx-components/utils';
import {
  OrderBy,
  TableColumnFormat,
} from '@acpaas-ui/ngx-components/table';
import { Component } from '@angular/core';

export interface SmartTableOptions {
  defaultSortOrder: OrderBy;
  orderBy?: OrderBy;
  genericFilterPlaceholder: string;
  loadDataMessage: string;
  noDataMessage: string;
  currentPage: number;
  pageSize: number;
  pageSizeOptions: number[];
  resetSortOrderOnFilter: boolean;
}

// NOTE: keep in sync with C#
export enum SmartTableColumnType {
  Number = 'number',
  Text = 'text',
  Date = 'date',
  DateTime = 'dateTime'
}

export interface SmartTableColumnCustomType {
  name: string;
  format: TableColumnFormat;
  component?: Component;
}

// NOTE: keep in sync with C#
export interface SmartTableConfig {
  baseFilters: SmartTableDataQueryFilter[];
  columns: SmartTableColumnConfig[];
  filters: SmartTableFilterConfig[];
  options: SmartTableOptions;
}

// NOTE: keep in sync with C#
export interface SmartTableColumnConfig {
  visible: boolean;
  label: string;
  key: string;
  type: string;
  classList?: string[];
  sortPath: string;
}

// NOTE: keep in sync with C#
export enum SmartTableFilterType {
  Select = 'select',
  Input = 'input',
  Datepicker = 'datepicker',
}

// NOTE: keep in sync with C#
export enum SmartTableFilterDisplay {
  Generic = 'generic',
  Visible = 'visible',
  Optional = 'optional'
}

// NOTE: keep in sync with C#
export enum SmartTableFilterOperator {
  Equal = '=',
  ILike = 'ILIKE'
}

// NOTE: keep in sync with C#
export interface SmartTableFilterConfig {
  id: string;
  type: SmartTableFilterType;
  field: string;
  fields?: string[];
  operator?: SmartTableFilterOperator;
  display: SmartTableFilterDisplay;
  label: string;
  options?: any[];            // Currently applies only to filters of type 'Select'
  placeholder?: string;
  value: string | any[];      // See ACPaaS Filter class
}

export class SmartTableFilter extends Filter {
  type: SmartTableFilterType;
  fields: string[];
  operator?: SmartTableFilterOperator;
  label: string;
  placeholder?: string;
  visible: boolean;
}

export interface UpdateFilterArgs {
  filter: SmartTableFilter;
  value: string | any[];      // See ACPaaS Filter class
}

// NOTE: keep in sync with C#
export interface SmartTableDataQuery {
  filters: SmartTableDataQueryFilter[];
  sort: SmartTableDataQuerySortOrder;
}

// NOTE: keep in sync with C#
export interface SmartTableDataQueryFilter {
  fields: string[];
  operator?: SmartTableFilterOperator;
  value: any;
}

// NOTE: keep in sync with C#
export interface SmartTableDataQuerySortOrder {
  path: string;
  ascending: boolean;
}
