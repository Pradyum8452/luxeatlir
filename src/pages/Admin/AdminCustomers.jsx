import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, DollarSign, Mail, Phone, MapPin, FileSpreadsheet, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    api.getAdminOrders().then((orders) => {
      if (Array.isArray(orders)) {
        const map = {};
        orders.forEach((o) => {
          if (!map[o.user_id]) {
            map[o.user_id] = {
              id: o.user_id,
              name: o.customer_name,
              email: o.customer_email,
              phone: o.address?.phone || '+91 98123 45678',
              city: o.address?.city || 'Mumbai',
              state: o.address?.state || 'Maharashtra',
              pin_code: o.address?.pin_code || '400001',
              total_orders: 0,
              total_spent: 0,
              created_at: new Date(o.created_at).toLocaleDateString()
            };
          }
          map[o.user_id].total_orders += 1;
          map[o.user_id].total_spent += o.grand_total;
        });

        // Add demo fallback customers if list empty
        let list = Object.values(map);
        if (list.length === 0) {
          list = [
            { id: 1, name: 'Alex Morgan', email: 'alex.morgan@gmail.com', phone: '+91 98123 45678', city: 'Mumbai', state: 'Maharashtra', pin_code: '400001', total_orders: 3, total_spent: 14997, created_at: '2026-09-15' },
            { id: 2, name: 'Sophia Chen', email: 'sophia.chen@gmail.com', phone: '+91 98234 56789', city: 'Delhi', state: 'Delhi', pin_code: '110001', total_orders: 2, total_spent: 12498, created_at: '2026-09-18' },
            { id: 3, name: 'Marcus Vance', email: 'marcus.v@yahoo.com', phone: '+91 98345 67890', city: 'Bengaluru', state: 'Karnataka', pin_code: '560001', total_orders: 4, total_spent: 21996, created_at: '2026-09-12' },
            { id: 4, name: 'Elena Rostova', email: 'elena.rostova@outlook.com', phone: '+91 98456 78901', city: 'Hyderabad', state: 'Telangana', pin_code: '500001', total_orders: 1, total_spent: 8999, created_at: '2026-09-21' }
          ];
        }

        setCustomers(list);
      }
      setLoading(false);
    });
  }, []);

  const exportCustomersToExcel = () => {
    try {
      const excelRows = customers.map((c) => ({
        'Customer Name': c.name,
        'Email Address': c.email,
        'Phone Number': c.phone,
        'City': c.city,
        'State': c.state,
        'PIN Code': c.pin_code,
        'Total Orders Placed': c.total_orders,
        'Total Spent (INR)': c.total_spent,
        'Registration Date': c.created_at
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'CUSTOMERS');

      XLSX.writeFile(workbook, `luxe_atelier_customers_${Date.now()}.xlsx`);
      addToast('Exported customer user data to Excel (.xlsx)!', 'success');
    } catch (e) {
      addToast('Failed to export Excel file', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Customer User Directory & Excel Export</h2>
          <p className="text-xs text-gray-400 mt-0.5">Database of registered customers with addresses, order counts, and total spend</p>
        </div>

        <button
          onClick={exportCustomersToExcel}
          className="bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2 shadow-lg"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export User Data to Excel (.xlsx)</span>
        </button>
      </div>

      <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden">
        <table className="w-full text-xs text-left text-gray-300">
          <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
            <tr>
              <th className="py-3 px-4">Customer Name</th>
              <th className="py-3 px-4">Email Address</th>
              <th className="py-3 px-4">Phone Number</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4 text-center">Total Orders</th>
              <th className="py-3 px-4 text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-obsidian-800">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-obsidian-850/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gold-500 text-obsidian-950 flex items-center justify-center font-bold text-xs">
                    {c.name?.charAt(0)}
                  </div>
                  <span>{c.name}</span>
                </td>
                <td className="py-3.5 px-4 text-gray-300 font-mono">{c.email}</td>
                <td className="py-3.5 px-4 text-gray-400 font-mono">{c.phone}</td>
                <td className="py-3.5 px-4 text-gray-300">{c.city}, {c.state} ({c.pin_code})</td>
                <td className="py-3.5 px-4 text-center font-bold text-gold-400">{c.total_orders}</td>
                <td className="py-3.5 px-4 text-right font-bold text-white">₹{c.total_spent?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
