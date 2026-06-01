import { Component, Suspense, type ReactNode } from 'react';

const Spinner = () => (
  <div className="flex items-center justify-center py-20">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />
  </div>
);

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-red-500 font-semibold">
              {this.state.error?.message ?? 'A apărut o eroare.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold"
            >
              Reîncearcă
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

interface QueryBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  errorFallback?: ReactNode;
}

const QueryBoundary = ({ children, fallback, errorFallback }: QueryBoundaryProps) => (
  <ErrorBoundary fallback={errorFallback}>
    <Suspense fallback={fallback ?? <Spinner />}>{children}</Suspense>
  </ErrorBoundary>
);

export default QueryBoundary;
