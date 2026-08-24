import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as paymentService from '../../services/paymentService';
import * as userService from '../../services/userService';
import { Payment } from '../../services/paymentService';
import { colors, spacing, borderRadius, typography } from '../../constants/theme';
import Badge from '../../components/ui/Badge';
import Avatar from '../../components/ui/Avatar';
import Card from '../../components/ui/Card';
import Loading from '../../components/ui/Loading';
import { AppUser } from '../../types';

const containerStyle: React.CSSProperties = {
  minHeight: '100vh',
  backgroundColor: colors.background,
  padding: spacing.lg,
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
  marginBottom: spacing.lg,
};

const backButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 28,
  cursor: 'pointer',
  padding: 0,
  lineHeight: 1,
};

const titleStyle: React.CSSProperties = {
  ...typography.h2,
  flex: 1,
};

const yearSelectorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: spacing.md,
  marginBottom: spacing.lg,
};

const yearArrowStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: colors.primary,
  fontSize: 24,
  cursor: 'pointer',
  padding: '0 8px',
  fontWeight: 700,
};

const yearTextStyle: React.CSSProperties = {
  ...typography.h3,
  minWidth: 80,
  textAlign: 'center',
};

const progressContainerStyle: React.CSSProperties = {
  marginBottom: spacing.lg,
};

const progressLabelStyle: React.CSSProperties = {
  ...typography.bodySmall,
  marginBottom: spacing.sm,
};

const progressBarOuterStyle: React.CSSProperties = {
  width: '100%',
  height: 10,
  backgroundColor: colors.surfaceLight,
  borderRadius: borderRadius.full,
  overflow: 'hidden',
};

const progressBarInnerStyle = (pct: number): React.CSSProperties => ({
  width: `${pct}%`,
  height: '100%',
  backgroundColor: colors.success,
  borderRadius: borderRadius.full,
  transition: 'width 0.3s ease',
});

const userRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.md,
};

const userInfoStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
};

const userNameStyle: React.CSSProperties = {
  ...typography.body,
  margin: 0,
};

const toggleButtonStyle = (paid: boolean): React.CSSProperties => ({
  padding: '6px 16px',
  border: 'none',
  borderRadius: borderRadius.md,
  fontWeight: 600,
  fontSize: 13,
  cursor: 'pointer',
  backgroundColor: paid ? colors.error : colors.success,
  color: '#FEF5E6',
  transition: 'opacity 0.2s ease',
});

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.sm,
};

const PaymentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [paymentsData, usersData] = await Promise.all([
        paymentService.getPaymentsByYear(year),
        userService.getAllUsers(),
      ]);
      setPayments(paymentsData);
      setUsers(usersData);
    } catch {
      window.alert('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getPaymentStatus = (userId: string): boolean => {
    const payment = payments.find((p) => p.userId === userId);
    return payment?.paid ?? false;
  };

  const handleToggle = async (user: AppUser) => {
    const current = getPaymentStatus(user.id);
    const newStatus = !current;
    try {
      await paymentService.setPayment(user.id, user.displayName, year, newStatus);
      setPayments((prev) => {
        const filtered = prev.filter((p) => p.userId !== user.id);
        return [
          ...filtered,
          {
            userId: user.id,
            userName: user.displayName,
            year,
            paid: newStatus,
            paidAt: newStatus ? new Date() : null,
          },
        ];
      });
    } catch {
      window.alert('Error al actualizar el estado de pago');
    }
  };

  const paidCount = users.filter((u) => getPaymentStatus(u.id)).length;
  const totalUsers = users.length;
  const percentage = totalUsers > 0 ? Math.round((paidCount / totalUsers) * 100) : 0;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <button style={backButtonStyle} onClick={() => navigate(-1)}>
          ‹
        </button>
        <h1 style={titleStyle}>Cuotas</h1>
      </div>

      <div style={yearSelectorStyle}>
        <button
          style={yearArrowStyle}
          onClick={() => setYear((y) => y - 1)}
          disabled={year <= 2020}
        >
          ‹
        </button>
        <span style={yearTextStyle}>{year}</span>
        <button
          style={yearArrowStyle}
          onClick={() => setYear((y) => y + 1)}
          disabled={year >= 2099}
        >
          ›
        </button>
      </div>

      {loading ? (
        <Loading message="Cargando cuotas..." />
      ) : (
        <>
          <div style={progressContainerStyle}>
            <p style={progressLabelStyle}>
              {paidCount} de {totalUsers} pagaron ({percentage}%)
            </p>
            <div style={progressBarOuterStyle}>
              <div style={progressBarInnerStyle(percentage)} />
            </div>
          </div>

          <div style={listStyle}>
            {users.map((user) => {
              const paid = getPaymentStatus(user.id);
              return (
                <Card key={user.id}>
                  <div style={userRowStyle}>
                    <Avatar name={user.displayName} size={40} />
                    <div style={userInfoStyle}>
                      <p style={userNameStyle}>{user.displayName}</p>
                    </div>
                    <Badge
                      label={paid ? 'Pagado' : 'Pendiente'}
                      variant={paid ? 'success' : 'danger'}
                      size="sm"
                    />
                    <button
                      style={toggleButtonStyle(paid)}
                      onClick={() => handleToggle(user)}
                    >
                      {paid ? 'Marcar impago' : 'Marcar pagado'}
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsScreen;
