import { apiRequest } from '../api/restClient';

const unwrapData = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object') {
    const container = payload as { data?: unknown };
    if (container.data !== undefined) {
      return container.data as T;
    }
  }
  return payload as T;
};

const BASE_URL = '/api/mcn';

export interface McnOverviewResponse {
  user?: {
    user_id: string;
    user_name: string;
    user_phone: string;
    role_id: string;
    role_name: string;
    email?: string | null;
  } | null;
  available_modules?: string[];
  available_module_labels?: string[];
  permissions_summary?: Array<{
    module_id: string;
    module_label: string;
    access_level?: string;
  }>;
  statistics?: {
    department_count?: number;
    employee_count?: number;
    talent_count?: number;
  } | null;
  contact_phone?: string | null;
  last_sync_at?: string | null;
}

export interface DepartmentListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  moduleId?: string;
}

export interface DepartmentListItem {
  department_id: string;
  department_name: string;
  permission_modules?: string[];
  permission_module_labels?: string[];
  leader_phone?: string | null;
  phone?: string | null;
  [key: string]: unknown;
}

export interface DepartmentListResponse {
  page: number;
  page_size: number;
  total: number;
  items: DepartmentListItem[];
}

export interface EmployeeListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  moduleId?: string;
  status?: string;
}

export interface EmployeeListItem {
  employee_id: string;
  name: string;
  phone: string;
  email?: string | null;
  title?: string | null;
  module_ids?: string[];
  module_labels?: string[];
  status?: string | null;
  joined_at?: string | null;
  last_login_at?: string | null;
  tags?: string[];
  [key: string]: unknown;
}

export interface EmployeeListResponse {
  page: number;
  page_size: number;
  total: number;
  items: EmployeeListItem[];
}

export interface TalentListParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  moduleId?: string;
  status?: string;
}

export interface TalentListItem {
  talent_id: string;
  name: string;
  phone: string;
  module_ids?: string[];
  module_labels?: string[];
  manager_name?: string | null;
  manager_phone?: string | null;
  status?: string | null;
  signed_at?: string | null;
  tags?: string[];
  platform_accounts?: Array<{
    platform: string;
    account_id: string;
    nickname?: string;
  }>;
  [key: string]: unknown;
}

export interface TalentListResponse {
  page: number;
  page_size: number;
  total: number;
  items: TalentListItem[];
}

export interface UpdateDepartmentPayload {
  operator_id: string;
  department_name: string;
  permission_modules: string[];
  description?: string;
  leader_user_id?: string;
  leader_name?: string;
  leader_phone?: string;
  contact_phone?: string;
  tags?: string[];
}

export interface UpdateMemberPayload {
  operator_id: string;
  name: string;
  phone: string;
  module_ids: string[];
  email?: string;
  title?: string;
  status?: string;
  tags?: string[];
  remark?: string;
  manager_name?: string;
  manager_phone?: string;
  platform_accounts?: Array<{
    platform: string;
    account_id: string;
    nickname?: string;
  }>;
}

export const fetchMcnOverview = async (params: {
  roleId?: string;
}): Promise<McnOverviewResponse> => {
  const searchParams = new URLSearchParams();
  if (params.roleId) {
    searchParams.set('role_id', params.roleId);
  }
  const query = searchParams.toString();
  const response = await apiRequest<McnOverviewResponse | { data: McnOverviewResponse }>(
    `${BASE_URL}/overview${query ? `?${query}` : ''}`,
    {
      method: 'GET',
    },
  );
  return unwrapData<McnOverviewResponse>(response);
};

export const fetchDepartments = async (params: DepartmentListParams): Promise<DepartmentListResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('page_size', String(params.pageSize ?? 10));
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  if (params.moduleId) {
    searchParams.set('module_id', params.moduleId);
  }
  const response = await apiRequest<DepartmentListResponse | { data: DepartmentListResponse }>(
    `${BASE_URL}/departments?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
  return unwrapData<DepartmentListResponse>(response);
};

export const fetchDepartmentEmployees = async (
  departmentId: string,
  params: EmployeeListParams = {},
): Promise<EmployeeListResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('page_size', String(params.pageSize ?? 10));
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  if (params.moduleId) {
    searchParams.set('module_id', params.moduleId);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  const response = await apiRequest<EmployeeListResponse | { data: EmployeeListResponse }>(
    `${BASE_URL}/departments/${departmentId}/employees?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
  return unwrapData<EmployeeListResponse>(response);
};

export const fetchDepartmentTalents = async (
  departmentId: string,
  params: TalentListParams = {},
): Promise<TalentListResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('page_size', String(params.pageSize ?? 10));
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  if (params.moduleId) {
    searchParams.set('module_id', params.moduleId);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  const response = await apiRequest<TalentListResponse | { data: TalentListResponse }>(
    `${BASE_URL}/departments/${departmentId}/talents?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
  return unwrapData<TalentListResponse>(response);
};

export const updateDepartmentInfo = async (
  departmentId: string,
  payload: UpdateDepartmentPayload,
): Promise<void> => {
  await apiRequest(`${BASE_URL}/departments/${departmentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const updateEmployeeInfo = async (
  departmentId: string,
  employeeId: string,
  payload: UpdateMemberPayload,
): Promise<void> => {
  await apiRequest(`${BASE_URL}/departments/${departmentId}/employees/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const updateTalentInfo = async (
  departmentId: string,
  talentId: string,
  payload: UpdateMemberPayload,
): Promise<void> => {
  await apiRequest(`${BASE_URL}/departments/${departmentId}/talents/${talentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

// MCN员工管理 - 直接查询MCN员工列表
export const fetchMcnEmployees = async (params: EmployeeListParams = {}): Promise<EmployeeListResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('page_size', String(params.pageSize ?? 10));
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  if (params.moduleId) {
    searchParams.set('module_id', params.moduleId);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  const response = await apiRequest<EmployeeListResponse | { data: EmployeeListResponse }>(
    `${BASE_URL}/employees?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
  return unwrapData<EmployeeListResponse>(response);
};

// MCN达人管理 - 直接查询MCN达人列表
export const fetchMcnTalents = async (params: TalentListParams = {}): Promise<TalentListResponse> => {
  const searchParams = new URLSearchParams();
  searchParams.set('page', String(params.page ?? 1));
  searchParams.set('page_size', String(params.pageSize ?? 10));
  if (params.keyword) {
    searchParams.set('keyword', params.keyword);
  }
  if (params.moduleId) {
    searchParams.set('module_id', params.moduleId);
  }
  if (params.status) {
    searchParams.set('status', params.status);
  }
  const response = await apiRequest<TalentListResponse | { data: TalentListResponse }>(
    `${BASE_URL}/talents?${searchParams.toString()}`,
    {
      method: 'GET',
    },
  );
  return unwrapData<TalentListResponse>(response);
};

// MCN员工信息更新 - 直接更新MCN员工
export const updateMcnEmployeeInfo = async (
  employeeId: string,
  payload: UpdateMemberPayload,
): Promise<void> => {
  await apiRequest(`${BASE_URL}/employees/${employeeId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

// MCN达人信息更新 - 直接更新MCN达人
export const updateMcnTalentInfo = async (
  talentId: string,
  payload: UpdateMemberPayload,
): Promise<void> => {
  await apiRequest(`${BASE_URL}/talents/${talentId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};
