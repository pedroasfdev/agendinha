import { Link, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { AuthLayout } from '../features/auth/AuthLayout';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ExplorePage } from '../features/discovery/ExplorePage';
import { ServicePage } from '../features/discovery/ServicePage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { AgendaPage } from '../features/booking/AgendaPage';
import { ProviderLayout } from '../features/provider/ProviderLayout';
import { ProviderServicesPage } from '../features/provider/ServicesPage';
import { ProviderEditPage } from '../features/provider/EditPage';
import { ProviderAgendaPage } from '../features/provider/AgendaPage';
import { ProviderPaymentsPage } from '../features/provider/PaymentsPage';
import { BookingLayout } from '../features/booking/BookingLayout';
import { TimePage } from '../features/booking/TimePage';
import { CheckoutPage } from '../features/booking/CheckoutPage';
import { ConfirmationPage } from '../features/booking/ConfirmationPage';

export function App() {
  return (
    <Routes>
      <Route path="/prestador" element={<ProviderLayout />}>
        <Route index element={<Navigate replace to="/prestador/servicos" />} />
        <Route path="servicos" element={<ProviderServicesPage />} />
        <Route path="pagina" element={<ProviderEditPage />} />
        <Route path="agenda" element={<ProviderAgendaPage />} />
        <Route path="pagamentos" element={<ProviderPaymentsPage />} />
      </Route>
      <Route element={<BookingLayout />}>
        <Route path="/agendamento/:id/horario" element={<TimePage />} />
        <Route path="/agendamento/:id/pagamento" element={<CheckoutPage />} />
        <Route path="/confirmacao/:bookingId" element={<ConfirmationPage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route index element={<ExplorePage />} />
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/favoritos" element={<ExplorePage favoritesOnly />} />
        <Route path="/servico/:id" element={<ServicePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route
          path="*"
          element={
            <div className="empty-state">
              <h1>Vamos encontrar seu caminho?</h1>
              <p>Essa página não foi encontrada.</p>
              <Link className="button button-primary" to="/">
                Voltar para o início
              </Link>
            </div>
          }
        />
      </Route>
    </Routes>
  );
}
