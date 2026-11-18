const devices = [
  { asset:'LT-1042', user:'A. Tan', os:'Windows 11', encryption:'On', checkin:'Today', status:'ready', reason:'Baseline, encryption, and check-in are current.' },
  { asset:'LT-1077', user:'M. Rahman', os:'Windows 10', encryption:'On', checkin:'Yesterday', status:'review', reason:'Windows 10 device needs migration sequencing.' },
  { asset:'MB-2031', user:'S. Lim', os:'macOS', encryption:'On', checkin:'Today', status:'ready', reason:'Ready for the refresh wave.' },
  { asset:'LT-1108', user:'J. Wong', os:'Windows 11', encryption:'Off', checkin:'Today', status:'blocked', reason:'Encryption must be enabled before deployment.' },
  { asset:'LT-1120', user:'R. Kumar', os:'Windows 10', encryption:'On', checkin:'12 days ago', status:'blocked', reason:'Device has not checked in recently.' },
  { asset:'MB-2054', user:'N. Goh', os:'macOS', encryption:'On', checkin:'Yesterday', status:'ready', reason:'Ready for the refresh wave.' },
  { asset:'LT-1156', user:'E. Lee', os:'Windows 11', encryption:'On', checkin:'3 days ago', status:'review', reason:'Check-in is older than the preferred window.' },
  { asset:'LT-1190', user:'K. Pillai', os:'Windows 10', encryption:'On', checkin:'Today', status:'review', reason:'Windows 10 device needs migration sequencing.' }
];
const $ = id => document.getElementById(id);
function statusLabel(status) { return status[0].toUpperCase() + status.slice(1); }
function visibleDevices() {
  const query = $('searchInput').value.trim().toLowerCase();
  const status = $('statusFilter').value;
  const os = $('osFilter').value;
  return devices.filter(device => (!query || `${device.asset} ${device.user}`.toLowerCase().includes(query)) && (status === 'all' || device.status === status) && (os === 'all' || device.os === os));
}
function render() {
  const counts = devices.reduce((all, item) => ({ ...all, [item.status]: all[item.status] + 1 }), { ready:0, review:0, blocked:0 });
  $('totalCount').textContent = devices.length; $('readyCount').textContent = counts.ready; $('reviewCount').textContent = counts.review; $('blockedCount').textContent = counts.blocked;
  $('deviceRows').innerHTML = visibleDevices().map(device => `<tr><td><strong>${device.asset}</strong></td><td>${device.user}</td><td>${device.os}</td><td>${device.encryption}</td><td>${device.checkin}</td><td><span class="ops-status ${device.status}">${statusLabel(device.status)}</span></td><td>${device.reason}</td></tr>`).join('') || '<tr><td colspan="7">No devices match this filter.</td></tr>';
}
function exportCsv() {
  const rows = [['Asset','Assigned user','OS','Encryption','Last check-in','Status','Reason'], ...visibleDevices().map(d => [d.asset,d.user,d.os,d.encryption,d.checkin,statusLabel(d.status),d.reason])];
  const csv = rows.map(row => row.map(value => `"${String(value).replaceAll('"','""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'endpoint-readiness-report.csv'; link.click(); URL.revokeObjectURL(url);
}
['searchInput','statusFilter','osFilter'].forEach(id => $(id).addEventListener('input', render)); $('exportButton').addEventListener('click', exportCsv); render();
