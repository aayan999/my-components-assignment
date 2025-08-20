import type { Meta, StoryObj } from '@storybook/react';
import { InputField } from './InputField';

const meta: Meta<typeof InputField> = {
  title: 'Components/InputField',
  component: InputField,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'Visual style variant of the input field',
      control: { type: 'radio' },
      options: ['outlined', 'filled', 'ghost'],
    },
    size: {
      description: 'Control the input field size',
      control: { type: 'radio' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      description: 'Disable the input field',
      control: 'boolean',
    },
    invalid: {
      description: 'Mark the input as invalid (red border, error text)',
      control: 'boolean',
    },
    loading: {
      description: 'Show a loading indicator inside the input',
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ✅ Define baseline default args
const defaultArgs = {
  label: 'Email Address',
  placeholder: 'you@example.com',
  helperText: 'This is some helpful text.',
} as const;

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Invalid: Story = {
  args: {
    ...defaultArgs,
    invalid: true,
    errorMessage: 'This email address is not valid.',
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    label: 'Disabled Input',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    ...defaultArgs,
    label: 'Loading Input',
    loading: true,
  },
};

export const Filled: Story = {
  args: {
    ...defaultArgs,
    label: 'Filled Input',
    variant: 'filled',
  },
};

export const Ghost: Story = {
  args: {
    ...defaultArgs,
    label: 'Ghost Input',
    variant: 'ghost',
  },
};

export const Small: Story = {
  args: {
    ...defaultArgs,
    label: 'Small Input',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    ...defaultArgs,
    label: 'Large Input',
    size: 'lg',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    type: 'password',
  },
};

export const WithClearButton: Story = {
  args: {
    ...defaultArgs,
    label: 'Input with Clear Button',
    showClearButton: true,
    value: 'Some text to clear',
  },
};