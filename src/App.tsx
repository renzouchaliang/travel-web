import { useState } from 'react';

// This interaction verifies the setup; it is not a travel-guide template.
export function App() {
  const [day, setDay] = useState(1);
  return (
    <main>
      <h1>Travel web workspace</h1>
      <p>A starting point for independent, interactive travel guides.</p>
      <section aria-labelledby="demo-heading">
        <h2 id="demo-heading">Setup demo</h2>
        <div className="day-buttons" aria-label="Choose a demo day">
          {[1, 2].map((value) => (
            <button key={value} aria-pressed={day === value} onClick={() => setDay(value)}>
              Day {value}
            </button>
          ))}
        </div>
        <p aria-live="polite">{day === 1 ? 'Day 1: Explore at your own pace.' : 'Day 2: Choose a new route.'}</p>
      </section>
      <p>Layouts, maps, photos, and trip content can be added when a guide is defined.</p>
    </main>
  );
}
