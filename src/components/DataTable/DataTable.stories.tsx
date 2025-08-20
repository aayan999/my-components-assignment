import type { Meta, StoryObj } from '@storybook/react';
import { DataTable } from './DataTable';
import type { Column } from './DataTable';

// Define the shape of table row
interface UserData {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Define columns
const columns: Column<UserData>[] = [
  { key: 'name', title: 'Full Name', dataIndex: 'name', sortable: true },
  { key: 'email', title: 'Email Address', dataIndex: 'email' },
  { key: 'age', title: 'Age', dataIndex: 'age', sortable: true },
];

// Mock data
const data: UserData[] = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', age: 32 },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', age: 28 },
  { id: 3, name: 'Sam Wilson', email: 'sam.wilson@example.com', age: 45 },
  { id: 4, name: 'Alice Johnson', email: 'alice.j@example.com', age: 22 },
];

// Base Meta
const meta: Meta<typeof DataTable<UserData>> = {
  title: 'Components/DataTable',
  component: DataTable<UserData>,
  tags: ['autodocs'],
  argTypes: {
    selectable: {
      control: 'boolean',
      description: 'Allow users to select rows via checkboxes.',
    },
    loading: {
      control: 'boolean',
      description: 'Show skeleton loader while data is loading.',
    },
    data: {
      control: false,
      description: 'The array of row objects (must include `id`).',
    },
    columns: {
      control: false,
      description: 'Column definitions (title, key, dataIndex, and sorter).',
    },
    onRowSelect: {
      action: 'rowSelected',
      description: 'Callback fired with selected rows when selection changes.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Centralized default args
const defaultArgs = {
  columns,
  data,
} as const;

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Selectable: Story = {
  args: {
    ...defaultArgs,
    selectable: true,
  },
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    loading: true,
    data: [], // empty array while loading
  },
};

export const Empty: Story = {
  args: {
    ...defaultArgs,
    data: [], // no data -> empty state message
  },
};

// 🚀 Extra: Sorting demo story
export const WithSorting: Story = {
  args: {
    ...defaultArgs,
    // sorting is defined in column config, no extra props needed
  },
};