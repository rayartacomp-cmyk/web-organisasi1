```react
import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  Users, Calendar, FileText, Wallet, QrCode, 
  Home, LogOut, Menu, X, Plus, Edit, Trash2, 
  Camera, CheckCircle, XCircle, Search, Download,
  Image as ImageIcon
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_USERS = [
  { id: 1, nim: '1011001', name: 'Budi (Admin)', role: 'admin', division: 'Inti', position: 'Ketua', password: 'admin', photo: 'https://placehold.co/150x150/4f46e5/ffffff?text=BD' },
  { id: 2, nim: '1011002', name: 'Siti (Anggota)', role: 'user', division: 'Humas', position: 'Staff', password: 'user', photo: 'https://placehold.co/150x150/ec4899/ffffff?text=ST' },
  { id: 3, nim: '1011003', name: 'Agus (Anggota)', role: 'user', division: 'Kaderisasi', position: 'Kadiv', password: 'user', photo: 'https://placehold.co/150x150/10b981/ffffff?text=AG' },
];

const INITIAL_SCHEDULES = [
  { id: 1, title: 'Rapat Kerja Bulanan', date: '2026-10-20', time: '15:00', location: 'Ruang Sidang 1', description: 'Membahas proker bulan depan.' },
  { id: 2, title: 'Makrab Anggota Baru', date: '2026-11-05', time: '08:00', location: 'Villa Puncak', description: 'Kumpul keakraban seluruh anggota.' },
];

const INITIAL_MATERIALS = [
  { id: 1, title: 'Notulensi Rapat 10 Okt', date: '2026-10-10', type: 'PDF', size: '2.4 MB' },
  { id: 2, title: 'Materi Kepemimpinan', date: '2026-09-25', type: 'PPTX', size: '5.1 MB' },
];

const INITIAL_FINANCE = {
  balance: 1500000,
  weeklyDues: 10000,
  transactions: [
    { id: 1, type: 'income', amount: 50000, date: '2026-10-15', desc: 'Uang Kas Minggu 1 (5 orang)' },
    { id: 2, type: 'expense', amount: 150000, date: '2026-10-16', desc: 'Beli konsumsi rapat' },
  ],
  duesStatus: {
    // user_id: [minggu1, minggu2, minggu3, minggu4]
    2: [true, true, false, false], 
    3: [true, false, false, false],
  }
};

const INITIAL_DOCS = [
  { id: 1, title: 'Pelantikan Pengurus', url: 'https://placehold.co/600x400/2563eb/ffffff?text=Pelantikan' },
  { id: 2, title: 'Bakti Sosial', url: 'https://placehold.co/600x400/16a34a/ffffff?text=Baksos' },
  { id: 3, title: 'Seminar Nasional', url: 'https://placehold.co/600x400/9333ea/ffffff?text=Seminar' },
];

// --- CONTEXT ---
const AppContext = createContext();

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [materials, setMaterials] = useState(INITIAL_MATERIALS);
  const [finance, setFinance] = useState(INITIAL_FINANCE);
  const [docs, setDocs] = useState(INITIAL_DOCS);
  
  // Absensi State (Simple mock)
  const [activeQR, setActiveQR] = useState(false);
  const [attendanceRecord, setAttendanceRecord] = useState({}); // { userId: boolean }

  const handleLogin = (nim, password) => {
    const user = users.find(u => u.nim === nim && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const handleLogout = () => setCurrentUser(null);

  return (
    <AppContext.Provider value={{
      currentUser, users, setUsers, schedules, setSchedules,
      materials, setMaterials, finance, setFinance, docs, setDocs,
      activeQR, setActiveQR, attendanceRecord, setAttendanceRecord,
      handleLogout
    }}>
      {currentUser ? <MainLayout /> : <LoginScreen onLogin={handleLogin} />}
    </AppContext.Provider>
  );
}

// --- LOGIN SCREEN ---
function LoginScreen({ onLogin }) {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!onLogin(nim, password)) {
      setError('NIM atau Password salah!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Portal Organisasi</h1>
          <p className="text-slate-500 mt-2 text-sm">Masuk untuk mengakses sistem informasi.</p>
        </div>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">NIM / ID Anggota</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={nim} onChange={e => setNim(e.target.value)} required
              placeholder="Contoh: 1011001 (Admin) / 1011002 (User)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="admin / user"
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

// --- MAIN LAYOUT ---
function MainLayout() {
  const { currentUser, handleLogout } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'absensi', label: 'Absensi', icon: QrCode },
    { id: 'kas', label: 'Keuangan & Kas', icon: Wallet },
    { id: 'anggota', label: 'Anggota Aktif', icon: Users },
    { id: 'jadwal', label: 'Jadwal Kegiatan', icon: Calendar },
    { id: 'materi', label: 'Materi & Notulensi', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Mobile Toggle */}
      <div className="md:hidden bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md z-20 relative">
        <div className="flex items-center space-x-2 font-bold text-lg">
          <Users className="w-6 h-6" /> <span>OrgSys</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white shadow-xl z-10 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center space-x-3 text-indigo-700">
          <Users className="w-8 h-8" />
          <span className="text-xl font-extrabold tracking-tight">OrgSys</span>
        </div>
        
        <div className="p-6 border-b border-slate-100 md:hidden mt-12 text-center">
          <img src={currentUser.photo} alt="Profile" className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-indigo-100" />
          <p className="font-semibold text-slate-800">{currentUser.name}</p>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full uppercase font-bold tracking-wider">{currentUser.role}</span>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-indigo-600'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="hidden md:flex items-center space-x-3 mb-4 p-2 bg-slate-50 rounded-xl">
             <img src={currentUser.photo} alt="Profile" className="w-10 h-10 rounded-full border border-slate-200" />
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-slate-800 truncate">{currentUser.name}</p>
               <p className="text-xs text-slate-500 capitalize">{currentUser.role} • {currentUser.division}</p>
             </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen overflow-y-auto p-4 md:p-8">
        {activeTab === 'dashboard' && <ViewDashboard />}
        {activeTab === 'absensi' && <ViewAbsensi />}
        {activeTab === 'kas' && <ViewKas />}
        {activeTab === 'anggota' && <ViewAnggota />}
        {activeTab === 'jadwal' && <ViewJadwal />}
        {activeTab === 'materi' && <ViewMateri />}
      </div>
    </div>
  );
}

// --- VIEWS ---

function ViewDashboard() {
  const { users, docs, finance } = useContext(AppContext);
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Utama</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Anggota</p>
            <h3 className="text-3xl font-bold text-slate-800">{users.length}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl"><Wallet className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Saldo Kas</p>
            <h3 className="text-2xl font-bold text-slate-800">Rp {finance.balance.toLocaleString('id-ID')}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl"><ImageIcon className="w-8 h-8"/></div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Dokumentasi</p>
            <h3 className="text-3xl font-bold text-slate-800">{docs.length}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-lg">Dokumentasi Terbaru</h3>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map(doc => (
            <div key={doc.id} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <img src={doc.url} alt={doc.title} className="w-full h-48 object-cover group-hover:scale-105 transition duration-300" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white font-medium">{doc.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ViewAbsensi() {
  const { currentUser, users, activeQR, setActiveQR, attendanceRecord, setAttendanceRecord } = useContext(AppContext);
  const [scanResult, setScanResult] = useState(null);

  const toggleAttendance = (userId) => {
    if (currentUser.role !== 'admin') return;
    setAttendanceRecord(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const handleScanQR = () => {
    if (activeQR) {
      setAttendanceRecord(prev => ({ ...prev, [currentUser.id]: true }));
      setScanResult('Berhasil presensi!');
      setTimeout(() => setScanResult(null), 3000);
    } else {
      setScanResult('QR Code belum diaktifkan admin!');
      setTimeout(() => setScanResult(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Sistem Absensi</h2>
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => setActiveQR(!activeQR)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 transition ${activeQR ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
          >
            <QrCode className="w-5 h-5" />
            <span>{activeQR ? 'Tutup Sesi Presensi (QR)' : 'Buka Sesi Presensi (QR)'}</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kolom QR */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-center">
            <h3 className="font-bold text-slate-800 mb-4">QR Absensi Hari Ini</h3>
            {activeQR ? (
              <div className="border-4 border-indigo-100 rounded-xl p-4 inline-block bg-white">
                {/* Mock QR Image */}
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=AbsensiOrganisasiAktif" alt="QR Absensi" className="mx-auto" />
              </div>
            ) : (
              <div className="w-48 h-48 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300 flex items-center justify-center mx-auto text-slate-400 flex-col">
                <QrCode className="w-10 h-10 mb-2" />
                <span className="text-sm">QR Tidak Aktif</span>
              </div>
            )}
            
            {currentUser.role === 'user' && (
              <div className="mt-6">
                <button 
                  onClick={handleScanQR}
                  className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition flex justify-center items-center space-x-2"
                >
                  <Camera className="w-5 h-5" /> <span>Scan QR Code</span>
                </button>
                {scanResult && <p className="mt-3 text-sm font-medium text-emerald-600">{scanResult}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Kolom List Anggota */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Daftar Kehadiran {currentUser.role === 'admin' && '(Manual)'}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-sm">
                  <th className="px-6 py-3 font-medium">Anggota</th>
                  <th className="px-6 py-3 font-medium">Divisi</th>
                  <th className="px-6 py-3 font-medium text-center">Status</th>
                  {currentUser.role === 'admin' && <th className="px-6 py-3 font-medium text-center">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="font-semibold text-slate-800">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.nim}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{u.division}</td>
                    <td className="px-6 py-4 text-center">
                      {attendanceRecord[u.id] ? (
                        <span className="inline-flex items-center bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-bold">
                          <CheckCircle className="w-3 h-3 mr-1" /> Hadir
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-slate-100 text-slate-500 px-2 py-1 rounded-full text-xs font-bold">
                          <XCircle className="w-3 h-3 mr-1" /> Belum
                        </span>
                      )}
                    </td>
                    {currentUser.role === 'admin' && (
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => toggleAttendance(u.id)}
                          className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg font-medium transition"
                        >
                          {attendanceRecord[u.id] ? 'Batalkan' : 'Presensikan'}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViewKas() {
  const { currentUser, finance, setFinance, users } = useContext(AppContext);
  const [showQRIS, setShowQRIS] = useState(false);
  const [formType, setFormType] = useState(null); // 'income' | 'expense' | null
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleAddTransaction = (e) => {
    e.preventDefault();
    const val = parseInt(amount);
    if (isNaN(val) || val <= 0) return;

    const newTx = {
      id: Date.now(),
      type: formType,
      amount: val,
      date: new Date().toISOString().split('T')[0],
      desc: desc
    };

    setFinance(prev => ({
      ...prev,
      balance: formType === 'income' ? prev.balance + val : prev.balance - val,
      transactions: [newTx, ...prev.transactions]
    }));
    setFormType(null);
    setAmount('');
    setDesc('');
  };

  const toggleDues = (userId, weekIndex) => {
    if (currentUser.role !== 'admin') return;
    setFinance(prev => {
      const userStatus = prev.duesStatus[userId] || [false, false, false, false];
      const newStatus = [...userStatus];
      newStatus[weekIndex] = !newStatus[weekIndex];
      return {
        ...prev,
        duesStatus: { ...prev.duesStatus, [userId]: newStatus }
      };
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800">Manajemen Kas</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         <div className="bg-indigo-600 p-6 rounded-2xl shadow-md text-white md:col-span-2 flex flex-col justify-between">
            <div>
              <p className="text-indigo-200 font-medium mb-1">Total Saldo Kas</p>
              <h3 className="text-4xl font-bold">Rp {finance.balance.toLocaleString('id-ID')}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-indigo-500 flex justify-between items-center">
              <p className="text-sm text-indigo-100">Tagihan per minggu: Rp {finance.weeklyDues.toLocaleString('id-ID')}</p>
              {currentUser.role === 'user' && (
                <button onClick={() => setShowQRIS(true)} className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-50 transition">
                  Bayar via QRIS
                </button>
              )}
            </div>
         </div>

         {currentUser.role === 'admin' && (
           <>
             <div 
                onClick={() => setFormType('income')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition group"
             >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-700">Tambah Pemasukan</span>
             </div>
             <div 
                onClick={() => setFormType('expense')}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 hover:bg-red-50 transition group"
             >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="font-semibold text-slate-700">Tambah Pengeluaran</span>
             </div>
           </>
         )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tabel Status Bayar Kas (Bulanan) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Status Pembayaran (Bulan Ini)</h3>
          </div>
          <div className="overflow-x-auto p-4">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="pb-3 font-medium">Anggota</th>
                  <th className="pb-3 font-medium text-center">W1</th>
                  <th className="pb-3 font-medium text-center">W2</th>
                  <th className="pb-3 font-medium text-center">W3</th>
                  <th className="pb-3 font-medium text-center">W4</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.filter(u => u.role !== 'admin').map(user => {
                  const status = finance.duesStatus[user.id] || [false, false, false, false];
                  return (
                    <tr key={user.id} className={currentUser.id === user.id ? 'bg-indigo-50' : ''}>
                      <td className="py-3 font-medium text-slate-700">{user.name} {currentUser.id === user.id && '(Anda)'}</td>
                      {[0, 1, 2, 3].map(weekIndex => (
                        <td key={weekIndex} className="py-3 text-center">
                           {currentUser.role === 'admin' ? (
                             <input 
                               type="checkbox" 
                               checked={status[weekIndex]} 
                               onChange={() => toggleDues(user.id, weekIndex)}
                               className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                             />
                           ) : (
                             status[weekIndex] ? <CheckCircle className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-slate-300 mx-auto" />
                           )}
                        </td>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Histori Transaksi */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Riwayat Transaksi</h3>
          </div>
          <div className="p-4 space-y-4 h-64 overflow-y-auto">
            {finance.transactions.map(tx => (
              <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition border border-transparent hover:border-slate-100">
                 <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${tx.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                      {tx.type === 'income' ? <Plus className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">{tx.desc}</p>
                      <p className="text-xs text-slate-400">{tx.date}</p>
                    </div>
                 </div>
                 <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                   {tx.type === 'income' ? '+' : '-'} Rp {tx.amount.toLocaleString('id-ID')}
                 </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal QRIS */}
      {showQRIS && (
        <Modal title="Pembayaran QRIS" onClose={() => setShowQRIS(false)}>
           <div className="text-center">
              <p className="text-slate-600 mb-4 text-sm">Scan QR code di bawah menggunakan M-Banking atau E-Wallet (GoPay, OVO, Dana, ShopeePay).</p>
              <div className="border-4 border-indigo-100 p-2 rounded-2xl inline-block mb-4 shadow-sm bg-white">
                 <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=QRIS_KAS_ORGANISASI" alt="QRIS" className="rounded-lg" />
              </div>
              <p className="font-bold text-lg text-slate-800">a.n. Kas Organisasi Web</p>
              <button onClick={() => setShowQRIS(false)} className="mt-6 w-full bg-slate-100 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-200 transition">Tutup</button>
           </div>
        </Modal>
      )}

      {/* Modal Form Transaksi */}
      {formType && (
        <Modal title={`Tambah ${formType === 'income' ? 'Pemasukan' : 'Pengeluaran'}`} onClose={() => setFormType(null)}>
          <form onSubmit={handleAddTransaction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nominal (Rp)</label>
              <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <input type="text" required value={desc} onChange={e => setDesc(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <button type="submit" className={`w-full py-2 rounded-lg font-semibold text-white transition ${formType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
              Simpan
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function ViewAnggota() {
  const { currentUser, users, setUsers } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditing, setIsEditing] = useState(null); // null or user object
  
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.nim.includes(searchTerm) ||
    u.division.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing.id) {
      setUsers(users.map(u => u.id === isEditing.id ? isEditing : u));
    } else {
      setUsers([...users, { ...isEditing, id: Date.now() }]);
    }
    setIsEditing(null);
  };

  const openNewForm = () => setIsEditing({ nim: '', name: '', role: 'user', division: '', position: '', password: 'user', photo: 'https://placehold.co/150x150/94a3b8/ffffff?text=New' });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Direktori Anggota</h2>
        <div className="flex w-full sm:w-auto items-center space-x-3">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input 
              type="text" placeholder="Cari nama/nim/divisi..." 
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
            />
          </div>
          {currentUser.role === 'admin' && (
            <button onClick={openNewForm} className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition shadow-sm">
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition group">
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
               {currentUser.role === 'admin' && (
                 <button onClick={() => setIsEditing(user)} className="absolute top-2 right-2 p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100">
                    <Edit className="w-4 h-4" />
                 </button>
               )}
            </div>
            <div className="px-6 pb-6 relative">
              <div className="w-20 h-20 mx-auto -mt-10 rounded-full border-4 border-white shadow-sm overflow-hidden bg-slate-100 mb-3">
                <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-slate-800 text-lg leading-tight">{user.name}</h3>
                <p className="text-xs text-slate-400 mb-3">{user.nim}</p>
                <div className="inline-flex flex-col items-center justify-center space-y-1 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-full">
                  <span className="text-sm font-semibold text-indigo-600">{user.division}</span>
                  <span className="text-xs text-slate-500">{user.position}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && currentUser.role === 'admin' && (
        <Modal title={isEditing.id ? 'Edit Anggota' : 'Tambah Anggota'} onClose={() => setIsEditing(null)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex justify-center mb-4">
               <div className="relative">
                 <img src={isEditing.photo} alt="Preview" className="w-20 h-20 rounded-full object-cover border" />
                 <button type="button" className="absolute bottom-0 right-0 bg-indigo-600 text-white p-1.5 rounded-full"><Camera className="w-3 h-3"/></button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">NIM / ID</label>
                <input type="text" required value={isEditing.nim} onChange={e => setIsEditing({...isEditing, nim: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input type="text" required value={isEditing.name} onChange={e => setIsEditing({...isEditing, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Divisi</label>
                <input type="text" required value={isEditing.division} onChange={e => setIsEditing({...isEditing, division: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Jabatan</label>
                <input type="text" required value={isEditing.position} onChange={e => setIsEditing({...isEditing, position: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Role Akun</label>
                <select value={isEditing.role} onChange={e => setIsEditing({...isEditing, role: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm">
                  <option value="user">Anggota</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
                <input type="text" required value={isEditing.password} onChange={e => setIsEditing({...isEditing, password: e.target.value})} className="w-full px-3 py-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
              <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-100 rounded-lg">Batal</button>
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700">Simpan Data</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function ViewJadwal() {
  const { currentUser, schedules, setSchedules } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing.id) {
      setSchedules(schedules.map(s => s.id === isEditing.id ? isEditing : s));
    } else {
      setSchedules([...schedules, { ...isEditing, id: Date.now() }]);
    }
    setIsEditing(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Jadwal Kegiatan</h2>
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => setIsEditing({ title: '', date: '', time: '', location: '', description: '' })}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" /> <span>Tambah Jadwal</span>
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {schedules.sort((a,b) => new Date(a.date) - new Date(b.date)).map(sched => (
          <div key={sched.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center hover:border-indigo-100 transition">
            <div className="flex items-start space-x-4">
               <div className="bg-indigo-50 text-indigo-700 p-3 rounded-xl text-center min-w-[70px]">
                 <p className="text-xs font-bold uppercase">{new Date(sched.date).toLocaleString('id-ID', {month:'short'})}</p>
                 <p className="text-2xl font-extrabold">{new Date(sched.date).getDate()}</p>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-slate-800">{sched.title}</h3>
                 <p className="text-sm text-slate-500 mt-1">{sched.time} • {sched.location}</p>
                 <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg inline-block border border-slate-100">{sched.description}</p>
               </div>
            </div>
            {currentUser.role === 'admin' && (
              <button onClick={() => setIsEditing(sched)} className="text-slate-400 hover:text-indigo-600 p-2">
                <Edit className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
        {schedules.length === 0 && (
          <div className="text-center py-12 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-300">
            Tidak ada jadwal mendatang.
          </div>
        )}
      </div>

      {isEditing && currentUser.role === 'admin' && (
        <Modal title={isEditing.id ? 'Edit Jadwal' : 'Tambah Jadwal'} onClose={() => setIsEditing(null)}>
           <form onSubmit={handleSave} className="space-y-4">
             <div><label className="text-sm text-slate-700">Nama Kegiatan</label><input required value={isEditing.title} onChange={e=>setIsEditing({...isEditing, title:e.target.value})} className="w-full border p-2 rounded-lg mt-1"/></div>
             <div className="grid grid-cols-2 gap-4">
               <div><label className="text-sm text-slate-700">Tanggal</label><input type="date" required value={isEditing.date} onChange={e=>setIsEditing({...isEditing, date:e.target.value})} className="w-full border p-2 rounded-lg mt-1"/></div>
               <div><label className="text-sm text-slate-700">Waktu</label><input type="time" required value={isEditing.time} onChange={e=>setIsEditing({...isEditing, time:e.target.value})} className="w-full border p-2 rounded-lg mt-1"/></div>
             </div>
             <div><label className="text-sm text-slate-700">Lokasi</label><input required value={isEditing.location} onChange={e=>setIsEditing({...isEditing, location:e.target.value})} className="w-full border p-2 rounded-lg mt-1"/></div>
             <div><label className="text-sm text-slate-700">Deskripsi</label><textarea required value={isEditing.description} onChange={e=>setIsEditing({...isEditing, description:e.target.value})} className="w-full border p-2 rounded-lg mt-1 h-20"></textarea></div>
             <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Simpan Jadwal</button>
           </form>
        </Modal>
      )}
    </div>
  );
}

function ViewMateri() {
  const { currentUser, materials, setMaterials } = useContext(AppContext);
  const [isUploading, setIsUploading] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const handleUpload = (e) => {
    e.preventDefault();
    setMaterials([...materials, {
      id: Date.now(),
      title: newTitle,
      date: new Date().toISOString().split('T')[0],
      type: 'DOCX',
      size: '1.2 MB'
    }]);
    setIsUploading(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Gudang Materi & Notulensi</h2>
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => setIsUploading(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition text-sm flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" /> <span>Unggah Materi</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {materials.map(mat => (
          <div key={mat.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition group">
             <div>
               <div className="flex justify-between items-start mb-4">
                 <div className={`p-3 rounded-xl ${mat.type==='PDF' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                   <FileText className="w-8 h-8" />
                 </div>
                 <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md border">{mat.type}</span>
               </div>
               <h3 className="font-bold text-slate-800 line-clamp-2">{mat.title}</h3>
               <p className="text-xs text-slate-500 mt-2">{mat.date} • {mat.size}</p>
             </div>
             <button className="mt-6 w-full flex items-center justify-center space-x-2 bg-slate-50 text-slate-700 py-2 rounded-lg font-medium hover:bg-indigo-50 hover:text-indigo-600 transition border border-slate-100 group-hover:border-indigo-200">
               <Download className="w-4 h-4" /> <span>Unduh File</span>
             </button>
          </div>
        ))}
      </div>

      {isUploading && currentUser.role === 'admin' && (
        <Modal title="Unggah Materi Baru" onClose={() => setIsUploading(false)}>
          <form onSubmit={handleUpload} className="space-y-4">
             <div>
               <label className="text-sm text-slate-700">Judul Dokumen</label>
               <input required value={newTitle} onChange={e=>setNewTitle(e.target.value)} className="w-full border p-2 rounded-lg mt-1"/>
             </div>
             <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
               <FileText className="w-8 h-8 mx-auto text-slate-400 mb-2" />
               <p className="text-sm text-slate-500">Klik atau drag file ke sini untuk mengunggah (Simulasi)</p>
             </div>
             <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-lg font-bold">Simpan & Unggah</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

// --- HELPER COMPONENTS ---
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-1 rounded-lg transition"><X className="w-5 h-5"/></button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
```