import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('kuzuri_') || key.startsWith('afrostyle_')) {
          localStorage.removeItem(key);
        }
      });
    } catch {
      // ignore
    }
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center p-6 text-[#1A1A1A]">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#F0EBE5] p-8 text-center shadow-lg">
            <div className="w-14 h-14 bg-amber-50 text-[#B45309] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <AlertTriangle className="w-7 h-7" />
            </div>
            
            <h2 className="text-lg font-extrabold text-[#1A1A1A]">
              Interruption temporaire
            </h2>
            
            <p className="text-xs text-[#6B7280] mt-2 leading-relaxed">
              Nous avons sécurisé vos données. Cliquez ci-dessous pour recharger l'application Kuzuri.
            </p>

            <button
              onClick={this.handleReset}
              className="mt-6 w-full py-3 px-4 bg-[#B45309] hover:bg-[#92400E] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser l'application</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
