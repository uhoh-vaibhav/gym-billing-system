# Royal Fitness Club — Billing System

A full-stack web billing system for managing gym memberships and invoices.

## Tech Stack
- **Backend**: Node.js + Express
- **Database**: JSON file-based persistence (lowdb) — no setup needed
- **Frontend**: Vanilla HTML/CSS/JS — no build step required

## Getting Started

### Requirements
- Node.js v18 or higher

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start
```

Then open your browser at: **http://localhost:3000**

## Features

### Dashboard
- Live stats: total members, active members, monthly revenue
- Total invoices, amount collected, outstanding balance
- Recent members and invoices at a glance

### Members
- Add, edit, and delete members
- Toggle Active / Inactive status
- Three membership plans:
  - Monthly — ₹2299/month
  - Quarterly — ₹5799
  - Annual — ₹11,999 

### New Invoice
- Generate invoices for any active member
- Apply GST (%) and discounts (₹)
- Set payment status: Paid / Pending / Overdue
- Preview invoice before saving
- Save to billing history

### Billing History
- View all past invoices
- Update payment status inline
- Delete invoices
- Revenue summary: collected vs outstanding

## Data Storage
All data is saved to `db/data.json` automatically. No database server required.
To back up your data, just copy `db/data.json`.

## Project Structure
```
royal-fitness/
├── server.js          # Express API server
├── public/
│   └── index.html     # Frontend application
├── db/
│   └── data.json      # Persistent data store
└── package.json
```

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /api/members | List all members |
| POST | /api/members | Add a member |
| PUT | /api/members/:id | Update a member |
| DELETE | /api/members/:id | Delete a member |
| GET | /api/invoices | List all invoices |
| POST | /api/invoices | Create an invoice |
| PUT | /api/invoices/:id | Update invoice status |
| DELETE | /api/invoices/:id | Delete an invoice |
| GET | /api/stats | Get dashboard statistics |
"# gym-billing-system" 
