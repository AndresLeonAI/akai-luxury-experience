import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

type ReservationResponse = {
  reservationId: string;
  reference: string;
  status: 'PENDING_PAYMENT' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED' | 'REQUIRES_MANUAL_REVIEW';
  date: string;
  time: string;
  guests: number;
  notes?: string | null;
  amount: { currency: string; deposit: number; total: number };
  stripe?: { checkoutSessionId?: string | null; paymentIntentId?: string | null };
};

type ViewState =
  | { kind: 'missing' }
  | { kind: 'loading' }
  | { kind: 'processing' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; data: ReservationResponse };

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const parseIsoDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map((v) => Number(v));
  const monthIndex = Math.max(0, Math.min(11, (m ?? 1) - 1));
  return { day: d ?? 0, monthName: MONTH_NAMES[monthIndex], year: y ?? 0 };
};

const formatMoney = (minor: number, currency: string) => {
  const normalized = (currency || 'usd').toUpperCase();
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: normalized }).format(minor / 100);
  } catch {
    return `$${(minor / 100).toFixed(2)} ${normalized}`;
  }
};

const Confirmation: React.FC = () => {
  const location = useLocation();
  const sessionId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('session_id');
  }, [location.search]);

  const [state, setState] = useState<ViewState>(() => (sessionId ? { kind: 'loading' } : { kind: 'missing' }));

  useEffect(() => {
    if (!sessionId) return;

    let cancelled = false;
    let timer: number | undefined;
    let attempt = 0;

    const poll = async () => {
      if (cancelled) return;

      try {
        const res = await fetch(`/api/v1/reservations/by-checkout-session/${encodeURIComponent(sessionId)}`);

        if (res.status === 202) {
          setState({ kind: 'processing' });
          const body = (await res.json().catch(() => ({}))) as { nextPollMs?: number };
          attempt += 1;
          const backoff = Math.min(5000, 1500 + attempt * 500);
          const next = typeof body.nextPollMs === 'number' ? body.nextPollMs : backoff;
          timer = window.setTimeout(poll, next);
          return;
        }

        const isJson = res.headers.get('content-type')?.includes('application/json') ?? false;
        if (!res.ok) {
          const body = isJson ? await res.json().catch(() => null) : null;
          const message = body?.error?.message ?? 'No pudimos confirmar su reserva.';
          setState({ kind: 'error', message });
          return;
        }

        const data = (await res.json()) as ReservationResponse;
        setState({ kind: 'ready', data });
      } catch {
        attempt += 1;
        setState({ kind: 'processing' });
        timer = window.setTimeout(poll, Math.min(5000, 1500 + attempt * 500));
      }
    };

    void poll();
    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [sessionId]);

  const view = useMemo(() => {
    if (state.kind !== 'ready') return null;
    const { day, monthName } = parseIsoDate(state.data.date);
    const statusLabel: Record<ReservationResponse['status'], string> = {
      CONFIRMED: 'Pagado',
      PENDING_PAYMENT: 'Procesando',
      EXPIRED: 'Expirado',
      CANCELLED: 'Cancelado',
      REQUIRES_MANUAL_REVIEW: 'Revisión',
    };
    return {
      reference: state.data.reference,
      day,
      monthName,
      time: state.data.time,
      guests: state.data.guests,
      deposit: formatMoney(state.data.amount.deposit, state.data.amount.currency),
      statusText: statusLabel[state.data.status],
      status: state.data.status,
    };
  }, [state]);

  return (
    <div className="min-h-screen bg-akai-black text-white flex flex-col pt-32 pb-20 px-6 relative">
      {/* Noise overlay effect */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 opacity-[0.04] mix-blend-overlay bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCGuQ09yH-nVW-jjyDoYzloXMmcNI5GZwn_MrQLP_h0_p6imRsuS3Y5tHBvVFKTS8QJXWYexpjpMnCeWTRakiZrjzDDI48d7MvletvvOLt6ty96tmxL8WAR3DnlsSZA5t8BYiVxEzhRxrIiH3YpFpkZCkZ4zdQhjY_LyTs8w_ValT9ab9KE6DAHiF7rpYTKx1CEZiX2pLXVNZCEYe0_8FUrDzOxswkEFalKd1xtIhPiYV10IgqJgMe0lgdAQ0wdbHSNEL96Ltq3Yy-E')]"></div>

      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="max-w-[1440px] w-full flex flex-col items-center">
          <div className="mb-6 flex flex-col items-center gap-3">
            <div className="h-12 w-[1px] bg-gradient-to-b from-transparent to-akai-red"></div>
            <span className="text-akai-red text-xs uppercase tracking-[0.25em] font-medium">ConfirmaciИn</span>
          </div>

          <div className="text-center mb-20 space-y-6">
            {state.kind === 'ready' && view?.status === 'CONFIRMED' ? (
              <>
                <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">Su mesa le espera</h2>
                <p className="text-akai-muted text-sm font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                  Hemos preparado el escenario para su ceremonia. <br />Bienvenido al silencio de AKAI.
                </p>
              </>
            ) : state.kind === 'ready' && view ? (
              <>
                <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">
                  Reserva en estado {view.statusText}
                </h2>
                <p className="text-akai-muted text-sm font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                  Conservamos su referencia para seguimiento.
                </p>
              </>
            ) : state.kind === 'missing' ? (
              <>
                <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">Falta informaci&oacute;n</h2>
                <p className="text-akai-muted text-sm font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                  No encontramos <span className="text-white/70">session_id</span> en la URL.
                </p>
              </>
            ) : state.kind === 'error' ? (
              <>
                <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">No pudimos confirmar</h2>
                <p className="text-akai-muted text-sm font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                  {state.message}
                </p>
              </>
            ) : (
              <>
                <h2 className="text-5xl md:text-6xl font-serif italic text-white leading-tight">Procesando su reserva</h2>
                <p className="text-akai-muted text-sm font-light tracking-wide max-w-lg mx-auto leading-relaxed">
                  Esto puede tardar unos segundos mientras recibimos confirmaci&oacute;n de pago.
                </p>
              </>
            )}
          </div>

          <div className="w-full max-w-[900px] bg-akai-card border-x border-b border-akai-border/50 relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-akai-red opacity-80"></div>
            <div className="p-10 md:p-16">
              <div className="flex justify-between items-start mb-16 relative">
                <div className="space-y-2">
                  <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em]">Identificador</span>
                  <p className="text-lg font-sans text-white tracking-widest opacity-90">REF. {view?.reference ?? '—'}</p>
                </div>
                <div className="hanko-stamp transform -rotate-12 opacity-90">
                  <span>AKAI</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-y-12 md:gap-x-12 mb-16">
                <div className="md:col-span-1 group">
                  <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-4 group-hover:text-akai-red transition-colors duration-500">Fecha</span>
                  <div className="flex flex-col">
                    <span className="text-4xl font-serif text-white">{view?.day ?? '—'}</span>
                    <span className="text-sm text-akai-muted uppercase tracking-widest mt-1">{view?.monthName ?? ''}</span>
                  </div>
                </div>
                <div className="md:col-span-1 group border-t md:border-t-0 md:border-l border-akai-border/50 pt-8 md:pt-0 md:pl-12">
                  <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-4 group-hover:text-akai-red transition-colors duration-500">Hora</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-serif text-white">{view?.time ?? '—'}</span>
                  </div>
                </div>
                <div className="md:col-span-2 group border-t md:border-t-0 md:border-l border-akai-border/50 pt-8 md:pt-0 md:pl-12">
                  <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-4 group-hover:text-akai-red transition-colors duration-500">Experiencia</span>
                  <p className="text-2xl font-serif text-white italic mb-1">Omakase de EstaciИn</p>
                  <p className="text-xs text-akai-muted">Barra Principal 嫉 {view?.guests ?? '—'} Personas</p>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-akai-border to-transparent mb-10 w-full opacity-50"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-akai-muted uppercase tracking-widest">DepИsito Garantヴa</span>
                    <span className="text-sm text-white font-sans">{view?.deposit ?? '—'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-akai-muted uppercase tracking-widest">Estado</span>
                    <span className={`text-xs uppercase tracking-widest ${view?.status === 'CONFIRMED' ? 'text-akai-red' : 'text-white/50'}`}>
                      {view?.statusText ?? (state.kind === 'processing' ? 'Procesando' : '—')}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col md:items-end text-left md:text-right space-y-4">
                  <div>
                    <span className="block text-[0.6rem] text-akai-muted uppercase tracking-[0.25em] mb-1">UbicaciИn</span>
                    <p className="text-sm text-white font-light">
                      Calle de la Cruz 14, Madrid<br />
                      <span className="text-akai-muted">Acceso Privado</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col md:flex-row items-center gap-12">
            <button className="group relative px-6 py-3 overflow-hidden">
              <span className="relative z-10 text-xs text-white uppercase tracking-[0.25em] group-hover:text-akai-red transition-colors duration-300">
                Aヵadir a Calendario
              </span>
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-akai-border group-hover:bg-akai-red transition-colors duration-300"></div>
            </button>

            {(state.kind === 'missing' || state.kind === 'error') && (
              <Link
                to="/reservations"
                className="text-[10px] uppercase tracking-[0.25em] text-white/60 hover:text-white transition-colors"
              >
                Volver a Reservas
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;

