import { Layout } from '@/components/layout/Layout';

export default function SettingsPage() {
  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and application settings
          </p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Profile Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">Profile</h2>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-medium text-primary-foreground">
                AU
              </div>
              <div>
                <p className="font-medium text-foreground">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@company.com</p>
                <p className="text-sm text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">Notifications</h2>
            <p className="text-sm text-muted-foreground">
              Notification settings will be available when connected to Supabase.
            </p>
          </div>

          {/* System Section */}
          <div className="rounded-lg border border-border bg-card p-6">
            <h2 className="mb-4 font-semibold text-foreground">System</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Version: 1.0.0</p>
              <p>Environment: Development</p>
              <p>Database: Not connected</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
