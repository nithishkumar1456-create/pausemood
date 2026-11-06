/**
 * CareMessage.jsx
 * Calm support card shown when isStruggling() returns true.
 * Appears TOGETHER with the kind reply — never instead of saving the check-in.
 * Uses a warm golden card, not alarming red.
 * aria-live="assertive" because this is important and should be announced promptly.
 *
 * IMPORTANT: This card only surfaces a helpline number.
 * It does NOT diagnose, label, or give treatment advice.
 */
import './CareMessage.css';

export default function CareMessage() {
  return (
    <div
      className="care-message"
      role="region"
      aria-label="Support information"
      aria-live="assertive"
      aria-atomic="true"
    >
      <p className="care-message__heading">You're not alone 💜</p>
      <p className="care-message__body">
        It's okay to have tough days. Take a deep breath. You're doing your best.
      </p>

      {/* Helpline callout – visually distinct warm chip */}
      <div className="care-message__helpline" aria-label="Helpline: Tele-MANAS 14416, free, 24 hours a day, 7 days a week">
        <span className="care-message__phone" aria-hidden="true">📞</span>
        <span>
          <strong>Tele-MANAS 14416</strong>
          <br />
          <span className="care-message__subtext">free, 24/7</span>
        </span>
      </div>

      <p className="care-message__footer">Kindness towards yourself matters. 💜</p>
    </div>
  );
}

