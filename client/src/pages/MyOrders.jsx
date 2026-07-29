import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import { FaFilePdf, FaTruck } from "react-icons/fa";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loginUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      if (!loginUser?._id) {
        setOrders([]);
        return;
      }

      const { data } = await API.get(`/orders/my-orders/${loginUser._id}`);
      setOrders(data.orders || []);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load orders");
    } finally {
      setLoading(false);
    }
  };

  // GST Invoice PDF Downloader
  const downloadListInvoice = (order) => {
    if (!order) return;
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 40, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(24);
      doc.text("SHOPSPHERE RETAILS", 14, 25);
      
      doc.setFontSize(9);
      doc.setFont("Helvetica", "normal");
      doc.text("TAX INVOICE / BILL OF SUPPLY", 145, 18);
      doc.text("GSTIN: 07AAACS9911A1Z8", 145, 24);
      doc.text("CIN: L72200DL2026PLC09811", 145, 30);

      // Customer and Order Details
      doc.setTextColor(15, 23, 42);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Billed & Shipped To:", 14, 52);
      
      doc.setFont("Helvetica", "normal");
      doc.text(order.shippingAddress?.fullName || "Guest", 14, 58);
      doc.text(order.shippingAddress?.address || "", 14, 64);
      doc.text(
        `${order.shippingAddress?.city || ""}, ${order.shippingAddress?.state || ""} - ${order.shippingAddress?.pincode || ""}`,
        14,
        70
      );
      doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 14, 76);

      // Invoice metadata (Right column)
      doc.setFont("Helvetica", "bold");
      doc.text("Invoice Details:", 120, 52);
      doc.setFont("Helvetica", "normal");
      doc.text(`Invoice ID: INV-${order._id.substring(0, 8).toUpperCase()}`, 120, 58);
      doc.text(`Order ID: ${order._id}`, 120, 64);
      doc.text(`Invoice Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`, 120, 70);
      doc.text(`Payment: ${order.paymentMethod} (${order.isPaid ? "Paid" : "Unpaid"})`, 120, 76);

      // Table Header
      doc.setFillColor(241, 245, 249); // slate-100
      doc.rect(14, 86, 182, 8, "F");
      doc.setFont("Helvetica", "bold");
      doc.text("Product Description", 16, 91.5);
      doc.text("Qty", 120, 91.5);
      doc.text("Price (INR)", 140, 91.5);
      doc.text("Total (INR)", 170, 91.5);

      // Table Rows
      doc.setFont("Helvetica", "normal");
      let y = 100;
      order.orderItems.forEach((item) => {
        const truncatedName = item.name.length > 55 ? item.name.substring(0, 52) + "..." : item.name;
        doc.text(truncatedName, 16, y);
        doc.text(item.quantity.toString(), 122, y);
        doc.text(Number(item.price).toLocaleString("en-IN"), 140, y);
        doc.text((item.price * item.quantity).toLocaleString("en-IN"), 170, y);
        y += 8;
      });

      doc.line(14, y - 2, 196, y - 2);
      y += 4;

      // Calculations block
      doc.setFontSize(9);
      doc.text("Subtotal:", 120, y);
      doc.text(`₹${Number(order.itemsPrice || 0).toLocaleString("en-IN")}`, 170, y);
      
      y += 6;
      doc.text("Shipping & Handling:", 120, y);
      doc.text(`₹${Number(order.shippingPrice || 0).toLocaleString("en-IN")}`, 170, y);
      
      y += 6;
      doc.text("CGST (9% included):", 120, y);
      doc.text(`₹${(Number(order.taxPrice || 0) / 2).toLocaleString("en-IN")}`, 170, y);
      
      y += 6;
      doc.text("SGST (9% included):", 120, y);
      doc.text(`₹${(Number(order.taxPrice || 0) / 2).toLocaleString("en-IN")}`, 170, y);

      y += 4;
      doc.line(120, y, 196, y);
      y += 6;

      // Grand Total
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Grand Total:", 120, y);
      doc.text(`₹${Number(order.totalPrice || 0).toLocaleString("en-IN")}`, 170, y);

      // Bottom Declarations
      y += 25;
      doc.setFont("Helvetica", "italic");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text("Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.", 14, y);
      
      y += 4;
      doc.text("This is a computer generated document, hence signature is not required.", 14, y);

      doc.save(`GST_Invoice_${order._id.substring(0, 8).toUpperCase()}.pdf`);
      toast.success("GST Invoice downloaded successfully");
    } catch (e) {
      console.error(e);
      toast.error("Unable to generate PDF invoice");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-350 font-sans">Loading Orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 transition duration-300">
        <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white">No Orders Found 📦</h1>
        <p className="text-slate-450 dark:text-slate-500 mt-2 text-sm font-semibold">Place your first order to get started!</p>
        <Link
          to="/products"
          className="mt-6 bg-cyan-600 hover:bg-cyan-550 text-white font-bold px-6 py-3 rounded-xl transition shadow text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen text-slate-800 dark:text-slate-200 transition duration-300">
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white">My Orders</h1>
        <p className="text-slate-400 mt-1 text-sm font-semibold">
          View shipment status, track delivery checkpoints, and download official bills
        </p>
      </div>

      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6 transition duration-300"
          >
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-850 dark:text-white">Order Reference</h2>
                <p className="font-mono text-xs text-slate-400 mt-0.5 break-all">{order._id}</p>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2 mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <p>Order Date: <span className="text-slate-750 dark:text-slate-200 font-bold">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span></p>
                  <p>Payment Mode: <span className="text-slate-750 dark:text-slate-200 font-bold">{order.paymentMethod}</span></p>
                  <p>Total Paid: <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">₹{Number(order.totalPrice).toLocaleString("en-IN")}</span></p>
                </div>
              </div>

              <div className="self-start md:self-auto">
                <span
                  className={`px-4 py-1.5 rounded-full text-white font-extrabold text-xs uppercase ${
                    order.status === "Pending"
                      ? "bg-yellow-500"
                      : order.status === "Processing"
                      ? "bg-blue-500"
                      : order.status === "Shipped"
                      ? "bg-purple-600"
                      : order.status === "Delivered"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            <hr className="border-gray-100 dark:border-slate-850 my-6" />

            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Items in Order</h3>

            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-contain bg-gray-50 dark:bg-slate-850 border dark:border-slate-800 rounded-xl p-1.5 shrink-0"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/150";
                    }}
                  />

                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Quantity: {item.quantity}</p>
                    <p className="text-cyan-600 dark:text-cyan-400 font-bold text-xs mt-0.5">₹{Number(item.price).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions Footer inside card */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-slate-850 flex flex-wrap gap-3">
              <Link
                to={`/orders/${order._id}`}
                className="bg-cyan-600 hover:bg-cyan-550 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 cursor-pointer"
              >
                <FaTruck size={12} /> Track & Order Panel
              </Link>
              <button
                onClick={() => downloadListInvoice(order)}
                className="bg-red-600 hover:bg-red-550 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow flex items-center gap-2 cursor-pointer"
              >
                <FaFilePdf size={12} /> Download Bill PDF
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}

export default MyOrders;