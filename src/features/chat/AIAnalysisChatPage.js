import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AIAnalysisChatPage.css';

// 导入SVG图标
import { 
  FileIcon, 
  ImageIcon, 
  VideoIcon, 
  PlusIcon, 
  SendIcon 
} from '../../assets/icons';

const AIAnalysisChatPage = () => {
  const navigate = useNavigate();
  
  // 设置当前激活的tab为AI商业助理
  useEffect(() => {
    const event = new CustomEvent('setActiveTab', { detail: 'commercial' });
    window.dispatchEvent(event);
  }, []);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '对话内容对话内容对话内容对话内容对话内容',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'user',
      content: '写个短视频文案,用来带货AR眼镜',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [showPopover, setShowPopover] = useState(false);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        content: inputMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // 检查是否是特定消息，如果是则自动回复
      if (inputMessage.includes('总结下萌叔近7周的数据表现并给出归因分析')) {
        // 先添加loading消息
        const loadingMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: '正在分析数据...',
          timestamp: new Date(),
          isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);

        // 1秒后替换为实际回复
        setTimeout(() => {
          const aiResponse = {
            id: messages.length + 2,
            type: 'ai',
            content: `总结看点

粉丝增长在前几周略有加速，但随后减速。

播放量与点赞数也呈现"先上升后回落"的趋势。

分享、评论互动大致同趋势。

总体来看，前 3 周表现较好，之后遇到瓶颈或下滑。

二、归因分析

造成上述趋势的可能原因（结合他的内容、人设、平台机制等）如下：

1. 账号定位与内容广度

剑桥萌叔以"剑桥博士＋创业者＋科技背景"作为人设，有一定稀缺性。但从公开评论看到，他的内容 "主题较为杂"，从 AI、量子物理到女性创业访谈都有涉猎。 
Digitaling
+1

优势：背景强、人设亮眼、话题跨度大，容易吸引好奇型粉丝。

劣势：主题太杂可能导致"标签不清晰"，平台算法和用户也可能难以形成稳定预期。

归因：前 3 周可能靠新鲜感／强背景吸引流量，但后期如果没持续在某一细分定位深耕，增长容易放缓。

2. 热点／话题选择

例如一条他的视频提到"推客会是下一个电商风口？"并收获 ~279万赞。 
Douyin

那说明：当抓住一个热点话题＋有背景支撑＋平台推荐时，爆款有可能。

但如果之后话题回归日常、缺乏强热点＋传播力度不够，就会掉回常规表现。

归因：第 3 周或前期可能有一两条热点视频助推；之后如果无类似爆点，表现就下降。

3. 内容形式与算法契合度

短视频平台（如 抖音）更偏向：前 3 秒抓人、封面＋标题强吸引、完播率高、互动高。

如果内容偏讲座式／深度解说＋缺少节奏感，可能导致"刷不下去"、完播率低。

剑桥萌叔背景为"学霸""博士""科技创业"，内容可能偏知识型、讲解型，若形式没有做适配，可能互动率低。

归因：随着视频库增多，若形式没有优化，算法推荐可能减少，造成下滑。

4. 受众群体特点与传播链条

其受众据说"女粉丝尤其是年长者居多"。 
Digitaling

年长粉丝可能互动／分享频率低于年轻人群；也可能受平台推荐覆盖影响较小。

若内容调整倾向更大众化或年轻受众少接触，也会影响增长。

归因：受众限制／传播链条相对弱，是增长瓶颈之一。

5. 资源／发布时间／频率

若前期发布频率高、资源集中／制作精良，后续若制作节奏放缓或资源投入下降，会导致表现差异。

另外，发布时间、传播时间窗口也影响。

无公开数据，但这是常见因素。

归因：可能后期制作或发布节奏未维持，影响平台活跃度。

6. 竞争环境与算法变化

短视频生态竞争激烈，新账号／新话题容易被推荐，时间长了算法偏向成熟账号或"模型化"内容。

若没有持续创新或"钩子"，容易被推荐机制冷却。

归因：中后期增长放缓可能受到算法冷却与内容饱和影响。

三、建议方向（以逆转或稳定增长为目标）

基于上述分析，给出几点建议以助于提升或恢复增长：

明确细分定位：选择 1-2 个主题（如"科技创业×职场""留学生经验×创业"）保持持续输出，形成标签。

提升内容形式吸引力：缩短开篇，强化钩子，增加故事性／对比性，提升完播率。

制造爆点话题：结合当前热点（如AI、留学政策、创业失败经验等）＋他自身背景，产生可传播内容。

扩大受众传播链条：除了自身粉丝，还可与其他博主跨界、做合作、上热门话题、使用热门音乐＋话题标签。

优化发布时间与频率：规律发布，如每周固定日／时，且保证可持续制作。

数据监测与复盘：每周记录播放、点赞、完播率、互动率、分享数、粉丝净增，找出表现最好的视频特征再复刻。

增强互动型内容：如回答粉丝问题、举办线上互动、问答、直播预告等，提升粘性。`,
            timestamp: new Date(),
            isLoading: false
          };
          setMessages(prev => prev.map(msg => 
            msg.id === loadingMessage.id ? aiResponse : msg
          ));
        }, 1000); // 延迟1秒回复，模拟AI思考时间
      } else if (inputMessage.includes('分析下小米商单本周表现情况')) {
        // 先添加loading消息
        const loadingMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: '正在生成分析报告...',
          timestamp: new Date(),
          isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);

        // 1秒后替换为实际回复
        setTimeout(() => {
          const aiResponse = {
            id: messages.length + 2,
            type: 'ai',
            content: '已为您生成小米商单本周分析报告\n\nhttps://jd4omasmev.feishu.cn/wiki/MbKWwCMCaikuBikdnoPcYtDUn2d',
            timestamp: new Date(),
            isLoading: false
          };
          setMessages(prev => prev.map(msg => 
            msg.id === loadingMessage.id ? aiResponse : msg
          ));
        }, 1000); // 延迟1秒回复，模拟AI思考时间
      } else if (inputMessage.includes('分析下剑桥萌叔单条商单表现情况')) {
        // 先添加loading消息
        const loadingMessage = {
          id: messages.length + 2,
          type: 'ai',
          content: '正在生成分析报告...',
          timestamp: new Date(),
          isLoading: true
        };
        setMessages(prev => [...prev, loadingMessage]);

        // 1秒后替换为实际回复
        setTimeout(() => {
          const aiResponse = {
            id: messages.length + 2,
            type: 'ai',
            content: '已为您生成剑桥萌叔单条商单分析报告\n\nhttps://jd4omasmev.feishu.cn/wiki/ISTmwn0osiI8kYkAalbcgv6Cnif?from=from_copylink',
            timestamp: new Date(),
            isLoading: false
          };
          setMessages(prev => prev.map(msg => 
            msg.id === loadingMessage.id ? aiResponse : msg
          ));
        }, 1000); // 延迟1秒回复，模拟AI思考时间
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // 渲染消息内容，支持链接
  const renderMessageContent = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.mainContent}>
        {/* 左侧边栏 */}
        <div style={styles.sidebar}>
          <div style={styles.backButton} onClick={() => navigate(-1)}>
            <span style={styles.backIcon}>‹</span>
            返回
          </div>
          
          <button style={styles.newChatButton}>
            <span style={styles.plusIcon}>+</span>
            新建对话
          </button>
          
          <div style={styles.navItems}>
            <div style={styles.navSectionTitle}>历史对话</div>
            <div style={styles.navItem} onClick={() => console.log('萌叔数据分析')}>萌叔数据分析</div>
            <div style={styles.navItem} onClick={() => console.log('小Lin说数据分析')}>小Lin说数据分析</div>
          </div>
        </div>

        <div style={styles.sidebarSeparator}></div>

        {/* 聊天区域 */}
        <div style={styles.chatArea}>
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  ...styles.messageBubble,
                  ...(message.type === 'user' ? styles.userMessage : styles.aiMessage)
                }}
              >
                {message.isLoading ? (
                  <div style={styles.loadingContainer}>
                    <span>{message.content}</span>
                    <div style={styles.loadingDots}>
                      <span style={styles.loadingDot}>.</span>
                      <span style={styles.loadingDot}>.</span>
                      <span style={styles.loadingDot}>.</span>
                    </div>
                  </div>
                ) : (
                  renderMessageContent(message.content)
                )}
              </div>
            ))}
          </div>
          
          <div style={styles.inputContainer}>
            <div style={styles.inputArea}>
              <div style={styles.inputIcons}>
                <div style={styles.inputIcon} onClick={() => setShowPopover(!showPopover)}>
                  <PlusIcon />
                </div>
                {showPopover && (
                  <div style={styles.popover}>
                    <div style={styles.popoverItem}>
                      <FileIcon />
                      <span>文件</span>
                    </div>
                    <div style={styles.popoverItem}>
                      <ImageIcon />
                      <span>图片</span>
                    </div>
                    <div style={styles.popoverItem}>
                      <VideoIcon />
                      <span>视频</span>
                    </div>
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="发消息"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.messageInput}
              />
              <button style={styles.sendButton} onClick={handleSendMessage}>
                <SendIcon style={styles.sendIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 80px)', // 减去外部导航栏高度
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  mainContent: {
    display: 'flex',
    flex: 1,
    height: '100%',
  },
  sidebar: {
    width: '210px',
    backgroundColor: '#ffffff',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#374151',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
  },
  backIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  newChatButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    backgroundColor: '#E7EEFD',
    color: '#1356F0',
    border: 'none',
    borderRadius: '20px',
    padding: '12px 16px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  plusIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  navItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  navSectionTitle: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
    marginBottom: '4px',
    textAlign: 'left',
  },
  navItem: {
    fontSize: '14px',
    color: '#374151',
    cursor: 'pointer',
    padding: '6px 0',
    textAlign: 'left',
    fontWeight: '500',
    transition: 'color 0.2s ease',
  },
  sidebarSeparator: {
    width: '1px',
    backgroundColor: '#e5e7eb',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f5f7fa',
    maxWidth: '880px',
    margin: '0 auto',
  },
  messagesContainer: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    overflowY: 'auto',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    fontSize: '14px',
    lineHeight: '1.6',
    wordWrap: 'break-word',
    whiteSpace: 'pre-line',
    textAlign: 'left',
  },
  aiMessage: {
    backgroundColor: '#ffffff',
    color: '#374151',
    alignSelf: 'flex-start',
    borderRadius: '6px 12px 12px 12px',
  },
  userMessage: {
    backgroundColor: '#E7EEFD',
    color: '#333',
    alignSelf: 'flex-end',
    borderRadius: '12px 6px 12px 12px',
  },
  inputContainer: {
    padding: '20px',
  },
  inputArea: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '8px 12px',
    gap: '8px',
  },
  inputIcons: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    position: 'relative',
  },
  inputIcon: {
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#6b7280',
  },
  messageInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    padding: '8px 0',
    color: '#374151',
  },
  sendButton: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  sendIcon: {
    fontSize: '14px',
    color: '#ffffff',
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  loadingDots: {
    display: 'flex',
    gap: '2px',
  },
  loadingDot: {
    fontSize: '16px',
    color: '#6b7280',
    animation: 'loadingDots 1.4s infinite ease-in-out both',
  },
  sendIcon: {
    width: '16px',
    height: '16px',
    color: '#ffffff',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  popover: {
    position: 'absolute',
    bottom: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '8px 0',
    zIndex: 1000,
    minWidth: '120px',
  },
  popoverItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#374151',
  },
};

export default AIAnalysisChatPage;
