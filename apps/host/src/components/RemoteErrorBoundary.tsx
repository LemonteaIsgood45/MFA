import React, { type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; remoteName: string }
interface State { error: Error | null }

export default class RemoteErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State { return { error }; }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`Remote ${this.props.remoteName} failed`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <section role="alert" className="rounded-lg border border-danger/30 bg-danger-bg p-5 text-text-primary">
          <h2 className="font-semibold">Không thể tải {this.props.remoteName}</h2>
          <p className="mt-1 text-sm text-text-secondary">{this.state.error.message || "Đã xảy ra lỗi khi tải ứng dụng."}</p>
          <button className="mt-3 rounded-md border border-border px-3 py-1.5 text-sm" onClick={() => window.location.reload()}>
            Thử tải lại
          </button>
        </section>
      );
    }
    return this.props.children;
  }
}
