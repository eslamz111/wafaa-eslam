import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Heart } from "lucide-react";
import InstallPopup from "@/components/pwa/InstallPopup";
import InstallSuccessMessage from "@/components/pwa/InstallSuccessMessage";
import OfflineMessage from "@/components/pwa/OfflineMessage";
import { usePWA } from "@/hooks/usePWA";

// Lazy load admin pages
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const ProtectedRoute = lazy(() => import("./components/admin/ProtectedRoute"));

const queryClient = new QueryClient();

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Heart className="w-12 h-12 text-primary heartbeat" fill="currentColor" />
  </div>
);

const AppContent = () => {
  const {
    isOffline,
    showInstallPopup,
    showSuccessMessage,
    installApp,
    dismissPopup,
  } = usePWA();

  // Show offline message if no connection
  if (isOffline) {
    return <OfflineMessage />;
  }

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      {/* PWA Install Popup */}
      <InstallPopup
        show={showInstallPopup}
        onInstall={installApp}
        onDismiss={dismissPopup}
      />

      {/* PWA Install Success Message */}
      <InstallSuccessMessage show={showSuccessMessage} />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
