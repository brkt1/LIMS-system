import React, { useState } from 'react';
import { FiActivity, FiAlertCircle, FiCheckCircle, FiClock, FiDownload, FiFilter, FiInfo, FiSearch, FiUser } from 'react-icons/fi';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useSystemLogs } from '../contexts/SystemLogsContext';
import './SystemLogs.css';

const SystemLogs: React.FC = () => {
  const { t } = useAppSettings();
  const { logs, addLog } = useSystemLogs();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filteredLogs = logs.filter(log => {
    const matchesFilter = filter === 'all' || log.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details && log.details.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': return <FiCheckCircle className="status-icon" />;
      case 'error': return <FiAlertCircle className="status-icon" />;
      case 'warning': return <FiAlertCircle className="status-icon warning" />;
      default: return <FiInfo className="status-icon" />;
    }
  };

  const toggleExpand = (id: string) => setExpandedLog(expandedLog === id ? null : id);

  return (
    <div className="system-logs-container">
      <header className="system-logs-header">
        <div>
          <h1>{t('system_activity_logs')}</h1>
          <p className="subtitle">{t('audit_trail_subtitle')}</p>
        </div>
        <div className="header-actions">
          <button
            className="export-button"
            onClick={() => addLog({
              user: 'superadmin@system.com',
              action: 'Exported system logs',
              status: 'Success',
              ipAddress: '127.0.0.1',
              details: 'Superadmin exported logs to CSV'
            })}
          >
            <FiDownload className="icon" /> {t('export_logs')}
          </button>
        </div>
      </header>

      {/* Controls */}
      <div className="logs-controls">
        <div className="search-bar">
          <FiSearch className="search-icon" />
          <input type="text" placeholder={t('search_logs_placeholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="filter-group">
          <label htmlFor="log-filter"><FiFilter className="filter-icon" />{t('filter_by')}:</label>
          <select id="log-filter" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">{t('all_statuses')}</option>
            <option value="success">{t('success')}</option>
            <option value="error">{t('error')}</option>
            <option value="warning">{t('warning')}</option>
            <option value="info">{t('info')}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="logs-table">
        <div className="logs-header">
          <div className="header-cell timestamp"><FiClock className="header-icon" />{t('timestamp')}</div>
          <div className="header-cell user"><FiUser className="header-icon" />{t('user')}</div>
          <div className="header-cell action"><FiActivity className="header-icon" />{t('action')}</div>
          <div className="header-cell status">{t('status')}</div>
        </div>
        <div className="logs-body">
          {filteredLogs.length > 0 ? filteredLogs.map(log => (
            <div key={log.id} className={`logs-row ${log.status.toLowerCase()} ${expandedLog === log.id ? 'expanded' : ''}`} onClick={() => toggleExpand(log.id)}>
              <div className="row-main">
                <div className="cell timestamp">{log.timestamp}</div>
                <div className="cell user">{log.user}</div>
                <div className="cell action">{log.action}</div>
                <div className="cell status"><span className={`status-badge ${log.status.toLowerCase()}`}>{getStatusIcon(log.status)}{log.status}</span></div>
              </div>
              {expandedLog === log.id && (
                <div className="row-details">
                  {log.ipAddress && <div className="detail-item"><span className="detail-label">{t('ip_address')}:</span> <span className="detail-value">{log.ipAddress}</span></div>}
                  {log.details && <div className="detail-item"><span className="detail-label">{t('details')}:</span> <span className="detail-value">{log.details}</span></div>}
                </div>
              )}
            </div>
          )) : <div className="no-results">{t('no_log_entries')}</div>}
        </div>
      </div>

      <div className="logs-footer">
        <div className="results-count">{t('showing_entries', { shown: filteredLogs.length, total: logs.length })}</div>
      </div>
    </div>
  );
};

export default SystemLogs;
