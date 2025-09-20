import React, { useEffect, useState } from 'react';
import {
    FiAlertTriangle,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiEdit2,
    FiPlus,
    FiSearch,
    FiTool,
    FiX
} from 'react-icons/fi';
import { apiService } from '../../services/apiService';
import { useAppSettings } from '../contexts/AppSettingsContext';
import './Equipment.css';

type EquipmentStatus = 'operational' | 'maintenance' | 'out-of-service';
type EquipmentPriority = 'low' | 'medium' | 'high';

interface EquipmentItem {
  id: number;
  name: string;
  model: string;
  serial_number: string;
  department: string;
  last_calibration: {
    calibration_date: string;
    next_calibration_date: string;
  } | null;
  last_maintenance: {
    maintenance_date: string;
    maintenance_type: string;
  } | null;
  status: EquipmentStatus;
  priority: EquipmentPriority;
  notes: string;
  location?: string;
  supplier?: string;
  tenant?: string;
}

const Equipment: React.FC = () => {
  const { t } = useAppSettings();

  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<EquipmentPriority | 'All'>('All');
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'calibration' | 'maintenance' | 'status' | 'add' | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentItem | null>(null);
  const [dateValue, setDateValue] = useState('');
  const [notesValue, setNotesValue] = useState('');

  // New equipment form state
  const [newEquipment, setNewEquipment] = useState<Partial<EquipmentItem>>({
    name: '',
    model: '',
    serial_number: '',
    department: '',
    priority: 'low',
    status: 'operational',
    notes: '',
    location: '',
    supplier: ''
  });

  // Load equipment from API
  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const response = await apiService.getEquipment();
      setEquipment(response.results || response);
    } catch (error) {
      console.error('Failed to fetch equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type: 'calibration' | 'maintenance' | 'status', equip: EquipmentItem) => {
    setModalType(type);
    setSelectedEquipment(equip);
    setDateValue('');
    setNotesValue('');
    setModalOpen(true);
  };

  const openAddModal = () => {
    setModalType('add');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedEquipment(null);
    setDateValue('');
    setNotesValue('');
    setNewEquipment({
      name: '',
      model: '',
      serial_number: '',
      department: '',
      priority: 'low',
      status: 'operational',
      notes: '',
      location: '',
      supplier: ''
    });
  };

  const handleSave = async () => {
    if (modalType === 'add') {
      try {
        const newItem = await apiService.createEquipment({
          name: newEquipment.name || 'Unnamed',
          model: newEquipment.model || 'Unknown',
          serial_number: newEquipment.serial_number || `SN-${Date.now()}`,
          department: newEquipment.department || 'General',
          priority: newEquipment.priority || 'low',
          status: newEquipment.status || 'operational',
          notes: newEquipment.notes || '',
          location: newEquipment.location || '',
          supplier: newEquipment.supplier || '',
          tenant: 'current_tenant'
        });

        setEquipment([newItem, ...equipment]);
        closeModal();
      } catch (error) {
        console.error('Failed to create equipment:', error);
        alert('Failed to create equipment. Please try again.');
      }
    } else if (modalType === 'calibration' && selectedEquipment) {
      try {
        await apiService.calibrateEquipment(selectedEquipment.id, {
          calibration_date: dateValue,
          next_calibration_date: new Date(new Date(dateValue).setMonth(new Date(dateValue).getMonth() + 6)).toISOString().split('T')[0],
          calibrated_by: 'current_user',
          notes: notesValue,
          certificate_number: ''
        });
        
        await fetchEquipment();
        closeModal();
      } catch (error) {
        console.error('Failed to calibrate equipment:', error);
        alert('Failed to calibrate equipment. Please try again.');
      }
    } else if (modalType === 'maintenance' && selectedEquipment) {
      try {
        await apiService.maintainEquipment(selectedEquipment.id, {
          maintenance_date: dateValue,
          maintenance_type: 'Preventive',
          performed_by: 'current_user',
          description: notesValue,
          parts_replaced: '',
          cost: null,
          next_maintenance_due: new Date(new Date(dateValue).setMonth(new Date(dateValue).getMonth() + 3)).toISOString().split('T')[0]
        });
        
        await fetchEquipment();
        closeModal();
      } catch (error) {
        console.error('Failed to maintain equipment:', error);
        alert('Failed to maintain equipment. Please try again.');
      }
    } else if (modalType === 'status' && selectedEquipment) {
      try {
        await apiService.updateEquipmentStatus(selectedEquipment.id, dateValue);
        
        setEquipment(prev => prev.map(eq => 
          eq.id === selectedEquipment.id 
            ? { ...eq, status: dateValue as EquipmentStatus }
            : eq
        ));
        closeModal();
      } catch (error) {
        console.error('Failed to update equipment status:', error);
        alert('Failed to update equipment status. Please try again.');
      }
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: EquipmentStatus) => {
    switch (status) {
      case 'operational':
        return <span className="status-badge operational"><FiCheckCircle /> {t('operational') || 'Operational'}</span>;
      case 'maintenance':
        return <span className="status-badge maintenance"><FiTool /> {t('maintenance') || 'Maintenance'}</span>;
      case 'out-of-service':
        return <span className="status-badge out-of-service"><FiAlertTriangle /> {t('out_of_service') || 'Out of Service'}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const getPriorityBadge = (priority: EquipmentPriority) => {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444'
    };
    return <span className="priority-badge" style={{ backgroundColor: colors[priority] }}>{priority.toUpperCase()}</span>;
  };

  if (loading) {
    return (
      <div className="equipment-container">
        <div className="loading">Loading equipment...</div>
      </div>
    );
  }

  return (
    <div className="equipment-container">
      <header className="equipment-header">
        <div>
          <h1>{t('equipment_management') || 'Equipment Management'}</h1>
          <p>{t('manage_lab_equipment') || 'Manage laboratory equipment, calibration, and maintenance'}</p>
        </div>
        <button className="add-button" onClick={openAddModal}>
          <FiPlus /> {t('add_equipment') || 'Add Equipment'}
        </button>
      </header>

      <div className="equipment-controls">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder={t('search_equipment') || 'Search equipment...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-container">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus | 'All')}
          >
            <option value="All">{t('all_statuses') || 'All Statuses'}</option>
            <option value="operational">{t('operational') || 'Operational'}</option>
            <option value="maintenance">{t('maintenance') || 'Maintenance'}</option>
            <option value="out-of-service">{t('out_of_service') || 'Out of Service'}</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as EquipmentPriority | 'All')}
          >
            <option value="All">{t('all_priorities') || 'All Priorities'}</option>
            <option value="low">{t('low') || 'Low'}</option>
            <option value="medium">{t('medium') || 'Medium'}</option>
            <option value="high">{t('high') || 'High'}</option>
          </select>
        </div>
      </div>

      <div className="equipment-grid">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="equipment-card">
            <div className="equipment-header">
              <h3>{item.name}</h3>
              <div className="equipment-badges">
                {getStatusBadge(item.status)}
                {getPriorityBadge(item.priority)}
              </div>
            </div>

            <div className="equipment-details">
              <p><strong>{t('model') || 'Model'}:</strong> {item.model}</p>
              <p><strong>{t('serial_number') || 'Serial Number'}:</strong> {item.serial_number}</p>
              <p><strong>{t('department') || 'Department'}:</strong> {item.department}</p>
              {item.location && <p><strong>{t('location') || 'Location'}:</strong> {item.location}</p>}
            </div>

            <div className="equipment-dates">
              {item.last_calibration && (
                <div className="date-info">
                  <FiCalendar />
                  <span>{t('last_calibration') || 'Last Calibration'}: {new Date(item.last_calibration.calibration_date).toLocaleDateString()}</span>
                </div>
              )}
              {item.last_maintenance && (
                <div className="date-info">
                  <FiClock />
                  <span>{t('last_maintenance') || 'Last Maintenance'}: {new Date(item.last_maintenance.maintenance_date).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            <div className="equipment-actions">
              <button onClick={() => openModal('calibration', item)} className="action-button">
                <FiCalendar /> {t('calibrate') || 'Calibrate'}
              </button>
              <button onClick={() => openModal('maintenance', item)} className="action-button">
                <FiTool /> {t('maintain') || 'Maintain'}
              </button>
              <button onClick={() => openModal('status', item)} className="action-button">
                <FiEdit2 /> {t('update_status') || 'Update Status'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {modalType === 'add' && (t('add_equipment') || 'Add Equipment')}
                {modalType === 'calibration' && (t('calibrate_equipment') || 'Calibrate Equipment')}
                {modalType === 'maintenance' && (t('maintain_equipment') || 'Maintain Equipment')}
                {modalType === 'status' && (t('update_status') || 'Update Status')}
              </h3>
              <button onClick={closeModal} className="close-button">
                <FiX />
              </button>
            </div>

            <div className="modal-content">
              {modalType === 'add' && (
                <div className="form-group">
                  <label>{t('name') || 'Name'}</label>
                  <input
                    type="text"
                    value={newEquipment.name || ''}
                    onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  />
                </div>
              )}

              {(modalType === 'calibration' || modalType === 'maintenance' || modalType === 'status') && (
                <div className="form-group">
                  <label>
                    {modalType === 'calibration' && (t('calibration_date') || 'Calibration Date')}
                    {modalType === 'maintenance' && (t('maintenance_date') || 'Maintenance Date')}
                    {modalType === 'status' && (t('new_status') || 'New Status')}
                  </label>
                  {modalType === 'status' ? (
                    <select value={dateValue} onChange={(e) => setDateValue(e.target.value)}>
                      <option value="operational">{t('operational') || 'Operational'}</option>
                      <option value="maintenance">{t('maintenance') || 'Maintenance'}</option>
                      <option value="out-of-service">{t('out_of_service') || 'Out of Service'}</option>
                    </select>
                  ) : (
                    <input
                      type="date"
                      value={dateValue}
                      onChange={(e) => setDateValue(e.target.value)}
                    />
                  )}
                </div>
              )}

              <div className="form-group">
                <label>{t('notes') || 'Notes'}</label>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={closeModal} className="cancel-button">
                {t('cancel') || 'Cancel'}
              </button>
              <button onClick={handleSave} className="save-button">
                {t('save') || 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Equipment;
