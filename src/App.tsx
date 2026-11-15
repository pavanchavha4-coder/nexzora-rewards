import { useMemo, useState } from 'react';
import { Home, PlayCircle, Wallet, Gift, User, ArrowUpRight, ShieldCheck, Clock3, Sparkles, Settings, Plus, Video, IndianRupee, Eye, Users, X } from 'lucide-react';

type Tab = 'home' | 'watch' | 'wallet' | 'refer' | 'profile' | 'admin';
type Campaign = { id: number; title: string; category: string; duration: string; reward: number; videoUrl: string; budget: number; views: number; status: 'Draft' | 'Active' | 'Paused' };

const initialCampaigns: Campaign[] = [
  { id: 1, title: 'New Game Launch', category: 'Mobile Game', duration: '30 sec', reward: 10, videoUrl: '', budget: 500, views: 0, status: 'Draft' },
  { id: 2, title: 'Shopping App Preview', category: 'Shopping', duration: '45 sec', reward: 10, videoUrl: '', budget: 500, views: 0, status: 'Draft' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [coins, setCoins] = useState(0);
  const [watched, setWatched] = useState<number[]>([]);
  const [notice, setNotice] = useState('Welcome to NEXZORA REWARDS');
  const [upi, setUpi] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sponsored App');
  const [duration, setDuration] = useState('30 sec');
  const [videoUrl, setVideoUrl] = useState('');
  const [budget, setBudget] = useState('500');

  const activeCampaigns = campaigns.filter(c => c.status === 'Active');
  const totalBudget = useMemo(() => campaigns.reduce((sum, c) => sum + c.budget, 0), [campaigns]);

  const watchCampaign = (id: number) => {
    const c = campaigns.find(item => item.id === id);
    if (!c || c.status !== 'Active') {
      setNotice('This sponsor campaign is not active yet.');
      return;
    }
    if (watched.includes(id)) {
      setNotice('You have already completed this demo campaign.');
      return;
    }
    setWatched(prev => [...prev, id]);
    setCoins(prev => prev + c.reward);
    setCampaigns(prev => prev.map(item => item.id === id ? { ...item, views: item.views + 1 } : item));
    setNotice(`Demo reward: ${c.reward} coins added. No cash value.`);
  };

  const addCampaign = () => {
    const parsedBudget = Number(budget);
    if (!title.trim() || !videoUrl.trim() || !Number.isFinite(parsedBudget) || parsedBudget <= 0) {
      setNotice('Campaign name, video URL and a valid budget are required.');
      return;
    }
    try {
      const u = new URL(videoUrl);
      if (!['https:', 'http:'].includes(u.protocol)) throw new Error();
    } catch {
      setNotice('Please enter a valid video URL starting with https://');
      return;
    }
    const next: Campaign = {
      id: Date.now(), title: title.trim(), category, duration, reward: 10,
      videoUrl: videoUrl.trim(), budget: parsedBudget, views: 0, status: 'Draft'
    };
    setCampaigns(prev => [next, ...prev]);
    setTitle(''); setVideoUrl(''); setBudget('500'); setShowAdd(false);
    setNotice('Campaign saved as Draft. It is not published or paying rewards.');
  };

  const toggleCampaign = (id: number) => {
    setCampaigns(prev => prev.map(c => c.id === id
      ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' }
      : c));
    setNotice('Campaign status changed in this on-device demo only.');
  };

  const requestWithdrawal = () => {
    setNotice(upi.includes('@') ? 'Demo only: UPI request is not sent. Real payouts are not enabled.' : 'Please enter a valid UPI ID for the demo form.');
  };

  const nav = [
    { id: 'home' as Tab, label: 'Home', icon: Home },
    { id: 'watch' as Tab, label: 'Watch', icon: PlayCircle },
    { id: 'wallet' as Tab, label: 'Wallet', icon: Wallet },
    { id: 'refer' as Tab, label: 'Refer', icon: Gift },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'admin' as Tab, label: 'Admin', icon: Settings },
  ];

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-mark">N</div>
      <div className="brand-copy"><strong>NEXZORA <span>REWARDS</span></strong><small>WATCH 鈥� EARN 鈥� REDEEM</small></div>
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
          <div className="coin-icon">鉁�</div>
          <div className="balance-foot"><span>Completed campaigns: {watched.length}</span><span>Demo only</span></div>
        </div>
        <div className="section-heading"><div><span className="muted">START EARNING</span><h3>Featured campaigns</h3></div><button className="text-btn" onClick={() => setTab('watch')}>View all</button></div>
        <CampaignList campaigns={activeCampaigns} watched={watched} onWatch={watchCampaign}/>
      </section>}

      {tab === 'watch' && <section>
        <div className="page-heading"><span className="muted">DISCOVER</span><h1>Watch & Earn</h1><p>Only approved and funded sponsor campaigns should be published here.</p></div>
        <CampaignList campaigns={activeCampaigns} watched={watched} onWatch={watchCampaign}/>
        {activeCampaigns.length === 0 && <div className="panel"><p>No active sponsor campaigns yet. Check back later.</p></div>}
      </section>}

      {tab === 'wallet' && <section>
        <div className="page-heading"><span className="muted">YOUR REWARDS</span><h1>My Wallet</h1><p>Track demo coins and payout readiness.</p></div>
        <div className="balance-card wallet-balance"><span className="muted">AVAILABLE DEMO COINS</span><h2>{coins} <small>COINS</small></h2><p>Illustrative only: proposed conversion is 100 coins = 鈧�10. No cash value or payout is active.</p></div>
        <div className="panel">
          <h3>UPI withdrawal</h3>
          <p>Withdrawal is disabled in this prototype. Real payouts require eligible sponsor funding, verified ad completion, backend fraud checks and a compliant payment provider.</p>
          <label>UPI ID</label><input value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@bank" />
          <button className="primary-btn full" onClick={requestWithdrawal}>Preview withdrawal request</button>
        </div>
      </section>}

      {tab === 'refer' && <section>
        <div className="page-heading"><span className="muted">GROW TOGETHER</span><h1>Refer & Earn</h1><p>Referral rewards are planned for a later release.</p></div>
        <div className="panel centered"><div className="big-icon"><Gift size={30}/></div><h2>Invite your circle</h2><p>Referral rewards are not active in this demo. Anti-fraud controls must be ready first.</p></div>
      </section>}

      {tab === 'profile' && <section>
        <div className="page-heading"><span className="muted">ACCOUNT</span><h1>Your Profile</h1><p>Account settings and app information.</p></div>
        <div className="panel profile-row"><div className="avatar">G</div><div><h3>Guest User</h3><p>Demo account 鈥� Sign-in not connected</p></div></div>
        <div className="panel info-list"><div><ShieldCheck/><span>Secure account login</span><b>Planned</b></div><div><Clock3/><span>Reward history</span><b>Demo</b></div><div><Wallet/><span>UPI payouts</span><b>Not active</b></div></div>
        <p className="fine-print">Prototype only. Campaigns, coins, user accounts and payments are stored locally or simulated; no real sponsor ads or payouts are active.</p>
      </section>}

      {tab === 'admin' && <section>
        <div className="page-heading"><span className="muted">NEXZORA CONTROL CENTER</span><h1>Admin Panel</h1><p>Manage sponsor campaign drafts and review demo metrics.</p></div>
        <div className="admin-warning"><ShieldCheck size={17}/><span>Preview only 鈥� this panel has no secure login or server connection. Do not use it to manage real money or publish real cash rewards.</span></div>
        <div className="admin-stats">
          <div className="admin-stat"><span><Video size={15}/> Campaigns</span><strong>{campaigns.length}</strong></div>
          <div className="admin-stat"><span><Eye size={15}/> Demo views</span><strong>{campaigns.reduce((s,c)=>s+c.views,0)}</strong></div>
          <div className="admin-stat"><span><Users size={15}/> Active</span><strong>{activeCampaigns.length}</strong></div>
          <div className="admin-stat"><span><IndianRupee size={15}/> Planned budget</span><strong>鈧箋totalBudget}</strong></div>
        </div>
        <div className="section-heading"><div><span className="muted">SPONSOR MANAGEMENT</span><h3>Campaigns</h3></div><button className="primary-btn" onClick={() => setShowAdd(v => !v)}><Plus size={15}/> Add</button></div>
        {showAdd && <div className="panel admin-form">
          <div className="form-title"><h3>New sponsor campaign</h3><button className="icon-btn" onClick={() => setShowAdd(false)}><X size={18}/></button></div>
          <label>Campaign / Sponsor name</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. ABC App launch"/>
          <label>Category</label><select value={category} onChange={e=>setCategory(e.target.value)}><option>Sponsored App</option><option>Mobile Game</option><option>Shopping</option><option>Education</option><option>Other</option></select>
          <label>Video length</label><select value={duration} onChange={e=>setDuration(e.target.value)}><option>15 sec</option><option>30 sec</option><option>45 sec</option><option>60 sec</option></select>
          <label>Video URL</label><input value={videoUrl} onChange={e=>setVideoUrl(e.target.value)} placeholder="https://..."/>
          <label>Sponsor budget (鈧�) 鈥� planning only</label><input type="number" min="1" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="500"/>
          <div className="admin-note">New campaigns are saved as Draft in this app preview. The link is not checked for ad-network approval or video completion.</div>
          <button className="primary-btn full" onClick={addCampaign}>Save campaign draft</button>
        </div>}
        <div className="campaign-admin-list">{campaigns.map(c=><div className="campaign-admin-card" key={c.id}>
          <div className="campaign-admin-head"><div><strong>{c.title}</strong><small>{c.category} 鈥� {c.duration} 鈥� +{c.reward} demo coins</small></div><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></div>
          <div className="campaign-admin-meta"><span>Budget plan: 鈧箋c.budget}</span><span>Views: {c.views}</span></div>
          <div className="campaign-admin-actions"><button className="secondary-btn" onClick={()=>setNotice(c.videoUrl || 'No video URL added.')}>View URL</button><button className="secondary-btn" onClick={()=>toggleCampaign(c.id)}>{c.status === 'Active' ? 'Pause' : 'Set Active'}</button></div>
        </div>)}</div>
        <div className="panel"><h3>Withdrawal requests</h3><p>No real withdrawal requests are connected. A secure backend and verified payment workflow must be built before enabling UPI payouts.</p><span className="status-pill draft">Not connected</span></div>
      </section>}
    </main>
    {notice && <div className="toast" onClick={() => setNotice('')}>{notice}<span>脳</span></div>}
    <nav className="bottom-nav">{nav.map(item => { const Icon = item.icon; return <button key={item.id} className={tab === item.id ? 'active' : ''} onClick={() => setTab(item.id)}><Icon size={19}/><span>{item.label}</span></button>; })}</nav>
    <footer>POWERED BY <b>NEXZORA TECHNOLOGIES</b> 路 DEMO BUILD</footer>
  </div>;
}

function CampaignList({ campaigns, watched, onWatch }: { campaigns: Campaign[]; watched: number[]; onWatch: (id: number) => void }) {
  return <div className="campaign-list">{campaigns.map(c => <article className="campaign-card" key={c.id}>
    <div className="campaign-art violet"><PlayCircle size={34}/><span>SPONSORED CAMPAIGN</span></div>
    <div className="campaign-content"><div className="campaign-meta"><span>{c.category}</span><span>{c.duration}</span></div><h3>{c.title}</h3><p>Campaign preview. Only verified, funded and policy-approved ads can earn real rewards.</p><div className="campaign-bottom"><strong>+{c.reward} <small>DEMO COINS</small></strong><button className={watched.includes(c.id) ? 'done-btn' : 'watch-btn'} disabled={watched.includes(c.id)} onClick={() => onWatch(c.id)}>{watched.includes(c.id) ? 'Completed' : 'Preview'}</button></div></div>
  </article>)}</div>;
    }
