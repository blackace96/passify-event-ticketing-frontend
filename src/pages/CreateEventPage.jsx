import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, FileText, Eye, Save, ImagePlus, X, ChevronDown, Clock, XCircle } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import api from '../services/api';
import toast from 'react-hot-toast';
import FloatingTickets from '../components/ui/FloatingTickets';
import LocationPicker from '../components/ui/LocationPicker';
import Footer from '../components/layout/Footer';
import { EVENT_CATEGORIES } from '../constants/eventCategories';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    venue: '',
    date: '',
    capacity: '',
    image: '',
    latitude: null,
    longitude: null,
    category: '',
    price: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      const res = await api.post('/events/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.url;
    } catch {
      toast.error('Image upload failed');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (status) => {
    if (!form.title || !form.venue || !form.date || !form.capacity || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      setLoading(true);
      let imageUrl = form.image;
      if (imageFile) {
        imageUrl = await handleImageUpload();
        if (!imageUrl) return;
      }
      await api.post('/events', { ...form, image: imageUrl, status });
      if (status === 'PENDING') {
        toast.success('Event submitted for review! You\'ll be notified once approved.');
      } else {
        toast.success('Event saved as draft');
      }
      navigate('/org/dashboard');
    } catch {
      toast.error('Failed to create event. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090912] text-white">
      <FloatingTickets />
      <Navbar />

      <div className="relative max-w-3xl mx-auto px-6 pt-28 pb-20">

        {/* Back */}
        <button
          onClick={() => navigate('/org/dashboard')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to dashboard
        </button>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-2">Create Event</h1>
          <p className="text-zinc-200">Fill in the details below to create your event</p>
        </div>

        <div className="space-y-5">

          {/* Image upload */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl overflow-hidden">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Event cover"
                  className="w-full h-56 object-cover"
                />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all"
                >
                  <X size={16} />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/60 backdrop-blur-sm text-white text-base px-3 py-1 rounded-full">
                    Cover photo
                  </span>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-56 cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex flex-col items-center gap-3 text-center px-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#6c47ff]/20 border border-[#6c47ff]/30 flex items-center justify-center">
                    <ImagePlus size={24} className="text-[#a78bfa]" />
                  </div>
                  <div>
                    <p className="text-white text-base font-medium">Upload event cover photo</p>
                    <p className="text-zinc-500 text-base mt-1">JPG, PNG or WebP · Max 5MB · 1200×630 recommended</p>
                  </div>
                  <span className="bg-[#6c47ff]/20 border border-[#6c47ff]/30 text-[#a78bfa] text-base px-4 py-2 rounded-xl">
                    Choose photo
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-3">
              Event title *
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. Afro Nation Ghana 2025"
              className="w-full bg-transparent text-white text-lg placeholder-zinc-600 outline-none"
            />
          </div>

          {/* Description */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-3">
              <FileText size={12} className="inline mr-1" /> Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Tell attendees what your event is about..."
              rows={4}
              className="w-full bg-transparent text-white placeholder-zinc-600 outline-none resize-none text-base leading-relaxed"
            />
          </div>

          {/* Category */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label
              htmlFor="event-category"
              className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-3"
            >
              Category *
            </label>
            <div className="relative">
              <select
                id="event-category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full appearance-none rounded-xl border border-white/10 bg-[#0c0c18] px-4 py-3 pr-10 text-base text-white outline-none transition-colors focus:border-[#6c47ff]/50 focus:ring-2 focus:ring-[#6c47ff]/20"
              >
                <option value="" disabled className="text-zinc-500">
                  Select a category
                </option>
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#111122] text-white">
                    {cat}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-sm text-zinc-600">Choose the category that best describes your event.</p>
          </div>

          {/* Date */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-3">
              <Calendar size={12} className="inline mr-1" /> Date & time *
            </label>
            <input
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-transparent text-white outline-none text-base [color-scheme:dark]"
            />
          </div>

          {/* Venue & Location — full width */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-4">
              <MapPin size={12} className="inline mr-1" /> Venue & location *
            </label>
            <LocationPicker
              initialVenue={form.venue}
              onLocationSelect={({ latitude, longitude, venue }) => {
                setForm(prev => ({ ...prev, venue, latitude, longitude }));
              }}
            />
          </div>

          {/* Capacity */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label className="block text-zinc-400 text-base font-medium uppercase tracking-wider mb-3">
              <Users size={12} className="inline mr-1" /> Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 500"
              min="1"
              max="100000"
              className="w-full bg-transparent text-white placeholder-zinc-600 outline-none text-base"
            />
            <p className="text-zinc-600 text-base mt-2">Maximum number of attendees (up to 100,000)</p>
          </div>

          {/* Price */}
          <div className="bg-[#111122] border border-white/10 rounded-2xl p-6">
            <label className="block text-zinc-400 text-xs font-medium uppercase tracking-wider mb-3">
              Ticket price (GHS)
            </label>
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 text-sm font-medium">GHS</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="flex-1 bg-transparent text-white placeholder-zinc-600 outline-none text-base"
              />
            </div>
            <p className="text-zinc-600 text-xs mt-2">Set to 0 for a free event</p>
          </div>

          {/* Review info */}
          <div className="bg-[#6c47ff]/10 border border-[#6c47ff]/20 rounded-2xl p-5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#6c47ff]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[#a78bfa] text-base">🔐</span>
            </div>
            <div>
              <p className="text-white text-base font-medium mb-1">Review process</p>
              <p className="text-zinc-500 text-base leading-relaxed">
                Events are reviewed before going live to ensure quality and prevent fraud. You'll be notified once your event is approved. A 6-digit validator PIN is auto-generated on approval.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => handleSubmit('DRAFT')}
              disabled={loading || uploadingImage}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 text-white font-medium py-4 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              <Save size={16} /> Save as draft
            </button>
            <button
              onClick={() => handleSubmit('PENDING')}
              disabled={loading || uploadingImage}
              className="flex-1 flex items-center justify-center gap-2 bg-[#6c47ff] hover:bg-[#7c57ff] text-white font-medium py-4 rounded-xl transition-all duration-200 disabled:opacity-50"
            >
              {loading || uploadingImage ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Eye size={16} /> Submit for review</>
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}