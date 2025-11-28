## 2025-11-25

- Validazione calendario: la data di ritorno può essere selezionata solo se successiva alla partenza; le date non valide vengono disabilitate.
- Messaggio di errore: mostra un avviso chiaro quando la data di ritorno è precedente alla partenza.
- Correzione sfasamento: sostituita `toISOString()` con formattazione locale (`YYYY-MM-DD`) per evitare shift di giorno dovuti al fuso orario.
- Allineamento backend/UI: le date inviate a `onSelectRange` sono esattamente quelle selezionate; la differenza giorni in `App.tsx` usa parsing locale.
- Test unitari: aggiunti test per utilità di data (`dateToLocalISO`, `parseLocalISOString`).
- Test interfaccia: creati test di base per disabilitazione e stato del pulsante Applica (ambiente jsdom).
- Compatibilità browser: logica basata su API Date standard e `toLocaleDateString`, funzionante su Chrome, Firefox, Safari, Edge moderni.
