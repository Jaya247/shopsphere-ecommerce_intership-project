import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import {
  FaMapMarkerAlt,
  FaFilePdf,
  FaExchangeAlt,
  FaUndo,
  FaTimes,
  FaCheck,
  FaTruck,
  FaUserCheck,
  FaClock,
} from "react-icons/fa";
import API from "../api/axios";

// Checkpoint cities list for simulation path
const checkpoints = [
  { name: "Order Placed", desc: "Order registered successfully", icon: FaClock, pct: 10 },
  { name: "Warehouse", desc: "Packed & verified weight", icon: FaCheck, pct: 40 },
  { name: "In Transit", desc: "Outbound shipment scan", icon: FaTruck, pct: 75 },
  { name: "Delivered", desc: "Received at doorstep", icon: FaUserCheck, pct: 100 },
];

const getSimulatedProgress = (status) => {
  if (status === "Pending") return 10;
  if (status === "Processing") return 40;
  if (status === "Shipped") return 75;
  if (status === "Delivered") return 100;
  return 0;
};

function OrderDetails() {
  const { id } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states for return/refund requests
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnType, setReturnType] = useState("Return");
  const [returnReason, setReturnReason] = useState("");
  const [returnMockImage, setReturnMockImage] = useState("");

  const isAdminView = location.pathname.startsWith("/admin");

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/orders/${id}`);
      setOrder(data.order);
    } catch (error) {
      console.log(error);
      toast.error("Unable to load order details");
    } finally {
      setLoading(false);
    }
  };

  // 1. GST Invoice PDF Generation
  const downloadInvoice = () => {
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
        `${order.shippingAddress?.city}, ${order.shippingAddress?.state} - ${order.shippingAddress?.pincode}`,
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
      doc.text(`₹${Number(order.itemsPrice).toLocaleString("en-IN")}`, 170, y);
      
      y += 6;
      doc.text("Shipping & Handling:", 120, y);
      doc.text(`₹${Number(order.shippingPrice).toLocaleString("en-IN")}`, 170, y);
      
      y += 6;
      doc.text("CGST (9% included):", 120, y);
      doc.text(`₹${(Number(order.taxPrice) / 2).toLocaleString("en-IN")}`, 170, y);
      
      y += 6;
      doc.text("SGST (9% included):", 120, y);
      doc.text(`₹${(Number(order.taxPrice) / 2).toLocaleString("en-IN")}`, 170, y);

      y += 4;
      doc.line(120, y, 196, y);
      y += 6;

      // Grand Total
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Grand Total:", 120, y);
      doc.text(`₹${Number(order.totalPrice).toLocaleString("en-IN")}`, 170, y);

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

  // 2. Submit Return Request (Customer)
  const submitReturnRequest = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post(`/orders/${id}/return`, {
        action: returnType,
        reason: returnReason,
        images: returnMockImage ? [returnMockImage] : [],
      });
      toast.success(data.message);
      setShowReturnModal(false);
      fetchOrder();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  // 3. Process Return / Exchange Request (Admin / Seller)
  const handleProcessReturn = async (status) => {
    try {
      const { data } = await API.put(`/orders/${id}/return-process`, { status });
      toast.success(data.message);
      fetchOrder();
    } catch (error) {
      console.error(error);
      toast.error("Unable to process return request");
    }
  };

  // 4. Process Refund Request (Admin / Seller)
  const handleProcessRefund = async (status) => {
    try {
      const { data } = await API.put(`/orders/${id}/refund-process`, { status });
      toast.success(data.message);
      fetchOrder();
    } catch (error) {
      console.error(error);
      toast.error("Unable to process refund request");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-350">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center text-red-500 text-2xl font-bold">
          Order Not Found 😔
        </div>
      </div>
    );
  }

  const progressPct = getSimulatedProgress(order.status);

  // Calculate unique deterministic expected delivery date within 5 days based on order ID hex seed
  const getExpectedDelivery = () => {
    if (!order || !order._id || !order.createdAt) return null;
    const hex = order._id.substring(18, 24);
    const numericSeed = parseInt(hex, 16) || 0;
    const daysToAdd = (numericSeed % 4) + 1; // deterministically 1 to 4 days
    const hourOfDelivery = (numericSeed % 12) + 9; // deterministically 9 AM to 8 PM

    const orderDate = new Date(order.createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(orderDate.getDate() + daysToAdd);
    deliveryDate.setHours(hourOfDelivery, 0, 0, 0);

    return {
      dateString: deliveryDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      timeString: deliveryDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const expectedDelivery = getExpectedDelivery();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-[80vh] transition duration-300 text-slate-800 dark:text-slate-200">

      {/* Header section with Invoice download button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
            Order Panel
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Invoice tracking, returns processing, and delivery markers
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={downloadInvoice}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white px-5 py-3 rounded-xl font-bold transition shadow-md cursor-pointer"
          >
            <FaFilePdf size={16} /> GST Invoice PDF
          </button>
          <Link
            to={isAdminView ? "/admin/orders" : "/orders"}
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold transition shadow"
          >
            Back
          </Link>
        </div>
      </div>

      {/* Delivery tracking visual map */}
      {order.status !== "Cancelled" && (
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl p-6 shadow-md mb-10 transition">
          <h2 className="text-lg font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" /> Simulated Live Delivery Tracking
          </h2>

          <div className="relative pt-6 pb-12 px-4 max-w-4xl mx-auto">
            {/* Progress line background */}
            <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-100 dark:bg-slate-800 rounded -translate-y-1/2"></div>
            
            {/* Active progress line */}
            <div
              className="absolute top-1/2 left-4 h-1.5 bg-gradient-to-r from-cyan-500 to-indigo-500 rounded -translate-y-1/2 transition-all duration-500"
              style={{ width: `calc(${progressPct}% - 32px)` }}
            ></div>

            {/* Checkpoint nodes */}
            <div className="relative flex justify-between">
              {checkpoints.map((cp, idx) => {
                const isActive = progressPct >= cp.pct;
                const Icon = cp.icon;
                return (
                  <div key={idx} className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition duration-300 shadow-md ${
                        isActive
                          ? "bg-cyan-500 text-slate-950 border-cyan-300 dark:border-cyan-700"
                          : "bg-white dark:bg-slate-850 text-slate-400 border-gray-100 dark:border-slate-800"
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="absolute top-14 text-center w-28 -translate-x-0">
                      <p className={`font-bold text-xs ${isActive ? "text-cyan-500" : "text-slate-400"}`}>
                        {cp.name}
                      </p>
                      <p className="text-[10px] text-slate-450 dark:text-slate-500 mt-0.5 leading-tight">
                        {cp.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main details grid */}
      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          {/* Return & Refund request panels */}
          {order.returnRequest && order.returnRequest.status && order.returnRequest.status !== "None" && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-orange-700 dark:text-orange-400 flex items-center gap-2">
                <FaUndo size={16} /> Return / Exchange Status
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="mb-2"><strong>Requested Action:</strong> {order.returnRequest.action}</p>
                  <p className="mb-2"><strong>Reason:</strong> {order.returnRequest.reason}</p>
                  <p><strong>Status:</strong> <span className="font-extrabold text-orange-600 uppercase">{order.returnRequest.status}</span></p>
                </div>
                {order.returnRequest.images?.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Submitted Product Images:</p>
                    <img
                      src={order.returnRequest.images[0]}
                      alt="Return Mock File"
                      className="w-24 h-24 object-cover border rounded-xl"
                      onError={(e) => { e.target.src = "https://placehold.co/150?text=No+Image"; }}
                    />
                  </div>
                )}
              </div>

              {/* Admin return processing buttons */}
              {isAdminView && order.returnRequest.status === "Requested" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleProcessReturn("Approved")}
                    className="flex items-center gap-1.5 bg-green-600 hover:bg-green-550 text-white px-4 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    <FaCheck size={10} /> Approve Return
                  </button>
                  <button
                    onClick={() => handleProcessReturn("Completed")}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-550 text-white px-4 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    <FaExchangeAlt size={10} /> Mark Return Completed
                  </button>
                  <button
                    onClick={() => handleProcessReturn("Rejected")}
                    className="flex items-center gap-1.5 bg-red-600 hover:bg-red-550 text-white px-4 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    <FaTimes size={10} /> Reject Request
                  </button>
                </div>
              )}
            </div>
          )}

          {order.refundRequest && order.refundRequest.status && order.refundRequest.status !== "None" && (
            <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/50 rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-purple-700 dark:text-purple-400 flex items-center gap-2">
                <FaRupeeSign size={16} /> Refund details (Razorpay Mocked)
              </h2>
              <p className="text-sm mb-2"><strong>Refund Request Status:</strong> <span className="font-extrabold text-purple-600 dark:text-purple-400 uppercase">{order.refundRequest.status}</span></p>
              {order.refundRequest.reason && <p className="text-sm mb-2"><strong>Reason:</strong> {order.refundRequest.reason}</p>}
              {order.refundRequest.refundId && <p className="text-sm font-mono text-xs"><strong>Razorpay Refund Transaction ID:</strong> {order.refundRequest.refundId}</p>}

              {/* Admin refund processing buttons */}
              {isAdminView && order.refundRequest.status === "Requested" && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleProcessRefund("Approved")}
                    className="bg-green-600 hover:bg-green-550 text-white px-4 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    Approve Refund
                  </button>
                  <button
                    onClick={() => handleProcessRefund("Refunded")}
                    className="bg-purple-600 hover:bg-purple-550 text-white px-4 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    Process Razorpay Refund
                  </button>
                  <button
                    onClick={() => handleProcessRefund("Rejected")}
                    className="bg-red-600 hover:bg-red-550 text-white px-4 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
                  >
                    Reject Refund
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Customer info */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow p-6 transition">
            <h2 className="text-2xl font-bold mb-5 text-slate-800 dark:text-white">
              Customer Details
            </h2>
            <p className="mb-3 text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white mr-1.5">Name :</strong>{order.user?.name}</p>
            <p className="mb-3 text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white mr-1.5">Email :</strong>{order.user?.email}</p>
            <p className="text-slate-700 dark:text-slate-300"><strong className="text-slate-900 dark:text-white mr-1.5">Phone :</strong>{order.shippingAddress?.phone}</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl shadow p-6 transition">
            <h2 className="text-2xl font-bold mb-5 text-slate-800 dark:text-white">
              Shipping Address
            </h2>
            <div className="text-slate-700 dark:text-slate-300 space-y-1">
              <p className="font-bold text-slate-900 dark:text-white">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.address}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p className="font-semibold">{order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Ordered Products list */}
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl shadow p-6 transition">
            <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
              Ordered Products
            </h2>
            <div className="space-y-5">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex gap-5 border-b border-gray-100 dark:border-slate-800 pb-5 last:border-b-0 last:pb-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-contain bg-gray-50 dark:bg-slate-800 border dark:border-slate-700 rounded-xl p-2 shrink-0"
                    onError={(e) => { e.target.src = "https://placehold.co/150?text=No+Image"; }}
                  />
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-slate-850 dark:text-white truncate">{item.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Quantity : {item.quantity}</p>
                    <p className="text-cyan-600 dark:text-cyan-400 font-extrabold mt-2 text-base">₹{Number(item.price).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION: Order summary & Action buttons */}
        <div>
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-855 rounded-2xl shadow-xl p-6 sticky top-24 transition space-y-6">
            
            <div>
              <h2 className="text-2xl font-bold mb-5 text-slate-850 dark:text-white border-b border-gray-150 dark:border-slate-800 pb-3">
                Order Summary
              </h2>

              <div className="space-y-4 text-sm text-slate-650 dark:text-slate-350">
                <p>
                  <strong className="text-slate-850 dark:text-white block text-xs uppercase tracking-wider mb-1">Order ID</strong>
                  <span className="font-mono text-xs break-all">{order._id}</span>
                </p>
                <p>
                  <strong className="text-slate-850 dark:text-white block text-xs uppercase tracking-wider mb-1">Order Date</strong>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                </p>
                <p>
                  <strong className="text-slate-855 dark:text-white block text-xs uppercase tracking-wider mb-1">Payment Method</strong>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{order.paymentMethod}</span>
                </p>
                <p>
                  <strong className="text-slate-855 dark:text-white block text-xs uppercase tracking-wider mb-1">Payment Status</strong>
                  <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${order.isPaid ? "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400"}`}>{order.isPaid ? "Paid" : "Unpaid"}</span>
                </p>
                <p>
                  <strong className="text-slate-855 dark:text-white block text-xs uppercase tracking-wider mb-1">Order Status</strong>
                  <span className="font-extrabold text-blue-600 dark:text-cyan-400 text-sm">{order.status}</span>
                </p>
                {order.status !== "Delivered" && order.status !== "Cancelled" && expectedDelivery && (
                  <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-100 dark:border-cyan-900/50 rounded-xl p-3.5 mt-4 text-xs">
                    <p className="text-slate-500 dark:text-slate-400 font-bold mb-1">🚀 Expected Delivery:</p>
                    <p className="font-extrabold text-cyan-600 dark:text-cyan-400 text-sm">
                      {expectedDelivery.dateString} at {expectedDelivery.timeString}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-gray-150 dark:border-slate-800" />

            <div className="space-y-3 text-slate-650 dark:text-slate-350 text-sm">
              <div className="flex justify-between">
                <span>Items Price</span>
                <span className="font-semibold text-slate-850 dark:text-slate-205">₹{Number(order.itemsPrice).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold text-slate-850 dark:text-slate-205">₹{Number(order.shippingPrice).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-semibold text-slate-850 dark:text-slate-205">₹{Number(order.taxPrice).toLocaleString("en-IN")}</span>
              </div>
              <hr className="border-gray-150 dark:border-slate-800" />
              <div className="flex justify-between text-2xl font-extrabold text-slate-800 dark:text-white">
                <span>Total</span>
                <span className="text-cyan-600 dark:text-cyan-400">₹{Number(order.totalPrice).toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Customer order return / cancellation options */}
            {!isAdminView && order.status !== "Cancelled" && (
              <div className="pt-4 border-t border-gray-150 dark:border-slate-800">
                {order.status === "Delivered" ? (
                  (!order.returnRequest || order.returnRequest.status === "None") && (
                    <button
                      onClick={() => setShowReturnModal(true)}
                      className="w-full bg-orange-600 hover:bg-orange-550 text-white py-3 rounded-xl font-bold transition shadow cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <FaUndo size={14} /> Return / Exchange Item
                    </button>
                  )
                ) : (
                  order.status === "Pending" && (
                    <button
                      onClick={async () => {
                        const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
                        if (!confirmCancel) return;
                        try {
                          await API.post(`/orders/${id}/return`, { action: "Cancel", reason: "Cancelled by buyer" });
                          toast.success("Order cancelled successfully");
                          fetchOrder();
                        } catch (err) {
                          toast.error("Failed to cancel order");
                        }
                      }}
                      className="w-full bg-red-600 hover:bg-red-550 text-white py-3 rounded-xl font-bold transition shadow cursor-pointer text-center flex items-center justify-center gap-2"
                    >
                      <FaTimes size={14} /> Cancel Order
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowReturnModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-slate-850 dark:text-white">Request Return / Exchange</h2>
            
            <form onSubmit={submitReturnRequest} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-350">Select Action</label>
                <select
                  value={returnType}
                  onChange={(e) => setReturnType(e.target.value)}
                  className="w-full border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 font-medium"
                >
                  <option value="Return">Refund Return</option>
                  <option value="Exchange">Exchange Product</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-350">Reason for Request</label>
                <textarea
                  required
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  placeholder="e.g. Size mismatch, defective piece, incorrect brand..."
                  className="w-full border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 h-24 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-350">Product Image URL (Optional)</label>
                <input
                  type="text"
                  value={returnMockImage}
                  onChange={(e) => setReturnMockImage(e.target.value)}
                  placeholder="e.g. https://placehold.co/400.png"
                  className="w-full border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-855 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-600 hover:bg-cyan-550 text-white font-bold py-3 rounded-xl transition cursor-pointer"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default OrderDetails;