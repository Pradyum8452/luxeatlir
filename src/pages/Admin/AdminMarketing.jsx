import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Send, Users, CheckCircle2, ShoppingBag, MapPin, Phone, Clock, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const AdminMarketing = () => {
  const [smsData, setSmsData] = useState(null);
  const [emailData, setEmailData] = useState(null);
  const [activeTab, setActiveTab] = useState('sms'); // 'sms' or 'email'
  
  // SMS Form State
  const [smsTitle, setSmsTitle] = useState('');
  const [smsSegment, setSmsSegment] = useState('Ordered Customers');
  const [smsText, setSmsText] = useState('Hi {name}, your Luxe Atelier order is packed and being dispatched via express courier!');
  const [smsSending, setSmsSending] = useState(false);

  // Email Form State
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSegment, setEmailSegment] = useState('Ordered Customers');
  const [emailHtml, setEmailHtml] = useState('<h2>Thank You For Your Order!</h2><p>Dear {name}, we appreciate your recent purchase at Luxe Atelier. Track your package live in your account portal.</p>');
  const [emailSending, setEmailSending] = useState(false);

  const { addToast } = useToast();

  const fetchData = () => {
    Promise.all([api.getSmsData(), api.getEmailData()]).then(([sRes, eRes]) => {
      if (sRes) setSmsData(sRes);
      if (eRes) setEmailData(eRes);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSendSms = async (e) => {
    e.preventDefault();
    if (!smsTitle || !smsText) return;
    setSmsSending(true);
    try {
      const res = await api.sendSms({ title: smsTitle, template_text: smsText, segment: smsSegment });
      if (res.success) {
        addToast(`Bulk SMS dispatched to ${res.sent_count} customers (${smsSegment})! Recipient logs recorded.`, 'success');
        setSmsTitle('');
        fetchData();
      } else {
        addToast(res.error || 'Failed to dispatch SMS', 'error');
      }
    } catch (e) {
      addToast('Error sending SMS campaign', 'error');
    } finally {
      setSmsSending(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!emailSubject || !emailHtml) return;
    setEmailSending(true);
    try {
      const res = await api.sendEmail({ subject: emailSubject, template_html: emailHtml, segment: emailSegment });
      if (res.success) {
        addToast(`Bulk Email dispatched to ${res.sent_count} customers (${emailSegment})! Recipient logs recorded.`, 'success');
        setEmailSubject('');
        fetchData();
      } else {
        addToast(res.error || 'Failed to dispatch email', 'error');
      }
    } catch (e) {
      addToast('Error sending Email campaign', 'error');
    } finally {
      setEmailSending(false);
    }
  };

  const applySmsTemplate = (type) => {
    if (type === 'ORDER_STATUS') {
      setSmsTitle('Order Dispatch Notification');
      setSmsText('Hi {name}, your Luxe Atelier order is out for delivery today! Track status live in your account portal.');
    } else if (type === 'VIP_SALE') {
      setSmsTitle('VIP Patron Exclusive Sale');
      setSmsText('Hi {name}, as a valued customer who ordered with us, enjoy 20% OFF our new Autumn drop with code FESTIVE20.');
    } else if (type === 'BACK_IN_STOCK') {
      setSmsTitle('Back in Stock Alert');
      setSmsText('Hi {name}, the Obsidian Heavyweight Tee is back in stock in all sizes! Order now at luxeatelier.com');
    }
  };

  const exportSmsLogsToExcel = () => {
    const logs = smsData?.logs || [];
    const rows = logs.map((l) => ({
      'Campaign Title': l.campaign_title,
      'Customer Name': l.customer_name,
      'Mobile Phone Number': l.phone,
      'Delivery Address': l.full_address,
      'SMS Text': l.message_text,
      'Dispatch Status': l.status,
      'Sent Timestamp': new Date(l.sent_at).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'SMS_RECIPIENT_LOGS');
    XLSX.writeFile(workbook, `luxe_atelier_sms_recipient_logs_${Date.now()}.xlsx`);
    addToast('Exported SMS recipient logs to Excel (.xlsx)', 'success');
  };

  const exportEmailLogsToExcel = () => {
    const logs = emailData?.logs || [];
    const rows = logs.map((l) => ({
      'Subject Line': l.campaign_subject,
      'Customer Name': l.customer_name,
      'Email Address': l.email,
      'Mobile Phone Number': l.phone,
      'Delivery Address': l.full_address,
      'Dispatch Status': l.status,
      'Sent Timestamp': new Date(l.sent_at).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'EMAIL_RECIPIENT_LOGS');
    XLSX.writeFile(workbook, `luxe_atelier_email_recipient_logs_${Date.now()}.xlsx`);
    addToast('Exported Email recipient logs to Excel (.xlsx)', 'success');
  };

  return (
    <div className="space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-800 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-serif">Customer Order Database Bulk SMS & Email Campaign Center</h2>
          <p className="text-xs text-gray-400 mt-0.5">Dispatch bulk SMS & Emails to customers who placed orders and track individual recipient logs with Phone & Address</p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gold-400 bg-gold-500/10 border border-gold-500/30 px-3 py-1.5 rounded-full font-mono">
          <ShoppingBag className="w-4 h-4 text-gold-500" />
          <span>Target Audience: {smsData?.customerCount || 12} Customers with Order History</span>
        </div>
      </div>

      {/* Main Tabs (SMS vs EMAIL) */}
      <div className="flex border-b border-obsidian-800 text-xs font-semibold uppercase tracking-wider space-x-6">
        <button
          onClick={() => setActiveTab('sms')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'sms' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Bulk SMS System & Recipient Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'email' ? 'border-gold-500 text-gold-400 font-bold' : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Bulk Email System & Recipient Logs</span>
        </button>
      </div>

      {/* TAB 1: BULK SMS */}
      {activeTab === 'sms' && (
        <div className="space-y-8">
          
          {/* Dispatch Form */}
          <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
            <div className="flex items-center justify-between border-b border-obsidian-700 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dispatch Bulk SMS to Ordered Customers</h3>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                SMS API Active
              </span>
            </div>

            {/* Quick Templates */}
            <div className="space-y-1">
              <label className="text-[11px] text-gray-400 font-semibold uppercase">Quick Preset Templates:</label>
              <div className="flex flex-wrap gap-1.5">
                <button type="button" onClick={() => applySmsTemplate('ORDER_STATUS')} className="text-[10px] bg-obsidian-850 hover:bg-obsidian-800 text-gold-400 border border-gold-500/30 px-2.5 py-1 rounded-lg">Order Dispatch Alert</button>
                <button type="button" onClick={() => applySmsTemplate('VIP_SALE')} className="text-[10px] bg-obsidian-850 hover:bg-obsidian-800 text-gold-400 border border-gold-500/30 px-2.5 py-1 rounded-lg">VIP Patron 20% Sale</button>
                <button type="button" onClick={() => applySmsTemplate('BACK_IN_STOCK')} className="text-[10px] bg-obsidian-850 hover:bg-obsidian-800 text-gold-400 border border-gold-500/30 px-2.5 py-1 rounded-lg">Back in Stock Notification</button>
              </div>
            </div>

            <form onSubmit={handleSendSms} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Target Customer Segment *</label>
                  <select
                    value={smsSegment}
                    onChange={(e) => setSmsSegment(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                  >
                    <option value="Ordered Customers">Customers Who Have Placed Orders ({smsData?.customerCount || 12} recipients)</option>
                    <option value="VIP Customers">VIP High Spenders (&gt; ₹10,000 spend)</option>
                    <option value="All Registered">All Registered Customers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Campaign Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Autumn Shipping Alert"
                    value={smsTitle}
                    onChange={(e) => setSmsTitle(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">SMS Message Template (Use &#123;name&#125; for personalization) *</label>
                <textarea
                  required
                  rows={3}
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white font-mono rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                disabled={smsSending}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
              >
                <Send className="w-4 h-4" />
                <span>{smsSending ? 'Dispatching...' : `Dispatch Bulk SMS & Log Recipient Details (${smsSegment})`}</span>
              </button>
            </form>
          </div>

          {/* DETAILED SMS RECIPIENT LOGS TABLE */}
          <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden space-y-4">
            <div className="p-4 border-b border-obsidian-700 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">SMS Sent Recipient Log Database ({smsData?.logs?.length || 0} Entries)</h3>
                <p className="text-[11px] text-gray-400">Shows recipient customer names, phone numbers, delivery addresses, and dispatch status</p>
              </div>

              <button
                onClick={exportSmsLogsToExcel}
                className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export SMS Logs to Excel</span>
              </button>
            </div>

            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
                <tr>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Recipient Name</th>
                  <th className="py-3 px-4">Mobile Phone Number</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">SMS Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {smsData?.logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-obsidian-850/50">
                    <td className="py-3.5 px-4 font-bold text-white">{log.campaign_title}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-200">{log.customer_name}</td>
                    <td className="py-3.5 px-4 font-mono text-gold-400">{log.phone}</td>
                    <td className="py-3.5 px-4 text-gray-300 max-w-xs">{log.full_address}</td>
                    <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate">{log.message_text}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-500">{new Date(log.sent_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 2: BULK EMAIL */}
      {activeTab === 'email' && (
        <div className="space-y-8">
          
          {/* Dispatch Form */}
          <div className="glass-panel p-6 rounded-2xl border border-obsidian-700 space-y-4">
            <div className="flex items-center justify-between border-b border-obsidian-700 pb-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Dispatch Bulk Email to Ordered Customers</h3>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                SMTP API Active
              </span>
            </div>

            <form onSubmit={handleSendEmail} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 mb-1">Target Customer Segment *</label>
                  <select
                    value={emailSegment}
                    onChange={(e) => setEmailSegment(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                  >
                    <option value="Ordered Customers">Customers Who Have Placed Orders ({smsData?.customerCount || 12} recipients)</option>
                    <option value="VIP Customers">VIP High Spenders (&gt; ₹10,000 spend)</option>
                    <option value="All Subscribers">All Newsletter Subscribers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">Email Subject Line *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Order Confirmation & Dispatch Notice"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full bg-obsidian-850 border border-obsidian-700 text-white rounded-xl p-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 mb-1">HTML Email Template *</label>
                <textarea
                  required
                  rows={3}
                  value={emailHtml}
                  onChange={(e) => setEmailHtml(e.target.value)}
                  className="w-full bg-obsidian-850 border border-obsidian-700 text-white font-mono rounded-xl p-3"
                />
              </div>

              <button
                type="submit"
                disabled={emailSending}
                className="w-full bg-gold-500 hover:bg-gold-400 text-obsidian-950 font-bold text-xs py-3.5 rounded-xl uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl"
              >
                <Send className="w-4 h-4" />
                <span>{emailSending ? 'Dispatching...' : `Dispatch Email & Log Recipient Details (${emailSegment})`}</span>
              </button>
            </form>
          </div>

          {/* DETAILED EMAIL RECIPIENT LOGS TABLE */}
          <div className="glass-panel rounded-2xl border border-obsidian-700 overflow-hidden space-y-4">
            <div className="p-4 border-b border-obsidian-700 flex justify-between items-center">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Email Sent Recipient Log Database ({emailData?.logs?.length || 0} Entries)</h3>
                <p className="text-[11px] text-gray-400">Shows recipient customer names, email addresses, phone numbers, delivery addresses, and dispatch status</p>
              </div>

              <button
                onClick={exportEmailLogsToExcel}
                className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-400 border border-gold-500/30 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export Email Logs to Excel</span>
              </button>
            </div>

            <table className="w-full text-xs text-left text-gray-300">
              <thead className="bg-obsidian-900 text-gold-400 font-semibold uppercase tracking-wider border-b border-obsidian-700">
                <tr>
                  <th className="py-3 px-4">Subject Line</th>
                  <th className="py-3 px-4">Recipient Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Phone Number</th>
                  <th className="py-3 px-4">Delivery Address</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Sent Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-obsidian-800">
                {emailData?.logs?.map((log) => (
                  <tr key={log.id} className="hover:bg-obsidian-850/50">
                    <td className="py-3.5 px-4 font-bold text-white">{log.campaign_subject}</td>
                    <td className="py-3.5 px-4 font-semibold text-gray-200">{log.customer_name}</td>
                    <td className="py-3.5 px-4 font-mono text-gold-400">{log.email}</td>
                    <td className="py-3.5 px-4 font-mono text-gray-300">{log.phone}</td>
                    <td className="py-3.5 px-4 text-gray-300 max-w-xs">{log.full_address}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-gray-500">{new Date(log.sent_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
