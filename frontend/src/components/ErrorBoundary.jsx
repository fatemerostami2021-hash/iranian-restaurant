import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
          <h3 className="font-bold">❌ خطا در نمایش</h3>
          <p className="text-sm">{this.state.error?.message || 'خطای ناشناخته رخ داده است'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🔄 بارگذاری مجدد
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
