import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { SmartTableFilter } from '../smart-table/smart-table.types';
import {
  FilterMovedEventArgs,
  FilterToggledArgs,
} from './table-filter-selector.types';

/** Used to generate unique ID's for each filter selector component (idea from Angular Material --> tab-group component) */
let nextId = 0;

@Component({
  selector: 'aui-table-filter-selector',
  templateUrl: './table-filter-selector.component.html',
  styleUrls: ['./table-filter-selector.component.scss']
})
export class TableFilterSelectorComponent {
  @Input() filters: SmartTableFilter[] = [];
  @Output() filterMoved = new EventEmitter<FilterMovedEventArgs>();
  @Output() filterToggled = new EventEmitter<FilterToggledArgs>();
  public id: number;
  public currentTarget;

  constructor() {
    this.id = nextId++;
  }

  public onFilterMove(filter, i) {
    const index = this.filters.findIndex((o) => {
      return o.label === filter.label;
    });

    const target = index + i;
    if (target < 0 || target > this.filters.length - 1) {
      return;
    }

    this.filters.splice(index, 1); // Delete previous filter position
    this.filters.splice(target, 0, filter); // Add new position

    // Use timeout to fix re-rendering issue
    setTimeout(() => {
      this.currentTarget = target;
    });

    this.filterMoved.emit({ filter: filter, oldIndex: index, newIndex: target });
  }

  public onFilterToggle(filter: SmartTableFilter) {
    filter.visible = !filter.visible;
    this.filterToggled.emit({ filter: filter, visible: filter.visible });
  }
}
