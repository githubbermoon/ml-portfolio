import React, { useMemo, useState } from 'react';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';
import './realms-tldraw.css';

export default function RealmsTldrawCanvas() {
  const [spin, setSpin] = useState(true);
  const [showYantra, setShowYantra] = useState(true);

  const petals = useMemo(() => Array.from({ length: 16 }, (_, i) => i), []);

  return (
    <div className="realms-canvas-shell">
      <div className="realms-canvas-toolbar">
        <div>
          <p className="realms-eyebrow">Realms / tldraw prototype</p>
          <h1>Living Yantra Canvas</h1>
        </div>
        <div className="realms-actions">
          <button onClick={() => setShowYantra((v) => !v)}>{showYantra ? 'Hide' : 'Show'} yantra overlay</button>
          <button onClick={() => setSpin((v) => !v)}>{spin ? 'Pause' : 'Rotate'} components</button>
        </div>
      </div>

      {showYantra && (
        <div className={`realms-yantra-overlay ${spin ? 'is-spinning' : ''}`} aria-hidden="true">
          <div className="yantra-ring ring-one" />
          <div className="yantra-ring ring-two" />
          <div className="yantra-triangle up" />
          <div className="yantra-triangle down" />
          <div className="yantra-bindu" />
          {petals.map((p) => (
            <div key={p} className="yantra-petal" style={{ transform: `rotate(${p * 22.5}deg) translateY(-148px)` }} />
          ))}
        </div>
      )}

      <div className="realms-tldraw-stage">
        <Tldraw />
      </div>
    </div>
  );
}
