import React, { useState } from 'react';
import { Button, Layout } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../auth/context/AuthContext';
import PLUSLogo from '../../PLUSLOGO.png';
import LiAvatar from '../../assets/icons/Li.png';
import LiuAvatar from '../../assets/icons/Liu.png';
import MengshuAvatar from '../../assets/icons/mengshu.png';
import './LandingPage.css';

const { Header, Content, Footer } = Layout;

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  bio: string[];
}

const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: '李明',
    avatar: LiAvatar,
    bio: [
      '前阿里巴巴技术专家',
      '10年互联网产品经验',
      '专注于AI与大数据领域',
      '斯坦福大学计算机硕士',
      '多个成功创业项目经验',
      '致力于用技术改变商业'
    ]
  },
  {
    id: '2',
    name: '刘娜',
    avatar: LiuAvatar,
    bio: [
      '前百度商业化VP',
      '15年市场与销售经验',
      '擅长品牌战略与市场拓展',
      '复旦大学工商管理硕士',
      '帮助多家企业实现增长',
      '行业资深商业顾问'
    ]
  },
  {
    id: '3',
    name: '孟姝',
    avatar: MengshuAvatar,
    bio: [
      '前腾讯产品总监',
      '8年产品设计与运营经验',
      '深耕内容生态与社交领域',
      '北京大学MBA',
      '擅长用户增长与商业化',
      '多次获得行业创新奖'
    ]
  },
  {
    id: '4',
    name: '张伟',
    avatar: LiAvatar,
    bio: [
      '前字节跳动算法负责人',
      '12年AI算法研发经验',
      '发表多篇顶级学术论文',
      '清华大学博士',
      '专注推荐系统与NLP',
      '推动AI商业化落地'
    ]
  }
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthContext();
  const [activeNav, setActiveNav] = useState<'home' | 'team'>('home');

  const handleLogin = () => {
    if (isAuthenticated) {
      navigate('/data');
    } else {
      navigate('/select-role');
    }
  };

  const scrollToSection = (section: 'home' | 'team') => {
    setActiveNav(section);
    const element = document.getElementById(section === 'home' ? 'hero-section' : 'team-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Layout className="landing-page">
      <Header className="landing-header">
        <div className="landing-header-content">
          <div className="landing-logo-section">
            <img src={PLUSLogo} alt="PLUSCO" className="landing-logo-img" />
            <span className="landing-logo-text">PLUSCO</span>
          </div>
          <nav className="landing-nav">
            <button
              className={`landing-nav-item ${activeNav === 'home' ? 'active' : ''}`}
              onClick={() => scrollToSection('home')}
            >
              首页
            </button>
            <button
              className={`landing-nav-item ${activeNav === 'team' ? 'active' : ''}`}
              onClick={() => scrollToSection('team')}
            >
              团队介绍
            </button>
          </nav>
        </div>
      </Header>

      <Content className="landing-content">
        {/* Hero Section */}
        <section id="hero-section" className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">PLUSCO</h1>
            <p className="hero-subtitle">Give you a plus cofounder</p>
            <Button 
              type="primary" 
              size="large" 
              className="hero-button"
              onClick={handleLogin}
            >
              {isAuthenticated ? '进入系统' : '登录'}
            </Button>
          </div>
        </section>

        {/* Team Section */}
        <section id="team-section" className="team-section">
          <h2 className="team-title">我们的团队</h2>
          <div className="team-grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="team-member-card">
                <div className="team-member-avatar">
                  <img src={member.avatar} alt={member.name} />
                </div>
                <h3 className="team-member-name">{member.name}</h3>
                <div className="team-member-bio">
                  {member.bio.map((line, index) => (
                    <p key={index} className="team-member-bio-line">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Content>

      <Footer className="landing-footer">
        <div className="landing-footer-content">
          <p>&copy; 2025 PLUSCO. All rights reserved.</p>
          <p>Give you a plus cofounder</p>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;

