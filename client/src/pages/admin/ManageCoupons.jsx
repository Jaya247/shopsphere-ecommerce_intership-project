import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash, FaPlus, FaTicketAlt } from "react-icons/fa";
import API from "../../api/axios";

function ManageCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("Percentage");
  const [discountValue, setDiscountValue] = useState("");
  const [minPurchase, setMinPurchase] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/coupons");
      setCoupons(data.coupons || []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load coupons list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!code || !expiryDate) {
      toast.error("Coupon Code and Expiry Date are required");
      return;
    }

    try {
      const { data } = await API.post("/coupons", {
        code,
        discountType,
        discountValue: discountType === "BOGO" ? 0 : Number(discountValue),
        minPurchase: Number(minPurchase) || 0,
        expiryDate,
      });

      toast.success(data.message);
      setCode("");
      setDiscountValue("");
      setMinPurchase("");
      setExpiryDate("");
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleDeleteCoupon = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this coupon?");
    if (!confirmDelete) return;

    try {
      const { data } = await API.delete(`/coupons/${id}`);
      toast.success(data.message);
      fetchCoupons();
    } catch (error) {
      console.error(error);
      toast.error("Unable to delete coupon");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 transition duration-300">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-slate-700 dark:text-slate-350">Loading Coupons Engine...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 min-h-screen text-slate-800 dark:text-slate-200 transition duration-300">
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-850 dark:text-white flex items-center gap-3">
          <FaTicketAlt className="text-cyan-500" /> Coupon Engine
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          Create percentage discounts, flat cashbacks, buy-one-get-one deals, and set shopping limit thresholds
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Create Coupon Form */}
        <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-5 text-slate-800 dark:text-white flex items-center gap-2">
            <FaPlus className="text-cyan-500" /> Create Coupon
          </h2>

          <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs font-semibold">
            
            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Coupon Code (e.g. SAVE30)</label>
              <input
                required
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="PROMOCODE"
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 text-sm font-bold uppercase"
              />
            </div>

            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-855 rounded-xl p-2.5 text-sm"
              >
                <option value="Percentage">Percentage Discount (%)</option>
                <option value="Flat">Flat Cash Discount (₹)</option>
                <option value="BOGO">Buy One Get One Free (BOGO)</option>
              </select>
            </div>

            {discountType !== "BOGO" && (
              <div>
                <label className="block text-slate-650 dark:text-slate-350 mb-1">
                  Discount Value ({discountType === "Percentage" ? "%" : "₹"})
                </label>
                <input
                  required
                  type="number"
                  min="1"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === "Percentage" ? "30" : "150"}
                  className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Minimum Purchase Value (₹)</label>
              <input
                type="number"
                min="0"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                placeholder="499"
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-650 dark:text-slate-350 mb-1">Expiry Date</label>
              <input
                required
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-gray-250 dark:border-slate-800 bg-gray-50 dark:bg-slate-850 rounded-xl p-2.5 text-sm font-semibold cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-550 text-white font-bold py-3 rounded-xl transition shadow cursor-pointer text-center text-sm"
            >
              Add Coupon
            </button>
          </form>
        </div>

        {/* Right Side: Coupons Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-5 text-slate-800 dark:text-white">
            Active Promo Codes
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-slate-900 dark:bg-slate-950 text-white uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Code</th>
                  <th className="p-3">Discount Type</th>
                  <th className="p-3">Value</th>
                  <th className="p-3">Min Purchase</th>
                  <th className="p-3">Expiry</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-850">
                {coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition">
                    <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400 font-mono tracking-wide">
                      {c.code}
                    </td>
                    <td className="p-3 font-medium">{c.discountType}</td>
                    <td className="p-3 font-bold">
                      {c.discountType === "BOGO"
                        ? "BOGO"
                        : c.discountType === "Percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue.toLocaleString("en-IN")}`}
                    </td>
                    <td className="p-3 font-semibold text-slate-500 dark:text-slate-400">
                      ₹{c.minPurchase.toLocaleString("en-IN")}
                    </td>
                    <td className="p-3 font-semibold text-xs">
                      {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="text-red-500 hover:text-red-700 p-2 cursor-pointer"
                        title="Delete Promo Code"
                      >
                        <FaTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {coupons.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-450 dark:text-slate-500">
                      No coupon codes registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

export default ManageCoupons;
