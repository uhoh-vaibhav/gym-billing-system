import express from 'express';
import cors from 'cors';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

// DB setup
const adapter = new JSONFile(join(__dirname, 'db/data.json'));
const defaultData = { members: [], invoices: [] };
const db = new Low(adapter, defaultData);
await db.read();

app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

// ── MEMBERS ──────────────────────────────────────────────

app.get('/api/members', async (req, res) => {
  await db.read();
  res.json(db.data.members);
});

app.post('/api/members', async (req, res) => {
  await db.read();
  const { name, phone, email, joinDate, plan, price } = req.body;
  if (!name || !phone || !plan) return res.status(400).json({ error: 'name, phone and plan required' });
  const member = { id: uuidv4(), name, phone, email: email || '', joinDate: joinDate || new Date().toISOString().split('T')[0], plan, price, status: 'Active', createdAt: new Date().toISOString() };
  db.data.members.push(member);
  await db.write();
  res.status(201).json(member);
});

app.put('/api/members/:id', async (req, res) => {
  await db.read();
  const idx = db.data.members.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Member not found' });
  db.data.members[idx] = { ...db.data.members[idx], ...req.body };
  await db.write();
  res.json(db.data.members[idx]);
});

app.delete('/api/members/:id', async (req, res) => {
  await db.read();
  const before = db.data.members.length;
  db.data.members = db.data.members.filter(m => m.id !== req.params.id);
  if (db.data.members.length === before) return res.status(404).json({ error: 'Not found' });
  await db.write();
  res.json({ ok: true });
});

// ── INVOICES ─────────────────────────────────────────────

app.get('/api/invoices', async (req, res) => {
  await db.read();
  res.json(db.data.invoices);
});

app.post('/api/invoices', async (req, res) => {
  await db.read();
  const { memberId, invoiceDate, dueDate, gstPct, discount, status, notes, subtotal, gstAmt, total } = req.body;
  const member = db.data.members.find(m => m.id === memberId);
  if (!member) return res.status(400).json({ error: 'Member not found' });
  const num = db.data.invoices.length + 1;
  const invoice = { id: uuidv4(), num, memberId, memberName: member.name, memberPhone: member.phone, memberPlan: member.plan, invoiceDate, dueDate, gstPct, discount, status, notes, subtotal, gstAmt, total, createdAt: new Date().toISOString() };
  db.data.invoices.push(invoice);
  await db.write();
  res.status(201).json(invoice);
});

app.put('/api/invoices/:id', async (req, res) => {
  await db.read();
  const idx = db.data.invoices.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Invoice not found' });
  db.data.invoices[idx] = { ...db.data.invoices[idx], ...req.body };
  await db.write();
  res.json(db.data.invoices[idx]);
});

app.delete('/api/invoices/:id', async (req, res) => {
  await db.read();
  const before = db.data.invoices.length;
  db.data.invoices = db.data.invoices.filter(i => i.id !== req.params.id);
  if (db.data.invoices.length === before) return res.status(404).json({ error: 'Not found' });
  await db.write();
  res.json({ ok: true });
});

// ── STATS ────────────────────────────────────────────────

app.get('/api/stats', async (req, res) => {
  await db.read();
  const members = db.data.members;
  const invoices = db.data.invoices;
  const active = members.filter(m => m.status === 'Active');
  const monthlyRev = active.reduce((s, m) => {
    const mo = m.plan === 'Monthly' ? m.price : m.plan === 'Quarterly' ? Math.round(m.price / 3) : Math.round(m.price / 12);
    return s + mo;
  }, 0);
  const collected = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.total, 0);
  const outstanding = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.total, 0);
  res.json({ totalMembers: members.length, activeMembers: active.length, monthlyRevenue: monthlyRev, totalInvoices: invoices.length, collected, outstanding });
});

app.listen(PORT, () => console.log(`Royal Fitness Club server running on http://localhost:${PORT}`));
