import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Users,
    Package,
    Briefcase,
    CheckCircle,
    LogOut,
    Plus,
    Search,
    MoreVertical,
    ArrowRight,
    ShieldCheck,
    Menu,
    X
} from 'lucide-react';

// --- MOCK DATA ---

const MOCK_PRODUCTS = [
    { id: 1, name: 'Home Fiber 20Mbps', price: 250000, description: 'Cocok untuk penggunaan ringan' },
    { id: 2, name: 'Home Fiber 50Mbps', price: 375000, description: 'Streaming 4K lancar' },
    { id: 3, name: 'Bisnis Dedicated 100Mbps', price: 1500000, description: 'IP Static Public included' },
];

const MOCK_LEADS = [
    { id: 1, name: 'Budi Santoso', email: 'budi@gmail.com', phone: '08123456789', address: 'Jl. Merpati No. 1', status: 'New', interest: 'Home Fiber 20Mbps' },
    { id: 2, name: 'PT. Maju Mundur', email: 'info@majumundur.com', phone: '021-555666', address: 'Gedung Cyber Lt. 2', status: 'Follow Up', interest: 'Bisnis Dedicated 100Mbps' },
    { id: 3, name: 'Siti Aminah', email: 'siti@yahoo.com', phone: '08987654321', address: 'Komp. Griya Indah', status: 'New', interest: 'Home Fiber 50Mbps' },
];

const MOCK_PROJECTS = [
    { id: 101, leadName: 'Warung Kopi Senja', product: 'Bisnis Dedicated 100Mbps', status: 'Survey', surveyor: 'Joni', managerApproved: false },
    { id: 102, leadName: 'Andi Wijaya', product: 'Home Fiber 50Mbps', status: 'Installation', surveyor: 'Eko', managerApproved: true },
];

const MOCK_CUSTOMERS = [
    { id: 1001, name: 'Hotel Grand City', product: 'Bisnis Dedicated 100Mbps', activeSince: '2023-01-15', status: 'Active' },
    { id: 1002, name: 'Rina Nose', product: 'Home Fiber 20Mbps', activeSince: '2023-05-20', status: 'Active' },
];

// --- COMPONENTS ---

const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
        {children}
    </div>
);

const Badge = ({ status }) => {
    const styles = {
        'New': 'bg-blue-100 text-blue-700',
        'Follow Up': 'bg-yellow-100 text-yellow-700',
        'Survey': 'bg-purple-100 text-purple-700',
        'Installation': 'bg-orange-100 text-orange-700',
        'Active': 'bg-green-100 text-green-700',
        'Approved': 'bg-teal-100 text-teal-700',
        'Pending': 'bg-gray-100 text-gray-600',
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
            {status}
        </span>
    );
};

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState('sales'); // 'sales' or 'manager'
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State Data
    const [leads, setLeads] = useState(MOCK_LEADS);
    const [products, setProducts] = useState(MOCK_PRODUCTS);
    const [projects, setProjects] = useState(MOCK_PROJECTS);
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);

    // --- ACTIONS ---

    const handleLogin = (role) => {
        setUserRole(role);
        setIsAuthenticated(true);
    };

    const handleCreateProject = (lead) => {
        const newProject = {
            id: Date.now(),
            leadName: lead.name,
            product: lead.interest,
            status: 'Survey',
            surveyor: '-',
            managerApproved: false
        };
        setProjects([...projects, newProject]);
        setLeads(leads.filter(l => l.id !== lead.id));
        setActiveTab('projects');
    };

    const handleApproveProject = (project) => {
        // In real app: Update DB, trigger installation logic
        const updatedProjects = projects.map(p =>
            p.id === project.id ? { ...p, managerApproved: true, status: 'Installation' } : p
        );
        setProjects(updatedProjects);
    };

    const handleFinishProject = (project) => {
        const newCustomer = {
            id: Date.now(),
            name: project.leadName,
            product: project.product,
            activeSince: new Date().toISOString().split('T')[0],
            status: 'Active'
        };
        setCustomers([...customers, newCustomer]);
        setProjects(projects.filter(p => p.id !== project.id));
        setActiveTab('customers');
    };

    // --- VIEWS ---

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">PT. Smart CRM</h1>
                        <p className="text-gray-500 mt-2">Masuk untuk mengelola operasional</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => handleLogin('sales')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            Login sebagai Sales
                        </button>
                        <button
                            onClick={() => handleLogin('manager')}
                            className="w-full bg-white border-2 border-gray-200 hover:border-blue-600 text-gray-700 hover:text-blue-600 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            <ShieldCheck size={18} />
                            Login sebagai Manager
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 text-center mt-6">Simulasi Login untuk Test Magang</p>
                </div>
            </div>
        );
    }

    const NavItem = ({ id, label, icon: Icon }) => (
        <button
            onClick={() => {
                setActiveTab(id);
                setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
        >
            <Icon size={20} />
            {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 font-sans flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col fixed h-full z-10">
                <div className="p-6 flex items-center gap-2 border-b border-gray-100">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <CheckCircle className="text-white w-5 h-5" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">Smart CRM</span>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                    <NavItem id="leads" label="Leads / Calon" icon={Users} />
                    <NavItem id="projects" label="Project & Approval" icon={Briefcase} />
                    <NavItem id="customers" label="Pelanggan" icon={CheckCircle} />
                    <NavItem id="products" label="Master Produk" icon={Package} />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {userRole === 'manager' ? 'M' : 'S'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{userRole === 'manager' ? 'Manager Ops' : 'Sales Staff'}</p>
                            <p className="text-xs text-gray-500 truncate">{userRole === 'manager' ? 'Approver' : 'Inputer'}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white z-20 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-600 p-1 rounded">
                        <CheckCircle className="text-white w-4 h-4" />
                    </div>
                    <span className="font-bold text-lg text-gray-900">Smart CRM</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 bg-gray-800 bg-opacity-50 z-10 pt-16">
                    <div className="bg-white p-4 space-y-2 h-full">
                        <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                        <NavItem id="leads" label="Leads / Calon" icon={Users} />
                        <NavItem id="projects" label="Project & Approval" icon={Briefcase} />
                        <NavItem id="customers" label="Pelanggan" icon={CheckCircle} />
                        <NavItem id="products" label="Master Produk" icon={Package} />
                        <button
                            onClick={() => setIsAuthenticated(false)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 lg:ml-64 p-6 pt-20 lg:pt-6">

                {/* DASHBOARD VIEW */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>
                            <span className="text-sm text-gray-500">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Leads', val: leads.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                                { label: 'Project Berjalan', val: projects.length, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
                                { label: 'Pelanggan Aktif', val: customers.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
                                { label: 'Total Produk', val: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
                            ].map((stat, idx) => (
                                <Card key={idx} className="p-6 flex items-center gap-4">
                                    <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
                                        <stat.icon size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.val}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Recent Leads Preview */}
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Leads Terbaru</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-900 font-medium">
                                        <tr>
                                            <th className="p-3">Nama</th>
                                            <th className="p-3">Produk Diminati</th>
                                            <th className="p-3">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leads.slice(0, 3).map(lead => (
                                            <tr key={lead.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-medium">{lead.name}</td>
                                                <td className="p-3">{lead.interest}</td>
                                                <td className="p-3"><Badge status={lead.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* LEADS VIEW */}
                {activeTab === 'leads' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800">Database Calon Customer</h2>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <Plus size={18} /> Tambah Lead Manual
                            </button>
                        </div>

                        <Card className="overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex gap-2">
                                <div className="relative flex-1 max-w-sm">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input type="text" placeholder="Cari nama atau telepon..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-900 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Nama Customer</th>
                                            <th className="p-4">Kontak</th>
                                            <th className="p-4">Minat Layanan</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leads.map(lead => (
                                            <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4">
                                                    <p className="font-semibold text-gray-900">{lead.name}</p>
                                                    <p className="text-xs text-gray-500">{lead.address}</p>
                                                </td>
                                                <td className="p-4">
                                                    <p>{lead.email}</p>
                                                    <p className="text-xs text-gray-500">{lead.phone}</p>
                                                </td>
                                                <td className="p-4 text-blue-600 font-medium">{lead.interest}</td>
                                                <td className="p-4"><Badge status={lead.status} /></td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleCreateProject(lead)}
                                                        className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1"
                                                    >
                                                        Proses <ArrowRight size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {leads.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="p-8 text-center text-gray-400">Belum ada data leads.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* PRODUCTS VIEW */}
                {activeTab === 'products' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Master Layanan Internet</h2>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <Plus size={18} /> Tambah Layanan
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products.map(product => (
                                <Card key={product.id} className="p-6 relative hover:shadow-md transition-shadow">
                                    <div className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full cursor-pointer hover:bg-gray-100">
                                        <MoreVertical size={16} className="text-gray-500" />
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 text-blue-600">
                                        <Package size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{product.name}</h3>
                                    <p className="text-2xl font-bold text-blue-600 mb-4">
                                        Rp {product.price.toLocaleString('id-ID')} <span className="text-sm font-normal text-gray-500">/bln</span>
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                                    <div className="pt-4 border-t border-gray-100 flex gap-2">
                                        <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded text-sm font-medium hover:bg-gray-100">Edit</button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* PROJECTS VIEW */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">Project & Instalasi</h2>
                            {userRole === 'manager' && (
                                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">Manager Mode</span>
                            )}
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-900 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">ID Project</th>
                                            <th className="p-4">Nama Pelanggan</th>
                                            <th className="p-4">Layanan</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Approval Manager</th>
                                            <th className="p-4 text-right">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map(proj => (
                                            <tr key={proj.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4 font-mono text-gray-500">#{proj.id}</td>
                                                <td className="p-4 font-semibold text-gray-900">{proj.leadName}</td>
                                                <td className="p-4">{proj.product}</td>
                                                <td className="p-4"><Badge status={proj.status} /></td>
                                                <td className="p-4">
                                                    {proj.managerApproved ? (
                                                        <div className="flex items-center gap-1 text-green-600 font-medium">
                                                            <CheckCircle size={16} /> Disetujui
                                                        </div>
                                                    ) : (
                                                        <div className="text-orange-500 font-medium">Menunggu</div>
                                                    )}
                                                </td>
                                                <td className="p-4 text-right">
                                                    {/* Manager Action: Approve */}
                                                    {!proj.managerApproved && userRole === 'manager' && (
                                                        <button
                                                            onClick={() => handleApproveProject(proj)}
                                                            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded text-xs font-medium mr-2"
                                                        >
                                                            Approve
                                                        </button>
                                                    )}

                                                    {/* Sales/Ops Action: Finish Installation */}
                                                    {proj.managerApproved && proj.status === 'Installation' && (
                                                        <button
                                                            onClick={() => handleFinishProject(proj)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium"
                                                        >
                                                            Selesai Instalasi
                                                        </button>
                                                    )}

                                                    {/* Disabled State for Sales if not approved */}
                                                    {!proj.managerApproved && userRole === 'sales' && (
                                                        <span className="text-xs text-gray-400 italic">Perlu Approval Manager</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                        {projects.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-gray-400">Belum ada project berjalan. Proses dari menu Leads.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

                {/* CUSTOMERS VIEW */}
                {activeTab === 'customers' && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Pelanggan Aktif</h2>
                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-900 font-medium uppercase text-xs">
                                        <tr>
                                            <th className="p-4">ID Pelanggan</th>
                                            <th className="p-4">Nama</th>
                                            <th className="p-4">Paket Berlangganan</th>
                                            <th className="p-4">Aktif Sejak</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map(cust => (
                                            <tr key={cust.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="p-4 font-mono text-gray-500">#{cust.id}</td>
                                                <td className="p-4 font-semibold text-gray-900">{cust.name}</td>
                                                <td className="p-4 text-blue-600 font-medium">{cust.product}</td>
                                                <td className="p-4">{cust.activeSince}</td>
                                                <td className="p-4"><Badge status={cust.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                )}

            </main>
        </div>
    );
}