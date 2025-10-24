import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

interface CampaignFormData {
  campaignName: string;
  product: string;
  businessGoal: string;
  productDescription: string;
  priceType: 'cpm' | 'cpc' | 'fixed' | '';
  budget: string;
  influencerRequirement: string;
  influencerDescription: string;
  cooperator: string;
  expectedOrderDate: string;
  expectedPublishDate: string;
  isPublic: boolean;
}

interface LocationState {
  projectData?: {
    name?: string;
    target?: string;
    [key: string]: unknown;
  };
}

const initialFormState: CampaignFormData = {
  campaignName: '小米 SU7 发布会',
  product: '小米 SU7',
  businessGoal: '种类小米汽车生态的产品，于用户是建立起需求感与体验情景',
  productDescription: '',
  priceType: 'cpm',
  budget: 'Y8,000-12,000',
  influencerRequirement: '',
  influencerDescription: '',
  cooperator: '小Lin诺，春大人',
  expectedOrderDate: '2025-10-10',
  expectedPublishDate: '2025-10-12',
  isPublic: true,
};

const MarketingCampaign: React.FC = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId?: string }>();
  const location = useLocation();
  const locationState = (location.state as LocationState | null) ?? null;

  const [formData, setFormData] = useState<CampaignFormData>(initialFormState);

  useEffect(() => {
    if (locationState?.projectData) {
      const { projectData } = locationState;
      setFormData((previous) => ({
        ...previous,
        campaignName:
          typeof projectData.name === 'string' && projectData.name.trim().length > 0
            ? projectData.name
            : previous.campaignName,
        businessGoal:
          typeof projectData.target === 'string' && projectData.target.trim().length > 0
            ? projectData.target
            : previous.businessGoal,
      }));
    }
  }, [locationState]);

  const handleInputChange = <K extends keyof CampaignFormData>(field: K, value: CampaignFormData[K]) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('提交营销需求:', formData);

    if (projectId) {
      navigate(`/commercial/project/${projectId}`);
      return;
    }

    const newProjectId = Date.now().toString();
    window.alert('营销需求已提交！');
    navigate(`/commercial/project/${newProjectId}`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button type="button" style={styles.backButton} onClick={handleCancel}>
          ← 返回
        </button>
        <h1 style={styles.title}>营销需求文档</h1>
      </div>

      <div style={styles.uploadSection}>
        <div style={styles.uploadArea}>
          <div style={styles.uploadIcon}>📂</div>
          <h3 style={styles.uploadTitle}>上传营销需求文档/品牌介绍</h3>
          <p style={styles.uploadDescription}>支持 word, pdf, txt 格式，上传后营销需求框架可能会有变动</p>
          <button type="button" style={styles.uploadButton}>
            上传营销文档
          </button>
          <p style={styles.uploadHint}>或拖拽文件到此框内完成上传</p>
        </div>
      </div>

      <div style={styles.formSection}>
        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="campaignName">
              活动名称
            </label>
            <input
              id="campaignName"
              type="text"
              placeholder="小米 SU7 发布会"
              value={formData.campaignName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('campaignName', event.target.value)
              }
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="product">
              活动产品
            </label>
            <input
              id="product"
              type="text"
              placeholder="小米 SU7"
              value={formData.product}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('product', event.target.value)
              }
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="businessGoal">
              需求目标
            </label>
            <textarea
              id="businessGoal"
              value={formData.businessGoal}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange('businessGoal', event.target.value)
              }
              placeholder="种类小米汽车生态的产品，于用户是建立起需求感与体验情景"
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="productDescription">
              产品核心点
            </label>
            <div style={styles.productSection}>
              <div style={styles.productCategories}>
                <span style={styles.categoryTag}>汽车JS车机</span>
                <span style={styles.categoryTag}>手机无线连接</span>
                <span style={styles.categoryTag}>小米全生态链(车+手机)</span>
                <span style={styles.categoryTag}>问域驾驶体验</span>
              </div>
              <textarea
                id="productDescription"
                value={formData.productDescription}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('productDescription', event.target.value)
                }
                style={styles.textarea}
              />
            </div>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <span style={styles.label}>内容要求</span>
            <div style={styles.requirements}>
              <div style={styles.requirementItem}>• 形式：短视频/图文，30-60秒，真实自然传达</div>
              <div style={styles.requirementItem}>• 风格：科技感，年轻化</div>
              <div style={styles.requirementItem}>• 禁止：禁止点赞，低质内容，敷衍式操作</div>
            </div>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="priceType">
              报价形式
            </label>
            <select
              id="priceType"
              value={formData.priceType}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange('priceType', event.target.value as CampaignFormData['priceType'])
              }
              style={styles.select}
            >
              <option value="cpm">CPM</option>
              <option value="cpc">CPC</option>
              <option value="fixed">固定价格</option>
            </select>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="budget">
              活动预算
            </label>
            <input
              id="budget"
              type="text"
              placeholder="Y8,000-12,000"
              value={formData.budget}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('budget', event.target.value)
              }
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="influencerRequirement">
              博主需求
            </label>
            <select
              id="influencerRequirement"
              value={formData.influencerRequirement}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                handleInputChange('influencerRequirement', event.target.value)
              }
              style={styles.select}
            >
              <option value="">请选择</option>
              <option value="粉丝数量">粉丝数量</option>
              <option value="互动率">互动率</option>
              <option value="垂直领域">垂直领域</option>
              <option value="地域要求">地域要求</option>
            </select>
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="influencerDescription">
              博主需求描述
            </label>
            <textarea
              id="influencerDescription"
              value={formData.influencerDescription}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                handleInputChange('influencerDescription', event.target.value)
              }
              placeholder="请描述对博主的具体要求"
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="cooperator">
              参考博主
            </label>
            <input
              id="cooperator"
              type="text"
              placeholder="小Lin诺，春大人"
              value={formData.cooperator}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('cooperator', event.target.value)
              }
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="expectedOrderDate">
              预计下单时间
            </label>
            <input
              id="expectedOrderDate"
              type="date"
              value={formData.expectedOrderDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('expectedOrderDate', event.target.value)
              }
              style={styles.dateInput}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="expectedPublishDate">
              预计发布时间
            </label>
            <input
              id="expectedPublishDate"
              type="date"
              value={formData.expectedPublishDate}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange('expectedPublishDate', event.target.value)
              }
              style={styles.dateInput}
            />
          </div>
        </div>

        <div style={styles.formRow}>
          <div style={styles.formGroup}>
            <span style={styles.label}>是否公开招募达人</span>
            <div style={styles.radioGroup}>
              <label style={styles.radioItem} htmlFor="isPublicYes">
                <input
                  id="isPublicYes"
                  type="radio"
                  checked={formData.isPublic}
                  onChange={() => handleInputChange('isPublic', true)}
                />
                <span style={styles.radioLabel}>是</span>
              </label>
              <label style={styles.radioItem} htmlFor="isPublicNo">
                <input
                  id="isPublicNo"
                  type="radio"
                  checked={!formData.isPublic}
                  onChange={() => handleInputChange('isPublic', false)}
                />
                <span style={styles.radioLabel}>否</span>
              </label>
            </div>
          </div>
        </div>

        <div style={styles.submitSection}>
          <button type="button" style={styles.cancelButton} onClick={handleCancel}>
            取消
          </button>
          <button type="button" style={styles.submitButton} onClick={handleSubmit}>
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 10px 10px 10px',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    gap: '10px',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: 0,
  },
  uploadSection: {
    marginBottom: '5px',
  },
  uploadArea: {
    backgroundColor: 'white',
    border: '2px dashed #ddd',
    borderRadius: '8px',
    padding: '20px',
    textAlign: 'center',
  },
  uploadIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  uploadTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1a1a1a',
    margin: '0 0 5px 0',
  },
  uploadDescription: {
    fontSize: '12px',
    color: '#666',
    margin: '0 0 10px 0',
  },
  uploadButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
    marginBottom: '5px',
  },
  uploadHint: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
  formSection: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '16px',
  },
  formRow: {
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    gap: '16px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#1a1a1a',
    marginBottom: 0,
    minWidth: '120px',
    paddingTop: '6px',
    textAlign: 'left',
  },
  select: {
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    backgroundColor: 'white',
    flex: 1,
  },
  input: {
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    flex: 1,
  },
  textarea: {
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    minHeight: '60px',
    resize: 'vertical',
    flex: 1,
  },
  productSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    flex: 1,
  },
  productCategories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '5px',
  },
  categoryTag: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    padding: '2px 6px',
    borderRadius: '3px',
    fontSize: '11px',
    fontWeight: 500,
  },
  requirements: {
    backgroundColor: '#f8f9fa',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #eee',
    flex: 1,
  },
  requirementItem: {
    fontSize: '12px',
    color: '#1a1a1a',
    marginBottom: '2px',
  },
  dateInput: {
    padding: '6px 8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    flex: 1,
    maxWidth: '200px',
  },
  radioGroup: {
    display: 'flex',
    gap: '10px',
    flex: 1,
  },
  radioItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
  },
  radioLabel: {
    fontSize: '12px',
    color: '#1a1a1a',
  },
  submitSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    marginTop: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #ddd',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 500,
  },
  submitButton: {
    backgroundColor: '#4285f4',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
  },
};

export default MarketingCampaign;