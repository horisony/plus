import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Empty,
  Form,
  Input,
  Result,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
  Modal,
  Upload,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { PlusOutlined, ReloadOutlined, ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import {
  fetchDepartments,
  fetchDepartmentEmployees,
  fetchDepartmentTalents,
  fetchMcnEmployees,
  fetchMcnTalents,
  fetchMcnOverview,
  type DepartmentListItem,
  type EmployeeListItem,
  type McnOverviewResponse,
  type TalentListItem,
  type UpdateMemberPayload,
  updateDepartmentInfo,
  updateEmployeeInfo,
  updateTalentInfo,
  updateMcnEmployeeInfo,
  updateMcnTalentInfo,
} from '../../shared/services/permissionService';
import type { DepartmentListParams, EmployeeListParams, TalentListParams } from '../../shared/services/permissionService';
import useAuth from '../auth/hooks/useAuth';
import { designTokens } from '../content-ops/constants/designTokens';
import './PermissionManagementLanding.css';

const MODULE_LABELS: Record<string, string> = {
  PLUSCO001: 'AI 数据管家',
  PLUSCO002: 'AI 内容厨房',
  PLUSCO003: 'AI 商业助理',
  PLUSCO004: 'AI 经纪人',
};

interface DepartmentRecord {
  key: string;
  departmentId: string;
  name: string;
  permissions: string[];
  moduleIds: string[];
  leaderPhone?: string;
}

interface MemberRecord {
  key: string;
  id: string;
  name: string;
  phone: string;
  modules: string[];
  moduleLabels?: string[];
  departmentId: string;
}

interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

const { Title } = Typography;

type SidebarKey = 'mcnDepartment' | 'mcnEmployee' | 'mcnTalent' | 'brandDepartment' | 'brandEmployee';

interface SidebarOption {
  key: SidebarKey;
  label: string;
  description: string;
}

const SIDEBAR_PRESETS: Partial<Record<SidebarKey, SidebarOption>> = {
  mcnDepartment: {
    key: 'mcnDepartment',
    label: 'MCN 部门管理',
    description: '规划 MCN 旗下部门与协作关系',
  },
  mcnEmployee: {
    key: 'mcnEmployee',
    label: 'MCN 员工管理',
    description: '配置员工权限与模块访问能力',
  },
  mcnTalent: {
    key: 'mcnTalent',
    label: 'MCN 达人管理',
    description: '维护达人资源与经纪协作信息',
  },
  brandDepartment: {
    key: 'brandDepartment',
    label: '品牌部门管理',
    description: '规划品牌侧的部门组织结构',
  },
  brandEmployee: {
    key: 'brandEmployee',
    label: '品牌员工管理',
    description: '为品牌员工分配场景权限',
  },
};

const DEFAULT_PAGE_SIZE = 10;

const PermissionManagementLanding: React.FC = () => {
  const location = useLocation();
  const searchParams = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const requestedRoleName = searchParams.get('role') ?? undefined;
  const requestedRoleId = searchParams.get('role_id') ?? undefined;

  const { user } = useAuth();
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);
  const [overview, setOverview] = useState<McnOverviewResponse | null>(null);
  const [activeTab, setActiveTab] = useState<SidebarKey>('mcnEmployee');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentRecord | null>(null);
  const [departmentDetailTab, setDepartmentDetailTab] = useState<'employee' | 'talent'>('employee');
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importContext, setImportContext] = useState<'employee' | 'talent'>('employee');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editContext, setEditContext] = useState<'department' | 'employee' | 'talent' | null>(null);
  const [editTarget, setEditTarget] = useState<DepartmentRecord | MemberRecord | null>(null);
  const [editParentKey, setEditParentKey] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [departmentList, setDepartmentList] = useState<DepartmentRecord[]>([]);
  const [departmentPagination, setDepartmentPagination] = useState<PaginationState>({ page: 1, pageSize: 10, total: 0 });
  const [departmentLoading, setDepartmentLoading] = useState(false);
  const [departmentError, setDepartmentError] = useState<string | null>(null);
  const [employeeList, setEmployeeList] = useState<MemberRecord[]>([]);
  const [employeePagination, setEmployeePagination] = useState<PaginationState>({ page: 1, pageSize: 10, total: 0 });
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employeeError, setEmployeeError] = useState<string | null>(null);
  const [talentList, setTalentList] = useState<MemberRecord[]>([]);
  const [talentPagination, setTalentPagination] = useState<PaginationState>({ page: 1, pageSize: 10, total: 0 });
  const [talentLoading, setTalentLoading] = useState(false);
  const [talentError, setTalentError] = useState<string | null>(null);

  const loadOverview = useCallback(async () => {
  const effectiveRoleId = requestedRoleId ?? user?.roles?.[0]?.roleId;
    if (!effectiveRoleId) {
      setOverviewLoading(false);
      setOverviewError('缺少角色信息');
      setOverview(null);
      return;
    }
    setOverviewLoading(true);
    setOverviewError(null);
    try {
      const response = await fetchMcnOverview({
        roleId: effectiveRoleId,
      });
      setOverview(response);
    } catch (err) {
      const message = err instanceof Error ? err.message : '主体信息获取失败';
      setOverviewError(message);
      setOverview(null);
    } finally {
      setOverviewLoading(false);
    }
  }, [requestedRoleId, user?.roles]);

  useEffect(() => {
    if (!user) {
      return;
    }
    void loadOverview();
  }, [loadOverview, user]);

  const resolvedRoleName = useMemo(
    () => overview?.user?.role_name || requestedRoleName || user?.roles?.[0]?.name || '未提供角色名称',
    [overview?.user?.role_name, requestedRoleName, user?.roles],
  );
  const resolvedRoleId = useMemo(
    () => overview?.user?.role_id || requestedRoleId || user?.roles?.[0]?.roleId || '未提供角色标识',
    [overview?.user?.role_id, requestedRoleId, user?.roles],
  );

  const availableModules = useMemo(
    () => overview?.available_modules ?? user?.modules ?? [],
    [overview?.available_modules, user?.modules],
  );
  const fallbackModuleIds = useMemo(() => Object.keys(MODULE_LABELS), []);
  const resolvedModuleIds = useMemo(
    () => (availableModules.length > 0 ? availableModules : fallbackModuleIds),
    [availableModules, fallbackModuleIds],
  );

  const moduleOptions = useMemo(
    () =>
      resolvedModuleIds.map((moduleId) => ({
        value: moduleId,
        label: MODULE_LABELS[moduleId] ?? moduleId,
      })),
    [resolvedModuleIds],
  );

  const labelToModuleId = useMemo(
    () =>
      moduleOptions.reduce<Record<string, string>>((acc, option) => {
        acc[option.label] = option.value as string;
        return acc;
      }, {}),
    [moduleOptions],
  );

  const mapModulesToLabels = useCallback(
    (modules: string[]) =>
      modules.map(
        (moduleId) => moduleOptions.find((option) => option.value === moduleId)?.label ?? moduleId,
      ),
    [moduleOptions],
  );

  const normalizePermissionsToModules = useCallback(
    (permissions: string[]) => {
      if (permissions.length === 0) {
        return [...resolvedModuleIds];
      }
      const normalized = permissions.map((permission) => labelToModuleId[permission] ?? permission);
      return normalized.length > 0 ? normalized : [...resolvedModuleIds];
    },
    [labelToModuleId, resolvedModuleIds],
  );

  const editModalTitle = useMemo(() => {
    switch (editContext) {
      case 'department':
        return '编辑部门信息';
      case 'employee':
        return '编辑员工信息';
      case 'talent':
        return '编辑达人信息';
      default:
        return '编辑信息';
    }
  }, [editContext]);

  const lowerRole = `${resolvedRoleName ?? ''}${resolvedRoleId ?? ''}`.toLowerCase();
  const isMcnRole = lowerRole.includes('mcn');
  const isDepartmentRole = lowerRole.includes('部门') || lowerRole.includes('department');
  const isBrandRole = lowerRole.includes('brand') || lowerRole.includes('品牌');
  const isPluscoDepartmentRole = (resolvedRoleId ?? '').toUpperCase() === 'PLUSCO_ROLE_DEPARTMENT';

  const sidebarOptions = useMemo<SidebarOption[]>(() => {
    if (isMcnRole) {
      if (isDepartmentRole) {
        // 部门账号需要同时管理员工和达人
        return [SIDEBAR_PRESETS.mcnEmployee!, SIDEBAR_PRESETS.mcnTalent!];
      }
      // MCN 主账号也需要看到员工与达人入口
      return [SIDEBAR_PRESETS.mcnDepartment!, SIDEBAR_PRESETS.mcnEmployee!, SIDEBAR_PRESETS.mcnTalent!];
    }

    if (isPluscoDepartmentRole) {
      return [SIDEBAR_PRESETS.mcnEmployee!, SIDEBAR_PRESETS.mcnTalent!];
    }

    if (isBrandRole) {
      if (isDepartmentRole) {
        return [SIDEBAR_PRESETS.brandEmployee!];
      }
      return [SIDEBAR_PRESETS.brandDepartment!, SIDEBAR_PRESETS.brandEmployee!];
    }

    return [SIDEBAR_PRESETS.mcnEmployee!];
  }, [isBrandRole, isDepartmentRole, isMcnRole, isPluscoDepartmentRole]);

  useEffect(() => {
    if (!sidebarOptions.some((option) => option.key === activeTab)) {
      setActiveTab(sidebarOptions[0].key);
    }
  }, [activeTab, sidebarOptions]);

  useEffect(() => {
    if (activeTab !== 'mcnDepartment') {
      setSelectedDepartment(null);
    }
  }, [activeTab]);

  const loadDepartmentList = useCallback(
    async (
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      extraParams: Partial<DepartmentListParams> = {},
    ) => {
      setDepartmentLoading(true);
      setDepartmentError(null);
      try {
        const response = await fetchDepartments({
          page,
          pageSize,
          keyword: extraParams.keyword,
          moduleId: extraParams.moduleId,
        });
        const items = response.items ?? [];
        setDepartmentList(
          items.map((item: DepartmentListItem) => ({
            key: item.department_id,
            departmentId: item.department_id,
            name: item.department_name,
            permissions:
              item.permission_module_labels?.length
                ? item.permission_module_labels
                : item.permission_modules ?? [],
            moduleIds: item.permission_modules ?? [],
            leaderPhone: item.leader_phone ?? item.phone ?? undefined,
          })),
        );
        setDepartmentPagination({
          page: response.page ?? page,
          pageSize: response.page_size ?? pageSize,
          total: response.total ?? items.length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '部门信息获取失败';
        setDepartmentError(errorMessage);
        setDepartmentList([]);
        setDepartmentPagination((prev) => ({ ...prev, page, pageSize, total: 0 }));
        message.error(errorMessage);
      } finally {
        setDepartmentLoading(false);
      }
    },
    [],
  );

  const loadEmployeeList = useCallback(
    async (
      departmentId: string,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      extraParams: Partial<EmployeeListParams> = {},
    ) => {
      setEmployeeLoading(true);
      setEmployeeError(null);
      try {
        const response = await fetchDepartmentEmployees(departmentId, {
          page,
          pageSize,
          keyword: extraParams.keyword,
          moduleId: extraParams.moduleId,
          status: extraParams.status,
        });
        const items = response.items ?? [];
        setEmployeeList(
          items.map((item: EmployeeListItem) => ({
            key: item.employee_id,
            id: item.employee_id,
            name: item.name,
            phone: item.phone,
            modules: item.module_ids ?? [],
            moduleLabels: item.module_labels ?? [],
            departmentId,
          })),
        );
        setEmployeePagination({
          page: response.page ?? page,
          pageSize: response.page_size ?? pageSize,
          total: response.total ?? items.length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '员工信息获取失败';
        setEmployeeError(errorMessage);
        setEmployeeList([]);
        setEmployeePagination((prev) => ({ ...prev, page, pageSize, total: 0 }));
        message.error(errorMessage);
      } finally {
        setEmployeeLoading(false);
      }
    },
    [],
  );

  const loadTalentList = useCallback(
    async (
      departmentId: string,
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      extraParams: Partial<TalentListParams> = {},
    ) => {
      setTalentLoading(true);
      setTalentError(null);
      try {
        const response = await fetchDepartmentTalents(departmentId, {
          page,
          pageSize,
          keyword: extraParams.keyword,
          moduleId: extraParams.moduleId,
          status: extraParams.status,
        });
        const items = response.items ?? [];
        setTalentList(
          items.map((item: TalentListItem) => ({
            key: item.talent_id,
            id: item.talent_id,
            name: item.name,
            phone: item.phone,
            modules: item.module_ids ?? [],
            moduleLabels: item.module_labels ?? [],
            departmentId,
          })),
        );
        setTalentPagination({
          page: response.page ?? page,
          pageSize: response.page_size ?? pageSize,
          total: response.total ?? items.length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '达人信息获取失败';
        setTalentError(errorMessage);
        setTalentList([]);
        setTalentPagination((prev) => ({ ...prev, page, pageSize, total: 0 }));
        message.error(errorMessage);
      } finally {
        setTalentLoading(false);
      }
    },
    [],
  );

  // MCN员工管理 - 直接查询MCN员工列表（用于部门账号）
  const loadMcnEmployeeList = useCallback(
    async (
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      extraParams: Partial<EmployeeListParams> = {},
    ) => {
      setEmployeeLoading(true);
      setEmployeeError(null);
      try {
        const response = await fetchMcnEmployees({
          page,
          pageSize,
          keyword: extraParams.keyword,
          moduleId: extraParams.moduleId,
          status: extraParams.status,
        });
        const items = response.items ?? [];
        setEmployeeList(
          items.map((item: EmployeeListItem) => ({
            key: item.employee_id,
            id: item.employee_id,
            name: item.name,
            phone: item.phone,
            modules: item.module_ids ?? [],
            moduleLabels: item.module_labels ?? [],
            departmentId: '', // MCN员工管理不需要部门ID
          })),
        );
        setEmployeePagination({
          page: response.page ?? page,
          pageSize: response.page_size ?? pageSize,
          total: response.total ?? items.length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'MCN员工信息获取失败';
        setEmployeeError(errorMessage);
        setEmployeeList([]);
        setEmployeePagination((prev) => ({ ...prev, page, pageSize, total: 0 }));
        message.error(errorMessage);
      } finally {
        setEmployeeLoading(false);
      }
    },
    [],
  );

  // MCN达人管理 - 直接查询MCN达人列表（用于部门账号）
  const loadMcnTalentList = useCallback(
    async (
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      extraParams: Partial<TalentListParams> = {},
    ) => {
      setTalentLoading(true);
      setTalentError(null);
      try {
        const response = await fetchMcnTalents({
          page,
          pageSize,
          keyword: extraParams.keyword,
          moduleId: extraParams.moduleId,
          status: extraParams.status,
        });
        const items = response.items ?? [];
        setTalentList(
          items.map((item: TalentListItem) => ({
            key: item.talent_id,
            id: item.talent_id,
            name: item.name,
            phone: item.phone,
            modules: item.module_ids ?? [],
            moduleLabels: item.module_labels ?? [],
            departmentId: '', // MCN达人管理不需要部门ID
          })),
        );
        setTalentPagination({
          page: response.page ?? page,
          pageSize: response.page_size ?? pageSize,
          total: response.total ?? items.length,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'MCN达人信息获取失败';
        setTalentError(errorMessage);
        setTalentList([]);
        setTalentPagination((prev) => ({ ...prev, page, pageSize, total: 0 }));
        message.error(errorMessage);
      } finally {
        setTalentLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    // 根据当前活动Tab和用户角色决定加载什么数据
    if (activeTab === 'mcnDepartment') {
      void loadDepartmentList(1, DEFAULT_PAGE_SIZE);
    } else if (activeTab === 'mcnEmployee' && isDepartmentRole) {
      // 部门账号在MCN员工管理Tab下直接加载MCN员工列表
      void loadMcnEmployeeList(1, DEFAULT_PAGE_SIZE);
    } else if (activeTab === 'mcnTalent' && isDepartmentRole) {
      // 部门账号在MCN达人管理Tab下直接加载MCN达人列表
      void loadMcnTalentList(1, DEFAULT_PAGE_SIZE);
    }
  }, [activeTab, isDepartmentRole, loadDepartmentList, loadMcnEmployeeList, loadMcnTalentList]);

  const handleViewDetail = useCallback(
    (record: DepartmentRecord) => {
      if (activeTab !== 'mcnDepartment') {
        return;
      }
      setSelectedDepartment(record);
      setDepartmentDetailTab('employee');
      setEmployeePagination((prev) => ({ ...prev, page: 1 }));
      setTalentPagination((prev) => ({ ...prev, page: 1 }));
      setEmployeeError(null);
      setTalentError(null);
    },
    [activeTab],
  );

  const selectedDepartmentId = selectedDepartment?.departmentId;

  useEffect(() => {
    if (!selectedDepartmentId) {
      setEmployeeList([]);
      setEmployeePagination({ page: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
      setEmployeeError(null);
      setEmployeeLoading(false);
      setTalentList([]);
      setTalentPagination({ page: 1, pageSize: DEFAULT_PAGE_SIZE, total: 0 });
      setTalentError(null);
      setTalentLoading(false);
      return;
    }

    if (departmentDetailTab === 'talent') {
      void loadTalentList(selectedDepartmentId, 1, DEFAULT_PAGE_SIZE);
    } else {
      void loadEmployeeList(selectedDepartmentId, 1, DEFAULT_PAGE_SIZE);
    }
  }, [departmentDetailTab, loadEmployeeList, loadTalentList, selectedDepartmentId]);

  const handleDepartmentPageChange = useCallback(
    (page: number, pageSize?: number) => {
      const nextPageSize = pageSize ?? departmentPagination.pageSize;
      setDepartmentPagination((prev) => ({ ...prev, page, pageSize: nextPageSize }));
      void loadDepartmentList(page, nextPageSize);
    },
    [departmentPagination.pageSize, loadDepartmentList],
  );

  const handleEmployeePageChange = useCallback(
    (page: number, pageSize?: number) => {
      const nextPageSize = pageSize ?? employeePagination.pageSize;
      setEmployeePagination((prev) => ({ ...prev, page, pageSize: nextPageSize }));
      
      // 根据Tab类型和用户角色决定使用哪个加载函数
      if (activeTab === 'mcnEmployee' && isDepartmentRole) {
        // 部门账号在MCN员工管理Tab下使用MCN员工列表接口
        void loadMcnEmployeeList(page, nextPageSize);
      } else if (selectedDepartmentId) {
        // 其他情况使用部门员工接口
        void loadEmployeeList(selectedDepartmentId, page, nextPageSize);
      }
    },
    [activeTab, isDepartmentRole, employeePagination.pageSize, loadEmployeeList, loadMcnEmployeeList, selectedDepartmentId],
  );

  const handleTalentPageChange = useCallback(
    (page: number, pageSize?: number) => {
      const nextPageSize = pageSize ?? talentPagination.pageSize;
      setTalentPagination((prev) => ({ ...prev, page, pageSize: nextPageSize }));
      
      // 根据Tab类型和用户角色决定使用哪个加载函数
      if (activeTab === 'mcnTalent' && isDepartmentRole) {
        // 部门账号在MCN达人管理Tab下使用MCN达人列表接口
        void loadMcnTalentList(page, nextPageSize);
      } else if (selectedDepartmentId) {
        // 其他情况使用部门达人接口
        void loadTalentList(selectedDepartmentId, page, nextPageSize);
      }
    },
    [activeTab, isDepartmentRole, loadTalentList, loadMcnTalentList, selectedDepartmentId, talentPagination.pageSize],
  );

  const handleEditDepartment = useCallback(
    (record: DepartmentRecord) => {
      form.resetFields();
      setEditContext('department');
      setEditTarget(record);
      setEditParentKey(record.departmentId);
      const moduleSelection = record.moduleIds.length > 0
        ? record.moduleIds
        : normalizePermissionsToModules(record.permissions);
      form.setFieldsValue({
        name: record.name,
        modules: [...moduleSelection],
      });
      setEditModalVisible(true);
    },
    [form, normalizePermissionsToModules],
  );

  const handleEditMember = useCallback(
    (context: 'employee' | 'talent', record: MemberRecord, parentKey?: string) => {
      form.resetFields();
      setEditContext(context);
      setEditTarget(record);
      setEditParentKey(parentKey || ''); // 对于MCN员工/达人管理，parentKey可能为空
      const modulesSelection = record.modules.length > 0 ? record.modules : resolvedModuleIds;
      form.setFieldsValue({
        name: record.name,
        phone: record.phone,
        modules: [...modulesSelection],
      });
      setEditModalVisible(true);
    },
    [form, resolvedModuleIds],
  );

  const handleCloseEditModal = useCallback(() => {
    setEditModalVisible(false);
    setEditContext(null);
    setEditTarget(null);
    setEditParentKey(null);
    form.resetFields();
  }, [form]);

  const handleSubmitEdit = useCallback(async () => {
    try {
      const values = await form.validateFields();
      const operatorId = user?.id ?? overview?.user?.user_id ?? '';
      if (!operatorId) {
        message.error('缺少操作者信息');
        return;
      }
      setEditSubmitting(true);
      if (!editTarget || !editContext) {
        message.error('未找到需要更新的记录');
        return;
      }

      const modules = (values.modules as string[]) ?? [];
      const newName = values.name as string;
      const newPhone = values.phone as string | undefined;

      if (editContext === 'department') {
        const department = editTarget as DepartmentRecord;
        await updateDepartmentInfo(department.departmentId, {
          operator_id: operatorId,
          department_name: newName,
          permission_modules: modules,
        });
        await loadDepartmentList(departmentPagination.page, departmentPagination.pageSize);
        setSelectedDepartment((prev) =>
          prev && prev.departmentId === department.departmentId
            ? {
                ...prev,
                name: newName,
                permissions: mapModulesToLabels(modules),
                moduleIds: modules,
              }
            : prev,
        );
        message.success('部门信息更新成功');
      } else if (editContext === 'employee') {
        if (!newPhone) {
          message.error('请输入手机号');
          return;
        }
        const member = editTarget as MemberRecord;
        
        if (activeTab === 'mcnEmployee' && isDepartmentRole) {
          // 部门账号在MCN员工管理Tab下使用MCN员工更新接口
          await updateMcnEmployeeInfo(member.id, {
            operator_id: operatorId,
            name: newName,
            phone: newPhone,
            module_ids: modules,
          } satisfies UpdateMemberPayload);
          await loadMcnEmployeeList(employeePagination.page, employeePagination.pageSize);
        } else if (editParentKey) {
          // 其他情况使用部门员工更新接口
          await updateEmployeeInfo(editParentKey, member.id, {
            operator_id: operatorId,
            name: newName,
            phone: newPhone,
            module_ids: modules,
          } satisfies UpdateMemberPayload);
          await loadEmployeeList(editParentKey, employeePagination.page, employeePagination.pageSize);
        }
        message.success('员工信息更新成功');
      } else if (editContext === 'talent') {
        if (!newPhone) {
          message.error('请输入手机号');
          return;
        }
        const member = editTarget as MemberRecord;
        
        if (activeTab === 'mcnTalent' && isDepartmentRole) {
          // 部门账号在MCN达人管理Tab下使用MCN达人更新接口
          await updateMcnTalentInfo(member.id, {
            operator_id: operatorId,
            name: newName,
            phone: newPhone,
            module_ids: modules,
          } satisfies UpdateMemberPayload);
          await loadMcnTalentList(talentPagination.page, talentPagination.pageSize);
        } else if (editParentKey) {
          // 其他情况使用部门达人更新接口
          await updateTalentInfo(editParentKey, member.id, {
            operator_id: operatorId,
            name: newName,
            phone: newPhone,
            module_ids: modules,
          } satisfies UpdateMemberPayload);
          await loadTalentList(editParentKey, talentPagination.page, talentPagination.pageSize);
        }
        message.success('达人信息更新成功');
      } else {
        message.error('未识别的编辑类型');
        return;
      }

      handleCloseEditModal();
    } catch (err: any) {
      if (err?.errorFields) {
        return;
      }
      const messageText = err instanceof Error ? err.message : '更新失败，请稍后重试';
      message.error(messageText);
    } finally {
      setEditSubmitting(false);
    }
  }, [
    activeTab,
    departmentPagination.page,
    departmentPagination.pageSize,
    editContext,
    editParentKey,
    editTarget,
    employeePagination.page,
    employeePagination.pageSize,
    form,
    handleCloseEditModal,
    isDepartmentRole,
    loadDepartmentList,
    loadEmployeeList,
    loadMcnEmployeeList,
    loadMcnTalentList,
    loadTalentList,
    mapModulesToLabels,
    overview?.user?.user_id,
    talentPagination.page,
    talentPagination.pageSize,
    user?.id,
  ]);

  const detailButtonLabel = useMemo(() => {
    if (activeTab === 'mcnDepartment') {
      return '部门详情';
    }
    if (activeTab === 'brandDepartment') {
      return '部门详情';
    }
    return '人员详情';
  }, [activeTab]);

  const columns = useMemo<ColumnsType<DepartmentRecord>>(
    () => [
      {
        title: '部门名称',
        dataIndex: 'name',
        key: 'name',
        width: 240,
      },
      {
        title: '模块权限',
        dataIndex: 'permissions',
        key: 'permissions',
        render: (permissionList: string[]) => (
          <Space size={[8, 8]} wrap>
            {permissionList.map((permission) => (
              <Tag key={permission} color="blue">
                {permission}
              </Tag>
            ))}
          </Space>
        ),
      },
      {
        title: '负责人电话',
        dataIndex: 'leaderPhone',
        key: 'leaderPhone',
        width: 160,
        render: (value?: string) => value ?? '—',
      },
      {
        title: '操作',
        key: 'actions',
        width: 200,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => handleEditDepartment(record)}>
              编辑信息
            </Button>
            <Button
              type="link"
              disabled={activeTab !== 'mcnDepartment'}
              onClick={() => handleViewDetail(record)}
            >
              {detailButtonLabel}
            </Button>
          </Space>
        ),
      },
    ],
    [activeTab, detailButtonLabel, handleEditDepartment, handleViewDetail],
  );

  const employeeColumns = useMemo<ColumnsType<MemberRecord>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 120,
      },
      {
        title: '员工姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_, record) => {
          const parentKey = selectedDepartment?.departmentId;
          // 对于MCN员工管理Tab下的部门账号，不需要parentKey
          const canEdit = (activeTab === 'mcnEmployee' && isDepartmentRole) || parentKey;
          
          return (
            <Space>
              <Button
                type="link"
                disabled={!canEdit}
                onClick={() => handleEditMember('employee', record, parentKey)}
              >
                编辑信息
              </Button>
              <Button type="link" danger>
                删除
              </Button>
            </Space>
          );
        },
      },
    ],
    [activeTab, isDepartmentRole, handleEditMember, selectedDepartment?.departmentId],
  );

  const talentColumns = useMemo<ColumnsType<MemberRecord>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 120,
      },
      {
        title: 'MCN 达人姓名',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },
      {
        title: '操作',
        key: 'actions',
        width: 160,
        render: (_, record) => {
          const parentKey = selectedDepartment?.departmentId;
          // 对于MCN达人管理Tab下的部门账号，不需要parentKey
          const canEdit = (activeTab === 'mcnTalent' && isDepartmentRole) || parentKey;
          
          return (
            <Space>
              <Button
                type="link"
                disabled={!canEdit}
                onClick={() => handleEditMember('talent', record, parentKey)}
              >
                编辑信息
              </Button>
              <Button type="link" danger>
                删除
              </Button>
            </Space>
          );
        },
      },
    ],
    [activeTab, isDepartmentRole, handleEditMember, selectedDepartment?.departmentId],
  );

  const uploadProps = useMemo(() => ({
    name: 'file',
    accept: '.xls,.xlsx',
    maxCount: 1,
    showUploadList: false,
    customRequest: (options: any) => {
      const { onSuccess, onError, file } = options;
      window.setTimeout(() => {
        if (file) {
          message.success('文件上传成功，正在解析');
          onSuccess?.({}, file);
        } else {
          message.error('文件上传失败');
          onError?.(new Error('Upload failed'));
        }
      }, 600);
    },
  }), []);

  const handleOpenImport = useCallback((context: 'employee' | 'talent') => {
    setImportContext(context);
    setImportModalVisible(true);
  }, []);

  const handleCloseImport = useCallback(() => {
    setImportModalVisible(false);
  }, []);

  const renderDepartmentTable = () => (
    <>
      {departmentError && (
        <Alert
          type="error"
          showIcon
          message="部门信息加载失败"
          description={departmentError}
          action={(
            <Button
              size="small"
              type="link"
              onClick={() => handleDepartmentPageChange(departmentPagination.page, departmentPagination.pageSize)}
            >
              重新加载
            </Button>
          )}
          style={{ marginBottom: 16 }}
        />
      )}
      <Table
        className="permission-table"
        columns={columns}
        dataSource={departmentList}
        rowKey="key"
        loading={departmentLoading}
        pagination={{
          current: departmentPagination.page,
          pageSize: departmentPagination.pageSize,
          total: departmentPagination.total,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: handleDepartmentPageChange,
          onShowSizeChange: handleDepartmentPageChange,
        }}
        locale={{
          emptyText: departmentError ? '暂时无法加载部门数据' : '暂无部门数据，请先添加部门',
        }}
      />
    </>
  );

  const renderMemberTable = (context: 'employee' | 'talent') => {
    const isEmployee = context === 'employee';
    const loadingState = isEmployee ? employeeLoading : talentLoading;
    const errorState = isEmployee ? employeeError : talentError;
    const dataSource = isEmployee ? employeeList : talentList;
    const paginationState = isEmployee ? employeePagination : talentPagination;
    const columnsDef = isEmployee ? employeeColumns : talentColumns;
    const handlePageChange = isEmployee ? handleEmployeePageChange : handleTalentPageChange;
    const emptyDescription = isEmployee ? '暂无员工数据' : '暂无达人数据';

    // 对于MCN员工管理和MCN达人管理Tab下的部门账号，不需要选择部门
    const needDepartmentSelection = !((activeTab === 'mcnEmployee' || activeTab === 'mcnTalent') && isDepartmentRole);
    
    if (needDepartmentSelection && !selectedDepartmentId) {
      return <Empty description="请先选择一个部门" />;
    }

    const handleRetry = () => {
      if (isEmployee) {
        if (activeTab === 'mcnEmployee' && isDepartmentRole) {
          void loadMcnEmployeeList(paginationState.page, paginationState.pageSize);
        } else if (selectedDepartmentId) {
          void loadEmployeeList(selectedDepartmentId, paginationState.page, paginationState.pageSize);
        }
      } else {
        if (activeTab === 'mcnTalent' && isDepartmentRole) {
          void loadMcnTalentList(paginationState.page, paginationState.pageSize);
        } else if (selectedDepartmentId) {
          void loadTalentList(selectedDepartmentId, paginationState.page, paginationState.pageSize);
        }
      }
    };

    return (
      <>
        {errorState && (
          <Alert
            type="error"
            showIcon
            message={isEmployee ? '员工信息加载失败' : '达人信息加载失败'}
            description={errorState}
            action={(
              <Button size="small" type="link" onClick={handleRetry}>
                重新加载
              </Button>
            )}
            style={{ marginBottom: 16 }}
          />
        )}
        <Table
          className="permission-table"
          columns={columnsDef}
          dataSource={dataSource}
          rowKey="key"
          loading={loadingState}
          pagination={{
            current: paginationState.page,
            pageSize: paginationState.pageSize,
            total: paginationState.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条`,
            onChange: handlePageChange,
            onShowSizeChange: handlePageChange,
          }}
          locale={{
            emptyText: emptyDescription,
          }}
        />
      </>
    );
  };

  const tableTitle = useMemo(() => {
    switch (activeTab) {
      case 'mcnTalent':
        return '达人团队列表';
      case 'mcnDepartment':
        return 'MCN 部门列表';
      case 'brandDepartment':
        return '品牌部门列表';
      case 'brandEmployee':
        return '品牌员工权限列表';
      case 'mcnEmployee':
      default:
        return '部门权限列表';
    }
  }, [activeTab]);

  return (
    <div
      className={`permission-layout${sidebarOptions.length > 0 ? ' permission-layout--with-sidebar' : ''}`}
      style={{ backgroundColor: designTokens.colors.background }}
    >
      {sidebarOptions.length > 0 && (
        <aside className="permission-tab-sidebar">
          <div className="permission-tab-list">
            {sidebarOptions.map((option) => {
              const active = activeTab === option.key;
              return (
                <button
                  key={option.key}
                  type="button"
                  className={`permission-tab-item${active ? ' permission-tab-item--active' : ''}`}
                  onClick={() => setActiveTab(option.key)}
                >
                  <span className="permission-tab-label">{option.label}</span>
                </button>
              );
            })}
          </div>
        </aside>
      )}

      <main className="permission-main">
        <Card
          className="permission-main-card"
          bordered={false}
          style={{ boxShadow: designTokens.shadows.lg }}
          bodyStyle={{ display: 'flex', flexDirection: 'column', gap: 24 }}
        >
          {overviewLoading ? (
            <div className="permission-loading">
              <Spin size="large" tip="正在加载主体信息" />
            </div>
          ) : overviewError ? (
            <Result
              status="error"
              title="主体信息加载失败"
              subTitle={overviewError}
              extra={(
                <Button type="primary" icon={<ReloadOutlined />} onClick={() => void loadOverview()}>
                  重试
                </Button>
              )}
            />
          ) : overview ? (
            <>
              <Descriptions column={3} bordered size="small">
                <Descriptions.Item label="角色名称">{resolvedRoleName}</Descriptions.Item>
                <Descriptions.Item label="角色标识">{resolvedRoleId}</Descriptions.Item>
                <Descriptions.Item label="联系电话">
                  {overview?.user?.user_phone ?? overview?.contact_phone ?? user?.phone ?? '未提供手机号'}
                </Descriptions.Item>
                <Descriptions.Item label="可用模块" span={3}>
                  {moduleOptions.length > 0
                    ? moduleOptions.map((option) => option.label).join('、')
                    : '暂无模块信息'}
                </Descriptions.Item>
              </Descriptions>

              {activeTab === 'mcnDepartment' && selectedDepartment ? (
                <div className="permission-department-detail">
                  <div className="permission-department-detail__header">
                    <Button
                      icon={<ArrowLeftOutlined />}
                      onClick={() => {
                        setSelectedDepartment(null);
                        setDepartmentDetailTab('employee');
                      }}
                    >
                      返回部门列表
                    </Button>
                    <div className="permission-department-detail__meta">
                      <Title level={5} style={{ margin: 0 }}>
                        {selectedDepartment.name}
                      </Title>
                    </div>
                  </div>

                  <div className="permission-department-detail__tabs">
                    <Button
                      type={departmentDetailTab === 'employee' ? 'primary' : 'default'}
                      onClick={() => setDepartmentDetailTab('employee')}
                    >
                      员工权限管理
                    </Button>
                    <Button
                      type={departmentDetailTab === 'talent' ? 'primary' : 'default'}
                      onClick={() => setDepartmentDetailTab('talent')}
                    >
                      MCN 达人管理
                    </Button>
                  </div>

                  {departmentDetailTab === 'employee' ? (
                    <div className="permission-department-detail__section">
                      <div className="permission-table-toolbar permission-table-toolbar--inner">
                        <Title level={5} style={{ margin: 0 }}>
                          员工权限管理
                        </Title>
                        <Space>
                          <Button type="primary" icon={<PlusOutlined />}>
                            新增员工
                          </Button>
                          <Button icon={<UploadOutlined />} onClick={() => handleOpenImport('employee')}>
                            导入员工信息
                          </Button>
                        </Space>
                      </div>
                      {renderMemberTable('employee')}
                    </div>
                  ) : (
                    <div className="permission-department-detail__section">
                      <div className="permission-table-toolbar permission-table-toolbar--inner">
                        <Title level={5} style={{ margin: 0 }}>
                          MCN 达人管理
                        </Title>
                        <Space>
                          <Button type="primary" icon={<PlusOutlined />}>
                            新增达人
                          </Button>
                          <Button icon={<UploadOutlined />} onClick={() => handleOpenImport('talent')}>
                            导入达人信息
                          </Button>
                        </Space>
                      </div>
                      {renderMemberTable('talent')}
                    </div>
                  )}
                </div>
              ) : activeTab === 'mcnEmployee' && isDepartmentRole ? (
                // 部门账号的MCN员工管理
                <div className="permission-department-detail__section">
                  <div className="permission-table-toolbar">
                    <Title level={5} style={{ margin: 0 }}>
                      MCN 员工管理
                    </Title>
                    <Space>
                      <Button type="primary" icon={<PlusOutlined />}>
                        新增员工
                      </Button>
                      <Button icon={<UploadOutlined />} onClick={() => handleOpenImport('employee')}>
                        导入员工信息
                      </Button>
                    </Space>
                  </div>
                  {renderMemberTable('employee')}
                </div>
              ) : activeTab === 'mcnTalent' && isDepartmentRole ? (
                // 部门账号的MCN达人管理
                <div className="permission-department-detail__section">
                  <div className="permission-table-toolbar">
                    <Title level={5} style={{ margin: 0 }}>
                      MCN 达人管理
                    </Title>
                    <Space>
                      <Button type="primary" icon={<PlusOutlined />}>
                        新增达人
                      </Button>
                      <Button icon={<UploadOutlined />} onClick={() => handleOpenImport('talent')}>
                        导入达人信息
                      </Button>
                    </Space>
                  </div>
                  {renderMemberTable('talent')}
                </div>
              ) : (
                <>
                  <div className="permission-table-toolbar">
                    <Title level={5} style={{ margin: 0 }}>
                      {tableTitle}
                    </Title>
                    <Button type="primary" icon={<PlusOutlined />}>
                      添加部门
                    </Button>
                  </div>

                  {renderDepartmentTable()}
                </>
              )}
            </>
          ) : (
            <Result
              status="warning"
              title="权限数据缺失"
              subTitle="暂未获取到权限概览，请刷新重试或联系管理员。"
              extra={(
                <Button icon={<ReloadOutlined />} onClick={() => void loadOverview()}>
                  重新获取
                </Button>
              )}
            />
          )}
        </Card>
        <Modal
          open={editModalVisible}
          title={editModalTitle}
          okText="确定"
          cancelText="取消"
          onCancel={handleCloseEditModal}
          onOk={handleSubmitEdit}
          confirmLoading={editSubmitting}
          destroyOnClose
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label={editContext === 'department' ? '部门名称' : '姓名'}
              name="name"
              rules={[
                { required: true, message: editContext === 'department' ? '请输入部门名称' : '请输入姓名' },
                { max: 30, message: '名称长度需在 30 个字符以内' },
              ]}
            >
              <Input placeholder={editContext === 'department' ? '请输入部门名称' : '请输入姓名'} />
            </Form.Item>

            {editContext !== 'department' && (
              <Form.Item
                label="手机号"
                name="phone"
                rules={[
                  { required: true, message: '请输入手机号' },
                  { pattern: /^1\d{10}$/, message: '请输入有效的 11 位手机号' },
                ]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
            )}

            <Form.Item
              label="模块权限"
              name="modules"
              rules={[{ required: true, message: '请选择至少一个模块权限' }]}
            >
              <Checkbox.Group
                options={moduleOptions}
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
              />
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          open={importModalVisible}
          title={importContext === 'employee' ? '导入员工信息' : '导入达人信息'}
          onCancel={handleCloseImport}
          footer={null}
        >
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Typography.Paragraph>
              支持上传 Excel（.xls / .xlsx）文件导入{importContext === 'employee' ? '员工' : '达人'}信息。
            </Typography.Paragraph>
            <Upload {...uploadProps}>
              <Button type="primary" icon={<UploadOutlined />}>
                选择文件上传
              </Button>
            </Upload>
            <Typography.Paragraph type="secondary">
              文件模板可包含 ID、姓名、手机号等字段，上传后系统将进行格式校验。
            </Typography.Paragraph>
          </Space>
        </Modal>
      </main>
    </div>
  );
};

export default PermissionManagementLanding;
