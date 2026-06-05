import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { APP_ROUTES } from '../../constant';

const PoliciesPage = lazy(() => import('../../components/Policies/PoliciesPage'));
const OrderPolicy = lazy(() => import('../../components/Policies/OrderPolicy'));
const RefundPolicy = lazy(() => import('../../components/Policies/RefundPolicy'));
const TryOnPolicy = lazy(() => import('../../components/Policies/TryOnPolicy'));
const PaymentPolicy = lazy(() => import('../../components/Policies/PaymentPolicy'));
const ShippingPolicy = lazy(() => import('../../components/Policies/ShippingPolicy'));
const PrivacyPolicy = lazy(() => import('../../components/Policies/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('../../components/Policies/CookiePolicy'));
const MembershipPolicy = lazy(() => import('../../components/Policies/MembershipPolicy'));

const PoliciesRoute = () => {
  return (
    <Routes>
      <Route element={<PoliciesPage />}>
        <Route index element={<Navigate to={APP_ROUTES.POLICY_ORDER} replace />} />
        <Route path="order" element={<OrderPolicy />} />
        <Route path="payment" element={<PaymentPolicy />} />
        <Route path="shipping" element={<ShippingPolicy />} />
        <Route path="refund" element={<RefundPolicy />} />
        <Route path="try-on" element={<TryOnPolicy />} />
        <Route path="privacy" element={<PrivacyPolicy />} />
        <Route path="cookies" element={<CookiePolicy />} />
        <Route path="membership" element={<MembershipPolicy />} />
        <Route path="*" element={<Navigate to={APP_ROUTES.POLICY_ORDER} replace />} />
      </Route>
    </Routes>
  );
};

export default PoliciesRoute;
