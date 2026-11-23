# RB-023 – Dockingstation funktioniert nicht

**Projekt:** 50 Tickets – 50 typische Supportfälle  
**Version:** 1.0 · **Stand:** 22.11.2026  
**Support-Level:** L1/L2  
**Status:** Herstellerquellen recherchiert, Dokumentation für spätere Praxis vorbereitet; **noch nicht praktisch validiert**.

## Dateistruktur

```text
RB-023_Dockingstation-funktioniert-nicht/
├── RB-023_Lernartikel.md
├── RB-023_Praxis-Runbook.md
├── README.md
└── assets/
    ├── rb023_henne_ei_dockingstation.png
    ├── rb023_diagnosebaum.svg
    └── rb023_diagnosebaum_preview.png
```

| Datei | Zweck |
|---|---|
| `RB-023_Lernartikel.md` | Vollständiger Lernartikel (15 Kapitel): Technikgrundlagen, Symptom-/Ursachenmatrix, A/B-Tests, USB-C/Thunderbolt/USB4/DisplayLink, lesende PowerShell, Quellen, fiktive Fälle und Lernfragen |
| `RB-023_Praxis-Runbook.md` | Zehn praxisorientierte Abschnitte für L1-Aufnahme, Erstdiagnose, Funktionszweige, Maßnahmen, L2-Eskalation und dokumentierten Funktionstest |
| `assets/rb023_henne_ei_dockingstation.png` | Eigene bunte Henne-und-Ei-Comic-Infografik zur Abhängigkeitskette und Fehleranalyse |
| `assets/rb023_diagnosebaum.svg` | Technischer Entscheidungsbaum als skalierbares Vektorbild mit alternativen Fehlerpfaden |
| `assets/rb023_diagnosebaum_preview.png` | Hochaufgelöste PNG-Vorschau des Diagramms |

## Verwendung und Veröffentlichung

- ZIP entpacken und Ordnerstruktur **inklusive assets** unverändert erhalten; Markdown verwendet relative Bildpfade.
- Beide Markdown-Dokumente sind inhaltlich getrennt: Lernartikel für Verständnis, Runbook für die Bearbeitung eines realen Tickets.
- Diagramm als SVG responsiv einbinden; für schmale Ansichten horizontales Scrollen vorsehen. PNG-Vorschau ist eine Alternative.
- In der Projektliste bleibt **Ticket 23 = Dockingstation funktioniert nicht (L1/L2)**. Ticket 22 ist der Monitorfehler, Ticket 24 der USB-Gerätefehler.
- Keine Änderungen an GitHub Pages oder am Repository sind Bestandteil dieses Archivs.
- Quellenlinks stammen aus der Recherche vom 22.11.2026 und sollten vor einer späteren Website-Veröffentlichung erneut auf Änderungen geprüft werden.

## Sicherheits- und Transparenzregeln

- **Alle dargestellten Musterfälle sind fiktiv**, nicht tatsächlich bearbeitete Incidents.
- Die PowerShell-Beispiele sind **lesend**, verändern weder Treiber noch Geräte-, Netzwerk- oder Sicherheitskonfigurationen.
- Ob eine Dockingstation korrekt funktioniert, wird **für jedes benötigte Merkmal separat** bestätigt: Laden, USB, Monitor, LAN und gegebenenfalls Audio.
- BIOS-/Firmware- und Treiberänderungen sowie Richtlinienänderungen gehören in einen genehmigten L2-/Endpoint-Prozess. Dock-Power-Cycle nur nach Modellhandbuch und nach Freigabe des Nutzers.
- Ein USB-C-Anschluss, ein leuchtendes Dock oder ein `Up`-Netzwerkadapter sind alleine **keine** ausreichenden End-to-End-Nachweise.
- Bildnachweis: **Eigene Konzeption, KI-gestützte Visualisierung mit ChatGPT.** Die Cartoon-Figuren und Symbole sind keine realen Gerätescreenshots.

## Wissenschaftlich orientierter Lern- und Prüfstandard

1. **Active Recall:** Kapitel 14 im Lernartikel ohne Nachschlagen lösen.
2. **Diagnosekompetenz:** Ein Fehlerbild bekommen, zuerst Hypothesen selbst formulieren; dann einen Test vorschlagen, der zwischen mindestens zwei Ursachen unterscheidet.
3. **Validierungsnachweis:** Für echte Labortests Zeit, Aufbau, Beobachtung, ausgeführten Test, Ergebnis und Schlussfolgerung protokollieren.
4. **Zeitversetzter Transfer:** Später ohne Runbook ein unbekanntes Dock-Fehlerbild eingrenzen und die Entscheidung in eigenen Worten begründen.

**Weiteres Ticket:** RB-024 – USB-Gerät, Maus oder Tastatur ausgefallen (L1).
