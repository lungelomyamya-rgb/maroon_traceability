// UI Component Types
import { ReactNode } from 'react';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  testId?: string;
}

// Size variants
export type SizeVariant = 'sm' | 'default' | 'lg' | 'xl';
export type ButtonSizeVariant = SizeVariant | 'icon';

// Color variants
export type ColorVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'ghost' | 'outline' | 'destructive' | 'link';

// Status variants
export type StatusVariant = 'online' | 'offline' | 'busy' | 'away' | 'invisible';

// Loading states
export interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  loadingComponent?: ReactNode;
}

// Error states
export interface ErrorState {
  hasError: boolean;
  error?: Error | string;
  errorComponent?: ReactNode;
  onRetry?: () => void;
}

// Form component types
export interface FormFieldProps extends BaseComponentProps {
  id?: string;
  name?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: ReactNode;
}

export interface SelectProps extends FormFieldProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  searchable?: boolean;
  clearable?: boolean;
  multiple?: boolean;
}

export interface CheckboxProps extends FormFieldProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

export interface SwitchProps extends FormFieldProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

// Modal/Dialog types
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  size?: SizeVariant;
  closable?: boolean;
  maskClosable?: boolean;
  centered?: boolean;
}

// Table types
export interface TableColumn<T = unknown> {
  key?: keyof T | string;
  label: string;
  header?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: T[keyof T], row: T) => ReactNode;
  accessor?: (row: T) => ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface TableProps<T = unknown> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  empty?: ReactNode;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  sorting?: {
    field?: keyof T;
    order?: 'asc' | 'desc';
    onChange: (field: keyof T, order: 'asc' | 'desc') => void;
  };
  onRowClick?: (row: T, index: number) => void;
  onRowSelect?: (selectedRows: T[]) => void;
  rowSelection?: {
    selectedRowKeys: React.Key[];
    onChange: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
  };
}

// Card types
export interface CardProps extends BaseComponentProps {
  variant?: ColorVariant;
  hoverable?: boolean;
  loading?: boolean;
  bordered?: boolean;
  size?: SizeVariant;
  title?: string;
  extra?: ReactNode;
  actions?: ReactNode;
}

// Alert types
export interface AlertProps extends BaseComponentProps {
  variant?: ColorVariant;
  showIcon?: boolean;
  closable?: boolean;
  banner?: boolean;
  message?: string;
  description?: string;
  action?: ReactNode;
  onClose?: () => void;
}

// Badge types
export interface BadgeProps extends BaseComponentProps {
  variant?: ColorVariant;
  size?: SizeVariant;
  count?: number;
  dot?: boolean;
  showZero?: boolean;
  offset?: [number, number];
  status?: StatusVariant;
}

// Avatar types
export interface AvatarProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  size?: SizeVariant;
  shape?: 'circle' | 'square';
  fallback?: string;
  icon?: ReactNode;
}

// Progress types
export interface ProgressProps extends BaseComponentProps {
  percent?: number;
  status?: ColorVariant;
  format?: (percent?: number) => ReactNode;
  strokeWidth?: number;
  trailColor?: string;
  strokeLinecap?: 'butt' | 'round';
  gapDegree?: number;
  gapPosition?: 'top' | 'bottom' | 'left' | 'right';
  successPercent?: number;
  successStrokeColor?: string;
}

// Skeleton types
export interface SkeletonProps extends BaseComponentProps {
  loading?: boolean;
  active?: boolean;
  paragraph?: boolean | { rows: number; width?: string | number };
  title?: boolean | { width?: string | number };
  avatar?: boolean | { size?: SizeVariant; shape?: 'circle' | 'square' };
  round?: boolean;
}

// Tooltip types
export interface TooltipProps extends BaseComponentProps {
  title: ReactNode;
  placement?: 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
  trigger?: 'hover' | 'click' | 'focus';
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
}

// Popover types
export interface PopoverProps extends BaseComponentProps {
  content: ReactNode;
  title?: ReactNode;
  trigger?: 'click' | 'hover' | 'focus';
  placement?: TooltipProps['placement'];
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
}

// Dropdown types
export interface DropdownProps extends BaseComponentProps {
  menu: ReactNode;
  triggerNode?: ReactNode;
  placement?: TooltipProps['placement'];
  disabled?: boolean;
  trigger?: 'click' | 'hover' | 'contextMenu';
}

// Breadcrumb types
export interface BreadcrumbItem {
  key?: string;
  href?: string;
  title: ReactNode;
  separator?: ReactNode;
}

export interface BreadcrumbProps extends BaseComponentProps {
  items?: BreadcrumbItem[];
  separator?: ReactNode;
}

// Menu types
export interface MenuItemProps {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  children?: MenuItemProps[];
  onClick?: (info: { key: string; keyPath: string[]; item: MenuItemProps }) => void;
}

export interface MenuProps extends BaseComponentProps {
  mode?: 'vertical' | 'horizontal' | 'inline';
  items?: MenuItemProps[];
  defaultSelectedKeys?: string[];
  selectedKeys?: string[];
  defaultOpenKeys?: string[];
  openKeys?: string[];
  onSelect?: (selectedKeys: string[], info: { selected: boolean; selectedNodes: MenuItemProps[] }) => void;
  onOpenChange?: (openKeys: string[]) => void;
}

// Steps types
export interface StepProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
}

export interface StepsProps extends BaseComponentProps {
  current?: number;
  status?: StepProps['status'];
  size?: SizeVariant;
  direction?: 'horizontal' | 'vertical';
  labelPlacement?: 'horizontal' | 'vertical';
  items?: StepProps[];
  onChange?: (current: number) => void;
}

// Timeline types
export interface TimelineItem {
  key?: string;
  color?: ColorVariant;
  dot?: ReactNode;
  children?: ReactNode;
  label?: ReactNode;
}

export interface TimelineProps extends BaseComponentProps {
  items?: TimelineItem[];
  mode?: 'left' | 'alternate' | 'right';
  reverse?: boolean;
  pending?: boolean;
  pendingDot?: ReactNode;
}

// Upload types
export interface UploadFile {
  uid: string;
  name: string;
  status?: 'uploading' | 'done' | 'error' | 'removed';
  response?: Record<string, unknown>;
  url?: string;
  originFileObj?: File;
  percent?: number;
}

export interface UploadProps extends BaseComponentProps {
  action?: string;
  accept?: string;
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>;
  customRequest?: (options: { file: File; onSuccess: (response?: Record<string, unknown>) => void; onError: (error: Error) => void; onProgress?: (event: { percent: number }) => void; data?: Record<string, unknown>; filename?: string; withCredentials?: boolean; action?: string; headers?: Record<string, string>; }) => void;
  data?: Record<string, unknown>;
  defaultFileList?: UploadFile[];
  directory?: boolean;
  disabled?: boolean;
  fileList?: UploadFile[];
  headers?: Record<string, string>;
  listType?: 'text' | 'picture' | 'picture-card';
  maxCount?: number;
  method?: 'POST' | 'PUT' | 'POST' | 'DELETE';
  multiple?: boolean;
  name?: string;
  previewFile?: (file: File) => Promise<string>;
  showUploadList?: boolean;
  withCredentials?: boolean;
  onChange?: (info: { file: UploadFile; fileList: UploadFile[] }) => void;
  onDrop?: (e: React.DragEvent) => void;
  onPreview?: (file: UploadFile) => void;
  onRemove?: (file: UploadFile) => boolean | Promise<boolean>;
}

// JSON utility types
export type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export interface JsonObject {
  [key: string]: JsonValue;
}
export type JsonArray = Array<JsonValue>
export type GenericRecord = Record<string, unknown>;

// Utility types (these are built-in TypeScript types, but re-exported for convenience)
// export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
// export type Partial<T> = { [P in keyof T]?: T[P] };
// export type Required<T> = { [P in keyof T]-?: T[P] };
// export type Readonly<T> = { readonly [P in keyof T]: T[P] };

// Event handler types
export type EventHandler<T = Event> = (event: T) => void;
export type KeyboardEventHandler = EventHandler<React.KeyboardEvent>;
export type MouseEventHandler = EventHandler<React.MouseEvent<HTMLElement>>;
export type ChangeEventHandler<T extends EventTarget = HTMLInputElement> = EventHandler<React.ChangeEvent<T>>;
export type FocusEventHandler = EventHandler<React.FocusEvent<HTMLElement>>;

// Animation types
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  animation?: string;
}

// Responsive types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;
export type ResponsiveProps<T> = {
  [K in keyof T]?: T[K] | ResponsiveValue<T[K]>;
};

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    neutral: string;
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
      disabled: string;
      inverse: string;
    };
    border: {
      primary: string;
      secondary: string;
      disabled: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      xxl: string;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
}
