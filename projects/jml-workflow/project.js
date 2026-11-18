const flows = {
  joiner: { kicker:'NEW JOINER', title:'Prepare a user for day one', description:'Create the access, device, and handoff tasks required for a new starter.', tasks:['Confirm manager and start date','Create identity and assign required groups','Prepare encrypted device and standard apps','Validate MFA and collaboration access','Record handoff and owner'], audit:'New starter workflow created for synthetic user A. Morgan.' },
  mover: { kicker:'ROLE CHANGE', title:'Move access with the role', description:'Update access deliberately when a user changes team, manager, or responsibility.', tasks:['Confirm new role and effective date','Review old group and application access','Apply new access profile and manager','Reconcile device and software needs','Record approval and change evidence'], audit:'Role-change workflow created for synthetic user A. Morgan.' },
  leaver: { kicker:'ACCESS OFF', title:'Close the loop for a leaver', description:'Remove access promptly, recover equipment, and leave a clear record for audit.', tasks:['Confirm last working day and owner','Disable identity and revoke active sessions','Remove group, application, and MFA access','Recover and quarantine assigned device','Record closure and evidence'], audit:'Offboarding workflow created for synthetic user A. Morgan.' }
};
let activeFlow = 'joiner';
let completed = new Set();
const $ = id => document.getElementById(id);
function render() {
  const flow = flows[activeFlow];
  $('flowKicker').textContent = flow.kicker; $('flowTitle').textContent = flow.title; $('flowDescription').textContent = flow.description;
  $('taskList').innerHTML = flow.tasks.map((task, index) => `<label class="ops-task ${completed.has(index) ? 'done' : ''}"><input type="checkbox" data-index="${index}" ${completed.has(index) ? 'checked' : ''} /> <span>${task}</span></label>`).join('');
  const total = flow.tasks.length; const done = completed.size; const percent = Math.round(done / total * 100);
  $('progressLabel').textContent = `${done} / ${total}`; $('progressBar').style.width = `${percent}%`; $('flowState').textContent = done === total ? 'READY TO CLOSE' : 'IN PROGRESS';
  $('auditTrail').innerHTML = `<div class="ops-audit-item"><time>NOW</time><span>${flow.audit}</span></div>${done ? `<div class="ops-audit-item"><time>UPDATE</time><span>${done} control${done === 1 ? '' : 's'} completed and visible to the next owner.</span></div>` : ''}`;
  document.querySelectorAll('.ops-task input').forEach(input => input.addEventListener('change', event => { const index = Number(event.target.dataset.index); event.target.checked ? completed.add(index) : completed.delete(index); render(); }));
}
document.querySelectorAll('.ops-tab').forEach(tab => tab.addEventListener('click', () => { activeFlow = tab.dataset.flow; completed = new Set(); document.querySelectorAll('.ops-tab').forEach(item => item.classList.toggle('active', item === tab)); render(); }));
$('resetButton').addEventListener('click', () => { completed = new Set(); render(); }); render();
