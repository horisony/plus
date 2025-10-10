import React, { useState, useEffect } from 'react';
import { designTokens } from '../constants/designTokens';
import LeftSidebar from '../components/LeftSidebar';
import { fetchSnippets, addSnippet, updateSnippet, deleteSnippet } from '../services/snippetsService';

const InspirationSnippetsPage = ({ onBack }) => {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [newContent, setNewContent] = useState('');
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [hoverId, setHoverId] = useState(null);

  // 加载灵感碎片列表
  const loadSnippets = async () => {
    setLoading(true);
    try {
      const data = await fetchSnippets();
      setSnippets(data);
    } catch (error) {
      console.error('加载灵感碎片失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSnippets();
  }, []);

  // ESC 退出删除模式
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') {
        setIsDeleteMode(false);
        setHoverId(null);
      }
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, []);

  // 添加灵感碎片
  const handleAddSnippet = async () => {
    if (!newContent.trim()) return;
    
    try {
      await addSnippet(newContent.trim());
      setNewContent('');
      setShowAddModal(false);
      loadSnippets();
    } catch (error) {
      console.error('添加灵感碎片失败:', error);
    }
  };

  // 编辑灵感碎片
  const handleEditSnippet = async () => {
    if (!newContent.trim() || !editingSnippet) return;
    
    try {
      await updateSnippet(editingSnippet.id, newContent.trim());
      setNewContent('');
      setEditingSnippet(null);
      loadSnippets();
    } catch (error) {
      console.error('编辑灵感碎片失败:', error);
    }
  };

  // 删除灵感碎片
  const handleDeleteSnippet = async () => {
    if (!showDeleteModal) return;
    
    try {
      await deleteSnippet(showDeleteModal.id);
      setShowDeleteModal(null);
      loadSnippets();
    } catch (error) {
      console.error('删除灵感碎片失败:', error);
    }
  };

  // 打开编辑模态框
  const openEditModal = (snippet) => {
    setEditingSnippet(snippet);
    setNewContent(snippet.content);
    setShowAddModal(true);
  };

  // 关闭模态框
  const closeModal = () => {
    setShowAddModal(false);
    setEditingSnippet(null);
    setNewContent('');
  };

  return (
    <div style={styles.page}>
      {/* 左侧侧边栏 */}
      <LeftSidebar />

      {/* 右侧主区域 */}
      <div style={styles.container}>
        {/* 顶部栏 */}
        <div style={styles.header}>
          <button style={styles.backButton} onClick={onBack}>
            <span style={styles.backIcon}>◀</span>
            <span style={styles.backText}>返回</span>
          </button>
          <h1 style={styles.title}>灵感碎片</h1>
          <div style={styles.headerActions}>
            <button 
              style={{ ...styles.iconButton, ...(isDeleteMode ? styles.iconButtonActive : {}) }}
              title={isDeleteMode ? '退出删除' : '删除'}
              onClick={() => {
                if (isDeleteMode) {
                  setIsDeleteMode(false);
                  setHoverId(null);
                } else {
                  setIsDeleteMode(true);
                }
              }}
            >
              🗑
            </button>
            <button 
              style={styles.addButton}
              onClick={() => setShowAddModal(true)}
            >
              + 添加碎片
            </button>
          </div>
        </div>

        {/* 列表 */}
        <div 
          style={styles.content}
          onClick={(e) => {
            // 点击空白退出删除模式
            if (isDeleteMode && e.target === e.currentTarget) {
              setIsDeleteMode(false);
              setHoverId(null);
            }
          }}
        >
          {loading ? (
            <div style={styles.loading}>加载中...</div>
          ) : snippets.length === 0 ? (
            <div style={styles.emptyState}>
              暂无灵感碎片，点击"添加碎片"开始创建
            </div>
          ) : (
            <div style={styles.snippetsList}>
              {snippets.map((snippet) => (
                <div
                  key={snippet.id}
                  style={{
                    ...styles.snippetCard,
                    ...(hoverId === snippet.id ? styles.snippetCardHover : {}),
                  }}
                  onDoubleClick={() => openEditModal(snippet)}
                  onMouseEnter={() => setHoverId(snippet.id)}
                  onMouseLeave={() => setHoverId(null)}
                  onClick={() => {
                    if (isDeleteMode) setShowDeleteModal(snippet);
                  }}
                >
                  <div style={styles.snippetContent}>{snippet.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 添加/编辑模态框 */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {editingSnippet ? '编辑灵感碎片' : '添加灵感碎片'}
              </h2>
              <button style={styles.closeButton} onClick={closeModal}>
                ×
              </button>
            </div>
            <div style={styles.modalContent}>
              <textarea
                style={styles.textarea}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="请输入灵感内容..."
                rows={8}
              />
            </div>
            <div style={styles.modalActions}>
              <button 
                style={styles.confirmButton}
                onClick={editingSnippet ? handleEditSnippet : handleAddSnippet}
                disabled={!newContent.trim()}
              >
                确认
              </button>
              <button style={styles.cancelButton} onClick={closeModal}>
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框（紧凑版） */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.deleteBox}>
            <div style={styles.deleteHeader}>
              <h3 style={styles.deleteTitle}>确定删除灵感吗？</h3>
              <button 
                style={styles.closeButton} 
                onClick={() => setShowDeleteModal(null)}
              >
                ×
              </button>
            </div>
            <div style={styles.deleteBody}>
              <p style={styles.deleteText}>
                删除后将无法恢复，确定要删除这个灵感碎片吗？
              </p>
            </div>
            <div style={styles.deleteActions}>
              <button 
                style={styles.deletePrimary}
                onClick={handleDeleteSnippet}
              >
                确认删除
              </button>
              <button 
                style={styles.deleteCancel} 
                onClick={() => setShowDeleteModal(null)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    height: 'calc(100vh - 0px)',
    backgroundColor: designTokens.colors.background,
  },

  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: `${designTokens.spacing['2xl']} ${designTokens.spacing['3xl']}`,
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
    backgroundColor: designTokens.colors.white,
  },
  
  backButton: {
    background: 'none',
    border: 'none',
    color: designTokens.colors.gray[800],
    fontSize: designTokens.typography.fontSize.base,
    cursor: 'pointer',
    marginRight: designTokens.spacing.lg,
    padding: `${designTokens.spacing.xs} ${designTokens.spacing.sm}`,
    display: 'flex',
    alignItems: 'center',
    gap: designTokens.spacing.xs,
  },
  backIcon: { fontSize: '12px' },
  backText: { fontWeight: designTokens.typography.fontWeight.medium },
  
  title: {
    flex: 1,
    fontSize: designTokens.typography.fontSize['2xl'],
    fontWeight: designTokens.typography.fontWeight.bold,
    color: designTokens.colors.gray[900],
    margin: 0,
  },
  
  headerActions: { display: 'flex', gap: designTokens.spacing.md, alignItems: 'center' },

  addButton: {
    backgroundColor: designTokens.colors.primary,
    color: designTokens.colors.white,
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },

  iconButton: {
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[700],
    border: `1px solid ${designTokens.colors.gray[300]}`,
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.md}`,
    cursor: 'pointer',
  },
  iconButtonActive: {
    backgroundColor: designTokens.colors.red[50],
    color: designTokens.colors.red[600],
    borderColor: designTokens.colors.red[300],
  },
  
  content: {
    flex: 1,
    padding: designTokens.spacing['3xl'],
    overflowY: 'auto',
  },
  
  loading: {
    textAlign: 'center',
    color: designTokens.colors.gray[600],
    fontSize: designTokens.typography.fontSize.lg,
    padding: designTokens.spacing['4xl'],
  },
  
  emptyState: {
    textAlign: 'center',
    color: designTokens.colors.gray[500],
    fontSize: designTokens.typography.fontSize.lg,
    padding: designTokens.spacing['4xl'],
  },
  
  snippetsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: designTokens.spacing.lg,
    maxWidth: 960,
    margin: '0 auto',
  },
  
  snippetCard: {
    backgroundColor: designTokens.colors.white,
    borderRadius: 16,
    padding: `${designTokens.spacing.lg} ${designTokens.spacing['2xl']}`,
    border: `1px solid ${designTokens.colors.gray[200]}`,
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
  },
  snippetCardHover: {
    boxShadow: '0 6px 16px rgba(0,0,0,0.10)',
    transform: 'translateY(-2px)',
  },
  snippetCardDeleteMode: {
    borderColor: designTokens.colors.red[300],
  },
  
  snippetContent: {
    fontSize: designTokens.typography.fontSize.base,
    lineHeight: '1.6',
    color: designTokens.colors.gray[900],
    marginBottom: designTokens.spacing.md,
    cursor: 'pointer',
    minHeight: '60px',
  },
  
  snippetActions: { display: 'none' },
  
  editButton: { display: 'none' },
  deleteButton: { display: 'none' },
  
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  
  modal: {
    backgroundColor: designTokens.colors.white,
    borderRadius: designTokens.borderRadius.lg,
    boxShadow: designTokens.shadows.xl,
    width: '90%',
    maxWidth: '600px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
  },

  // 紧凑版删除对话框样式
  deleteBox: {
    width: 440,
    minHeight: 220,
    backgroundColor: designTokens.colors.white,
    borderRadius: 12,
    boxShadow: '0 24px 60px rgba(0,0,0,0.22)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  deleteHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
  },
  deleteTitle: {
    margin: 0,
    fontSize: designTokens.typography.fontSize.lg,
    color: designTokens.colors.gray[900],
  },
  deleteBody: {
    padding: `${designTokens.spacing.lg} ${designTokens.spacing.lg}`,
    color: designTokens.colors.gray[700],
    lineHeight: 1.6,
  },
  deleteActions: {
    display: 'flex',
    gap: designTokens.spacing.md,
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    justifyContent: 'flex-end',
  },
  deletePrimary: {
    backgroundColor: designTokens.colors.primary,
    color: designTokens.colors.white,
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.sm,
    cursor: 'pointer',
  },
  deleteCancel: {
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[700],
    border: `1px solid ${designTokens.colors.gray[300]}`,
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.sm} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.sm,
    cursor: 'pointer',
  },
  
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: designTokens.spacing.lg,
    borderBottom: `1px solid ${designTokens.colors.gray[200]}`,
  },
  
  modalTitle: {
    fontSize: designTokens.typography.fontSize.lg,
    fontWeight: designTokens.typography.fontWeight.semibold,
    color: designTokens.colors.gray[900],
    margin: 0,
  },
  
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: designTokens.colors.gray[500],
    cursor: 'pointer',
    padding: designTokens.spacing.xs,
  },
  
  modalContent: {
    padding: designTokens.spacing.lg,
    flex: 1,
  },
  
  textarea: {
    width: '100%',
    minHeight: '200px',
    padding: designTokens.spacing.md,
    border: 'none',
    backgroundColor: designTokens.colors.gray[50],
    borderRadius: 12,
    fontSize: designTokens.typography.fontSize.base,
    fontFamily: designTokens.typography.fontFamily,
    resize: 'vertical',
    outline: 'none',
    boxSizing: 'border-box',
  },
  
  deleteText: {
    fontSize: designTokens.typography.fontSize.base,
    color: designTokens.colors.gray[700],
    margin: 0,
    textAlign: 'center',
  },
  
  modalActions: {
    display: 'flex',
    gap: designTokens.spacing.md,
    padding: designTokens.spacing.lg,
    borderTop: `1px solid ${designTokens.colors.gray[200]}`,
  },
  
  confirmButton: {
    backgroundColor: designTokens.colors.primary,
    color: designTokens.colors.white,
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    flex: 1,
  },
  
  deleteConfirmButton: {
    backgroundColor: designTokens.colors.red[600],
    color: designTokens.colors.white,
    border: 'none',
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    flex: 1,
  },
  
  cancelButton: {
    backgroundColor: designTokens.colors.white,
    color: designTokens.colors.gray[700],
    border: `1px solid ${designTokens.colors.gray[300]}`,
    borderRadius: designTokens.borderRadius.md,
    padding: `${designTokens.spacing.md} ${designTokens.spacing.lg}`,
    fontSize: designTokens.typography.fontSize.sm,
    fontWeight: designTokens.typography.fontWeight.medium,
    cursor: 'pointer',
    flex: 1,
  },
};

export default InspirationSnippetsPage;
