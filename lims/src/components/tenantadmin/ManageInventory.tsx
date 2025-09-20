import React, { useEffect, useState } from 'react';
import {
  FiAlertTriangle, FiCheckCircle,
  FiEdit2,
  FiFilter,
  FiMinusCircle,
  FiPackage,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2
} from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { useAppSettings } from '../contexts/AppSettingsContext';
import './ManageInventory.css';

interface InventoryItem {
  id: number;
  name: string;
  category_name: string;
  quantity: number;
  threshold: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  approval_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  location?: string;
  supplier_name?: string;
  unit_price?: number;
  tenant?: string;
}

const ManageInventory: React.FC = () => {
  const { t } = useAppSettings();

  const labInventoryKey = 'labTechInventory';
  const approvedSupportInventoryKey = 'approvedSupportInventory';
  const equipmentDataKey = 'equipmentData';
  const approvedSupportEquipmentKey = 'approvedSupportEquipment';

  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [equipmentItems, setEquipmentItems] = useState<InventoryItem[]>([]);
  const [approvedLab, setApprovedLab] = useState<InventoryItem[]>([]);
  const [approvedEquipment, setApprovedEquipment] = useState<InventoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id' | 'status' | 'approvalStatus' | 'lastUpdated'>>({
    name: '',
    category: '',
    quantity: 0,
    threshold: 1,
    location: '',
    supplier: ''
  });

  // Load inventory from API
  useEffect(() => {
    fetchInventoryItems();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getInventoryItems();
      setInventoryItems(response.results || response);
    } catch (error) {
      console.error('Failed to fetch inventory items:', error);
      // Fallback to localStorage if API fails
      const saved = localStorage.getItem(labInventoryKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as any[];
          const mapped: InventoryItem[] = parsed.map(item => ({
            id: item.id,
            name: item.name,
            category_name: item.category || '',
            quantity: item.quantity,
            threshold: item.minStockLevel || 1,
            status: item.quantity <= 0 ? 'out-of-stock' :
                    item.quantity <= (item.minStockLevel || 1) ? 'low-stock' :
                    'in-stock',
            approval_status: 'pending',
            created_at: item.lastUpdated || new Date().toISOString(),
            updated_at: item.lastUpdated || new Date().toISOString(),
            location: item.location || '',
            supplier_name: item.supplier || ''
          }));
          setInventoryItems(mapped);
        } catch {
          setInventoryItems([]);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Load Equipment inventory
  useEffect(() => {
    const saved = localStorage.getItem(equipmentDataKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as any[];
        const mapped: InventoryItem[] = parsed.map(eq => ({
          id: eq.id,
          name: eq.name,
          category: eq.category || 'Equipment',
          quantity: eq.quantity || 1,
          threshold: 1,
          status: eq.status === 'operational' ? 'in-stock' :
                  eq.status === 'maintenance' ? 'low-stock' : 'out-of-stock',
          approvalStatus: eq.approvalStatus || 'Pending',
          lastUpdated: eq.lastUpdated || new Date().toISOString(),
          location: eq.location || '',
          supplier: eq.supplier || ''
        }));
        setEquipmentItems(mapped);
      } catch {
        setEquipmentItems([]);
      }
    }
  }, []);

  // Persist lab inventory
  useEffect(() => {
    localStorage.setItem('labTechInventoryItems', JSON.stringify(inventoryItems));
  }, [inventoryItems]);

  // Load Approved Lab Inventory
  useEffect(() => {
    const saved = localStorage.getItem(approvedSupportInventoryKey);
    if (saved) {
      try {
        setApprovedLab(JSON.parse(saved));
      } catch {
        setApprovedLab([]);
      }
    }
  }, [inventoryItems]);

  // Load Approved Equipment Inventory
  useEffect(() => {
    const saved = localStorage.getItem(approvedSupportEquipmentKey);
    if (saved) {
      try {
        setApprovedEquipment(JSON.parse(saved));
      } catch {
        setApprovedEquipment([]);
      }
    }
  }, [equipmentItems]);

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'in-stock': return <FiCheckCircle className="status-icon" />;
      case 'low-stock': return <FiAlertTriangle className="status-icon" />;
      case 'out-of-stock': return <FiMinusCircle className="status-icon" />;
      default: return null;
    }
  };

  // Handle Approval
  const handleApproval = (id: string, approval: 'Approved' | 'Rejected', type: 'lab' | 'equipment') => {
    if(type === 'lab'){
      setInventoryItems(prev => {
        const updated = prev.map(item => {
          if(item.id === id){
            const updatedItem = { ...item, approvalStatus: approval, lastUpdated: new Date().toISOString() };
            if(approval === 'Approved'){
              const saved = localStorage.getItem(approvedSupportInventoryKey);
              let approvedItems: InventoryItem[] = saved ? JSON.parse(saved) : [];
              if(!approvedItems.find(ai => ai.id === updatedItem.id)){
                approvedItems = [...approvedItems, updatedItem];
                localStorage.setItem(approvedSupportInventoryKey, JSON.stringify(approvedItems));
                setApprovedLab(approvedItems); // update state
              }
            }
            return updatedItem;
          }
          return item;
        });
        return updated;
      });
    } else {
      setEquipmentItems(prev => {
        const updated = prev.map(item => {
          if(item.id === id){
            const updatedItem = { ...item, approvalStatus: approval, lastUpdated: new Date().toISOString() };
            if(approval === 'Approved'){
              const saved = localStorage.getItem(approvedSupportEquipmentKey);
              let approvedItems: InventoryItem[] = saved ? JSON.parse(saved) : [];
              if(!approvedItems.find(ai => ai.id === updatedItem.id)){
                approvedItems = [...approvedItems, updatedItem];
                localStorage.setItem(approvedSupportEquipmentKey, JSON.stringify(approvedItems));
                setApprovedEquipment(approvedItems); // update state
              }
            }
            return updatedItem;
          }
          return item;
        });
        return updated;
      });
    }
  };

  const handleDelete = (id: string, type: 'lab' | 'equipment') => {
    if(type === 'lab'){
      setInventoryItems(prev => prev.filter(item => item.id !== id));
    } else {
      setEquipmentItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const refreshInventory = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleAddItem = () => {
    if(!newItem.name.trim() || !newItem.category.trim()) return;
    const status: InventoryItem['status'] = 
      newItem.quantity <= 0 ? 'out-of-stock' :
      newItem.quantity <= newItem.threshold ? 'low-stock' : 'in-stock';

    const item: InventoryItem = {
      id: uuidv4(),
      ...newItem,
      status,
      approvalStatus: 'Pending',
      lastUpdated: new Date().toISOString()
    };

    setInventoryItems(prev => [item, ...prev]);
    setNewItem({ name:'', category:'', quantity:0, threshold:1, location:'', supplier:'' });
    setModalOpen(false);
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  const filteredEquipment = equipmentItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="inventory-container">
      <header className="inventory-header">
        <div>
          <h1><FiPackage className="header-icon" /> {t('inventory_management')}</h1>
          <p className="subtitle">{t('inventory_subtitle')}</p>
        </div>
        <div className="header-actions">
          <button className="refresh-button" onClick={refreshInventory} disabled={isLoading}>
            <FiRefreshCw className={`refresh-icon ${isLoading ? 'spin' : ''}`} />
            {isLoading ? t('refreshing') : t('refresh')}
          </button>
          <button className="add-button" onClick={() => setModalOpen(true)}>
            <FiPlus /> {t('add_item')}
          </button>
        </div>
      </header>

      {/* search + filter */}
      <div className="inventory-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder={t('search_inventory')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <label><FiFilter className="filter-icon" /> {t('filter')}:</label>
          <select value={filter} onChange={e => setFilter(e.target.value as any)}>
            <option value="all">{t('all_items')}</option>
            <option value="in-stock">{t('in_stock')}</option>
            <option value="low-stock">{t('low_stock')}</option>
            <option value="out-of-stock">{t('out_of_stock')}</option>
          </select>
        </div>
      </div>

      {/* Lab Inventory Table */}
      <div className="inventory-table-container">
        <h2>{t('lab_inventory')}</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th><th>{t('item_name')}</th><th>{t('category')}</th><th>{t('quantity')}</th>
              <th>{t('threshold')}</th><th>{t('status')}</th><th>{t('location')}</th>
              <th>{t('last_updated')}</th><th>{t('approval')}</th><th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? filteredItems.map((item, idx) => (
              <tr key={item.id} className={`inventory-item ${item.status}`}>
                <td>{idx+1}</td>
                <td>
                  <div className="item-name">{item.name}</div>
                  {item.supplier && <div className="item-supplier">{item.supplier}</div>}
                </td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
                <td><div className={`status-badge ${item.status}`}>{getStatusIcon(item.status)} {item.status}</div></td>
                <td>{item.location}</td>
                <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                <td><div className={`approval-badge ${item.approvalStatus.toLowerCase()}`}>{t(item.approvalStatus)}</div></td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button"><FiEdit2 /></button>
                    <button className="delete-button" onClick={() => handleDelete(item.id,'lab')}><FiTrash2 /></button>
                    {item.approvalStatus === 'Pending' && <>
                      <button className="approve-button" onClick={() => handleApproval(item.id,'Approved','lab')}>{t('approve')}</button>
                      <button className="reject-button" onClick={() => handleApproval(item.id,'Rejected','lab')}>{t('reject')}</button>
                    </>}
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={10}>{t('no_inventory_items')}</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Equipment Inventory Table */}
      <div className="inventory-table-container">
        <h2>{t('equipment_inventory')}</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th><th>{t('item_name')}</th><th>{t('category')}</th><th>{t('quantity')}</th>
              <th>{t('threshold')}</th><th>{t('status')}</th><th>{t('location')}</th>
              <th>{t('last_updated')}</th><th>{t('approval')}</th><th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredEquipment.length > 0 ? filteredEquipment.map((item, idx) => (
              <tr key={item.id} className={`inventory-item ${item.status}`}>
                <td>{idx+1}</td>
                <td>
                  <div className="item-name">{item.name}</div>
                  {item.supplier && <div className="item-supplier">{item.supplier}</div>}
                </td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
                <td><div className={`status-badge ${item.status}`}>{getStatusIcon(item.status)} {item.status}</div></td>
                <td>{item.location}</td>
                <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                <td><div className={`approval-badge ${item.approvalStatus.toLowerCase()}`}>{t(item.approvalStatus)}</div></td>
                <td>
                  <div className="action-buttons">
                    <button className="edit-button"><FiEdit2 /></button>
                    <button className="delete-button" onClick={() => handleDelete(item.id,'equipment')}><FiTrash2 /></button>
                    {item.approvalStatus === 'Pending' && <>
                      <button className="approve-button" onClick={() => handleApproval(item.id,'Approved','equipment')}>{t('approve')}</button>
                      <button className="reject-button" onClick={() => handleApproval(item.id,'Rejected','equipment')}>{t('reject')}</button>
                    </>}
                  </div>
                </td>
              </tr>
            )) : <tr><td colSpan={10}>{t('no_inventory_items')}</td></tr>}
          </tbody>
        </table>
      </div>

      {/* Add Item Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{t('add_item')}</h3>
            <div className="form-group"><label>{t('item_name')}</label><input type="text" value={newItem.name} onChange={e => setNewItem({...newItem,name:e.target.value})} /></div>
            <div className="form-group"><label>{t('category')}</label><input type="text" value={newItem.category} onChange={e => setNewItem({...newItem,category:e.target.value})} /></div>
            <div className="form-group"><label>{t('quantity')}</label><input type="number" value={newItem.quantity} onChange={e => setNewItem({...newItem,quantity:Number(e.target.value)})} /></div>
            <div className="form-group"><label>{t('threshold')}</label><input type="number" value={newItem.threshold} onChange={e => setNewItem({...newItem,threshold:Number(e.target.value)})} /></div>
            <div className="form-group"><label>{t('location')}</label><input type="text" value={newItem.location} onChange={e => setNewItem({...newItem,location:e.target.value})} /></div>
            <div className="form-group"><label>{t('supplier')}</label><input type="text" value={newItem.supplier} onChange={e => setNewItem({...newItem,supplier:e.target.value})} /></div>
            <div className="modal-actions">
              <button onClick={() => setModalOpen(false)}>{t('cancel')}</button>
              <button onClick={handleAddItem}>{t('add_item')}</button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Approved Lab Inventory */}
      <div className="inventory-table-container">
        <h2>{t('approved_lab_inventory')}</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th><th>{t('item_name')}</th><th>{t('category')}</th><th>{t('quantity')}</th>
              <th>{t('threshold')}</th><th>{t('status')}</th><th>{t('location')}</th>
              <th>{t('last_updated')}</th>
            </tr>
          </thead>
          <tbody>
            {approvedLab.length > 0 ? approvedLab.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx+1}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
                <td>{item.status}</td>
                <td>{item.location}</td>
                <td>{new Date(item.lastUpdated).toLocaleString()}</td>
              </tr>
            )) : <tr><td colSpan={8}>{t('no_approved_items')}</td></tr>}
          </tbody>
        </table>
      </div>

      {/* ✅ Approved Equipment Inventory */}
      <div className="inventory-table-container">
        <h2>{t('approved_equipment_inventory')}</h2>
        <table className="inventory-table">
          <thead>
            <tr>
              <th>#</th><th>{t('item_name')}</th><th>{t('category')}</th><th>{t('quantity')}</th>
              <th>{t('threshold')}</th><th>{t('status')}</th><th>{t('location')}</th>
              <th>{t('last_updated')}</th>
            </tr>
          </thead>
          <tbody>
            {approvedEquipment.length > 0 ? approvedEquipment.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx+1}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.threshold}</td>
                <td>{item.status}</td>
                <td>{item.location}</td>
                <td>{new Date(item.lastUpdated).toLocaleString()}</td>
              </tr>
            )) : <tr><td colSpan={8}>{t('no_approved_items')}</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageInventory;
