# RB-022 – Monitor wird nicht erkannt

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Support-Level:** L1; gezielte Übergabe an L2 für komplexe Treiber-/Dock-/Firmware-/Hardwarethemen  
**Status:** Offizielle Herstellerquellen recherchiert; **praktische Validierung ausstehend**.

## Inhalt des Komplettpakets

```text
RB-022_Monitor-nicht-erkannt/
├── RB-022_Lernartikel.md
├── RB-022_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb022_henne_ei_monitor_nicht_erkannt.png
    ├── rb022_diagnosebaum.svg
    └── rb022_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-022_Lernartikel.md` | Ausführliche recherchierte Analyse (15 Kapitel), Diagnose, PowerShell, A/B-Tests, Quellen und Lernaufgaben |
| `RB-022_Praxis-Runbook.md` | Direkte Arbeitsanweisung für L1: Annahme, Differenzialdiagnose, Maßnahmen, Re-Test und Eskalation |
| `assets/rb022_henne_ei_monitor_nicht_erkannt.png` | Farbige Comic-Infografik mit Henne und Ei, Fehlerpfad und Sicherheitshinweis |
| `assets/rb022_diagnosebaum.svg` | Skalierbarer technischer Entscheidungsbaum |
| `assets/rb022_diagnosebaum_preview.png` | PNG-Vorschau des Entscheidungsbaums |

## Zur späteren Veröffentlichung

- Das komplette Paket einschließlich `assets/` übernehmen. Bilder im Markdown verwenden **relative Pfade**.
- Lernartikel und Praxis-Runbook als separate Website-Ansichten einbinden.
- SVG responsiv darstellen, bei Bedarf horizontales Scrollen ermöglichen.
- Projektliste: **Ticket 22 = Monitor wird nicht erkannt (L1)**. Die Website ist hier **nicht** verändert worden.
- Nächste Fälle der Projektliste: **Ticket 23 = Dockingstation funktioniert nicht**, Ticket 24 = USB-Gerät, Maus oder Tastatur ausgefallen.
- Quellenangaben im Lernartikel vor einer späteren Veröffentlichung erneut prüfen, wenn sich Herstelleroberflächen ändern.

## Sicherheits- und Validierungshinweise

- Die Lern- und Ticketbeispiele sind **fiktiv** und keine real ausgeführten Störungsfälle.
- Die PowerShell-Kommandos sind **lesend**; kein automatischer Geräte- oder Treibereingriff.
- „PnP-Gerät vorhanden“ ist kein bestätigter Bildtest. Ein abgeschlossenes Ticket verlangt eine sichtbare, benutzerbestätigte Funktionsprüfung.
- BIOS-/Firmware-/Grafiktreibermaßnahmen nur nach Ursacheingrenzung und Freigabe durch das zuständige IT-Team.
- Bildnachweis: **Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT**. Die Zeichnung ist keine unveränderte Aufnahme einer echten Windows-Oberfläche.
- Keine Änderungen an GitHub, Website oder produktiven Computern durch die Erstellung dieses Pakets.

**Erfolgskriterium der Recherche:** Die Inhalte sollen eine **selbstständige Hypothesenbildung und Testauswahl** ermöglichen; vollständig praktisch validiert sind sie erst nach nachweisbar durchgeführten Labortests bzw. Supportfällen.
