import { SmartTableFilter } from '../smart-table/smart-table.types';

export interface FilterMovedEventArgs {
  filter: SmartTableFilter;
  oldIndex: number;
  newIndex: number;
}

export interface FilterToggledArgs {
  filter: SmartTableFilter;
  visible: boolean;
}
