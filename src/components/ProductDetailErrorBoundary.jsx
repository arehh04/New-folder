import React from 'react';

export default class ProductDetailErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Caught error in ProductDetailErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex justify-center items-center min-h-[50vh] p-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-12 text-center max-w-lg shadow-sm">
            <span className="text-6xl mb-4 block">🚨</span>
            <h2 className="text-red-600 text-2xl font-bold mb-4">Failed to load product details</h2>
            <p className="text-slate-700 mb-2">We encountered an unexpected error while rendering the product details.</p>
            <p className="font-mono bg-white border border-red-100 p-3 rounded-lg text-red-400 text-sm mt-4 break-all shadow-inner">
              {this.state.error?.toString()}
            </p>
            <button 
              className="mt-8 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl transition-colors border-none cursor-pointer" 
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
