export interface LayoutModel {
  rows: Array<{
    name: string;
    value: string;
  }>;
  columns: Array<{
    name: string;
    value: string;
  }>;
  filters: Array<{
    name: string;
    value: string;
  }>;
  excluded: Array<{
    name: string;
    value: string;
  }>;
}

export const INITIAL_LAYOUT_MODEL: LayoutModel = {
  rows: [{
    name: 'OrgUnits',
    value: 'ou'
  }],
  columns: [{
    name: 'Data',
    value: 'dx'
  }],
  filters: [{
  name: 'Period',
    value: 'pe'
  }],
  excluded: [{
    name: 'Excluded Dimension',
    value: 'co'
  }]
};

// {
//   name: 'Filter',
//     value: 'ou'
// }
// {
//   name: 'Period',
//     value: 'pe'
// }
