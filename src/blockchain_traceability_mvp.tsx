import * as React from 'react';
import { Package, MapPin, Calendar, CheckCircle, Users, Truck, Store, Leaf, Shield, DollarSign } from 'lucide-react';
import { useState } from 'react';

  // Define the type for your newProduct state
interface NewProduct {
  productName: string;
  location: string;
  harvestDate: string;
  certifications: string[]; // <-- This is the key change
  batchSize: string;
  description: string;
}

// Define the type for your blockchain records
interface BlockchainRecord {
  id: string;
  productName: string;
  farmer: string;
  farmerAddress: string;
  location: string;
  harvestDate: string;
  certifications: string[];
  batchSize: string;
  blockHash: string;
  timestamp: string;
  status: string;
  transactionFee: number;
  verifications: number;
}

  const BlockchainTraceabilityMVP = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState('farmer');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<BlockchainRecord | null>(null);

  // Simulated blockchain data
  const [blockchainRecords, setBlockchainRecords] = useState([
    {
      id: 'BLK001',
      productName: 'Organic Apples',
      farmer: 'Green Valley Farm',
      farmerAddress: '0x742d35Cc6634C0532925a3b8D1750B87B02B6C71',
      location: 'Stellenbosch, Western Cape',
      harvestDate: '2025-09-10',
      certifications: ['Organic', 'Fair Trade'],
      batchSize: '500kg',
      blockHash: '0x4f3c2a1b8e7d6c5a9b8e7f6d5c4a3b2c1d0e9f8a',
      timestamp: '2025-09-10T08:30:00Z',
      status: 'Certified',
      transactionFee: 0.002,
      verifications: 3
    },
    {
      id: 'BLK002',
      productName: 'Free-Range Eggs',
      farmer: 'Sunrise Poultry',
      farmerAddress: '0x8b3e4d2a1c9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d',
      location: 'Robertson, Western Cape',
      harvestDate: '2025-09-11',
      certifications: ['Free-Range', 'Animal Welfare Approved'],
      batchSize: '1200 eggs',
      blockHash: '0x7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
      timestamp: '2025-09-11T06:15:00Z',
      status: 'In Transit',
      transactionFee: 0.0015,
      verifications: 1
    }
  ]);

  const [newProduct, setNewProduct] = useState<NewProduct>({
  productName: '',
  location: '',
  harvestDate: '',
  certifications: [], // <-- The empty array is now correctly typed as string[]
  batchSize: '',
  description: '',
});

  const [businessMetrics, setBusinessMetrics] = useState({
    totalTransactions: 247,
    monthlyRevenue: 2470,
    activeFarms: 23,
    connectedRetailers: 8,
    averageFee: 10
  });

  const certificationOptions = [
    'Organic', 'Fair Trade', 'Free-Range', 'Animal Welfare Approved', 
    'Rainforest Alliance', 'Non-GMO', 'Sustainable', 'Local'
  ];

  const addProduct = () => {
    if (!newProduct.productName || !newProduct.location || !newProduct.harvestDate) {
      alert('Please fill in all required fields');
      return;
    }

    const product = {
      id: `BLK${String(blockchainRecords.length + 1).padStart(3, '0')}`,
      ...newProduct,
      farmer: userRole === 'farmer' ? 'Current Farm' : 'Unknown Farm',
      farmerAddress: '0x' + Math.random().toString(16).substr(2, 40),
      blockHash: '0x' + Math.random().toString(16).substr(2, 40),
      timestamp: new Date().toISOString(),
      status: 'Certified',
      transactionFee: Math.random() * 0.005 + 0.001,
      verifications: 1
    };

    setBlockchainRecords([...blockchainRecords, product]);
    setNewProduct({
      productName: '',
      location: '',
      harvestDate: '',
      certifications: [],
      batchSize: '',
      description: ''
    });
    
    // Simulate transaction fee and update metrics
    setBusinessMetrics(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
      monthlyRevenue: prev.monthlyRevenue + prev.averageFee
    }));
    
    setCurrentView('blockchain');
  };

 const verifyProduct = (productId: string | number) => {
  setBlockchainRecords(prev => 
    prev.map(record => 
      record.id === productId 
        ? { ...record, verifications: record.verifications + 1 }
        : record
    )
  );
};

  const toggleCertification = (cert: string) => { // <-- Add a type to 'cert'
  setNewProduct(prev => ({
    ...prev,
    certifications: prev.certifications.includes(cert)
      ? prev.certifications.filter(c => c !== cert)
      : [...prev.certifications, cert]
  }));
};

  const Dashboard = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Maroon Blockchain</h1>
        <p className="text-xl text-gray-600">Private Blockchain for Supply Chain Traceability</p>
      </div>

      {/* Business Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-green-700">{businessMetrics.totalTransactions}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-blue-700">R{businessMetrics.monthlyRevenue}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Active Farms</p>
              <p className="text-2xl font-bold text-purple-700">{businessMetrics.activeFarms}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center">
            <Store className="h-8 w-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Retailers</p>
              <p className="text-2xl font-bold text-orange-700">{businessMetrics.connectedRetailers}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-gray-600 mr-3" />
            <div>
              <p className="text-sm text-gray-600">Avg. Fee (R)</p>
              <p className="text-2xl font-bold text-gray-700">{businessMetrics.averageFee}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-xl font-bold mb-4 text-gray-800">For Farmers</h3>
          <p className="text-gray-600 mb-4">Certify your products on the blockchain and build trust with retailers.</p>
          <div className="space-y-2">
            <button
              onClick={() => {setUserRole('farmer'); setCurrentView('certify');}}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition duration-200"
            >
              Certify Product
            </button>
            <button
              onClick={() => {setUserRole('farmer'); setCurrentView('blockchain');}}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
            >
              View My Products
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h3 className="text-xl font-bold mb-4 text-gray-800">For Retailers</h3>
          <p className="text-gray-600 mb-4">Verify product origins and build customer confidence.</p>
          <div className="space-y-2">
            <button
              onClick={() => {setUserRole('retailer'); setCurrentView('blockchain');}}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-200"
            >
              Verify Products
            </button>
            <button
              onClick={() => {setUserRole('retailer'); setCurrentView('blockchain');}}
              className="w-full bg-orange-600 text-white py-2 px-4 rounded hover:bg-orange-700 transition duration-200"
            >
              Browse Certified Products
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Recent Blockchain Activity</h3>
        <div className="space-y-3">
          {blockchainRecords.slice(0, 3).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center">
                <Package className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">{record.productName}</p>
                  <p className="text-sm text-gray-600">{record.farmer} • {record.location}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{new Date(record.timestamp).toLocaleDateString()}</p>
                <span className={`text-xs px-2 py-1 rounded ${
                  record.status === 'Certified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CertifyProduct = () => (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Certify New Product</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg border">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              value={newProduct.productName}
              onChange={(e) => setNewProduct({...newProduct, productName: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Organic Apples"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
            <input
              type="text"
              value={newProduct.location}
              onChange={(e) => setNewProduct({...newProduct, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Stellenbosch, Western Cape"
            />
          </div>

          <div>
            <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-1">Harvest Date *</label>
            <input
              id="harvestDate"
              type="date"
              value={newProduct.harvestDate}
              onChange={(e) => setNewProduct({...newProduct, harvestDate: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Size</label>
            <input
              type="text"
              value={newProduct.batchSize}
              onChange={(e) => setNewProduct({...newProduct, batchSize: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 500kg, 1200 units"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Certifications</label>
            <div className="grid grid-cols-2 gap-2">
              {certificationOptions.map((cert) => (
                <label key={cert} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.certifications.includes(cert)}
                    onChange={() => toggleCertification(cert)}
                    className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{cert}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Additional product details..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Transaction Fee:</strong> R{businessMetrics.averageFee} (automatically calculated)
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This covers blockchain gas costs and platform maintenance
            </p>
          </div>

          <button
            onClick={addProduct}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 font-medium"
          >
            Certify Product on Blockchain
          </button>
        </div>
      </div>
    </div>
  );

  const BlockchainView = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">
          {userRole === 'farmer' ? 'My Certified Products' : 'Verified Products'}
        </h2>
        <div className="text-sm text-gray-600">
          Total Records: {blockchainRecords.length}
        </div>
      </div>

      <div className="grid gap-6">
        {blockchainRecords.map((record) => (
          <div key={record.id} className="bg-white p-6 rounded-lg shadow-lg border">
            <div className="flex flex-col lg:flex-row lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <Package className="h-6 w-6 text-green-600 mr-2" />
                  <h3 className="text-xl font-bold text-gray-800">{record.productName}</h3>
                  <span className={`ml-3 px-3 py-1 text-xs rounded-full ${
                    record.status === 'Certified' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{record.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{record.harvestDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{record.farmer}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{record.batchSize}</span>
                  </div>
                </div>

                {record.certifications && record.certifications.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      {record.certifications.map((cert, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
                  <p><strong>Block ID:</strong> {record.id}</p>
                  <p><strong>Block Hash:</strong> {record.blockHash}</p>
                  <p><strong>Farmer Address:</strong> {record.farmerAddress}</p>
                  <p><strong>Transaction Fee:</strong> {record.transactionFee.toFixed(4)} ETH</p>
                  <p><strong>Verifications:</strong> {record.verifications}</p>
                </div>
              </div>

              <div className="lg:ml-6 mt-4 lg:mt-0">
                {userRole === 'retailer' && (
                  <button
                    onClick={() => verifyProduct(record.id)}
                    className="w-full lg:w-auto bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition duration-200 flex items-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify Product
                  </button>
                )}
                <button
                  onClick={() => setSelectedProduct(record)}
                  className="w-full lg:w-auto mt-2 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition duration-200"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Blockchain Record Details</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <p><strong>Product:</strong> {selectedProduct.productName}</p>
              <p><strong>Farmer:</strong> {selectedProduct.farmer}</p>
              <p><strong>Location:</strong> {selectedProduct.location}</p>
              <p><strong>Harvest Date:</strong> {selectedProduct.harvestDate}</p>
              <p><strong>Batch Size:</strong> {selectedProduct.batchSize}</p>
              <p><strong>Status:</strong> {selectedProduct.status}</p>
              <p><strong>Blockchain Hash:</strong> <code className="bg-gray-100 px-1 rounded">{selectedProduct.blockHash}</code></p>
              <p><strong>Farmer Wallet:</strong> <code className="bg-gray-100 px-1 rounded">{selectedProduct.farmerAddress}</code></p>
              <p><strong>Timestamp:</strong> {new Date(selectedProduct.timestamp).toLocaleString()}</p>
              <p><strong>Transaction Fee:</strong> {selectedProduct.transactionFee.toFixed(4)} ETH</p>
              <p><strong>Verifications:</strong> {selectedProduct.verifications}</p>
              {selectedProduct.certifications && (
                <p><strong>Certifications:</strong> {selectedProduct.certifications.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <span className="text-xl font-bold text-gray-800">Maroon Blockchain</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('certify')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'certify' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Certify Product
              </button>
              <button
                onClick={() => setCurrentView('blockchain')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'blockchain' 
                    ? 'bg-green-100 text-green-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Blockchain
              </button>
              <div className="flex items-center">
                <label htmlFor="user-role" className="text-sm text-gray-500 mr-2">Role:</label>
                <select
                  id="user-role"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  <option value="farmer">Farmer</option>
                  <option value="retailer">Retailer</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'certify' && <CertifyProduct />}
        {currentView === 'blockchain' && <BlockchainView />}
      </main>
    </div>
  );
};

export default BlockchainTraceabilityMVP;