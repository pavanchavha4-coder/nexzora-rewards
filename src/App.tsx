import { useState } from 'react';
import { Home, PlayCircle, Wallet, Gift, User, ArrowUpRight, ShieldCheck, Clock3, Sparkles } from 'lucide-react';

type Tab = 'home' | 'watch' | 'wallet' | 'refer' | 'profile';

const campaigns = [
  { id: 1, brand: 'New Game Launch', category: 'Mobile Game', duration: '30 sec', reward: 10, color: 'violet', description: 'Discover a new mobile game. Campaign preview only.' },
  { id: 2, brand: 'Shopping App Preview', category: 'Shopping', duration: '45 sec', reward: 15, color: 'orange', description: 'Explore a new shopping experience. Campaign preview only.' },
  { id: 3, brand: 'Learning App Showcase', category: 'Education', duration: '60 sec', reward: 20, color: 'blue', description: 'See how a learning app works. Campaign preview only.' }
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [coins, setCoins] = useState(0);
  const [watched, setWatched] = useState<number[]>([]);
  const [notice, setNotice] = useState('Welcome to NEXZORA REWARDS');
  const [upi, setUpi] = useState('');

  const watchCampaign = (id: number, reward: number) => {
    if (watched.includes(id)) {
      setNotice('You have already completed this demo campaign.');
      return;
    }
    setWatched([...watched, id]);
    setCoins(coins + reward);
    setNotice(`Demo reward: ${reward} coins added. No cash value.`);
  };

  const requestWithdrawal = () => {
    setNotice(upi.includes('@') ? 'Demo only: UPI request is not sent. Real payments will be enabled after sponsor funding and backend verification.' : 'Please enter a valid UPI ID for the demo form.');
  };

  const nav = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'watch' as Tab, label: 'Watch', icon: PlayCircle },
    { id: 'wallet' as Tab, label: 'Wallet', icon: Wallet },
    { id: 'refer' as Tab, label: 'Refer', icon: Gift },
    { id: 'profile' as Tab, label: 'Profile', icon: User }
  ];

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark">N</div>
      <div className="brand-copy"><strong>NEXZORA <span>REWARDS</span></strong><small>WATCH • EARN • REDEEM</small></div>
      <div className="status-dot" title="Demo mode" />
    </header>

    <main>
      {tab === 'home' && <section>
        <div className="hero">
          <div className="eyebrow"><Sparkles size={14}/> REWARDS PLATFORM</div>
          <h1>Turn your time<br/><em>into rewards.</em></h1>
          <p>Discover sponsored app and game campaigns in one place.</p>
          <button className="primary-btn" onClick={() => setTab('watch')}>Explore campaigns <ArrowUpRight size={17}/></button>
          <div className="hero-glow" />
        </div>
        <div className="balance-card">
          <div><span className="muted">YOUR DEMO BALANCE</span><h2>{coins} <small>COINS</small></h2></div>
          <div className="coin-icon">✦</div>
          <div className="balance-foot"><span>Completed campaigns: {watched.length}</span><span>Demo only</span></div>
        </div>
        <div className="section-heading"><div><span className="muted">START EARNING</span><h3>Featured campaigns</h3></div><button className="text-btn" onClick={() => setTab('watch')}>View all</button></div>
        <CampaignList watched={watched} onWatch={watchCampaign} limit={2}/>
      </section>}

      {tab === 'watch' && <section>
        <div className="page-heading"><span className="muted">DISCOVER</span><h1>Watch & Earn</h1><p>Complete eligible sponsored campaigns to collect demo coins.</p></div>
        <CampaignList watched={watched} onWatch={watchCampaign}/>
      </section>}

      {tab === 'wallet' && <section>
        <div className="page-heading"><span className="muted">YOUR REWARDS</span><h1>My Wallet</h1><p>Track your rewards and withdrawal details.</p></div>
        <div className="balance-card wallet-balance"><span className="muted">AVAILABLE DEMO COINS</span><h2>{coins} <small>COINS</small></h2><p>Coins shown here are test data and have no cash value.</p></div>
        <div className="panel">
          <h3>UPI withdrawal</h3>
          <p className="muted">Payment requests are disabled in this demo. Real withdrawals require funded sponsor campaigns, secure backend checks and payment integration.</p>
          <label>UPI ID</label><input value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@bank" />
          <button className="primary-btn full" onClick={requestWithdrawal}>Preview withdrawal request</button>
        </div>
      </section>}

      {tab === 'refer' && <section>
        <div className="page-heading"><span className="muted">GROW TOGETHER</span><h1>Refer & Earn</h1><p>Invite friends when the referral programme officially launches.</p></div>
        <div className="panel centered"><div className="big-icon"><Gift size={30}/></div><h2>Invite your circle</h2><p className="muted">Referral rewards are not active in this demo. We will enable them after anti-fraud controls are ready.</p><button className="secondary-btn" onClick={() => setNotice('Referral programme is coming soon.')}>Coming soon</button></div>
      </section>}

      {tab === 'profile' && <section>
        <div className="page-heading"><span className="muted">ACCOUNT</span><h1>Your Profile</h1><p>Account settings and app information.</p></div>
        <div className="panel profile-row"><div className="avatar">G</div><div><h3>Guest User</h3><p className="muted">Demo account • Sign-in not connected</p></div></div>
        <div className="panel info-list"><div><ShieldCheck/><span>Secure account login</span><b>Planned</b></div><div><Clock3/><span>Reward history</span><b>Demo</b></div><div><Wallet/><span>UPI payouts</span><b>Not active</b></div></div>
        <p className="fine-print">NEXZORA REWARDS is currently a prototype. No real advertising, cash rewards, referrals or payments are active.</p>
      </section>}
    </main>

    {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<span>×</span></div>}
    <nav className="bottom-nav">{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}><Icon size={20}/><span>{item.label}</span></button>; })}</nav>
    <footer>POWERED BY <b>NEXZORA TECHNOLOGIES</b> · DEMO BUILD</footer>
  </div>;
}

function CampaignList({ watched, onWatch, limit }: { watched: number[]; onWatch: (id: number, reward: number) => void; limit?: number }) {
  return <div className="campaign-list">{campaigns.slice(0, limit).map(c => <article className="campaign-card" key={c.id}>
    <div className={`campaign-art ${c.color}`}><PlayCircle size={34}/><span>SPONSORED PREVIEW</span></div>
    <div className="campaign-content"><div className="campaign-meta"><span>{c.category}</span><span>{c.duration}</span></div><h3>{c.brand}</h3><p>{c.description}</p><div className="campaign-bottom"><strong>+{c.reward} <small>COINS</small></strong><button className={watched.includes(c.id) ? 'done-btn' : 'watch-btn'} disabled={watched.includes(c.id)} onClick={() => onWatch(c.id, c.reward)}>{watched.includes(c.id) ? 'Completed' : 'Try demo'}</button></div></div>
  </article>)}</div>;
}
