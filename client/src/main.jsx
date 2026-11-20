import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('CareCircle UI Exception:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#EDF5F4] p-6 text-slate-800">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-lg border border-slate-100 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-slate-900">CareCircle View Notice</h2>
            <p className="text-xs text-slate-500">
              {this.state.error?.message || 'A temporary display exception occurred while loading this view.'}
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  localStorage.removeItem('carecircle_family_consultations');
                  localStorage.removeItem('carecircle_doctor_requests');
                  window.location.reload();
                }}
                className="px-4 py-2 bg-[#013A40] text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Reset Local Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
